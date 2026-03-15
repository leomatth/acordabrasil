import type {
  LegislationItem,
  LegislationStatus,
  LegislationSubject,
} from "@/types/legislation";

export type PecStatusFilter = "all" | LegislationStatus;
export type PecSubjectFilter = "all" | LegislationSubject;

export type PecFilterOptions = {
  status: PecStatusFilter;
  subject: PecSubjectFilter;
  keyword: string;
};

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function filterPecs(
  pecs: LegislationItem[],
  filters: PecFilterOptions,
): LegislationItem[] {
  const keyword = normalizeText(filters.keyword);

  return pecs.filter((pec) => {
    if (filters.status !== "all" && pec.status !== filters.status) {
      return false;
    }

    if (filters.subject !== "all" && pec.assunto !== filters.subject) {
      return false;
    }

    if (!keyword) {
      return true;
    }

    const searchable = normalizeText(
      [
        pec.numero,
        pec.titulo,
        pec.resumo,
        pec.assunto,
        pec.politicos.autor,
        pec.politicos.relator,
        pec.politicos.apoiadores.join(" "),
      ].join(" "),
    );

    return searchable.includes(keyword);
  });
}
