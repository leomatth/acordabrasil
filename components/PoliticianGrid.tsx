import { PoliticianCard } from "@/components/PoliticianCard";
import type { PoliticianProfile } from "@/types/politician";

type PoliticianGridProps = {
  politicians: PoliticianProfile[];
};

export function PoliticianGrid({ politicians }: PoliticianGridProps) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
      {politicians.map((politician) => (
        <PoliticianCard key={politician.id} politician={politician} />
      ))}
    </div>
  );
}
