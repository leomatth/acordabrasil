"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  getAnalyticsMode,
  getAnalyticsState,
  subscribeAnalyticsState,
  trackEvent,
} from "@/lib/analytics/analytics";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [state, setState] = useState(getAnalyticsState());

  useEffect(() => {
    return subscribeAnalyticsState((nextState) => {
      setState(nextState);
    });
  }, []);

  useEffect(() => {
    trackEvent(ANALYTICS_EVENTS.PAGE_VIEW, {
      page: pathname,
      section: "navigation",
      source: "app_router",
    });
  }, [pathname]);

  const analyticsMode = getAnalyticsMode();
  const canShowDebug = process.env.NODE_ENV === "development";

  return (
    <>
      {children}
      {canShowDebug ? (
        <aside className="fixed bottom-4 right-4 z-[60] max-w-xs rounded-lg border border-dashed border-slate-300 bg-white/95 px-3 py-2 text-xs text-slate-600 shadow-sm backdrop-blur">
          <p className="font-semibold text-slate-700">Analytics debug</p>
          <p>mode: {analyticsMode}</p>
          <p>events: {state.eventCount}</p>
          <p className="truncate">last: {state.lastEvent?.name ?? "none"}</p>
        </aside>
      ) : null}
    </>
  );
}
