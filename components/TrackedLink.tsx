"use client";

import Link from "next/link";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import type { AnalyticsEventName } from "@/lib/analytics/events";
import type { AnalyticsPayload } from "@/lib/analytics/providers";

type TrackedLinkProps = {
  href: string;
  eventName: AnalyticsEventName;
  eventPayload?: AnalyticsPayload;
  className?: string;
  children: React.ReactNode;
};

export function TrackedLink({
  href,
  eventName,
  eventPayload,
  className,
  children,
}: TrackedLinkProps) {
  const track = useTrackEvent();

  return (
    <Link
      href={href}
      className={className}
      onClick={() => track(eventName, eventPayload)}
    >
      {children}
    </Link>
  );
}
