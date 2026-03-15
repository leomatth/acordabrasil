import { spAlespProfileProvider } from "@/lib/services/stateDeputyProfile/spAlespProfileProvider";
import type { StateDeputyProfileProvider } from "@/lib/services/stateDeputyProfile/types";

const STATE_DEPUTY_PROFILE_PROVIDERS: StateDeputyProfileProvider[] = [spAlespProfileProvider];

export function resolveStateDeputyProfileProvider(stateCode?: string): StateDeputyProfileProvider | null {
  const normalizedStateCode = String(stateCode ?? "").toUpperCase();

  if (!normalizedStateCode) {
    return null;
  }

  return (
    STATE_DEPUTY_PROFILE_PROVIDERS.find((provider) => provider.stateCode === normalizedStateCode)
    || null
  );
}
