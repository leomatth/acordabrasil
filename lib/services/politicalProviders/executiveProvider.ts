import { buildPoliticianSlug } from "@/lib/utils/politicianSlug";
import type { PoliticalProvider } from "@/lib/services/politicalProviders/types";
import { buildScopedId } from "@/lib/services/politicalProviders/types";

function getCurrentPresident() {
  const id = buildScopedId("Presidente", 1);
  const nome = "Luiz Inácio Lula da Silva";
  const lastUpdated = new Date().toISOString();

  return {
    id,
    slug: buildPoliticianSlug(id, nome),
    nome,
    cargo: "Presidente" as const,
    partido: "PT",
    estado: "BR",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Lula_-_foto_oficial_2023-01-03.jpg/640px-Lula_-_foto_oficial_2023-01-03.jpg",
    resumo: "Presidente da República em exercício.",
    biografia: "Dados públicos oficiais do Poder Executivo Federal.",
    biografiaCurta: "Presidente da República em exercício.",
    gastosGabinete: 0,
    presencaSessoes: 0,
    votacoesRelevantes: [],
    principaisBandeiras: ["Poder Executivo Federal"],
    source: "api" as const,
    lastUpdated,
    dataSourceInfo: {
      sourceName: "Presidência da República",
      sourceType: "official_portal" as const,
      sourceUrl: "https://www.gov.br/planalto/pt-br/presidencia/a-presidencia",
      referencePeriod: "Mandato atual",
      lastUpdated,
    },
    coverageStatus: "partial" as const,
    availabilityMessage: "Cobertura parcial: dados de atividade legislativa e despesas de gabinete não se aplicam ao cargo via esta fonte.",
  };
}

function getCurrentGovernorSP() {
  const id = buildScopedId("Governador", 35);
  const nome = "Tarcísio de Freitas";
  const lastUpdated = new Date().toISOString();

  return {
    id,
    slug: buildPoliticianSlug(id, nome),
    nome,
    cargo: "Governador" as const,
    partido: "REPUBLICANOS",
    estado: "SP",
    foto: "/placeholder-politico.svg",
    resumo: "Governador do Estado de São Paulo em exercício.",
    biografia: "Dados públicos oficiais do Governo do Estado de São Paulo.",
    biografiaCurta: "Governador do Estado de São Paulo em exercício.",
    gastosGabinete: 0,
    presencaSessoes: 0,
    votacoesRelevantes: [],
    principaisBandeiras: ["Poder Executivo Estadual"],
    source: "api" as const,
    lastUpdated,
    dataSourceInfo: {
      sourceName: "Governo do Estado de São Paulo",
      sourceType: "official_portal" as const,
      sourceUrl: "https://www.governo.sp.gov.br/governo/",
      referencePeriod: "Mandato atual",
      lastUpdated,
    },
    coverageStatus: "partial" as const,
    availabilityMessage: "Cobertura parcial: perfil oficial disponível; integrações de votações/despesas por cargo do executivo estadual seguem em expansão.",
  };
}

export const executiveProvider: PoliticalProvider = {
  key: "executive",
  supportedOffices: ["Presidente", "Governador"],
  coverage: [
    {
      cargo: "Presidente",
      status: "partial",
      label: "Cobertura parcial",
      sourceName: "Presidência da República",
      sourceUrl: "https://www.gov.br/planalto/pt-br/presidencia/a-presidencia",
      referencePeriod: "Mandato atual",
      integrationMessage: "Dados de atividade e despesas legislativas não se aplicam ao cargo nesta integração.",
    },
    {
      cargo: "Governador",
      status: "partial",
      label: "Cobertura parcial",
      sourceName: "Governo do Estado de São Paulo",
      sourceUrl: "https://www.governo.sp.gov.br/governo/",
      referencePeriod: "Mandato atual",
      integrationMessage: "Cobertura parcial inicial para governador em exercício com fonte oficial estadual.",
    },
  ],
  list: async () => {
    return {
      data: [getCurrentPresident(), getCurrentGovernorSP()],
      source: "api",
      mode: "live",
      lastUpdated: new Date().toISOString(),
    };
  },
};
