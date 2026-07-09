"use client";

import { useId, useState } from "react";

interface CategoryTab {
  label: string;
  blurb: string;
  categories: { name: string; description: string }[];
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
        <ul className="mt-10 grid gap-px bg-neutral-800 sm:grid-cols-2 lg:grid-cols-3">
          {tab.categories.map((cat, i) => (
            <li key={cat.name} className="bg-white">
              <div className="flex h-full flex-col p-6 transition-colors duration-300 hover:bg-neutral-950">
                <span className="text-xs font-semibold tracking-widest text-neutral-600">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="display mt-4 text-header-xs">{cat.name}</h3>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: "hsl(0 0% 35%)" }}>
                  {cat.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
