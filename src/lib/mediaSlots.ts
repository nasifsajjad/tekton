/**
 * Every image slot on the site that the editor can replace. Uploads keep the
 * same filename (pages reference these names), so swapping a file updates the
 * site immediately — no code changes needed. Safe to import from the client:
 * this module contains data only.
 */
export interface MediaSlot {
  /** Filename inside /public/media (or the special "brand-logo" slot). */
  file: string;
  label: string;
  /** Where it appears + the shape it is displayed at. */
  hint: string;
}

export const MEDIA_SLOTS: MediaSlot[] = [
  { file: "brand-logo", label: "Brand logo (header & footer)", hint: "Wide logo on transparent background — stored losslessly" },
  { file: "home-platform.jpg", label: "Homepage — One Supplier", hint: "Displayed 4:3" },
  { file: "home-oem.jpg", label: "Homepage — Genuine Parts", hint: "Displayed 4:3" },
  { file: "insight-1.jpg", label: "Homepage — Insight card 1", hint: "Displayed 3:2" },
  { file: "insight-2.jpg", label: "Homepage — Insight card 2", hint: "Displayed 3:2" },
  { file: "insight-3.jpg", label: "Homepage — Insight card 3", hint: "Displayed 3:2" },
  { file: "insight-4.jpg", label: "Homepage — Insight card 4", hint: "Displayed 3:2" },
  { file: "industry-1.jpg", label: "Homepage — Industry banner 1", hint: "Displayed 21:9 (very wide)" },
  { file: "industry-2.jpg", label: "Homepage — Industry banner 2", hint: "Displayed 21:9 (very wide)" },
  { file: "supply-products.jpg", label: "Homepage — Supply Line: Products tab", hint: "Landscape" },
  { file: "supply-services.jpg", label: "Homepage — Supply Line: Services tab", hint: "Landscape" },
  { file: "supply-programs.jpg", label: "Homepage — Supply Line: Programs tab", hint: "Landscape" },
  { file: "about-facility.jpg", label: "About — facility photo", hint: "Displayed 4:5 (portrait)" },
  { file: "products-hero.jpg", label: "Products — header image", hint: "Landscape" },
  { file: "og-image.jpg", label: "Social share preview (WhatsApp, LinkedIn…)", hint: "Cropped to 1200×630" },
];

/** Public URL the slot is served from (for previews). */
export function mediaSlotUrl(file: string): string {
  return file === "brand-logo" ? "/brand/tekton-header-footer.webp" : `/media/${file}`;
}
