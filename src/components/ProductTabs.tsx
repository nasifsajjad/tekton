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

/** Multitab category browser with catalogue-backed product detail dialogs. */
export default function ProductTabs({ tabs }: { tabs: CategoryTab[] }) {
  const [active, setActive] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<SelectedProduct | null>(null);
  const baseId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const tab = tabs[active];

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
    ? CATALOG_LOGOS[selectedProduct.category.icon]
    : undefined;
  const selectedGallery = selectedProduct
    ? getCatalogGallery(selectedProduct.category.icon)
    : [];

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

      <div
        role="tabpanel"
        id={`${baseId}-panel-${active}`}
        aria-labelledby={`${baseId}-tab-${active}`}
        className="mt-10"
      >
        <p className="max-w-[60ch] text-lg leading-relaxed text-gray-on-light">{tab.blurb}</p>
        <ul className="mt-10 flex flex-wrap gap-px bg-neutral-800">
          {tab.categories.map((cat, i) => {
            const logos = CATALOG_LOGOS[cat.icon];
            const detail = CATALOG_DETAILS[cat.icon];

            return (
              <li
                key={cat.name}
                className="grow basis-full bg-white sm:basis-[calc(50%-0.5px)] lg:basis-[calc(33.333%-0.667px)]"
              >
                <div className="flex h-full flex-col p-6">
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-xs font-semibold tracking-widest text-gray-on-light">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-navy/5">
                      <CategoryIcon icon={cat.icon} className="size-6 text-ink" />
                    </div>
                  </div>
                  <h3 className="display mt-4 text-header-xs">{cat.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-on-light">{cat.description}</p>

                  {cat.products.length > 0 && (
                    <ul className="mt-5 space-y-2 border-t border-neutral-200 pt-5">
                      {cat.products.map((product) => (
                        <li key={product}>
                          <button
                            type="button"
                            aria-haspopup="dialog"
                            onClick={(event) => openProduct(product, cat, event.currentTarget)}
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

                  {logos && detail && (
                    <div className="mt-auto border-t border-neutral-200 pt-5">
                      <div className="relative h-24 overflow-hidden border border-neutral-200 bg-white">
                        <Image
                          src={logos}
                          alt={`Brand logos: ${detail.brands.join(", ")}`}
                          fill
                          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 48vw, 90vw"
                          className="object-contain scale-[1.28]"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

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
                </div>
              </div>

              <section aria-label="Product images" className="py-8">
                <div className="grid gap-3 md:grid-cols-3">
                  {selectedGallery.map((image, index) => (
                    <div key={image.src} className="relative aspect-[3/2] overflow-hidden border border-neutral-200 bg-surface">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        priority={index === 0}
                        sizes="(min-width: 768px) 30vw, 90vw"
                        className="object-cover transition-transform duration-500 hover:scale-[1.03]"
                      />
                    </div>
                  ))}
                </div>
              </section>

              {selectedLogos && (
                <section aria-label="Available manufacturers" className="border-t border-neutral-200 pt-8">
                  <div className="relative h-32 overflow-hidden border border-neutral-200 bg-white sm:h-40">
                    <Image
                      src={selectedLogos}
                      alt={`Brand logos: ${selectedDetail.brands.join(", ")}`}
                      fill
                      sizes="(min-width: 768px) 80vw, 95vw"
                      className="object-contain scale-[1.24]"
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
