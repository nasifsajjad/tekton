"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import type { FeaturedSlide } from "@/lib/content";

/**
 * Homepage featured-solutions carousel. One slide per solution, navy card on
 * the light page. Native scroll-snap does the sliding (touch swipe works for
 * free); the buttons and dots drive/reflect the scroll position.
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
            <div className="flex gap-2" aria-hidden={false}>
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
              <div className="grain h-full border-t-4 border-forge bg-navy-deep p-7 sm:p-10">
                <div className="grid gap-8 lg:grid-cols-12">
                  <div className="lg:col-span-5">
                    <p className="eyebrow text-forge">Featured solution</p>
                    <h3 className="display mt-3 max-w-[18ch] text-header-sm text-white">{slide.title}</h3>
                    <p className="mt-4 max-w-[40ch] text-base leading-relaxed text-gray-on-dark-2">{slide.tagline}</p>
                    <Link href={slide.ctaLink} className="btn btn--primary mt-8 !min-w-0">
                      {slide.cta}
                    </Link>
                  </div>
                  <ul className="space-y-4 lg:col-span-7">
                    {slide.items.map((item) => (
                      <li key={item.title} className="flex gap-3 border-t border-white/15 pt-4 first:border-t-0 first:pt-0">
                        <span className="mt-2 block size-2 shrink-0 bg-forge" aria-hidden="true" />
                        <div>
                          <p className="text-sm font-semibold text-white sm:text-base">{item.title}</p>
                          {item.body && (
                            <p className="mt-1 text-sm leading-relaxed text-gray-on-dark-2">{item.body}</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>

        {slides.length > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            {slides.map((slide, i) => (
              <button
                key={slide.title}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}: ${slide.title}`}
                aria-current={i === index}
                className={`h-1.5 transition-all ${i === index ? "w-8 bg-forge" : "w-4 bg-navy/25 hover:bg-navy/50"}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
