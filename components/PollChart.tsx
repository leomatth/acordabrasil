"use client";

import { useEffect, useState } from "react";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";
import type { PollEntry } from "@/lib/mockData";

type PollChartProps = {
  data: PollEntry[];
};

const COLORS = ["#0f3d2e", "#1f6b52", "#2f8c6c", "#ffcc00"];

export function PollChart({ data }: PollChartProps) {
  const track = useTrackEvent();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-80 w-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm" />
    );
  }

  return (
    <div className="h-80 w-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
          <XAxis dataKey="candidato" tickLine={false} axisLine={false} />
          <YAxis unit="%" tickLine={false} axisLine={false} width={35} />
          <Tooltip />
          <Bar
            dataKey="percentual"
            radius={[8, 8, 0, 0]}
            onClick={(entry: unknown) => {
              const typedEntry = entry as PollEntry;

              track(ANALYTICS_EVENTS.POLL_INTERACTION, {
                section: "elections_poll",
                source: "poll_chart",
                label: typedEntry?.candidato ?? "desconhecido",
                value: typedEntry?.percentual ?? 0,
              });
            }}
          >
            {data.map((item, index) => (
              <Cell key={item.candidato} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
