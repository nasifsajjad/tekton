import Link from "next/link";
import BrandLogo from "./BrandLogo";

const LINKS = [
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Nav({ brandName, cta }: { brandName: string; cta: string }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-t-4 border-forge bg-white/95 text-ink shadow-[0_1px_0_rgba(15,57,92,.12)] backdrop-blur-xl">
      <div className="rail flex min-h-20 items-center justify-between gap-6">
        <Link href="/" className="flex shrink-0 items-center" aria-label={`${brandName} — home`}>
          <BrandLogo className="h-16 w-16 object-contain sm:h-[4.5rem] sm:w-[4.5rem]" priority />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="relative px-3 py-7 text-sm font-semibold tracking-wide transition-colors hover:text-forge-dark">
              {link.label}
            </Link>
          ))}
          <Link href="/contact" className="btn btn--primary ml-4 !min-w-0 !px-6 !py-2.5 text-sm">{cta}</Link>
        </nav>

        <details className="group relative md:hidden">
          <summary className="flex min-h-11 min-w-11 cursor-pointer list-none items-center justify-center rounded-full border border-navy/15 [&::-webkit-details-marker]:hidden">
            <span className="sr-only">Open navigation</span>
            <span aria-hidden="true" className="text-xl leading-none group-open:rotate-45">+</span>
          </summary>
          <nav className="fixed inset-x-0 top-20 flex flex-col border-t border-navy/10 bg-white px-4 pt-3 pb-6 shadow-xl" aria-label="Mobile navigation">
            {LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="border-b border-navy/10 py-3 text-lg font-semibold">{link.label}</Link>
            ))}
            <Link href="/contact" className="btn btn--primary mt-3 !min-w-0 self-start !px-6 !py-2.5 text-sm">{cta}</Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
