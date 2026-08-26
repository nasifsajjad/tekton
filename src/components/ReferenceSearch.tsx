"use client";

import { useId, useMemo, useState } from "react";

export interface ReferenceRecord {
  group: string;
  category: string;
  description: string;
  products: string[];
  brands: string[];
  partNumbers: string[];
  keywords: string[];
}

function searchableText(record: ReferenceRecord): string {
  return [
    record.group,
    record.category,
    record.description,
    ...record.products,
    ...record.brands,
    ...record.partNumbers,
    ...record.keywords,
  ].join(" ").toLowerCase();
}

export default function ReferenceSearch({ records }: { records: ReferenceRecord[] }) {
  const [query, setQuery] = useState("");
  const searchId = useId();
  const normalized = query.trim().toLowerCase();
  const results = useMemo(
    () => (normalized ? records.filter((record) => searchableText(record).includes(normalized)) : records),
    [normalized, records],
  );

  return (
    <div>
      <div className="border border-navy/15 bg-surface p-5 sm:p-7">
        <div className="max-w-3xl">
          <label htmlFor={searchId} className="eyebrow text-gray-on-light">
            Search all references
          </label>
          <div className="mt-3 flex items-center gap-3 border-2 border-navy/20 bg-white px-4 transition-colors focus-within:border-navy">
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-5 shrink-0 text-gray-on-light">
              <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
              <path d="m13.5 13.5 4 4" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <input
              id={searchId}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search Siemens, valves, a part number, product or keyword…"
              className="w-full bg-transparent py-4 text-base text-ink outline-none focus-visible:outline-none placeholder:text-gray-on-light-2"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} className="min-h-11 px-2 text-sm font-semibold text-navy">
                Clear
              </button>
            )}
          </div>
        </div>
        <p className="mt-3 text-sm text-gray-on-light" role="status">
          {results.length} {results.length === 1 ? "reference" : "references"}{normalized ? ` matching “${query.trim()}”` : " available"}
        </p>
      </div>

      {results.length === 0 ? (
        <div className="mt-8 border border-navy/15 p-8">
          <h2 className="display text-header-xs">No stored reference found.</h2>
          <p className="mt-3 max-w-[60ch] text-gray-on-light">Send the part number, nameplate photo or product description to the sales desk for a manual cross-reference.</p>
          <a href="/contact" className="btn btn--primary mt-6 !min-w-0">Send an enquiry</a>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {results.map((record, index) => (
            <article key={`${record.group}-${record.category}-${index}`} className="border border-navy/15 bg-white p-6 sm:p-7">
              <p className="eyebrow text-forge-dark">{record.group}</p>
              <h2 className="display mt-3 text-header-xs">{record.category}</h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-on-light">{record.description}</p>

              {record.brands.length > 0 && (
                <div className="mt-6 border-t border-navy/10 pt-5">
                  <h3 className="eyebrow text-gray-on-light">Brands</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink">{record.brands.join(" · ")}</p>
                </div>
              )}
              {record.partNumbers.length > 0 && (
                <div className="mt-5">
                  <h3 className="eyebrow text-gray-on-light">Part numbers</h3>
                  <p className="mt-2 font-mono text-sm text-ink">{record.partNumbers.join(" · ")}</p>
                </div>
              )}
              {record.products.length > 0 && (
                <details className="mt-5 border-t border-navy/10 pt-4">
                  <summary className="cursor-pointer text-sm font-semibold text-navy">View product keywords</summary>
                  <ul className="mt-3 space-y-2 text-sm text-gray-on-light">
                    {record.products.map((product) => <li key={product}>— {product}</li>)}
                  </ul>
                </details>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
