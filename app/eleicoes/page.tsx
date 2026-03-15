import type { Metadata } from "next";
import { CandidateCard, CurrentHolderCard } from "@/components/CandidateCard";
import { OfficeCard } from "@/components/OfficeCard";
import { PollChart } from "@/components/PollChart";
import { SectionTitle } from "@/components/SectionTitle";
import {
  currentOfficeHoldersMock,
  electionCandidatesMock,
  electionOfficesMock,
  electionPollMock,
} from "@/lib/mockData";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Eleições no Brasil explicadas | AcordaBrasil",
  description: "Entenda cargos políticos, candidatos e pesquisas eleitorais.",
  path: "/eleicoes",
});

export default function EleicoesPage() {
  return (
    <main className="container-page space-y-10 py-10">
      <SectionTitle
        title="Eleições brasileiras"
        subtitle="Entenda os cargos em disputa, quem ocupa posições estratégicas hoje e como os cenários eleitorais podem evoluir."
      />

      <section className="space-y-4">
        <SectionTitle
          title="Entenda os cargos da eleição"
          subtitle="Resumo simples das funções e responsabilidades mais relevantes para o eleitor."
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {electionOfficesMock.map((office) => (
            <OfficeCard key={office.nome} office={office} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <SectionTitle
          title="Cargos atualmente ocupados"
          subtitle="Referência de quem está em posições centrais no cenário político atual."
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {currentOfficeHoldersMock.map((holder) => (
            <CurrentHolderCard key={`${holder.cargo}-${holder.nome}`} holder={holder} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <SectionTitle
          title="Possíveis candidatos"
          subtitle="Nomes e perfis de pré-candidaturas para os principais cargos."
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {electionCandidatesMock.map((candidate) => (
            <CandidateCard key={`${candidate.nome}-${candidate.cargoDisputado}`} candidate={candidate} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <SectionTitle
          title="Pesquisas de intenção de voto"
          subtitle="Visualização simples para leitura rápida de tendência eleitoral."
        />

        <PollChart data={electionPollMock} />

        <p className="text-sm text-slate-500">
          Dados simulados apenas para demonstração. Estrutura preparada para integração
          futura com Datafolha, Ipec, Quaest e Atlas.
        </p>
      </section>
    </main>
  );
}
