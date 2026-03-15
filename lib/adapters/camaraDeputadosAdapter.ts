import type { PoliticianProfile } from "@/types/politician";
import { buildPoliticianSlug } from "@/lib/utils/politicianSlug";
import { normalizeParty } from "@/lib/utils/partyNormalization";

type CamaraDeputadoListItem = {
  id: number;
  nome: string;
  siglaPartido?: string;
  siglaUf?: string;
  urlFoto?: string;
};

type CamaraDeputadoDetailResponse = {
  dados?: {
    id?: number;
    nomeCivil?: string;
    ultimoStatus?: {
      id?: number;
      nome?: string;
      siglaPartido?: string;
      siglaUf?: string;
      urlFoto?: string;
      email?: string;
      situacao?: string;
    };
  };
};

function resolveDeputadoName(payload: Record<string, unknown>): string {
  const rawName = String(
    payload.nome ?? payload.ultimoStatusNome ?? payload.nomeCivil ?? "",
  ).trim();

  return rawName || "Nome indisponível";
}

function resolveDeputadoState(payload: Record<string, unknown>): string {
  const rawState = String(payload.siglaUf ?? payload.siglaUF ?? payload.estado ?? "")
    .trim()
    .toUpperCase();

  return rawState || "--";
}

function buildPoliticianBase({
  id,
  nome,
  partido,
  estado,
  foto,
  email,
  situacao,
  source,
  lastUpdated,
}: {
  id: number;
  nome: string;
  partido: string;
  estado: string;
  foto: string;
  email?: string;
  situacao?: string;
  source: PoliticianProfile["source"];
  lastUpdated: string;
}): PoliticianProfile {
  const resumo = `Deputado federal ${partido} (${estado}).`;

  return {
    id,
    camaraId: id,
    slug: buildPoliticianSlug(id, nome),
    nome,
    cargo: "Deputado Federal",
    partido,
    estado,
    foto,
    resumo,
    biografia: "Biografia em atualização com base em dados oficiais da Câmara dos Deputados.",
    biografiaCurta: "Dados oficiais da Câmara dos Deputados em integração gradual.",
    gastosGabinete: 0,
    presencaSessoes: 0,
    votacoesRelevantes: [],
    principaisBandeiras: ["Transparência", "Fiscalização", "Legislativo"],
    situacao,
    email,
    source,
    lastUpdated,
    dataSourceInfo: {
      sourceName: "Dados Abertos da Câmara dos Deputados",
      sourceType: "official_portal",
      sourceUrl: "https://dadosabertos.camara.leg.br/",
      lastUpdated,
    },
  };
}

export function mapDeputadoListItemToPolitician(
  item: CamaraDeputadoListItem,
): PoliticianProfile {
  const lastUpdated = new Date().toISOString();
  const safeName = resolveDeputadoName(item as Record<string, unknown>);

  return buildPoliticianBase({
    id: item.id,
    nome: safeName,
    partido: normalizeParty(item.siglaPartido || "SEM_PARTIDO"),
    estado: resolveDeputadoState(item as Record<string, unknown>),
    foto: item.urlFoto || "/placeholder-politico.svg",
    source: "api",
    lastUpdated,
  });
}

export function mapDeputadoDetailToPolitician(
  payload: CamaraDeputadoDetailResponse,
): PoliticianProfile | null {
  const dados = payload.dados;

  if (!dados) {
    return null;
  }

  const status = dados.ultimoStatus;
  const id = status?.id ?? dados.id;
  const nome = resolveDeputadoName({
    nome: (dados as { nome?: string }).nome,
    ultimoStatusNome: status?.nome,
    nomeCivil: dados.nomeCivil,
  });

  if (!id) {
    return null;
  }

  return buildPoliticianBase({
    id,
    nome,
    partido: normalizeParty(status?.siglaPartido || "SEM_PARTIDO"),
    estado: resolveDeputadoState(status as Record<string, unknown>),
    foto: status?.urlFoto || "/placeholder-politico.svg",
    email: status?.email,
    situacao: status?.situacao,
    source: "api",
    lastUpdated: new Date().toISOString(),
  });
}
