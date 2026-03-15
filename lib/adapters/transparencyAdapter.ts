import { getStateCodeFromMapName } from "@/lib/mockData";
import type { StateCode } from "@/types/state";
import type { ExternalStateSpending, StateSpending } from "@/types/publicSpending";

function toNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function resolveStateCode(input: ExternalStateSpending): StateCode | undefined {
  const candidate = (input.stateCode || input.sigla || "").toUpperCase();

  if (candidate.length === 2) {
    return candidate as StateCode;
  }

  if (input.stateName) {
    return getStateCodeFromMapName(input.stateName);
  }

  if (input.nome) {
    return getStateCodeFromMapName(input.nome);
  }

  return undefined;
}

export function mapExternalSpendingToInternalModel(
  payload: unknown,
): Record<StateCode, StateSpending> {
  const items = Array.isArray(payload) ? payload : [];
  const result = {} as Record<StateCode, StateSpending>;

  for (const rawItem of items) {
    const item = rawItem as ExternalStateSpending;
    const code = resolveStateCode(item);

    if (!code) {
      continue;
    }

    const nome = item.nome || item.stateName || code;
    const gastoAnual = toNumber(item.gastoAnual ?? item.annualSpending);
    const gastoMensal = toNumber(item.gastoMensal ?? item.monthlySpending);
    const gastoPorHabitante = toNumber(item.gastoPorHabitante ?? item.perCapitaSpending);

    const rawAreas = item.principaisAreas || item.areas || [];

    result[code] = {
      nome,
      sigla: code,
      gastoAnual,
      gastoMensal,
      gastoPorHabitante,
      principaisAreas: rawAreas
        .map((area) => {
          const areaRecord = area as Record<string, unknown>;

          return {
            nome: String(areaRecord.nome ?? areaRecord.name ?? "Outros"),
            percentual: toNumber(areaRecord.percentual ?? areaRecord.percentage),
          };
        })
        .filter((area) => area.percentual >= 0),
    };
  }

  return result;
}

export function mapExternalTotalSpendingToInternalModel(payload: unknown): number {
  if (typeof payload === "number") {
    return payload;
  }

  if (!payload || typeof payload !== "object") {
    return 0;
  }

  const record = payload as Record<string, unknown>;

  return toNumber(
    record.totalPublicSpending ??
      record.total_spending ??
      record.total ??
      record.valor,
    0,
  );
}
