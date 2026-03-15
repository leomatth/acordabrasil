type VotingSummarySectionProps = {
  votacoesAcompanhadas: number | null;
  votosFavoraveis: number | null;
  votosContrarios: number | null;
  abstencoes: number | null;
  proposicoesAprovadasComParticipacao: number | null;
  proposicoesRejeitadasComParticipacao: number | null;
  integrationMessage?: string;
};

function valueOrIntegration(value: number | null): string {
  if (value === null) {
    return "Em integração";
  }

  return String(value);
}

export function VotingSummarySection({
  votacoesAcompanhadas,
  votosFavoraveis,
  votosContrarios,
  abstencoes,
  proposicoesAprovadasComParticipacao,
  proposicoesRejeitadasComParticipacao,
  integrationMessage,
}: VotingSummarySectionProps) {
  const cards = [
    { label: "Votações acompanhadas", value: valueOrIntegration(votacoesAcompanhadas) },
    { label: "Votos favoráveis", value: valueOrIntegration(votosFavoraveis) },
    { label: "Votos contrários", value: valueOrIntegration(votosContrarios) },
    { label: "Abstenções", value: valueOrIntegration(abstencoes) },
    {
      label: "Proposições aprovadas com participação",
      value: valueOrIntegration(proposicoesAprovadasComParticipacao),
    },
    {
      label: "Proposições rejeitadas com participação",
      value: valueOrIntegration(proposicoesRejeitadasComParticipacao),
    },
  ];

  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-[#0f3d2e]">Aprovações e rejeições</h2>

      {integrationMessage ? (
        <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-600">
          {integrationMessage}
        </p>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <article key={card.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{card.label}</p>
            <p className="mt-2 text-xl font-bold text-[#0f3d2e]">{card.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
