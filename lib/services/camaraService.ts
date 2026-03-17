import { getCamaraApiBaseUrl } from "@/lib/config/dataSource";
import type { DeputadoFilters } from "@/types/politician";
import type { ProposicaoFilters } from "@/types/legislation";

const CAMARA_REVALIDATE_SECONDS = 60 * 10;

type CamaraEnvelope<T> = {
  dados: T;
};

function buildCamaraUrl(path: string, query?: Record<string, string | number | undefined>) {
  const base = getCamaraApiBaseUrl().replace(/\/$/, "");
  const url = new URL(`${base}${path}`);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === "") {
        continue;
      }

      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}

async function fetchCamara<T>(path: string, query?: Record<string, string | number | undefined>) {
  const response = await fetch(buildCamaraUrl(path, query), {
    headers: {
      accept: "application/json",
    },
    next: {
      revalidate: CAMARA_REVALIDATE_SECONDS,
    },
  });

  if (!response.ok) {
    throw new Error(`Falha na API da Câmara (${response.status}) em ${path}.`);
  }

  return (await response.json()) as CamaraEnvelope<T>;
}

export async function fetchDeputadosFromCamara(filters: DeputadoFilters = {}) {
  const payload = await fetchCamara<Array<Record<string, unknown>>>("/deputados", {
    siglaPartido: filters.partido,
    siglaUf: filters.estado,
    pagina: filters.pagina,
    itens: filters.itens ?? 100,
    ordenarPor: "nome",
    ordem: "ASC",
  });

  return payload.dados;
}

export async function fetchAllDeputadosFromCamara(
  filters: Omit<DeputadoFilters, "pagina" | "itens"> = {},
) {
  const itensPorPagina = 100;
  const combined: Array<Record<string, unknown>> = [];
  const maxPages = 20;

  for (let page = 1; page <= maxPages; page += 1) {
    const currentPage = await fetchDeputadosFromCamara({
      ...filters,
      pagina: page,
      itens: itensPorPagina,
    });

    combined.push(...currentPage);

    if (currentPage.length < itensPorPagina) {
      break;
    }
  }

  const byId = new Map<number, Record<string, unknown>>();
  combined.forEach((item) => {
    const id = Number((item as { id?: unknown }).id);
    if (Number.isFinite(id) && id > 0) {
      byId.set(id, item);
    }
  });

  return Array.from(byId.values());
}

export async function fetchDeputadoDetailFromCamara(id: number) {
  const payload = await fetchCamara<Record<string, unknown>>(`/deputados/${id}`);
  return payload;
}

export async function fetchDeputadoExpensesFromCamara(
  id: number,
  params: {
    ano?: number;
    mes?: number;
    pagina?: number;
    itens?: number;
  } = {},
) {
  const payload = await fetchCamara<Array<Record<string, unknown>>>(
    `/deputados/${id}/despesas`,
    {
      ano: params.ano,
      mes: params.mes,
      pagina: params.pagina,
      itens: params.itens ?? 50,
      ordenarPor: "dataDocumento",
      ordem: "DESC",
    },
  );

  return payload.dados;
}

export async function fetchProposicoesFromCamara(filters: ProposicaoFilters = {}) {
  const payload = await fetchCamara<Array<Record<string, unknown>>>("/proposicoes", {
    siglaTipo: filters.siglaTipo,
    ano: filters.ano,
    pagina: filters.pagina,
    itens: filters.itens ?? 50,
    ordenarPor: "id",
    ordem: "DESC",
  });

  return payload.dados;
}

export async function fetchDeputadoProposicoesFromCamara(
  deputadoId: number,
  params: {
    ano?: number;
    pagina?: number;
    itens?: number;
  } = {},
) {
  const payload = await fetchCamara<Array<Record<string, unknown>>>("/proposicoes", {
    idDeputadoAutor: deputadoId,
    ano: params.ano,
    pagina: params.pagina,
    itens: params.itens ?? 50,
    ordenarPor: "id",
    ordem: "DESC",
  });

  return payload.dados;
}

export async function fetchProposicaoByIdFromCamara(id: number) {
  const payload = await fetchCamara<Record<string, unknown>>(`/proposicoes/${id}`);
  return payload;
}

// Estrutura preparada para próxima etapa de votos por proposição.
export async function getVotacoesByProposicao(id: number) {
  const payload = await fetchCamara<Array<Record<string, unknown>>>(
    `/proposicoes/${id}/votacoes`,
  );

  return payload.dados;
}

export async function getVotosByVotacao(votacaoId: string) {
  const payload = await fetchCamara<Array<Record<string, unknown>>>(
    `/votacoes/${encodeURIComponent(votacaoId)}/votos`,
  );

  return payload.dados;
}

export async function fetchVotacoesFromCamara(params: {
  pagina?: number;
  itens?: number;
  dataInicio?: string;
  dataFim?: string;
} = {}) {
  const payload = await fetchCamara<Array<Record<string, unknown>>>("/votacoes", {
    pagina: params.pagina,
    itens: params.itens ?? 20,
    dataInicio: params.dataInicio,
    dataFim: params.dataFim,
    ordenarPor: "dataHoraRegistro",
    ordem: "DESC",
  });

  return payload.dados;
}
