import { PecsPageClient } from "@/components/PecsPageClient";
import { getLegislationItems } from "@/lib/services/legislationService";

export default async function PecsPage() {
  const legislationResult = await getLegislationItems();

  return <PecsPageClient legislationResult={legislationResult} />;
}
