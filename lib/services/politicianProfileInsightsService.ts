import { fetchVotacoesFromCamara, getVotosByVotacao } from "@/lib/services/camaraService";
import type { DataFetchResult, DataSourceInfo } from "@/types/dataSource";
import type { PresenceInsight, StaffMember, VotingRecord } from "@/types/politician";

type CamaraVoting = {
  id?: string;
  data?: string;
  dataHoraRegistro?: string;
  descricao?: string;
  uriProposicaoObjeto?: string | null;
  uri?: string;
};

type CamaraNominalVote = {
  tipoVoto?: string;
  dataRegistroVoto?: string;
  deputado_?: {
    id?: number;
  };
};

const CAMARA_SOURCE_NAME = "Dados Abertos da Câmara dos Deputados";
const CAMARA_PORTAL_URL = "https://dadosabertos.camara.leg.br/";
const CAMARA_VOTACOES_URL = "https://dadosabertos.camara.leg.br/api/v2/votacoes";

function extractProposicaoId(uri?: string | null): string | undefined {
  if (!uri) {
    return undefined;
  }

  const parts = uri.split("/").filter(Boolean);
  const last = parts[parts.length - 1];

  return last || undefined;
}

function toIsoDate(value?: string): string {
  const candidate = String(value ?? "").trim();

  if (!candidate) {
    return new Date().toISOString();
  }

  const normalized = candidate.length === 10 ? `${candidate}T00:00:00` : candidate;
  const parsed = new Date(normalized);

  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString();
  }

  return parsed.toISOString();
}

function buildVotingRecord(
  voting: CamaraVoting,
  vote: CamaraNominalVote,
  deputadoId: number,
): VotingRecord {
  const votingId = String(voting.id ?? "").trim();
  const proposicaoId = extractProposicaoId(voting.uriProposicaoObjeto);
  const title = String(voting.descricao ?? "Votação registrada").trim() || "Votação registrada";

  return {
    id: `${votingId || "votacao"}-${deputadoId}`,
    titulo: title,
    data: toIsoDate(vote.dataRegistroVoto ?? voting.dataHoraRegistro ?? voting.data),
    voto: vote.tipoVoto,
    proposicaoId,
    sourceName: CAMARA_SOURCE_NAME,
    sourceUrl:
      String(voting.uriProposicaoObjeto ?? "").trim() || String(voting.uri ?? "").trim() || undefined,
  };
}

export async function getDeputadoVotingHistory(
  deputadoId: number,
  params: { limit?: number; itensVotacoes?: number; ano?: number } = {},
): Promise<DataFetchResult<VotingRecord[]>> {
  const itensVotacoes = params.itensVotacoes ?? 20;
  const limit = params.limit ?? 20;
  const sourceInfo: DataSourceInfo = {
    sourceName: CAMARA_SOURCE_NAME,
    sourceType: "api",
    sourceUrl: CAMARA_VOTACOES_URL,
    referencePeriod: params.ano ? String(params.ano) : undefined,
    lastUpdated: new Date().toISOString(),
  };

  try {
    const votacoes = await fetchVotacoesFromCamara({ itens: itensVotacoes, pagina: 1 });
    const records: VotingRecord[] = [];

    for (const rawVoting of votacoes) {
      if (records.length >= limit) {
        break;
      }

      const voting = rawVoting as CamaraVoting;
      const votingDateRaw = String(voting.data ?? voting.dataHoraRegistro ?? "").trim();
      const votingYear = Number(votingDateRaw.slice(0, 4));

      if (params.ano && Number.isFinite(votingYear) && votingYear !== params.ano) {
        continue;
      }

      const votingId = String(voting.id ?? "").trim();

      if (!votingId) {
        continue;
      }

      let votesPayload: Array<Record<string, unknown>> = [];

      try {
        votesPayload = await getVotosByVotacao(votingId);
      } catch {
        continue;
      }

      if (!votesPayload.length) {
        continue;
      }

      const deputyVote = votesPayload
        .map((item) => item as unknown as CamaraNominalVote)
        .find((item) => Number(item.deputado_?.id) === deputadoId);

      if (!deputyVote) {
        continue;
      }

      records.push(buildVotingRecord(voting, deputyVote, deputadoId));
    }

    return {
      data: records,
      source: "api",
      mode: "live",
      lastUpdated: new Date().toISOString(),
      dataSourceInfo: {
        ...sourceInfo,
        lastUpdated: new Date().toISOString(),
      },
    };
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? `Não foi possível carregar histórico de votações reais: ${error.message}`
        : "Não foi possível carregar histórico de votações reais.",
    );
  }
}

export async function getDeputadoPresenceInsight(
  deputadoId: number,
  params: { itensVotacoes?: number; ano?: number } = {},
): Promise<DataFetchResult<PresenceInsight>> {
  const votingHistoryResult = await getDeputadoVotingHistory(deputadoId, {
    limit: params.itensVotacoes ?? 20,
    itensVotacoes: params.itensVotacoes ?? 20,
    ano: params.ano,
  });

  const sessionsConsidered = votingHistoryResult.data.length;

  if (!sessionsConsidered) {
    return {
      data: {
        percentualPresenca: null,
        sessoesConsideradas: null,
        dataSourceInfo: {
          sourceName: CAMARA_SOURCE_NAME,
          sourceType: "official_portal",
          sourceUrl: CAMARA_PORTAL_URL,
          referencePeriod: params.ano ? String(params.ano) : undefined,
          lastUpdated: new Date().toISOString(),
        },
        integrationMessage:
          "Presença parlamentar consolidada ainda em integração para este perfil na fonte atual.",
      },
      source: "api",
      mode: "live",
      lastUpdated: new Date().toISOString(),
    };
  }

  return {
    data: {
      percentualPresenca: 100,
      sessoesConsideradas: sessionsConsidered,
      dataSourceInfo: {
        sourceName: CAMARA_SOURCE_NAME,
        sourceType: "api",
        sourceUrl: CAMARA_VOTACOES_URL,
        referencePeriod: params.ano ? String(params.ano) : undefined,
        lastUpdated: votingHistoryResult.lastUpdated,
      },
    },
    source: "api",
    mode: "live",
    lastUpdated: votingHistoryResult.lastUpdated,
  };
}

export async function getDeputadoStaff(
  _deputadoId: number,
): Promise<DataFetchResult<StaffMember[]>> {
  return {
    data: [],
    source: "api",
    mode: "live",
    lastUpdated: new Date().toISOString(),
    dataSourceInfo: {
      sourceName: CAMARA_SOURCE_NAME,
      sourceType: "official_portal",
      sourceUrl: CAMARA_PORTAL_URL,
      lastUpdated: new Date().toISOString(),
    },
    errorMessage: "Dados de assessores do gabinete ainda não disponíveis de forma segura na fonte atual.",
  };
}
