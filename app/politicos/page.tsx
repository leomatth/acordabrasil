import { PoliticosPageClient } from "@/components/PoliticosPageClient";
import { getPoliticalOfficeCoverage, getPoliticians } from "@/lib/services/politiciansService";

export const dynamic = "force-dynamic";

export default async function PoliticosPage() {
  const [politiciansResult, officeCoverage] = await Promise.all([
    getPoliticians(),
    getPoliticalOfficeCoverage(),
  ]);

  return <PoliticosPageClient politiciansResult={politiciansResult} officeCoverage={officeCoverage} />;
}
