export type DataMode = "mock" | "hybrid" | "live";

export type DataSource = "api" | "mock";

export type DataSourceInfo = {
  sourceName: string;
  sourceType: "api" | "document" | "official_portal";
  sourceUrl?: string;
  referencePeriod?: string;
  lastUpdated?: string;
};

export type DataFetchResult<T> = {
  data: T;
  source: DataSource;
  mode: DataMode;
  lastUpdated: string;
  dataSourceInfo?: DataSourceInfo;
  errorMessage?: string;
};
