import { taxGuideMock, taxSummaryMock } from "@/lib/mockData";
import { mainCounters } from "@/lib/mockData";
import {
  getDataMode,
  getTransparencyApiUrl,
  hasTransparencyApiConfigured,
} from "@/lib/config/dataSource";
import { fetchWithFallback } from "@/lib/utils/fetchWithFallback";
import type { DataFetchResult } from "@/types/dataSource";
import type { TaxItem, TaxRealtimeMetrics, TaxSummary } from "@/types/tax";

// Estratégia de migração gradual: etapa 2 (impostos e arrecadação).
const TAX_REVALIDATE_SECONDS = 60 * 30;
const TAX_REALTIME_REVALIDATE_SECONDS = 60;
const SECONDS_IN_DAY = 24 * 60 * 60;

function toNumber(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function parseMoneyLikeValue(input: string): number {
  if (!input) {
    return 0;
  }

  const normalized = normalizeText(input).replace(/\s+/g, " ").trim();
  const numericTokenMatch = normalized.match(/-?\d{1,3}(?:\.\d{3})*(?:,\d+)?|-?\d+(?:[\.,]\d+)?/);

  if (!numericTokenMatch) {
    return 0;
  }

  const numericToken = numericTokenMatch[0]
    .replace(/\.(?=\d{3}(\D|$))/g, "")
    .replace(",", ".");

  const baseValue = Number(numericToken);

  if (!Number.isFinite(baseValue)) {
    return 0;
  }

  const hasTri = /tri(?:lh(?:ao|oes|ão|ões))?/.test(normalized);
  const hasBi = /bi(?:lh(?:ao|oes|ão|ões))?/.test(normalized);
  const hasMi = /mi(?:lh(?:ao|oes|ão|ões))?/.test(normalized);
  const hasMil = /\bmil\b/.test(normalized);

  if (hasTri) {
    return baseValue * 1_000_000_000_000;
  }

  if (hasBi) {
    return baseValue * 1_000_000_000;
  }

  if (hasMi) {
    return baseValue * 1_000_000;
  }

  if (hasMil) {
    return baseValue * 1_000;
  }

  return baseValue;
}

function isTodayTaxSummary(item: TaxSummary): boolean {
  const joinedText = normalizeText(`${item.titulo} ${item.descricao}`);

  const mentionsTaxes =
    joinedText.includes("impost") ||
    joinedText.includes("tribut") ||
    joinedText.includes("arrecad");

  const mentionsCurrentDay =
    joinedText.includes("hoje") ||
    joinedText.includes("dia") ||
    joinedText.includes("diar");

  return mentionsTaxes && mentionsCurrentDay;
}

function deriveTaxesCollectedTodayFromSummary(summary: TaxSummary[]): number {
  for (const item of summary) {
    if (!isTodayTaxSummary(item)) {
      continue;
    }

    const parsed = parseMoneyLikeValue(item.valor);

    if (parsed > 0) {
      return parsed;
    }
  }

  return 0;
}

function mapSummaryItem(payload: Record<string, unknown>): TaxSummary | null {
  const titulo = String(payload.titulo ?? payload.title ?? "");
  const valor = String(payload.valor ?? payload.value ?? "");
  const descricao = String(payload.descricao ?? payload.description ?? "");

  if (!titulo || !valor || !descricao) {
    return null;
  }

  return {
    titulo,
    valor,
    descricao,
  };
}

function mapGuideItem(payload: Record<string, unknown>): TaxItem | null {
  const nome = String(payload.nome ?? payload.name ?? "");
  const sigla = String(payload.sigla ?? payload.acronym ?? "");
  const categoria = String(payload.categoria ?? payload.category ?? "");
  const descricao = String(payload.descricao ?? payload.description ?? "");
  const incidencia = String(payload.incidencia ?? payload.incidence ?? "");
  const aliquota = String(payload.aliquota ?? payload.taxRate ?? "");
  const exemplo = String(payload.exemplo ?? payload.example ?? "");

  if (
    !nome ||
    !sigla ||
    !descricao ||
    !incidencia ||
    !aliquota ||
    !exemplo ||
    (categoria !== "Federal" && categoria !== "Estadual" && categoria !== "Municipal")
  ) {
    return null;
  }

  return {
    nome,
    sigla,
    categoria,
    descricao,
    incidencia,
    aliquota,
    exemplo,
  };
}

async function fetchExternalTaxSummary(): Promise<TaxSummary[]> {
  if (!hasTransparencyApiConfigured()) {
    throw new Error("NEXT_PUBLIC_TRANSPARENCY_API_URL não configurada.");
  }

  const response = await fetch(`${getTransparencyApiUrl()}/taxes/summary`, {
    next: { revalidate: TAX_REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`Falha na API de resumo de impostos (${response.status}).`);
  }

  const payload = await response.json();
  const items = Array.isArray(payload) ? payload : [];
  const mapped = items
    .map((item) => mapSummaryItem(item as Record<string, unknown>))
    .filter((item): item is TaxSummary => Boolean(item));

  if (!mapped.length) {
    throw new Error("Resposta da API sem resumo de impostos válido.");
  }

  return mapped;
}

async function fetchExternalTaxGuide(): Promise<TaxItem[]> {
  if (!hasTransparencyApiConfigured()) {
    throw new Error("NEXT_PUBLIC_TRANSPARENCY_API_URL não configurada.");
  }

  const response = await fetch(`${getTransparencyApiUrl()}/taxes/guide`, {
    next: { revalidate: TAX_REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`Falha na API de guia de impostos (${response.status}).`);
  }

  const payload = await response.json();
  const items = Array.isArray(payload) ? payload : [];
  const mapped = items
    .map((item) => mapGuideItem(item as Record<string, unknown>))
    .filter((item): item is TaxItem => Boolean(item));

  if (!mapped.length) {
    throw new Error("Resposta da API sem guia de impostos válido.");
  }

  return mapped;
}

function mapRealtimeTaxesPayload(payload: unknown): TaxRealtimeMetrics | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const record = payload as Record<string, unknown>;

  const mappedRate = toNumber(
    record.taxesPerSecond ??
      record.ratePerSecond ??
      record.perSecond ??
      record.currentRate,
  );

  const mappedToday = toNumber(
    record.taxesCollectedToday ??
      record.todayCollected ??
      record.dailyCollected ??
      record.arrecadadoHoje,
  );

  const ratePerSecond = mappedRate > 0 ? mappedRate : mappedToday / SECONDS_IN_DAY;
  const taxesCollectedToday = mappedToday > 0 ? mappedToday : ratePerSecond * SECONDS_IN_DAY;

  if (ratePerSecond <= 0 || taxesCollectedToday <= 0) {
    return null;
  }

  return {
    ratePerSecond,
    taxesCollectedToday,
  };
}

async function fetchExternalTaxRealtimeMetrics(): Promise<TaxRealtimeMetrics> {
  if (!hasTransparencyApiConfigured()) {
    throw new Error("NEXT_PUBLIC_TRANSPARENCY_API_URL não configurada.");
  }

  try {
    const realtimeResponse = await fetch(`${getTransparencyApiUrl()}/taxes/realtime`, {
      next: { revalidate: TAX_REALTIME_REVALIDATE_SECONDS },
    });

    if (realtimeResponse.ok) {
      const realtimePayload = await realtimeResponse.json();
      const mappedRealtime = mapRealtimeTaxesPayload(realtimePayload);

      if (mappedRealtime) {
        return mappedRealtime;
      }
    }
  } catch (error) {
    void error;
  }

  const summary = await fetchExternalTaxSummary();
  const taxesCollectedToday = deriveTaxesCollectedTodayFromSummary(summary);

  if (taxesCollectedToday <= 0) {
    throw new Error("Resposta da API sem métrica diária de impostos para cálculo em tempo real.");
  }

  return {
    taxesCollectedToday,
    ratePerSecond: taxesCollectedToday / SECONDS_IN_DAY,
  };
}

export async function getTaxRealtimeMetricsApiOnly(): Promise<TaxRealtimeMetrics> {
  return fetchExternalTaxRealtimeMetrics();
}

export async function getTaxSummary(): Promise<DataFetchResult<TaxSummary[]>> {
  return fetchWithFallback({
    resourceName: "resumo de impostos",
    mode: getDataMode(),
    fetcher: fetchExternalTaxSummary,
    fallbackData: taxSummaryMock,
  });
}

export async function getTaxGuide(): Promise<DataFetchResult<TaxItem[]>> {
  return fetchWithFallback({
    resourceName: "guia de impostos",
    mode: getDataMode(),
    fetcher: fetchExternalTaxGuide,
    fallbackData: taxGuideMock,
  });
}

export async function getTaxRealtimeMetrics(): Promise<DataFetchResult<TaxRealtimeMetrics>> {
  const fallbackToday = mainCounters.taxesCollectedToday;

  return fetchWithFallback({
    resourceName: "métricas de impostos em tempo real",
    mode: getDataMode(),
    fetcher: fetchExternalTaxRealtimeMetrics,
    fallbackData: {
      taxesCollectedToday: fallbackToday,
      ratePerSecond: fallbackToday / SECONDS_IN_DAY,
    },
  });
}
