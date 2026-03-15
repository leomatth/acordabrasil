import type { Metadata } from "next";
import { CTASection } from "@/components/CTASection";
import { DataOriginBadge } from "@/components/DataOriginBadge";
import { FAQAccordion } from "@/components/FAQAccordion";
import { SectionTitle } from "@/components/SectionTitle";
import { EmptyState } from "@/components/states/EmptyState";
import { TaxCard } from "@/components/TaxCard";
import { TaxSummaryCard } from "@/components/TaxSummaryCard";
import {
  taxBySphereMock,
  taxFaqMock,
} from "@/lib/mockData";
import { getTaxGuide, getTaxSummary } from "@/lib/services/taxesService";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Impostos no Brasil explicados | AcordaBrasil",
  description: "Entenda ICMS, IR, INSS, ISS e outros impostos de forma simples.",
  path: "/impostos",
});

export default async function ImpostosPage() {
  const [taxSummaryResult, taxGuideResult] = await Promise.all([
    getTaxSummary(),
    getTaxGuide(),
  ]);

  return (
    <main className="container-page space-y-10 py-10">
      <section className="space-y-3">
        <SectionTitle
          title="Entenda os principais impostos do Brasil"
          subtitle="Descubra de forma simples o que são os impostos, onde eles incidem e como impactam sua vida."
        />
        <p className="max-w-3xl text-sm text-slate-600">
          Esta página tem caráter educativo e apresenta uma visão simplificada dos tributos
          mais comuns no Brasil. Os valores e faixas são aproximados e servem como base
          de entendimento inicial.
        </p>

        <DataOriginBadge
          source={taxSummaryResult.source}
          mode={taxSummaryResult.mode}
          lastUpdated={taxSummaryResult.lastUpdated}
          errorMessage={taxSummaryResult.errorMessage}
          className="max-w-md"
        />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {taxSummaryResult.data.length ? (
          taxSummaryResult.data.map((item) => (
            <TaxSummaryCard key={item.titulo} item={item} />
          ))
        ) : (
          <div className="sm:col-span-2 xl:col-span-4">
            <EmptyState
              title="Sem dados de resumo tributário"
              description="No momento não há indicadores para exibir."
            />
          </div>
        )}
      </section>

      <section className="space-y-4">
        <SectionTitle
          title="Principais impostos"
          subtitle="Resumo dos tributos mais relevantes para o dia a dia de pessoas e empresas."
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {taxGuideResult.data.length ? (
            taxGuideResult.data.map((tax) => (
              <TaxCard key={tax.sigla} tax={tax} />
            ))
          ) : (
            <div className="md:col-span-2 xl:col-span-3">
              <EmptyState
                title="Sem tributos para listar"
                description="Tente novamente mais tarde para visualizar os dados de impostos."
              />
            </div>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <SectionTitle
          title="Impostos por esfera"
          subtitle="Entenda quais tributos são cobrados pela União, estados e municípios."
        />

        <div className="grid gap-4 md:grid-cols-3">
          {Object.entries(taxBySphereMock).map(([sphere, taxes]) => (
            <article
              key={sphere}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <h3 className="text-lg font-bold text-[#0f3d2e]">{sphere}</h3>
              <ul className="mt-3 space-y-1 text-sm text-slate-700">
                {taxes.map((taxName) => (
                  <li key={`${sphere}-${taxName}`}>• {taxName}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <SectionTitle
          title="Perguntas frequentes"
          subtitle="Respostas rápidas para dúvidas comuns sobre tributação."
        />

        <FAQAccordion items={taxFaqMock} />
      </section>

      <section>
        <CTASection
          title="Quer descobrir quanto imposto você paga?"
          description="Use o simulador para estimar seu imposto mensal e anual com base em médias tributárias brasileiras."
          buttonLabel="Ir para o simulador"
          href="/impostos/simulador"
        />
      </section>
    </main>
  );
}
