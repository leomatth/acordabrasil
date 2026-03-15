import type {
  LegislationItem,
  LegislationNominalVote,
  LegislationPartyVoteSummary,
  LegislationStatus,
  LegislationSubject,
  LegislationVotes,
  LegislationVotingSession,
} from "@/types/legislation";

type CamaraProposicao = {
  id: number;
  siglaTipo?: string;
  numero?: number;
  ano?: number;
  ementa?: string;
  ementaDetalhada?: string;
  uri?: string;
  uriInteiroTeor?: string;
  dataApresentacao?: string;
  statusProposicao?: {
    descricaoSituacao?: string;
    dataHora?: string;
  };
};

function normalizeSubject(text: string): LegislationSubject {
  const value = text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  if (value.includes("imposto") || value.includes("tribut")) {
    return "Impostos";
  }

  if (value.includes("previd")) {
    return "Previdência";
  }

  if (value.includes("educa")) {
    return "Educação";
  }

  if (value.includes("saude")) {
    return "Saúde";
  }

  if (value.includes("infra")) {
    return "Infraestrutura";
  }

  return "Economia";
}

export function mapProposicaoStatus(statusText?: string): LegislationStatus {
  if (!statusText) {
    return "Em tramitação";
  }

  const value = statusText
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  if (value.includes("aprov")) {
    return "Aprovada";
  }

  if (value.includes("rejeit") || value.includes("arquiv")) {
    return "Rejeitada";
  }

  return "Em tramitação";
}

export function mapProposicaoToLegislation(item: CamaraProposicao): LegislationItem {
  const tituloBase = `${item.siglaTipo || "PROPOSIÇÃO"} ${item.numero || ""}/${item.ano || ""}`
    .replace(/\s+/g, " ")
    .trim();

  const resumo = item.ementa || item.ementaDetalhada || "Ementa indisponível.";
  const statusDescricao = item.statusProposicao?.descricaoSituacao || "Em tramitação";
  const status = mapProposicaoStatus(statusDescricao);
  const lastUpdated = item.statusProposicao?.dataHora || new Date().toISOString();

  return {
    id: String(item.id),
    siglaTipo: item.siglaTipo,
    numero: String(item.numero || item.id),
    ano: item.ano ? String(item.ano) : undefined,
    titulo: tituloBase || `Proposição ${item.id}`,
    ementa: resumo,
    status,
    assunto: normalizeSubject(resumo),
    resumo,
    statusAtual: statusDescricao,
    dataApresentacao: item.dataApresentacao,
    urlIntegra: item.uriInteiroTeor || item.uri,
    autores: [],
    impactoFinanceiro: undefined,
    politicosEnvolvidos: [],
    ultimaAtualizacao: lastUpdated,
    politicos: {
      autor: "Autor em apuração",
      relator: "Relator em apuração",
      apoiadores: [],
    },
    timeline: [
      {
        evento: "Último status registrado",
        data: lastUpdated,
      },
    ],
    votos: {
      favor: 0,
      contra: 0,
      abstencao: 0,
    },
    source: "api",
    lastUpdated,
  };
}

export function mapProposicaoToPecCard(item: CamaraProposicao): LegislationItem {
  return mapProposicaoToLegislation(item);
}

type CamaraVotacao = Record<string, unknown>;

function toNumber(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeVoteLabel(value: unknown): string {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function deriveVotesFromNestedList(votacao: CamaraVotacao): LegislationVotes {
  const votosNominais = Array.isArray(votacao.votos) ? votacao.votos : [];

  if (!votosNominais.length) {
    return { favor: 0, contra: 0, abstencao: 0 };
  }

  return votosNominais.reduce<LegislationVotes>(
    (acc, item) => {
      const voto = normalizeVoteLabel((item as Record<string, unknown>).voto);

      if (voto === "sim" || voto === "a favor") {
        acc.favor += 1;
      } else if (voto === "nao" || voto === "não" || voto === "contra") {
        acc.contra += 1;
      } else {
        acc.abstencao += 1;
      }

      return acc;
    },
    { favor: 0, contra: 0, abstencao: 0 },
  );
}

function deriveVotes(votacao: CamaraVotacao): LegislationVotes {
  const favor = toNumber(votacao.votosSim ?? votacao.favor ?? votacao.qtdSim);
  const contra = toNumber(votacao.votosNao ?? votacao.contra ?? votacao.qtdNao);
  const abstencao = toNumber(
    votacao.votosOutros ?? votacao.abstencao ?? votacao.qtdAbstencao,
  );

  if (favor || contra || abstencao) {
    return { favor, contra, abstencao };
  }

  return deriveVotesFromNestedList(votacao);
}

export function mapVotacaoToVotingSession(votacao: CamaraVotacao): LegislationVotingSession {
  const votos = deriveVotes(votacao);
  const data =
    String(votacao.dataHoraRegistro ?? votacao.dataHora ?? votacao.data ?? "") ||
    new Date().toISOString();

  return {
    id: String(votacao.id ?? votacao.uri ?? data),
    data,
    descricao: String(votacao.descricao ?? "Votação registrada na Câmara dos Deputados."),
    aprovada:
      typeof votacao.aprovacao === "number" ? Number(votacao.aprovacao) === 1 : undefined,
    votos,
  };
}

export function aggregateVotingSessions(
  sessions: LegislationVotingSession[],
): LegislationVotes {
  return sessions.reduce<LegislationVotes>(
    (acc, session) => {
      acc.favor += session.votos.favor;
      acc.contra += session.votos.contra;
      acc.abstencao += session.votos.abstencao;
      return acc;
    },
    { favor: 0, contra: 0, abstencao: 0 },
  );
}

type CamaraNominalVote = Record<string, unknown>;

function toVoteBucket(vote: string): keyof LegislationVotes {
  const normalized = normalizeVoteLabel(vote);

  if (normalized === "sim" || normalized === "a favor") {
    return "favor";
  }

  if (normalized === "nao" || normalized === "não" || normalized === "contra") {
    return "contra";
  }

  return "abstencao";
}

export function mapNominalVote(voto: CamaraNominalVote): LegislationNominalVote {
  const deputado = String(
    voto.nome ?? voto.nomeDeputado ?? voto.nomeParlamentar ?? "Deputado não identificado",
  );
  const partido = String(voto.siglaPartido ?? voto.partido ?? "-");
  const estado = String(voto.siglaUf ?? voto.uf ?? "").trim() || undefined;
  const votoNominal = String(voto.voto ?? voto.tipoVoto ?? "Abstenção");

  return {
    deputado,
    partido,
    estado,
    voto: votoNominal,
  };
}

export function summarizeNominalVotesByParty(
  nominalVotes: LegislationNominalVote[],
): LegislationPartyVoteSummary[] {
  const byParty = new Map<string, LegislationPartyVoteSummary>();

  nominalVotes.forEach((item) => {
    const party = item.partido || "-";
    const current = byParty.get(party) ?? {
      partido: party,
      favor: 0,
      contra: 0,
      abstencao: 0,
      total: 0,
    };

    current[toVoteBucket(item.voto)] += 1;
    current.total += 1;
    byParty.set(party, current);
  });

  return Array.from(byParty.values()).sort((a, b) => b.total - a.total);
}

export function aggregateNominalVotes(
  nominalVotes: LegislationNominalVote[],
): LegislationVotes {
  return nominalVotes.reduce<LegislationVotes>(
    (acc, item) => {
      acc[toVoteBucket(item.voto)] += 1;
      return acc;
    },
    { favor: 0, contra: 0, abstencao: 0 },
  );
}
