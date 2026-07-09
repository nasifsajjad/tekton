"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import LogoMark from "./LogoMark";

const LINKS = [
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Nav({ brandName, cta }: { brandName: string; cta: string }) {
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > 80 && y > lastY.current);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 bg-forge text-black transition-transform duration-300"
      style={{
        transform: hidden && !open ? "translateY(-100%)" : "translateY(0)",
        transitionTimingFunction: "cubic-bezier(.83,0,.17,1)",
      }}
    >
      <div className="rail flex min-h-15 items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2" aria-label={`${brandName} — home`}>
          <LogoMark square="#000000" glyph="hsl(55, 100%, 50%)" />
          <span
            className="display text-xl font-semibold tracking-tight uppercase"
            style={{ letterSpacing: "0.02em" }}
          >
            {brandName}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={pathname === l.href ? "page" : undefined}
              className={`px-3 py-2 text-base font-medium transition-opacity hover:opacity-60 ${
                pathname === l.href ? "underline underline-offset-8" : ""
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/contact" className="btn btn--black-outline ml-4 !min-w-0 !px-6 !py-2.5 text-sm">
            {cta}
          </Link>
        </nav>

        <button
          type="button"
          className="flex flex-col gap-1.5 p-2 md:hidden"
          aria-expanded={open}
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className="block h-0.5 w-6 bg-black transition-transform"
            style={{ transform: open ? "translateY(4px) rotate(45deg)" : "none" }}
          />
          <span
            className="block h-0.5 w-6 bg-black transition-transform"
            style={{ transform: open ? "translateY(-4px) rotate(-45deg)" : "none" }}
          />
        </button>
      </div>

      {open && (
        <nav className="rail flex flex-col gap-1 border-t-2 border-black/10 pt-3 pb-5 md:hidden" aria-label="Mobile">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="py-2 text-lg font-medium">
              {l.label}
            </Link>
          ))}
          <Link href="/contact" className="btn btn--black mt-3 !min-w-0 self-start !px-6 !py-2.5 text-sm">
            {cta}
          </Link>
        </nav>
      )}
    </header>
  );
}
