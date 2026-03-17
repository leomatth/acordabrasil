"use client";

import { useMemo } from "react";
import { useLiveSpendCounter } from "@/hooks/useLiveSpendCounter";
import { formatCurrency } from "@/lib/formatCurrency";
import type { LiveSpendConfig } from "@/lib/liveSpend";
import { getNumberScaleClass } from "@/lib/utils/numberDisplay";

type LiveSpendCardProps = {
  title: string;
  caption: string;
  config: LiveSpendConfig;
  variant?: "default" | "taxes";
};

export function LiveSpendCard({ title, caption, config, variant = "default" }: LiveSpendCardProps) {
  const minFrameMs = Math.min(150, Math.max(50, config.intervalMs / 6));
  const value = useLiveSpendCounter({
    amountPerSecond: config.amountPerSecond,
    minFrameMs,
    startDelayMs: 1000,
  });

  const formattedValue = useMemo(() => formatCurrency(value), [value]);
  const valueScaleClass = getNumberScaleClass(formattedValue, "primary");
  const isTaxesVariant = variant === "taxes";

  return (
    <article
      className={`min-w-0 overflow-hidden rounded-2xl border p-5 shadow-sm ${
        isTaxesVariant
          ? "border-emerald-200 bg-gradient-to-br from-emerald-50 to-white"
          : "border-amber-200 bg-gradient-to-r from-amber-50 to-white"
      }`}
    >
      <p className={`text-sm font-semibold ${isTaxesVariant ? "text-emerald-900" : "text-slate-700"}`}>
        {title}
      </p>
      <p
        className={`mt-2 max-w-full break-all font-extrabold leading-[1.08] tracking-tight text-[#0f3d2e] ${valueScaleClass}`}
      >
        {formattedValue}
      </p>
      <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-slate-500">
        Acumulado desde que você abriu esta página
      </p>
      <p className={`mt-2 text-xs leading-relaxed ${isTaxesVariant ? "text-slate-600" : "text-slate-500"}`}>
        {caption}
      </p>
    </article>
  );
}
