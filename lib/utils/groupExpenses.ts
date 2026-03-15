import type { ExpenseCategoryGroup, ExpenseItem } from "@/types/expense";

export function groupExpensesByCategoryName(expenses: ExpenseItem[]): ExpenseCategoryGroup[] {
  const groups = new Map<string, number>();

  expenses.forEach((item) => {
    const current = groups.get(item.tipoDespesa) ?? 0;
    groups.set(item.tipoDespesa, current + item.valorLiquido);
  });

  return Array.from(groups.entries())
    .map(([categoria, valor]) => ({ categoria, valor }))
    .sort((a, b) => b.valor - a.valor);
}
