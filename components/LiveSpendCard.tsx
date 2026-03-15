"use client";

import { useEffect, useMemo, useState } from "react";
import { formatCurrency } from "@/lib/formatCurrency";
import { getAccumulatedValue, getElapsedSeconds, type LiveSpendConfig } from "@/lib/liveSpend";

type LiveSpendCardProps = {
  title: string;
  caption: string;
  config: LiveSpendConfig;
};

export function LiveSpendCard({ title, caption, config }: LiveSpendCardProps) {
  const [value, setValue] = useState(config.initialValue ?? 0);

  useEffect(() => {
    const startedAt = Date.now();

    const timer = window.setInterval(() => {
      const elapsedSeconds = getElapsedSeconds(startedAt);
      setValue(getAccumulatedValue(config, elapsedSeconds, config.initialValue ?? 0));
    }, config.intervalMs);

    const initialElapsedSeconds = getElapsedSeconds(startedAt);
    setValue(getAccumulatedValue(config, initialElapsedSeconds, config.initialValue ?? 0));

    return () => window.clearInterval(timer);
  }, [config]);

  const formattedValue = useMemo(() => formatCurrency(value), [value]);

  return (
    <article className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-slate-700">{title}</p>
      <p className="mt-2 text-2xl font-extrabold text-[#0f3d2e] sm:text-3xl">{formattedValue}</p>
      <p className="mt-2 text-xs text-slate-500">{caption}</p>
    </article>
  );
}
