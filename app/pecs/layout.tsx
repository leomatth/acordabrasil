import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "PECs e projetos de lei explicados | AcordaBrasil",
  description: "Acompanhe PECs, projetos de lei e votações do congresso.",
  path: "/pecs",
});

export default function PecsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
