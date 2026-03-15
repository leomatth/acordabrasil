"use client";

import { useMemo, useState } from "react";
import { DataSourceBlock } from "@/components/data-source/DataSourceBlock";
import type { SectionCoverageStatus, StaffMember } from "@/types/politician";

type StaffSectionProps = {
  staff: StaffMember[];
  sourceInfo: {
    sourceName: string;
    sourceType: "api" | "document" | "official_portal";
    sourceUrl?: string;
    referencePeriod?: string;
    lastUpdated?: string;
  };
  integrationMessage?: string;
  coverageStatus?: SectionCoverageStatus;
  coverageReason?: string;
};

const INITIAL_ITEMS = 3;

export function StaffSection({
  staff,
  sourceInfo,
  integrationMessage,
  coverageStatus,
  coverageReason,
}: StaffSectionProps) {
  const [showAll, setShowAll] = useState(false);

  const visibleItems = useMemo(() => {
    if (showAll) {
      return staff;
    }

    return staff.slice(0, INITIAL_ITEMS);
  }, [showAll, staff]);

  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-[#0f3d2e]">Equipe do gabinete</h2>

      {staff.length ? (
        <>
          <ul className="space-y-3">
            {visibleItems.map((member) => (
              <li key={`${member.nome}-${member.funcao || ""}`} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-bold text-slate-800">{member.nome}</p>
                {member.funcao ? <p className="text-sm text-slate-600">Função: {member.funcao}</p> : null}
                {member.periodo ? <p className="text-sm text-slate-600">Período: {member.periodo}</p> : null}
                {member.sourceUrl ? (
                  <a
                    href={member.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-flex text-xs font-medium text-[#0f3d2e] underline"
                  >
                    Ver fonte oficial
                  </a>
                ) : (
                  <p className="text-xs text-slate-500">Fonte: {member.sourceName}</p>
                )}
              </li>
            ))}
          </ul>

          {!showAll && staff.length > INITIAL_ITEMS ? (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="inline-flex rounded-md border border-[#0f3d2e] px-3 py-2 text-sm font-semibold text-[#0f3d2e] transition hover:bg-[#0f3d2e] hover:text-white"
            >
              Ver mais
            </button>
          ) : null}
        </>
      ) : (
        <article className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-700">Fonte em integração</p>
          <p className="mt-1 text-sm text-slate-600">
            {integrationMessage || "Dados de assessores ainda não disponíveis de forma segura na fonte atual."}
          </p>
        </article>
      )}

      <DataSourceBlock
        title="Fonte da equipe"
        dataSourceInfo={sourceInfo}
        coverageStatus={coverageStatus}
        coverageReason={coverageReason}
      />
    </section>
  );
}
