import { mapDeputadoListItemToPolitician } from "@/lib/adapters/camaraDeputadosAdapter";
import { fetchDeputadosFromCamara } from "@/lib/services/camaraService";
import { getDeputadoExpensesSummary } from "@/lib/services/camaraExpensesService";
import { getLegislationItems } from "@/lib/services/legislationService";
import { getPoliticians } from "@/lib/services/politiciansService";
import type { DataFetchResult } from "@/types/dataSource";
import type { RankingEntry } from "@/types/ranking";

type RankingParams = {
  ano?: number;
  limit?: number;
  itensDeputados?: number;
};

function normalizeName(value: string): string {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

async function buildExpenseEntries(params: RankingParams = {}): Promise<RankingEntry[]> {
  const limitDeputados = params.itensDeputados ?? 40;

  const deputados = await fetchDeputadosFromCamara({ pagina: 1, itens: limitDeputados });
  const politicians = deputados.map((item) =>
    mapDeputadoListItemToPolitician(
      item as Parameters<typeof mapDeputadoListItemToPolitician>[0],
    ),
  );

  const entries: RankingEntry[] = [];

  for (const politician of politicians) {
    try {
      const summary = await getDeputadoExpensesSummary(politician.id, {
        ano: params.ano,
      });

      entries.push({
        deputadoId: politician.id,
        slug: politician.slug,
        foto: politician.foto,
        nome: politician.nome,
        partido: politician.partido,
        estado: politician.estado,
        totalGasto: summary.data.totalDespesas,
        dataSourceInfo: {
          sourceName: "Dados Abertos da Câmara dos Deputados",
          sourceType: "api",
          sourceUrl: `https://dadosabertos.camara.leg.br/api/v2/deputados/${politician.id}/despesas`,
          referencePeriod: params.ano ? String(params.ano) : undefined,
          lastUpdated: summary.lastUpdated,
        },
      });
    } catch {
      continue;
    }
  }

  return entries;
}

export async function getRankingByExpenses(
  params: RankingParams = {},
): Promise<DataFetchResult<RankingEntry[]>> {
  const limit = params.limit ?? 20;
  const entries = await buildExpenseEntries(params);
  const lastUpdated = new Date().toISOString();

  return {
    data: entries.sort((a, b) => b.totalGasto - a.totalGasto).slice(0, limit),
    source: "api",
    mode: "live",
    lastUpdated,
    dataSourceInfo: {
      sourceName: "Dados Abertos da Câmara dos Deputados",
      sourceType: "official_portal",
      sourceUrl: "https://dadosabertos.camara.leg.br/",
      referencePeriod: params.ano ? String(params.ano) : undefined,
      lastUpdated,
    },
  };
}

export async function getRankingByLowestExpenses(
  params: RankingParams = {},
): Promise<DataFetchResult<RankingEntry[]>> {
  const limit = params.limit ?? 20;
  const entries = await buildExpenseEntries(params);
  const lastUpdated = new Date().toISOString();

  return {
    data: entries.sort((a, b) => a.totalGasto - b.totalGasto).slice(0, limit),
    source: "api",
    mode: "live",
    lastUpdated,
    dataSourceInfo: {
      sourceName: "Dados Abertos da Câmara dos Deputados",
      sourceType: "official_portal",
      sourceUrl: "https://dadosabertos.camara.leg.br/",
      referencePeriod: params.ano ? String(params.ano) : undefined,
      lastUpdated,
    },
  };
}

export async function getRankingByPresence(
  params: RankingParams = {},
): Promise<DataFetchResult<RankingEntry[]>> {
  const limit = params.limit ?? 20;
  const politiciansResult = await getPoliticians({ itens: params.itensDeputados ?? 40, pagina: 1 });

  const sorted = [...politiciansResult.data]
    .filter((item) => item.presencaSessoes > 0)
    .sort((a, b) => b.presencaSessoes - a.presencaSessoes)
    .slice(0, limit)
    .map((item) => ({
      deputadoId: item.id,
      slug: item.slug,
      foto: item.foto,
      nome: item.nome,
      partido: item.partido,
      estado: item.estado,
      totalGasto: 0,
      dataSourceInfo: {
        sourceName: "Dados Abertos da Câmara dos Deputados",
        sourceType: "official_portal" as const,
        sourceUrl: "https://dadosabertos.camara.leg.br/",
        lastUpdated: item.lastUpdated,
      },
    }));

  return {
    data: sorted,
    source: "api",
    mode: "live",
    lastUpdated: new Date().toISOString(),
  };
}

export async function getRankingByProposals(
  params: RankingParams = {},
): Promise<DataFetchResult<RankingEntry[]>> {
  const limit = params.limit ?? 20;
  const [politiciansResult, legislationResult] = await Promise.all([
    getPoliticians({ itens: params.itensDeputados ?? 40, pagina: 1 }),
    getLegislationItems(),
  ]);

  const countByName = new Map<string, number>();

  legislationResult.data.forEach((item) => {
    const names = [
      ...(item.autores ?? []),
      ...(item.politicosEnvolvidos ?? []),
      item.politicos.autor,
      item.politicos.relator,
      ...item.politicos.apoiadores,
    ];

    names.forEach((name) => {
      const normalized = normalizeName(name);
      if (!normalized) {
        return;
      }

      const current = countByName.get(normalized) ?? 0;
      countByName.set(normalized, current + 1);
    });
  });

  const sorted = [...politiciansResult.data]
    .map((item) => ({
      item,
      proposals: countByName.get(normalizeName(item.nome)) ?? 0,
    }))
    .filter((entry) => entry.proposals > 0)
    .sort((a, b) => b.proposals - a.proposals)
    .slice(0, limit)
    .map((entry) => ({
      deputadoId: entry.item.id,
      slug: entry.item.slug,
      foto: entry.item.foto,
      nome: entry.item.nome,
      partido: entry.item.partido,
      estado: entry.item.estado,
      totalGasto: 0,
      dataSourceInfo: {
        sourceName: "Dados Abertos da Câmara dos Deputados",
        sourceType: "official_portal" as const,
        sourceUrl: "https://dadosabertos.camara.leg.br/",
        lastUpdated: entry.item.lastUpdated,
      },
    }));

  return {
    data: sorted,
    source: "api",
    mode: "live",
    lastUpdated: new Date().toISOString(),
  };
}
