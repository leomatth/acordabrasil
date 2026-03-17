import type { DataFetchResult } from "@/types/dataSource";
import type { StaffMember } from "@/types/politician";

const CAMARA_SOURCE_NAME = "Dados Abertos da Câmara dos Deputados";
const CAMARA_PORTAL_URL = "https://dadosabertos.camara.leg.br/";

export async function getFederalDeputyStaff(
  _deputadoId: number,
): Promise<DataFetchResult<StaffMember[]>> {
  const lastUpdated = new Date().toISOString();

  return {
    data: [],
    source: "api",
    mode: "live",
    lastUpdated,
    dataSourceInfo: {
      sourceName: CAMARA_SOURCE_NAME,
      sourceType: "official_portal",
      sourceUrl: CAMARA_PORTAL_URL,
      referencePeriod: "Mandato em exercício",
      lastUpdated,
    },
    errorMessage:
      "Dados de assessores do gabinete ainda não disponíveis de forma segura na fonte oficial atual.",
  };
}
