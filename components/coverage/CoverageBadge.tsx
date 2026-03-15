import type { CoverageStatus, SectionCoverageStatus } from "@/types/politician";

type CoverageIndicator = CoverageStatus | SectionCoverageStatus;

type CoverageBadgeProps = {
  status?: CoverageIndicator;
  className?: string;
};

function normalizeStatus(status?: CoverageIndicator): CoverageStatus {
  if (status === "available") {
    return "real";
  }

  if (status === "unavailable") {
    return "integration";
  }

  return status ?? "integration";
}

export function CoverageBadge({ status, className = "" }: CoverageBadgeProps) {
  const normalizedStatus = normalizeStatus(status);

  const label =
    normalizedStatus === "real"
      ? "Cobertura real disponível"
      : normalizedStatus === "partial"
        ? "Cobertura parcial"
        : "Em integração";

  const classNameByStatus =
    normalizedStatus === "real"
      ? "bg-emerald-100 text-emerald-700"
      : normalizedStatus === "partial"
        ? "bg-amber-100 text-amber-800"
        : "bg-slate-100 text-slate-600";

  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${classNameByStatus} ${className}`}>
      {label}
    </span>
  );
}
