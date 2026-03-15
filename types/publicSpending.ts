import type { StateCode } from "@/types/state";

export type SpendingArea = {
  nome: string;
  percentual: number;
};

export type StateSpending = {
  nome: string;
  sigla: StateCode;
  gastoAnual: number;
  gastoMensal: number;
  gastoPorHabitante: number;
  principaisAreas: SpendingArea[];
};

export type PublicSpendingOverview = {
  totalPublicSpending: number;
  spendingToday: number;
  spendingMonth: number;
  spendingPerCitizen: number;
};

export type ExternalStateSpending = {
  stateCode?: string;
  sigla?: string;
  stateName?: string;
  nome?: string;
  annualSpending?: number;
  gastoAnual?: number;
  monthlySpending?: number;
  gastoMensal?: number;
  perCapitaSpending?: number;
  gastoPorHabitante?: number;
  areas?: Array<{
    name?: string;
    nome?: string;
    percentage?: number;
    percentual?: number;
  }>;
  principaisAreas?: Array<{
    nome: string;
    percentual: number;
  }>;
};
