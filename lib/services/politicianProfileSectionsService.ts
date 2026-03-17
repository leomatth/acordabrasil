import {
  resolveOfficeProfileProvider,
  type OfficeSectionsResult,
} from "@/lib/services/profileOffice/providerRegistry";
import type { DataFetchResult, DataSourceInfo } from "@/types/dataSource";
import type { ExpenseCategoryGroup, ExpenseItem, ExpenseSummary } from "@/types/expense";
import type { LegislationItem } from "@/types/legislation";
import type { PresenceInsight, PoliticianProfile, StaffMember, VotingRecord } from "@/types/politician";

export type PoliticianProfileFilters = {
  ano?: number;
  mes?: number;
  categoria?: string;
  itensPorPagina?: number;
};

export type PoliticianProfileSectionsData = {
  isFederalDeputy: boolean;
  isSenator: boolean;
  isPresident: boolean;
  isGovernor: boolean;
  isStateDeputy: boolean;
  expensesSummaryResult: DataFetchResult<ExpenseSummary> | null;
  expensesResult: DataFetchResult<ExpenseItem[]> | null;
  expensesErrorMessage: string | null;
  expenseYears: number[];
  expenseCategories: string[];
  relatedLegislationItems: LegislationItem[];
  hasReliableLegislationIntegration: boolean;
  legislationIntegrationMessage: string | null;
  legislationSourceInfo: DataSourceInfo;
  presenceResult: DataFetchResult<PresenceInsight>;
  votingHistoryResult: DataFetchResult<VotingRecord[]>;
  staffResult: DataFetchResult<StaffMember[]>;
};

export function defaultSourceInfo(
  lastUpdated: string,
  referencePeriod?: string,
  sourceName = "Dados Abertos da Câmara dos Deputados",
  sourceUrl = "https://dadosabertos.camara.leg.br/",
): DataSourceInfo {
  return {
    sourceName,
    sourceType: "official_portal",
    sourceUrl,
    referencePeriod,
    lastUpdated,
  };
}

function normalizeName(value: string): string {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function findRelatedLegislationByName(
  items: LegislationItem[],
  politicianName: string,
): LegislationItem[] {
  const normalizedName = normalizeName(politicianName);

  return items.filter((item) => {
    const relatedNames = [
      ...(item.autores ?? []),
      ...(item.politicosEnvolvidos ?? []),
      item.politicos.autor,
      item.politicos.relator,
      ...item.politicos.apoiadores,
    ].map((name) => normalizeName(name));

    return relatedNames.includes(normalizedName);
  });
}

export async function buildPoliticianProfileSectionsData(
  resolvedPolitician: PoliticianProfile,
  filters: PoliticianProfileFilters,
): Promise<PoliticianProfileSectionsData> {
  const currentYear = new Date().getFullYear();

  const isFederalDeputy = resolvedPolitician.cargo === "Deputado Federal";
  const isSenator = resolvedPolitician.cargo === "Senador";
  const isPresident = resolvedPolitician.cargo === "Presidente";
  const isGovernor = resolvedPolitician.cargo === "Governador";
  const isStateDeputy = resolvedPolitician.cargo === "Deputado Estadual";

  const officeProvider = resolveOfficeProfileProvider(resolvedPolitician.cargo);
  const officeSectionsResult: OfficeSectionsResult = officeProvider
    ? await officeProvider.loadSections(resolvedPolitician, filters)
    : {
        expensesSummaryResult: null,
        expensesResult: null,
        expensesErrorMessage: "Não disponível para este cargo/fonte no momento.",
        legislationItemsResult: null,
        legislationIntegrationMessage: "Não disponível para este cargo/fonte no momento.",
        presenceResult: null,
        votingHistoryResult: null,
        staffResult: null,
      };

  const expensesSummaryResult = officeSectionsResult.expensesSummaryResult;
  const expensesResult = officeSectionsResult.expensesResult;
  const expensesErrorMessage = officeSectionsResult.expensesErrorMessage;

  const expenseYears: number[] = expensesResult
    ? Array.from(new Set(expensesResult.data.map((item: ExpenseItem) => item.ano))) as number[]
    : [currentYear, currentYear - 1, currentYear - 2, currentYear - 3];

  expenseYears.sort((a, b) => b - a);

  const expenseCategories = expensesSummaryResult
    ? expensesSummaryResult.data.categoriasAgrupadas.map((item: ExpenseCategoryGroup) => item.categoria)
    : [];

  const legislationItemsResult = officeSectionsResult.legislationItemsResult;
  const legislationIntegrationMessage = officeSectionsResult.legislationIntegrationMessage;

  const relatedLegislationItems = isSenator
    ? (legislationItemsResult?.data ?? [])
    : isFederalDeputy
      ? (legislationItemsResult?.data ?? [])
    : isPresident
      ? (legislationItemsResult?.data ?? [])
      : isGovernor
      ? (legislationItemsResult?.data ?? [])
        : legislationItemsResult
          ? findRelatedLegislationByName(legislationItemsResult.data, resolvedPolitician.nome)
          : [];

  const hasReliableLegislationIntegration = Boolean(legislationItemsResult);

  const presenceResult: DataFetchResult<PresenceInsight> =
    officeSectionsResult.presenceResult
      ? officeSectionsResult.presenceResult
      : {
          data: {
            percentualPresenca: null,
            sessoesConsideradas: null,
            dataSourceInfo: defaultSourceInfo(
              new Date().toISOString(),
              filters.ano ? String(filters.ano) : undefined,
              resolvedPolitician.dataSourceInfo.sourceName,
              resolvedPolitician.dataSourceInfo.sourceUrl,
            ),
            integrationMessage: isFederalDeputy
              ? "Dados oficiais de presença não disponíveis com segurança para este perfil/período."
              : isSenator
                ? "Não foi possível consolidar presença oficial para este perfil no período selecionado."
                : isPresident
                  ? "Presença legislativa não se aplica ao cargo; exibimos atividade oficial recente quando disponível."
                  : isGovernor
                    ? "Presença legislativa não se aplica ao cargo; métricas executivas oficiais estão em integração."
                    : isStateDeputy
                      ? "Presença oficial estadual ainda em consolidação para o período selecionado."
                      : "Não disponível para este cargo/fonte no momento.",
          },
          source: "api",
          mode: "live",
          lastUpdated: new Date().toISOString(),
        };

  const votingHistoryResult: DataFetchResult<VotingRecord[]> =
    officeSectionsResult.votingHistoryResult
      ? officeSectionsResult.votingHistoryResult
      : {
          data: [],
          source: "api",
          mode: "live",
          lastUpdated: new Date().toISOString(),
          dataSourceInfo: defaultSourceInfo(
            new Date().toISOString(),
            filters.ano ? String(filters.ano) : undefined,
            resolvedPolitician.dataSourceInfo.sourceName,
            resolvedPolitician.dataSourceInfo.sourceUrl,
          ),
          errorMessage: isFederalDeputy
            ? "Histórico nominal de votações não disponível com segurança para este perfil/período."
            : isSenator
              ? "Histórico nominal ainda em integração para este perfil no período selecionado."
              : isPresident
                ? "Votações nominais não se aplicam diretamente ao cargo; exibimos atos/processos oficiais recentes quando disponíveis."
                : isGovernor
                  ? "Votações nominais não se aplicam diretamente ao cargo de governador; atividades oficiais em integração."
                  : isStateDeputy
                    ? "Votações nominais de deputado estadual ainda em integração nesta fonte oficial piloto."
                    : "Não disponível para este cargo/fonte no momento.",
        };

  const staffResult: DataFetchResult<StaffMember[]> =
    officeSectionsResult.staffResult
      ? officeSectionsResult.staffResult
      : {
          data: [],
          source: "api",
          mode: "live",
          lastUpdated: new Date().toISOString(),
          dataSourceInfo: defaultSourceInfo(
            new Date().toISOString(),
            undefined,
            resolvedPolitician.dataSourceInfo.sourceName,
            resolvedPolitician.dataSourceInfo.sourceUrl,
          ),
          errorMessage: isFederalDeputy
            ? "Dados de assessores do gabinete ainda não disponíveis de forma segura na fonte oficial atual."
            : isSenator
              ? "Dados de assessores ainda em integração para este perfil no Senado Federal."
              : isPresident
                ? "Dados de assessores ainda em integração para este perfil na Presidência da República."
                : isGovernor
                  ? "Dados de assessores ainda em integração para este perfil de Governador."
                  : isStateDeputy
                    ? "Dados de assessores ainda em integração para este perfil estadual."
                    : "Não disponível para este cargo/fonte no momento.",
        };

  const legislationSourceInfo = legislationItemsResult?.dataSourceInfo
    || defaultSourceInfo(
      new Date().toISOString(),
      filters.ano ? String(filters.ano) : undefined,
      resolvedPolitician.dataSourceInfo.sourceName,
      resolvedPolitician.dataSourceInfo.sourceUrl,
    );

  return {
    isFederalDeputy,
    isSenator,
    isPresident,
    isGovernor,
    isStateDeputy,
    expensesSummaryResult,
    expensesResult,
    expensesErrorMessage,
    expenseYears,
    expenseCategories,
    relatedLegislationItems,
    hasReliableLegislationIntegration,
    legislationIntegrationMessage,
    legislationSourceInfo,
    presenceResult,
    votingHistoryResult,
    staffResult,
  };
}
