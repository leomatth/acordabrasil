import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Políticos brasileiros | cargos, votações e atuação",
  description:
    "Pesquise políticos e veja informações sobre cargos, votações e atuação pública.",
  path: "/politicos",
});

export default function PoliticosLayout({ children }: { children: React.ReactNode }) {
  return children;
}
