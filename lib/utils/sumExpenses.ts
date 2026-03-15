import type { ExpenseItem } from "@/types/expense";

export function sumExpenseValues(
  expenses: ExpenseItem[],
  selector: (item: ExpenseItem) => number,
): number {
  return expenses.reduce((acc, item) => acc + selector(item), 0);
}
