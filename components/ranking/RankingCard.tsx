import Image from "next/image";
import Link from "next/link";
import type { RankedPolitician } from "@/lib/utils/ranking";

type RankingCardProps = {
  item: RankedPolitician;
  metricLabel: string;
  metricValue: string;
};

export function RankingCard({ item, metricLabel, metricValue }: RankingCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-[#0f3d2e] px-2 text-xs font-bold text-white">
            #{item.position}
          </span>
          <Image
            src={item.foto}
            alt={`Foto de ${item.nome}`}
            width={52}
            height={52}
            className="rounded-full border border-slate-200 bg-slate-100"
          />
          <div>
            <h3 className="text-sm font-bold text-[#0f3d2e]">{item.nome}</h3>
            <p className="text-xs text-slate-600">
              {item.cargo} · {item.partido} · {item.estado}
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-amber-50 px-2 py-1 text-right">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-800">{metricLabel}</p>
          <p className="text-sm font-bold text-[#0f3d2e]">{metricValue}</p>
        </div>
      </div>

      <div className="mt-4">
        <Link
          href={`/politicos/${item.slug}`}
          className="inline-flex rounded-md bg-[#0f3d2e] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#14553f]"
        >
          Ver perfil
        </Link>
      </div>
    </article>
  );
}
