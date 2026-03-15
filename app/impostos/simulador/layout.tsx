import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Simulador de impostos | Descubra quanto você paga",
  description:
    "Calcule uma estimativa de quanto imposto você paga com base na renda.",
  path: "/impostos/simulador",
});

export default function SimuladorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
