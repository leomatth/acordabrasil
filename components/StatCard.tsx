import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string;
  icon?: LucideIcon;
};

export function StatCard({ title, value, icon: Icon }: StatCardProps) {
  return (
    <article className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        {Icon ? (
          <span className="rounded-md bg-slate-100 p-1.5 text-[#0f3d2e] transition group-hover:bg-[#ffcc00]/30">
            <Icon size={16} />
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-lg font-bold text-slate-900">{value}</p>
    </article>
  );
}
