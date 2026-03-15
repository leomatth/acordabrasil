import {
  mapDeputadoDetailToPolitician,
  mapDeputadoListItemToPolitician,
} from "@/lib/adapters/camaraDeputadosAdapter";
import { getDataMode } from "@/lib/config/dataSource";
import {
  fetchAllDeputadosFromCamara,
  fetchDeputadoDetailFromCamara,
  fetchDeputadosFromCamara,
} from "@/lib/services/camaraService";
import { POLITICAL_PROVIDERS } from "@/lib/services/politicalProviders";
import { fetchWithFallback } from "@/lib/utils/fetchWithFallback";
import { logger } from "@/lib/utils/logger";
import { extractPoliticianIdFromSlug } from "@/lib/utils/politicianSlug";
import { buildPartyOptions } from "@/lib/utils/partyNormalization";
import type { DataFetchResult, DataMode, DataSourceInfo } from "@/types/dataSource";
import type {
  DeputadoFilters,
  PoliticalOfficeCoverage,
  PoliticianOffice,
  PoliticianProfile,
} from "@/types/politician";

function resolvePoliticiansDataMode(mode: DataMode): DataMode {
  return mode === "mock" ? "hybrid" : mode;
}

async function fetchDeputadosApi(filters: DeputadoFilters = {}): Promise<PoliticianProfile[]> {
  const hasExplicitFilters = Boolean(filters.partido || filters.estado || filters.pagina || filters.itens);

  const data = hasExplicitFilters
    ? await fetchDeputadosFromCamara(filters)
    : await fetchAllDeputadosFromCamara();

  if (!hasExplicitFilters && data.length === 0) {
    const firstPage = await fetchDeputadosFromCamara({ pagina: 1, itens: 24 });
    return firstPage.map((item) =>
      mapDeputadoListItemToPolitician(item as Parameters<typeof mapDeputadoListItemToPolitician>[0]),
    );
  }

  return data.map((item) =>
    mapDeputadoListItemToPolitician(item as Parameters<typeof mapDeputadoListItemToPolitician>[0]),
  );
}

async function fetchDeputadosApiWithInitialFallback(filters: DeputadoFilters = {}) {
  try {
    return await fetchDeputadosApi(filters);
  } catch (error) {
    const hasExplicitFilters = Boolean(filters.partido || filters.estado || filters.pagina || filters.itens);

    if (hasExplicitFilters) {
      throw error;
    }

    logger.warn("Falha na varredura completa de deputados. Aplicando fallback para primeira página.", {
      error,
    });

    const firstPage = await fetchDeputadosFromCamara({ pagina: 1, itens: 24 });

    return firstPage.map((item) =>
      mapDeputadoListItemToPolitician(item as Parameters<typeof mapDeputadoListItemToPolitician>[0]),
    );
  }
}

export async function getDeputados(
  filters: DeputadoFilters = {},
): Promise<DataFetchResult<PoliticianProfile[]>> {
  const mode = resolvePoliticiansDataMode(getDataMode());

  return fetchWithFallback({
    resourceName: "lista de deputados federais",
    mode,
    fetcher: () => fetchDeputadosApiWithInitialFallback(filters),
    fallbackData: [],
    liveFailureStrategy: "error",
  });
}

export async function getDeputadoById(
  id: number,
): Promise<DataFetchResult<PoliticianProfile | null>> {
  const mode = resolvePoliticiansDataMode(getDataMode());

  return fetchWithFallback({
    resourceName: `detalhe do deputado ${id}`,
    mode,
    fetcher: async () => {
      const payload = await fetchDeputadoDetailFromCamara(id);
      const mappedDetail = mapDeputadoDetailToPolitician(
        payload as Parameters<typeof mapDeputadoDetailToPolitician>[0],
      );

      if (mappedDetail) {
        return mappedDetail;
      }

      const allDeputados = await fetchAllDeputadosFromCamara();
      const found = allDeputados.find((item) => Number((item as { id?: unknown }).id) === id);

      return found
        ? mapDeputadoListItemToPolitician(
            found as Parameters<typeof mapDeputadoListItemToPolitician>[0],
          )
        : null;
    },
    fallbackData: null,
    liveFailureStrategy: "error",
  });
}

function mergeCoverageByOffice(): PoliticalOfficeCoverage[] {
  const byOffice = new Map<PoliticianOffice, PoliticalOfficeCoverage>();

  POLITICAL_PROVIDERS.forEach((provider) => {
    provider.coverage.forEach((item) => {
      if (!byOffice.has(item.cargo)) {
        byOffice.set(item.cargo, item);
        return;
      }

      const current = byOffice.get(item.cargo);
      const score = (status: PoliticalOfficeCoverage["status"]) =>
        status === "real" ? 3 : status === "partial" ? 2 : 1;

      if (current && score(item.status) > score(current.status)) {
        byOffice.set(item.cargo, item);
      }
    });
  });

  return Array.from(byOffice.values());
}

function resolveGlobalSourceInfo(lastUpdated: string): DataSourceInfo {
  return {
    sourceName: "Fontes oficiais públicas por cargo",
    sourceType: "official_portal",
    sourceUrl: "https://dadosabertos.camara.leg.br/",
    referencePeriod: "Mandatos em exercício",
    lastUpdated,
  };
}

export async function getPoliticalOfficeCoverage(): Promise<PoliticalOfficeCoverage[]> {
  return mergeCoverageByOffice();
}

export async function getPoliticians(
  filters: DeputadoFilters = {},
): Promise<DataFetchResult<PoliticianProfile[]>> {
  const mode = resolvePoliticiansDataMode(getDataMode());

  const providerResults = await Promise.allSettled(POLITICAL_PROVIDERS.map((provider) => provider.list()));

  const politicians: PoliticianProfile[] = [];
  const errors: string[] = [];

  providerResults.forEach((result, index) => {
    if (result.status === "fulfilled") {
      politicians.push(...result.value.data);
      return;
    }

    errors.push(`Falha no provedor ${POLITICAL_PROVIDERS[index].key}`);
  });

  let filtered = politicians;

  if (filters.partido) {
    filtered = filtered.filter((item) => item.partido === filters.partido);
  }

  if (filters.estado) {
    filtered = filtered.filter((item) => item.estado === filters.estado);
  }

  if (filters.pagina && filters.itens) {
    const start = (filters.pagina - 1) * filters.itens;
    filtered = filtered.slice(start, start + filters.itens);
  }

  const lastUpdated = new Date().toISOString();

  return {
    data: filtered,
    source: "api",
    mode,
    lastUpdated,
    dataSourceInfo: resolveGlobalSourceInfo(lastUpdated),
    errorMessage: errors.length ? errors.join(" | ") : undefined,
  };
}

export async function getPoliticianBySlug(
  slug: string,
): Promise<DataFetchResult<PoliticianProfile | null>> {
  const politicianId = extractPoliticianIdFromSlug(slug);
  const mode = resolvePoliticiansDataMode(getDataMode());

  if (!politicianId) {
    return {
      data: null,
      source: "api",
      mode,
      lastUpdated: new Date().toISOString(),
      errorMessage: "Slug de político inválido.",
    };
  }

  const listResult = await getPoliticians();
  const found = listResult.data.find((item) => item.id === politicianId) ?? null;

  return {
    ...listResult,
    data: found,
  };
}

export async function getPoliticianFilters(): Promise<
  DataFetchResult<{
    cargos: string[];
    partidos: string[];
    estados: string[];
  }>
> {
  const listResult = await getPoliticians();
  const politicians = listResult.data;

  const cargos = Array.from(new Set(politicians.map((item) => item.cargo))).sort((a, b) =>
    a.localeCompare(b),
  );
  const partidos = buildPartyOptions(politicians);
  const estados = Array.from(new Set(politicians.map((item) => item.estado))).sort((a, b) =>
    a.localeCompare(b),
  );

  return {
    ...listResult,
    data: {
      cargos,
      partidos,
      estados,
    },
  };
}
