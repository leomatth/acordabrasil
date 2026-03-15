import { camaraProvider } from "@/lib/services/politicalProviders/camaraProvider";
import { executiveProvider } from "@/lib/services/politicalProviders/executiveProvider";
import { localPlaceholderProvider } from "@/lib/services/politicalProviders/localPlaceholderProvider";
import { senadoProvider } from "@/lib/services/politicalProviders/senadoProvider";
import { getStateProviders } from "@/lib/services/politicalProviders/states/providerRegistry";

export const POLITICAL_PROVIDERS = [
  camaraProvider,
  senadoProvider,
  ...getStateProviders(),
  executiveProvider,
  localPlaceholderProvider,
];
