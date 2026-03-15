type SkeletonCardProps = {
  className?: string;
};

export function SkeletonCard({ className = "" }: SkeletonCardProps) {
  return (
    <article
      className={`animate-pulse rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}
      aria-hidden
    >
      <div className="h-3 w-24 rounded bg-slate-200" />
      <div className="mt-4 h-8 w-32 rounded bg-slate-200" />
      <div className="mt-4 h-3 w-full rounded bg-slate-200" />
      <div className="mt-2 h-3 w-4/5 rounded bg-slate-200" />
    </article>
  );
}
