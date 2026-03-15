"use client";

import type { PoliticianOffice } from "@/types/politician";

type RankingFiltersValue = {
  cargo: PoliticianOffice | "all";
  partido: string | "all";
  estado: string | "all";
  periodo: string | "all";
};

type RankingFiltersProps = {
  value: RankingFiltersValue;
  cargoOptions: PoliticianOffice[];
  partidoOptions: string[];
  estadoOptions: string[];
  periodOptions: string[];
  onCargoChange: (value: PoliticianOffice | "all") => void;
  onPartidoChange: (value: string | "all") => void;
  onEstadoChange: (value: string | "all") => void;
  onPeriodoChange: (value: string | "all") => void;
};

export function RankingFilters({
  value,
  cargoOptions,
  partidoOptions,
  estadoOptions,
  periodOptions,
  onCargoChange,
  onPartidoChange,
  onEstadoChange,
  onPeriodoChange,
}: RankingFiltersProps) {
  return (
    <section className="grid gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
      <label className="space-y-1 text-sm text-slate-700">
        <span className="font-medium">Cargo</span>
        <select
          value={value.cargo}
          onChange={(event) => onCargoChange(event.target.value as PoliticianOffice | "all")}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none transition focus:border-[#0f3d2e]"
        >
          <option value="all">Todos</option>
          {cargoOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className="space-y-1 text-sm text-slate-700">
        <span className="font-medium">Partido</span>
        <select
          value={value.partido}
          onChange={(event) => onPartidoChange(event.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none transition focus:border-[#0f3d2e]"
        >
          <option value="all">Todos</option>
          {partidoOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className="space-y-1 text-sm text-slate-700">
        <span className="font-medium">Estado</span>
        <select
          value={value.estado}
          onChange={(event) => onEstadoChange(event.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none transition focus:border-[#0f3d2e]"
        >
          <option value="all">Todos</option>
          {estadoOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className="space-y-1 text-sm text-slate-700">
        <span className="font-medium">Período</span>
        <select
          value={value.periodo}
          onChange={(event) => onPeriodoChange(event.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none transition focus:border-[#0f3d2e]"
        >
          <option value="all">Todos</option>
          {periodOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    </section>
  );
}
