type SectionTitleProps = {
  title: string;
  subtitle?: string;
};

export function SectionTitle({ title, subtitle }: SectionTitleProps) {
  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-bold text-[#0f3d2e] sm:text-3xl">{title}</h2>
      {subtitle ? <p className="text-slate-600">{subtitle}</p> : null}
    </div>
  );
}
