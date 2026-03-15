type PageLoaderProps = {
  label?: string;
};

export function PageLoader({ label = "Carregando dados..." }: PageLoaderProps) {
  return (
    <div className="container-page py-10" role="status" aria-live="polite">
      <div className="h-1 w-full overflow-hidden rounded-full bg-slate-200">
        <div className="h-full w-1/3 animate-pulse rounded-full bg-[#0f3d2e]" />
      </div>
      <p className="mt-3 text-sm text-slate-600">{label}</p>
    </div>
  );
}
