import { getAlespStateDeputados } from "@/lib/services/alespStateDeputyService";
import { createStateProvider, type StatePoliticalProvider } from "@/lib/services/politicalProviders/states/baseStateProvider";

export const alspStateProvider: StatePoliticalProvider = createStateProvider({
  stateCode: "SP",
  supportedStateOffices: ["Deputado Estadual"],
  provider: {
    key: "alesp",
    supportedOffices: ["Deputado Estadual"],
    coverage: [
      {
        cargo: "Deputado Estadual",
        status: "partial",
        label: "Cobertura parcial",
        sourceName: "Dados Oficiais da ALESP",
        sourceUrl: "https://www.al.sp.gov.br/",
        referencePeriod: "Mandato atual",
        integrationMessage:
          "Cobertura real parcial para Deputado Estadual (ALESP): perfil, presença em plenário e prestação de contas por natureza de despesa.",
      },
    ],
    list: async () => {
      const result = await getAlespStateDeputados();

      return {
        data: result.data,
        source: result.source,
        mode: result.mode,
        lastUpdated: result.lastUpdated,
        errorMessage: result.errorMessage,
      };
    },
  },
});
