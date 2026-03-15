import type { ReactNode } from "react";

type InfoSectionProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function InfoSection({ title, subtitle, children }: InfoSectionProps) {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-[#0f3d2e]">{title}</h2>
        {subtitle ? <p className="text-sm text-slate-600">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}
