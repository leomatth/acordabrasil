import type { Metadata } from "next";
import { RankingPageClient } from "@/components/ranking/RankingPageClient";
import { createPageMetadata } from "@/lib/seo";
import {
  getRankingByExpenses,
  getRankingByLowestExpenses,
} from "@/lib/services/politicianRankingService";
import type { RankingCandidate } from "@/lib/utils/ranking";
import type { DataSourceInfo } from "@/types/dataSource";

export const metadata: Metadata = createPageMetadata({
  title: "Ranking de políticos | AcordaBrasil",
  description: "Compare gastos parlamentares reais de políticos em rankings públicos.",
  path: "/politicos/ranking",
});

export const dynamic = "force-dynamic";
export const revalidate = 60 * 10;

const RANKING_BASE_YEAR = 2025;

export default async function PoliticosRankingPage() {
  const [moreExpensesResult, lessExpensesResult, baseYearResult] =
    await Promise.all([
      getRankingByExpenses({ limit: 20, itensDeputados: 24, ano: RANKING_BASE_YEAR }),
      getRankingByLowestExpenses({ limit: 20, itensDeputados: 24, ano: RANKING_BASE_YEAR }),
      getRankingByExpenses({ limit: 20, itensDeputados: 24, ano: RANKING_BASE_YEAR }),
    ]);

  const byId = new Map<number, RankingCandidate>();
  const baseYearById = new Map(
    baseYearResult.data.map((entry) => [entry.deputadoId, entry.totalGasto]),
  );

  [...moreExpensesResult.data, ...lessExpensesResult.data].forEach((entry) => {
    if (byId.has(entry.deputadoId)) {
      return;
    }

    byId.set(entry.deputadoId, {
      id: entry.deputadoId,
      slug: entry.slug,
      nome: entry.nome,
      cargo: "Deputado Federal",
      partido: entry.partido,
      estado: entry.estado,
      foto: entry.foto,
      expensesTotal: entry.totalGasto,
      expensesByPeriod: {
        [String(RANKING_BASE_YEAR)]: baseYearById.get(entry.deputadoId) ?? null,
      },
      presencePercent: null,
      propositionsCount: null,
    });
  });

  const candidates = Array.from(byId.values());
  const rankingSourceInfo: DataSourceInfo = {
    sourceName: "Dados Abertos da Câmara dos Deputados",
    sourceType: "official_portal",
    sourceUrl: "https://dadosabertos.camara.leg.br/",
    referencePeriod: String(RANKING_BASE_YEAR),
    lastUpdated: moreExpensesResult.lastUpdated,
  };

  return (
    <RankingPageClient
      candidates={candidates}
      hasExpenseData={candidates.some((item) => item.expensesTotal !== null)}
      defaultPeriod={String(RANKING_BASE_YEAR)}
      periodOptions={[String(RANKING_BASE_YEAR)]}
      rankingSourceInfo={rankingSourceInfo}
    />
  );
}
