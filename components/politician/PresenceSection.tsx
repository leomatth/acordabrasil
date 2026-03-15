type PresenceSectionProps = {
  presencePercent: number | null;
};

export function PresenceSection({ presencePercent }: PresenceSectionProps) {
  const hasPresence = presencePercent !== null && presencePercent > 0;

  return (
    <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-[#0f3d2e]">Presença em sessões</h2>

      {hasPresence ? (
        <div className="space-y-2">
          <p className="text-3xl font-extrabold text-[#0f3d2e]">{presencePercent}%</p>
          <p className="text-sm text-slate-600">
            Percentual de presença consolidado a partir dos dados disponíveis no perfil atual.
          </p>
        </div>
      ) : (
        <article className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-700">Em integração</p>
          <p className="mt-1 text-sm text-slate-600">
            O indicador oficial de presença ainda não está disponível para este perfil no momento.
          </p>
        </article>
      )}
    </section>
  );
}
