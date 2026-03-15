import type { PoliticalProvider } from "@/lib/services/politicalProviders/types";
import type { PoliticianOffice } from "@/types/politician";

export type StatePoliticalProvider = PoliticalProvider & {
  stateCode: string;
  supportedStateOffices: Array<Extract<PoliticianOffice, "Deputado Estadual" | "Governador">>;
};

type StateProviderConfig = {
  stateCode: string;
  provider: PoliticalProvider;
  supportedStateOffices: Array<Extract<PoliticianOffice, "Deputado Estadual" | "Governador">>;
};

export function createStateProvider(config: StateProviderConfig): StatePoliticalProvider {
  return {
    ...config.provider,
    stateCode: config.stateCode.toUpperCase(),
    supportedStateOffices: config.supportedStateOffices,
  };
}
