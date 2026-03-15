"use client";

import { AlertTriangle } from "lucide-react";

type ErrorStateProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
};

export function ErrorState({
  title = "Não foi possível carregar os dados",
  description = "Tente novamente ou volte mais tarde.",
  onRetry,
  retryLabel = "Tentar novamente",
}: ErrorStateProps) {
  return (
    <section className="rounded-xl border border-rose-200 bg-white p-6 shadow-sm" role="alert">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-rose-700">
          <AlertTriangle className="h-4 w-4" aria-hidden />
        </span>
        <div>
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          <p className="mt-1 text-sm text-slate-600">{description}</p>
          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="mt-3 rounded-md bg-[#0f3d2e] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#14553f]"
            >
              {retryLabel}
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
