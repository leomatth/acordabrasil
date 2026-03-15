import type { Metadata } from "next";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://acordabrasil.org";

const DEFAULT_OG_IMAGE = "/og/og-image.jpg";

export const globalMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "AcordaBrasil | Transparência, Gastos Públicos e Política Explicada",
  description:
    "Plataforma que simplifica dados públicos do Brasil: gastos públicos, impostos, PECs, eleições e políticos.",
  keywords: [
    "gastos públicos",
    "impostos Brasil",
    "PECs",
    "eleições",
    "política brasileira",
    "transparência pública",
  ],
  openGraph: {
    title: "AcordaBrasil — Entenda os gastos públicos do Brasil",
    description:
      "Acompanhe gastos públicos, impostos, PECs e dados políticos de forma simples.",
    type: "website",
    siteName: "AcordaBrasil",
    url: SITE_URL,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "AcordaBrasil - Dados públicos do Brasil",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AcordaBrasil",
    description: "Dados públicos do Brasil de forma simples e visual.",
    images: [DEFAULT_OG_IMAGE],
  },
};

type PageSeoParams = {
  title: string;
  description: string;
  path: string;
};

export function createPageMetadata({ title, description, path }: PageSeoParams): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url: path,
      siteName: "AcordaBrasil",
      type: "website",
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}
