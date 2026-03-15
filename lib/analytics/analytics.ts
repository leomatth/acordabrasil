import type { AnalyticsEventName } from "@/lib/analytics/events";
import {
  createProviders,
  type AnalyticsMode,
  type AnalyticsPayload,
  type TrackedEvent,
} from "@/lib/analytics/providers";

type AnalyticsState = {
  mode: AnalyticsMode;
  eventCount: number;
  lastEvent: TrackedEvent | null;
};

type AnalyticsListener = (state: AnalyticsState) => void;

const DEFAULT_MODE: AnalyticsMode = "off";

function resolveMode(): AnalyticsMode {
  const value = process.env.NEXT_PUBLIC_ANALYTICS_MODE;

  if (value === "off" || value === "debug" || value === "enabled") {
    return value;
  }

  return DEFAULT_MODE;
}

const analyticsMode = resolveMode();
const providers = createProviders(analyticsMode);
const listeners = new Set<AnalyticsListener>();

let state: AnalyticsState = {
  mode: analyticsMode,
  eventCount: 0,
  lastEvent: null,
};

function notifyListeners() {
  listeners.forEach((listener) => {
    listener(state);
  });
}

export function getAnalyticsMode(): AnalyticsMode {
  return analyticsMode;
}

export function getAnalyticsState(): AnalyticsState {
  return state;
}

export function subscribeAnalyticsState(listener: AnalyticsListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// Não coletar dados pessoais sensíveis.
// Mantenha payloads focados em produto/navegação.
export function trackEvent(name: AnalyticsEventName, payload: AnalyticsPayload = {}): void {
  if (analyticsMode === "off") {
    return;
  }

  const eventPayload: AnalyticsPayload = {
    ...payload,
    timestamp: payload.timestamp ?? new Date().toISOString(),
  };

  const event: TrackedEvent = {
    name,
    payload: eventPayload,
  };

  state = {
    ...state,
    eventCount: state.eventCount + 1,
    lastEvent: event,
  };

  notifyListeners();

  for (const provider of providers) {
    provider.track(event);
  }
}
