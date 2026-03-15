import type { MetadataRoute } from "next";
import { pecsMock, politiciansMock } from "@/lib/mockData";
import { SITE_URL } from "@/lib/seo";
import { buildPoliticianSlug } from "@/lib/utils/politicianSlug";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    "",
    "/gastos",
    "/impostos",
    "/impostos/simulador",
    "/pecs",
    "/eleicoes",
    "/politicos",
    "/politicos/ranking",
    "/escandalos",
    "/apoiar",
    "/newsletter",
    "/sobre",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const pecRoutes = pecsMock.map((pec) => ({
    url: `${SITE_URL}/pecs/${pec.id}`,
    lastModified: new Date(pec.ultimaAtualizacao),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const politicianRoutes = politiciansMock.map((politician) => ({
    url: `${SITE_URL}/politicos/${buildPoliticianSlug(politician.id, politician.nome)}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...pecRoutes, ...politicianRoutes];
}
