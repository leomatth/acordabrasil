import { getDataMode } from "@/lib/config/dataSource";
import { logger } from "@/lib/utils/logger";
import type { DataFetchResult, DataMode } from "@/types/dataSource";

type FetchWithFallbackParams<T> = {
  resourceName: string;
  fetcher?: () => Promise<T>;
  fallbackData: T;
  fallbackLastUpdated?: string;
  mode?: DataMode;
  liveFailureStrategy?: "fallback" | "error";
};

function nowIso(): string {
  return new Date().toISOString();
}

export async function fetchWithFallback<T>({
  resourceName,
  fetcher,
  fallbackData,
  fallbackLastUpdated,
  mode,
  liveFailureStrategy = "fallback",
}: FetchWithFallbackParams<T>): Promise<DataFetchResult<T>> {
  const resolvedMode = mode ?? getDataMode();
  const fallbackTimestamp = fallbackLastUpdated ?? nowIso();

  if (resolvedMode === "mock" || !fetcher) {
    return {
      data: fallbackData,
      source: "mock",
      mode: resolvedMode,
      lastUpdated: fallbackTimestamp,
    };
  }

  try {
    const data = await fetcher();

    return {
      data,
      source: "api",
      mode: resolvedMode,
      lastUpdated: nowIso(),
    };
  } catch (error) {
    logger.warn(`Falha ao buscar ${resourceName} na API pública.`, {
      mode: resolvedMode,
      error,
    });

    if (resolvedMode === "live" && liveFailureStrategy === "error") {
      throw new Error(
        `Não foi possível carregar ${resourceName} na fonte pública oficial no modo live.`,
      );
    }

    const isLiveMode = resolvedMode === "live";
    const errorMessage = isLiveMode
      ? "Não foi possível atualizar agora. Exibindo dados simulados temporariamente."
      : "Exibindo dados simulados no momento.";

    return {
      data: fallbackData,
      source: "mock",
      mode: resolvedMode,
      lastUpdated: fallbackTimestamp,
      errorMessage,
    };
  }
}
