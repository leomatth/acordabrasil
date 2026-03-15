"use client";

import { useState } from "react";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import {
  calculateTaxes,
  formatBRLInput,
  parseBRLCurrencyInput,
  type TaxCalculationResult,
} from "@/lib/taxCalculator";

type CalculatorCardProps = {
  onCalculate: (payload: { salario: number; result: TaxCalculationResult }) => void;
};

export function CalculatorCard({ onCalculate }: CalculatorCardProps) {
  const track = useTrackEvent();
  const [salaryInput, setSalaryInput] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const salario = parseBRLCurrencyInput(salaryInput);

    if (salario <= 0) {
      setError("Digite um salário mensal válido para calcular.");
      return;
    }

    const result = calculateTaxes(salario);

    track(ANALYTICS_EVENTS.TAX_SIMULATION_RUN, {
      section: "tax_simulator",
      source: "calculator_form",
      value: salario,
      label: "simulacao_executada",
    });

    setError("");
    onCalculate({
      salario,
      result,
    });
  };

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-[#0f3d2e]">Simulador de Impostos</h2>
      <p className="mt-2 text-sm text-slate-600">
        Digite seu salário mensal para obter uma estimativa rápida de carga tributária.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">Salário mensal (R$)</span>
          <input
            type="text"
            inputMode="numeric"
            value={salaryInput}
            onChange={(event) => {
              setSalaryInput(formatBRLInput(event.target.value));
              if (error) {
                setError("");
              }
            }}
            placeholder="R$ 5.000,00"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0f3d2e]"
            aria-invalid={Boolean(error)}
          />
        </label>

        {error ? <p className="text-sm text-rose-600">{error}</p> : null}

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-lg bg-[#0f3d2e] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#14553f]"
        >
          Calcular
        </button>
      </form>
    </article>
  );
}
