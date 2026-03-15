"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { DataSourceBlock } from "@/components/data-source/DataSourceBlock";
import { EmptyState } from "@/components/states/EmptyState";
import { FilterBar } from "@/components/FilterBar";
import { Pagination } from "@/components/Pagination";
import { PoliticianGrid } from "@/components/PoliticianGrid";
import { PoliticianResultsHeader } from "@/components/PoliticianResultsHeader";
import { SearchBar } from "@/components/SearchBar";
import { SectionTitle } from "@/components/SectionTitle";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import { filterPoliticians } from "@/lib/utils/filterPoliticians";
import { paginate } from "@/lib/utils/paginate";
import { buildPartyOptions } from "@/lib/utils/partyNormalization";
import type { DataFetchResult } from "@/types/dataSource";
import {
  type PoliticalOfficeCoverage,
  SUPPORTED_POLITICIAN_OFFICES,
  type PoliticianOffice,
  type PoliticianProfile,
} from "@/types/politician";

type PoliticosPageClientProps = {
  politiciansResult: DataFetchResult<PoliticianProfile[]>;
  officeCoverage: PoliticalOfficeCoverage[];
};

const POLITICIANS_PER_PAGE = 6;

export function PoliticosPageClient({ politiciansResult, officeCoverage }: PoliticosPageClientProps) {
  const track = useTrackEvent();
  const politicians = politiciansResult.data;

  const [search, setSearch] = useState("");
  const [cargoFilter, setCargoFilter] = useState<PoliticianOffice | "all">("all");
  const [partidoFilter, setPartidoFilter] = useState<string | "all">("all");
  const [estadoFilter, setEstadoFilter] = useState<string | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);

  const cargoOptions = useMemo(
    () => SUPPORTED_POLITICIAN_OFFICES,
    [],
  );

  const partidoOptions = useMemo(
    () => buildPartyOptions(politicians),
    [politicians],
  );

  const estadoOptions = useMemo(
    () =>
      Array.from(new Set(politicians.map((item) => item.estado))).sort((a, b) =>
        a.localeCompare(b),
      ),
    [politicians],
  );

  const filteredPoliticians = useMemo(
    () =>
      filterPoliticians(politicians, {
        search,
        cargo: cargoFilter,
        partido: partidoFilter,
        estado: estadoFilter,
      }),
    [politicians, search, cargoFilter, partidoFilter, estadoFilter],
  );

  const paginatedPoliticians = useMemo(
    () => paginate(filteredPoliticians, currentPage, POLITICIANS_PER_PAGE),
    [filteredPoliticians, currentPage],
  );

  const selectedCargoCoverage = useMemo(() => {
    if (cargoFilter === "all") {
      return null;
    }

    return officeCoverage.find((item) => item.cargo === cargoFilter) ?? null;
  }, [cargoFilter, officeCoverage]);

  // Sempre que busca/filtros mudarem, a lista volta para a primeira página.
  useEffect(() => {
    setCurrentPage(1);
  }, [search, cargoFilter, partidoFilter, estadoFilter]);

  useEffect(() => {
    if (!search.trim()) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      track(ANALYTICS_EVENTS.POLITICIAN_SEARCH, {
        section: "politicians_page",
        source: "search_bar",
        label: search.trim(),
      });
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [search, track]);

  useEffect(() => {
    track(ANALYTICS_EVENTS.POLITICIAN_FILTER_CHANGE, {
      section: "politicians_page",
      source: "filter_bar",
      label: "cargo",
      value: cargoFilter,
    });
  }, [cargoFilter, track]);

  useEffect(() => {
    track(ANALYTICS_EVENTS.POLITICIAN_FILTER_CHANGE, {
      section: "politicians_page",
      source: "filter_bar",
      label: "partido",
      value: partidoFilter,
    });
  }, [partidoFilter, track]);

  useEffect(() => {
    track(ANALYTICS_EVENTS.POLITICIAN_FILTER_CHANGE, {
      section: "politicians_page",
      source: "filter_bar",
      label: "estado",
      value: estadoFilter,
    });
  }, [estadoFilter, track]);

  return (
    <main className="container-page space-y-6 py-10">
      <SectionTitle
        title="Busque um político"
        subtitle="Encontre informações sobre cargos, partidos, votações e atuação pública."
      />

      <div>
        <Link
          href="/politicos/ranking"
          className="inline-flex rounded-md border border-[#0f3d2e] px-3 py-2 text-sm font-semibold text-[#0f3d2e] transition hover:bg-[#0f3d2e] hover:text-white"
        >
          Ver ranking de políticos
        </Link>
      </div>

      <DataSourceBlock
        dataSourceInfo={{
          sourceName: "Dados Abertos da Câmara dos Deputados",
          sourceType: "official_portal",
          sourceUrl: "https://dadosabertos.camara.leg.br/",
          referencePeriod: "Mandato legislativo atual",
          lastUpdated: politiciansResult.lastUpdated,
        }}
        className="max-w-2xl"
      />

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-sm font-bold text-[#0f3d2e]">Cobertura por cargo</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {officeCoverage.map((item) => {
            const className =
              item.status === "real"
                ? "bg-emerald-100 text-emerald-700"
                : item.status === "partial"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-slate-100 text-slate-700";

            return (
              <span key={item.cargo} className={`rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}>
                {item.cargo}: {item.label}
              </span>
            );
          })}
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <SearchBar value={search} onChange={setSearch} />

        <FilterBar
          cargo={cargoFilter}
          partido={partidoFilter}
          estado={estadoFilter}
          cargoOptions={cargoOptions}
          partidoOptions={partidoOptions}
          estadoOptions={estadoOptions}
          onCargoChange={setCargoFilter}
          onPartidoChange={setPartidoFilter}
          onEstadoChange={setEstadoFilter}
        />
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm sm:p-6">
        {selectedCargoCoverage && selectedCargoCoverage.status !== "real" ? (
          <article className="rounded-xl border border-dashed border-slate-300 bg-white p-4">
            <p className="text-sm font-semibold text-slate-700">{selectedCargoCoverage.label}</p>
            <p className="mt-1 text-sm text-slate-600">
              {selectedCargoCoverage.integrationMessage || "Dados completos ainda em integração para este cargo."}
            </p>
          </article>
        ) : null}

        <PoliticianResultsHeader
          totalResults={paginatedPoliticians.totalItems}
          currentPage={paginatedPoliticians.currentPage}
          totalPages={paginatedPoliticians.totalPages}
        />

        {paginatedPoliticians.totalItems ? (
          <PoliticianGrid politicians={paginatedPoliticians.items} />
        ) : (
          <EmptyState
            title="Nenhum político encontrado"
            description="Tente outro nome ou ajuste os filtros para ampliar os resultados."
            actionLabel="Limpar filtros"
            onAction={() => {
              setSearch("");
              setCargoFilter("all");
              setPartidoFilter("all");
              setEstadoFilter("all");
              setCurrentPage(1);
            }}
          />
        )}

        <Pagination
          currentPage={paginatedPoliticians.currentPage}
          totalPages={paginatedPoliticians.totalPages}
          onPageChange={setCurrentPage}
        />
      </section>
    </main>
  );
}
