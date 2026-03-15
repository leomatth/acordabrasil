export type StateCode =
  | "AC"
  | "AL"
  | "AP"
  | "AM"
  | "BA"
  | "CE"
  | "DF"
  | "ES"
  | "GO"
  | "MA"
  | "MT"
  | "MS"
  | "MG"
  | "PA"
  | "PB"
  | "PR"
  | "PE"
  | "PI"
  | "RJ"
  | "RN"
  | "RS"
  | "RO"
  | "RR"
  | "SC"
  | "SP"
  | "SE"
  | "TO";

export type SpendingArea = {
  nome: string;
  percentual: number;
};

export type StatePublicData = {
  nome: string;
  sigla: StateCode;
  gastoAnual: number;
  gastoMensal: number;
  gastoPorHabitante: number;
  principaisAreas: SpendingArea[];
};
