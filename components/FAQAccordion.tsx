"use client";

import { useState } from "react";
import type { TaxFAQItem } from "@/lib/mockData";

type FAQAccordionProps = {
  items: TaxFAQItem[];
};

export function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-2">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <article key={item.pergunta} className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
              aria-expanded={isOpen}
            >
              <span className="text-sm font-semibold text-slate-800">{item.pergunta}</span>
              <span className="text-lg font-bold text-[#0f3d2e]">{isOpen ? "−" : "+"}</span>
            </button>

            {isOpen ? (
              <div className="border-t border-slate-100 px-4 py-3 text-sm text-slate-600">
                {item.resposta}
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
