import type { DataSource, DataMode } from "@/types/dataSource";

type DataOriginBadgeProps = {
  source: DataSource;
  mode: DataMode;
  lastUpdated: string;
  errorMessage?: string;
  className?: string;
};

function formatLastUpdated(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Última atualização indisponível";
  }

  return `Última atualização: ${date.toLocaleString("pt-BR")}`;
}

export function DataOriginBadge({
  source,
  mode: _mode,
  lastUpdated,
  errorMessage,
  className = "",
}: DataOriginBadgeProps) {
  const sourceLabel = source === "api"
    ? "Dados públicos atualizados"
    : "Dados públicos indisponíveis no momento";

  return (
    <div
      className={`rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 ${className}`}
    >
      <p className="font-semibold text-slate-700">{sourceLabel}</p>
      <p>{formatLastUpdated(lastUpdated)}</p>
      {errorMessage ? <p className="mt-1 text-amber-700">{errorMessage}</p> : null}
    </div>
  );
}
