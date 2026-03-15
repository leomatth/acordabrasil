import type { DataMode, DataSource } from "@/types/dataSource";
import type { PoliticalOfficeCoverage, PoliticianOffice, PoliticianProfile } from "@/types/politician";

export type PoliticalProviderResult = {
  data: PoliticianProfile[];
  source: DataSource;
  mode: DataMode;
  lastUpdated: string;
  errorMessage?: string;
};

export type PoliticalProvider = {
  key: string;
  supportedOffices: PoliticianOffice[];
  coverage: PoliticalOfficeCoverage[];
  list: () => Promise<PoliticalProviderResult>;
};

export function buildScopedId(office: PoliticianOffice, sourceId: number): number {
  const offsetByOffice: Record<PoliticianOffice, number> = {
    "Deputado Federal": 0,
    "Senador": 1000000,
    "Presidente": 2000000,
    "Governador": 3000000,
    "Deputado Estadual": 4000000,
  };

  return offsetByOffice[office] + sourceId;
}
