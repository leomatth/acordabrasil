type PoliticianResultsHeaderProps = {
  totalResults: number;
  currentPage: number;
  totalPages: number;
};

export function PoliticianResultsHeader({
  totalResults,
  currentPage,
  totalPages,
}: PoliticianResultsHeaderProps) {
  return (
    <header className="flex flex-col gap-2 border-b border-slate-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h3 className="text-lg font-bold text-[#0f3d2e]">Políticos encontrados</h3>
        <p className="text-sm text-slate-600">{totalResults} políticos encontrados</p>
      </div>

      <p className="text-sm font-medium text-slate-600">Página {currentPage} de {totalPages}</p>
    </header>
  );
}
