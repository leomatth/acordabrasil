import { TrackedLink } from "@/components/TrackedLink";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";

type CTASectionProps = {
  title: string;
  description: string;
  buttonLabel: string;
  href: string;
};

export function CTASection({ title, description, buttonLabel, href }: CTASectionProps) {
  return (
    <section className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-white p-6 shadow-sm">
      <h3 className="text-xl font-bold text-[#0f3d2e]">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>

      <TrackedLink
        href={href}
        eventName={ANALYTICS_EVENTS.CTA_CLICK}
        eventPayload={{ section: "cta_section", source: "content", label: buttonLabel }}
        className="mt-4 inline-flex rounded-md bg-[#0f3d2e] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#14553f]"
      >
        {buttonLabel}
      </TrackedLink>
    </section>
  );
}
