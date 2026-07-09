import Link from "next/link";
import type { SiteContent } from "@/lib/content";
import LogoMark from "./LogoMark";

export default function Footer({ content }: { content: SiteContent }) {
  const { brand, contact, footer } = content.global;
  return (
    <footer className="border-t border-neutral-100 bg-black pt-14 pb-8">
      <div className="rail">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link href="/" className="flex items-center gap-2" aria-label={`${brand.name} — home`}>
              <LogoMark square="hsl(55, 100%, 50%)" glyph="#000000" />
              <span
                className="display text-xl font-semibold text-white uppercase"
                style={{ letterSpacing: "0.02em" }}
              >
                {brand.name}
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-footer-link">{footer.blurb}</p>
          </div>

          <nav className="md:col-span-3" aria-label="Footer pages">
            <h3 className="eyebrow text-neutral-500">Pages</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {[
                { label: "Home", href: "/" },
                { label: "Products", href: "/products" },
                { label: "About", href: "/about" },
                { label: "Contact", href: "/contact" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-footer-link transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4">
            <h3 className="eyebrow text-neutral-500">Contact</h3>
            <ul className="mt-4 space-y-2 text-sm text-footer-link">
              <li>
                <a href={`tel:${contact.phone.replace(/\s+/g, "")}`} className="transition-colors hover:text-white">
                  {contact.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${contact.email}`} className="transition-colors hover:text-white">
                  {contact.email}
                </a>
              </li>
              <li>{contact.address}</li>
              <li>{contact.hours}</li>
            </ul>
          </div>
        </div>

        <p className="mt-14 border-t border-neutral-100 pt-6 text-xs text-footer-legal">{footer.legal}</p>
      </div>
    </footer>
  );
}
