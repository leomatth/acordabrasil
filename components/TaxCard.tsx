import type { TaxGuideItem } from "@/lib/mockData";

type TaxCardProps = {
  tax: TaxGuideItem;
};

const categoryStyle: Record<TaxGuideItem["categoria"], string> = {
  Federal: "bg-emerald-100 text-emerald-700",
  Estadual: "bg-amber-100 text-amber-700",
  Municipal: "bg-sky-100 text-sky-700",
};

export function TaxCard({ tax }: TaxCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-[#0f3d2e]">{tax.nome}</h3>
          <p className="text-sm font-medium text-slate-500">{tax.sigla}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${categoryStyle[tax.categoria]}`}>
          {tax.categoria}
        </span>
      </div>

      <dl className="mt-4 space-y-2 text-sm text-slate-600">
        <div>
          <dt className="font-medium text-slate-500">Descrição</dt>
          <dd>{tax.descricao}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Onde incide</dt>
          <dd>{tax.incidencia}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Faixa / alíquota</dt>
          <dd className="font-semibold text-[#0f3d2e]">{tax.aliquota}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Exemplo prático</dt>
          <dd>{tax.exemplo}</dd>
        </div>
      </dl>
    </article>
  );
}
