"use client";

import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/analytics/analytics";
import type { AnalyticsEventName } from "@/lib/analytics/events";
import type { AnalyticsPayload } from "@/lib/analytics/providers";

export function useTrackEvent() {
  const pathname = usePathname();

  return (eventName: AnalyticsEventName, payload: AnalyticsPayload = {}) => {
    trackEvent(eventName, {
      page: pathname,
      ...payload,
    });
  };
}
