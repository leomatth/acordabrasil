import type { DataFetchResult, DataSourceInfo } from "@/types/dataSource";
import type { LegislationItem, LegislationStatus, LegislationSubject } from "@/types/legislation";
import type { PresenceInsight, VotingRecord } from "@/types/politician";

type SenadoVoteItem = {
  codigoMateria?: number;
  codigoSessaoVotacao?: number;
  idProcesso?: number;
  identificacao?: string;
  descricaoVotacao?: string;
  dataSessao?: string;
  dataApresentacao?: string;
  votos?: Array<{
    codigoParlamentar?: number;
    siglaVotoParlamentar?: string;
    descricaoVotoParlamentar?: string | null;
  }>;
};

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
  urlDocumento?: string;
};

const SENADO_SOURCE_NAME = "Dados Abertos do Senado Federal";
const SENADO_API_URL = "https://legis.senado.leg.br/dadosabertos/";
const SENADO_VOTACAO_ENDPOINT = "https://legis.senado.leg.br/dadosabertos/votacao";
const SENADO_PROCESSO_ENDPOINT = "https://legis.senado.leg.br/dadosabertos/processo";

function toIsoDate(value?: string): string {
  const parsed = new Date(String(value ?? "").trim());

  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString();
  }

  return parsed.toISOString();
}

function getSenadorCodigoFromScopedId(senadorScopedId: number): number {
  if (senadorScopedId >= 1000000) {
    return senadorScopedId - 1000000;
  }

  return senadorScopedId;
}

function buildYearRange(ano?: number): { dataInicio: string; dataFim: string; referenceYear: number } {
  const now = new Date();
  const referenceYear = Number.isFinite(ano) && ano ? ano : now.getFullYear();

  return {
    dataInicio: `${referenceYear}-01-01`,
    dataFim: `${referenceYear}-12-31`,
    referenceYear,
  };
}

async function fetchSenadoArray<T>(url: string): Promise<T[]> {
  const response = await fetch(url, {
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

  return Array.isArray(payload) ? (payload as T[]) : [];
}

function buildVotingRecord(item: SenadoVoteItem, senadorCodigo: number, index: number): VotingRecord {
  const vote = (item.votos ?? []).find((entry) => Number(entry.codigoParlamentar) === senadorCodigo);

  const materiaId = Number(item.codigoMateria);
  const safeMateriaId = Number.isFinite(materiaId) && materiaId > 0 ? String(materiaId) : undefined;
  const data = item.dataSessao || item.dataApresentacao;
  const title = String(item.descricaoVotacao ?? item.identificacao ?? "Votação nominal").trim();

  return {
    id: String(item.codigoSessaoVotacao ?? item.idProcesso ?? `${senadorCodigo}-${index}`),
    titulo: title || "Votação nominal",
    data: toIsoDate(data),
    voto: vote?.siglaVotoParlamentar || vote?.descricaoVotoParlamentar || "Indisponível",
    proposicaoId: safeMateriaId,
    sourceName: SENADO_SOURCE_NAME,
    sourceUrl: safeMateriaId
      ? `https://www25.senado.leg.br/web/atividade/materias/-/materia/${safeMateriaId}`
      : undefined,
  };
}

function mapLegislationStatus(item: SenadoProcessoItem): LegislationStatus {
  const tramitando = String(item.tramitando ?? "").toUpperCase();
  const deliberacao = String(item.siglaTipoDeliberacao ?? "").toUpperCase();

  if (tramitando.startsWith("S")) {
    return "Em tramitação";
  }

  if (deliberacao.includes("REJEIT")) {
    return "Rejeitada";
  }

  return "Aprovada";
}

function mapSubject(item: SenadoProcessoItem): LegislationSubject {
  const text = `${item.tipoConteudo ?? ""} ${item.ementa ?? ""}`.toLowerCase();

  if (text.includes("tribut") || text.includes("impost")) return "Impostos";
  if (text.includes("previd")) return "Previdência";
  if (text.includes("educa")) return "Educação";
  if (text.includes("saúde") || text.includes("saude")) return "Saúde";
  if (text.includes("infra")) return "Infraestrutura";

  return "Economia";
}

function parseIdentificacao(identificacao?: string): { siglaTipo?: string; numero: string; ano?: string } {
  const normalized = String(identificacao ?? "").trim();
  const match = normalized.match(/^([A-Z]+)\s+(\d+)\/(\d{4})$/i);

  if (!match) {
    return {
      numero: normalized || "-",
    };
  }

  return {
    siglaTipo: match[1].toUpperCase(),
    numero: match[2],
    ano: match[3],
  };
}

export async function getSenadorVotingHistory(
  senadorScopedId: number,
  params: { limit?: number; ano?: number } = {},
): Promise<DataFetchResult<VotingRecord[]>> {
  const senadorCodigo = getSenadorCodigoFromScopedId(senadorScopedId);
  const { dataInicio, dataFim, referenceYear } = buildYearRange(params.ano);

  const url = `${SENADO_VOTACAO_ENDPOINT}.json?codigoParlamentar=${senadorCodigo}&dataInicio=${dataInicio}&dataFim=${dataFim}`;
  const votes = await fetchSenadoArray<SenadoVoteItem>(url);
  const mapped = votes
    .map((item, index) => buildVotingRecord(item, senadorCodigo, index))
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  const records = mapped.slice(0, params.limit ?? 20);
  const lastUpdated = new Date().toISOString();

  return {
    data: records,
    source: "api",
    mode: "live",
    lastUpdated,
    dataSourceInfo: {
      sourceName: SENADO_SOURCE_NAME,
      sourceType: "api",
      sourceUrl: SENADO_VOTACAO_ENDPOINT,
      referencePeriod: String(referenceYear),
      lastUpdated,
    },
  };
}

export async function getSenadorPresenceInsight(
  senadorScopedId: number,
  params: { ano?: number } = {},
): Promise<DataFetchResult<PresenceInsight>> {
  const senadorCodigo = getSenadorCodigoFromScopedId(senadorScopedId);
  const { dataInicio, dataFim, referenceYear } = buildYearRange(params.ano);

  const allVotesUrl = `${SENADO_VOTACAO_ENDPOINT}.json?dataInicio=${dataInicio}&dataFim=${dataFim}`;
  const senatorVotesUrl = `${SENADO_VOTACAO_ENDPOINT}.json?codigoParlamentar=${senadorCodigo}&dataInicio=${dataInicio}&dataFim=${dataFim}`;

  const [allVotes, senatorVotes] = await Promise.all([
    fetchSenadoArray<SenadoVoteItem>(allVotesUrl),
    fetchSenadoArray<SenadoVoteItem>(senatorVotesUrl),
  ]);

  const toSessionKey = (item: SenadoVoteItem) =>
    String(item.codigoSessaoVotacao ?? item.idProcesso ?? "").trim();

  const totalSessions = new Set(allVotes.map((item) => toSessionKey(item)).filter(Boolean));
  const senatorSessions = new Set(senatorVotes.map((item) => toSessionKey(item)).filter(Boolean));

  const percentualPresenca = totalSessions.size
    ? Number(((senatorSessions.size / totalSessions.size) * 100).toFixed(1))
    : null;

  const lastUpdated = new Date().toISOString();
  const sourceInfo: DataSourceInfo = {
    sourceName: SENADO_SOURCE_NAME,
    sourceType: "api",
    sourceUrl: SENADO_VOTACAO_ENDPOINT,
    referencePeriod: String(referenceYear),
    lastUpdated,
  };

  return {
    data: {
      percentualPresenca,
      sessoesConsideradas: totalSessions.size || null,
      dataSourceInfo: sourceInfo,
      integrationMessage:
        percentualPresenca === null
          ? "Não foi possível calcular presença no período selecionado com os dados oficiais retornados."
          : undefined,
    },
    source: "api",
    mode: "live",
    lastUpdated,
    dataSourceInfo: sourceInfo,
  };
}

export async function getSenadorLegislationItems(
  senadorScopedId: number,
  params: { ano?: number; limit?: number } = {},
): Promise<DataFetchResult<LegislationItem[]>> {
  const senadorCodigo = getSenadorCodigoFromScopedId(senadorScopedId);
  const { dataInicio, dataFim, referenceYear } = buildYearRange(params.ano);

  const url = `${SENADO_PROCESSO_ENDPOINT}.json?codigoParlamentarAutor=${senadorCodigo}&dataInicioApresentacao=${dataInicio}&dataFimApresentacao=${dataFim}`;

  const processos = await fetchSenadoArray<SenadoProcessoItem>(url);
  const nowIso = new Date().toISOString();

  const mapped = processos
    .map((item): LegislationItem => {
      const identificacao = parseIdentificacao(item.identificacao);
      const autores = String(item.autoria ?? "")
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean);

      return {
        id: String(item.id ?? item.codigoMateria ?? Math.random()),
        siglaTipo: identificacao.siglaTipo,
        numero: identificacao.numero,
        ano: identificacao.ano,
        titulo: String(item.identificacao ?? "Processo legislativo"),
        ementa: item.ementa,
        status: mapLegislationStatus(item),
        assunto: mapSubject(item),
        resumo: String(item.ementa ?? item.tipoConteudo ?? "Sem resumo disponível").slice(0, 240),
        statusAtual: String(item.siglaTipoDeliberacao ?? item.tramitando ?? "Indisponível"),
        dataApresentacao: item.dataApresentacao,
        urlIntegra: item.urlDocumento,
        autores,
        politicosEnvolvidos: autores,
        ultimaAtualizacao: item.dataUltimaAtualizacao || nowIso,
        politicos: {
          autor: autores[0] || "Autor não informado",
          relator: "Relatoria não disponível nesta integração",
          apoiadores: autores.slice(1),
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
    data: mapped,
    source: "api",
    mode: "live",
    lastUpdated: nowIso,
    dataSourceInfo: {
      sourceName: SENADO_SOURCE_NAME,
      sourceType: "api",
      sourceUrl: SENADO_PROCESSO_ENDPOINT,
      referencePeriod: String(referenceYear),
      lastUpdated: nowIso,
    },
  };
}

export function getSenadoSourceInfo(referencePeriod?: string): DataSourceInfo {
  return {
    sourceName: SENADO_SOURCE_NAME,
    sourceType: "api",
    sourceUrl: SENADO_API_URL,
    referencePeriod,
    lastUpdated: new Date().toISOString(),
  };
}
