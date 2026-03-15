"use client";

import type { RankingType } from "@/lib/utils/ranking";

type RankingTabsProps = {
  value: RankingType;
  onChange: (value: RankingType) => void;
};

const TAB_OPTIONS: Array<{ value: RankingType; label: string }> = [
  { value: "more-expenses", label: "Mais gastos" },
  { value: "less-expenses", label: "Menos gastos" },
];

export function RankingTabs({ value, onChange }: RankingTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {TAB_OPTIONS.map((tab) => {
        const isActive = tab.value === value;

        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
              isActive
                ? "border-[#0f3d2e] bg-[#0f3d2e] text-white"
                : "border-slate-300 bg-white text-slate-700 hover:border-[#0f3d2e] hover:text-[#0f3d2e]"
            }`}
            aria-pressed={isActive}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
