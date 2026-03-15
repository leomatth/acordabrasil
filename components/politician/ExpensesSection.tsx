"use client";

import { useEffect, useMemo, useState } from "react";
import { DataSourceBlock } from "@/components/data-source/DataSourceBlock";
import { ExpensesCategoryChart } from "@/components/ExpensesCategoryChart";
import { EmptyState } from "@/components/states/EmptyState";
import { ErrorState } from "@/components/states/ErrorState";
import { formatCurrency } from "@/lib/formatCurrency";
import type { DataFetchResult } from "@/types/dataSource";
import type { ExpenseItem, ExpenseSummary } from "@/types/expense";
import type { SectionCoverageStatus } from "@/types/politician";

type ExpenseFilters = {
  ano?: number;
  mes?: number;
  categoria?: string;
};

type ExpensesSectionProps = {
  politicianSlug: string;
  filters: ExpenseFilters;
  expenseYears: number[];
  expenseCategories: string[];
  sourceInfo: {
    sourceName: string;
    sourceType: "api" | "document" | "official_portal";
    sourceUrl?: string;
    referencePeriod?: string;
    lastUpdated?: string;
  };
  coverageStatus?: SectionCoverageStatus;
  coverageReason?: string;
  expensesSummaryResult: DataFetchResult<ExpenseSummary> | null;
  expensesResult: DataFetchResult<ExpenseItem[]> | null;
  expensesErrorMessage: string | null;
};

const INITIAL_VISIBLE_EXPENSES = 10;
const LOAD_MORE_STEP = 10;
const DEFAULT_CATEGORY_LIMIT = 6;

export function ExpensesSection({
  politicianSlug,
  filters,
  expenseYears,
  expenseCategories,
  sourceInfo,
  coverageStatus,
  coverageReason,
  expensesSummaryResult,
  expensesResult,
  expensesErrorMessage,
}: ExpensesSectionProps) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_EXPENSES);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const orderedExpenses = useMemo(() => {
    if (!expensesResult) {
      return [];
    }

    return [...expensesResult.data].sort(
      (a, b) => new Date(b.dataDocumento).getTime() - new Date(a.dataDocumento).getTime(),
    );
  }, [expensesResult]);

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_EXPENSES);
    setShowAllCategories(false);
  }, [filters.ano, filters.mes, filters.categoria]);

  const visibleExpenses = orderedExpenses.slice(0, visibleCount);
  const canLoadMore = visibleCount < orderedExpenses.length;
  const totalCategories = expensesSummaryResult?.data.categoriasAgrupadas.length ?? 0;
  const categoryLimit = showAllCategories ? totalCategories : DEFAULT_CATEGORY_LIMIT;

  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-[#0f3d2e]">Gastos de gabinete</h2>

      <DataSourceBlock
        title="Fonte dos gastos parlamentares"
        dataSourceInfo={expensesSummaryResult?.data.dataSourceInfo ?? sourceInfo}
        coverageStatus={coverageStatus}
        coverageReason={coverageReason}
        className="max-w-3xl"
      />

      <form className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" method="get">
        <label className="space-y-1 text-sm text-slate-700">
          <span className="font-medium">Ano</span>
          <select
            name="ano"
            defaultValue={filters.ano ? String(filters.ano) : ""}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none transition focus:border-[#0f3d2e]"
          >
            <option value="">Todos</option>
            {expenseYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1 text-sm text-slate-700">
          <span className="font-medium">Mês</span>
          <select
            name="mes"
            defaultValue={filters.mes ? String(filters.mes) : ""}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none transition focus:border-[#0f3d2e]"
          >
            <option value="">Todos</option>
            {Array.from({ length: 12 }, (_, index) => index + 1).map((month) => (
              <option key={month} value={month}>
                {month.toString().padStart(2, "0")}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1 text-sm text-slate-700 sm:col-span-2 lg:col-span-1">
          <span className="font-medium">Categoria</span>
          <select
            name="categoria"
            defaultValue={filters.categoria ?? ""}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none transition focus:border-[#0f3d2e]"
          >
            <option value="">Todas</option>
            {expenseCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-end gap-2">
          <button
            type="submit"
            className="rounded-md bg-[#0f3d2e] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#14553f]"
          >
            Filtrar
          </button>
          <a
            href={`/politicos/${politicianSlug}`}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Limpar
          </a>
        </div>
      </form>

      {expensesErrorMessage ? (
        <ErrorState
          title="Falha ao carregar despesas parlamentares"
          description={expensesErrorMessage}
        />
      ) : null}

      {expensesSummaryResult ? (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Total gasto</p>
              <p className="mt-2 text-xl font-bold text-[#0f3d2e]">
                {formatCurrency(expensesSummaryResult.data.totalDespesas)}
              </p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Total líquido</p>
              <p className="mt-2 text-xl font-bold text-[#0f3d2e]">
                {formatCurrency(expensesSummaryResult.data.totalLiquido)}
              </p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p
                className="text-xs font-medium uppercase tracking-wide text-slate-500"
                title="Valor glosado é a parte da despesa que não foi aceita integralmente no reembolso/prestação de contas."
              >
                Total glosado
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Valor não aceito integralmente no reembolso/prestação de contas.
              </p>
              <p className="mt-2 text-xl font-bold text-[#0f3d2e]">
                {formatCurrency(expensesSummaryResult.data.totalGlosa)}
              </p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Maior categoria</p>
              <p className="mt-2 text-xl font-bold text-[#0f3d2e]">
                {expensesSummaryResult.data.maiorCategoria || "Indisponível no momento"}
              </p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Última atualização</p>
              <p className="mt-2 text-sm font-semibold text-[#0f3d2e]">
                {new Date(expensesSummaryResult.lastUpdated).toLocaleString("pt-BR")}
              </p>
            </article>
          </div>

          {expensesSummaryResult.data.categoriasAgrupadas.length ? (
            <section className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-lg font-semibold text-[#0f3d2e]">Gastos por categoria</h3>
                {totalCategories > DEFAULT_CATEGORY_LIMIT ? (
                  <button
                    type="button"
                    onClick={() => setShowAllCategories((value) => !value)}
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-[#0f3d2e] hover:text-[#0f3d2e]"
                  >
                    {showAllCategories ? "Mostrar top categorias" : "Ver todas as categorias"}
                  </button>
                ) : null}
              </div>
              <ExpensesCategoryChart
                data={expensesSummaryResult.data.categoriasAgrupadas}
                maxItems={categoryLimit}
              />
            </section>
          ) : (
            <EmptyState
              title="Sem categorias para exibir"
              description="Não há despesas suficientes para montar o gráfico neste filtro."
            />
          )}

          <section className="space-y-3">
            <h3 className="text-lg font-semibold text-[#0f3d2e]">Detalhes dos gastos</h3>

            {orderedExpenses.length ? (
              <>
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-50 text-left text-slate-600">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Data</th>
                        <th className="px-4 py-3 font-semibold">Categoria</th>
                        <th className="px-4 py-3 font-semibold">Fornecedor</th>
                        <th className="px-4 py-3 font-semibold text-right">Valor líquido</th>
                        <th className="px-4 py-3 font-semibold text-center">Documento</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                      {visibleExpenses.map((expense) => (
                        <tr key={expense.id}>
                          <td className="px-4 py-3">
                            {new Date(expense.dataDocumento).toLocaleDateString("pt-BR")}
                          </td>
                          <td className="px-4 py-3">{expense.tipoDespesa}</td>
                          <td className="px-4 py-3">{expense.fornecedor}</td>
                          <td className="px-4 py-3 text-right font-medium text-[#0f3d2e]">
                            {formatCurrency(expense.valorLiquido)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {expense.urlDocumento ? (
                              <a
                                href={expense.urlDocumento}
                                target="_blank"
                                rel="noreferrer"
                                className="font-medium text-[#0f3d2e] underline"
                              >
                                Ver documento
                              </a>
                            ) : (
                              <span className="text-xs text-slate-500">Sem documento</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {canLoadMore ? (
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => setVisibleCount((count) => count + LOAD_MORE_STEP)}
                      className="rounded-md border border-[#0f3d2e] px-4 py-2 text-sm font-semibold text-[#0f3d2e] transition hover:bg-[#0f3d2e] hover:text-white"
                    >
                      Ver mais
                    </button>
                  </div>
                ) : null}
              </>
            ) : (
              <EmptyState
                title="Sem despesas no período"
                description="Ajuste os filtros para visualizar lançamentos de despesas."
              />
            )}
          </section>
        </>
      ) : null}
    </section>
  );
}
