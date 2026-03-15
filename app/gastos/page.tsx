import type { Metadata } from "next";
import { SectionTitle } from "@/components/SectionTitle";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Gastos públicos e transparência | AcordaBrasil",
  description:
    "Acompanhe indicadores de gastos públicos do Brasil e análise de transparência fiscal.",
  path: "/gastos",
});

export default function GastosPage() {
  return (
    <main className="container-page space-y-6 py-10">
      <SectionTitle
        title="Gastos Públicos"
        subtitle="Painel inicial para evolução futura de ranking por estado e séries temporais."
      />

      <section className="rounded-xl border border-slate-200 bg-white p-6 text-slate-700 shadow-sm">
        Dados detalhados de gastos públicos serão exibidos aqui no próximo ciclo.
      </section>
    </main>
  );
}
