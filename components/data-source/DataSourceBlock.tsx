import { CoverageBadge } from "@/components/coverage/CoverageBadge";
import type { DataSourceInfo } from "@/types/dataSource";
import type { CoverageStatus, SectionCoverageStatus } from "@/types/politician";

type DataSourceBlockProps = {
  title?: string;
  dataSourceInfo: DataSourceInfo;
  coverageStatus?: CoverageStatus | SectionCoverageStatus;
  coverageReason?: string;
  className?: string;
};

export function DataSourceBlock({
  title = "Fonte dos dados",
  dataSourceInfo,
  coverageStatus,
  coverageReason,
  className = "",
}: DataSourceBlockProps) {
  return (
    <section className={`rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2 text-xs text-slate-600 ${className}`}>
      <div className="flex flex-wrap items-center gap-2">
        <span
          aria-hidden
          className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#0f3d2e]"
        >
          <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor">
            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm.75 11.5h-1.5V9h1.5v4.5zm0-6h-1.5V6h1.5v1.5z" />
          </svg>
        </span>
        <p className="font-semibold text-slate-700">{title}</p>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
        {coverageStatus ? <CoverageBadge status={coverageStatus} /> : null}
        <p>
          <span className="font-semibold">Fonte:</span> {dataSourceInfo.sourceName}
        </p>
        {dataSourceInfo.referencePeriod ? (
          <p>
            <span className="font-semibold">Período:</span> {dataSourceInfo.referencePeriod}
          </p>
        ) : null}
        {dataSourceInfo.lastUpdated ? (
          <p>
            <span className="font-semibold">Atualizado:</span>{" "}
            {new Date(dataSourceInfo.lastUpdated).toLocaleString("pt-BR")}
          </p>
        ) : null}
        {dataSourceInfo.sourceUrl ? (
          <a
            href={dataSourceInfo.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-md border border-[#0f3d2e] px-2.5 py-1 font-semibold text-[#0f3d2e] transition hover:bg-[#0f3d2e] hover:text-white"
          >
            Ver fonte oficial
          </a>
        ) : null}
      </div>

      {coverageReason ? <p className="mt-2 text-[11px] text-slate-500">{coverageReason}</p> : null}
    </section>
  );
}
