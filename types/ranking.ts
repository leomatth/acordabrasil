import type { DataSourceInfo } from "@/types/dataSource";

export type RankingEntry = {
  deputadoId: number;
  slug: string;
  foto: string;
  nome: string;
  partido: string;
  estado: string;
  totalGasto: number;
  dataSourceInfo: DataSourceInfo;
};
