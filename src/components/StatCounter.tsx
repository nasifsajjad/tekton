"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts a stat value up when it scrolls into view. Handles values like
 * "18", "500+", "24h" — the first number animates, surrounding text is
 * kept as-is. Reduced motion (or an unparsable value) renders statically.
 * A settle timeout guarantees the final value even if rAF is throttled.
 */
export default function StatCounter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const match = value.match(/(\d[\d,.]*)/);
    if (!match || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const target = parseFloat(match[1].replace(/,/g, ""));
    if (!isFinite(target)) return;
    const prefix = value.slice(0, match.index);
    const suffix = value.slice((match.index ?? 0) + match[1].length);
    const decimals = match[1].includes(".") ? match[1].split(".")[1].length : 0;
    const DURATION = 900;

    let raf = 0;
    let settle = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / DURATION);
          const eased = 1 - Math.pow(1 - t, 4);
          setDisplay(`${prefix}${(target * eased).toFixed(decimals)}${suffix}`);
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        setDisplay(`${prefix}${(0).toFixed(decimals)}${suffix}`);
        raf = requestAnimationFrame(tick);
        settle = window.setTimeout(() => setDisplay(value), DURATION + 150);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(settle);
    };
  }, [value]);

  return <span ref={ref}>{display}</span>;
}
