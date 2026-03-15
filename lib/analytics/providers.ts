import type { AnalyticsEventName } from "@/lib/analytics/events";

export type AnalyticsMode = "off" | "debug" | "enabled";

export type AnalyticsPayload = {
  page?: string;
  section?: string;
  source?: string;
  label?: string;
  value?: string | number | boolean;
  timestamp?: string;
  [key: string]: unknown;
};

export type TrackedEvent = {
  name: AnalyticsEventName;
  payload: AnalyticsPayload;
};

export type AnalyticsProviderAdapter = {
  id: string;
  track: (event: TrackedEvent) => void;
};

const debugConsoleProvider: AnalyticsProviderAdapter = {
  id: "console-debug",
  track: (event) => {
    console.info("[analytics:event]", event.name, event.payload);
  },
};

const integrationPlaceholderProvider: AnalyticsProviderAdapter = {
  id: "integration-placeholder",
  track: () => {
    // Estrutura pronta para integração futura com GA, GTM, Plausible, PostHog ou Umami.
  },
};

export function createProviders(mode: AnalyticsMode): AnalyticsProviderAdapter[] {
  if (mode === "off") {
    return [];
  }

  if (mode === "debug") {
    return [debugConsoleProvider];
  }

  return [integrationPlaceholderProvider];
}
