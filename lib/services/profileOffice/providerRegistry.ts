import {
  getDeputadoExpenses,
  getDeputadoExpensesSummary,
} from "@/lib/services/camaraExpensesService";
import { getLegislationItems } from "@/lib/services/legislationService";
import {
  getDeputadoPresenceInsight,
  getDeputadoStaff,
  getDeputadoVotingHistory,
} from "@/lib/services/politicianProfileInsightsService";
import {
  getGovernorSPActivityRecords,
  getGovernorSPLegislationItems,
  getGovernorSPPresenceInsight,
  getPresidentActivityRecords,
  getPresidentLegislationItems,
  getPresidentPresenceInsight,
} from "@/lib/services/executiveProfileInsightsService";
import {
  getSenadorLegislationItems,
  getSenadorPresenceInsight,
  getSenadorVotingHistory,
} from "@/lib/services/senadoProfileInsightsService";
import { resolveStateDeputyProfileProvider } from "@/lib/services/stateDeputyProfile/registry";
import type { PoliticianProfileFilters } from "@/lib/services/politicianProfileSectionsService";
import type { DataFetchResult } from "@/types/dataSource";
import type { ExpenseItem, ExpenseSummary } from "@/types/expense";
import type { LegislationItem } from "@/types/legislation";
import type { PresenceInsight, PoliticianOffice, PoliticianProfile, StaffMember, VotingRecord } from "@/types/politician";

export type OfficeSectionsResult = {
  expensesSummaryResult: DataFetchResult<ExpenseSummary> | null;
  expensesResult: DataFetchResult<ExpenseItem[]> | null;
  expensesErrorMessage: string | null;
  legislationItemsResult: DataFetchResult<LegislationItem[]> | null;
  legislationIntegrationMessage: string | null;
  presenceResult: DataFetchResult<PresenceInsight> | null;
  votingHistoryResult: DataFetchResult<VotingRecord[]> | null;
  staffResult: DataFetchResult<StaffMember[]> | null;
};

type OfficeProfileProvider = {
  key: string;
  cargo: PoliticianOffice;
  loadSections: (
    politician: PoliticianProfile,
    filters: PoliticianProfileFilters,
  ) => Promise<OfficeSectionsResult>;
};

async function loadFederalDeputySections(
  politician: PoliticianProfile,
  filters: PoliticianProfileFilters,
): Promise<OfficeSectionsResult> {
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
    legislationItemsResult = await getLegislationItems();
  } catch {
    legislationIntegrationMessage = "Relações completas com proposições ainda estão em integração para este perfil.";
  }

  const [presenceSettled, votingSettled, staffSettled] = await Promise.allSettled([
    getDeputadoPresenceInsight(politician.id, { itensVotacoes: 20, ano: filters.ano }),
    getDeputadoVotingHistory(politician.id, { limit: 20, itensVotacoes: 25, ano: filters.ano }),
    getDeputadoStaff(politician.id),
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

async function loadSenatorSections(
  politician: PoliticianProfile,
  filters: PoliticianProfileFilters,
): Promise<OfficeSectionsResult> {
  let legislationItemsResult: DataFetchResult<LegislationItem[]> | null = null;
  let legislationIntegrationMessage: string | null = null;

  try {
    legislationItemsResult = await getSenadorLegislationItems(politician.id, {
      ano: filters.ano,
      limit: 24,
    });
  } catch {
    legislationIntegrationMessage = "Relações completas com proposições ainda estão em integração para este perfil.";
  }

  const [presenceSettled, votingSettled] = await Promise.allSettled([
    getSenadorPresenceInsight(politician.id, { ano: filters.ano }),
    getSenadorVotingHistory(politician.id, { limit: 20, ano: filters.ano }),
  ]);

  return {
    expensesSummaryResult: null,
    expensesResult: null,
    expensesErrorMessage: "Não disponível para este cargo/fonte no momento.",
    legislationItemsResult,
    legislationIntegrationMessage,
    presenceResult: presenceSettled.status === "fulfilled" ? presenceSettled.value : null,
    votingHistoryResult: votingSettled.status === "fulfilled" ? votingSettled.value : null,
    staffResult: null,
  };
}

async function loadPresidentSections(
  _politician: PoliticianProfile,
): Promise<OfficeSectionsResult> {
  let legislationItemsResult: DataFetchResult<LegislationItem[]> | null = null;
  let legislationIntegrationMessage: string | null = null;

  try {
    legislationItemsResult = await getPresidentLegislationItems({
      limit: 24,
      numdias: 30,
    });
  } catch {
    legislationIntegrationMessage = "Relações completas com proposições ainda estão em integração para este perfil.";
  }

  const [presenceSettled, votingSettled] = await Promise.allSettled([
    getPresidentPresenceInsight({ numdias: 30 }),
    getPresidentActivityRecords({ limit: 20, numdias: 30 }),
  ]);

  return {
    expensesSummaryResult: null,
    expensesResult: null,
    expensesErrorMessage: "Não disponível para este cargo/fonte no momento.",
    legislationItemsResult,
    legislationIntegrationMessage,
    presenceResult: presenceSettled.status === "fulfilled" ? presenceSettled.value : null,
    votingHistoryResult: votingSettled.status === "fulfilled" ? votingSettled.value : null,
    staffResult: null,
  };
}

async function loadGovernorSections(
  _politician: PoliticianProfile,
): Promise<OfficeSectionsResult> {
  let legislationItemsResult: DataFetchResult<LegislationItem[]> | null = null;
  let legislationIntegrationMessage: string | null = null;

  try {
    legislationItemsResult = await getGovernorSPLegislationItems({ limit: 24 });
    legislationIntegrationMessage = legislationItemsResult.errorMessage || null;
  } catch {
    legislationIntegrationMessage = "Relações completas com proposições ainda estão em integração para este perfil.";
  }

  const [presenceSettled, votingSettled] = await Promise.allSettled([
    getGovernorSPPresenceInsight(),
    getGovernorSPActivityRecords({ limit: 20 }),
  ]);

  return {
    expensesSummaryResult: null,
    expensesResult: null,
    expensesErrorMessage: "Não disponível para este cargo/fonte no momento.",
    legislationItemsResult,
    legislationIntegrationMessage,
    presenceResult: presenceSettled.status === "fulfilled" ? presenceSettled.value : null,
    votingHistoryResult: votingSettled.status === "fulfilled" ? votingSettled.value : null,
    staffResult: null,
  };
}

async function loadStateDeputySections(
  politician: PoliticianProfile,
  filters: PoliticianProfileFilters,
): Promise<OfficeSectionsResult> {
  const provider = resolveStateDeputyProfileProvider(politician.estado);

  let expensesSummaryResult: DataFetchResult<ExpenseSummary> | null = null;
  let expensesResult: DataFetchResult<ExpenseItem[]> | null = null;
  let expensesErrorMessage: string | null = null;

  if (provider && politician.externalId) {
    try {
      const expenses = await provider.getExpensesByExternalId(politician.externalId, filters);
      expensesSummaryResult = expenses.summaryResult;
      expensesResult = expenses.itemsResult;
    } catch (error) {
      expensesErrorMessage =
        error instanceof Error
          ? error.message
          : "Não foi possível carregar as despesas parlamentares no momento.";
    }
  } else {
    expensesErrorMessage = "Não disponível para este cargo/fonte no momento.";
  }

  const presenceResult = provider
    ? await provider.getPresenceByScopedId(politician.id).catch(() => null)
    : null;

  return {
    expensesSummaryResult,
    expensesResult,
    expensesErrorMessage,
    legislationItemsResult: null,
    legislationIntegrationMessage: "Não disponível para este cargo/fonte no momento.",
    presenceResult,
    votingHistoryResult: null,
    staffResult: null,
  };
}

const OFFICE_PROFILE_PROVIDERS: OfficeProfileProvider[] = [
  {
    key: "federal-deputy",
    cargo: "Deputado Federal",
    loadSections: loadFederalDeputySections,
  },
  {
    key: "senator",
    cargo: "Senador",
    loadSections: loadSenatorSections,
  },
  {
    key: "president",
    cargo: "Presidente",
    loadSections: loadPresidentSections,
  },
  {
    key: "governor",
    cargo: "Governador",
    loadSections: loadGovernorSections,
  },
  {
    key: "state-deputy",
    cargo: "Deputado Estadual",
    loadSections: loadStateDeputySections,
  },
];

export function resolveOfficeProfileProvider(cargo: PoliticianOffice): OfficeProfileProvider | null {
  return OFFICE_PROFILE_PROVIDERS.find((provider) => provider.cargo === cargo) || null;
}
