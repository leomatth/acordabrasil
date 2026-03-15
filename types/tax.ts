export type TaxCategory = "Federal" | "Estadual" | "Municipal";

export type TaxItem = {
  nome: string;
  sigla: string;
  categoria: TaxCategory;
  descricao: string;
  incidencia: string;
  aliquota: string;
  exemplo: string;
};

export type TaxSummary = {
  titulo: string;
  valor: string;
  descricao: string;
};

export type TaxRealtimeMetrics = {
  taxesCollectedToday: number;
  ratePerSecond: number;
};
