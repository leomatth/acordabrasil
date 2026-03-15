import type { ElectionOffice } from "@/lib/mockData";

type OfficeCardProps = {
  office: ElectionOffice;
};

export function OfficeCard({ office }: OfficeCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <h3 className="text-lg font-bold text-[#0f3d2e]">{office.nome}</h3>
      <p className="mt-2 text-sm text-slate-600">{office.descricao}</p>

      <div className="mt-4">
        <p className="text-sm font-semibold text-slate-700">Responsabilidades:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
          {office.responsabilidades.map((item) => (
            <li key={`${office.nome}-${item}`}>{item}</li>
          ))}
        </ul>
      </div>

      <p className="mt-4 text-sm font-medium text-slate-700">
        Mandato: <span className="font-bold text-[#0f3d2e]">{office.mandato}</span>
      </p>
    </article>
  );
}
