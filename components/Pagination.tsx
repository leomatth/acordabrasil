type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function buildPageNumbers(currentPage: number, totalPages: number): number[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, currentPage, currentPage - 1, currentPage + 1]);
  return Array.from(pages).filter((page) => page >= 1 && page <= totalPages).sort((a, b) => a - b);
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = buildPageNumbers(currentPage, totalPages);

  return (
    <nav className="flex flex-wrap items-center justify-center gap-2" aria-label="Paginação de políticos">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-[#0f3d2e] hover:text-[#0f3d2e] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Anterior
      </button>

      {pages.map((page, index) => {
        const previousPage = pages[index - 1];
        const showEllipsis = previousPage && page - previousPage > 1;
        const isActive = page === currentPage;

        return (
          <div key={page} className="flex items-center gap-2">
            {showEllipsis ? <span className="px-1 text-sm text-slate-500">...</span> : null}
            <button
              type="button"
              onClick={() => onPageChange(page)}
              aria-current={isActive ? "page" : undefined}
              className={`rounded-md border px-3 py-2 text-sm font-semibold transition ${
                isActive
                  ? "border-[#0f3d2e] bg-[#0f3d2e] text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:border-[#0f3d2e] hover:text-[#0f3d2e]"
              }`}
            >
              {page}
            </button>
          </div>
        );
      })}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-[#0f3d2e] hover:text-[#0f3d2e] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Próximo
      </button>
    </nav>
  );
}
