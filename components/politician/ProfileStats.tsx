import { formatCurrency } from "@/lib/formatCurrency";

type ProfileStatsProps = {
  salarioBase: number | null;
  totalGastosGabinete: number | null;
  quantidadeDespesas: number | null;
  presencaSessoes: number | null;
  proposicoesRelacionadas: number | null;
  votacoesRelevantes: number | null;
};

type StatCard = {
  label: string;
  value: string;
  helper?: string;
};

function resolveNumericValue(value: number | null, formatter?: (value: number) => string): string {
  if (value === null || Number.isNaN(value)) {
    return "Em integração";
  }

  return formatter ? formatter(value) : String(value);
}

export function ProfileStats({
  salarioBase,
  totalGastosGabinete,
  quantidadeDespesas,
  presencaSessoes,
  proposicoesRelacionadas,
  votacoesRelevantes,
}: ProfileStatsProps) {
  const cards: StatCard[] = [
    {
      label: "Salário base",
      value: resolveNumericValue(salarioBase, (value) => formatCurrency(value)),
      helper: "Referência institucional/configurada",
    },
    {
      label: "Total de gastos de gabinete",
      value: resolveNumericValue(totalGastosGabinete, (value) => formatCurrency(value)),
    },
    {
      label: "Quantidade de despesas",
      value: resolveNumericValue(quantidadeDespesas),
    },
    {
      label: "Presença em sessões (%)",
      value: resolveNumericValue(presencaSessoes, (value) => `${value}%`),
    },
    {
      label: "Proposições relacionadas",
      value: resolveNumericValue(proposicoesRelacionadas),
    },
    {
      label: "Votações relevantes registradas",
      value: resolveNumericValue(votacoesRelevantes),
    },
  ];

  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-bold text-[#0f3d2e]">Indicadores principais</h2>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          Estrutura pronta para ranking comparativo
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <article key={card.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{card.label}</p>
            <p className="mt-2 text-xl font-bold text-[#0f3d2e]">{card.value}</p>
            {card.helper ? <p className="mt-1 text-xs text-slate-500">{card.helper}</p> : null}
          </article>
        ))}
      </div>
    </section>
  );
}
