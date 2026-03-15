import { DataOriginBadge } from "@/components/DataOriginBadge";
import type { DataFetchResult } from "@/types/dataSource";
import type { PoliticianProfile } from "@/types/politician";

type ProfileInfoSectionProps = {
  politician: PoliticianProfile;
  profileResult: DataFetchResult<PoliticianProfile | null>;
};

export function ProfileInfoSection({ politician, profileResult }: ProfileInfoSectionProps) {
  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-[#0f3d2e]">Informações do político</h2>

      <div className="grid gap-3 text-sm text-slate-700 sm:grid-cols-2 lg:grid-cols-3">
        <p>
          <span className="font-medium text-slate-500">Nome completo:</span> {politician.nome}
        </p>
        <p>
          <span className="font-medium text-slate-500">Cargo:</span> {politician.cargo}
        </p>
        <p>
          <span className="font-medium text-slate-500">Partido:</span> {politician.partido}
        </p>
        <p>
          <span className="font-medium text-slate-500">Estado:</span> {politician.estado}
        </p>
        <p>
          <span className="font-medium text-slate-500">E-mail institucional:</span>{" "}
          {politician.email ? (
            <a href={`mailto:${politician.email}`} className="font-semibold text-[#0f3d2e] underline">
              {politician.email}
            </a>
          ) : (
            <span className="text-slate-500">Indisponível no momento</span>
          )}
        </p>
        <p>
          <span className="font-medium text-slate-500">Legislatura/Situação:</span>{" "}
          {politician.legislatura?.trim() || politician.situacao?.trim() || "Indisponível no momento"}
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Biografia curta</p>
        <p className="mt-2 text-sm text-slate-700">
          {politician.biografiaCurta?.trim() || "Biografia curta em integração."}
        </p>
      </div>

      <DataOriginBadge
        source={profileResult.source}
        mode={profileResult.mode}
        lastUpdated={profileResult.lastUpdated}
        errorMessage={profileResult.errorMessage}
        className="max-w-md"
      />
    </section>
  );
}
