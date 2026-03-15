import type { DataSource, DataSourceInfo } from "@/types/dataSource";

export type ExpenseItem = {
  id: string;
  deputadoId: number;
  nomeDeputado: string;
  partido: string;
  estado: string;
  fornecedor: string;
  cnpjCpfFornecedor?: string;
  tipoDespesa: string;
  valorDocumento: number;
  valorLiquido: number;
  valorGlosa?: number;
  dataDocumento: string;
  urlDocumento?: string;
  ano: number;
  mes: number;
  source: DataSource;
  lastUpdated?: string;
  dataSourceInfo: DataSourceInfo;
};

export type ExpenseCategoryGroup = {
  categoria: string;
  valor: number;
};

export type ExpenseSummary = {
  totalDespesas: number;
  totalLiquido: number;
  totalGlosa: number;
  quantidadeDespesas: number;
  maiorCategoria?: string;
  categoriasAgrupadas: ExpenseCategoryGroup[];
  despesasRecentes: ExpenseItem[];
  source: DataSource;
  lastUpdated?: string;
  dataSourceInfo: DataSourceInfo;
};

export type DeputadoExpenseParams = {
  ano?: number;
  mes?: number;
  categoria?: string;
  pagina?: number;
  itensPorPagina?: number;
};

export type TopDeputadoExpense = {
  deputadoId: number;
  nome: string;
  partido: string;
  estado: string;
  totalDespesas: number;
  source: DataSource;
  lastUpdated?: string;
  dataSourceInfo: DataSourceInfo;
};
