import { getFederalDeputyVotingSnapshot } from "@/lib/services/federalDeputyVotesService";
import type { DataFetchResult } from "@/types/dataSource";
import type { PresenceInsight } from "@/types/politician";

const CAMARA_SOURCE_NAME = "Dados Abertos da Câmara dos Deputados";
const CAMARA_VOTACOES_URL = "https://dadosabertos.camara.leg.br/api/v2/votacoes";

export async function getFederalDeputyPresenceInsight(
  deputadoId: number,
  params: { itensVotacoes?: number; ano?: number } = {},
): Promise<DataFetchResult<PresenceInsight>> {
  const snapshot = await getFederalDeputyVotingSnapshot(deputadoId, {
    limit: params.itensVotacoes ?? 40,
    itensVotacoes: params.itensVotacoes ?? 40,
    ano: params.ano,
  });

  const sessoesConsideradas = snapshot.totalNominalSessionsAnalyzed;
  const presencasValidas = snapshot.records.length;
  const lastUpdated = new Date().toISOString();

  if (!sessoesConsideradas) {
    return {
      data: {
        percentualPresenca: null,
        sessoesConsideradas: null,
        presencasValidas: null,
        metodologiaResumo:
          "Métrica calculada por participação nominal em votações retornadas pela API da Câmara.",
        dataSourceInfo: {
          sourceName: CAMARA_SOURCE_NAME,
          sourceType: "api",
          sourceUrl: CAMARA_VOTACOES_URL,
          referencePeriod: params.ano ? String(params.ano) : undefined,
          lastUpdated,
        },
        integrationMessage:
          "Não houve sessões nominais suficientes no período para calcular presença com segurança.",
      },
      source: "api",
      mode: "live",
      lastUpdated,
    };
  }

  const percentualPresenca = Math.round((presencasValidas / sessoesConsideradas) * 1000) / 10;

  return {
    data: {
      percentualPresenca,
      sessoesConsideradas,
      presencasValidas,
      metodologiaResumo:
        "Percentual baseado em participação do deputado nas votações nominais analisadas no período. Este indicador não representa presença plenária completa da Câmara.",
      dataSourceInfo: {
        sourceName: CAMARA_SOURCE_NAME,
        sourceType: "api",
        sourceUrl: CAMARA_VOTACOES_URL,
        referencePeriod: params.ano ? String(params.ano) : undefined,
        lastUpdated,
      },
    },
    source: "api",
    mode: "live",
    lastUpdated,
  };
}
