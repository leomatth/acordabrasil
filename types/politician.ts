import type { DataSource, DataSourceInfo } from "@/types/dataSource";

export type PoliticianOffice =
  | "Deputado Federal"
  | "Deputado Estadual"
  | "Senador"
  | "Governador"
  | "Presidente";

export type CoverageStatus = "real" | "partial" | "integration";

export type ProfileSectionKey =
  | "identificacao"
  | "remuneracao"
  | "gastos"
  | "presencaAtividade"
  | "votacoes"
  | "proposicoes"
  | "equipeGabinete";

export type SectionCoverageStatus = "available" | "partial" | "unavailable";

export type ProfileSectionCoverage = {
  key: ProfileSectionKey;
  status: SectionCoverageStatus;
  sourceName: string;
  sourceUrl?: string;
  referencePeriod?: string;
  reason?: string;
};

export type PoliticianProfileSectionCoverage = Record<ProfileSectionKey, ProfileSectionCoverage>;

export const SUPPORTED_POLITICIAN_OFFICES: PoliticianOffice[] = [
  "Deputado Federal",
  "Deputado Estadual",
  "Senador",
  "Governador",
  "Presidente",
];

export type PoliticianVote = {
  tema: string;
  voto: "A favor" | "Contra" | "Abstenção";
};

export type VotingRecord = {
  id: string;
  titulo: string;
  data: string;
  voto?: string;
  resultado?: "Aprovada" | "Rejeitada" | "Indisponível";
  proposicaoId?: string;
  sourceName: string;
  sourceUrl?: string;
};

export type PresenceInsight = {
  percentualPresenca: number | null;
  sessoesConsideradas: number | null;
  presencasValidas?: number | null;
  metodologiaResumo?: string;
  dataSourceInfo: DataSourceInfo;
  integrationMessage?: string;
};

export type StaffMember = {
  nome: string;
  funcao?: string;
  periodo?: string;
  sourceName: string;
  sourceUrl?: string;
};

export type PoliticianProfile = {
  id: number;
  camaraId?: number;
  externalId?: string;
  slug: string;
  nome: string;
  cargo: PoliticianOffice;
  partido: string;
  estado: string;
  foto: string;
  resumo: string;
  biografia: string;
  biografiaCurta: string;
  gastosGabinete: number;
  presencaSessoes: number;
  votacoesRelevantes: PoliticianVote[];
  principaisBandeiras: string[];
  situacao?: string;
  legislatura?: string;
  email?: string;
  source: DataSource;
  lastUpdated: string;
  dataSourceInfo: DataSourceInfo;
  coverageStatus?: CoverageStatus;
  availabilityMessage?: string;
  sectionCoverage?: PoliticianProfileSectionCoverage;
};

export type DeputadoFilters = {
  partido?: string;
  estado?: string;
  pagina?: number;
  itens?: number;
};

export type PoliticalOfficeCoverage = {
  cargo: PoliticianOffice;
  status: CoverageStatus;
  label: string;
  sourceName: string;
  sourceUrl?: string;
  referencePeriod?: string;
  integrationMessage?: string;
};
