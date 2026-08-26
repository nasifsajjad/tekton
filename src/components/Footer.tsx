import Link from "next/link";
import type { SiteContent } from "@/lib/content";
import BrandLogo from "./BrandLogo";

export default function Footer({ content }: { content: SiteContent }) {
  const { brand, contact, footer } = content.global;
  const pages = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];
  const productGroups = content.products.tabs.map((tab) => tab.label);

  return (
    <footer className="border-t-4 border-forge bg-navy-deep pt-16 pb-8">
      <div className="rail">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Link href="/" className="inline-flex" aria-label={`${brand.name} — home`}>
              <BrandLogo className="block h-16 w-auto" light />
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-footer-link">{footer.blurb}</p>
          </div>

          <nav className="md:col-span-2" aria-label="Footer navigation">
            <h2 className="eyebrow text-forge">Explore</h2>
            <ul className="mt-4 space-y-1 text-sm">
              {pages.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="inline-flex min-h-11 items-center text-footer-link transition-colors hover:text-white">{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="md:col-span-3" aria-label="Product groups">
            <h2 className="eyebrow text-forge">Products</h2>
            <ul className="mt-4 space-y-1 text-sm">
              {productGroups.map((group) => (
                <li key={group}>
                  <Link href="/products#catalogue" className="inline-flex min-h-9 items-center text-footer-link transition-colors hover:text-white">
                    {group}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/references" className="inline-flex min-h-9 items-center font-semibold text-forge transition-colors hover:text-white">
                  Reference database
                </Link>
              </li>
            </ul>
          </nav>

          <div className="md:col-span-3">
            <h2 className="eyebrow text-forge">Contact</h2>
            <ul className="mt-4 space-y-1 text-sm text-footer-link">
              <li><a href={`tel:${contact.phone.replace(/\s+/g, "")}`} className="inline-flex min-h-11 items-center transition-colors hover:text-white">{contact.phone}</a></li>
              <li><a href={`mailto:${contact.email}`} className="inline-flex min-h-11 items-center transition-colors hover:text-white">{contact.email}</a></li>
              <li>{contact.address}</li>
              <li>{contact.hours}</li>
            </ul>
          </div>
        </div>
        <div className="mt-14 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-t border-white/15 pt-6 text-xs text-footer-legal">
          <p>
            {footer.legal}
            <span aria-hidden="true"> · </span>
            <Link href="/privacy" className="underline-offset-2 transition-colors hover:text-white hover:underline">Privacy</Link>
            <span aria-hidden="true"> · </span>
            <Link href="/terms" className="underline-offset-2 transition-colors hover:text-white hover:underline">Terms</Link>
          </p>
          {(content.global.registration.cr || content.global.registration.vat) && (
            <p>
              {content.global.registration.cr && <>CR {content.global.registration.cr}</>}
              {content.global.registration.cr && content.global.registration.vat && <span aria-hidden="true"> · </span>}
              {content.global.registration.vat && <>VAT {content.global.registration.vat}</>}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
