function baseSlugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function buildPoliticianSlug(id: number, name: string): string {
  const safeName = baseSlugify(name) || "nome-indisponivel";
  return `${id}-${safeName}`;
}

export function extractPoliticianIdFromSlug(slug: string): number | null {
  const match = String(slug).trim().match(/^(\d+)-/);

  if (!match) {
    return null;
  }

  const parsed = Number(match[1]);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}
