"use client";

import { useEffect } from "react";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import type { AnalyticsEventName } from "@/lib/analytics/events";
import type { AnalyticsPayload } from "@/lib/analytics/providers";

type TrackOnViewProps = {
  eventName: AnalyticsEventName;
  payload?: AnalyticsPayload;
};

export function TrackOnView({ eventName, payload }: TrackOnViewProps) {
  const track = useTrackEvent();

  useEffect(() => {
    track(eventName, payload);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
