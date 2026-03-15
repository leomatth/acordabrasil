import type { PoliticalProvider } from "@/lib/services/politicalProviders/types";

export const localPlaceholderProvider: PoliticalProvider = {
  key: "placeholder",
  supportedOffices: ["Deputado Estadual", "Governador"],
  coverage: [
    {
      cargo: "Deputado Estadual",
      status: "integration",
      label: "Em integração",
      sourceName: "Assembleias Legislativas estaduais (expansão nacional)",
      integrationMessage: "Integração em expansão para outros estados; piloto real já ativo na ALESP (SP).",
    },
  ],
  list: async () => {
    return {
      data: [],
      source: "api",
      mode: "live",
      lastUpdated: new Date().toISOString(),
    };
  },
};
