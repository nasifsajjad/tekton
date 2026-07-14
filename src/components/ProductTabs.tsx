"use client";

import { useId, useState } from "react";
import CategoryIcon from "@/components/CategoryIcon";

interface CategoryTab {
  label: string;
  blurb: string;
  categories: { name: string; description: string; products: string[]; icon: string }[];
}

/** Multitab category browser for the products page (light theme). */
export default function ProductTabs({ tabs }: { tabs: CategoryTab[] }) {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const tab = tabs[active];

  if (!tab) return null;

  return (
    <div>
      <div
        role="tablist"
        aria-label="Product categories"
        className="scrollbar-none -mx-4 flex gap-1 overflow-x-auto border-b border-neutral-800 px-4 sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {tabs.map((t, i) => (
          <button
            key={t.label}
            role="tab"
            id={`${baseId}-tab-${i}`}
            aria-selected={i === active}
            aria-controls={`${baseId}-panel-${i}`}
            onClick={() => setActive(i)}
            className={`-mb-px shrink-0 border-b-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
              i === active
                ? "border-ink text-ink"
                : "border-transparent text-neutral-500 hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel-${active}`}
        aria-labelledby={`${baseId}-tab-${active}`}
        className="mt-10"
      >
        <p className="max-w-[60ch] text-lg leading-relaxed" style={{ color: "hsl(0 0% 30%)" }}>
          {tab.blurb}
        </p>
        <ul className="mt-10 flex flex-wrap gap-px bg-neutral-800">
          {tab.categories.map((cat, i) => (
            <li
              key={cat.name}
              className="grow basis-full bg-white sm:basis-[calc(50%-0.5px)] lg:basis-[calc(33.333%-0.667px)]"
            >
              <div className="flex h-full flex-col p-6 transition-colors duration-300 hover:bg-neutral-950">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-xs font-semibold tracking-widest text-neutral-600">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-black/5">
                    <CategoryIcon icon={cat.icon} className="size-6 text-ink" />
                  </div>
                </div>
                <h3 className="display mt-4 text-header-xs">{cat.name}</h3>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: "hsl(0 0% 35%)" }}>
                  {cat.description}
                </p>
                {cat.products.length > 0 && (
                  <ul className="mt-4 space-y-1.5 border-t border-neutral-200 pt-4">
                    {cat.products.map((p) => (
                      <li
                        key={p}
                        className="flex gap-2 text-xs leading-relaxed text-neutral-600"
                      >
                        <span aria-hidden="true" className="text-neutral-400">
                          &middot;
                        </span>
                        {p}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
