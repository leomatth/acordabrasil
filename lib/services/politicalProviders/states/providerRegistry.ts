import { alspStateProvider } from "@/lib/services/politicalProviders/states/alspProvider";
import type { StatePoliticalProvider } from "@/lib/services/politicalProviders/states/baseStateProvider";
import type { PoliticianOffice } from "@/types/politician";

type ResolveStateProviderParams = {
  cargo: PoliticianOffice;
  estado?: string;
  sourceName?: string;
};

const STATE_PROVIDERS: StatePoliticalProvider[] = [alspStateProvider];

export function getStateProviders(): StatePoliticalProvider[] {
  return STATE_PROVIDERS;
}

export function resolveStateProvider(params: ResolveStateProviderParams): StatePoliticalProvider | null {
  const office = params.cargo;
  const state = String(params.estado ?? "").toUpperCase();

  const directMatch = STATE_PROVIDERS.find((provider) =>
    provider.supportedStateOffices.includes(office as "Deputado Estadual" | "Governador")
    && provider.stateCode === state,
  );

  if (directMatch) {
    return directMatch;
  }

  if (!state && params.sourceName) {
    const normalizedSourceName = params.sourceName.toLowerCase();

    return (
      STATE_PROVIDERS.find((provider) =>
        provider.coverage.some((item) => item.sourceName.toLowerCase().includes(normalizedSourceName)),
      ) || null
    );
  }

  return null;
}

export function hasStateProviderFor(office: PoliticianOffice, state?: string): boolean {
  return Boolean(
    resolveStateProvider({
      cargo: office,
      estado: state,
    }),
  );
}
