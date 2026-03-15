import { formatCurrency } from "@/lib/formatCurrency";
import type { RankedPolitician } from "@/lib/utils/ranking";

type RankingComparisonChartProps = {
  items: RankedPolitician[];
  title: string;
};

function shortName(value: string): string {
  if (value.length <= 28) {
    return value;
  }

  return `${value.slice(0, 28)}...`;
}

export function RankingComparisonChart({ items, title }: RankingComparisonChartProps) {
  const topItems = items.slice(0, 10);
  const maxValue = topItems.length ? Math.max(...topItems.map((item) => item.metricValue)) : 0;

  if (!topItems.length || maxValue <= 0) {
    return null;
  }

  return (
    <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="text-sm font-bold text-[#0f3d2e]">{title}</h3>
      <div className="space-y-2">
        {topItems.map((item) => {
          const widthPercent = (item.metricValue / maxValue) * 100;

          return (
            <div key={`mini-${item.id}-${item.position}`} className="space-y-1">
              <div className="flex items-center justify-between gap-2 text-xs">
                <p className="font-medium text-slate-700">
                  #{item.position} {shortName(item.nome)}
                </p>
                <p className="font-semibold text-[#0f3d2e]">{formatCurrency(item.metricValue)}</p>
              </div>
              <div className="h-2 rounded-full bg-slate-200">
                <div
                  className="h-2 rounded-full bg-[#0f3d2e]"
                  style={{ width: `${Math.max(4, widthPercent)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
