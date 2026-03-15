"use client";

import { useEffect, useMemo, useState } from "react";
import { DataOriginBadge } from "@/components/DataOriginBadge";
import { PecCard } from "@/components/PecCard";
import { SectionTitle } from "@/components/SectionTitle";
import { EmptyState } from "@/components/states/EmptyState";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import { filterPecs, type PecStatusFilter, type PecSubjectFilter } from "@/lib/pecFilters";
import type { DataFetchResult } from "@/types/dataSource";
import type { LegislationItem, LegislationStatus, LegislationSubject } from "@/types/legislation";

type PecsPageClientProps = {
  legislationResult: DataFetchResult<LegislationItem[]>;
};

export function PecsPageClient({ legislationResult }: PecsPageClientProps) {
  const track = useTrackEvent();
  const PAGE_SIZE = 4;
  const pecs = legislationResult.data;

  const statusOptions = useMemo(
    () => Array.from(new Set(pecs.map((item) => item.status))) as LegislationStatus[],
    [pecs],
  );

  const subjectOptions = useMemo(
    () => Array.from(new Set(pecs.map((item) => item.assunto))) as LegislationSubject[],
    [pecs],
  );

  const [statusFilter, setStatusFilter] = useState<PecStatusFilter>("all");
  const [subjectFilter, setSubjectFilter] = useState<PecSubjectFilter>("all");
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPecs = useMemo(
    () =>
      filterPecs(pecs, {
        status: statusFilter,
        subject: subjectFilter,
        keyword,
      }),
    [pecs, statusFilter, subjectFilter, keyword],
  );

  const totalPages = Math.max(1, Math.ceil(filteredPecs.length / PAGE_SIZE));

  const paginatedPecs = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredPecs.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredPecs, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, subjectFilter, keyword]);

  useEffect(() => {
    track(ANALYTICS_EVENTS.PEC_FILTER_CHANGE, {
      section: "pec_filters",
      source: "pecs_page",
      label: "status",
      value: statusFilter,
    });
  }, [statusFilter, track]);

  useEffect(() => {
    track(ANALYTICS_EVENTS.PEC_FILTER_CHANGE, {
      section: "pec_filters",
      source: "pecs_page",
      label: "subject",
      value: subjectFilter,
    });
  }, [subjectFilter, track]);

  useEffect(() => {
    if (!keyword.trim()) {
      return;
    }

    track(ANALYTICS_EVENTS.PEC_FILTER_CHANGE, {
      section: "pec_filters",
      source: "pecs_page",
      label: "keyword",
      value: keyword.trim(),
    });
  }, [keyword, track]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <main className="container-page space-y-6 py-10">
      <SectionTitle
        title="PECs e Projetos de Lei"
        subtitle="Filtre, pesquise e acompanhe propostas legislativas com impacto no orçamento público."
      />

      <DataOriginBadge
        source={legislationResult.source}
        mode={legislationResult.mode}
        lastUpdated={legislationResult.lastUpdated}
        errorMessage={legislationResult.errorMessage}
        className="max-w-md"
      />

      <section className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[1fr_1fr_1.2fr]">
        <label className="space-y-1 text-sm text-slate-600">
          <span className="font-medium">Status</span>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as LegislationStatus | "all")}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-800 outline-none transition focus:border-[#0f3d2e]"
          >
            <option value="all">Todos</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1 text-sm text-slate-600">
          <span className="font-medium">Assunto</span>
          <select
            value={subjectFilter}
            onChange={(event) =>
              setSubjectFilter(event.target.value as LegislationSubject | "all")
            }
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-800 outline-none transition focus:border-[#0f3d2e]"
          >
            <option value="all">Todos</option>
            {subjectOptions.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1 text-sm text-slate-600">
          <span className="font-medium">Busca por palavra-chave</span>
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Ex.: reforma, saúde, câmara..."
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#0f3d2e]"
          />
        </label>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-600">
          <p>{filteredPecs.length} projeto(s) encontrado(s).</p>
          <p>
            Página {currentPage} de {totalPages}
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {paginatedPecs.map((pec) => (
            <PecCard key={pec.id} pec={pec} variant="list" buttonLabel="Detalhes" />
          ))}
        </div>

        {filteredPecs.length > PAGE_SIZE ? (
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Anterior
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => {
              const isActive = page === currentPage;

              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`rounded-md border px-3 py-1.5 text-sm font-medium transition ${
                    isActive
                      ? "border-[#0f3d2e] bg-[#0f3d2e] text-white"
                      : "border-slate-300 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              disabled={currentPage === totalPages}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Próxima
            </button>
          </div>
        ) : null}

        {!filteredPecs.length ? (
          <EmptyState
            title="Nenhuma PEC encontrada"
            description="Ajuste os filtros para visualizar projetos legislativos."
            actionLabel="Limpar filtros"
            onAction={() => {
              setStatusFilter("all");
              setSubjectFilter("all");
              setKeyword("");
            }}
          />
        ) : null}
      </section>
    </main>
  );
}
