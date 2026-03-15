"use client";

import { useEffect, useState } from "react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { taxDistributionMock } from "@/lib/mockData";

const COLORS = ["#0f3d2e", "#1f6b52", "#2f8c6c", "#7da997", "#ffcc00"];

export function TaxChart() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-[320px] w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm" />
    );
  }

  return (
    <div className="h-[320px] w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={taxDistributionMock}
            cx="50%"
            cy="45%"
            innerRadius={65}
            outerRadius={95}
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
          >
            {taxDistributionMock.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: unknown) => {
              if (Array.isArray(value)) {
                return `${value[0] ?? 0}%`;
              }

              return `${value ?? 0}%`;
            }}
          />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
