import { pecsMock } from "@/lib/mockData";
import {
  aggregateNominalVotes,
  aggregateVotingSessions,
  mapNominalVote,
  mapProposicaoToLegislation,
  mapVotacaoToVotingSession,
  summarizeNominalVotesByParty,
} from "@/lib/adapters/camaraProposicoesAdapter";
import { getDataMode } from "@/lib/config/dataSource";
import {
  fetchProposicaoByIdFromCamara,
  fetchProposicoesFromCamara,
  getVotosByVotacao,
  getVotacoesByProposicao,
} from "@/lib/services/camaraService";
import { fetchWithFallback } from "@/lib/utils/fetchWithFallback";
import type { DataFetchResult } from "@/types/dataSource";
import type { LegislationItem, ProposicaoFilters } from "@/types/legislation";

// Estratégia de migração gradual: etapa 3 (PECs e projetos de lei).
function mapMockLegislationToInternalModel(item: (typeof pecsMock)[number]): LegislationItem {
  const timestamp = new Date().toISOString();

  return {
    ...item,
    siglaTipo: "PEC",
    ano: item.numero.split("/")[1] || undefined,
    ementa: item.resumo,
    dataApresentacao: item.timeline[0]?.data,
    urlIntegra: undefined,
    autores: [item.politicos.autor],
    politicosEnvolvidos: [
      item.politicos.autor,
      item.politicos.relator,
      ...item.politicos.apoiadores,
    ],
    source: "mock",
    lastUpdated: item.ultimaAtualizacao || timestamp,
  };
}

function getMockLegislationItems(): LegislationItem[] {
  return pecsMock.map(mapMockLegislationToInternalModel);
}

async function fetchProposicoesApi(
  filters: ProposicaoFilters = {},
): Promise<LegislationItem[]> {
  const data = await fetchProposicoesFromCamara(filters);
  const mapped = data.map((item) =>
    mapProposicaoToLegislation(item as Parameters<typeof mapProposicaoToLegislation>[0]),
  );

  if (!mapped.length) {
    throw new Error("Sem proposições válidas retornadas pela Câmara.");
  }

  return mapped;
}

export async function getProposicoes(
  filters: ProposicaoFilters = {},
): Promise<DataFetchResult<LegislationItem[]>> {
  const mode = getDataMode();

  return fetchWithFallback({
    resourceName: "propostas legislativas",
    mode,
    fetcher: () => fetchProposicoesApi(filters),
    fallbackData: getMockLegislationItems(),
    liveFailureStrategy: "error",
  });
}

export async function getPECs(
  filters: Omit<ProposicaoFilters, "siglaTipo"> = {},
): Promise<DataFetchResult<LegislationItem[]>> {
  return getProposicoes({
    ...filters,
    siglaTipo: "PEC",
  });
}

export async function getLegislationItems(): Promise<DataFetchResult<LegislationItem[]>> {
  return getPECs();
}

export async function getLegislationById(
  id: string,
): Promise<DataFetchResult<LegislationItem | null>> {
  const mode = getDataMode();
  const fallbackData = getMockLegislationItems().find((item) => item.id === id) ?? null;

  const detailedResult = await fetchWithFallback({
    resourceName: `proposição ${id}`,
    mode,
    fetcher: async () => {
      const numericId = Number(id);
      const [payload, votacoesPayload] = await Promise.all([
        fetchProposicaoByIdFromCamara(numericId),
        getVotacoesByProposicao(numericId).catch(() => []),
      ]);

      const dados = (payload as { dados?: Record<string, unknown> }).dados;

      if (!dados) {
        return null;
      }

      const mapped = mapProposicaoToLegislation(
        dados as Parameters<typeof mapProposicaoToLegislation>[0],
      );

      const votingSessions = votacoesPayload
        .map((item) => mapVotacaoToVotingSession(item as Record<string, unknown>))
        .filter((session) => Boolean(session.id));

      if (!votingSessions.length) {
        return mapped;
      }

      const votingSessionsWithNominal = await Promise.all(
        votingSessions.map(async (session) => {
          const nominalPayload = await getVotosByVotacao(session.id).catch(() => []);

          if (!nominalPayload.length) {
            return session;
          }

          const nominalVotes = nominalPayload
            .map((item) => mapNominalVote(item as Record<string, unknown>))
            .filter((item) => Boolean(item.deputado));

          if (!nominalVotes.length) {
            return session;
          }

          const nominalTotals = aggregateNominalVotes(nominalVotes);

          return {
            ...session,
            votos:
              nominalTotals.favor + nominalTotals.contra + nominalTotals.abstencao > 0
                ? nominalTotals
                : session.votos,
            resumoPartidos: summarizeNominalVotesByParty(nominalVotes),
            votosNominais: nominalVotes,
          };
        }),
      );

      const aggregatedVotes = aggregateVotingSessions(votingSessionsWithNominal);

      return {
        ...mapped,
        votos:
          aggregatedVotes.favor + aggregatedVotes.contra + aggregatedVotes.abstencao > 0
            ? aggregatedVotes
            : mapped.votos,
        votacoes: votingSessionsWithNominal,
      };
    },
    fallbackData,
    liveFailureStrategy: "error",
  });

  if (detailedResult.data) {
    return detailedResult;
  }

  const listResult = await getLegislationItems();

  return {
    ...listResult,
    data: listResult.data.find((item) => item.id === id) ?? null,
  };
}
