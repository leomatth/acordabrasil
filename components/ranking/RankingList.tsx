import { EmptyState } from "@/components/states/EmptyState";
import { RankingComparisonChart } from "@/components/ranking/RankingComparisonChart";
import { RankingCard } from "@/components/ranking/RankingCard";
import type { RankedPolitician } from "@/lib/utils/ranking";

type RankingListProps = {
  title: string;
  metricLabel: string;
  formatMetric: (value: number) => string;
  items: RankedPolitician[];
  integrationMessage?: string;
};

export function RankingList({
  title,
  metricLabel,
  formatMetric,
  items,
  integrationMessage,
}: RankingListProps) {
  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm sm:p-6">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-[#0f3d2e]">{title}</h2>
        <p className="text-sm font-medium text-slate-600">{items.length} político(s) no ranking</p>
      </header>

      {integrationMessage ? (
        <article className="rounded-xl border border-dashed border-slate-300 bg-white p-4">
          <p className="text-sm font-semibold text-slate-700">Em integração</p>
          <p className="mt-1 text-sm text-slate-600">{integrationMessage}</p>
        </article>
      ) : null}

      {items.length ? (
        <RankingComparisonChart items={items} title="Comparativo rápido (top 10)" />
      ) : null}

      {items.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <RankingCard
              key={`${item.id}-${item.position}`}
              item={item}
              metricLabel={metricLabel}
              metricValue={formatMetric(item.metricValue)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Ranking sem resultados"
          description="Ajuste os filtros para ampliar os resultados comparáveis."
        />
      )}
    </section>
  );
}
