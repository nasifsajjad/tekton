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
  width?: number;
  height?: number;
  format?: "jpeg" | "webp";
}

export const MEDIA_SLOTS: MediaSlot[] = [
  { file: "brand-logo", label: "Brand logo (header & footer)", hint: "Wide logo on transparent background — stored losslessly" },
  { file: "about-facility.jpg", label: "About — facility photo", hint: "Displayed 4:5 (portrait)", width: 1120, height: 1400, format: "jpeg" },
  { file: "products-hero.jpg", label: "Products — header image", hint: "Landscape, cropped to 16:9", width: 1600, height: 900, format: "jpeg" },
  { file: "home-oem.jpg", label: "Homepage — genuine OEM parts", hint: "Landscape, cropped to 4:3", width: 1600, height: 1200, format: "jpeg" },
  ...[1, 2, 3, 4].map((number) => ({
    file: `insight-${number}.jpg`,
    label: `Homepage — insight ${number}`,
    hint: "Landscape, cropped to 3:2",
    width: 1200,
    height: 800,
    format: "jpeg" as const,
  })),
  ...[
    ["industry-oil-gas.webp", "Oil & Gas"],
    ["industry-aluminium-steel.webp", "Aluminium"],
    ["industry-power-energy.webp", "Power"],
    ["industry-water-utilities.webp", "Water"],
    ["industry-manufacturing.webp", "Manufacturing"],
    ["industry-marine-offshore.webp", "Marine"],
    ["industry-contracting.webp", "Contracting"],
  ].map(([file, name]) => ({
    file,
    label: `Industry — ${name}`,
    hint: "Landscape, cropped to 3:2",
    width: 1200,
    height: 800,
    format: "webp" as const,
  })),
  { file: "og-image.jpg", label: "Social share preview (WhatsApp, LinkedIn…)", hint: "Cropped to 1200×630", width: 1200, height: 630, format: "jpeg" },
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
