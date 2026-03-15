import type { Metadata } from "next";
import { SectionTitle } from "@/components/SectionTitle";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Escândalos em foco | AcordaBrasil",
  description:
    "Entenda, em linguagem simples, os principais pontos dos casos Banco Master e INSS.",
  path: "/escandalos",
});

export default function EscandalosPage() {
  return (
    <main className="container-page space-y-8 py-10">
      <SectionTitle
        title="Escândalos em foco"
        subtitle="Resumo objetivo dos casos mais comentados, com foco no que é fato público, o que está em apuração e por que isso importa."
      />

      <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#0f3d2e]">Caso Banco Master</h2>
        <p className="text-sm text-slate-700">
          O caso do Banco Master envolve questionamentos públicos sobre práticas de gestão,
          operações financeiras e possíveis irregularidades sob análise de autoridades
          competentes. As informações disponíveis podem mudar conforme novas apurações e
          decisões oficiais avançam.
        </p>

        <div className="space-y-2 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Pontos principais</p>
          <ul className="space-y-1">
            <li>• Há investigações e verificações sobre condutas e conformidade regulatória.</li>
            <li>• Órgãos de controle e justiça podem adotar medidas cautelares durante o processo.</li>
            <li>• O acompanhamento deve considerar fontes oficiais e decisões formalizadas.</li>
          </ul>
        </div>

        <p className="text-sm text-slate-600">
          Por que importa: casos no sistema financeiro podem afetar confiança institucional,
          mercado de crédito e percepção de risco.
        </p>
      </section>

      <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#0f3d2e]">Caso INSS</h2>
        <p className="text-sm text-slate-700">
          O caso do INSS reúne denúncias e apurações ligadas a fraudes, pagamentos indevidos
          e possíveis falhas de fiscalização em benefícios. A dimensão e os impactos do caso
          dependem das conclusões oficiais de auditorias e investigações em andamento.
        </p>

        <div className="space-y-2 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Pontos principais</p>
          <ul className="space-y-1">
            <li>• Há foco em identificar responsáveis e recuperar valores eventualmente desviados.</li>
            <li>• O caso pressiona melhorias de controle, cruzamento de dados e prevenção a fraudes.</li>
            <li>• Medidas administrativas e judiciais podem evoluir conforme os resultados da apuração.</li>
          </ul>
        </div>

        <p className="text-sm text-slate-600">
          Por que importa: irregularidades em benefícios previdenciários afetam contas públicas,
          confiança no sistema e proteção de quem depende da previdência.
        </p>
      </section>

      <section className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-slate-700">
        Este conteúdo resume informações públicas e pode ser atualizado conforme novos fatos
        oficiais sejam divulgados.
      </section>
    </main>
  );
}