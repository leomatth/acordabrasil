import type { LegislationItem } from "@/types/legislation";

export function mapExternalLegislationToInternalModel(payload: unknown): LegislationItem[] {
  const items = Array.isArray(payload) ? payload : [];

  return items
    .map((rawItem) => {
      const item = rawItem as Record<string, unknown>;

      const id = String(item.id ?? item.codigo ?? "");
      const numero = String(item.numero ?? item.number ?? "");
      const titulo = String(item.titulo ?? item.title ?? "");

      if (!id || !numero || !titulo) {
        return null;
      }

      const statusRaw = String(item.status ?? "Em tramitação");
      const assuntoRaw = String(item.assunto ?? item.topic ?? "Economia");

      const timelineRaw = Array.isArray(item.timeline) ? item.timeline : [];
      const apoiadoresRaw = Array.isArray(item.apoiadores)
        ? item.apoiadores
        : Array.isArray((item.politicos as Record<string, unknown> | undefined)?.apoiadores)
          ? ((item.politicos as Record<string, unknown>).apoiadores as unknown[])
          : [];

      const timeline = timelineRaw
        .map((entry) => {
          const event = entry as Record<string, unknown>;

          return {
            evento: String(event.evento ?? event.event ?? "Etapa"),
            data: String(event.data ?? event.date ?? new Date().toISOString()),
          };
        })
        .filter((entry) => entry.evento.length > 0);

      return {
        id,
        numero,
        titulo,
        status:
          statusRaw === "Aprovada" || statusRaw === "Rejeitada"
            ? statusRaw
            : "Em tramitação",
        assunto:
          assuntoRaw === "Economia" ||
          assuntoRaw === "Impostos" ||
          assuntoRaw === "Previdência" ||
          assuntoRaw === "Educação" ||
          assuntoRaw === "Saúde" ||
          assuntoRaw === "Infraestrutura"
            ? assuntoRaw
            : "Economia",
        resumo: String(item.resumo ?? item.summary ?? ""),
        statusAtual: String(item.statusAtual ?? item.currentStatus ?? "Em análise."),
        impactoFinanceiro: Number(item.impactoFinanceiro ?? item.financialImpact ?? 0) || undefined,
        ultimaAtualizacao: String(
          item.ultimaAtualizacao ?? item.updatedAt ?? new Date().toISOString(),
        ),
        politicos: {
          autor: String(
            item.autor ??
              (item.politicos as Record<string, unknown> | undefined)?.autor ??
              "Autor não informado",
          ),
          relator: String(
            item.relator ??
              (item.politicos as Record<string, unknown> | undefined)?.relator ??
              "Relator não informado",
          ),
          apoiadores: apoiadoresRaw.map((supporter) => String(supporter)),
        },
        timeline,
        votos: {
          favor: Number((item.votos as Record<string, unknown> | undefined)?.favor ?? item.favor ?? 0),
          contra: Number((item.votos as Record<string, unknown> | undefined)?.contra ?? item.contra ?? 0),
          abstencao: Number(
            (item.votos as Record<string, unknown> | undefined)?.abstencao ??
              item.abstencao ??
              0,
          ),
        },
      } as LegislationItem;
    })
    .filter((item): item is LegislationItem => Boolean(item));
}
