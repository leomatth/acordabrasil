import type { Metadata } from "next";
import { AdPlaceholder } from "@/components/AdPlaceholder";
import { InfoSection } from "@/components/InfoSection";
import { SectionTitle } from "@/components/SectionTitle";
import { SupportCard } from "@/components/SupportCard";
import {
  aboutHowItWorksMock,
  aboutMissionMock,
  aboutPrinciplesMock,
} from "@/lib/mockData";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Sobre o projeto AcordaBrasil",
  description:
    "Conheça a missão, princípios e funcionamento do AcordaBrasil para transparência e educação política.",
  path: "/sobre",
});

export default function SobrePage() {
  return (
    <main className="container-page space-y-10 py-10">
      <SectionTitle
        title="Sobre o AcordaBrasil"
        subtitle="Uma plataforma criada para tornar dados públicos mais simples, visuais e acessíveis."
      />

      <InfoSection title="Missão">
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <ul className="space-y-2 text-sm text-slate-700">
            {aboutMissionMock.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </article>
      </InfoSection>

      <InfoSection title="Como funciona">
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <ul className="space-y-2 text-sm text-slate-700">
            {aboutHowItWorksMock.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </article>
      </InfoSection>

      {/* Área reservada para monetização futura (entre blocos institucionais) */}
      <AdPlaceholder label="Espaço reservado para apoiadores institucionais" className="hidden md:block" />

      <InfoSection title="Princípios do projeto">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {aboutPrinciplesMock.map((principle) => (
            <SupportCard
              key={principle.title}
              title={principle.title}
              description={principle.description}
            />
          ))}
        </div>
      </InfoSection>

      <section className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-slate-700">
        Parte dos dados e funcionalidades ainda está em modo demonstrativo com dados
        simulados. O projeto segue em evolução contínua para integração com fontes públicas
        oficiais.
      </section>
    </main>
  );
}
