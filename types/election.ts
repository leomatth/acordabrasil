export type ElectionOffice = {
  nome: string;
  descricao: string;
  responsabilidades: string[];
  mandato: string;
};

export type ElectionPollEntry = {
  candidato: string;
  percentual: number;
};
