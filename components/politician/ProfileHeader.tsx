import Image from "next/image";
import { DataOriginBadge } from "@/components/DataOriginBadge";
import type { DataFetchResult } from "@/types/dataSource";
import type { PoliticianProfile } from "@/types/politician";

type ProfileHeaderProps = {
  politician: PoliticianProfile;
  profileResult: DataFetchResult<PoliticianProfile | null>;
};

export function ProfileHeader({ politician, profileResult }: ProfileHeaderProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Image
            src={politician.foto}
            alt={`Foto de ${politician.nome}`}
            width={96}
            height={96}
            className="rounded-full border border-slate-200 bg-slate-100"
          />

          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-[#0f3d2e] sm:text-3xl">{politician.nome}</h1>
            <p className="text-sm font-medium text-slate-700">
              {politician.cargo} · {politician.partido} · {politician.estado}
            </p>
            <p className="text-sm text-slate-600">{politician.resumo}</p>
          </div>
        </div>

        <div className="flex items-start gap-2 sm:flex-col sm:items-end">
          <span className="inline-flex rounded-full bg-[#0f3d2e]/10 px-3 py-1 text-xs font-semibold text-[#0f3d2e]">
            {politician.situacao?.trim() || "Situação não informada"}
          </span>
          <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
            Perfil completo
          </span>
        </div>
      </div>

      <div className="mt-4">
        <DataOriginBadge
          source={profileResult.source}
          mode={profileResult.mode}
          lastUpdated={profileResult.lastUpdated}
          errorMessage={profileResult.errorMessage}
          className="max-w-md"
        />
      </div>
    </section>
  );
}
