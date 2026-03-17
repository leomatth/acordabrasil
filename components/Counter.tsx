"use client";

import { useEffect, useMemo, useState } from "react";
import { formatCurrency } from "@/lib/formatCurrency";
import { getNumberScaleClass } from "@/lib/utils/numberDisplay";

type CounterProps = {
  label: string;
  value: number;
  variant?: "default" | "hero";
  className?: string;
};

export function Counter({
  label,
  value,
  variant = "default",
  className = "",
}: CounterProps) {
  const [displayValue, setDisplayValue] = useState(value);

  const formattedValue = useMemo(
    () => formatCurrency(Math.round(displayValue)),
    [displayValue],
  );
  const isHero = variant === "hero";
  const valueScaleClass = getNumberScaleClass(formattedValue, isHero ? "hero" : "primary");

  // Animação suave sempre que o valor-alvo muda.
  useEffect(() => {
    const start = displayValue;
    const durationMs = variant === "hero" ? 1400 : 900;
    const startTime = performance.now();

    let animationFrame = 0;
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);

      setDisplayValue(start + (value - start) * eased);

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(animate);
      }
    };

    animationFrame = window.requestAnimationFrame(animate);

    return () => window.cancelAnimationFrame(animationFrame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, variant]);

  return (
    <article
      className={`min-w-0 overflow-hidden rounded-2xl border p-6 shadow-sm ${
        isHero
          ? "border-[#0f3d2e] bg-gradient-to-br from-[#0f3d2e] to-[#14553f] text-white shadow-lg"
          : "border-slate-200 bg-white"
      } ${className}`}
    >
      <p
        className={`text-sm font-semibold uppercase tracking-wide ${
          isHero ? "text-white/80" : "text-slate-500"
        }`}
      >
        {label}
      </p>
      <p
        className={`mt-3 max-w-full break-all font-extrabold leading-[1.08] tracking-tight ${valueScaleClass} ${
          isHero ? "text-white" : "text-[#0f3d2e]"
        }`}
      >
        {formattedValue}
      </p>
      {isHero ? (
        <div className="mt-5 h-1.5 w-20 rounded-full bg-[#ffcc00]" aria-hidden />
      ) : null}
    </article>
  );
}
