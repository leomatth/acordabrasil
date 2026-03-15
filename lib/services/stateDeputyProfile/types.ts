import type { DataFetchResult } from "@/types/dataSource";
import type { ExpenseItem, ExpenseSummary } from "@/types/expense";
import type { PresenceInsight, PoliticianProfile } from "@/types/politician";

export type StateDeputyProfileFilters = {
  ano?: number;
  mes?: number;
  categoria?: string;
};

export type StateDeputyProfileProvider = {
  key: string;
  stateCode: string;
  enrichProfileByExternalId: (externalId: string) => Promise<Partial<PoliticianProfile>>;
  getExpensesByExternalId: (
    externalId: string,
    filters?: StateDeputyProfileFilters,
  ) => Promise<{
    summaryResult: DataFetchResult<ExpenseSummary>;
    itemsResult: DataFetchResult<ExpenseItem[]>;
  }>;
  getPresenceByScopedId: (stateDeputyScopedId: number) => Promise<DataFetchResult<PresenceInsight>>;
};
