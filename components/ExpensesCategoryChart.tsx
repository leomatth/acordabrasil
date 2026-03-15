"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "@/lib/formatCurrency";
import type { ExpenseCategoryGroup } from "@/types/expense";

type ExpensesCategoryChartProps = {
  data: ExpenseCategoryGroup[];
  maxItems?: number;
};

type WrappedCategoryTickProps = {
  x?: number;
  y?: number;
  payload?: {
    value?: string;
  };
};

const MAX_LABEL_CHARS_PER_LINE = 22;

function wrapCategoryLabel(value: string): string[] {
  const words = value.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  words.forEach((word) => {
    const candidate = currentLine ? `${currentLine} ${word}` : word;

    if (candidate.length <= MAX_LABEL_CHARS_PER_LINE) {
      currentLine = candidate;
      return;
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    currentLine = word;
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.slice(0, 3);
}

function WrappedCategoryTick({ x = 0, y = 0, payload }: WrappedCategoryTickProps) {
  const value = String(payload?.value ?? "");
  const lines = wrapCategoryLabel(value);

  return (
    <g transform={`translate(${x},${y})`}>
      {lines.map((line, index) => (
        <text
          key={`${line}-${index}`}
          x={-8}
          y={index * 14}
          textAnchor="end"
          fill="#475569"
          fontSize={11}
        >
          {line}
        </text>
      ))}
    </g>
  );
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ value?: number; payload?: { categoria?: string } }> }) {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0];
  const categoria = item.payload?.categoria ?? "Categoria";
  const valor = item.value ?? 0;

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-md">
      <p className="font-semibold text-slate-700">{categoria}</p>
      <p className="mt-1 text-[#0f3d2e]">{formatCurrency(Number(valor))}</p>
    </div>
  );
}

export function ExpensesCategoryChart({ data, maxItems = 6 }: ExpensesCategoryChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-80 w-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm" />;
  }

  const chartData = data
    .slice()
    .sort((a, b) => b.valor - a.valor)
    .slice(0, maxItems)
    .map((item) => ({
    categoria: item.categoria,
    valor: Math.round(item.valor),
  }));

  const dynamicHeight = Math.max(300, chartData.length * 64);

  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm" style={{ height: dynamicHeight }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ top: 8, right: 80, left: 24, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            type="number"
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => formatCurrency(Number(value))}
            fontSize={11}
          />
          <YAxis
            type="category"
            dataKey="categoria"
            width={230}
            tickLine={false}
            axisLine={false}
            tick={<WrappedCategoryTick />}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(15, 61, 46, 0.06)" }} />
          <Bar dataKey="valor" fill="#0f3d2e" radius={[0, 8, 8, 0]}>
            <LabelList
              dataKey="valor"
              position="right"
              formatter={(value) => formatCurrency(Number(value ?? 0))}
              fill="#0f3d2e"
              fontSize={11}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
