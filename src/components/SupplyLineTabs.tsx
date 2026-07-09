"use client";

import { useId, useState } from "react";
import { MediaSlot } from "./MediaSlotClient";

interface TabData {
  label: string;
  heading: string;
  items: { title: string; body: string }[];
  mediaFile: string;
  mediaExists: boolean;
}

/**
 * Dark tabs-with-accordions block (homepage). Tab strip on top, then a
 * two-column body: accordion list left, media right.
 */
export default function SupplyLineTabs({ tabs }: { tabs: TabData[] }) {
  const [active, setActive] = useState(0);
  const [openItem, setOpenItem] = useState(0);
  const baseId = useId();
  const tab = tabs[active];

  if (!tab) return null;

  return (
    <div>
      {/* Tab strip */}
      <div role="tablist" aria-label="Supply line" className="flex flex-wrap gap-2 border-b border-neutral-200">
        {tabs.map((t, i) => (
          <button
            key={t.label}
            role="tab"
            id={`${baseId}-tab-${i}`}
            aria-selected={i === active}
            aria-controls={`${baseId}-panel-${i}`}
            onClick={() => {
              setActive(i);
              setOpenItem(0);
            }}
            className={`display -mb-px border-b-2 px-5 py-3 text-header-xs transition-colors ${
              i === active
                ? "border-forge text-white"
                : "border-transparent text-neutral-500 hover:text-neutral-800"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Panel */}
      <div
        role="tabpanel"
        id={`${baseId}-panel-${active}`}
        aria-labelledby={`${baseId}-tab-${active}`}
        className="mt-10 grid gap-10 lg:grid-cols-2"
      >
        <div>
          <h3 className="display text-header-sm text-white">{tab.heading}</h3>
          <div className="mt-8 divide-y divide-neutral-200 border-y border-neutral-200">
            {tab.items.map((item, i) => {
              const open = i === openItem;
              return (
                <div key={item.title}>
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setOpenItem(open ? -1 : i)}
                    className="flex w-full items-center justify-between gap-4 py-4 text-left"
                  >
                    <span className={`display text-header-xs ${open ? "text-forge" : "text-white"}`}>
                      {item.title}
                    </span>
                    <span
                      className="text-2xl leading-none text-neutral-500 transition-transform duration-300"
                      style={{ transform: open ? "rotate(45deg)" : "none" }}
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </button>
                  <div
                    className="grid transition-[grid-template-rows] duration-300"
                    style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p className="pb-5 text-base leading-relaxed text-gray-on-dark-2">{item.body}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <MediaSlot
          file={tab.mediaFile}
          exists={tab.mediaExists}
          alt={`${tab.label} — ${tab.heading}`}
          aspect="16/10"
          dark
        />
      </div>
    </div>
  );
}
