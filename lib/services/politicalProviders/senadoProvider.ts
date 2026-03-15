import { buildPoliticianSlug } from "@/lib/utils/politicianSlug";
import type { PoliticalProvider } from "@/lib/services/politicalProviders/types";
import { buildScopedId } from "@/lib/services/politicalProviders/types";
import type { PoliticianProfile } from "@/types/politician";

type SenadoParlamentarRaw = {
  IdentificacaoParlamentar?: {
    CodigoParlamentar?: string;
    NomeParlamentar?: string;
    SiglaPartidoParlamentar?: string;
    UfParlamentar?: string;
    UrlFotoParlamentar?: string;
    UrlPaginaParlamentar?: string;
    EmailParlamentar?: string;
  };
};

function normalizeSenadoPhotoUrl(value?: string): string {
  const raw = String(value ?? "").trim();

  if (!raw) {
    return "/placeholder-politico.svg";
  }

  return raw.replace(/^http:\/\//i, "https://");
}

async function fetchSenadoresAtuais(): Promise<SenadoParlamentarRaw[]> {
  const response = await fetch("https://legis.senado.leg.br/dadosabertos/senador/lista/atual.json", {
    headers: {
      accept: "application/json",
    },
    next: {
      revalidate: 60 * 10,
    },
  });

  if (!response.ok) {
    throw new Error(`Falha na API do Senado (${response.status})`);
  }

  const payload = (await response.json()) as {
    ListaParlamentarEmExercicio?: {
      Parlamentares?: {
        Parlamentar?: SenadoParlamentarRaw[];
      };
    };
  };

  return payload.ListaParlamentarEmExercicio?.Parlamentares?.Parlamentar ?? [];
}

function mapSenadorToProfile(item: SenadoParlamentarRaw): PoliticianProfile | null {
  const info = item.IdentificacaoParlamentar;
  const sourceId = Number(info?.CodigoParlamentar ?? 0);

  if (!Number.isFinite(sourceId) || sourceId <= 0) {
    return null;
  }

  const id = buildScopedId("Senador", sourceId);
  const nome = String(info?.NomeParlamentar ?? "").trim();

  if (!nome) {
    return null;
  }

  const lastUpdated = new Date().toISOString();

  return {
    id,
    slug: buildPoliticianSlug(id, nome),
    nome,
    cargo: "Senador",
    partido: String(info?.SiglaPartidoParlamentar ?? "SEM_PARTIDO"),
    estado: String(info?.UfParlamentar ?? "--").toUpperCase(),
    foto: normalizeSenadoPhotoUrl(info?.UrlFotoParlamentar),
    resumo: "Senador em exercício com dados oficiais do Senado Federal.",
    biografia: "Perfil integrado com dados públicos do Senado Federal.",
    biografiaCurta: "Dados oficiais do Senado Federal.",
    gastosGabinete: 0,
    presencaSessoes: 0,
    votacoesRelevantes: [],
    principaisBandeiras: ["Representação federativa", "Legislativo"],
    email: info?.EmailParlamentar,
    source: "api",
    lastUpdated,
    dataSourceInfo: {
      sourceName: "Dados Abertos do Senado Federal",
      sourceType: "api",
      sourceUrl: String(info?.UrlPaginaParlamentar ?? "").trim() || "https://legis.senado.leg.br/dadosabertos/",
      referencePeriod: "Mandato atual",
      lastUpdated,
    },
    coverageStatus: "real",
  };
}

export const senadoProvider: PoliticalProvider = {
  key: "senado",
  supportedOffices: ["Senador"],
  coverage: [
    {
      cargo: "Senador",
      status: "real",
      label: "Cobertura real disponível",
      sourceName: "Dados Abertos do Senado Federal",
      sourceUrl: "https://legis.senado.leg.br/dadosabertos/",
      referencePeriod: "Mandato atual",
    },
  ],
  list: async () => {
    const data = await fetchSenadoresAtuais();

    return {
      data: data
        .map((item) => mapSenadorToProfile(item))
        .filter((item): item is PoliticianProfile => Boolean(item)),
      source: "api",
      mode: "live",
      lastUpdated: new Date().toISOString(),
    };
  },
};
