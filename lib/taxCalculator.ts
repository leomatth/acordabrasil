export const DEFAULT_TAX_RATE = 0.33;

export type TaxCalculationResult = {
  impostoMensal: number;
  impostoAnual: number;
  percentual: number;
  diasTrabalhadosParaImposto: number;
};

export function calculateTaxes(
  salario: number,
  taxRate: number = DEFAULT_TAX_RATE,
): TaxCalculationResult {
  const normalizedSalary = Number.isFinite(salario) ? Math.max(0, salario) : 0;
  const normalizedRate = Math.min(1, Math.max(0, taxRate));

  const impostoMensal = normalizedSalary * normalizedRate;
  const impostoAnual = impostoMensal * 12;
  const diasTrabalhadosParaImposto = Math.round(365 * normalizedRate);

  return {
    impostoMensal,
    impostoAnual,
    percentual: normalizedRate * 100,
    diasTrabalhadosParaImposto,
  };
}

export function parseBRLCurrencyInput(value: string): number {
  const digitsOnly = value.replace(/\D/g, "");

  if (!digitsOnly) {
    return 0;
  }

  return Number(digitsOnly) / 100;
}

export function formatBRLInput(value: string): string {
  const digitsOnly = value.replace(/\D/g, "");

  if (!digitsOnly) {
    return "";
  }

  const numericValue = Number(digitsOnly) / 100;

  return numericValue.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
