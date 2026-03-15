import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Apoie o projeto | AcordaBrasil",
  description:
    "Contribua para manter o AcordaBrasil gratuito, independente e focado em transparência pública.",
  path: "/apoiar",
});

export default function ApoiarLayout({ children }: { children: React.ReactNode }) {
  return children;
}
