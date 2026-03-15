import { PageLoader } from "@/components/loading/PageLoader";
import { SkeletonChart } from "@/components/loading/SkeletonChart";
import { SkeletonList } from "@/components/loading/SkeletonList";

export default function ImpostosLoading() {
  return (
    <main className="container-page space-y-10 py-10">
      <PageLoader label="Carregando dados tributários..." />
      <SkeletonList count={4} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" />
      <SkeletonList count={6} className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" />
      <SkeletonChart heightClassName="h-80" />
    </main>
  );
}
