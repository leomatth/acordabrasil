import type { DataMode } from "@/types/dataSource";

const DEFAULT_MODE: DataMode = "mock";
const DEFAULT_CAMARA_API_BASE_URL = "https://dadosabertos.camara.leg.br/api/v2";

function normalizeMode(value: string | undefined): DataMode {
  if (value === "hybrid" || value === "live" || value === "mock") {
    return value;
  }

  return DEFAULT_MODE;
}

export function getDataMode(): DataMode {
  return normalizeMode(process.env.NEXT_PUBLIC_DATA_MODE);
}

export function getTransparencyApiUrl(): string {
  return process.env.NEXT_PUBLIC_TRANSPARENCY_API_URL?.trim() || "";
}

export function hasTransparencyApiConfigured(): boolean {
  return getTransparencyApiUrl().length > 0;
}

export function getCamaraApiBaseUrl(): string {
  return process.env.CAMARA_API_BASE_URL?.trim() || DEFAULT_CAMARA_API_BASE_URL;
}

export function hasCamaraApiConfigured(): boolean {
  return getCamaraApiBaseUrl().length > 0;
}
