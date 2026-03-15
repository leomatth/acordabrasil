import type { StateCode, StatePublicData } from "@/types/state";

export type PecStatus = "Aprovada" | "Rejeitada" | "Em tramitação";

export type PecSubject =
  | "Economia"
  | "Impostos"
  | "Previdência"
  | "Educação"
  | "Saúde"
  | "Infraestrutura";

export type PecTimelineEvent = {
  evento: string;
  data: string;
};

export type PecVotes = {
  favor: number;
  contra: number;
  abstencao: number;
};

export type PecPoliticians = {
  autor: string;
  relator: string;
  apoiadores: string[];
};

export type PecData = {
  id: string;
  numero: string;
  titulo: string;
  status: PecStatus;
  assunto: PecSubject;
  resumo: string;
  statusAtual: string;
  impactoFinanceiro?: number;
  ultimaAtualizacao: string;
  politicos: PecPoliticians;
  timeline: PecTimelineEvent[];
  votos: PecVotes;
};

export type TaxDistribution = {
  name: string;
  value: number;
};

export type TaxCategory = "Federal" | "Estadual" | "Municipal";

export type TaxGuideItem = {
  nome: string;
  sigla: string;
  categoria: TaxCategory;
  descricao: string;
  incidencia: string;
  aliquota: string;
  exemplo: string;
};

export type TaxSummaryItem = {
  titulo: string;
  valor: string;
  descricao: string;
};

export type TaxFAQItem = {
  pergunta: string;
  resposta: string;
};

export type ElectionOffice = {
  nome: string;
  descricao: string;
  responsabilidades: string[];
  mandato: string;
};

export type CurrentOfficeHolder = {
  cargo: string;
  nome: string;
  partido: string;
  estado?: string;
};

export type ElectionCandidate = {
  nome: string;
  partido: string;
  cargoDisputado: string;
  descricao: string;
};

export type PollEntry = {
  candidato: string;
  percentual: number;
};

export type PoliticianOffice =
  | "Presidente"
  | "Senador"
  | "Deputado Federal"
  | "Deputado Estadual"
  | "Governador";

export type PoliticianVote = {
  tema: string;
  voto: "A favor" | "Contra" | "Abstenção";
};

export type PoliticianData = {
  id: number;
  slug: string;
  nome: string;
  cargo: PoliticianOffice;
  partido: string;
  estado: string;
  foto: string;
  resumo: string;
  biografia: string;
  gastosGabinete: number;
  presencaSessoes: number;
  votacoesRelevantes: PoliticianVote[];
  principaisBandeiras: string[];
};

export type SupportReason = {
  title: string;
  description: string;
};

export type SupportMethod = {
  title: string;
  description: string;
  ctaLabel: string;
};

export type AboutPrinciple = {
  title: string;
  description: string;
};

export const mainCounters = {
  totalPublicSpending: 3842398294239,
  spendingToday: 7234998888,
  spendingMonth: 221998374222,
  spendingPerCitizen: 17789,
  taxesCollectedToday: 9876543210,
};

export const PEC_STATUS_OPTIONS: PecStatus[] = [
  "Aprovada",
  "Rejeitada",
  "Em tramitação",
];

export const PEC_SUBJECT_OPTIONS: PecSubject[] = [
  "Economia",
  "Impostos",
  "Previdência",
  "Educação",
  "Saúde",
  "Infraestrutura",
];

export const pecsMock: PecData[] = [
  {
    id: "pec-45",
    numero: "PEC 45/2024",
    titulo: "Reforma Tributária Nacional",
    status: "Em tramitação",
    assunto: "Impostos",
    resumo:
      "Unifica tributos sobre consumo e cria regras de transição para estados e municípios.",
    statusAtual: "Em tramitação na Câmara.",
    impactoFinanceiro: 50000000000,
    ultimaAtualizacao: "2026-02-18",
    politicos: {
      autor: "Dep. Henrique Paiva",
      relator: "Dep. Camila Freitas",
      apoiadores: ["Dep. Bruno Neri", "Sen. Lúcia Andrade"],
    },
    timeline: [
      { evento: "Apresentação", data: "2024-03-12" },
      { evento: "Comissão Especial", data: "2024-06-20" },
      { evento: "Votação na Câmara", data: "2025-11-04" },
      { evento: "Votação no Senado", data: "2026-03-07" },
    ],
    votos: {
      favor: 312,
      contra: 142,
      abstencao: 5,
    },
  },
  {
    id: "pec-12",
    numero: "PEC 12/2025",
    titulo: "Novo Pacto Federativo de Investimentos",
    status: "Aprovada",
    assunto: "Economia",
    resumo:
      "Reorganiza a distribuição de receitas e amplia autonomia fiscal para estados.",
    statusAtual: "Aprovada e promulgada.",
    impactoFinanceiro: 27400000000,
    ultimaAtualizacao: "2026-01-21",
    politicos: {
      autor: "Sen. Otávio Reis",
      relator: "Sen. Helena Duarte",
      apoiadores: ["Dep. Ana Ribeiro", "Dep. Diego Matos"],
    },
    timeline: [
      { evento: "Apresentação", data: "2025-02-10" },
      { evento: "Comissão", data: "2025-05-09" },
      { evento: "Votação na Câmara", data: "2025-09-16" },
      { evento: "Votação no Senado", data: "2025-12-11" },
      { evento: "Promulgação", data: "2026-01-21" },
    ],
    votos: {
      favor: 389,
      contra: 92,
      abstencao: 7,
    },
  },
  {
    id: "pec-07",
    numero: "PEC 07/2025",
    titulo: "Teto Emergencial de Gastos Correntes",
    status: "Rejeitada",
    assunto: "Economia",
    resumo:
      "Propõe gatilhos automáticos de contenção fiscal em períodos de queda de arrecadação.",
    statusAtual: "Rejeitada no plenário do Senado.",
    impactoFinanceiro: 12600000000,
    ultimaAtualizacao: "2026-02-03",
    politicos: {
      autor: "Dep. João Nogueira",
      relator: "Sen. Renata Campos",
      apoiadores: ["Dep. Marcelo Viana", "Sen. Igor Lemos"],
    },
    timeline: [
      { evento: "Apresentação", data: "2025-01-28" },
      { evento: "Comissão", data: "2025-04-13" },
      { evento: "Votação na Câmara", data: "2025-08-30" },
      { evento: "Votação no Senado", data: "2026-02-03" },
      { evento: "Rejeição", data: "2026-02-03" },
    ],
    votos: {
      favor: 201,
      contra: 286,
      abstencao: 10,
    },
  },
  {
    id: "pec-31",
    numero: "PEC 31/2024",
    titulo: "Plano Nacional de Infraestrutura Logística",
    status: "Em tramitação",
    assunto: "Infraestrutura",
    resumo:
      "Destina percentual mínimo do orçamento para corredores logísticos e manutenção viária.",
    statusAtual: "Em análise na Comissão de Infraestrutura.",
    impactoFinanceiro: 38000000000,
    ultimaAtualizacao: "2026-03-01",
    politicos: {
      autor: "Sen. Rafael Amaral",
      relator: "Dep. Priscila Monteiro",
      apoiadores: ["Dep. Rodrigo Campos", "Sen. Karina Nunes"],
    },
    timeline: [
      { evento: "Apresentação", data: "2024-09-19" },
      { evento: "Comissão", data: "2025-02-15" },
      { evento: "Votação na Câmara", data: "2025-12-02" },
    ],
    votos: {
      favor: 278,
      contra: 161,
      abstencao: 14,
    },
  },
  {
    id: "pec-22",
    numero: "PEC 22/2025",
    titulo: "Novo Modelo de Financiamento da Educação Básica",
    status: "Aprovada",
    assunto: "Educação",
    resumo:
      "Amplia repasses por desempenho e vulnerabilidade para redes municipais e estaduais.",
    statusAtual: "Aprovada e aguardando regulamentação.",
    impactoFinanceiro: 19200000000,
    ultimaAtualizacao: "2026-01-10",
    politicos: {
      autor: "Dep. Larissa Teles",
      relator: "Sen. Mauro Teixeira",
      apoiadores: ["Dep. Vitor Azevedo", "Sen. Ana Lins"],
    },
    timeline: [
      { evento: "Apresentação", data: "2025-03-08" },
      { evento: "Comissão", data: "2025-06-17" },
      { evento: "Votação na Câmara", data: "2025-10-29" },
      { evento: "Votação no Senado", data: "2025-12-19" },
      { evento: "Promulgação", data: "2026-01-10" },
    ],
    votos: {
      favor: 401,
      contra: 71,
      abstencao: 9,
    },
  },
  {
    id: "pec-18",
    numero: "PEC 18/2024",
    titulo: "Sustentabilidade da Previdência dos Municípios",
    status: "Em tramitação",
    assunto: "Previdência",
    resumo:
      "Cria parâmetros progressivos de contribuição para regimes próprios municipais.",
    statusAtual: "Em tramitação no Senado.",
    impactoFinanceiro: 11800000000,
    ultimaAtualizacao: "2026-02-25",
    politicos: {
      autor: "Sen. Beatriz Mota",
      relator: "Dep. César Faria",
      apoiadores: ["Dep. Bruno Duarte", "Sen. Leandro Pires"],
    },
    timeline: [
      { evento: "Apresentação", data: "2024-07-14" },
      { evento: "Comissão", data: "2025-01-23" },
      { evento: "Votação na Câmara", data: "2025-09-12" },
      { evento: "Votação no Senado", data: "2026-02-25" },
    ],
    votos: {
      favor: 266,
      contra: 192,
      abstencao: 11,
    },
  },
  {
    id: "pec-29",
    numero: "PEC 29/2025",
    titulo: "Rede Nacional de Atenção Primária em Saúde",
    status: "Em tramitação",
    assunto: "Saúde",
    resumo:
      "Define metas nacionais de cobertura de atenção básica com financiamento tripartite.",
    statusAtual: "Em análise técnica na Câmara.",
    impactoFinanceiro: 22400000000,
    ultimaAtualizacao: "2026-03-05",
    politicos: {
      autor: "Dep. Natália Pires",
      relator: "Dep. Gustavo Rocha",
      apoiadores: ["Sen. Mônica Valença", "Dep. Thiago Nascimento"],
    },
    timeline: [
      { evento: "Apresentação", data: "2025-04-04" },
      { evento: "Comissão", data: "2025-08-18" },
      { evento: "Votação na Câmara", data: "2026-03-05" },
    ],
    votos: {
      favor: 298,
      contra: 143,
      abstencao: 8,
    },
  },
  {
    id: "pec-11",
    numero: "PEC 11/2024",
    titulo: "Regra de Transparência para Renúncias Tributárias",
    status: "Aprovada",
    assunto: "Impostos",
    resumo:
      "Exige publicação anual detalhada de benefícios fiscais e metas de compensação.",
    statusAtual: "Aprovada e em fase de implementação.",
    impactoFinanceiro: 9000000000,
    ultimaAtualizacao: "2026-02-12",
    politicos: {
      autor: "Dep. Felipe Noronha",
      relator: "Sen. Roberta Lima",
      apoiadores: ["Dep. Clara Nogueira", "Sen. Paulo Silveira"],
    },
    timeline: [
      { evento: "Apresentação", data: "2024-05-30" },
      { evento: "Comissão", data: "2024-10-11" },
      { evento: "Votação na Câmara", data: "2025-06-28" },
      { evento: "Votação no Senado", data: "2025-11-07" },
      { evento: "Promulgação", data: "2026-02-12" },
    ],
    votos: {
      favor: 367,
      contra: 101,
      abstencao: 6,
    },
  },
];

export function getPecById(id: string): PecData | undefined {
  return pecsMock.find((pec) => pec.id === id);
}

export const taxDistributionMock: TaxDistribution[] = [
  { name: "ICMS", value: 32 },
  { name: "Imposto de Renda", value: 24 },
  { name: "INSS", value: 20 },
  { name: "IPI", value: 12 },
  { name: "ISS", value: 12 },
];

export const taxSummaryMock: TaxSummaryItem[] = [
  {
    titulo: "Carga tributária média estimada",
    valor: "33%",
    descricao: "Percentual aproximado da renda e consumo destinado a tributos.",
  },
  {
    titulo: "Tributos principais listados",
    valor: "9",
    descricao: "Impostos mais comuns para leitura inicial e educativa.",
  },
  {
    titulo: "Esferas de cobrança",
    valor: "3",
    descricao: "Federal, Estadual e Municipal.",
  },
  {
    titulo: "Ferramenta prática",
    valor: "Simulador",
    descricao: "Estime rapidamente quanto imposto você paga por salário.",
  },
];

export const taxGuideMock: TaxGuideItem[] = [
  {
    nome: "Imposto de Renda",
    sigla: "IR",
    categoria: "Federal",
    descricao: "Tributo sobre renda de pessoas físicas e jurídicas.",
    incidencia: "Salários, rendimentos e lucros",
    aliquota: "Faixas progressivas",
    exemplo: "Desconto em folha e ajuste anual na declaração",
  },
  {
    nome: "Imposto sobre Circulação de Mercadorias e Serviços",
    sigla: "ICMS",
    categoria: "Estadual",
    descricao: "Tributo incidente sobre mercadorias e parte dos serviços.",
    incidencia: "Compras, energia, combustíveis e telecomunicações",
    aliquota: "Em geral de 7% a 25%",
    exemplo: "Embutido no preço de produtos e contas de luz",
  },
  {
    nome: "Imposto sobre Serviços",
    sigla: "ISS",
    categoria: "Municipal",
    descricao: "Tributo cobrado sobre prestação de serviços.",
    incidencia: "Consultorias, academias, salões e serviços em geral",
    aliquota: "Em geral de 2% a 5%",
    exemplo: "Nota fiscal de serviços de uma empresa",
  },
  {
    nome: "Imposto sobre Produtos Industrializados",
    sigla: "IPI",
    categoria: "Federal",
    descricao: "Tributo sobre produtos industrializados nacionais e importados.",
    incidencia: "Fabricação e importação de bens",
    aliquota: "Varia conforme tabela fiscal",
    exemplo: "Incidência em eletrodomésticos e veículos",
  },
  {
    nome: "Contribuição ao INSS",
    sigla: "INSS",
    categoria: "Federal",
    descricao: "Contribuição para financiamento da previdência social.",
    incidencia: "Folha de pagamento e contribuição de autônomos",
    aliquota: "Faixas progressivas até o teto",
    exemplo: "Desconto mensal no contracheque",
  },
  {
    nome: "Imposto Predial e Territorial Urbano",
    sigla: "IPTU",
    categoria: "Municipal",
    descricao: "Tributo sobre propriedade de imóveis urbanos.",
    incidencia: "Casas, apartamentos e imóveis comerciais",
    aliquota: "Percentual definido por município",
    exemplo: "Cobrança anual pela prefeitura",
  },
  {
    nome: "Imposto sobre Propriedade de Veículos Automotores",
    sigla: "IPVA",
    categoria: "Estadual",
    descricao: "Tributo sobre propriedade de veículos automotores.",
    incidencia: "Carros, motos e utilitários",
    aliquota: "Em geral entre 2% e 4% do valor do veículo",
    exemplo: "Pagamento anual para licenciamento",
  },
  {
    nome: "Imposto sobre Operações Financeiras",
    sigla: "IOF",
    categoria: "Federal",
    descricao: "Tributo sobre operações de crédito, câmbio e seguros.",
    incidencia: "Empréstimos, cartão internacional e câmbio",
    aliquota: "Varia por tipo e prazo da operação",
    exemplo: "Cobrança em compras internacionais no cartão",
  },
  {
    nome: "Programa de Integração Social / Cofins",
    sigla: "PIS/COFINS",
    categoria: "Federal",
    descricao: "Contribuições sociais que incidem sobre faturamento empresarial.",
    incidencia: "Receita bruta de empresas",
    aliquota: "Regimes cumulativo e não cumulativo",
    exemplo: "Repasse indireto no preço final de produtos",
  },
];

export const taxBySphereMock: Record<TaxCategory, string[]> = {
  Federal: ["IR", "IPI", "IOF", "INSS", "PIS/COFINS"],
  Estadual: ["ICMS", "IPVA"],
  Municipal: ["ISS", "IPTU"],
};

export const taxFaqMock: TaxFAQItem[] = [
  {
    pergunta: "O que é ICMS?",
    resposta:
      "É um imposto estadual cobrado sobre circulação de mercadorias e alguns serviços, normalmente embutido no preço final.",
  },
  {
    pergunta: "Qual a diferença entre imposto federal e estadual?",
    resposta:
      "Impostos federais são arrecadados pela União, enquanto os estaduais são arrecadados pelos estados para financiar serviços locais.",
  },
  {
    pergunta: "Todo mundo paga Imposto de Renda?",
    resposta:
      "Nem todos. A cobrança depende de faixa de renda, regras de isenção e tipo de rendimento.",
  },
  {
    pergunta: "O INSS é imposto?",
    resposta:
      "Tecnicamente é uma contribuição previdenciária, mas para fins didáticos costuma aparecer junto dos principais tributos.",
  },
  {
    pergunta: "Onde entra o ISS?",
    resposta:
      "O ISS é um tributo municipal cobrado sobre serviços, como academias, salões e consultorias.",
  },
];

// Dados mockados de eleições para demonstração e futura integração com APIs.
export const electionOfficesMock: ElectionOffice[] = [
  {
    nome: "Presidente",
    descricao: "Chefia o Poder Executivo federal e coordena políticas nacionais.",
    responsabilidades: [
      "Liderar o Poder Executivo",
      "Sancionar ou vetar leis",
      "Administrar o orçamento federal",
      "Comandar as Forças Armadas",
    ],
    mandato: "4 anos",
  },
  {
    nome: "Deputado Federal",
    descricao: "Representa a população na Câmara dos Deputados.",
    responsabilidades: [
      "Propor e votar leis federais",
      "Fiscalizar ações do Executivo",
      "Debater o orçamento da União",
      "Representar interesses regionais",
    ],
    mandato: "4 anos",
  },
  {
    nome: "Deputado Estadual",
    descricao: "Atua nas Assembleias Legislativas dos estados.",
    responsabilidades: [
      "Criar leis estaduais",
      "Fiscalizar o governador",
      "Aprovar orçamento estadual",
      "Acompanhar políticas públicas locais",
    ],
    mandato: "4 anos",
  },
  {
    nome: "Senador",
    descricao: "Representa os estados no Senado Federal.",
    responsabilidades: [
      "Revisar e votar propostas da Câmara",
      "Avaliar autoridades indicadas",
      "Julgar processos de impeachment",
      "Defender interesses do estado",
    ],
    mandato: "8 anos",
  },
];

export const currentOfficeHoldersMock: CurrentOfficeHolder[] = [
  {
    cargo: "Presidente da República",
    nome: "Ricardo Monteiro",
    partido: "Partido Nacional Democrático (PND)",
  },
  {
    cargo: "Deputada Federal",
    nome: "Carla Menezes",
    partido: "Movimento Cívico Brasileiro (MCB)",
    estado: "SP",
  },
  {
    cargo: "Deputado Estadual",
    nome: "Felipe Albuquerque",
    partido: "União Popular Social (UPS)",
    estado: "MG",
  },
  {
    cargo: "Senadora",
    nome: "Helena Prado",
    partido: "Frente Progressista Nacional (FPN)",
    estado: "BA",
  },
];

export const electionCandidatesMock: ElectionCandidate[] = [
  {
    nome: "João Silva",
    partido: "Aliança Democrática (AD)",
    cargoDisputado: "Presidente",
    descricao: "Ex-governador, economista e defensor de reformas fiscais graduais.",
  },
  {
    nome: "Marina Costa",
    partido: "Pacto Verde Nacional (PVN)",
    cargoDisputado: "Presidente",
    descricao: "Ex-ministra com foco em sustentabilidade e desenvolvimento regional.",
  },
  {
    nome: "Carlos Nogueira",
    partido: "Partido Trabalhista Cidadão (PTC)",
    cargoDisputado: "Senador",
    descricao: "Atual deputado federal com atuação em infraestrutura e empregos.",
  },
  {
    nome: "Priscila Ramos",
    partido: "Movimento Social Liberal (MSL)",
    cargoDisputado: "Deputada Federal",
    descricao: "Advogada e ex-secretária estadual de educação.",
  },
  {
    nome: "Eduardo Lima",
    partido: "Nova Frente Popular (NFP)",
    cargoDisputado: "Deputado Estadual",
    descricao: "Empresário e ativista por transparência no orçamento público.",
  },
];

export const electionPollMock: PollEntry[] = [
  { candidato: "João Silva", percentual: 34 },
  { candidato: "Marina Costa", percentual: 29 },
  { candidato: "Carlos Nogueira", percentual: 15 },
  { candidato: "Outros", percentual: 22 },
];

export const POLITICIAN_CARGO_OPTIONS: PoliticianOffice[] = [
  "Presidente",
  "Senador",
  "Deputado Federal",
  "Deputado Estadual",
  "Governador",
];

// Dados mockados de políticos para busca e perfil público.
export const politiciansMock: PoliticianData[] = [
  {
    id: 1,
    slug: "joao-silva",
    nome: "João Silva",
    cargo: "Deputado Federal",
    partido: "Partido da Inovação Cívica (PIC)",
    estado: "SP",
    foto: "/placeholder-politico.svg",
    resumo: "Deputado com foco em economia e educação.",
    biografia:
      "Economista e ex-prefeito, atua em pautas de eficiência do gasto público e avaliação de políticas educacionais.",
    gastosGabinete: 125000,
    presencaSessoes: 92,
    votacoesRelevantes: [
      { tema: "Reforma Tributária", voto: "A favor" },
      { tema: "PEC da Educação", voto: "Contra" },
      { tema: "Marco de Transparência Fiscal", voto: "A favor" },
    ],
    principaisBandeiras: ["Economia", "Educação", "Transparência"],
  },
  {
    id: 2,
    slug: "marina-costa",
    nome: "Marina Costa",
    cargo: "Senador",
    partido: "Frente Democrática Popular (FDP)",
    estado: "RJ",
    foto: "/placeholder-politico.svg",
    resumo: "Senadora com atuação em saúde pública e políticas para mulheres.",
    biografia:
      "Médica sanitarista, eleita para o Senado com histórico em gestão hospitalar e programas de atenção básica.",
    gastosGabinete: 109400,
    presencaSessoes: 95,
    votacoesRelevantes: [
      { tema: "Pacto Nacional da Saúde", voto: "A favor" },
      { tema: "Revisão da Previdência", voto: "Contra" },
    ],
    principaisBandeiras: ["Saúde", "Equidade", "Direitos Sociais"],
  },
  {
    id: 3,
    slug: "carlos-pereira",
    nome: "Carlos Pereira",
    cargo: "Governador",
    partido: "União Trabalhista Nacional (UTN)",
    estado: "MG",
    foto: "/placeholder-politico.svg",
    resumo: "Governador com agenda de infraestrutura e desenvolvimento regional.",
    biografia:
      "Engenheiro civil e ex-secretário de transportes, concentra atuação em logística e parceria com municípios.",
    gastosGabinete: 187900,
    presencaSessoes: 88,
    votacoesRelevantes: [
      { tema: "Programa de Mobilidade Estadual", voto: "A favor" },
      { tema: "Fundo de Segurança Integrada", voto: "A favor" },
    ],
    principaisBandeiras: ["Infraestrutura", "Emprego", "Segurança"],
  },
  {
    id: 4,
    slug: "ana-ribeiro",
    nome: "Ana Ribeiro",
    cargo: "Deputado Estadual",
    partido: "Movimento Verde Brasileiro (MVB)",
    estado: "RS",
    foto: "/placeholder-politico.svg",
    resumo: "Deputada estadual voltada a clima, agricultura e educação técnica.",
    biografia:
      "Agrônoma e professora universitária, coordena frentes parlamentares de transição energética e inovação no campo.",
    gastosGabinete: 91400,
    presencaSessoes: 90,
    votacoesRelevantes: [
      { tema: "Plano Estadual de Energia Limpa", voto: "A favor" },
      { tema: "Reforma Administrativa Estadual", voto: "Abstenção" },
    ],
    principaisBandeiras: ["Sustentabilidade", "Educação Técnica", "Agro"],
  },
  {
    id: 5,
    slug: "lucas-nogueira",
    nome: "Lucas Nogueira",
    cargo: "Deputado Federal",
    partido: "Aliança Republicana Cidadã (ARC)",
    estado: "BA",
    foto: "/placeholder-politico.svg",
    resumo: "Parlamentar focado em inclusão digital e empreendedorismo local.",
    biografia:
      "Administrador público, criou programas de capacitação tecnológica para pequenas empresas no interior.",
    gastosGabinete: 131200,
    presencaSessoes: 93,
    votacoesRelevantes: [
      { tema: "Marco Nacional de Startups", voto: "A favor" },
      { tema: "PEC da Educação", voto: "A favor" },
    ],
    principaisBandeiras: ["Inovação", "Empreendedorismo", "Educação"],
  },
  {
    id: 6,
    slug: "helena-prado",
    nome: "Helena Prado",
    cargo: "Senador",
    partido: "Partido Social do Futuro (PSF)",
    estado: "PE",
    foto: "/placeholder-politico.svg",
    resumo: "Senadora com foco em combate à desigualdade e reforma urbana.",
    biografia:
      "Ex-prefeita e urbanista, atua em habitação social, mobilidade e proteção de áreas vulneráveis.",
    gastosGabinete: 118600,
    presencaSessoes: 91,
    votacoesRelevantes: [
      { tema: "Marco de Habitação Popular", voto: "A favor" },
      { tema: "Novo Código Tributário", voto: "Contra" },
    ],
    principaisBandeiras: ["Habitação", "Mobilidade", "Direitos Urbanos"],
  },
  {
    id: 7,
    slug: "rafael-mendes",
    nome: "Rafael Mendes",
    cargo: "Governador",
    partido: "Partido Liberal Progressista (PLP)",
    estado: "PR",
    foto: "/placeholder-politico.svg",
    resumo: "Governador com ênfase em equilíbrio fiscal e segurança pública.",
    biografia:
      "Advogado e ex-deputado estadual, lidera agenda de modernização administrativa e controle de gastos.",
    gastosGabinete: 176300,
    presencaSessoes: 87,
    votacoesRelevantes: [
      { tema: "Pacote de Segurança Integrada", voto: "A favor" },
      { tema: "Reforma do ICMS Estadual", voto: "A favor" },
    ],
    principaisBandeiras: ["Segurança", "Responsabilidade Fiscal", "Gestão"],
  },
  {
    id: 8,
    slug: "beatriz-almeida",
    nome: "Beatriz Almeida",
    cargo: "Deputado Estadual",
    partido: "União Cidadã de Centro (UCC)",
    estado: "CE",
    foto: "/placeholder-politico.svg",
    resumo: "Deputada com atuação em primeira infância e educação pública.",
    biografia:
      "Pedagoga e ex-secretária municipal, trabalha por metas de alfabetização e permanência escolar.",
    gastosGabinete: 84500,
    presencaSessoes: 96,
    votacoesRelevantes: [
      { tema: "Programa de Primeira Infância", voto: "A favor" },
      { tema: "Reajuste de Carreiras Docentes", voto: "A favor" },
    ],
    principaisBandeiras: ["Educação", "Infância", "Assistência Social"],
  },
  {
    id: 9,
    slug: "tiago-lima",
    nome: "Tiago Lima",
    cargo: "Deputado Federal",
    partido: "Partido da Justiça Social (PJS)",
    estado: "AM",
    foto: "/placeholder-politico.svg",
    resumo: "Deputado federal com foco em Zona Franca e bioeconomia.",
    biografia:
      "Economista regional, atua em incentivos produtivos sustentáveis e integração logística da Amazônia.",
    gastosGabinete: 128700,
    presencaSessoes: 89,
    votacoesRelevantes: [
      { tema: "Incentivos à Bioeconomia", voto: "A favor" },
      { tema: "Reforma Tributária", voto: "Abstenção" },
    ],
    principaisBandeiras: ["Bioeconomia", "Desenvolvimento Regional", "Emprego"],
  },
  {
    id: 10,
    slug: "patricia-sousa",
    nome: "Patrícia Sousa",
    cargo: "Senador",
    partido: "Partido Democrático Federal (PDF)",
    estado: "PA",
    foto: "/placeholder-politico.svg",
    resumo: "Senadora voltada à pauta ambiental e regularização fundiária.",
    biografia:
      "Jurista com carreira no Ministério Público, participa de comissões de meio ambiente e direitos territoriais.",
    gastosGabinete: 112300,
    presencaSessoes: 94,
    votacoesRelevantes: [
      { tema: "Marco da Regularização Fundiária", voto: "A favor" },
      { tema: "Licenciamento Ambiental Simplificado", voto: "Contra" },
    ],
    principaisBandeiras: ["Meio Ambiente", "Direitos Territoriais", "Justiça"],
  },
  {
    id: 11,
    slug: "eduardo-freitas",
    nome: "Eduardo Freitas",
    cargo: "Governador",
    partido: "Partido Popular do Trabalho (PPT)",
    estado: "SC",
    foto: "/placeholder-politico.svg",
    resumo: "Governador com agenda de inovação industrial e qualificação profissional.",
    biografia:
      "Administrador e ex-empresário, aposta em políticas de produtividade e educação profissionalizante.",
    gastosGabinete: 169800,
    presencaSessoes: 86,
    votacoesRelevantes: [
      { tema: "Plano de Inovação Industrial", voto: "A favor" },
      { tema: "Reforma da Previdência Estadual", voto: "Contra" },
    ],
    principaisBandeiras: ["Indústria", "Inovação", "Qualificação"],
  },
  {
    id: 12,
    slug: "laura-monteiro",
    nome: "Laura Monteiro",
    cargo: "Presidente",
    partido: "Coalizão Nacional Progressista (CNP)",
    estado: "DF",
    foto: "/placeholder-politico.svg",
    resumo: "Presidente com foco em produtividade do Estado e combate à fome.",
    biografia:
      "Ex-governadora e professora de políticas públicas, lidera programas de renda e modernização digital do governo.",
    gastosGabinete: 194500,
    presencaSessoes: 98,
    votacoesRelevantes: [
      { tema: "Programa Nacional de Renda Básica", voto: "A favor" },
      { tema: "Novo Arcabouço Fiscal", voto: "A favor" },
      { tema: "Plano Nacional de Educação", voto: "A favor" },
    ],
    principaisBandeiras: ["Proteção Social", "Gestão Pública", "Educação"],
  },
];

export const POLITICIAN_PARTY_OPTIONS = Array.from(
  new Set(politiciansMock.map((politician) => politician.partido)),
).sort((a, b) => a.localeCompare(b));

export const POLITICIAN_STATE_OPTIONS = Array.from(
  new Set(politiciansMock.map((politician) => politician.estado)),
).sort((a, b) => a.localeCompare(b));

export const supportReasonsMock: SupportReason[] = [
  {
    title: "Manter o site gratuito",
    description:
      "Garantir acesso aberto a informações públicas e ferramentas educativas para todos.",
  },
  {
    title: "Atualizar dados com frequência",
    description:
      "Aprimorar processos de coleta, revisão e publicação de dados públicos relevantes.",
  },
  {
    title: "Criar novas ferramentas públicas",
    description:
      "Desenvolver recursos como comparadores, alertas e visualizações mais completas.",
  },
  {
    title: "Sustentar a independência",
    description:
      "Fortalecer uma iniciativa cívica com foco em transparência, clareza e neutralidade.",
  },
];

export const supportMethodsMock: SupportMethod[] = [
  {
    title: "Pix",
    description: "Contribua de forma direta com qualquer valor.",
    ctaLabel: "Copiar chave",
  },
  {
    title: "Apoio recorrente",
    description: "Placeholder para futura assinatura mensal automática.",
    ctaLabel: "Em breve",
  },
  {
    title: "Parcerias institucionais",
    description: "Placeholder para organizações que apoiam transparência pública.",
    ctaLabel: "Falar com equipe",
  },
];

export const projectUseOfFundsMock: string[] = [
  "Infraestrutura e hospedagem do site",
  "Manutenção técnica e segurança",
  "Coleta, limpeza e organização de dados",
  "Pesquisa e desenvolvimento de novas funcionalidades",
];

export const newsletterBenefitsMock: SupportReason[] = [
  {
    title: "Resumo semanal objetivo",
    description: "Principais dados públicos em linguagem simples e visual.",
  },
  {
    title: "PECs e projetos em foco",
    description: "Atualizações das propostas que impactam orçamento e cidadania.",
  },
  {
    title: "Impostos e eleições",
    description: "Conteúdos explicativos para entender decisões e cenários políticos.",
  },
  {
    title: "Leitura rápida e útil",
    description: "Informações organizadas para facilitar comparação e acompanhamento.",
  },
];

export const newsletterPreviewMock = {
  gastoSemana: "R$ 58,2 bilhões em despesas públicas registradas",
  pecDestaque: "PEC 45/2024 — Reforma Tributária Nacional",
  impostoExplicado: "ICMS: onde incide e como afeta o preço final",
  dadoEleitoral: "Pesquisa simulada: disputa presidencial segue acirrada",
};

export const aboutMissionMock: string[] = [
  "Simplificar informações públicas para qualquer pessoa entender.",
  "Ampliar educação política com linguagem acessível.",
  "Facilitar acesso a dados do Brasil em um único lugar.",
  "Incentivar o acompanhamento cidadão de decisões públicas.",
];

export const aboutHowItWorksMock: string[] = [
  "Uso de dados públicos e fontes oficiais sempre que possível.",
  "Organização visual para leitura rápida e comparações.",
  "Atualização contínua da plataforma em ciclos de evolução.",
  "Foco em clareza, contexto e neutralidade informativa.",
];

export const aboutPrinciplesMock: AboutPrinciple[] = [
  {
    title: "Transparência",
    description: "Exibir informações com contexto e sem esconder limitações dos dados.",
  },
  {
    title: "Clareza",
    description: "Traduzir termos técnicos para linguagem compreensível e didática.",
  },
  {
    title: "Neutralidade",
    description: "Apresentar dados e fatos sem direcionamento partidário.",
  },
  {
    title: "Acessibilidade",
    description: "Construir interfaces inclusivas e simples de navegar.",
  },
];

export const SUPPORT_PIX_KEY_PLACEHOLDER = "pix@acordabrasil.demo";

export function getPoliticianBySlug(slug: string): PoliticianData | undefined {
  return politiciansMock.find((politician) => politician.slug === slug);
}

export const DEFAULT_STATE_CODE: StateCode = "SP";

export const brazilStatesData: Record<StateCode, StatePublicData> = {
  AC: {
    nome: "Acre",
    sigla: "AC",
    gastoAnual: 24500000000,
    gastoMensal: 2042000000,
    gastoPorHabitante: 28700,
    principaisAreas: [
      { nome: "Saúde", percentual: 24 },
      { nome: "Educação", percentual: 20 },
      { nome: "Infraestrutura", percentual: 14 },
      { nome: "Segurança", percentual: 11 },
    ],
  },
  AL: {
    nome: "Alagoas",
    sigla: "AL",
    gastoAnual: 49800000000,
    gastoMensal: 4150000000,
    gastoPorHabitante: 15000,
    principaisAreas: [
      { nome: "Saúde", percentual: 23 },
      { nome: "Educação", percentual: 19 },
      { nome: "Assistência Social", percentual: 15 },
      { nome: "Segurança", percentual: 12 },
    ],
  },
  AP: {
    nome: "Amapá",
    sigla: "AP",
    gastoAnual: 22600000000,
    gastoMensal: 1883000000,
    gastoPorHabitante: 26500,
    principaisAreas: [
      { nome: "Saúde", percentual: 25 },
      { nome: "Educação", percentual: 20 },
      { nome: "Infraestrutura", percentual: 13 },
      { nome: "Segurança", percentual: 10 },
    ],
  },
  AM: {
    nome: "Amazonas",
    sigla: "AM",
    gastoAnual: 83400000000,
    gastoMensal: 6950000000,
    gastoPorHabitante: 19600,
    principaisAreas: [
      { nome: "Saúde", percentual: 22 },
      { nome: "Educação", percentual: 18 },
      { nome: "Infraestrutura", percentual: 16 },
      { nome: "Segurança", percentual: 11 },
    ],
  },
  BA: {
    nome: "Bahia",
    sigla: "BA",
    gastoAnual: 211000000000,
    gastoMensal: 17600000000,
    gastoPorHabitante: 14066,
    principaisAreas: [
      { nome: "Saúde", percentual: 21 },
      { nome: "Educação", percentual: 19 },
      { nome: "Segurança", percentual: 14 },
      { nome: "Assistência Social", percentual: 12 },
    ],
  },
  CE: {
    nome: "Ceará",
    sigla: "CE",
    gastoAnual: 135000000000,
    gastoMensal: 11250000000,
    gastoPorHabitante: 14600,
    principaisAreas: [
      { nome: "Educação", percentual: 22 },
      { nome: "Saúde", percentual: 20 },
      { nome: "Segurança", percentual: 13 },
      { nome: "Infraestrutura", percentual: 12 },
    ],
  },
  DF: {
    nome: "Distrito Federal",
    sigla: "DF",
    gastoAnual: 178000000000,
    gastoMensal: 14800000000,
    gastoPorHabitante: 58400,
    principaisAreas: [
      { nome: "Saúde", percentual: 23 },
      { nome: "Segurança", percentual: 19 },
      { nome: "Educação", percentual: 18 },
      { nome: "Mobilidade", percentual: 10 },
    ],
  },
  ES: {
    nome: "Espírito Santo",
    sigla: "ES",
    gastoAnual: 92000000000,
    gastoMensal: 7670000000,
    gastoPorHabitante: 22800,
    principaisAreas: [
      { nome: "Saúde", percentual: 22 },
      { nome: "Educação", percentual: 18 },
      { nome: "Segurança", percentual: 14 },
      { nome: "Infraestrutura", percentual: 13 },
    ],
  },
  GO: {
    nome: "Goiás",
    sigla: "GO",
    gastoAnual: 128000000000,
    gastoMensal: 10670000000,
    gastoPorHabitante: 17800,
    principaisAreas: [
      { nome: "Saúde", percentual: 22 },
      { nome: "Educação", percentual: 19 },
      { nome: "Segurança", percentual: 13 },
      { nome: "Infraestrutura", percentual: 12 },
    ],
  },
  MA: {
    nome: "Maranhão",
    sigla: "MA",
    gastoAnual: 101000000000,
    gastoMensal: 8420000000,
    gastoPorHabitante: 14300,
    principaisAreas: [
      { nome: "Saúde", percentual: 24 },
      { nome: "Educação", percentual: 20 },
      { nome: "Infraestrutura", percentual: 12 },
      { nome: "Assistência Social", percentual: 11 },
    ],
  },
  MT: {
    nome: "Mato Grosso",
    sigla: "MT",
    gastoAnual: 88000000000,
    gastoMensal: 7330000000,
    gastoPorHabitante: 24700,
    principaisAreas: [
      { nome: "Saúde", percentual: 21 },
      { nome: "Educação", percentual: 18 },
      { nome: "Infraestrutura", percentual: 16 },
      { nome: "Segurança", percentual: 12 },
    ],
  },
  MS: {
    nome: "Mato Grosso do Sul",
    sigla: "MS",
    gastoAnual: 64500000000,
    gastoMensal: 5380000000,
    gastoPorHabitante: 22800,
    principaisAreas: [
      { nome: "Saúde", percentual: 22 },
      { nome: "Educação", percentual: 19 },
      { nome: "Segurança", percentual: 13 },
      { nome: "Infraestrutura", percentual: 12 },
    ],
  },
  MG: {
    nome: "Minas Gerais",
    sigla: "MG",
    gastoAnual: 288000000000,
    gastoMensal: 24000000000,
    gastoPorHabitante: 13611,
    principaisAreas: [
      { nome: "Educação", percentual: 21 },
      { nome: "Saúde", percentual: 20 },
      { nome: "Infraestrutura", percentual: 14 },
      { nome: "Segurança", percentual: 12 },
    ],
  },
  PA: {
    nome: "Pará",
    sigla: "PA",
    gastoAnual: 142000000000,
    gastoMensal: 11830000000,
    gastoPorHabitante: 16300,
    principaisAreas: [
      { nome: "Saúde", percentual: 23 },
      { nome: "Educação", percentual: 19 },
      { nome: "Infraestrutura", percentual: 15 },
      { nome: "Segurança", percentual: 11 },
    ],
  },
  PB: {
    nome: "Paraíba",
    sigla: "PB",
    gastoAnual: 62000000000,
    gastoMensal: 5170000000,
    gastoPorHabitante: 15300,
    principaisAreas: [
      { nome: "Saúde", percentual: 23 },
      { nome: "Educação", percentual: 20 },
      { nome: "Assistência Social", percentual: 13 },
      { nome: "Segurança", percentual: 11 },
    ],
  },
  PR: {
    nome: "Paraná",
    sigla: "PR",
    gastoAnual: 198000000000,
    gastoMensal: 16500000000,
    gastoPorHabitante: 16779,
    principaisAreas: [
      { nome: "Educação", percentual: 20 },
      { nome: "Saúde", percentual: 19 },
      { nome: "Infraestrutura", percentual: 16 },
      { nome: "Segurança", percentual: 12 },
    ],
  },
  PE: {
    nome: "Pernambuco",
    sigla: "PE",
    gastoAnual: 146000000000,
    gastoMensal: 12170000000,
    gastoPorHabitante: 15100,
    principaisAreas: [
      { nome: "Saúde", percentual: 22 },
      { nome: "Educação", percentual: 20 },
      { nome: "Segurança", percentual: 14 },
      { nome: "Mobilidade", percentual: 10 },
    ],
  },
  PI: {
    nome: "Piauí",
    sigla: "PI",
    gastoAnual: 47000000000,
    gastoMensal: 3920000000,
    gastoPorHabitante: 14300,
    principaisAreas: [
      { nome: "Saúde", percentual: 24 },
      { nome: "Educação", percentual: 21 },
      { nome: "Assistência Social", percentual: 12 },
      { nome: "Infraestrutura", percentual: 11 },
    ],
  },
  RJ: {
    nome: "Rio de Janeiro",
    sigla: "RJ",
    gastoAnual: 352000000000,
    gastoMensal: 29300000000,
    gastoPorHabitante: 20598,
    principaisAreas: [
      { nome: "Segurança", percentual: 21 },
      { nome: "Saúde", percentual: 19 },
      { nome: "Educação", percentual: 17 },
      { nome: "Transporte", percentual: 12 },
    ],
  },
  RN: {
    nome: "Rio Grande do Norte",
    sigla: "RN",
    gastoAnual: 54000000000,
    gastoMensal: 4500000000,
    gastoPorHabitante: 15300,
    principaisAreas: [
      { nome: "Saúde", percentual: 23 },
      { nome: "Educação", percentual: 20 },
      { nome: "Segurança", percentual: 13 },
      { nome: "Infraestrutura", percentual: 11 },
    ],
  },
  RS: {
    nome: "Rio Grande do Sul",
    sigla: "RS",
    gastoAnual: 236000000000,
    gastoMensal: 19670000000,
    gastoPorHabitante: 20700,
    principaisAreas: [
      { nome: "Saúde", percentual: 21 },
      { nome: "Educação", percentual: 18 },
      { nome: "Segurança", percentual: 14 },
      { nome: "Infraestrutura", percentual: 12 },
    ],
  },
  RO: {
    nome: "Rondônia",
    sigla: "RO",
    gastoAnual: 36500000000,
    gastoMensal: 3040000000,
    gastoPorHabitante: 20400,
    principaisAreas: [
      { nome: "Saúde", percentual: 23 },
      { nome: "Educação", percentual: 19 },
      { nome: "Segurança", percentual: 13 },
      { nome: "Infraestrutura", percentual: 12 },
    ],
  },
  RR: {
    nome: "Roraima",
    sigla: "RR",
    gastoAnual: 21000000000,
    gastoMensal: 1750000000,
    gastoPorHabitante: 33300,
    principaisAreas: [
      { nome: "Saúde", percentual: 24 },
      { nome: "Educação", percentual: 20 },
      { nome: "Assistência Social", percentual: 14 },
      { nome: "Segurança", percentual: 10 },
    ],
  },
  SC: {
    nome: "Santa Catarina",
    sigla: "SC",
    gastoAnual: 153000000000,
    gastoMensal: 12750000000,
    gastoPorHabitante: 19600,
    principaisAreas: [
      { nome: "Saúde", percentual: 20 },
      { nome: "Educação", percentual: 18 },
      { nome: "Infraestrutura", percentual: 17 },
      { nome: "Segurança", percentual: 12 },
    ],
  },
  SP: {
    nome: "São Paulo",
    sigla: "SP",
    gastoAnual: 812000000000,
    gastoMensal: 67600000000,
    gastoPorHabitante: 17654,
    principaisAreas: [
      { nome: "Saúde", percentual: 22 },
      { nome: "Educação", percentual: 18 },
      { nome: "Infraestrutura", percentual: 15 },
      { nome: "Segurança", percentual: 12 },
    ],
  },
  SE: {
    nome: "Sergipe",
    sigla: "SE",
    gastoAnual: 34200000000,
    gastoMensal: 2850000000,
    gastoPorHabitante: 14600,
    principaisAreas: [
      { nome: "Saúde", percentual: 23 },
      { nome: "Educação", percentual: 19 },
      { nome: "Assistência Social", percentual: 12 },
      { nome: "Segurança", percentual: 11 },
    ],
  },
  TO: {
    nome: "Tocantins",
    sigla: "TO",
    gastoAnual: 31800000000,
    gastoMensal: 2650000000,
    gastoPorHabitante: 20100,
    principaisAreas: [
      { nome: "Saúde", percentual: 22 },
      { nome: "Educação", percentual: 19 },
      { nome: "Infraestrutura", percentual: 15 },
      { nome: "Segurança", percentual: 11 },
    ],
  },
};

export const stateNameToCode: Record<string, StateCode> = {
  Acre: "AC",
  Alagoas: "AL",
  Amapá: "AP",
  Amazonas: "AM",
  Bahia: "BA",
  Ceará: "CE",
  "Distrito Federal": "DF",
  "Federal District": "DF",
  "Espírito Santo": "ES",
  Goiás: "GO",
  Maranhão: "MA",
  "Mato Grosso": "MT",
  "Mato Grosso do Sul": "MS",
  "Minas Gerais": "MG",
  Pará: "PA",
  Paraíba: "PB",
  Paraná: "PR",
  Pernambuco: "PE",
  Piauí: "PI",
  "Rio de Janeiro": "RJ",
  "Rio Grande do Norte": "RN",
  "Rio Grande do Sul": "RS",
  Rondônia: "RO",
  Roraima: "RR",
  "Santa Catarina": "SC",
  "São Paulo": "SP",
  "Sao Paulo": "SP",
  Sergipe: "SE",
  Tocantins: "TO",
};

function normalizeStateName(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

const normalizedStateNameToCode = new Map<string, StateCode>(
  Object.entries(stateNameToCode).map(([name, code]) => [
    normalizeStateName(name),
    code,
  ]),
);

// Resolve nomes vindos do GeoJSON para siglas tipadas.
export function getStateCodeFromMapName(name: string): StateCode | undefined {
  return normalizedStateNameToCode.get(normalizeStateName(name));
}

export function getStateDataByCode(code: StateCode): StatePublicData {
  return brazilStatesData[code];
}

export function getAnnualSpendingBounds(): { min: number; max: number } {
  const values = Object.values(brazilStatesData).map((state) => state.gastoAnual);

  return {
    min: Math.min(...values),
    max: Math.max(...values),
  };
}
