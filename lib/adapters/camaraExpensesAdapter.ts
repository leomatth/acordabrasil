import { groupExpensesByCategory as groupExpensesByCategoryUtil } from "@/lib/utils/groupExpensesByCategory";
import type { ExpenseCategoryGroup, ExpenseItem } from "@/types/expense";

type CamaraExpenseRaw = Record<string, unknown>;

function toNumber(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toDateString(value: unknown): string {
  const raw = String(value ?? "").trim();

  if (!raw) {
    return new Date().toISOString();
  }

  const normalized = raw.length === 10 ? `${raw}T00:00:00` : raw;
  const date = new Date(normalized);

  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString();
  }

  return date.toISOString();
}

export function normalizeExpenseCategory(value: unknown): string {
  const normalized = String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();

  return normalized || "Outras despesas";
}

export function mapCamaraExpenseToInternalModel(
  raw: CamaraExpenseRaw,
  deputadoId: number,
): ExpenseItem {
  const now = new Date().toISOString();
  const ano = toNumber(raw.ano || new Date().getFullYear());
  const mes = toNumber(raw.mes || 1);
  const codDocumento = String(raw.codDocumento ?? raw.id ?? "").trim();

  return {
    id: codDocumento || `${deputadoId}-${ano}-${mes}-${Math.random().toString(36).slice(2, 10)}`,
    deputadoId,
    nomeDeputado: String(raw.nomeParlamentar ?? raw.nomeDeputado ?? "Deputado"),
    partido: String(raw.siglaPartido ?? raw.partido ?? "-"),
    estado: String(raw.siglaUF ?? raw.siglaUf ?? raw.estado ?? "-"),
    fornecedor: String(raw.nomeFornecedor ?? "Fornecedor não informado"),
    cnpjCpfFornecedor: String(raw.cnpjCpfFornecedor ?? "").trim() || undefined,
    tipoDespesa: normalizeExpenseCategory(raw.tipoDespesa),
    valorDocumento: toNumber(raw.valorDocumento),
    valorLiquido: toNumber(raw.valorLiquido ?? raw.valorDocumento),
    valorGlosa: toNumber(raw.valorGlosa),
    dataDocumento: toDateString(raw.dataDocumento),
    urlDocumento: String(raw.urlDocumento ?? "").trim() || undefined,
    ano,
    mes,
    source: "api",
    lastUpdated: now,
    dataSourceInfo: {
      sourceName: "Dados Abertos da Câmara dos Deputados",
      sourceType: "api",
      sourceUrl: `https://dadosabertos.camara.leg.br/api/v2/deputados/${deputadoId}/despesas`,
      lastUpdated: now,
    },
  };
}

export function mapCamaraExpensesResponse(
  payload: unknown,
  deputadoId: number,
): ExpenseItem[] {
  const items = Array.isArray(payload) ? payload : [];

  return items
    .map((item) => mapCamaraExpenseToInternalModel(item as CamaraExpenseRaw, deputadoId))
    .filter((item) => item.deputadoId > 0);
}

export function groupExpensesByCategory(expenses: ExpenseItem[]): ExpenseCategoryGroup[] {
  return groupExpensesByCategoryUtil(expenses);
}
