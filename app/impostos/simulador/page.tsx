"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CalculatorCard } from "@/components/CalculatorCard";
import { ResultCard } from "@/components/ResultCard";
import { SectionTitle } from "@/components/SectionTitle";
import { TrackOnView } from "@/components/TrackOnView";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import type { TaxCalculationResult } from "@/lib/taxCalculator";

type CalculationState = {
  salario: number;
  result: TaxCalculationResult;
};

export default function ImpostosSimuladorPage() {
  const [calculation, setCalculation] = useState<CalculationState | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (calculation && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [calculation]);

  return (
    <main className="container-page space-y-6 py-10">
      <TrackOnView
        eventName={ANALYTICS_EVENTS.TAX_SIMULATION_VIEW}
        payload={{ section: "tax_simulator", source: "simulator_page" }}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <SectionTitle
          title="Descubra quanto imposto você paga"
          subtitle="Uma estimativa simples baseada em médias tributárias brasileiras."
        />

        <Link
          href="/impostos"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          Voltar para Impostos
        </Link>
      </div>

      <section className="grid items-start gap-5 lg:grid-cols-2">
        <CalculatorCard onCalculate={setCalculation} />

        <div
          ref={resultRef}
          className={`transition-all duration-500 ${
            calculation
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-2 opacity-0"
          }`}
        >
          {calculation ? (
            <ResultCard salario={calculation.salario} result={calculation.result} />
          ) : (
            <article className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500 shadow-sm">
              O resultado aparecerá aqui após clicar em <strong>Calcular</strong>.
            </article>
          )}
        </div>
      </section>
    </main>
  );
}
