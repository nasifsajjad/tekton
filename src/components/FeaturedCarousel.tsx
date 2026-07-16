"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import type { FeaturedSlide } from "@/lib/content";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Homepage featured-solutions carousel. One slide per solution, navy card on
 * the light page. Native scroll-snap does the sliding (touch swipe works for
 * free); the buttons and progress segments drive/reflect the scroll position.
 */
export default function FeaturedCarousel({
  title,
  subtitle,
  slides,
}: {
  title: string;
  subtitle: string;
  slides: FeaturedSlide[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const goTo = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(slides.length - 1, i));
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({ left: clamped * track.clientWidth, behavior: smooth ? "smooth" : "auto" });
  };

  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const next = Math.round(track.scrollLeft / track.clientWidth);
    if (next !== index) setIndex(next);
  };

  if (slides.length === 0) return null;

  return (
    <section
      className="bg-white py-fluid-6 text-ink"
      aria-roledescription="carousel"
      aria-label={title}
    >
      <div className="rail">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow text-gray-on-light">What we specialise in</p>
            <h2 className="display mt-3 max-w-[20ch] text-header">{title}</h2>
            <p className="mt-4 max-w-[56ch] text-lg leading-relaxed" style={{ color: "hsl(0 0% 30%)" }}>
              {subtitle}
            </p>
          </div>
          {slides.length > 1 && (
            <div className="flex items-center gap-4">
              <span className="display text-sm font-semibold tracking-widest text-gray-on-light tabular-nums" aria-hidden="true">
                {pad(index + 1)} / {pad(slides.length)}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => goTo(index - 1)}
                  disabled={index === 0}
                  aria-label="Previous solution"
                  className="flex size-11 items-center justify-center border-2 border-navy text-navy transition-colors hover:bg-navy hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-navy"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => goTo(index + 1)}
                  disabled={index === slides.length - 1}
                  aria-label="Next solution"
                  className="flex size-11 items-center justify-center border-2 border-navy text-navy transition-colors hover:bg-navy hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-navy"
                >
                  →
                </button>
              </div>
            </div>
          )}
        </div>

        <div ref={trackRef} onScroll={onScroll} className="carousel-track mt-10" tabIndex={0}>
          {slides.map((slide, i) => (
            <article
              key={slide.title}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${slides.length}`}
              className="carousel-slide"
            >
              <div className="grain relative h-full overflow-hidden border-t-4 border-forge bg-navy-deep">
                {/* Oversized slide numeral, watermark style */}
                <span
                  aria-hidden="true"
                  className="display pointer-events-none absolute -top-8 right-2 text-[8rem] leading-none font-bold text-white/[.06] select-none sm:text-[13rem] sm:-top-12"
                >
                  {pad(i + 1)}
                </span>
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{ background: "linear-gradient(115deg, rgba(249,160,60,.10), transparent 42%)" }}
                />

                <div className="relative grid gap-10 p-7 sm:p-10 lg:grid-cols-12 lg:gap-14 lg:p-14">
                  <div className="flex flex-col lg:col-span-5">
                    <p className="eyebrow text-forge">Featured solution — {pad(i + 1)}</p>
                    <h3 className="display mt-4 max-w-[16ch] text-header-md text-white">{slide.title}</h3>
                    <p className="mt-5 max-w-[40ch] text-base leading-relaxed text-gray-on-dark-2">{slide.tagline}</p>
                    <div className="mt-8 lg:mt-auto lg:pt-10">
                      <Link href={slide.ctaLink} className="btn btn--primary !min-w-0">
                        {slide.cta}
                      </Link>
                    </div>
                  </div>

                  <ol className="lg:col-span-7">
                    {slide.items.map((item, ii) => (
                      <li
                        key={item.title}
                        className="flex gap-5 border-t border-white/12 py-4 first:border-t-0 first:pt-0 last:pb-0"
                      >
                        <span className="display w-8 shrink-0 pt-0.5 text-sm font-semibold text-forge tabular-nums" aria-hidden="true">
                          {pad(ii + 1)}
                        </span>
                        <div>
                          <p className="text-base font-semibold text-white">{item.title}</p>
                          {item.body && (
                            <p className="mt-1.5 max-w-[58ch] text-sm leading-relaxed text-gray-on-dark-2">{item.body}</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </article>
          ))}
        </div>

        {slides.length > 1 && (
          <div className="mt-8 flex items-center gap-2" role="group" aria-label="Choose slide">
            {slides.map((slide, i) => (
              <button
                key={slide.title}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}: ${slide.title}`}
                aria-current={i === index}
                className={`h-1.5 flex-1 transition-colors ${i === index ? "bg-forge" : "bg-navy/15 hover:bg-navy/40"}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
