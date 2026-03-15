import type { ExpenseItem } from "@/types/expense";

export function groupExpensesByCategory(expenses: ExpenseItem[]) {
  const groups = new Map<string, number>();

  expenses.forEach((item) => {
    const category = String(item.tipoDespesa || "Outras despesas").trim() || "Outras despesas";
    const current = groups.get(category) ?? 0;
    groups.set(category, current + (item.valorLiquido || 0));
  });

  return Array.from(groups.entries())
    .map(([categoria, valor]) => ({ categoria, valor }))
    .sort((a, b) => b.valor - a.valor);
}
