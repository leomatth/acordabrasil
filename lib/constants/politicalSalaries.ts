import type { PoliticianOffice } from "@/types/politician";

type SalaryReference = {
  salarioBase: number;
  label: string;
  sourceLabel: string;
  sourceUrl?: string;
  referencePeriod?: string;
  lastUpdated?: string;
};

// Referências institucionais/configuradas para exibição no perfil.
// Nesta fase, mantemos preenchimento garantido para Deputado Federal.
export const POLITICAL_SALARIES: Partial<Record<PoliticianOffice, SalaryReference>> = {
  "Deputado Federal": {
    salarioBase: 44608.56,
    label: "Salário base do cargo",
    sourceLabel: "Referência institucional da Câmara dos Deputados (subsídio parlamentar)",
    sourceUrl: "https://www.camara.leg.br/transparencia/recursos-humanos/remuneracao-dos-parlamentares",
    referencePeriod: "Valor mensal vigente",
    lastUpdated: "2026-03-16T00:00:00.000Z",
  },
};

export function getPoliticalSalaryByOffice(cargo: PoliticianOffice): SalaryReference | null {
  return POLITICAL_SALARIES[cargo] ?? null;
}
