import { TrackedLink } from "@/components/TrackedLink";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import { APP_NAME, NAV_LINKS } from "@/lib/constants";

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="container-page flex h-16 items-center justify-between gap-4">
        <TrackedLink
          href="/"
          eventName={ANALYTICS_EVENTS.CTA_CLICK}
          eventPayload={{ section: "navbar", source: "brand", label: APP_NAME }}
          className="text-xl font-bold text-[#0f3d2e]"
        >
          {APP_NAME}
        </TrackedLink>

        <ul className="flex flex-wrap items-center justify-end gap-3 text-sm sm:gap-5">
          {NAV_LINKS.map((item) => (
            <li key={item.href}>
              <TrackedLink
                href={item.href}
                eventName={ANALYTICS_EVENTS.CTA_CLICK}
                eventPayload={{ section: "navbar", source: "menu", label: item.label }}
                className="font-medium text-slate-700 transition hover:text-[#0f3d2e]"
              >
                {item.label}
              </TrackedLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
