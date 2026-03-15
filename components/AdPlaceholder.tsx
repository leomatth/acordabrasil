type AdPlaceholderProps = {
  label?: string;
  className?: string;
};

export function AdPlaceholder({
  label = "Espaço reservado para monetização futura",
  className = "",
}: AdPlaceholderProps) {
  return (
    <div
      className={`rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-xs font-medium uppercase tracking-wide text-slate-500 ${className}`}
    >
      {label}
    </div>
  );
}
