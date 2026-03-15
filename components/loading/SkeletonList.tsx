import { SkeletonCard } from "@/components/loading/SkeletonCard";

type SkeletonListProps = {
  count?: number;
  className?: string;
  itemClassName?: string;
};

export function SkeletonList({
  count = 6,
  className = "grid gap-4 md:grid-cols-2 xl:grid-cols-3",
  itemClassName,
}: SkeletonListProps) {
  return (
    <div className={className} aria-hidden>
      {Array.from({ length: count }, (_, index) => (
        <SkeletonCard key={`skeleton-${index}`} className={itemClassName} />
      ))}
    </div>
  );
}
