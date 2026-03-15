"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { LegislationVotes } from "@/types/legislation";

type PecVoteChartProps = {
  votes: LegislationVotes;
};

export function PecVoteChart({ votes }: PecVoteChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const data = [
    { label: "A favor", value: votes.favor, fill: "#0f3d2e" },
    { label: "Contra", value: votes.contra, fill: "#b91c1c" },
    { label: "Abstenções", value: votes.abstencao, fill: "#d97706" },
  ];

  if (!mounted) {
    return <div className="h-72 w-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm" />;
  }

  return (
    <div className="h-72 w-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: 4, right: 4, top: 8, bottom: 8 }}>
          <XAxis dataKey="label" tickLine={false} axisLine={false} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
          <Tooltip
            formatter={(value: unknown) => {
              if (Array.isArray(value)) {
                return `${value[0] ?? 0} votos`;
              }

              return `${value ?? 0} votos`;
            }}
          />
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.label} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
