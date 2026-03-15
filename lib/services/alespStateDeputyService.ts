import { buildPoliticianSlug } from "@/lib/utils/politicianSlug";
import { buildScopedId } from "@/lib/services/politicalProviders/types";
import type { DataFetchResult, DataSourceInfo } from "@/types/dataSource";
import type { ExpenseItem, ExpenseSummary } from "@/types/expense";
import type { PresenceInsight, PoliticianProfile } from "@/types/politician";

const ALESP_XML_URL = "https://www.al.sp.gov.br/repositorioDados/deputados/deputados.xml";
const ALESP_DETAILS_URL = "https://legis-backend-api-portal.pub.al.sp.gov.br/api_portal/parlamentar-portal/detalhes";
const ALESP_PRESENCA_URL = "https://legis-backend-api-portal.pub.al.sp.gov.br/api_portal/presencaPlenario";
const ALESP_CONTAS_URL = "https://www.al.sp.gov.br/deputado/contas/";

function getSourceInfo(referencePeriod?: string): DataSourceInfo {
  return {
    sourceName: "Dados Oficiais da ALESP",
    sourceType: "official_portal",
    sourceUrl: "https://www.al.sp.gov.br/",
    referencePeriod,
    lastUpdated: new Date().toISOString(),
  };
}

function decodeHtml(value: string): string {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function stripTags(value: string): string {
  return decodeHtml(value.replace(/<[^>]+>/g, " "));
}

function extractTag(xmlBlock: string, tag: string): string {
  const regex = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, "i");
  const match = xmlBlock.match(regex);
  return match ? decodeHtml(match[1].trim()) : "";
}

function parseXmlDeputados(xml: string): PoliticianProfile[] {
  const blocks = Array.from(xml.matchAll(/<Deputado>([\s\S]*?)<\/Deputado>/gi)).map((match) => match[1]);

  return blocks.reduce<PoliticianProfile[]>((acc, block) => {
      const idParlamentar = Number(extractTag(block, "IdDeputado"));
      const matricula = extractTag(block, "Matricula");
      const nome = extractTag(block, "NomeParlamentar");
      const partido = extractTag(block, "Partido");
      const email = extractTag(block, "Email");
      const biografia = stripTags(extractTag(block, "Biografia"));
      const areaAtuacao = stripTags(extractTag(block, "txtAreaAtuacao"));
      const situacao = extractTag(block, "Situacao");

      if (!idParlamentar || !nome) {
        return acc;
      }

      const scopedId = buildScopedId("Deputado Estadual", idParlamentar);
      const lastUpdated = new Date().toISOString();

      acc.push({
        id: scopedId,
        externalId: matricula || undefined,
        slug: buildPoliticianSlug(scopedId, nome),
        nome,
        cargo: "Deputado Estadual" as const,
        partido: partido || "SEM_PARTIDO",
        estado: "SP",
        foto: "/placeholder-politico.svg",
        resumo: "Deputado Estadual da Assembleia Legislativa do Estado de São Paulo.",
        biografia: biografia || "Dados oficiais da ALESP.",
        biografiaCurta: areaAtuacao || "Atuação parlamentar disponível na ALESP.",
        gastosGabinete: 0,
        presencaSessoes: 0,
        votacoesRelevantes: [],
        principaisBandeiras: areaAtuacao ? [areaAtuacao] : ["Poder Legislativo Estadual"],
        situacao,
        email: email || undefined,
        source: "api" as const,
        lastUpdated,
        dataSourceInfo: {
          ...getSourceInfo("Mandato atual"),
          lastUpdated,
        },
        coverageStatus: "partial" as const,
        availabilityMessage:
          "Cobertura parcial ALESP: presença e prestação de contas oficiais disponíveis; outras seções em integração.",
      } satisfies PoliticianProfile);

      return acc;
    }, []);
}

export async function getAlespStateDeputados(): Promise<DataFetchResult<PoliticianProfile[]>> {
  const response = await fetch(ALESP_XML_URL, {
    headers: {
      accept: "application/xml,text/xml,*/*",
    },
    next: {
      revalidate: 60 * 30,
    },
  });

  if (!response.ok) {
    throw new Error(`Falha ao consultar ALESP (${response.status})`);
  }

  const xml = await response.text();
  const all = parseXmlDeputados(xml);

  const data = all.filter((item) => item.situacao === "EXE");

  return {
    data,
    source: "api",
    mode: "live",
    lastUpdated: new Date().toISOString(),
    dataSourceInfo: getSourceInfo("Mandato atual"),
  };
}

type AlespDetailPayload = {
  txNomeParlamentar?: string;
  txPartido?: string;
  biografia?: {
    txFotoGrande?: string | null;
    txHistorico?: string | null;
    txAreaAtuacao?: string | null;
    txBaseEleitoral?: string | null;
    txEmail?: string | null;
    nuRamal?: string | null;
    nuSala?: string | null;
    nuAndar?: string | null;
  };
};

export async function getAlespDeputadoDetailByMatricula(matricula: string): Promise<Partial<PoliticianProfile>> {
  const response = await fetch(`${ALESP_DETAILS_URL}/${matricula}`, {
    headers: {
      accept: "application/json",
    },
    next: {
      revalidate: 60 * 30,
    },
  });

  if (!response.ok) {
    throw new Error(`Falha ao consultar detalhe da ALESP (${response.status})`);
  }

  const payload = (await response.json()) as AlespDetailPayload;
  const fotoGrande = payload.biografia?.txFotoGrande;
  const foto = fotoGrande
    ? `https://www3.al.sp.gov.br/legis/${String(fotoGrande).replace(/^\//, "")}`
    : "/placeholder-politico.svg";

  const areaAtuacao = stripTags(String(payload.biografia?.txAreaAtuacao ?? ""));
  const baseEleitoral = stripTags(String(payload.biografia?.txBaseEleitoral ?? ""));
  const historico = stripTags(String(payload.biografia?.txHistorico ?? ""));

  return {
    foto,
    partido: payload.txPartido || undefined,
    biografia: historico || undefined,
    biografiaCurta: areaAtuacao || undefined,
    resumo: baseEleitoral ? `Base eleitoral: ${baseEleitoral}` : undefined,
    email: payload.biografia?.txEmail || undefined,
    principaisBandeiras: areaAtuacao ? [areaAtuacao] : undefined,
  };
}

function parseMonthYear(token: string): { ano: number; mes: number } | null {
  const match = String(token).match(/^(\d{4})\/(\d{1,2})$/);
  if (!match) return null;
  return {
    ano: Number(match[1]),
    mes: Number(match[2]),
  };
}

function getMonthRange(ano: number, mes: number): { inicio: string; fim: string } {
  const first = new Date(ano, mes - 1, 1);
  const last = new Date(ano, mes, 0);
  const toYmd = (date: Date) => date.toISOString().slice(0, 10);

  return {
    inicio: toYmd(first),
    fim: toYmd(last),
  };
}

export async function getAlespDeputadoPresenceInsight(
  stateDeputyScopedId: number,
): Promise<DataFetchResult<PresenceInsight>> {
  const idParlamentar = stateDeputyScopedId - 4000000;

  const mesesResponse = await fetch(`${ALESP_PRESENCA_URL}/mesesAnosMandatosParlamentar/${idParlamentar}`, {
    headers: { accept: "application/json" },
    next: { revalidate: 60 * 10 },
  });

  if (!mesesResponse.ok) {
    throw new Error(`Falha ao consultar presença ALESP (${mesesResponse.status})`);
  }

  const meses = (await mesesResponse.json()) as string[];

  let selected: { ano: number; mes: number } | null = null;
  let totalSessoes = 0;
  let totalAusencias = 0;

  for (const item of meses) {
    const parsed = parseMonthYear(item);
    if (!parsed) continue;

    const sessoesResponse = await fetch(
      `${ALESP_PRESENCA_URL}/sessoesPlenariasPorPeriodo/${parsed.mes}/${parsed.ano}`,
      {
        headers: { accept: "application/json" },
        next: { revalidate: 60 * 10 },
      },
    );

    if (!sessoesResponse.ok) {
      continue;
    }

    const sessoes = (await sessoesResponse.json()) as unknown[];

    if (!Array.isArray(sessoes) || !sessoes.length) {
      continue;
    }

    const range = getMonthRange(parsed.ano, parsed.mes);
    const ausenciasResponse = await fetch(
      `${ALESP_PRESENCA_URL}/ausenciasPorPeriodoAndParlamentar/${range.inicio}/${range.fim}/${idParlamentar}`,
      {
        headers: { accept: "application/json" },
        next: { revalidate: 60 * 10 },
      },
    );

    if (!ausenciasResponse.ok) {
      continue;
    }

    const ausencias = (await ausenciasResponse.json()) as unknown[];

    selected = parsed;
    totalSessoes = sessoes.length;
    totalAusencias = Array.isArray(ausencias) ? ausencias.length : 0;
    break;
  }

  const lastUpdated = new Date().toISOString();
  const sourceInfo = {
    sourceName: "API Portal ALESP - Presença em Plenário",
    sourceType: "api" as const,
    sourceUrl: `${ALESP_PRESENCA_URL}/parlamentares/`,
    referencePeriod: selected ? `${selected.mes}/${selected.ano}` : "Período recente disponível",
    lastUpdated,
  };

  if (!selected || !totalSessoes) {
    return {
      data: {
        percentualPresenca: null,
        sessoesConsideradas: null,
        dataSourceInfo: sourceInfo,
        integrationMessage: "Nenhuma sessão com dados consolidados de presença encontrada para este parlamentar no período recente.",
      },
      source: "api",
      mode: "live",
      lastUpdated,
    };
  }

  const percentualPresenca = Number((((totalSessoes - totalAusencias) / totalSessoes) * 100).toFixed(1));

  return {
    data: {
      percentualPresenca,
      sessoesConsideradas: totalSessoes,
      dataSourceInfo: sourceInfo,
    },
    source: "api",
    mode: "live",
    lastUpdated,
  };
}

function parseBrazilMoney(value: string): number {
  const normalized = value.replace(/\./g, "").replace(",", ".").trim();
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function extractNaturezaRows(html: string): Array<{ categoria: string; valor: number; detalheUrl?: string }> {
  const sectionMatch = html.match(/<div id="porNaturezas"[\s\S]*?<\/div>\s*<\/div>/i);
  const section = sectionMatch ? sectionMatch[0] : html;
  const rows = Array.from(
    section.matchAll(
      /<tr>[\s\S]*?<a[^>]*href="([^"]*)"[^>]*>\s*([\s\S]*?)\s*<\/a>[\s\S]*?<span class="dinheiro">([0-9\.,]+)<\/span>/gi,
    ),
  );

  return rows.map((match) => ({
    detalheUrl: match[1]?.startsWith("/") ? `https://www.al.sp.gov.br${match[1]}` : match[1],
    categoria: stripTags(match[2] ?? "Despesa"),
    valor: parseBrazilMoney(match[3] ?? "0"),
  }));
}

export async function getAlespDeputadoExpensesByMatricula(
  matricula: string,
  params: { ano?: number; mes?: number } = {},
): Promise<{
  summaryResult: DataFetchResult<ExpenseSummary>;
  itemsResult: DataFetchResult<ExpenseItem[]>;
}> {
  const now = new Date();
  const ano = params.ano ?? now.getFullYear();
  const mes = params.mes ?? now.getMonth() + 1;
  const url = `${ALESP_CONTAS_URL}?matricula=${matricula}&mes=${mes}&ano=${ano}&tipo=naturezas`;

  const response = await fetch(url, {
    headers: {
      accept: "text/html,*/*",
    },
    next: {
      revalidate: 60 * 10,
    },
  });

  if (!response.ok) {
    throw new Error(`Falha ao consultar prestação de contas ALESP (${response.status})`);
  }

  const html = await response.text();
  const categories = extractNaturezaRows(html);
  const deputyNameMatch = html.match(/<h3 class="msg">\s*([\s\S]*?)\s*<\/h3>/i);
  const nomeDeputado = deputyNameMatch ? stripTags(deputyNameMatch[1]) : "Deputado Estadual";
  const lastUpdated = new Date().toISOString();
  const sourceInfo: DataSourceInfo = {
    sourceName: "Prestação de Contas ALESP",
    sourceType: "official_portal",
    sourceUrl: url,
    referencePeriod: `${String(mes).padStart(2, "0")}/${ano}`,
    lastUpdated,
  };

  const items: ExpenseItem[] = categories.map((item, index) => ({
    id: `alesp-${matricula}-${ano}-${mes}-${index}`,
    deputadoId: 4000000,
    nomeDeputado,
    partido: "N/A",
    estado: "SP",
    fornecedor: "Natureza de despesa",
    tipoDespesa: item.categoria,
    valorDocumento: item.valor,
    valorLiquido: item.valor,
    valorGlosa: 0,
    dataDocumento: new Date(ano, mes - 1, 1).toISOString(),
    urlDocumento: item.detalheUrl,
    ano,
    mes,
    source: "api",
    lastUpdated: sourceInfo.lastUpdated,
    dataSourceInfo: sourceInfo,
  }));

  const total = items.reduce((acc, item) => acc + item.valorLiquido, 0);
  const maiorCategoria = items.slice().sort((a, b) => b.valorLiquido - a.valorLiquido)[0]?.tipoDespesa;

  const summary: ExpenseSummary = {
    totalDespesas: total,
    totalLiquido: total,
    totalGlosa: 0,
    quantidadeDespesas: items.length,
    maiorCategoria,
    categoriasAgrupadas: items.map((item) => ({ categoria: item.tipoDespesa, valor: item.valorLiquido })),
    despesasRecentes: items.slice(0, 10),
    source: "api",
    lastUpdated: sourceInfo.lastUpdated,
    dataSourceInfo: sourceInfo,
  };

  return {
    summaryResult: {
      data: summary,
      source: "api",
      mode: "live",
      lastUpdated,
      dataSourceInfo: sourceInfo,
    },
    itemsResult: {
      data: items,
      source: "api",
      mode: "live",
      lastUpdated,
      dataSourceInfo: sourceInfo,
    },
  };
}
