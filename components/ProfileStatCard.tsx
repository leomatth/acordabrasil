type ProfileStatCardProps = {
  label: string;
  value: string;
};

export function ProfileStatCard({ label, value }: ProfileStatCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-bold text-[#0f3d2e]">{value}</p>
    </article>
  );
}
