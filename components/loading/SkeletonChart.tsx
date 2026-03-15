type SkeletonChartProps = {
  className?: string;
  heightClassName?: string;
};

export function SkeletonChart({
  className = "",
  heightClassName = "h-72",
}: SkeletonChartProps) {
  return (
    <div
      className={`animate-pulse rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${heightClassName} ${className}`}
      aria-hidden
    >
      <div className="h-full w-full rounded bg-slate-200" />
    </div>
  );
}
