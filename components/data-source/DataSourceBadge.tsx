import type { DataSourceInfo } from "@/types/dataSource";

type DataSourceBadgeProps = {
  dataSourceInfo: DataSourceInfo;
  className?: string;
};

export function DataSourceBadge({ dataSourceInfo, className = "" }: DataSourceBadgeProps) {
  return (
    <div className={`inline-flex flex-wrap items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] text-slate-600 ${className}`}>
      <span aria-hidden className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-white text-[#0f3d2e]">
        <svg viewBox="0 0 20 20" className="h-3 w-3" fill="currentColor">
          <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm.75 11.5h-1.5V9h1.5v4.5zm0-6h-1.5V6h1.5v1.5z" />
        </svg>
      </span>
      <span className="font-semibold text-slate-700">Fonte: {dataSourceInfo.sourceName}</span>
      {dataSourceInfo.referencePeriod ? (
        <span className="rounded bg-white px-1.5 py-0.5">Período: {dataSourceInfo.referencePeriod}</span>
      ) : null}
      {dataSourceInfo.lastUpdated ? (
        <span>Atualizado: {new Date(dataSourceInfo.lastUpdated).toLocaleString("pt-BR")}</span>
      ) : null}
      {dataSourceInfo.sourceUrl ? (
        <a
          href={dataSourceInfo.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-[#0f3d2e] underline underline-offset-2"
        >
          ver fonte
        </a>
      ) : null}
    </div>
  );
}
