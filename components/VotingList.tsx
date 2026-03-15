import type { PoliticianVote } from "@/lib/mockData";

type VotingListProps = {
  votes: PoliticianVote[];
};

const voteStyle: Record<PoliticianVote["voto"], string> = {
  "A favor": "bg-emerald-100 text-emerald-700",
  Contra: "bg-rose-100 text-rose-700",
  Abstenção: "bg-amber-100 text-amber-700",
};

export function VotingList({ votes }: VotingListProps) {
  return (
    <ul className="space-y-2">
      {votes.map((vote) => (
        <li
          key={`${vote.tema}-${vote.voto}`}
          className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3"
        >
          <span className="text-sm font-medium text-slate-700">{vote.tema}</span>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${voteStyle[vote.voto]}`}>
            {vote.voto}
          </span>
        </li>
      ))}
    </ul>
  );
}
