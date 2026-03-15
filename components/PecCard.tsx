import { TrackedLink } from "@/components/TrackedLink";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import { formatCurrency } from "@/lib/formatCurrency";
import type { LegislationItem } from "@/types/legislation";

const statusClasses: Record<LegislationItem["status"], string> = {
  Aprovada: "bg-emerald-100 text-emerald-700",
  Rejeitada: "bg-rose-100 text-rose-700",
  "Em tramitação": "bg-amber-100 text-amber-700",
};

type PecCardProps = {
  pec: LegislationItem;
  variant?: "highlight" | "list";
  buttonLabel?: string;
};

export function PecCard({
  pec,
  variant = "list",
  buttonLabel = "Detalhes",
}: PecCardProps) {
  const involvedPoliticians = [
    pec.politicos.autor,
    pec.politicos.relator,
    ...pec.politicos.apoiadores,
  ];

  const summary = variant === "highlight" ? pec.resumo : pec.statusAtual;

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {pec.numero}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900">{pec.titulo}</h3>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[pec.status]}`}
        >
          {pec.status}
        </span>
      </div>

      <dl className="mt-4 space-y-3 text-sm text-slate-600">
        <div>
          <dt className="font-medium text-slate-500">Assunto</dt>
          <dd>{pec.assunto}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Resumo</dt>
          <dd>{summary}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Políticos envolvidos</dt>
          <dd>{involvedPoliticians.slice(0, 4).join(", ")}</dd>
        </div>
        {variant === "list" ? (
          <div>
            <dt className="font-medium text-slate-500">Última atualização</dt>
            <dd>{new Date(pec.ultimaAtualizacao).toLocaleDateString("pt-BR")}</dd>
          </div>
        ) : null}
        <div>
          <dt className="font-medium text-slate-500">Impacto financeiro estimado</dt>
          <dd className="font-semibold text-[#0f3d2e]">
            {pec.impactoFinanceiro
              ? formatCurrency(pec.impactoFinanceiro)
              : "Não estimado"}
          </dd>
        </div>
      </dl>

      <div className="mt-5">
        <TrackedLink
          href={`/pecs/${pec.id}`}
          eventName={ANALYTICS_EVENTS.PEC_CLICK}
          eventPayload={{ section: "pec_card", source: "pec_list", label: pec.numero }}
          className="inline-flex items-center rounded-md bg-[#0f3d2e] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#14553f]"
        >
          {buttonLabel}
        </TrackedLink>
      </div>
    </article>
  );
}
