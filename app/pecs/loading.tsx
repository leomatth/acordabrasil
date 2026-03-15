import { PageLoader } from "@/components/loading/PageLoader";
import { SkeletonList } from "@/components/loading/SkeletonList";

export default function PecsLoading() {
  return (
    <main className="container-page space-y-6 py-10">
      <PageLoader label="Carregando propostas legislativas..." />
      <div className="h-24 animate-pulse rounded-xl border border-slate-200 bg-white p-4 shadow-sm" />
      <SkeletonList count={6} className="grid gap-4 lg:grid-cols-2" />
    </main>
  );
}
