import type { Metadata } from "next";
import { DataOriginBadge } from "@/components/DataOriginBadge";
import { TrackOnView } from "@/components/TrackOnView";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PecVoteChart } from "@/components/PecVoteChart";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import { SectionTitle } from "@/components/SectionTitle";
import { formatCurrency } from "@/lib/formatCurrency";
import { createPageMetadata } from "@/lib/seo";
import {
  getLegislationById,
  getLegislationItems,
} from "@/lib/services/legislationService";

type PecDetailPageProps = {
  params: {
    id: string;
  };
};

export async function generateStaticParams() {
  const legislationResult = await getLegislationItems();

  return legislationResult.data.map((pec) => ({ id: pec.id }));
}

export async function generateMetadata({ params }: PecDetailPageProps): Promise<Metadata> {
  const legislationResult = await getLegislationById(params.id);
  const pec = legislationResult.data;

  if (!pec) {
    return createPageMetadata({
      title: "PEC não encontrada | AcordaBrasil",
      description: "A proposta solicitada não foi encontrada no AcordaBrasil.",
      path: "/pecs",
    });
  }

  return createPageMetadata({
    title: `${pec.numero} | ${pec.titulo} | AcordaBrasil`,
    description: pec.resumo,
    path: `/pecs/${pec.id}`,
  });
}

export default async function PecDetailPage({ params }: PecDetailPageProps) {
  const legislationResult = await getLegislationById(params.id);
  const pec = legislationResult.data;

  if (!pec) {
    notFound();
  }

  const involved = [
    `Autor: ${pec.politicos.autor}`,
    `Relator: ${pec.politicos.relator}`,
    ...pec.politicos.apoiadores.map((name) => `Apoiador: ${name}`),
  ];

  return (
    <main className="container-page space-y-6 py-10">
      <TrackOnView
        eventName={ANALYTICS_EVENTS.PEC_DETAIL_VIEW}
        payload={{ section: "pec_detail", source: "pec_page", label: pec.id }}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <SectionTitle
          title={`${pec.numero} · ${pec.titulo}`}
          subtitle={pec.resumo}
        />
        <Link
          href="/pecs"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          Voltar para lista
        </Link>
      </div>

      <DataOriginBadge
        source={legislationResult.source}
        mode={legislationResult.mode}
        lastUpdated={legislationResult.lastUpdated}
        errorMessage={legislationResult.errorMessage}
        className="max-w-md"
      />

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-[#0f3d2e]">Status atual</h3>
        <p className="mt-2 text-slate-700">{pec.statusAtual}</p>

        <div className="mt-4 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
          <p>
            <span className="font-medium text-slate-500">Assunto:</span> {pec.assunto}
          </p>
          <p>
            <span className="font-medium text-slate-500">Última atualização:</span>{" "}
            {new Date(pec.ultimaAtualizacao).toLocaleDateString("pt-BR")}
          </p>
          <p className="sm:col-span-2">
            <span className="font-medium text-slate-500">Impacto estimado:</span>{" "}
            {pec.impactoFinanceiro
              ? formatCurrency(pec.impactoFinanceiro)
              : "Não estimado"}
          </p>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-[#0f3d2e]">Linha do tempo</h3>
        <ol className="mt-4 space-y-3">
          {pec.timeline.map((item) => (
            <li
              key={`${item.evento}-${item.data}`}
              className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
            >
              <p className="text-sm font-semibold text-slate-800">{item.evento}</p>
              <p className="text-xs text-slate-500">
                {new Date(item.data).toLocaleDateString("pt-BR")}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-[#0f3d2e]">Políticos envolvidos</h3>
        <ul className="mt-4 space-y-2 text-sm text-slate-700">
          {involved.map((name) => (
            <li key={name} className="rounded-md bg-slate-50 px-3 py-2">
              {name}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-[#0f3d2e]">Placar consolidado de votações</h3>
        <PecVoteChart votes={pec.votos} />
        {pec.votacoes?.length ? (
          <ul className="space-y-2 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
            {pec.votacoes.slice(0, 5).map((votacao) => (
              <li key={votacao.id} className="rounded-md border border-slate-200 bg-slate-50 p-3">
                <p className="font-medium text-slate-800">{votacao.descricao}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {new Date(votacao.data).toLocaleString("pt-BR")} · Favor {votacao.votos.favor} · Contra {votacao.votos.contra} · Abstenções {votacao.votos.abstencao}
                </p>

                {votacao.resumoPartidos?.length ? (
                  <div className="mt-2 rounded-md border border-slate-200 bg-white p-2">
                    <p className="text-xs font-semibold text-slate-600">Resumo por partido (top 5)</p>
                    <ul className="mt-1 space-y-1 text-xs text-slate-600">
                      {votacao.resumoPartidos.slice(0, 5).map((partido) => (
                        <li key={`${votacao.id}-${partido.partido}`}>
                          {partido.partido}: {partido.favor} favor · {partido.contra} contra · {partido.abstencao} abstenções
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {votacao.votosNominais?.length ? (
                  <div className="mt-2 rounded-md border border-slate-200 bg-white p-2">
                    <p className="text-xs font-semibold text-slate-600">Votos nominais (amostra)</p>
                    <ul className="mt-1 space-y-1 text-xs text-slate-600">
                      {votacao.votosNominais.slice(0, 5).map((item, index) => (
                        <li key={`${votacao.id}-${item.deputado}-${index}`}>
                          {item.deputado} ({item.partido}{item.estado ? `-${item.estado}` : ""}): {item.voto}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500">
            Ainda não há sessões de votação consolidadas para esta proposição na API da Câmara.
          </p>
        )}
      </section>
    </main>
  );
}
