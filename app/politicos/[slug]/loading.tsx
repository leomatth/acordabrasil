import { PageLoader } from "@/components/loading/PageLoader";
import { SkeletonCard } from "@/components/loading/SkeletonCard";

export default function PoliticoProfileLoading() {
  return (
    <main className="container-page space-y-8 py-10">
      <PageLoader label="Carregando perfil do político..." />
      <SkeletonCard className="h-36" />
      <SkeletonCard className="h-44" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <SkeletonCard className="h-28" />
        <SkeletonCard className="h-28" />
        <SkeletonCard className="h-28" />
      </div>
      <SkeletonCard className="h-40" />
    </main>
  );
}
