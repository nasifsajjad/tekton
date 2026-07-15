"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import type { BackupInfo, SiteContent } from "@/lib/content";
import { MEDIA_SLOTS, mediaSlotUrl } from "@/lib/mediaSlots";
import LogoMark from "@/components/LogoMark";
import CategoryIcon, { CATEGORY_ICON_KEYS } from "@/components/CategoryIcon";
import { listBackups, logout, restoreBackup, saveContent, uploadMedia } from "./actions";

/* ---------- form primitives ---------- */

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold tracking-widest text-neutral-500 uppercase">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full border-2 border-neutral-800 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-ink"
      />
    </label>
  );
}

function Area({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold tracking-widest text-neutral-500 uppercase">{label}</span>
      <textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full resize-y border-2 border-neutral-800 bg-white px-3 py-2.5 text-sm leading-relaxed text-ink outline-none focus:border-ink"
      />
    </label>
  );
}

function IconPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold tracking-widest text-neutral-500 uppercase">Icon</span>
      <div className="mt-1.5 flex items-center gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-black/5">
          <CategoryIcon icon={value} className="size-6 text-ink" />
        </div>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border-2 border-neutral-800 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-ink"
        >
          {CATEGORY_ICON_KEYS.map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
      </div>
    </label>
  );
}

function Section({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details className="group border-2 border-neutral-800 bg-white open:border-ink" open={defaultOpen}>
      <summary className="flex cursor-pointer items-center justify-between px-5 py-4 select-none">
        <span className="display text-lg font-semibold">{title}</span>
        <span className="text-neutral-500 transition-transform group-open:rotate-45" aria-hidden="true">
          +
        </span>
      </summary>
      <div className="space-y-4 border-t-2 border-neutral-800 px-5 py-5 group-open:border-ink">
        {children}
      </div>
    </details>
  );
}

function ItemBox({
  label,
  onRemove,
  children,
}: {
  label: string;
  onRemove?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3 border-2 border-neutral-900 p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-neutral-500 uppercase">{label}</span>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-xs font-semibold text-neutral-500 uppercase hover:text-red-600"
          >
            Remove
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick} className="btn btn--black-outline !min-w-0 !px-5 !py-2 text-xs">
      + {label}
    </button>
  );
}

function PageHeading({ title }: { title: string }) {
  return (
    <h2 className="display border-b-2 border-ink pt-6 pb-2 text-xl font-semibold uppercase">{title}</h2>
  );
}

/* ---------- media manager ---------- */

function MediaSlotRow({ slot, label, hint }: { slot: string; label: string; hint: string }) {
  const [state, setState] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [version, setVersion] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setState("uploading");
    const data = new FormData();
    data.set("slot", slot);
    data.set("file", file);
    const result = await uploadMedia(data);
    if (result.ok) {
      setState("done");
      setVersion((v) => v + 1);
    } else {
      setState("error");
      setError(result.error ?? "Upload failed");
    }
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex items-center gap-4 border-2 border-neutral-900 p-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${mediaSlotUrl(slot)}?v=${version}`}
        alt=""
        className="h-16 w-24 shrink-0 border border-neutral-800 bg-neutral-950 object-contain"
        loading="lazy"
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-xs text-neutral-400">{hint}</p>
        {state === "done" && <p className="text-xs font-semibold text-green-700">✓ Replaced &amp; live</p>}
        {state === "error" && <p className="text-xs font-semibold text-red-700">{error}</p>}
      </div>
      <label className={`btn btn--black-outline !min-w-0 shrink-0 cursor-pointer !px-4 !py-2 text-xs ${state === "uploading" ? "pointer-events-none opacity-50" : ""}`}>
        {state === "uploading" ? "Uploading…" : "Replace"}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => void handleFile(e.target.files?.[0])}
        />
      </label>
    </div>
  );
}

/* ---------- editor ---------- */

export default function AdminEditor({ initialContent }: { initialContent: SiteContent }) {
  const [content, setContent] = useState<SiteContent>(initialContent);
  const [status, setStatus] = useState<"idle" | "dirty" | "saved" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [pending, startTransition] = useTransition();
  const [backups, setBackups] = useState<BackupInfo[] | null>(null);
  const contentRef = useRef(content);
  contentRef.current = content;
  const statusRef = useRef(status);
  statusRef.current = status;
  const importRef = useRef<HTMLInputElement>(null);

  function patch(fn: (draft: SiteContent) => void) {
    setContent((prev) => {
      const draft = structuredClone(prev);
      fn(draft);
      return draft;
    });
    setStatus("dirty");
  }

  function handleSave() {
    startTransition(async () => {
      const result = await saveContent(contentRef.current);
      if (result.ok) {
        setStatus("saved");
      } else {
        setStatus("error");
        setErrorMsg(result.error ?? "Unknown error");
      }
    });
  }

  // Guard against losing unsaved edits, and save with Ctrl/Cmd+S.
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (statusRef.current === "dirty") e.preventDefault();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      window.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function refreshBackups() {
    startTransition(async () => {
      const result = await listBackups();
      if (result.ok) setBackups(result.backups);
    });
  }

  function handleRestore(file: string, savedAt: string) {
    if (!window.confirm(`Restore the version from ${new Date(savedAt).toLocaleString()}? The current version is snapshotted first, so this can be undone.`)) return;
    startTransition(async () => {
      const result = await restoreBackup(file);
      if (result.ok && result.content) {
        setContent(result.content);
        setStatus("saved");
        const refreshed = await listBackups();
        if (refreshed.ok) setBackups(refreshed.backups);
      } else {
        setStatus("error");
        setErrorMsg(result.error ?? "Unknown error");
      }
    });
  }

  function handleExport() {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tekton-content-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(file: File | undefined) {
    if (!file) return;
    void file.text().then((text) => {
      try {
        const parsed = JSON.parse(text) as SiteContent;
        for (const key of ["global", "home", "products", "contact", "about"] as const) {
          if (!parsed[key] || typeof parsed[key] !== "object") throw new Error(`missing "${key}"`);
        }
        setContent(parsed);
        setStatus("dirty");
      } catch (err) {
        setStatus("error");
        setErrorMsg(`Not a valid content file: ${err instanceof Error ? err.message : "unknown error"}`);
      }
      if (importRef.current) importRef.current.value = "";
    });
  }

  const g = content.global;
  const h = content.home;
  const pr = content.products;
  const ct = content.contact;
  const ab = content.about;

  return (
    <div className="min-h-svh bg-neutral-950 text-ink">
      <header className="sticky top-0 z-40 bg-forge">
        <div className="rail flex min-h-15 flex-wrap items-center justify-between gap-3 py-2">
          <div className="flex items-center gap-2">
            <LogoMark square="#071f33" glyph="#f9a03c" />
            <span className="display text-lg font-semibold uppercase">Tekton — Site Editor</span>
          </div>
          <div className="flex items-center gap-3">
            {status === "dirty" && <span className="text-sm font-semibold">● Unsaved changes</span>}
            {status === "saved" && <span className="text-sm font-semibold">✓ Saved &amp; published</span>}
            {status === "error" && <span className="text-sm font-semibold text-red-700">{errorMsg}</span>}
            <a href="/" target="_blank" className="text-sm font-medium underline underline-offset-4">
              View site
            </a>
            <button
              type="button"
              onClick={handleSave}
              disabled={pending}
              className="btn btn--black !min-w-0 !px-6 !py-2.5 text-sm disabled:opacity-50"
            >
              {pending ? "Saving…" : "Save & Publish"}
            </button>
            <button
              type="button"
              onClick={() => startTransition(() => logout())}
              className="text-sm font-medium underline underline-offset-4 opacity-70 hover:opacity-100"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="rail max-w-3xl space-y-6 py-10">
        <p className="text-sm text-neutral-400">
          Edit any text below, then press <strong>Save &amp; Publish</strong> (or Ctrl+S). Changes
          go live on every page at once.
        </p>

        {/* ============ IMAGES ============ */}
        <PageHeading title="Images & media" />

        <Section title="Site images (upload replaces instantly)">
          <p className="text-xs leading-relaxed text-neutral-400">
            Photos are automatically rotated, resized and compressed on upload — files straight
            from a phone or camera are fine. The image keeps its place on the site.
          </p>
          <div className="space-y-3">
            {MEDIA_SLOTS.map((slot) => (
              <MediaSlotRow key={slot.file} slot={slot.file} label={slot.label} hint={slot.hint} />
            ))}
          </div>
        </Section>

        {/* ============ GLOBAL ============ */}
        <PageHeading title="Global — brand, contact, footer" />

        <Section title="Brand" defaultOpen>
          <Field label="Brand name (nav / footer)" value={g.brand.name} onChange={(v) => patch((d) => (d.global.brand.name = v))} />
          <Field label="Full company name" value={g.brand.fullName} onChange={(v) => patch((d) => (d.global.brand.fullName = v))} />
          <Field label="Tagline (used in page titles)" value={g.brand.tagline} onChange={(v) => patch((d) => (d.global.brand.tagline = v))} />
        </Section>

        <Section title="Contact details (all pages)">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Phone" value={g.contact.phone} onChange={(v) => patch((d) => (d.global.contact.phone = v))} />
            <Field label="WhatsApp number (with country code)" value={g.contact.whatsapp} onChange={(v) => patch((d) => (d.global.contact.whatsapp = v))} />
            <Field label="Email" value={g.contact.email} onChange={(v) => patch((d) => (d.global.contact.email = v))} />
            <Field label="Location (short)" value={g.contact.location} onChange={(v) => patch((d) => (d.global.contact.location = v))} />
            <Field label="Address" value={g.contact.address} onChange={(v) => patch((d) => (d.global.contact.address = v))} />
            <Field label="Working hours" value={g.contact.hours} onChange={(v) => patch((d) => (d.global.contact.hours = v))} />
          </div>
        </Section>

        <Section title="Company registration (stored, not shown on the site yet)">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="CR number" value={g.registration.cr} onChange={(v) => patch((d) => (d.global.registration.cr = v))} />
            <Field label="VAT number" value={g.registration.vat} onChange={(v) => patch((d) => (d.global.registration.vat = v))} />
          </div>
        </Section>

        <Section title="Analytics (self-hosted Umami or Plausible)">
          <Field label="Script URL (leave empty to disable)" value={g.analytics.scriptSrc} onChange={(v) => patch((d) => (d.global.analytics.scriptSrc = v))} />
          <Field label="Website ID (Umami) or domain (Plausible)" value={g.analytics.websiteId} onChange={(v) => patch((d) => (d.global.analytics.websiteId = v))} />
        </Section>

        <Section title="Footer">
          <Area label="Footer blurb" value={g.footer.blurb} onChange={(v) => patch((d) => (d.global.footer.blurb = v))} rows={2} />
          <Field label="Legal line" value={g.footer.legal} onChange={(v) => patch((d) => (d.global.footer.legal = v))} />
        </Section>

        {/* ============ HOMEPAGE ============ */}
        <PageHeading title="Homepage" />

        <Section title="Hero">
          <Area label="Main headline" value={h.hero.title} onChange={(v) => patch((d) => (d.home.hero.title = v))} rows={2} />
          <Area label="Subtitle" value={h.hero.subtitle} onChange={(v) => patch((d) => (d.home.hero.subtitle = v))} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Primary button" value={h.hero.ctaPrimary} onChange={(v) => patch((d) => (d.home.hero.ctaPrimary = v))} />
            <Field label="Primary link" value={h.hero.ctaPrimaryLink} onChange={(v) => patch((d) => (d.home.hero.ctaPrimaryLink = v))} />
            <Field label="Secondary button" value={h.hero.ctaSecondary} onChange={(v) => patch((d) => (d.home.hero.ctaSecondary = v))} />
            <Field label="Secondary link" value={h.hero.ctaSecondaryLink} onChange={(v) => patch((d) => (d.home.hero.ctaSecondaryLink = v))} />
          </div>
        </Section>

        {(["platform", "trust", "statement", "why"] as const).map((key) => (
          <Section key={key} title={`Section: ${{ platform: "One Supplier (light)", trust: "Genuine Parts (dark)", statement: "Statement band", why: "Why Tekton" }[key]}`}>
            <Area label="Title" value={h[key].title} onChange={(v) => patch((d) => (d.home[key].title = v))} rows={2} />
            <Area label="Body" value={h[key].body} onChange={(v) => patch((d) => (d.home[key].body = v))} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Button text" value={h[key].cta} onChange={(v) => patch((d) => (d.home[key].cta = v))} />
              <Field label="Button link" value={h[key].ctaLink} onChange={(v) => patch((d) => (d.home[key].ctaLink = v))} />
            </div>
          </Section>
        ))}

        <Section title="Insights & Applications">
          <Field label="Section title" value={h.insights.title} onChange={(v) => patch((d) => (d.home.insights.title = v))} />
          {h.insights.cards.map((card, i) => (
            <ItemBox key={i} label={`Card ${i + 1} (image: media/insight-${i + 1}.jpg)`} onRemove={() => patch((d) => d.home.insights.cards.splice(i, 1))}>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Tag" value={card.tag} onChange={(v) => patch((d) => (d.home.insights.cards[i].tag = v))} />
                <Field label="Link" value={card.link} onChange={(v) => patch((d) => (d.home.insights.cards[i].link = v))} />
              </div>
              <Field label="Title" value={card.title} onChange={(v) => patch((d) => (d.home.insights.cards[i].title = v))} />
            </ItemBox>
          ))}
          <AddButton label="Add card" onClick={() => patch((d) => d.home.insights.cards.push({ tag: "", title: "", link: "/contact" }))} />
          {h.insights.industries.map((ind, i) => (
            <ItemBox key={`ind-${i}`} label={`Industry banner ${i + 1} (image: media/industry-${i + 1}.jpg)`} onRemove={() => patch((d) => d.home.insights.industries.splice(i, 1))}>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name" value={ind.name} onChange={(v) => patch((d) => (d.home.insights.industries[i].name = v))} />
                <Field label="Link" value={ind.link} onChange={(v) => patch((d) => (d.home.insights.industries[i].link = v))} />
              </div>
            </ItemBox>
          ))}
          <AddButton label="Add industry banner" onClick={() => patch((d) => d.home.insights.industries.push({ name: "", link: "/products" }))} />
        </Section>

        <Section title="Supply Line (dark tabs)">
          <Field label="Section title" value={h.supplyLine.title} onChange={(v) => patch((d) => (d.home.supplyLine.title = v))} />
          <Field label="Subtitle" value={h.supplyLine.subtitle} onChange={(v) => patch((d) => (d.home.supplyLine.subtitle = v))} />
          {h.supplyLine.pillars.map((p, i) => (
            <ItemBox key={`pillar-${i}`} label={`Pillar ${i + 1}`} onRemove={() => patch((d) => d.home.supplyLine.pillars.splice(i, 1))}>
              <Field label="Title" value={p.title} onChange={(v) => patch((d) => (d.home.supplyLine.pillars[i].title = v))} />
              <Area label="Body" value={p.body} onChange={(v) => patch((d) => (d.home.supplyLine.pillars[i].body = v))} rows={2} />
            </ItemBox>
          ))}
          <AddButton label="Add pillar" onClick={() => patch((d) => d.home.supplyLine.pillars.push({ title: "", body: "" }))} />
          {h.supplyLine.tabs.map((tab, ti) => (
            <ItemBox key={`tab-${ti}`} label={`Tab ${ti + 1}`} onRemove={() => patch((d) => d.home.supplyLine.tabs.splice(ti, 1))}>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Tab label" value={tab.label} onChange={(v) => patch((d) => (d.home.supplyLine.tabs[ti].label = v))} />
              </div>
              <Field label="Tab heading" value={tab.heading} onChange={(v) => patch((d) => (d.home.supplyLine.tabs[ti].heading = v))} />
              {tab.items.map((item, ii) => (
                <ItemBox key={`tab-${ti}-item-${ii}`} label={`Accordion item ${ii + 1}`} onRemove={() => patch((d) => d.home.supplyLine.tabs[ti].items.splice(ii, 1))}>
                  <Field label="Title" value={item.title} onChange={(v) => patch((d) => (d.home.supplyLine.tabs[ti].items[ii].title = v))} />
                  <Area label="Body" value={item.body} onChange={(v) => patch((d) => (d.home.supplyLine.tabs[ti].items[ii].body = v))} rows={2} />
                </ItemBox>
              ))}
              <AddButton label="Add accordion item" onClick={() => patch((d) => d.home.supplyLine.tabs[ti].items.push({ title: "", body: "" }))} />
            </ItemBox>
          ))}
        </Section>

        <Section title="Footer callouts (yellow band)">
          {h.callouts.map((call, i) => (
            <ItemBox key={i} label={`Callout ${i + 1}`} onRemove={() => patch((d) => d.home.callouts.splice(i, 1))}>
              <Field label="Title" value={call.title} onChange={(v) => patch((d) => (d.home.callouts[i].title = v))} />
              <Area label="Body" value={call.body} onChange={(v) => patch((d) => (d.home.callouts[i].body = v))} rows={2} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Button text" value={call.cta} onChange={(v) => patch((d) => (d.home.callouts[i].cta = v))} />
                <Field label="Button link" value={call.ctaLink} onChange={(v) => patch((d) => (d.home.callouts[i].ctaLink = v))} />
              </div>
            </ItemBox>
          ))}
          <AddButton label="Add callout" onClick={() => patch((d) => d.home.callouts.push({ title: "", body: "", cta: "", ctaLink: "/contact" }))} />
        </Section>

        {/* ============ PRODUCTS PAGE ============ */}
        <PageHeading title="Products page" />

        <Section title="Products — intro">
          <Field label="Page title" value={pr.title} onChange={(v) => patch((d) => (d.products.title = v))} />
          <Area label="Intro" value={pr.intro} onChange={(v) => patch((d) => (d.products.intro = v))} />
          <Field label="Quote button in product popup" value={pr.dialogCta} onChange={(v) => patch((d) => (d.products.dialogCta = v))} />
          <Field label="Search placeholder" value={pr.search.placeholder} onChange={(v) => patch((d) => (d.products.search.placeholder = v))} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="No-results title" value={pr.search.emptyTitle} onChange={(v) => patch((d) => (d.products.search.emptyTitle = v))} />
            <Field label="No-results button" value={pr.search.emptyCta} onChange={(v) => patch((d) => (d.products.search.emptyCta = v))} />
          </div>
          <Area label="No-results text" value={pr.search.emptyBody} onChange={(v) => patch((d) => (d.products.search.emptyBody = v))} rows={2} />
        </Section>

        <Section title="Products — category tabs">
          {pr.tabs.map((tab, ti) => (
            <ItemBox key={ti} label={`Tab ${ti + 1}: ${tab.label || "(untitled)"}`} onRemove={() => patch((d) => d.products.tabs.splice(ti, 1))}>
              <Field label="Tab label" value={tab.label} onChange={(v) => patch((d) => (d.products.tabs[ti].label = v))} />
              <Area label="Tab blurb" value={tab.blurb} onChange={(v) => patch((d) => (d.products.tabs[ti].blurb = v))} rows={2} />
              {tab.categories.map((cat, ci) => (
                <ItemBox key={`cat-${ti}-${ci}`} label={`Category ${ci + 1}`} onRemove={() => patch((d) => d.products.tabs[ti].categories.splice(ci, 1))}>
                  <Field label="Name" value={cat.name} onChange={(v) => patch((d) => (d.products.tabs[ti].categories[ci].name = v))} />
                  <Area label="Description" value={cat.description} onChange={(v) => patch((d) => (d.products.tabs[ti].categories[ci].description = v))} rows={2} />
                  <Area
                    label="Products (one per line)"
                    value={cat.products.join("\n")}
                    onChange={(v) =>
                      patch((d) => (d.products.tabs[ti].categories[ci].products = v.split("\n")))
                    }
                    rows={4}
                  />
                  <IconPicker
                    value={cat.icon}
                    onChange={(v) => patch((d) => (d.products.tabs[ti].categories[ci].icon = v))}
                  />
                </ItemBox>
              ))}
              <AddButton label="Add category" onClick={() => patch((d) => d.products.tabs[ti].categories.push({ name: "", description: "", products: [], icon: CATEGORY_ICON_KEYS[0] }))} />
            </ItemBox>
          ))}
          <AddButton label="Add tab" onClick={() => patch((d) => d.products.tabs.push({ label: "", blurb: "", categories: [] }))} />
        </Section>

        <Section title="Products — bottom call-to-action">
          <Field label="Title" value={pr.cta.title} onChange={(v) => patch((d) => (d.products.cta.title = v))} />
          <Area label="Body" value={pr.cta.body} onChange={(v) => patch((d) => (d.products.cta.body = v))} rows={2} />
          <Field label="Button text" value={pr.cta.button} onChange={(v) => patch((d) => (d.products.cta.button = v))} />
        </Section>

        {/* ============ CONTACT PAGE ============ */}
        <PageHeading title="Contact page" />

        <Section title="Contact — content">
          <Field label="Page title" value={ct.title} onChange={(v) => patch((d) => (d.contact.title = v))} />
          <Area label="Intro" value={ct.intro} onChange={(v) => patch((d) => (d.contact.intro = v))} />
          <Field label="Form title" value={ct.formTitle} onChange={(v) => patch((d) => (d.contact.formTitle = v))} />
          <Area label="Form note (under the button)" value={ct.formNote} onChange={(v) => patch((d) => (d.contact.formNote = v))} rows={2} />
          <Field label="Response note" value={ct.responseNote} onChange={(v) => patch((d) => (d.contact.responseNote = v))} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="WhatsApp button label" value={ct.whatsappLabel} onChange={(v) => patch((d) => (d.contact.whatsappLabel = v))} />
            <Field label="WhatsApp opening message" value={ct.whatsappGreeting} onChange={(v) => patch((d) => (d.contact.whatsappGreeting = v))} />
          </div>
        </Section>

        {/* ============ ABOUT PAGE ============ */}
        <PageHeading title="About page" />

        <Section title="About — intro & story">
          <Field label="Page title" value={ab.title} onChange={(v) => patch((d) => (d.about.title = v))} />
          <Area label="Intro" value={ab.intro} onChange={(v) => patch((d) => (d.about.intro = v))} />
          {ab.paragraphs.map((p, i) => (
            <ItemBox key={i} label={`Paragraph ${i + 1}`} onRemove={() => patch((d) => d.about.paragraphs.splice(i, 1))}>
              <Area label="Text" value={p} onChange={(v) => patch((d) => (d.about.paragraphs[i] = v))} rows={4} />
            </ItemBox>
          ))}
          <AddButton label="Add paragraph" onClick={() => patch((d) => d.about.paragraphs.push(""))} />
        </Section>

        <Section title="About — stats">
          {ab.stats.map((s, i) => (
            <ItemBox key={i} label={`Stat ${i + 1}`} onRemove={() => patch((d) => d.about.stats.splice(i, 1))}>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Value" value={s.value} onChange={(v) => patch((d) => (d.about.stats[i].value = v))} />
                <Field label="Label" value={s.label} onChange={(v) => patch((d) => (d.about.stats[i].label = v))} />
              </div>
            </ItemBox>
          ))}
          <AddButton label="Add stat" onClick={() => patch((d) => d.about.stats.push({ value: "", label: "" }))} />
        </Section>

        <Section title="About — how we work">
          {ab.values.map((v0, i) => (
            <ItemBox key={i} label={`Value ${i + 1}`} onRemove={() => patch((d) => d.about.values.splice(i, 1))}>
              <Field label="Title" value={v0.title} onChange={(v) => patch((d) => (d.about.values[i].title = v))} />
              <Area label="Body" value={v0.body} onChange={(v) => patch((d) => (d.about.values[i].body = v))} rows={2} />
            </ItemBox>
          ))}
          <AddButton label="Add value" onClick={() => patch((d) => d.about.values.push({ title: "", body: "" }))} />
          <Area label="Future note (small text at the bottom)" value={ab.note} onChange={(v) => patch((d) => (d.about.note = v))} rows={2} />
        </Section>

        {/* ============ VERSIONS & BACKUP ============ */}
        <PageHeading title="Versions & backup" />

        <Section title="Version history (last 20 published versions)">
          <p className="text-xs leading-relaxed text-neutral-400">
            Every publish keeps a snapshot of the version it replaced. Restoring publishes that
            older version immediately — and snapshots the current one first, so nothing is lost.
          </p>
          <AddButton label={backups === null ? "Load history" : "Refresh history"} onClick={refreshBackups} />
          {backups !== null && backups.length === 0 && (
            <p className="text-sm text-neutral-400">No snapshots yet — they appear after your next publish.</p>
          )}
          {backups?.map((b) => (
            <div key={b.file} className="flex items-center justify-between gap-4 border-2 border-neutral-900 px-4 py-3">
              <span className="text-sm">{new Date(b.savedAt).toLocaleString()}</span>
              <button
                type="button"
                onClick={() => handleRestore(b.file, b.savedAt)}
                disabled={pending}
                className="btn btn--black-outline !min-w-0 !px-4 !py-2 text-xs disabled:opacity-50"
              >
                Restore
              </button>
            </div>
          ))}
        </Section>

        <Section title="Export / import content">
          <p className="text-xs leading-relaxed text-neutral-400">
            Download all site text as a file for safekeeping, or load a previously exported file
            into the editor (review it, then Save &amp; Publish).
          </p>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={handleExport} className="btn btn--black-outline !min-w-0 !px-5 !py-2 text-xs">
              ↓ Export content file
            </button>
            <label className="btn btn--black-outline !min-w-0 cursor-pointer !px-5 !py-2 text-xs">
              ↑ Import content file
              <input
                ref={importRef}
                type="file"
                accept="application/json,.json"
                className="sr-only"
                onChange={(e) => handleImport(e.target.files?.[0])}
              />
            </label>
          </div>
        </Section>

        <div className="flex items-center gap-4 pt-4 pb-16">
          <button type="button" onClick={handleSave} disabled={pending} className="btn btn--black disabled:opacity-50">
            {pending ? "Saving…" : "Save & Publish"}
          </button>
          {status === "dirty" && <span className="text-sm font-semibold text-neutral-400">● Unsaved changes</span>}
          {status === "saved" && <span className="text-sm font-semibold text-green-700">✓ Saved &amp; published</span>}
          {status === "error" && <span className="text-sm font-semibold text-red-700">{errorMsg}</span>}
        </div>
      </main>
    </div>
  );
}
