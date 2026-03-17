type VotingSummaryCardsProps = {
  total: number;
  favor: number;
  contra: number;
  abstencao: number;
  obstrucao: number;
  outros: number;
  hasData: boolean;
};

function formatValue(value: number, hasData: boolean) {
  return hasData ? String(value) : "Em integração";
}

export function VotingSummaryCards({
  total,
  favor,
  contra,
  abstencao,
  obstrucao,
  outros,
  hasData,
}: VotingSummaryCardsProps) {
  const cards = [
    { label: "Total de votações registradas", value: formatValue(total, hasData) },
    { label: "A favor", value: formatValue(favor, hasData) },
    { label: "Contra", value: formatValue(contra, hasData) },
    { label: "Abstenções", value: formatValue(abstencao, hasData) },
    { label: "Obstruções", value: formatValue(obstrucao, hasData) },
    { label: "Outros votos", value: formatValue(outros, hasData) },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <article key={card.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{card.label}</p>
          <p className="mt-2 text-xl font-bold text-[#0f3d2e]">{card.value}</p>
        </article>
      ))}
    </div>
  );
}
