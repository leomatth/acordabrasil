import type { DataFetchResult, DataSourceInfo } from "@/types/dataSource";
import type { LegislationItem, LegislationStatus, LegislationSubject } from "@/types/legislation";
import type { PresenceInsight, VotingRecord } from "@/types/politician";

type SenadoProcessoItem = {
  id?: number;
  codigoMateria?: number;
  identificacao?: string;
  ementa?: string;
  autoria?: string;
  tramitando?: string;
  siglaTipoDeliberacao?: string;
  dataApresentacao?: string;
  dataDeliberacao?: string;
  dataUltimaAtualizacao?: string;
  tipoConteudo?: string;
  tipoDocumento?: string;
  urlDocumento?: string;
};

const PROCESSO_ENDPOINT = "https://legis.senado.leg.br/dadosabertos/processo";
const SOURCE_INFO_BASE: Omit<DataSourceInfo, "referencePeriod" | "lastUpdated"> = {
  sourceName: "Dados Abertos do Senado Federal",
  sourceType: "api",
  sourceUrl: PROCESSO_ENDPOINT,
};

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function isPresidenciaAutoria(rawAutoria?: string): boolean {
  const autoria = normalize(String(rawAutoria ?? ""));

  return autoria.includes("presidencia da republica") || autoria.includes("presidente da republica");
}

async function fetchProcessosRecentesPresidencia(numdias = 30): Promise<SenadoProcessoItem[]> {
  const response = await fetch(`${PROCESSO_ENDPOINT}.json?numdias=${numdias}`, {
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

  const payload = (await response.json()) as unknown;

  if (!Array.isArray(payload)) {
    return [];
  }

  return (payload as SenadoProcessoItem[]).filter((item) => isPresidenciaAutoria(item.autoria));
}

function toIsoDate(value?: string): string {
  const parsed = new Date(String(value ?? "").trim());

  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString();
  }

  return parsed.toISOString();
}

function mapLegislationStatus(item: SenadoProcessoItem): LegislationStatus {
  const tramitando = normalize(String(item.tramitando ?? ""));
  const deliberacao = normalize(String(item.siglaTipoDeliberacao ?? ""));

  if (tramitando.startsWith("s")) {
    return "Em tramitação";
  }

  if (deliberacao.includes("rejeit")) {
    return "Rejeitada";
  }

  return "Aprovada";
}

function mapSubject(item: SenadoProcessoItem): LegislationSubject {
  const text = normalize(`${item.tipoConteudo ?? ""} ${item.ementa ?? ""}`);

  if (text.includes("tribut") || text.includes("impost")) return "Impostos";
  if (text.includes("previd")) return "Previdência";
  if (text.includes("educa")) return "Educação";
  if (text.includes("saude")) return "Saúde";
  if (text.includes("infra")) return "Infraestrutura";

  return "Economia";
}

function parseIdentificacao(identificacao?: string): { siglaTipo?: string; numero: string; ano?: string } {
  const normalized = String(identificacao ?? "").trim();
  const match = normalized.match(/^([A-Z]+)\s+(\d+)\/(\d{4})$/i);

  if (!match) {
    return { numero: normalized || "-" };
  }

  return {
    siglaTipo: match[1].toUpperCase(),
    numero: match[2],
    ano: match[3],
  };
}

export async function getPresidentActivityRecords(
  params: { limit?: number; numdias?: number } = {},
): Promise<DataFetchResult<VotingRecord[]>> {
  const lookbackDays = Math.min(Math.max(params.numdias ?? 30, 1), 30);
  const processos = await fetchProcessosRecentesPresidencia(lookbackDays);
  const lastUpdated = new Date().toISOString();

  const records = processos
    .map((item, index): VotingRecord => ({
      id: String(item.id ?? item.codigoMateria ?? `pres-${index}`),
      titulo: String(item.identificacao ?? item.tipoDocumento ?? "Processo legislativo"),
      data: toIsoDate(item.dataUltimaAtualizacao ?? item.dataDeliberacao ?? item.dataApresentacao),
      voto: String(item.siglaTipoDeliberacao ?? "Em acompanhamento"),
      proposicaoId: Number.isFinite(Number(item.codigoMateria)) ? String(item.codigoMateria) : undefined,
      sourceName: "Dados Abertos do Senado Federal",
      sourceUrl: item.urlDocumento,
    }))
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    .slice(0, params.limit ?? 20);

  return {
    data: records,
    source: "api",
    mode: "live",
    lastUpdated,
    dataSourceInfo: {
      ...SOURCE_INFO_BASE,
      referencePeriod: `Últimos ${lookbackDays} dias`,
      lastUpdated,
    },
  };
}

export async function getPresidentPresenceInsight(
  params: { numdias?: number } = {},
): Promise<DataFetchResult<PresenceInsight>> {
  const lookbackDays = Math.min(Math.max(params.numdias ?? 30, 1), 30);
  const processos = await fetchProcessosRecentesPresidencia(lookbackDays);
  const lastUpdated = new Date().toISOString();

  return {
    data: {
      percentualPresenca: null,
      sessoesConsideradas: processos.length,
      dataSourceInfo: {
        ...SOURCE_INFO_BASE,
        referencePeriod: `Últimos ${lookbackDays} dias`,
        lastUpdated,
      },
      integrationMessage:
        "Para Presidente, exibimos quantidade de atos/processos oficiais recentes em vez de presença em sessões legislativas.",
    },
    source: "api",
    mode: "live",
    lastUpdated,
  };
}

export async function getPresidentLegislationItems(
  params: { limit?: number; numdias?: number } = {},
): Promise<DataFetchResult<LegislationItem[]>> {
  const lookbackDays = Math.min(Math.max(params.numdias ?? 30, 1), 30);
  const processos = await fetchProcessosRecentesPresidencia(lookbackDays);
  const nowIso = new Date().toISOString();

  const items = processos
    .map((item): LegislationItem => {
      const parsed = parseIdentificacao(item.identificacao);

      return {
        id: String(item.id ?? item.codigoMateria ?? Math.random()),
        siglaTipo: parsed.siglaTipo,
        numero: parsed.numero,
        ano: parsed.ano,
        titulo: String(item.identificacao ?? item.tipoDocumento ?? "Processo legislativo"),
        ementa: item.ementa,
        status: mapLegislationStatus(item),
        assunto: mapSubject(item),
        resumo: String(item.ementa ?? item.tipoConteudo ?? "Sem resumo disponível").slice(0, 240),
        statusAtual: String(item.siglaTipoDeliberacao ?? item.tramitando ?? "Indisponível"),
        dataApresentacao: item.dataApresentacao,
        urlIntegra: item.urlDocumento,
        autores: ["Presidência da República"],
        politicosEnvolvidos: ["Presidência da República"],
        ultimaAtualizacao: item.dataUltimaAtualizacao || nowIso,
        politicos: {
          autor: "Presidência da República",
          relator: "Relatoria não disponível nesta integração",
          apoiadores: [],
        },
        timeline: [
          ...(item.dataApresentacao
            ? [{ evento: "Apresentação", data: item.dataApresentacao }]
            : []),
          ...(item.dataDeliberacao
            ? [{ evento: "Deliberação", data: item.dataDeliberacao }]
            : []),
        ],
        votos: {
          favor: 0,
          contra: 0,
          abstencao: 0,
        },
        source: "api",
        lastUpdated: nowIso,
      };
    })
    .sort((a, b) => new Date(b.ultimaAtualizacao).getTime() - new Date(a.ultimaAtualizacao).getTime())
    .slice(0, params.limit ?? 24);

  return {
    data: items,
    source: "api",
    mode: "live",
    lastUpdated: nowIso,
    dataSourceInfo: {
      ...SOURCE_INFO_BASE,
      referencePeriod: `Últimos ${lookbackDays} dias`,
      lastUpdated: nowIso,
    },
  };
}

const GOVERNOR_SP_SOURCE_INFO_BASE: Omit<DataSourceInfo, "referencePeriod" | "lastUpdated"> = {
  sourceName: "Governo do Estado de São Paulo",
  sourceType: "official_portal",
  sourceUrl: "https://www.governo.sp.gov.br/governo/",
};

export async function getGovernorSPActivityRecords(
  params: { limit?: number } = {},
): Promise<DataFetchResult<VotingRecord[]>> {
  const lastUpdated = new Date().toISOString();

  return {
    data: [],
    source: "api",
    mode: "live",
    lastUpdated,
    errorMessage:
      "Atividades detalhadas do governador ainda em integração neste piloto estadual.",
    dataSourceInfo: {
      ...GOVERNOR_SP_SOURCE_INFO_BASE,
      referencePeriod: "Mandato atual",
      lastUpdated,
    },
  };
}

export async function getGovernorSPPresenceInsight(): Promise<DataFetchResult<PresenceInsight>> {
  const lastUpdated = new Date().toISOString();

  return {
    data: {
      percentualPresenca: null,
      sessoesConsideradas: null,
      dataSourceInfo: {
        ...GOVERNOR_SP_SOURCE_INFO_BASE,
        referencePeriod: "Mandato atual",
        lastUpdated,
      },
      integrationMessage:
        "Presença em sessões legislativas não se aplica ao cargo de governador; seção em integração para métricas executivas oficiais.",
    },
    source: "api",
    mode: "live",
    lastUpdated,
  };
}

export async function getGovernorSPLegislationItems(
  params: { limit?: number } = {},
): Promise<DataFetchResult<LegislationItem[]>> {
  const lastUpdated = new Date().toISOString();

  return {
    data: [],
    source: "api",
    mode: "live",
    lastUpdated,
    errorMessage:
      "Proposições vinculadas ao governador ainda em integração neste piloto estadual.",
    dataSourceInfo: {
      ...GOVERNOR_SP_SOURCE_INFO_BASE,
      referencePeriod: "Mandato atual",
      lastUpdated,
    },
  };
}
