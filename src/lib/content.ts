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
      email: string;
      location: string;
      address: string;
      hours: string;
    };
    footer: { blurb: string; legal: string };
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
  };
  products: {
    title: string;
    intro: string;
    tabs: {
      label: string;
      blurb: string;
      categories: { name: string; description: string; products: string[]; icon: string }[];
    }[];
    cta: { title: string; body: string; button: string };
  };
  contact: {
    title: string;
    intro: string;
    formTitle: string;
    formNote: string;
    responseNote: string;
  };
  about: {
    title: string;
    intro: string;
    paragraphs: string[];
    stats: { value: string; label: string }[];
    values: { title: string; body: string }[];
    note: string;
  };
}

const CONTENT_PATH = path.join(process.cwd(), "data", "content.json");

export async function getContent(): Promise<SiteContent> {
  const raw = await fs.readFile(CONTENT_PATH, "utf-8");
  return JSON.parse(raw) as SiteContent;
}

export async function saveContentToDisk(content: SiteContent): Promise<void> {
  await fs.writeFile(CONTENT_PATH, JSON.stringify(content, null, 2) + "\n", "utf-8");
}
