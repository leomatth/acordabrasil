import {
  getDeputadoExpenses,
  getDeputadoExpensesSummary,
} from "@/lib/services/camaraExpensesService";
import { getFederalDeputyRelatedLegislation } from "@/lib/services/federalDeputyLegislationService";
import { getFederalDeputyPresenceInsight } from "@/lib/services/federalDeputyPresenceService";
import { getFederalDeputyStaff } from "@/lib/services/federalDeputyStaffService";
import { getFederalDeputyVotingHistory } from "@/lib/services/federalDeputyVotesService";
import type { PoliticianProfileFilters } from "@/lib/services/politicianProfileSectionsService";
import type { DataFetchResult } from "@/types/dataSource";
import type { ExpenseItem, ExpenseSummary } from "@/types/expense";
import type { LegislationItem } from "@/types/legislation";
import type { PresenceInsight, PoliticianProfile, StaffMember, VotingRecord } from "@/types/politician";

export type FederalDeputyProfileSectionsResult = {
  expensesSummaryResult: DataFetchResult<ExpenseSummary> | null;
  expensesResult: DataFetchResult<ExpenseItem[]> | null;
  expensesErrorMessage: string | null;
  legislationItemsResult: DataFetchResult<LegislationItem[]> | null;
  legislationIntegrationMessage: string | null;
  presenceResult: DataFetchResult<PresenceInsight> | null;
  votingHistoryResult: DataFetchResult<VotingRecord[]> | null;
  staffResult: DataFetchResult<StaffMember[]> | null;
};

export async function loadFederalDeputyProfileSections(
  politician: PoliticianProfile,
  filters: PoliticianProfileFilters,
): Promise<FederalDeputyProfileSectionsResult> {
  let expensesSummaryResult: DataFetchResult<ExpenseSummary> | null = null;
  let expensesResult: DataFetchResult<ExpenseItem[]> | null = null;
  let expensesErrorMessage: string | null = null;

  try {
    [expensesSummaryResult, expensesResult] = await Promise.all([
      getDeputadoExpensesSummary(politician.id, filters),
      getDeputadoExpenses(politician.id, filters),
    ]);
  } catch (error) {
    expensesErrorMessage =
      error instanceof Error
        ? error.message
        : "Não foi possível carregar as despesas parlamentares no momento.";
  }

  let legislationItemsResult: DataFetchResult<LegislationItem[]> | null = null;
  let legislationIntegrationMessage: string | null = null;

  try {
    legislationItemsResult = await getFederalDeputyRelatedLegislation(politician.id, {
      ano: filters.ano,
      limit: 24,
    });
    legislationIntegrationMessage = legislationItemsResult.errorMessage || null;
  } catch {
    legislationIntegrationMessage =
      "Não foi possível consolidar proposições relacionadas na fonte oficial da Câmara para este perfil.";
  }

  const [presenceSettled, votingSettled, staffSettled] = await Promise.allSettled([
    getFederalDeputyPresenceInsight(politician.id, { itensVotacoes: 40, ano: filters.ano }),
    getFederalDeputyVotingHistory(politician.id, { limit: 40, itensVotacoes: 80, ano: filters.ano }),
    getFederalDeputyStaff(politician.id),
  ]);

  return {
    expensesSummaryResult,
    expensesResult,
    expensesErrorMessage,
    legislationItemsResult,
    legislationIntegrationMessage,
    presenceResult: presenceSettled.status === "fulfilled" ? presenceSettled.value : null,
    votingHistoryResult: votingSettled.status === "fulfilled" ? votingSettled.value : null,
    staffResult: staffSettled.status === "fulfilled" ? staffSettled.value : null,
  };
}
