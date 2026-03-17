import { fetchVotacoesFromCamara, getVotosByVotacao } from "@/lib/services/camaraService";
import type { DataFetchResult, DataSourceInfo } from "@/types/dataSource";
import type { VotingRecord } from "@/types/politician";

type CamaraVoting = {
  id?: string;
  data?: string;
  dataHoraRegistro?: string;
  descricao?: string;
  uriProposicaoObjeto?: string | null;
  uri?: string;
  aprovacao?: boolean | number | string;
  descricaoSituacao?: string;
};

type CamaraNominalVote = {
  tipoVoto?: string;
  dataRegistroVoto?: string;
  deputado_?: {
    id?: number;
  };
};

export type FederalDeputyVotingSnapshot = {
  records: VotingRecord[];
  totalNominalSessionsAnalyzed: number;
};

export type FederalDeputyVotingSummary = {
  total: number;
  favor: number;
  contra: number;
  abstencao: number;
  obstrucao: number;
  outros: number;
  approvedWithParticipation: number;
  rejectedWithParticipation: number;
  resolvedPropositionLinks: number;
  unresolvedPropositionLinks: number;
};

const CAMARA_SOURCE_NAME = "Dados Abertos da Câmara dos Deputados";
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

function normalizeText(value: unknown): string {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function resolveVotingResult(voting: CamaraVoting): VotingRecord["resultado"] {
  const rawApproval = voting.aprovacao;

  if (rawApproval === true || rawApproval === 1 || rawApproval === "1") {
    return "Aprovada";
  }

  if (rawApproval === false || rawApproval === 0 || rawApproval === "0") {
    return "Rejeitada";
  }

  const statusText = normalizeText(voting.descricaoSituacao ?? voting.descricao);

  if (statusText.includes("aprov")) {
    return "Aprovada";
  }

  if (statusText.includes("rejeit") || statusText.includes("arquiv")) {
    return "Rejeitada";
  }

  return "Indisponível";
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
    resultado: resolveVotingResult(voting),
    proposicaoId,
    sourceName: CAMARA_SOURCE_NAME,
    sourceUrl:
      String(voting.uriProposicaoObjeto ?? "").trim() || String(voting.uri ?? "").trim() || undefined,
  };
}

export async function getFederalDeputyVotingSnapshot(
  deputadoId: number,
  params: { limit?: number; itensVotacoes?: number; ano?: number } = {},
): Promise<FederalDeputyVotingSnapshot> {
  const itensVotacoes = params.itensVotacoes ?? 30;
  const limit = params.limit ?? 30;

  const votacoes = await fetchVotacoesFromCamara({ itens: itensVotacoes, pagina: 1 });
  const records: VotingRecord[] = [];
  let totalNominalSessionsAnalyzed = 0;

  for (const rawVoting of votacoes) {
    if (records.length >= limit && totalNominalSessionsAnalyzed >= itensVotacoes) {
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

    totalNominalSessionsAnalyzed += 1;

    const deputyVote = votesPayload
      .map((item) => item as unknown as CamaraNominalVote)
      .find((item) => Number(item.deputado_?.id) === deputadoId);

    if (!deputyVote) {
      continue;
    }

    records.push(buildVotingRecord(voting, deputyVote, deputadoId));
  }

  return {
    records: records.slice(0, limit),
    totalNominalSessionsAnalyzed,
  };
}

export async function getFederalDeputyVotingHistory(
  deputadoId: number,
  params: { limit?: number; itensVotacoes?: number; ano?: number } = {},
): Promise<DataFetchResult<VotingRecord[]>> {
  try {
    const snapshot = await getFederalDeputyVotingSnapshot(deputadoId, params);
    const sourceInfo: DataSourceInfo = {
      sourceName: CAMARA_SOURCE_NAME,
      sourceType: "api",
      sourceUrl: CAMARA_VOTACOES_URL,
      referencePeriod: params.ano ? String(params.ano) : undefined,
      lastUpdated: new Date().toISOString(),
    };

    return {
      data: snapshot.records,
      source: "api",
      mode: "live",
      lastUpdated: new Date().toISOString(),
      dataSourceInfo: sourceInfo,
    };
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? `Não foi possível carregar histórico de votações reais: ${error.message}`
        : "Não foi possível carregar histórico de votações reais.",
    );
  }
}

function resolveVoteBucket(voto?: string): "favor" | "contra" | "abstencao" | "obstrucao" | "outros" {
  const normalized = normalizeText(voto);

  if (normalized.includes("sim") || normalized.includes("favor")) {
    return "favor";
  }

  if (normalized.includes("nao") || normalized.includes("não") || normalized.includes("contra")) {
    return "contra";
  }

  if (normalized.includes("absten")) {
    return "abstencao";
  }

  if (normalized.includes("obstru")) {
    return "obstrucao";
  }

  return "outros";
}

export function summarizeFederalDeputyVoting(records: VotingRecord[]): FederalDeputyVotingSummary {
  const counters = {
    favor: 0,
    contra: 0,
    abstencao: 0,
    obstrucao: 0,
    outros: 0,
  };

  const approvedByProposition = new Set<string>();
  const rejectedByProposition = new Set<string>();
  let unresolvedPropositionLinks = 0;

  records.forEach((record) => {
    counters[resolveVoteBucket(record.voto)] += 1;

    if (!record.proposicaoId) {
      unresolvedPropositionLinks += 1;
      return;
    }

    if (record.resultado === "Aprovada") {
      approvedByProposition.add(record.proposicaoId);
      return;
    }

    if (record.resultado === "Rejeitada") {
      rejectedByProposition.add(record.proposicaoId);
      return;
    }

    unresolvedPropositionLinks += 1;
  });

  return {
    total: records.length,
    favor: counters.favor,
    contra: counters.contra,
    abstencao: counters.abstencao,
    obstrucao: counters.obstrucao,
    outros: counters.outros,
    approvedWithParticipation: approvedByProposition.size,
    rejectedWithParticipation: rejectedByProposition.size,
    resolvedPropositionLinks: approvedByProposition.size + rejectedByProposition.size,
    unresolvedPropositionLinks,
  };
}
