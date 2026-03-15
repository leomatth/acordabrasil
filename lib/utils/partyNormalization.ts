import { normalizeText } from "@/lib/utils/textNormalization";
import type { PoliticianProfile } from "@/types/politician";

// Padronizamos partido por sigla em caixa alta e sem acentos para evitar duplicidades.
export function normalizeParty(value: string | null | undefined): string {
  const normalized = normalizeText(String(value ?? "")).replace(/\s+/g, "").toUpperCase();
  return normalized || "SEM_PARTIDO";
}

export function buildPartyOptions(politicians: PoliticianProfile[]): string[] {
  return Array.from(new Set(politicians.map((item) => normalizeParty(item.partido)))).sort((a, b) =>
    a.localeCompare(b),
  );
}
