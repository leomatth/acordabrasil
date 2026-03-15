import { DataSourceBlock } from "@/components/data-source/DataSourceBlock";
import type { SectionCoverageStatus } from "@/types/politician";

type PresenceCardProps = {
  presencePercent: number | null;
  sessionsCount: number | null;
  integrationMessage?: string;
  coverageStatus?: SectionCoverageStatus;
  coverageReason?: string;
  sourceInfo: {
    sourceName: string;
    sourceType: "api" | "document" | "official_portal";
    sourceUrl?: string;
    referencePeriod?: string;
    lastUpdated?: string;
  };
};

export function PresenceCard({
  presencePercent,
  sessionsCount,
  integrationMessage,
  coverageStatus,
  coverageReason,
  sourceInfo,
}: PresenceCardProps) {
  const hasPresenceData = presencePercent !== null || sessionsCount !== null;

  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-[#0f3d2e]">Presença em atividades oficiais</h2>

      {hasPresenceData ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Percentual de presença</p>
            <p className="mt-2 text-2xl font-extrabold text-[#0f3d2e]">
              {presencePercent === null ? "N/D" : `${presencePercent}%`}
            </p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Atividades/sessões consideradas
            </p>
            <p className="mt-2 text-2xl font-extrabold text-[#0f3d2e]">{sessionsCount ?? "N/D"}</p>
          </article>
        </div>
      ) : (
        <article className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-700">Em integração</p>
          <p className="mt-1 text-sm text-slate-600">
            {integrationMessage || "Dados oficiais de presença ainda não disponíveis para este perfil."}
          </p>
        </article>
      )}

      <DataSourceBlock
        title="Fonte da presença"
        dataSourceInfo={sourceInfo}
        coverageStatus={coverageStatus}
        coverageReason={coverageReason}
      />
    </section>
  );
}
