import type { PoliticianOffice } from "@/types/politician";

type FilterBarProps = {
  cargo: PoliticianOffice | "all";
  partido: string | "all";
  estado: string | "all";
  cargoOptions: PoliticianOffice[];
  partidoOptions: string[];
  estadoOptions: string[];
  onCargoChange: (value: PoliticianOffice | "all") => void;
  onPartidoChange: (value: string | "all") => void;
  onEstadoChange: (value: string | "all") => void;
};

export function FilterBar({
  cargo,
  partido,
  estado,
  cargoOptions,
  partidoOptions,
  estadoOptions,
  onCargoChange,
  onPartidoChange,
  onEstadoChange,
}: FilterBarProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <label className="space-y-1 text-sm text-slate-700">
        <span className="font-medium">Cargo</span>
        <select
          value={cargo}
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
          value={partido}
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
          value={estado}
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
    </div>
  );
}
