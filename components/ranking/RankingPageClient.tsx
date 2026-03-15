"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { DataSourceBlock } from "@/components/data-source/DataSourceBlock";
import { RankingFilters } from "@/components/ranking/RankingFilters";
import { RankingList } from "@/components/ranking/RankingList";
import { RankingTabs } from "@/components/ranking/RankingTabs";
import {
  getRankingTypeConfig,
  rankByExpenses,
  type RankingCandidate,
  type RankingType,
} from "@/lib/utils/ranking";
import type { DataSourceInfo } from "@/types/dataSource";
import { SUPPORTED_POLITICIAN_OFFICES, type PoliticianOffice } from "@/types/politician";

type RankingPageClientProps = {
  candidates: RankingCandidate[];
  hasExpenseData: boolean;
  defaultPeriod: string;
  periodOptions: string[];
  rankingSourceInfo: DataSourceInfo;
};

export function RankingPageClient({
  candidates,
  hasExpenseData,
  defaultPeriod,
  periodOptions,
  rankingSourceInfo,
}: RankingPageClientProps) {
  const [rankingType, setRankingType] = useState<RankingType>("more-expenses");
  const [cargoFilter, setCargoFilter] = useState<PoliticianOffice | "all">("all");
  const [partidoFilter, setPartidoFilter] = useState<string | "all">("all");
  const [estadoFilter, setEstadoFilter] = useState<string | "all">("all");
  const [periodoFilter, setPeriodoFilter] = useState<string | "all">(defaultPeriod);

  const filteredCandidates = useMemo(() => {
    return candidates.filter((item) => {
      if (cargoFilter !== "all" && item.cargo !== cargoFilter) {
        return false;
      }

      if (partidoFilter !== "all" && item.partido !== partidoFilter) {
        return false;
      }

      if (estadoFilter !== "all" && item.estado !== estadoFilter) {
        return false;
      }

      return true;
    });
  }, [candidates, cargoFilter, partidoFilter, estadoFilter]);

  const candidatesWithSelectedPeriod = useMemo(() => {
    if (periodoFilter === "all") {
      return filteredCandidates;
    }

    return filteredCandidates.map((candidate) => ({
      ...candidate,
      expensesTotal: candidate.expensesByPeriod?.[periodoFilter] ?? null,
    }));
  }, [filteredCandidates, periodoFilter]);

  const config = getRankingTypeConfig(rankingType);

  const rankedItems = useMemo(() => {
    return rankByExpenses(candidatesWithSelectedPeriod, config.direction);
  }, [candidatesWithSelectedPeriod, config]);

  const hasExpenseDataForPeriod = useMemo(() => {
    return candidatesWithSelectedPeriod.some((item) => item.expensesTotal !== null);
  }, [candidatesWithSelectedPeriod]);

  const integrationMessage = useMemo(() => {
    if (!hasExpenseData || !hasExpenseDataForPeriod) {
      return "Ranking de despesas ainda não disponível com dados suficientes para comparação segura.";
    }

    return undefined;
  }, [hasExpenseData, hasExpenseDataForPeriod]);

  const partidoOptions = useMemo(
    () => Array.from(new Set(candidates.map((item) => item.partido))).sort((a, b) => a.localeCompare(b)),
    [candidates],
  );

  const estadoOptions = useMemo(
    () => Array.from(new Set(candidates.map((item) => item.estado))).sort((a, b) => a.localeCompare(b)),
    [candidates],
  );

  const cargoOptions = useMemo(
    () => SUPPORTED_POLITICIAN_OFFICES,
    [],
  );

  return (
    <main className="container-page space-y-6 py-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-[#0f3d2e] sm:text-4xl">
          Ranking de gastos parlamentares — ano base {defaultPeriod}
        </h1>
        <p className="max-w-2xl text-slate-600">
          Base oficial da Câmara dos Deputados com período de referência fixo em {defaultPeriod}.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/politicos"
            className="inline-flex rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Voltar para políticos
          </Link>
        </div>
      </header>

      <DataSourceBlock title="Fonte do ranking" dataSourceInfo={rankingSourceInfo} className="max-w-3xl" />

      <RankingFilters
        value={{
          cargo: cargoFilter,
          partido: partidoFilter,
          estado: estadoFilter,
          periodo: periodoFilter,
        }}
        cargoOptions={cargoOptions}
        partidoOptions={partidoOptions}
        estadoOptions={estadoOptions}
        periodOptions={periodOptions}
        onCargoChange={setCargoFilter}
        onPartidoChange={setPartidoFilter}
        onEstadoChange={setEstadoFilter}
        onPeriodoChange={setPeriodoFilter}
      />

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <RankingTabs value={rankingType} onChange={setRankingType} />
          <p className="text-sm text-slate-600">
            {filteredCandidates.length} político(s) comparáveis
            {periodoFilter !== "all" ? ` · período ${periodoFilter}` : ""}
          </p>
        </div>
      </div>

      <RankingList
        title={config.title}
        metricLabel={config.metricLabel}
        formatMetric={config.formatMetric}
        items={rankedItems}
        integrationMessage={integrationMessage}
      />
    </main>
  );
}
