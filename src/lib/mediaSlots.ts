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
  { file: "about-facility.jpg", label: "About — facility photo", hint: "Displayed 4:5 (portrait)" },
  { file: "products-hero.jpg", label: "Products — header image", hint: "Landscape" },
  { file: "og-image.jpg", label: "Social share preview (WhatsApp, LinkedIn…)", hint: "Cropped to 1200×630" },
];

/** Slots stored as lossless transparent WebP under /brand instead of /media. */
export const LOSSLESS_SLOTS: Record<string, { path: string; width: number }> = {
  "brand-logo": { path: "brand/tekton-header-footer.webp", width: 1440 },
};

/** Public URL the slot is served from (for previews). */
export function mediaSlotUrl(file: string): string {
  const lossless = LOSSLESS_SLOTS[file];
  return lossless ? `/${lossless.path}` : `/media/${file}`;
}
