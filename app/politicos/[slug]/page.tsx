import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CoverageBadge } from "@/components/coverage/CoverageBadge";
import { DataSourceBlock } from "@/components/data-source/DataSourceBlock";
import { TrackOnView } from "@/components/TrackOnView";
import { ExpensesSection } from "@/components/politician/ExpensesSection";
import { PresenceCard } from "@/components/politician/PresenceCard";
import { ProfileHeader } from "@/components/politician/ProfileHeader";
import { ProfileInfoSection } from "@/components/politician/ProfileInfoSection";
import { ProfileStats } from "@/components/politician/ProfileStats";
import { RelatedLegislationSection } from "@/components/politician/RelatedLegislationSection";
import { StaffSection } from "@/components/politician/StaffSection";
import { VotingHistorySection } from "@/components/politician/VotingHistorySection";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import { getPoliticalSalaryByOffice } from "@/lib/constants/politicalSalaries";
import { formatCurrency } from "@/lib/formatCurrency";
import { getPoliticianBySlug } from "@/lib/services/politiciansService";
import { summarizeFederalDeputyVoting } from "@/lib/services/federalDeputyVotesService";
import {
  buildPoliticianProfileSectionsData,
  defaultSourceInfo,
} from "@/lib/services/politicianProfileSectionsService";
import { resolveStateDeputyProfileProvider } from "@/lib/services/stateDeputyProfile/registry";
import { resolveStateProvider } from "@/lib/services/politicalProviders/states/providerRegistry";
import { createPageMetadata } from "@/lib/seo";
import type {
  PoliticianProfileSectionCoverage,
  SectionCoverageStatus,
} from "@/types/politician";

type PoliticianProfilePageProps = {
  params: {
    slug: string;
  };
  searchParams?: {
    ano?: string;
    mes?: string;
    categoria?: string;
  };
};

function resolveSectionStatus(options: {
  hasPrimaryData: boolean;
  hasFallbackData?: boolean;
  unavailable?: boolean;
}): SectionCoverageStatus {
  if (options.hasPrimaryData) {
    return "available";
  }

  if (options.unavailable) {
    return "unavailable";
  }

  if (options.hasFallbackData) {
    return "partial";
  }

  return "unavailable";
}

export async function generateMetadata({ params }: PoliticianProfilePageProps): Promise<Metadata> {
  const result = await getPoliticianBySlug(params.slug);
  const politician = result.data;

  if (!politician) {
    return createPageMetadata({
      title: "Político não encontrado | AcordaBrasil",
      description: "Perfil de político não encontrado.",
      path: "/politicos",
    });
  }

  return createPageMetadata({
    title: `${politician.nome} | ${politician.cargo} | AcordaBrasil`,
    description: `${politician.cargo} (${politician.partido}) - ${politician.resumo}`,
    path: `/politicos/${politician.slug}`,
  });
}

export default async function PoliticianProfilePage({
  params,
  searchParams,
}: PoliticianProfilePageProps) {
  const profileResult = await getPoliticianBySlug(params.slug);
  const politician = profileResult.data;

  if (!politician) {
    notFound();
  }

  let resolvedPolitician = politician;
  const isStateDeputy = politician.cargo === "Deputado Estadual";
  const stateDeputyProfileProvider = resolveStateDeputyProfileProvider(politician.estado);
  const stateProvider = resolveStateProvider({
    cargo: politician.cargo,
    estado: politician.estado,
    sourceName: politician.dataSourceInfo.sourceName,
  });

  if (isStateDeputy && politician.externalId && stateDeputyProfileProvider) {
    try {
      const details = await stateDeputyProfileProvider.enrichProfileByExternalId(politician.externalId);
      resolvedPolitician = {
        ...politician,
        ...details,
        partido: details.partido || politician.partido,
      };
    } catch {
      resolvedPolitician = politician;
    }
  }

  const anoParam = searchParams?.ano;
  const mesParam = searchParams?.mes;
  const categoriaParam = searchParams?.categoria;

  const ano = Number(anoParam);
  const mes = Number(mesParam);

  const filters = {
    ano: Number.isFinite(ano) && ano > 0 ? ano : undefined,
    mes: Number.isFinite(mes) && mes > 0 && mes <= 12 ? mes : undefined,
    categoria: categoriaParam?.trim() ? categoriaParam.trim() : undefined,
    itensPorPagina: 50,
  };

  const {
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
  } = await buildPoliticianProfileSectionsData(resolvedPolitician, filters);

  const salaryReference = getPoliticalSalaryByOffice(resolvedPolitician.cargo);
  const salaryValue = salaryReference?.salarioBase ?? null;

  const votingSummary = summarizeFederalDeputyVoting(votingHistoryResult.data);
  const hasReliableVotingSummary = votingHistoryResult.data.length > 0;

  const approvedRelatedCount = resolvedPolitician.cargo === "Deputado Federal"
    ? (hasReliableVotingSummary ? votingSummary.approvedWithParticipation : null)
    : hasReliableLegislationIntegration
      ? relatedLegislationItems.filter((item) => item.status === "Aprovada").length
      : null;

  const rejectedRelatedCount = resolvedPolitician.cargo === "Deputado Federal"
    ? (hasReliableVotingSummary ? votingSummary.rejectedWithParticipation : null)
    : hasReliableLegislationIntegration
      ? relatedLegislationItems.filter((item) => item.status === "Rejeitada").length
      : null;

  const legislationSourceInfoSafe = legislationSourceInfo || defaultSourceInfo(
    new Date().toISOString(),
    filters.ano ? String(filters.ano) : undefined,
    resolvedPolitician.dataSourceInfo.sourceName,
    resolvedPolitician.dataSourceInfo.sourceUrl,
  );

    const sectionCoverage: PoliticianProfileSectionCoverage = {
      identificacao: {
        key: "identificacao",
        status: "available",
        sourceName: resolvedPolitician.dataSourceInfo.sourceName,
        sourceUrl: resolvedPolitician.dataSourceInfo.sourceUrl,
        referencePeriod: resolvedPolitician.dataSourceInfo.referencePeriod,
      },
      remuneracao: {
        key: "remuneracao",
        status: salaryReference ? "available" : "unavailable",
        sourceName: salaryReference?.sourceLabel || resolvedPolitician.dataSourceInfo.sourceName,
        referencePeriod: "Valor vigente",
        reason: salaryReference
          ? undefined
          : "Referência salarial deste cargo ainda não configurada para esta fonte oficial.",
      },
      gastos: {
        key: "gastos",
        status: resolveSectionStatus({
          hasPrimaryData: Boolean(expensesSummaryResult),
          hasFallbackData: Boolean(expensesResult?.data.length),
          unavailable: Boolean(expensesErrorMessage?.includes("Não disponível para este cargo/fonte")),
        }),
        sourceName: (expensesSummaryResult?.data.dataSourceInfo || resolvedPolitician.dataSourceInfo).sourceName,
        sourceUrl: (expensesSummaryResult?.data.dataSourceInfo || resolvedPolitician.dataSourceInfo).sourceUrl,
        referencePeriod:
          (expensesSummaryResult?.data.dataSourceInfo || resolvedPolitician.dataSourceInfo).referencePeriod,
        reason: expensesErrorMessage || undefined,
      },
      presencaAtividade: {
        key: "presencaAtividade",
        status: resolveSectionStatus({
          hasPrimaryData:
            presenceResult.data.percentualPresenca !== null || presenceResult.data.sessoesConsideradas !== null,
          hasFallbackData: Boolean(presenceResult.data.integrationMessage),
          unavailable:
            presenceResult.data.integrationMessage?.includes("Não disponível para este cargo/fonte") || false,
        }),
        sourceName: presenceResult.data.dataSourceInfo.sourceName,
        sourceUrl: presenceResult.data.dataSourceInfo.sourceUrl,
        referencePeriod: presenceResult.data.dataSourceInfo.referencePeriod,
        reason: presenceResult.data.integrationMessage,
      },
      votacoes: {
        key: "votacoes",
        status: resolveSectionStatus({
          hasPrimaryData: votingHistoryResult.data.length > 0,
          hasFallbackData: Boolean(votingHistoryResult.errorMessage),
          unavailable:
            votingHistoryResult.errorMessage?.includes("Não disponível para este cargo/fonte") || false,
        }),
        sourceName:
          votingHistoryResult.dataSourceInfo?.sourceName || resolvedPolitician.dataSourceInfo.sourceName,
        sourceUrl:
          votingHistoryResult.dataSourceInfo?.sourceUrl || resolvedPolitician.dataSourceInfo.sourceUrl,
        referencePeriod:
          votingHistoryResult.dataSourceInfo?.referencePeriod
          || (filters.ano ? String(filters.ano) : resolvedPolitician.dataSourceInfo.referencePeriod),
        reason: votingHistoryResult.errorMessage,
      },
      proposicoes: {
        key: "proposicoes",
        status: resolveSectionStatus({
          hasPrimaryData: hasReliableLegislationIntegration && relatedLegislationItems.length > 0,
          hasFallbackData: Boolean(legislationIntegrationMessage),
          unavailable: Boolean(legislationIntegrationMessage?.includes("Não disponível para este cargo/fonte")),
        }),
        sourceName: legislationSourceInfoSafe.sourceName,
        sourceUrl: legislationSourceInfoSafe.sourceUrl,
        referencePeriod: legislationSourceInfoSafe.referencePeriod,
        reason: legislationIntegrationMessage || undefined,
      },
      equipeGabinete: {
        key: "equipeGabinete",
        status: resolveSectionStatus({
          hasPrimaryData: staffResult.data.length > 0,
          hasFallbackData: Boolean(staffResult.errorMessage),
          unavailable: Boolean(staffResult.errorMessage?.includes("Não disponível para este cargo/fonte")),
        }),
        sourceName: (staffResult.dataSourceInfo || resolvedPolitician.dataSourceInfo).sourceName,
        sourceUrl: (staffResult.dataSourceInfo || resolvedPolitician.dataSourceInfo).sourceUrl,
        referencePeriod: (staffResult.dataSourceInfo || resolvedPolitician.dataSourceInfo).referencePeriod,
        reason: staffResult.errorMessage || undefined,
      },
    };

    resolvedPolitician = {
      ...resolvedPolitician,
      sectionCoverage,
    };

  return (
    <main className="container-page space-y-8 py-10">
      <TrackOnView
        eventName={ANALYTICS_EVENTS.POLITICIAN_PROFILE_VIEW}
        payload={{ section: "politician_profile", source: "profile_page", label: resolvedPolitician.slug }}
      />

      <ProfileHeader politician={resolvedPolitician} profileResult={profileResult} />

      <div>
        <CoverageBadge status={resolvedPolitician.coverageStatus} />
      </div>

      <ProfileInfoSection politician={resolvedPolitician} profileResult={profileResult} />

      <DataSourceBlock
        title="Fonte principal deste perfil"
        dataSourceInfo={resolvedPolitician.dataSourceInfo}
        coverageStatus={sectionCoverage.identificacao.status}
        coverageReason={sectionCoverage.identificacao.reason}
        className="max-w-3xl"
      />

      <ProfileStats
        salarioBase={salaryValue}
        totalGastosGabinete={expensesSummaryResult ? expensesSummaryResult.data.totalLiquido : null}
        quantidadeDespesas={expensesSummaryResult ? expensesSummaryResult.data.quantidadeDespesas : null}
        presencaSessoes={presenceResult.data.percentualPresenca}
        proposicoesRelacionadas={
          hasReliableLegislationIntegration ? relatedLegislationItems.length : null
        }
        votacoesRelevantes={votingHistoryResult.data.length || null}
      />

      <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#0f3d2e]">Salário base</h2>
        {salaryReference ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {salaryReference.label}
            </p>
            <p className="mt-2 text-2xl font-extrabold text-[#0f3d2e]">
              {formatCurrency(salaryReference.salarioBase)}
            </p>
            <p className="mt-1 text-xs text-slate-500">{salaryReference.sourceLabel}</p>
          </div>
        ) : (
          <article className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-700">Em integração</p>
            <p className="mt-1 text-sm text-slate-600">
              Referência salarial deste cargo ainda não configurada no perfil.
            </p>
          </article>
        )}

        <DataSourceBlock
          title="Fonte da remuneração"
          dataSourceInfo={{
            sourceName: sectionCoverage.remuneracao.sourceName,
            sourceType: "official_portal",
            sourceUrl: salaryReference?.sourceUrl || sectionCoverage.remuneracao.sourceUrl,
            referencePeriod:
              salaryReference?.referencePeriod || sectionCoverage.remuneracao.referencePeriod,
            lastUpdated: salaryReference?.lastUpdated || resolvedPolitician.lastUpdated,
          }}
          coverageStatus={sectionCoverage.remuneracao.status}
          coverageReason={sectionCoverage.remuneracao.reason}
        />
      </section>

      <ExpensesSection
        politicianSlug={resolvedPolitician.slug}
        filters={filters}
        expenseYears={expenseYears}
        expenseCategories={expenseCategories}
        sourceInfo={{
          sourceName: sectionCoverage.gastos.sourceName,
          sourceType: "official_portal",
          sourceUrl: sectionCoverage.gastos.sourceUrl,
          referencePeriod: sectionCoverage.gastos.referencePeriod,
          lastUpdated: expensesSummaryResult?.lastUpdated || resolvedPolitician.lastUpdated,
        }}
        coverageStatus={sectionCoverage.gastos.status}
        coverageReason={sectionCoverage.gastos.reason}
        expensesSummaryResult={expensesSummaryResult}
        expensesResult={expensesResult}
        expensesErrorMessage={expensesErrorMessage}
      />

      <PresenceCard
        presencePercent={presenceResult.data.percentualPresenca}
        sessionsCount={presenceResult.data.sessoesConsideradas}
        validPresenceCount={presenceResult.data.presencasValidas}
        methodologySummary={presenceResult.data.metodologiaResumo}
        integrationMessage={presenceResult.data.integrationMessage}
        sourceInfo={presenceResult.data.dataSourceInfo}
        coverageStatus={sectionCoverage.presencaAtividade.status}
        coverageReason={sectionCoverage.presencaAtividade.reason}
      />

      <VotingHistorySection
        records={votingHistoryResult.data}
        sourceInfo={
          votingHistoryResult.dataSourceInfo
          || defaultSourceInfo(votingHistoryResult.lastUpdated, filters.ano ? String(filters.ano) : undefined)
        }
        integrationMessage={votingHistoryResult.errorMessage}
        coverageStatus={sectionCoverage.votacoes.status}
        coverageReason={sectionCoverage.votacoes.reason}
      />

      <StaffSection
        staff={staffResult.data}
        sourceInfo={staffResult.dataSourceInfo || defaultSourceInfo(staffResult.lastUpdated)}
        integrationMessage={staffResult.errorMessage}
        coverageStatus={sectionCoverage.equipeGabinete.status}
        coverageReason={sectionCoverage.equipeGabinete.reason}
      />

      <RelatedLegislationSection
        items={relatedLegislationItems}
        hasReliableIntegration={hasReliableLegislationIntegration}
        sourceInfo={legislationSourceInfoSafe}
        coverageStatus={sectionCoverage.proposicoes.status}
        coverageReason={sectionCoverage.proposicoes.reason}
      />

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#0f3d2e]">Aprovações e rejeições relacionadas</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Proposições aprovadas com participação</p>
            <p className="mt-2 text-xl font-bold text-[#0f3d2e]">
              {approvedRelatedCount === null ? "Indisponível" : approvedRelatedCount}
            </p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Proposições rejeitadas com participação</p>
            <p className="mt-2 text-xl font-bold text-[#0f3d2e]">
              {rejectedRelatedCount === null ? "Indisponível" : rejectedRelatedCount}
            </p>
          </article>
        </div>
        {resolvedPolitician.cargo === "Deputado Federal" ? (
          <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
            Metodologia: contagem baseada em votações nominais oficiais com vínculo de proposição e
            resultado identificável na Câmara. Votações sem vínculo/resultado explícito ficam fora da
            contagem para evitar inferência indevida.
          </p>
        ) : null}
        {resolvedPolitician.cargo === "Deputado Federal" && votingSummary.unresolvedPropositionLinks > 0 ? (
          <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-600">
            Cobertura parcial: {votingSummary.unresolvedPropositionLinks} votação(ões) sem vínculo oficial
            suficiente de proposição/resultado no recorte atual.
          </p>
        ) : null}
        {legislationIntegrationMessage ? (
          <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-600">
            {legislationIntegrationMessage}
          </p>
        ) : null}

        {isStateDeputy && !stateProvider ? (
          <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-600">
            Ainda não há provider estadual oficial registrado para {resolvedPolitician.estado} neste cargo.
          </p>
        ) : null}

        <DataSourceBlock
          title="Fonte das aprovações e rejeições"
          dataSourceInfo={
            votingHistoryResult.dataSourceInfo
            || defaultSourceInfo(votingHistoryResult.lastUpdated, filters.ano ? String(filters.ano) : undefined)
          }
          coverageStatus={sectionCoverage.votacoes.status}
          coverageReason={sectionCoverage.votacoes.reason}
        />
      </section>
    </main>
  );
}
