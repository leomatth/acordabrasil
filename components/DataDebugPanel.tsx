import type { DataSource, DataMode } from "@/types/dataSource";

type DataDebugPanelProps = {
  mode: DataMode;
  source: DataSource;
  lastUpdated: string;
};

export function DataDebugPanel({ mode, source, lastUpdated }: DataDebugPanelProps) {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <aside className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-600">
      <p className="font-semibold text-slate-700">Debug de dados</p>
      <p>Modo: {mode}</p>
      <p>Origem atual: {source}</p>
      <p>Timestamp: {lastUpdated}</p>
    </aside>
  );
}
