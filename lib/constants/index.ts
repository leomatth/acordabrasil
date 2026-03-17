export const APP_NAME = "AcordaBrasil";

export const COLORS = {
  green: "#0f3d2e",
  yellow: "#ffcc00",
  white: "#ffffff",
  lightGray: "#e2e8f0",
} as const;

export const NAV_LINKS = [
  { label: "Início", href: "/" },
  { label: "Gastos Públicos", href: "/gastos" },
  { label: "PECs", href: "/pecs" },
  { label: "Impostos", href: "/impostos" },
  { label: "Eleições", href: "/eleicoes" },
  { label: "Políticos", href: "/politicos" },
  { label: "Escândalos", href: "/escandalos" },
  { label: "Sobre", href: "/sobre" },
] as const;

export const HERO_CONTENT = {
  title: "Gasto Público em foco",
  subtitle:
    "Acompanhe dados públicos do Brasil de forma simples, visual e acessível.",
  counterLabel: "Gasto Público Total",
  viralTitle: "Enquanto você está aqui, o governo já gastou:",
  viralCaption: "Simulação visual em reais, derivada de referência pública oficial.",
} as const;

export const LIVE_SPEND_CONFIG = {
  initialValue: 0,
  intervalMs: 1000,
} as const;
