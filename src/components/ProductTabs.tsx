"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import CategoryIcon from "@/components/CategoryIcon";
import {
  CATALOG_DETAILS,
  CATALOG_LOGOS,
  getCatalogGallery,
} from "@/lib/catalog";

interface Category {
  name: string;
  description: string;
  products: string[];
  icon: string;
}

interface CategoryTab {
  label: string;
  blurb: string;
  categories: Category[];
}

interface SelectedProduct {
  name: string;
  category: Category;
}

const PRODUCT_DESCRIPTIONS: Record<string, string> = {
  "Disconnect switches & circuit breakers":
    "Isolation and protection devices for safely switching circuits, interrupting fault current and securing equipment during maintenance.",
  "Contactors, relays & motor starters":
    "Industrial control components for switching loads, automating sequences and protecting motors during start-up and operation.",
  "PLCs (ControlLogix, CompactLogix, MicroLogix)":
    "Programmable control platforms for machine automation, process sequencing, safety integration and distributed plant control.",
  "Servo drives, motors & actuators":
    "Precision motion components for controlled speed, torque, position and repeatable linear or rotary movement.",
  "Power supplies & energy monitors":
    "Stable industrial power conversion and monitoring equipment for control panels, instrumentation and energy-management systems.",
  "Industrial cabling & wiring systems":
    "Plant-grade cable, connectors and wiring infrastructure for dependable power, signal and data transmission.",
};

function productDescription(product: string, category: Category): string {
  return (
    PRODUCT_DESCRIPTIONS[product] ??
    `This catalogue range covers ${product.toLowerCase()} for ${category.name.toLowerCase()} applications. We can cross-reference the required duty, dimensions, specification and manufacturer part number for a matched supply.`
  );
}

function OpenIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-4">
      <path d="M7 5H5v10h10v-2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 5h5v5M15 5l-7 7" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-5">
      <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

/** One category cell — shared by the tab panels and the search results. */
function CategoryCard({
  cat,
  visibleProducts,
  indexLabel,
  groupLabel,
  onOpenProduct,
}: {
  cat: Category;
  visibleProducts: string[];
  indexLabel?: string;
  groupLabel?: string;
  onOpenProduct: (product: string, category: Category, trigger: HTMLButtonElement) => void;
}) {
  const logos = CATALOG_LOGOS[cat.name];

  return (
    <li className="grow basis-full bg-white sm:basis-[calc(50%-0.5px)] lg:basis-[calc(33.333%-0.667px)]">
      <div className="flex h-full flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <span className="text-xs font-semibold tracking-widest text-gray-on-light uppercase">
            {groupLabel ?? indexLabel}
          </span>
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-navy/5">
            <CategoryIcon icon={cat.icon} className="size-6 text-ink" />
          </div>
        </div>
        <h3 className="display mt-4 text-header-xs">{cat.name}</h3>
        <p className="mt-3 text-sm leading-relaxed text-gray-on-light">{cat.description}</p>

        {visibleProducts.length > 0 && (
          <ul className="mt-5 space-y-2 border-t border-neutral-200 pt-5">
            {visibleProducts.map((product) => (
              <li key={product}>
                <button
                  type="button"
                  aria-haspopup="dialog"
                  onClick={(event) => onOpenProduct(product, cat, event.currentTarget)}
                  className="group flex w-full items-center justify-between gap-4 border-b border-neutral-200 py-3 text-left text-base font-semibold text-ink transition-colors hover:border-forge hover:text-forge-dark"
                >
                  <span className="decoration-forge decoration-2 underline-offset-4 group-hover:underline">
                    {product}
                  </span>
                  <span className="flex size-8 shrink-0 items-center justify-center border border-navy/20 bg-white text-ink transition-colors group-hover:border-forge group-hover:bg-forge group-hover:text-navy-deep">
                    <OpenIcon />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {logos && (
          <div className="mt-auto border-t border-neutral-200 pt-5">
            <div className="relative aspect-[37/15] w-full overflow-hidden border border-neutral-200 bg-white">
              <img
                src={decodeURI(logos)}
                alt={`Brand logos for ${cat.name}`}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 size-full object-contain p-2"
              />
            </div>
          </div>
        )}
      </div>
    </li>
  );
}

/** Multitab category browser with catalogue-backed product detail dialogs. */
export default function ProductTabs({
  tabs,
  quoteCta,
  search,
}: {
  tabs: CategoryTab[];
  quoteCta: string;
  search: { placeholder: string; emptyTitle: string; emptyBody: string; emptyCta: string };
}) {
  const [active, setActive] = useState(0);
  const [query, setQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<SelectedProduct | null>(null);
  const baseId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const tab = tabs[active];

  // Search runs across every tab: a category matches on its name/description
  // (all products shown) or on individual product lines (only those shown).
  const q = query.trim().toLowerCase();
  const searching = q.length > 0;
  const searchResults = searching
    ? tabs.flatMap((t) =>
        t.categories.flatMap((cat) => {
          const catMatch =
            cat.name.toLowerCase().includes(q) || cat.description.toLowerCase().includes(q);
          const productHits = cat.products.filter((p) => p.toLowerCase().includes(q));
          if (!catMatch && productHits.length === 0) return [];
          return [{ group: t.label, cat, products: catMatch ? cat.products : productHits }];
        })
      )
    : [];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (selectedProduct && !dialog.open) {
      dialog.showModal();
      document.body.style.overflow = "hidden";
    } else if (!selectedProduct && dialog.open) {
      dialog.close();
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedProduct]);

  if (!tab) return null;

  const closeDialog = () => {
    setSelectedProduct(null);
    document.body.style.overflow = "";
    requestAnimationFrame(() => lastTriggerRef.current?.focus());
  };

  const openProduct = (
    product: string,
    category: Category,
    trigger: HTMLButtonElement,
  ) => {
    lastTriggerRef.current = trigger;
    setSelectedProduct({ name: product, category });
  };

  const selectedDetail = selectedProduct
    ? CATALOG_DETAILS[selectedProduct.category.icon]
    : undefined;
  const selectedLogos = selectedProduct
    ? CATALOG_LOGOS[selectedProduct.category.name]
    : undefined;
  const selectedGallery = selectedProduct
    ? getCatalogGallery(selectedProduct.category.icon)
    : [];

  return (
    <div>
      {/* Search across the whole catalogue */}
      <div className="mb-8">
        <label className="block max-w-xl">
          <span className="sr-only">Search the catalogue</span>
          <div className="flex items-center gap-3 border-2 border-navy/20 bg-white px-4 transition-colors focus-within:border-forge">
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-5 shrink-0 text-gray-on-light">
              <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
              <path d="m13.5 13.5 4 4" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={search.placeholder}
              className="w-full bg-transparent py-3.5 text-base text-ink outline-none placeholder:text-gray-on-light-2"
            />
          </div>
        </label>
        {searching && (
          <p className="mt-3 text-sm text-gray-on-light" role="status">
            {searchResults.length === 0
              ? "No catalogue match"
              : `${searchResults.length} matching ${searchResults.length === 1 ? "category" : "categories"}`}
            {" for "}
            <strong className="text-ink">“{query.trim()}”</strong>
          </p>
        )}
      </div>

      {!searching && (
        <div
          role="tablist"
          aria-label="Product categories"
          className="scrollbar-none sticky top-20 z-30 -mx-4 flex gap-1 overflow-x-auto border-b border-neutral-800 bg-white px-4 sm:mx-0 sm:flex-wrap sm:px-0"
        >
          {tabs.map((t, i) => (
            <button
              key={t.label}
              role="tab"
              id={`${baseId}-tab-${i}`}
              aria-selected={i === active}
              aria-controls={`${baseId}-panel-${i}`}
              onClick={() => setActive(i)}
              className={`-mb-px shrink-0 border-b-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${
                i === active
                  ? "border-ink text-ink"
                  : "border-transparent text-gray-on-light hover:text-ink"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {searching && (
        <div className="panel-enter">
          {searchResults.length === 0 ? (
            <div className="border border-neutral-200 bg-surface p-8">
              <p className="display text-header-xs">{search.emptyTitle}</p>
              <p className="mt-3 max-w-[56ch] text-base leading-relaxed text-gray-on-light">
                {search.emptyBody}
              </p>
              <a href="/contact" className="btn btn--primary mt-6 !min-w-0">
                {search.emptyCta}
              </a>
            </div>
          ) : (
            <ul className="flex flex-wrap gap-px bg-neutral-800">
              {searchResults.map((r) => (
                <CategoryCard
                  key={`${r.group}-${r.cat.name}`}
                  cat={r.cat}
                  visibleProducts={r.products}
                  groupLabel={r.group}
                  onOpenProduct={openProduct}
                />
              ))}
            </ul>
          )}
        </div>
      )}

      {!searching && (
      <div
        key={active}
        role="tabpanel"
        id={`${baseId}-panel-${active}`}
        aria-labelledby={`${baseId}-tab-${active}`}
        className="panel-enter mt-10"
      >
        <p className="max-w-[60ch] text-lg leading-relaxed text-gray-on-light">{tab.blurb}</p>
        <ul className="mt-10 flex flex-wrap gap-px bg-neutral-800">
          {tab.categories.map((cat, i) => (
            <CategoryCard
              key={cat.name}
              cat={cat}
              visibleProducts={cat.products}
              indexLabel={String(i + 1).padStart(2, "0")}
              onOpenProduct={openProduct}
            />
          ))}
        </ul>
      </div>
      )}

      <dialog
        ref={dialogRef}
        aria-labelledby={`${baseId}-dialog-title`}
        aria-describedby={`${baseId}-dialog-description`}
        onClose={() => {
          setSelectedProduct(null);
          document.body.style.overflow = "";
        }}
        onCancel={(event) => {
          event.preventDefault();
          closeDialog();
        }}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) closeDialog();
        }}
        className="fixed inset-0 z-[100] m-auto max-h-[92dvh] w-[min(1100px,calc(100%-1.5rem))] overflow-y-auto border-0 bg-white p-0 text-ink shadow-2xl backdrop:bg-navy-deep/80 backdrop:backdrop-blur-sm open:block"
      >
        {selectedProduct && selectedDetail && (
          <div>
            <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/15 bg-navy-deep px-5 py-4 text-white sm:px-8">
              <div className="flex items-center gap-3">
                <span className="size-2 bg-forge" aria-hidden="true" />
                <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                  {selectedProduct.category.name}
                </span>
              </div>
              <button
                type="button"
                onClick={closeDialog}
                aria-label="Close product details"
                className="flex size-10 items-center justify-center border border-white/30 text-white transition-colors hover:border-forge hover:bg-forge hover:text-navy-deep"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="px-5 py-8 sm:px-8 sm:py-10 lg:px-12">
              <div className="border-b border-neutral-200 pb-8">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-on-light">
                    Product detail
                  </p>
                  <h2 id={`${baseId}-dialog-title`} className="display mt-3 max-w-[22ch] text-header-sm">
                    {selectedProduct.name}
                  </h2>
                  <p id={`${baseId}-dialog-description`} className="mt-4 max-w-[68ch] text-base leading-relaxed text-gray-on-light">
                    {productDescription(selectedProduct.name, selectedProduct.category)}
                  </p>
                  <a
                    href={`/contact?product=${encodeURIComponent(selectedProduct.name)}&category=${encodeURIComponent(selectedProduct.category.name)}`}
                    className="btn btn--primary mt-6 !min-w-0"
                  >
                    {quoteCta}
                    <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>

              <section aria-label="Product images" className="py-8">
                <div className="grid gap-3">
                  {selectedGallery.map((image, index) => (
                    <div key={image.src} className="relative aspect-[3/2] overflow-hidden border border-neutral-200 bg-surface">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        priority={index === 0}
                        sizes="(min-width: 768px) 80vw, 95vw"
                        className="object-cover transition-transform duration-500 hover:scale-[1.03]"
                      />
                    </div>
                  ))}
                </div>
              </section>

              {selectedLogos && (
                <section aria-label="Available manufacturers" className="border-t border-neutral-200 pt-8">
                  <div className="relative mx-auto aspect-[37/15] w-full max-w-4xl overflow-hidden border border-neutral-200 bg-white">
                    <img
                      src={decodeURI(selectedLogos)}
                      alt={`Brand logos for ${selectedProduct.category.name}`}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 size-full object-contain p-3 sm:p-4"
                    />
                  </div>
                </section>
              )}
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
