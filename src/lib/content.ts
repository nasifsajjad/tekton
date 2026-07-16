import { promises as fs } from "fs";
import path from "path";

export interface LinkCta {
  cta: string;
  ctaLink: string;
}

export interface SiteContent {
  global: {
    brand: { name: string; fullName: string; tagline: string };
    contact: {
      phone: string;
      /** International format; non-digits are stripped for the wa.me link. */
      whatsapp: string;
      email: string;
      location: string;
      address: string;
      hours: string;
    };
    /** Company registration numbers. Stored for future use; not rendered yet. */
    registration: { cr: string; vat: string };
    /** Self-hosted analytics (Umami/Plausible-style). Empty scriptSrc disables. */
    analytics: { scriptSrc: string; websiteId: string };
    footer: { blurb: string; legal: string };
    /** Image descriptions for screen readers & SEO. Optional so older
     *  backups without the block still restore cleanly. */
    imageAlts?: {
      sequence?: string;
      homePlatform?: string;
      homeOem?: string;
      aboutFacility?: string;
    };
  };
  home: {
    hero: {
      title: string;
      subtitle: string;
      ctaPrimary: string;
      ctaPrimaryLink: string;
      ctaSecondary: string;
      ctaSecondaryLink: string;
    };
    platform: { title: string; body: string } & LinkCta;
    trust: { title: string; body: string } & LinkCta;
    statement: { title: string; body: string } & LinkCta;
    insights: {
      title: string;
      cards: { tag: string; title: string; link: string }[];
      industries: { name: string; link: string }[];
    };
    supplyLine: {
      title: string;
      subtitle: string;
      pillars: { title: string; body: string }[];
      tabs: {
        label: string;
        heading: string;
        items: { title: string; body: string }[];
      }[];
    };
    why: { title: string; body: string } & LinkCta;
    callouts: ({ title: string; body: string } & LinkCta)[];
    /** Featured-solutions carousel. Optional so older backups restore cleanly. */
    featured?: {
      title: string;
      subtitle: string;
      slides: FeaturedSlide[];
    };
  };
  products: {
    title: string;
    intro: string;
    tabs: {
      label: string;
      blurb: string;
      categories: { name: string; description: string; products: string[]; icon: string }[];
    }[];
    /** Label for the request-a-quote button inside the product detail dialog. */
    dialogCta: string;
    /** Catalogue search input and its no-results state. */
    search: {
      placeholder: string;
      emptyTitle: string;
      emptyBody: string;
      emptyCta: string;
    };
    cta: { title: string; body: string; button: string };
  };
  contact: {
    title: string;
    intro: string;
    formTitle: string;
    formNote: string;
    responseNote: string;
    /** WhatsApp button text and the opening message it prefills. */
    whatsappLabel: string;
    whatsappGreeting: string;
  };
  about: {
    title: string;
    intro: string;
    paragraphs: string[];
    stats: { value: string; label: string }[];
    values: { title: string; body: string }[];
    note: string;
  };
  /** Per-page search-result overrides. Empty strings fall back to the
   *  page's own copy. Optional so older backups restore cleanly. */
  seo?: {
    home?: PageSeo;
    products?: PageSeo;
    about?: PageSeo;
    contact?: PageSeo;
  };
}

export interface PageSeo {
  title: string;
  description: string;
}

export interface FeaturedSlide {
  title: string;
  tagline: string;
  cta: string;
  ctaLink: string;
  /** body is optional detail text; empty string renders a plain bullet. */
  items: { title: string; body: string }[];
}

const CONTENT_PATH = path.join(process.cwd(), "data", "content.json");
const BACKUP_DIR = path.join(process.cwd(), "data", "backups");
const MAX_BACKUPS = 20;
const BACKUP_NAME = /^content-[\dTZ-]+\.json$/;

export async function getContent(): Promise<SiteContent> {
  const raw = await fs.readFile(CONTENT_PATH, "utf-8");
  return JSON.parse(raw) as SiteContent;
}

/** Trim strings and drop empty list entries the editor can produce. */
function sanitize(content: SiteContent): SiteContent {
  const walk = (value: unknown): unknown => {
    if (typeof value === "string") return value.trim();
    if (Array.isArray(value)) return value.map(walk);
    if (value && typeof value === "object") {
      return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, walk(v)]));
    }
    return value;
  };
  const clean = walk(content) as SiteContent;
  for (const tab of clean.products.tabs) {
    for (const cat of tab.categories) {
      cat.products = cat.products.filter((p) => p.length > 0);
    }
  }
  clean.about.paragraphs = clean.about.paragraphs.filter((p) => p.length > 0);
  return clean;
}

/** Snapshot the current content file into data/backups, keeping the last 20. */
async function backupCurrent(): Promise<void> {
  try {
    const current = await fs.readFile(CONTENT_PATH, "utf-8");
    await fs.mkdir(BACKUP_DIR, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    await fs.writeFile(path.join(BACKUP_DIR, `content-${stamp}.json`), current, "utf-8");
    const files = (await fs.readdir(BACKUP_DIR)).filter((f) => BACKUP_NAME.test(f)).sort();
    for (const f of files.slice(0, Math.max(0, files.length - MAX_BACKUPS))) {
      await fs.unlink(path.join(BACKUP_DIR, f));
    }
  } catch {
    // A failed snapshot must never block publishing.
  }
}

export async function saveContentToDisk(content: SiteContent): Promise<void> {
  await backupCurrent();
  await fs.writeFile(CONTENT_PATH, JSON.stringify(sanitize(content), null, 2) + "\n", "utf-8");
}

export interface BackupInfo {
  file: string;
  /** ISO timestamp recovered from the filename. */
  savedAt: string;
}

export async function listBackupsFromDisk(): Promise<BackupInfo[]> {
  try {
    const files = (await fs.readdir(BACKUP_DIR)).filter((f) => BACKUP_NAME.test(f)).sort().reverse();
    return files.map((file) => {
      const raw = file.slice("content-".length, -".json".length);
      // 2026-07-16T10-30-00-000Z -> 2026-07-16T10:30:00.000Z
      const savedAt = raw.replace(/T(\d{2})-(\d{2})-(\d{2})-(\d{3})Z/, "T$1:$2:$3.$4Z");
      return { file, savedAt };
    });
  } catch {
    return [];
  }
}

export async function readBackupFromDisk(file: string): Promise<SiteContent> {
  if (!BACKUP_NAME.test(file)) throw new Error("Invalid backup name.");
  const raw = await fs.readFile(path.join(BACKUP_DIR, file), "utf-8");
  return JSON.parse(raw) as SiteContent;
}
