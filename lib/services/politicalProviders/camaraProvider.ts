import { mapDeputadoListItemToPolitician } from "@/lib/adapters/camaraDeputadosAdapter";
import { fetchAllDeputadosFromCamara } from "@/lib/services/camaraService";
import type { PoliticalProvider } from "@/lib/services/politicalProviders/types";

export const camaraProvider: PoliticalProvider = {
  key: "camara",
  supportedOffices: ["Deputado Federal"],
  coverage: [
    {
      cargo: "Deputado Federal",
      status: "real",
      label: "Cobertura real disponível",
      sourceName: "Dados Abertos da Câmara dos Deputados",
      sourceUrl: "https://dadosabertos.camara.leg.br/",
      referencePeriod: "Mandato legislativo atual",
    },
  ],
  list: async () => {
    const data = await fetchAllDeputadosFromCamara();

    return {
      data: data.map((item) =>
        mapDeputadoListItemToPolitician(
          item as Parameters<typeof mapDeputadoListItemToPolitician>[0],
        ),
      ),
      source: "api",
      mode: "live",
      lastUpdated: new Date().toISOString(),
    };
  },
};
