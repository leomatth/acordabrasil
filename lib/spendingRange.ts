import type { StateCode } from "@/types/state";
import type { StateSpending } from "@/types/publicSpending";

export type SpendingRange = "all" | "high" | "medium" | "low";

export type SpendingBounds = {
  min: number;
  max: number;
};

export function classifySpendingRange(
  value: number,
  bounds: SpendingBounds,
): Exclude<SpendingRange, "all"> {
  const span = bounds.max - bounds.min;

  if (span <= 0) {
    return "medium";
  }

  const normalized = (value - bounds.min) / span;

  if (normalized >= 0.67) {
    return "high";
  }

  if (normalized >= 0.34) {
    return "medium";
  }

  return "low";
}

export function matchesSpendingRange(
  value: number,
  bounds: SpendingBounds,
  range: SpendingRange,
): boolean {
  if (range === "all") {
    return true;
  }

  return classifySpendingRange(value, bounds) === range;
}

export function getFirstStateByRange(
  range: SpendingRange,
  bounds: SpendingBounds,
  statesData: Record<StateCode, StateSpending>,
  defaultStateCode: StateCode = "SP",
): StateCode {
  if (range === "all") {
    return defaultStateCode;
  }

  const first = (Object.keys(statesData) as StateCode[]).find((stateCode) =>
    matchesSpendingRange(statesData[stateCode].gastoAnual, bounds, range),
  );

  return first ?? defaultStateCode;
}
