import type { DataSource } from "@/types/dataSource";

export type LegislationStatus = "Aprovada" | "Rejeitada" | "Em tramitação";

export type RelatedLegislationRelationType =
  | "autor"
  | "coautor"
  | "relator"
  | "participante_votacao"
  | "outro_vinculo_oficial";

export type LegislationSubject =
  | "Economia"
  | "Impostos"
  | "Previdência"
  | "Educação"
  | "Saúde"
  | "Infraestrutura";

export type LegislationTimelineEvent = {
  evento: string;
  data: string;
};

export type LegislationVotes = {
  favor: number;
  contra: number;
  abstencao: number;
};

export type LegislationVotingSession = {
  id: string;
  data: string;
  descricao: string;
  aprovada?: boolean;
  votos: LegislationVotes;
  resumoPartidos?: LegislationPartyVoteSummary[];
  votosNominais?: LegislationNominalVote[];
};

export type LegislationNominalVote = {
  deputado: string;
  partido: string;
  estado?: string;
  voto: string;
};

export type LegislationPartyVoteSummary = {
  partido: string;
  favor: number;
  contra: number;
  abstencao: number;
  total: number;
};

export type LegislationPoliticians = {
  autor: string;
  relator: string;
  apoiadores: string[];
};

export type LegislationItem = {
  id: string;
  siglaTipo?: string;
  numero: string;
  ano?: string;
  titulo: string;
  ementa?: string;
  status: LegislationStatus;
  assunto: LegislationSubject;
  resumo: string;
  statusAtual: string;
  dataApresentacao?: string;
  urlIntegra?: string;
  autores?: string[];
  impactoFinanceiro?: number;
  politicosEnvolvidos?: string[];
  ultimaAtualizacao: string;
  politicos: LegislationPoliticians;
  timeline: LegislationTimelineEvent[];
  votos: LegislationVotes;
  votacoes?: LegislationVotingSession[];
  relationTypes?: RelatedLegislationRelationType[];
  relationLabel?: string;
  relationSource?: string;
  source?: DataSource;
  lastUpdated?: string;
};

export type ProposicaoFilters = {
  siglaTipo?: string;
  ano?: number;
  pagina?: number;
  itens?: number;
};
