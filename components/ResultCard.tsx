"use client";

import { useMemo, useState } from "react";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import { formatCurrency } from "@/lib/formatCurrency";
import type { TaxCalculationResult } from "@/lib/taxCalculator";

type ResultCardProps = {
  salario: number;
  result: TaxCalculationResult;
};

export function ResultCard({ salario, result }: ResultCardProps) {
  const track = useTrackEvent();
  const [copied, setCopied] = useState(false);

  const shareText = useMemo(
    () =>
      `Descobri que pago cerca de ${formatCurrency(
        result.impostoAnual,
      )} por ano em impostos. Veja no AcordaBrasil.`,
    [result.impostoAnual],
  );

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      track(ANALYTICS_EVENTS.SHARE_RESULT, {
        section: "tax_simulator",
        source: "result_card",
        label: "clipboard_share",
        value: result.impostoAnual,
      });
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        Você paga aproximadamente
      </p>
      <p className="mt-2 text-2xl font-extrabold text-[#0f3d2e] sm:text-3xl">
        {formatCurrency(result.impostoMensal)} por mês em impostos
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-medium text-slate-500">Imposto mensal</p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            {formatCurrency(result.impostoMensal)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-medium text-slate-500">Imposto anual</p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            {formatCurrency(result.impostoAnual)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-medium text-slate-500">Percentual aproximado</p>
          <p className="mt-1 text-lg font-bold text-slate-900">{result.percentual}%</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-medium text-slate-500">Dias de trabalho para imposto</p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            {result.diasTrabalhadosParaImposto} dias/ano
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm font-semibold text-slate-800">
          Enquanto você trabalha, cerca de 33% da sua renda vai para impostos.
        </p>
        <button
          type="button"
          onClick={handleShare}
          className="mt-3 rounded-md bg-[#0f3d2e] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#14553f]"
        >
          Compartilhar resultado
        </button>
        {copied ? (
          <p className="mt-2 text-xs font-medium text-emerald-700">
            Resultado copiado para a área de transferência.
          </p>
        ) : null}
      </div>

      <p className="mt-5 text-xs text-slate-500">
        Esta é uma estimativa baseada em médias tributárias e não representa cálculo oficial.
      </p>

      <p className="mt-2 text-xs text-slate-500">
        Salário informado: {formatCurrency(salario)}
      </p>
    </article>
  );
}
