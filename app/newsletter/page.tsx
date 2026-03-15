import type { Metadata } from "next";
import { AdPlaceholder } from "@/components/AdPlaceholder";
import { InfoSection } from "@/components/InfoSection";
import { NewsletterForm } from "@/components/NewsletterForm";
import { SectionTitle } from "@/components/SectionTitle";
import { SupportCard } from "@/components/SupportCard";
import { newsletterBenefitsMock, newsletterPreviewMock } from "@/lib/mockData";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Newsletter cívica semanal | AcordaBrasil",
  description:
    "Receba atualizações semanais sobre gastos públicos, impostos, PECs e eleições em linguagem simples.",
  path: "/newsletter",
});

export default function NewsletterPage() {
  return (
    <main className="container-page space-y-10 py-10">
      <SectionTitle
        title="Receba atualizações do AcordaBrasil"
        subtitle="Resumo de gastos públicos, PECs, impostos e eleições em linguagem simples."
      />

      <InfoSection title="Por que assinar" subtitle="Conteúdo objetivo para acompanhar o cenário público sem complexidade.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {newsletterBenefitsMock.map((benefit) => (
            <SupportCard key={benefit.title} title={benefit.title} description={benefit.description} />
          ))}
        </div>
      </InfoSection>

      {/* Área reservada para monetização futura (entre benefícios e formulário) */}
      <AdPlaceholder label="Espaço de anúncio futuro para parceiros editoriais" className="hidden md:block" />

      <InfoSection title="Inscreva-se" subtitle="Formulário demonstrativo, pronto para integração com plataforma de e-mail.">
        <div className="grid items-start gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <NewsletterForm />

          {/* Área reservada para monetização futura (lateral desktop) */}
          <AdPlaceholder label="Espaço lateral para monetização futura" className="hidden lg:flex lg:h-full lg:items-center lg:justify-center" />
        </div>
      </InfoSection>

      <InfoSection title="Exemplo do que você vai receber">
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="space-y-3 text-sm text-slate-700">
            <p>
              <span className="font-semibold text-[#0f3d2e]">Gasto público da semana:</span>{" "}
              {newsletterPreviewMock.gastoSemana}
            </p>
            <p>
              <span className="font-semibold text-[#0f3d2e]">PEC em destaque:</span>{" "}
              {newsletterPreviewMock.pecDestaque}
            </p>
            <p>
              <span className="font-semibold text-[#0f3d2e]">Imposto explicado:</span>{" "}
              {newsletterPreviewMock.impostoExplicado}
            </p>
            <p>
              <span className="font-semibold text-[#0f3d2e]">Dado eleitoral:</span>{" "}
              {newsletterPreviewMock.dadoEleitoral}
            </p>
          </div>
        </article>
      </InfoSection>
    </main>
  );
}
