// Normalização central para busca/filtros:
// remove acentos, aplica lowercase e trim para comparação previsível.
export function normalizeText(value: string): string {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}
