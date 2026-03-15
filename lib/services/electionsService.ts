import { electionPollMock } from "@/lib/mockData";
import { fetchWithFallback } from "@/lib/utils/fetchWithFallback";
import type { DataFetchResult } from "@/types/dataSource";
import type { ElectionPollEntry } from "@/types/election";

// Estratégia de migração gradual: etapa 4 (eleições e pesquisas).
export async function getElectionPoll(): Promise<DataFetchResult<ElectionPollEntry[]>> {
  return fetchWithFallback({
    resourceName: "pesquisa eleitoral",
    fallbackData: electionPollMock,
  });
}
