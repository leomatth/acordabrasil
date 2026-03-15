import {
  groupExpensesByCategory,
  mapCamaraExpensesResponse,
  normalizeExpenseCategory,
} from "@/lib/adapters/camaraExpensesAdapter";
import { fetchDeputadoExpensesFromCamara } from "@/lib/services/camaraService";
import { getDeputados } from "@/lib/services/politiciansService";
import { sumExpenseValues } from "@/lib/utils/sumExpenses";
import type { DataFetchResult } from "@/types/dataSource";
import type {
  DeputadoExpenseParams,
  ExpenseItem,
  ExpenseSummary,
  TopDeputadoExpense,
} from "@/types/expense";

const RECENT_ITEMS_LIMIT = 10;
const DEFAULT_ITEMS_PER_PAGE = 100;
const MAX_EXPENSE_PAGES = 20;

function normalizeCategoryForComparison(value: string): string {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isCategoryMatch(itemCategory: string, filterCategory: string): boolean {
  const normalizedFilter = normalizeCategoryForComparison(filterCategory);
  const normalizedItem = normalizeCategoryForComparison(itemCategory);

  if (!normalizedFilter || !normalizedItem) {
    return false;
  }

  if (
    normalizedItem === normalizedFilter
    || normalizedItem.includes(normalizedFilter)
    || normalizedFilter.includes(normalizedItem)
  ) {
    return true;
  }

  const filterTokens = normalizedFilter
    .split(" ")
    .filter((token) => token.length >= 4)
    .map((token) => token.slice(0, 6));

  const itemTokens = normalizedItem
    .split(" ")
    .filter((token) => token.length >= 4)
    .map((token) => token.slice(0, 6));

  return filterTokens.some((filterToken) =>
    itemTokens.some(
      (itemToken) => itemToken.startsWith(filterToken) || filterToken.startsWith(itemToken),
    ),
  );
}

function filterExpenses(expenses: ExpenseItem[], params: DeputadoExpenseParams = {}): ExpenseItem[] {
  return expenses.filter((item) => {
    if (params.ano && item.ano !== params.ano) {
      return false;
    }

    if (params.mes && item.mes !== params.mes) {
      return false;
    }

    if (params.categoria) {
      const normalizedFilterValue = normalizeExpenseCategory(params.categoria);

      if (!isCategoryMatch(item.tipoDespesa, normalizedFilterValue)) {
        return false;
      }
    }

    return true;
  });
}

async function fetchAllExpensesFromApi(
  deputadoId: number,
  params: DeputadoExpenseParams = {},
): Promise<ExpenseItem[]> {
  const itens = params.itensPorPagina ?? DEFAULT_ITEMS_PER_PAGE;

  if (params.pagina && params.pagina > 0) {
    const payload = await fetchDeputadoExpensesFromCamara(deputadoId, {
      ano: params.ano,
      mes: params.mes,
      pagina: params.pagina,
      itens,
    });

    return mapCamaraExpensesResponse(payload, deputadoId);
  }

  const allExpenses: ExpenseItem[] = [];

  for (let page = 1; page <= MAX_EXPENSE_PAGES; page += 1) {
    const payload = await fetchDeputadoExpensesFromCamara(deputadoId, {
      ano: params.ano,
      mes: params.mes,
      pagina: page,
      itens,
    });

    const mapped = mapCamaraExpensesResponse(payload, deputadoId);
    allExpenses.push(...mapped);

    if (mapped.length < itens) {
      break;
    }
  }

  return allExpenses;
}

export async function getDeputadoExpenses(
  deputadoId: number,
  params: DeputadoExpenseParams = {},
): Promise<DataFetchResult<ExpenseItem[]>> {
  try {
    const expenses = await fetchAllExpensesFromApi(deputadoId, params);
    const filtered = filterExpenses(expenses, params);
    const referencePeriod = params.ano
      ? String(params.ano)
      : filtered.length
        ? `${Math.min(...filtered.map((item) => item.ano))}-${Math.max(...filtered.map((item) => item.ano))}`
        : undefined;

    return {
      data: filtered,
      source: "api",
      mode: "live",
      lastUpdated: new Date().toISOString(),
      dataSourceInfo: {
        sourceName: "Dados Abertos da Câmara dos Deputados",
        sourceType: "api",
        sourceUrl: `https://dadosabertos.camara.leg.br/api/v2/deputados/${deputadoId}/despesas`,
        referencePeriod,
        lastUpdated: new Date().toISOString(),
      },
    };
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? `Não foi possível carregar despesas reais da Câmara: ${error.message}`
        : "Não foi possível carregar despesas reais da Câmara.",
    );
  }
}

export async function getDeputadoExpensesSummary(
  deputadoId: number,
  params: DeputadoExpenseParams = {},
): Promise<DataFetchResult<ExpenseSummary>> {
  const expensesResult = await getDeputadoExpenses(deputadoId, params);
  const expenses = expensesResult.data;
  const categoriasAgrupadas = groupExpensesByCategory(expenses);

  const totalDespesas = sumExpenseValues(expenses, (item) => item.valorDocumento);
  const totalLiquido = sumExpenseValues(expenses, (item) => item.valorLiquido);
  const totalGlosa = sumExpenseValues(expenses, (item) => item.valorGlosa ?? 0);

  const despesasRecentes = [...expenses]
    .sort((a, b) => new Date(b.dataDocumento).getTime() - new Date(a.dataDocumento).getTime())
    .slice(0, RECENT_ITEMS_LIMIT);

  const referencePeriod = params.ano
    ? String(params.ano)
    : expenses.length
      ? `${Math.min(...expenses.map((item) => item.ano))}-${Math.max(...expenses.map((item) => item.ano))}`
      : undefined;

  const dataSourceInfo = {
    sourceName: "Dados Abertos da Câmara dos Deputados",
    sourceType: "api" as const,
    sourceUrl: `https://dadosabertos.camara.leg.br/api/v2/deputados/${deputadoId}/despesas`,
    referencePeriod,
    lastUpdated: expensesResult.lastUpdated,
  };

  return {
    ...expensesResult,
    dataSourceInfo,
    data: {
      totalDespesas,
      totalLiquido,
      totalGlosa,
      quantidadeDespesas: expenses.length,
      maiorCategoria: categoriasAgrupadas[0]?.categoria,
      categoriasAgrupadas,
      despesasRecentes,
      source: expensesResult.source,
      lastUpdated: expensesResult.lastUpdated,
      dataSourceInfo,
    },
  };
}

export async function getTopDeputadosByExpenses(params?: {
  ano?: number;
  limit?: number;
  itensDeputados?: number;
}): Promise<DataFetchResult<TopDeputadoExpense[]>> {
  const limit = params?.limit ?? 10;
  const itensDeputados = params?.itensDeputados ?? 15;

  const deputadosResult = await getDeputados({ itens: itensDeputados, pagina: 1 });

  const rankingItems = await Promise.all(
    deputadosResult.data.slice(0, itensDeputados).map(async (deputado) => {
      const summary = await getDeputadoExpensesSummary(deputado.id, {
        ano: params?.ano,
      });

      return {
        deputadoId: deputado.id,
        nome: deputado.nome,
        partido: deputado.partido,
        estado: deputado.estado,
        totalDespesas: summary.data.totalDespesas,
        source: summary.source,
        lastUpdated: summary.lastUpdated,
        dataSourceInfo: summary.data.dataSourceInfo,
      } as TopDeputadoExpense;
    }),
  );

  const sorted = rankingItems.sort((a, b) => b.totalDespesas - a.totalDespesas).slice(0, limit);

  return {
    data: sorted,
    source: "api",
    mode: "live",
    lastUpdated: new Date().toISOString(),
    dataSourceInfo: {
      sourceName: "Dados Abertos da Câmara dos Deputados",
      sourceType: "api",
      sourceUrl: "https://dadosabertos.camara.leg.br/api/v2/deputados",
      referencePeriod: params?.ano ? String(params.ano) : undefined,
      lastUpdated: new Date().toISOString(),
    },
  };
}
