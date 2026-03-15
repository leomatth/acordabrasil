import {
  brazilStatesData,
  mainCounters,
} from "@/lib/mockData";
import {
  mapExternalSpendingToInternalModel,
  mapExternalTotalSpendingToInternalModel,
} from "@/lib/adapters/transparencyAdapter";
import {
  getDataMode,
  getTransparencyApiUrl,
  hasTransparencyApiConfigured,
} from "@/lib/config/dataSource";
import { fetchWithFallback } from "@/lib/utils/fetchWithFallback";
import type { DataFetchResult } from "@/types/dataSource";
import type { PublicSpendingOverview, StateSpending } from "@/types/publicSpending";
import type { StateCode } from "@/types/state";

const SPENDING_REVALIDATE_SECONDS = 60 * 15;

function toNumber(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

async function fetchExternalSpendingOverviewDetails(): Promise<
  Pick<PublicSpendingOverview, "spendingToday" | "spendingMonth" | "spendingPerCitizen">
> {
  if (!hasTransparencyApiConfigured()) {
    throw new Error("NEXT_PUBLIC_TRANSPARENCY_API_URL não configurada.");
  }

  const response = await fetch(`${getTransparencyApiUrl()}/spending/overview`, {
    next: { revalidate: SPENDING_REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`Falha na API de resumo de gastos (${response.status}).`);
  }

  const payload = await response.json();

  if (!payload || typeof payload !== "object") {
    throw new Error("Resposta da API sem resumo de gastos válido.");
  }

  const record = payload as Record<string, unknown>;

  const spendingToday = toNumber(record.spendingToday ?? record.todaySpending ?? record.hoje);
  const spendingMonth = toNumber(record.spendingMonth ?? record.monthSpending ?? record.mes);
  const spendingPerCitizen = toNumber(
    record.spendingPerCitizen ?? record.perCitizenSpending ?? record.porCidadao,
  );

  if (spendingToday <= 0 || spendingMonth <= 0 || spendingPerCitizen <= 0) {
    throw new Error("Resposta da API sem métricas completas de gastos.");
  }

  return {
    spendingToday,
    spendingMonth,
    spendingPerCitizen,
  };
}

// Estratégia de migração gradual das fontes públicas:
// 1) Gastos públicos
// 2) Impostos / arrecadação
// 3) PECs e projetos de lei
// 4) Eleições e pesquisas
// 5) Políticos

function getMockStatesSpending(): Record<StateCode, StateSpending> {
  return brazilStatesData;
}

async function fetchExternalStatesSpending(): Promise<Record<StateCode, StateSpending>> {
  if (!hasTransparencyApiConfigured()) {
    throw new Error("NEXT_PUBLIC_TRANSPARENCY_API_URL não configurada.");
  }

  const response = await fetch(`${getTransparencyApiUrl()}/spending/states`, {
    next: { revalidate: SPENDING_REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`Falha na API de gastos por estado (${response.status}).`);
  }

  const payload = await response.json();
  const mapped = mapExternalSpendingToInternalModel(payload);

  if (!Object.keys(mapped).length) {
    throw new Error("Resposta da API sem dados de estados válidos.");
  }

  return mapped;
}

async function fetchExternalBrazilTotalSpending(): Promise<number> {
  if (!hasTransparencyApiConfigured()) {
    throw new Error("NEXT_PUBLIC_TRANSPARENCY_API_URL não configurada.");
  }

  const response = await fetch(`${getTransparencyApiUrl()}/spending/total`, {
    next: { revalidate: SPENDING_REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`Falha na API de gasto total (${response.status}).`);
  }

  const payload = await response.json();
  const mapped = mapExternalTotalSpendingToInternalModel(payload);

  if (!mapped || mapped <= 0) {
    throw new Error("Resposta da API sem total válido.");
  }

  return mapped;
}

export async function getAllStatesSpending(): Promise<
  DataFetchResult<Record<StateCode, StateSpending>>
> {
  return fetchWithFallback({
    resourceName: "gastos por estado",
    mode: getDataMode(),
    fetcher: fetchExternalStatesSpending,
    fallbackData: getMockStatesSpending(),
  });
}

export async function getStateSpending(
  stateCode: StateCode,
): Promise<DataFetchResult<StateSpending>> {
  const allStatesResult = await getAllStatesSpending();

  return {
    ...allStatesResult,
    data: allStatesResult.data[stateCode],
  };
}

export async function getBrazilTotalSpending(): Promise<DataFetchResult<number>> {
  return fetchWithFallback({
    resourceName: "gasto público total",
    mode: getDataMode(),
    fetcher: fetchExternalBrazilTotalSpending,
    fallbackData: mainCounters.totalPublicSpending,
  });
}

export async function getPublicSpendingOverview(): Promise<
  DataFetchResult<PublicSpendingOverview>
> {
  const [totalResult, overviewDetailsResult] = await Promise.all([
    getBrazilTotalSpending(),
    fetchWithFallback({
      resourceName: "resumo de gastos públicos",
      mode: getDataMode(),
      fetcher: fetchExternalSpendingOverviewDetails,
      fallbackData: {
        spendingToday: mainCounters.spendingToday,
        spendingMonth: mainCounters.spendingMonth,
        spendingPerCitizen: mainCounters.spendingPerCitizen,
      },
    }),
  ]);

  const hasApiData = totalResult.source === "api" || overviewDetailsResult.source === "api";
  const errorMessage = totalResult.errorMessage ?? overviewDetailsResult.errorMessage;
  const lastUpdated =
    totalResult.source === "api" ? totalResult.lastUpdated : overviewDetailsResult.lastUpdated;

  return {
    source: hasApiData ? "api" : "mock",
    mode: totalResult.mode,
    lastUpdated,
    errorMessage,
    data: {
      totalPublicSpending: totalResult.data,
      spendingToday: overviewDetailsResult.data.spendingToday,
      spendingMonth: overviewDetailsResult.data.spendingMonth,
      spendingPerCitizen: overviewDetailsResult.data.spendingPerCitizen,
    },
  };
}
