import type { LucideIcon } from "lucide-react";
import { getNumberScaleClass } from "@/lib/utils/numberDisplay";

type StatCardProps = {
  title: string;
  value: string;
  icon?: LucideIcon;
};

export function StatCard({ title, value, icon: Icon }: StatCardProps) {
  const valueScaleClass = getNumberScaleClass(value, "compact");

  return (
    <article className="group min-h-[132px] min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <p className="pr-2 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:text-sm">
          {title}
        </p>
        {Icon ? (
          <span className="shrink-0 rounded-md bg-slate-100 p-1.5 text-[#0f3d2e] transition group-hover:bg-[#ffcc00]/30">
            <Icon size={16} />
          </span>
        ) : null}
      </div>
      <p
        className={`mt-3 max-w-full break-all font-bold leading-[1.15] text-slate-900 ${valueScaleClass}`}
      >
        {value}
      </p>
    </article>
  );
}
