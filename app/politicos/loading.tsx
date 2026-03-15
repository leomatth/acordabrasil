import { PageLoader } from "@/components/loading/PageLoader";
import { SkeletonList } from "@/components/loading/SkeletonList";

export default function PoliticosLoading() {
  return (
    <main className="container-page space-y-6 py-10">
      <PageLoader label="Carregando políticos..." />
      <div className="h-24 animate-pulse rounded-xl border border-slate-200 bg-white p-4 shadow-sm" />
      <SkeletonList count={9} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" />
    </main>
  );
}
