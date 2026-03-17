import Link from "next/link";
import { DataSourceBlock } from "@/components/data-source/DataSourceBlock";
import type { LegislationItem } from "@/types/legislation";
import type { SectionCoverageStatus } from "@/types/politician";

type RelatedLegislationSectionProps = {
  items: LegislationItem[];
  hasReliableIntegration: boolean;
  sourceInfo: {
    sourceName: string;
    sourceType: "api" | "document" | "official_portal";
    sourceUrl?: string;
    referencePeriod?: string;
    lastUpdated?: string;
  };
  coverageStatus?: SectionCoverageStatus;
  coverageReason?: string;
};

const statusClasses: Record<LegislationItem["status"], string> = {
  Aprovada: "bg-emerald-100 text-emerald-700",
  Rejeitada: "bg-rose-100 text-rose-700",
  "Em tramitação": "bg-amber-100 text-amber-700",
};

export function RelatedLegislationSection({
  items,
  hasReliableIntegration,
  sourceInfo,
  coverageStatus,
  coverageReason,
}: RelatedLegislationSectionProps) {
  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-[#0f3d2e]">PECs e proposições relacionadas</h2>

      {items.length ? (
        <div className="space-y-3">
          {items.map((item) => (
            <article key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {item.siglaTipo || "Proposição"} {item.numero}{item.ano ? `/${item.ano}` : ""}
                  </p>
                  <h3 className="text-base font-bold text-[#0f3d2e]">{item.titulo}</h3>
                  <p className="mt-1 text-sm text-slate-600">{item.ementa || item.resumo || item.assunto}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Vínculo oficial: {item.relationLabel || "Outro vínculo oficial comprovado"}
                  </p>
                  {item.relationSource ? (
                    <p className="mt-1 text-xs text-slate-500">Critério: {item.relationSource}</p>
                  ) : null}
                </div>

                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[item.status]}`}>
                  {item.status}
                </span>
              </div>

              <div className="mt-3">
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/pecs/${item.id}`}
                    className="inline-flex rounded-md border border-[#0f3d2e] px-3 py-1.5 text-xs font-semibold text-[#0f3d2e] transition hover:bg-[#0f3d2e] hover:text-white"
                  >
                    Ver proposição
                  </Link>
                  {item.urlIntegra ? (
                    <a
                      href={item.urlIntegra}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-[#0f3d2e] hover:text-[#0f3d2e]"
                    >
                      Ver fonte oficial
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <article className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-700">
            {hasReliableIntegration ? "Nenhuma proposição relacionada encontrada" : "Cobertura parcial"}
          </p>
          <p className="mt-1 text-sm text-slate-600">
            {hasReliableIntegration
              ? "No momento não há vínculos seguros deste político com proposições retornadas." :
              "As relações oficiais disponíveis ainda não permitem cobrir todos os vínculos com segurança no recorte atual."}
          </p>
        </article>
      )}

      <DataSourceBlock
        title="Fonte das proposições"
        dataSourceInfo={sourceInfo}
        coverageStatus={coverageStatus}
        coverageReason={coverageReason}
      />
    </section>
  );
}
