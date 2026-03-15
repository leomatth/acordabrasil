import type { TaxSummaryItem } from "@/lib/mockData";

type TaxSummaryCardProps = {
  item: TaxSummaryItem;
};

export function TaxSummaryCard({ item }: TaxSummaryCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:shadow-md">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.titulo}</p>
      <p className="mt-2 text-2xl font-extrabold text-[#0f3d2e]">{item.valor}</p>
      <p className="mt-2 text-sm text-slate-600">{item.descricao}</p>
    </article>
  );
}
