"use client";

import { useTrackEvent } from "@/hooks/useTrackEvent";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import type { CurrentOfficeHolder, ElectionCandidate } from "@/lib/mockData";

type CandidateCardProps = {
  candidate: ElectionCandidate;
};

type HolderCardProps = {
  holder: CurrentOfficeHolder;
};

export function CurrentHolderCard({ holder }: HolderCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <h3 className="text-base font-bold text-[#0f3d2e]">{holder.cargo}</h3>
      <p className="mt-2 text-sm text-slate-700">
        Nome: <span className="font-semibold">{holder.nome}</span>
      </p>
      <p className="text-sm text-slate-700">
        Partido: <span className="font-semibold">{holder.partido}</span>
      </p>
      {holder.estado ? (
        <p className="text-sm text-slate-700">
          Estado: <span className="font-semibold">{holder.estado}</span>
        </p>
      ) : null}
    </article>
  );
}

export function CandidateCard({ candidate }: CandidateCardProps) {
  const track = useTrackEvent();

  return (
    <article
      className="cursor-pointer rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md"
      role="button"
      tabIndex={0}
      onClick={() => {
        track(ANALYTICS_EVENTS.CANDIDATE_CLICK, {
          section: "elections_candidates",
          source: "candidate_card",
          label: candidate.nome,
          value: candidate.cargoDisputado,
        });
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          track(ANALYTICS_EVENTS.CANDIDATE_CLICK, {
            section: "elections_candidates",
            source: "candidate_card",
            label: candidate.nome,
            value: candidate.cargoDisputado,
          });
        }
      }}
    >
      <h3 className="text-base font-bold text-[#0f3d2e]">{candidate.nome}</h3>
      <p className="mt-2 text-sm text-slate-700">
        Cargo disputado: <span className="font-semibold">{candidate.cargoDisputado}</span>
      </p>
      <p className="text-sm text-slate-700">
        Partido: <span className="font-semibold">{candidate.partido}</span>
      </p>
      <p className="mt-3 text-sm text-slate-600">{candidate.descricao}</p>
    </article>
  );
}
