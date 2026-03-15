import { formatCurrency } from "@/lib/formatCurrency";
import type { PoliticianOffice } from "@/types/politician";

export type RankingType =
  | "more-expenses"
  | "less-expenses";

export type RankingDirection = "asc" | "desc";

export type RankingCandidate = {
  id: number;
  slug: string;
  nome: string;
  cargo: PoliticianOffice;
  partido: string;
  estado: string;
  foto: string;
  expensesTotal: number | null;
  expensesByPeriod?: Record<string, number | null>;
  presencePercent: number | null;
  propositionsCount: number | null;
};

export type RankedPolitician = RankingCandidate & {
  position: number;
  metricValue: number;
};

function sortByMetric(
  candidates: RankingCandidate[],
  selector: (candidate: RankingCandidate) => number | null,
  direction: RankingDirection,
): RankedPolitician[] {
  const withMetric = candidates
    .map((candidate) => ({
      candidate,
      metricValue: selector(candidate),
    }))
    .filter((item): item is { candidate: RankingCandidate; metricValue: number } =>
      item.metricValue !== null && Number.isFinite(item.metricValue),
    )
    .sort((a, b) =>
      direction === "desc" ? b.metricValue - a.metricValue : a.metricValue - b.metricValue,
    );

  return withMetric.map((item, index) => ({
    ...item.candidate,
    position: index + 1,
    metricValue: item.metricValue,
  }));
}

export function rankByExpenses(
  candidates: RankingCandidate[],
  direction: RankingDirection,
): RankedPolitician[] {
  return sortByMetric(candidates, (candidate) => candidate.expensesTotal, direction);
}

export function rankByPresence(
  candidates: RankingCandidate[],
  direction: RankingDirection,
): RankedPolitician[] {
  return sortByMetric(candidates, (candidate) => candidate.presencePercent, direction);
}

export function rankByPropositions(
  candidates: RankingCandidate[],
  direction: RankingDirection,
): RankedPolitician[] {
  return sortByMetric(candidates, (candidate) => candidate.propositionsCount, direction);
}

export function getRankingTypeConfig(type: RankingType): {
  title: string;
  metricLabel: string;
  formatMetric: (value: number) => string;
  direction: RankingDirection;
  source: "expenses";
} {
  switch (type) {
    case "more-expenses":
      return {
        title: "Mais gastos",
        metricLabel: "Total gasto",
        formatMetric: (value) => formatCurrency(value),
        direction: "desc",
        source: "expenses",
      };
    case "less-expenses":
      return {
        title: "Menos gastos",
        metricLabel: "Total gasto",
        formatMetric: (value) => formatCurrency(value),
        direction: "asc",
        source: "expenses",
      };
    default:
      return {
        title: "Mais gastos",
        metricLabel: "Total gasto",
        formatMetric: (value) => formatCurrency(value),
        direction: "desc",
        source: "expenses",
      };
  }
}
