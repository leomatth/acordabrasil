import { PageLoader } from "@/components/loading/PageLoader";
import { SkeletonCard } from "@/components/loading/SkeletonCard";
import { SkeletonChart } from "@/components/loading/SkeletonChart";
import { SkeletonList } from "@/components/loading/SkeletonList";

export default function RootLoading() {
  return (
    <main className="container-page space-y-10 py-10">
      <PageLoader label="Carregando painel principal..." />

      <section className="grid gap-4 lg:grid-cols-[1.45fr_1fr]">
        <SkeletonChart heightClassName="h-[420px]" />
        <div className="space-y-4">
          <SkeletonCard className="h-[160px]" />
          <div className="grid gap-3 sm:grid-cols-3">
            <SkeletonCard className="h-[120px]" />
            <SkeletonCard className="h-[120px]" />
            <SkeletonCard className="h-[120px]" />
          </div>
        </div>
      </section>

      <SkeletonList count={6} className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3" />
    </main>
  );
}
