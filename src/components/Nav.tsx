"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import BrandLogo from "./BrandLogo";

const LINKS = [
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Nav({ brandName, cta }: { brandName: string; cta: string }) {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);

  // Close the mobile menu on Escape or on a tap/click outside the header.
  useEffect(() => {
    const closeMenu = () => {
      const menu = headerRef.current?.querySelector("details[open]");
      if (menu) menu.removeAttribute("open");
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    const onPointerDown = (e: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) closeMenu();
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  return (
    <header ref={headerRef} className="pointer-events-none fixed inset-x-0 top-0 z-50 pt-3 sm:pt-4">
      <div className="rail">
        <div className="pointer-events-auto flex min-h-16 items-center justify-between gap-6 border border-navy-deep/10 bg-white/70 px-4 text-navy-deep shadow-[0_16px_40px_-14px_rgba(7,31,51,0.45)] backdrop-blur-xl sm:min-h-[4.5rem] sm:px-6">
        <Link href="/" className="flex shrink-0 items-center" aria-label={`${brandName} — home`}>
          <BrandLogo className="h-11 w-auto sm:h-13" priority />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className="mx-3 px-0 py-7 text-sm font-semibold tracking-wide text-navy-deep transition-colors hover:text-navy"
              >
                <span className={`nav-link ${isActive ? "is-active" : ""}`}>{link.label}</span>
              </Link>
            );
          })}
          <Link href="/contact" className="btn btn--black-outline ml-4 !min-w-0 !px-6 !py-2.5 text-sm">{cta}</Link>
        </nav>

        <details className="group relative md:hidden">
          <summary className="flex min-h-11 min-w-11 cursor-pointer list-none items-center justify-center rounded-full border border-navy-deep/25 [&::-webkit-details-marker]:hidden">
            <span className="sr-only">Toggle navigation</span>
            <span aria-hidden="true" className="burger">
              <span />
              <span />
            </span>
          </summary>
          <nav className="fixed inset-x-2 top-[76px] flex flex-col border border-navy-deep/10 bg-white/95 px-4 pt-3 pb-6 shadow-xl backdrop-blur-xl" aria-label="Mobile navigation">
            {LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="border-b border-navy-deep/10 py-3 text-lg font-semibold transition-colors hover:text-orange-dark">{link.label}</Link>
            ))}
            <Link href="/contact" className="btn btn--black-outline mt-3 !min-w-0 self-start !px-6 !py-2.5 text-sm">{cta}</Link>
          </nav>
        </details>
        </div>
      </div>
    </header>
  );
}
