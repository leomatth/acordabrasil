import Image from "next/image";
import { CoverageBadge } from "@/components/coverage/CoverageBadge";
import { TrackedLink } from "@/components/TrackedLink";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import type { PoliticianProfile } from "@/types/politician";

type PoliticianCardProps = {
  politician: PoliticianProfile;
};

export function PoliticianCard({ politician }: PoliticianCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center gap-3">
        <Image
          src={politician.foto}
          alt={`Foto de ${politician.nome}`}
          width={56}
          height={56}
          className="rounded-full border border-slate-200 bg-slate-100"
        />

        <div>
          <h3 className="text-base font-bold text-[#0f3d2e]">{politician.nome}</h3>
          <p className="text-sm text-slate-600">{politician.cargo}</p>
        </div>
      </div>

      <div className="mt-4 space-y-1 text-sm text-slate-700">
        <p>
          Partido: <span className="font-semibold">{politician.partido}</span>
        </p>
        <p>
          Estado: <span className="font-semibold">{politician.estado}</span>
        </p>
        <p>
          <CoverageBadge status={politician.coverageStatus} />
        </p>
      </div>

      <p className="mt-3 text-sm text-slate-600">{politician.resumo}</p>

      <TrackedLink
        href={`/politicos/${politician.slug}`}
        eventName={ANALYTICS_EVENTS.POLITICIAN_PROFILE_VIEW}
        eventPayload={{ section: "politician_list", source: "politician_card", label: politician.slug }}
        className="mt-4 inline-flex rounded-md bg-[#0f3d2e] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#14553f]"
      >
        Ver perfil
      </TrackedLink>
    </article>
  );
}
