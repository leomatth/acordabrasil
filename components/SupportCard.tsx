type SupportCardProps = {
  title: string;
  description: string;
};

export function SupportCard({ title, description }: SupportCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <h3 className="text-base font-bold text-[#0f3d2e]">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
    </article>
  );
}
