import type { PoliticianOffice } from "@/types/politician";

type SalaryReference = {
  salarioBase: number;
  label: string;
  sourceLabel: string;
};

// Referências institucionais/configuradas para exibição no perfil.
// Nesta fase, mantemos preenchimento garantido para Deputado Federal.
export const POLITICAL_SALARIES: Partial<Record<PoliticianOffice, SalaryReference>> = {
  "Deputado Federal": {
    salarioBase: 44608.56,
    label: "Salário base do cargo",
    sourceLabel: "Referência institucional configurada",
  },
};

export function getPoliticalSalaryByOffice(cargo: PoliticianOffice): SalaryReference | null {
  return POLITICAL_SALARIES[cargo] ?? null;
}
