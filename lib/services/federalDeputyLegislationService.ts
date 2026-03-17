import { mapProposicaoToLegislation } from "@/lib/adapters/camaraProposicoesAdapter";
import {
  fetchDeputadoProposicoesFromCamara,
  fetchProposicaoByIdFromCamara,
} from "@/lib/services/camaraService";
import { getFederalDeputyVotingHistory } from "@/lib/services/federalDeputyVotesService";
import type { DataFetchResult } from "@/types/dataSource";
import type { LegislationItem, RelatedLegislationRelationType } from "@/types/legislation";

const CAMARA_SOURCE_NAME = "Dados Abertos da Câmara dos Deputados";
const CAMARA_DEPUTADO_PROPOSICOES_URL =
  "https://dadosabertos.camara.leg.br/api/v2/proposicoes?idDeputadoAutor={id}";
const CAMARA_PROPOSICOES_URL = "https://dadosabertos.camara.leg.br/api/v2/proposicoes";

function relationLabel(types: RelatedLegislationRelationType[]): string {
  const ordered = [...types];

  const labels: Record<RelatedLegislationRelationType, string> = {
    autor: "Autor",
    coautor: "Coautor",
    relator: "Relator",
    participante_votacao: "Participante de votação",
    outro_vinculo_oficial: "Outro vínculo oficial",
  };

  return ordered.map((item) => labels[item]).join(" • ");
}

function ensureLegislationWithRelation(
  item: LegislationItem,
  relationType: RelatedLegislationRelationType,
  relationSource: string,
): LegislationItem {
  const currentTypes = item.relationTypes ?? [];
  const mergedTypes = Array.from(new Set([...currentTypes, relationType]));

  return {
    ...item,
    relationTypes: mergedTypes,
    relationLabel: relationLabel(mergedTypes),
    relationSource,
  };
}

export async function getFederalDeputyRelatedLegislation(
  deputadoId: number,
  params: { ano?: number; limit?: number } = {},
): Promise<DataFetchResult<LegislationItem[]>> {
  const limit = params.limit ?? 24;
  const lastUpdated = new Date().toISOString();

  const authoredPayload = await fetchDeputadoProposicoesFromCamara(deputadoId, {
    ano: params.ano,
    pagina: 1,
    itens: limit,
  });

  const byId = new Map<string, LegislationItem>();

  authoredPayload
    .map((item) => mapProposicaoToLegislation(item as Parameters<typeof mapProposicaoToLegislation>[0]))
    .forEach((item) => {
      byId.set(
        item.id,
        ensureLegislationWithRelation(
          item,
          "autor",
          "Relação oficial por endpoint de proposições do deputado na Câmara",
        ),
      );
    });

  const votingHistoryResult = await getFederalDeputyVotingHistory(deputadoId, {
    limit: 60,
    itensVotacoes: 80,
    ano: params.ano,
  });

  const propositionIdsFromVoting = Array.from(
    new Set(
      votingHistoryResult.data
        .map((record) => record.proposicaoId)
        .filter((id): id is string => Boolean(id)),
    ),
  ).slice(0, limit);

  const missingIds = propositionIdsFromVoting.filter((id) => !byId.has(id));

  if (missingIds.length) {
    const resolved = await Promise.allSettled(
      missingIds.map(async (id) => {
        const numericId = Number(id);

        if (!Number.isFinite(numericId) || numericId <= 0) {
          return null;
        }

        const payload = await fetchProposicaoByIdFromCamara(numericId);
        const dados = (payload as { dados?: Record<string, unknown> }).dados;

        if (!dados) {
          return null;
        }

        return mapProposicaoToLegislation(dados as Parameters<typeof mapProposicaoToLegislation>[0]);
      }),
    );

    resolved.forEach((result) => {
      if (result.status !== "fulfilled" || !result.value) {
        return;
      }

      const item = result.value;
      byId.set(
        item.id,
        ensureLegislationWithRelation(
          item,
          "participante_votacao",
          "Vínculo oficial por votação nominal com proposição objeto na Câmara",
        ),
      );
    });
  }

  propositionIdsFromVoting.forEach((id) => {
    const existing = byId.get(id);

    if (!existing) {
      return;
    }

    byId.set(
      id,
      ensureLegislationWithRelation(
        existing,
        "participante_votacao",
        "Vínculo oficial por votação nominal com proposição objeto na Câmara",
      ),
    );
  });

  const items = Array.from(byId.values())
    .sort((a, b) => {
      const aTime = new Date(a.ultimaAtualizacao).getTime();
      const bTime = new Date(b.ultimaAtualizacao).getTime();
      return bTime - aTime;
    })
    .slice(0, limit);

  const unresolvedVotingLinks = propositionIdsFromVoting.length - items.filter((item) =>
    item.relationTypes?.includes("participante_votacao"),
  ).length;

  return {
    data: items,
    source: "api",
    mode: "live",
    lastUpdated,
    dataSourceInfo: {
      sourceName: CAMARA_SOURCE_NAME,
      sourceType: "api",
      sourceUrl: CAMARA_DEPUTADO_PROPOSICOES_URL.replace("{id}", String(deputadoId)),
      referencePeriod: params.ano ? String(params.ano) : undefined,
      lastUpdated,
    },
    errorMessage:
      unresolvedVotingLinks > 0
        ? `Cobertura parcial: ${unresolvedVotingLinks} votações não puderam ser vinculadas com segurança a proposições pela fonte oficial no recorte atual.`
        : undefined,
  };
}

export function getFederalDeputyLegislationSourceUrl(): string {
  return CAMARA_PROPOSICOES_URL;
}
