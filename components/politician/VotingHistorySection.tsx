import { DataSourceBlock } from "@/components/data-source/DataSourceBlock";
import { VotingSummaryCards } from "@/components/politician/VotingSummaryCards";
import { EmptyState } from "@/components/states/EmptyState";
import type { SectionCoverageStatus, VotingRecord } from "@/types/politician";

type VotingHistorySectionProps = {
  records: VotingRecord[];
  sourceInfo: {
    sourceName: string;
    sourceType: "api" | "document" | "official_portal";
    sourceUrl?: string;
    referencePeriod?: string;
    lastUpdated?: string;
  };
  integrationMessage?: string;
  coverageStatus?: SectionCoverageStatus;
  coverageReason?: string;
};

export function VotingHistorySection({
  records,
  sourceInfo,
  integrationMessage,
  coverageStatus,
  coverageReason,
}: VotingHistorySectionProps) {
  const normalizedVotes = records.map((record) => String(record.voto ?? "").toLowerCase());
  const favor = normalizedVotes.filter((item) => item.includes("sim") || item.includes("favor")).length;
  const contra = normalizedVotes.filter((item) => item.includes("não") || item.includes("nao") || item.includes("contra")).length;
  const abstencao = normalizedVotes.filter((item) => item.includes("absten")).length;
  const obstrucao = normalizedVotes.filter((item) => item.includes("obstru")).length;
  const outros = Math.max(0, records.length - favor - contra - abstencao - obstrucao);

  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-[#0f3d2e]">Votações e participação</h2>

      {integrationMessage ? (
        <article className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-700">Cobertura parcial</p>
          <p className="mt-1 text-sm text-slate-600">{integrationMessage}</p>
        </article>
      ) : null}

      <VotingSummaryCards
        total={records.length}
        favor={favor}
        contra={contra}
        abstencao={abstencao}
        obstrucao={obstrucao}
        outros={outros}
        hasData={records.length > 0}
      />

      {records.length ? (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Data</th>
                <th className="px-4 py-3 font-semibold">Tema / votação</th>
                <th className="px-4 py-3 font-semibold">Voto</th>
                <th className="px-4 py-3 font-semibold">Resultado</th>
                <th className="px-4 py-3 font-semibold text-center">Fonte</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
              {records.map((record) => (
                <tr key={record.id}>
                  <td className="px-4 py-3">{new Date(record.data).toLocaleDateString("pt-BR")}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800">{record.titulo}</p>
                    {record.proposicaoId ? (
                      <p className="text-xs text-slate-500">Proposição {record.proposicaoId}</p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">{record.voto || "Indisponível"}</td>
                  <td className="px-4 py-3">{record.resultado || "Indisponível"}</td>
                  <td className="px-4 py-3 text-center">
                    {record.sourceUrl ? (
                      <a
                        href={record.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-[#0f3d2e] underline"
                      >
                        Ver detalhe
                      </a>
                    ) : (
                      <span className="text-xs text-slate-500">{record.sourceName}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title="Sem votações disponíveis"
          description="Histórico nominal não disponível com segurança na fonte oficial para este perfil/período."
        />
      )}

      <DataSourceBlock
        title="Fonte das votações"
        dataSourceInfo={sourceInfo}
        coverageStatus={coverageStatus}
        coverageReason={coverageReason}
      />
    </section>
  );
}
