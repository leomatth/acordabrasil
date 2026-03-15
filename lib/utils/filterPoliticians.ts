import { normalizeText } from "@/lib/utils/textNormalization";
import type { PoliticianOffice, PoliticianProfile } from "@/types/politician";

export type PoliticianFilters = {
  search: string;
  cargo: PoliticianOffice | "all";
  partido: string | "all";
  estado: string | "all";
};

// Busca + filtros aplicados em sequência para produzir a base final da paginação.
export function filterPoliticians(
  politicians: PoliticianProfile[],
  filters: PoliticianFilters,
): PoliticianProfile[] {
  const search = normalizeText(filters.search);

  return politicians.filter((politician) => {
    if (filters.cargo !== "all" && politician.cargo !== filters.cargo) {
      return false;
    }

    if (filters.partido !== "all" && politician.partido !== filters.partido) {
      return false;
    }

    if (filters.estado !== "all" && politician.estado !== filters.estado) {
      return false;
    }

    if (!search) {
      return true;
    }

    const searchableText = normalizeText(
      `${politician.nome} ${politician.partido} ${politician.estado} ${politician.cargo}`,
    );

    return searchableText.includes(search);
  });
}
