"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { FeaturedSlide } from "@/lib/content";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Featured-solutions carousel. The section pins to the viewport and vertical
 * scrolling drives the card track horizontally (GSAP ScrollTrigger, scrubbed),
 * with the next card peeking in from the right. Falls back to a native
 * scroll-snap strip (arrows + swipe) when reduced motion is requested or
 * before JS runs, so the content is always reachable.
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
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const [index, setIndex] = useState(0);
  const [pinned, setPinned] = useState(false);
  const indexRef = useRef(0);
  indexRef.current = index;

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track || slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    // Apply the pinned-mode layout synchronously BEFORE ScrollTrigger measures
    // the section — waiting for the React re-render would pin the taller
    // static layout's height.
    section.setAttribute("data-carousel", "pinned");
    setPinned(true);

    const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
    const tween = gsap.to(track, {
      x: () => -distance(),
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (fillRef.current) fillRef.current.style.transform = `scaleX(${self.progress})`;
          const next = Math.round(self.progress * (slides.length - 1));
          if (next !== indexRef.current) setIndex(next);
        },
      },
    });
    stRef.current = tween.scrollTrigger ?? null;
    ScrollTrigger.refresh();

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      stRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides.length]);

  const goTo = (i: number) => {
    const clamped = Math.max(0, Math.min(slides.length - 1, i));
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const st = stRef.current;
    if (st) {
      const top = st.start + ((st.end - st.start) * clamped) / (slides.length - 1);
      window.scrollTo({ top, behavior: smooth ? "smooth" : "auto" });
    } else {
      const track = trackRef.current;
      const card = track?.children[clamped] as HTMLElement | undefined;
      if (track && card) track.scrollTo({ left: card.offsetLeft - 16, behavior: smooth ? "smooth" : "auto" });
    }
  };

  const onTrackScroll = () => {
    if (stRef.current) return; // pinned mode: index comes from ScrollTrigger
    const track = trackRef.current;
    if (!track || track.children.length < 2) return;
    const step = (track.scrollWidth - track.clientWidth) / (slides.length - 1);
    const next = step > 0 ? Math.round(track.scrollLeft / step) : 0;
    if (next !== index) setIndex(next);
  };

  if (slides.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      data-carousel={pinned ? "pinned" : "static"}
      className="featured-section bg-surface text-ink"
      aria-roledescription="carousel"
      aria-label={title}
    >
      <div className="rail featured-head flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div>
          <p className="eyebrow text-gray-on-light">What we specialise in</p>
          <h2 className="display mt-2 max-w-[20ch] text-header-md">{title}</h2>
          <p className="mt-3 max-w-[56ch] text-base leading-relaxed" style={{ color: "hsl(0 0% 32%)" }}>
            {subtitle}
          </p>
        </div>
        {slides.length > 1 && (
          <div className="flex items-center gap-5">
            <span className="hidden text-[11px] font-semibold tracking-[0.12em] text-gray-on-light-2 uppercase lg:block" aria-hidden="true">
              Scroll to explore
            </span>
            <span className="display text-sm font-semibold tracking-widest text-gray-on-light tabular-nums" aria-hidden="true">
              {pad(index + 1)} / {pad(slides.length)}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => goTo(index - 1)}
                disabled={index === 0}
                aria-label="Previous solution"
                className="flex size-10 items-center justify-center border border-navy/30 text-navy transition-colors hover:border-navy hover:bg-navy hover:text-white disabled:opacity-30 disabled:hover:border-navy/30 disabled:hover:bg-transparent disabled:hover:text-navy"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => goTo(index + 1)}
                disabled={index === slides.length - 1}
                aria-label="Next solution"
                className="flex size-10 items-center justify-center border border-navy/30 text-navy transition-colors hover:border-navy hover:bg-navy hover:text-white disabled:opacity-30 disabled:hover:border-navy/30 disabled:hover:bg-transparent disabled:hover:text-navy"
              >
                →
              </button>
            </div>
          </div>
        )}
      </div>

      <div ref={trackRef} onScroll={onTrackScroll} className="featured-track" tabIndex={0}>
        {slides.map((slide, i) => (
          <article
            key={slide.title}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}`}
            className="featured-card group"
          >
            <div className="featured-card-inner grid gap-8 lg:grid-cols-12 lg:gap-12">
              <div className="flex flex-col lg:col-span-5">
                <div className="flex items-baseline gap-3">
                  <span className="display text-sm font-semibold text-forge-dark tabular-nums" aria-hidden="true">
                    {pad(i + 1)}
                  </span>
                  <p className="eyebrow text-gray-on-light">Featured solution</p>
                </div>
                <h3 className="display mt-4 max-w-[17ch] text-header-sm text-ink">{slide.title}</h3>
                <p className="mt-4 max-w-[40ch] text-base leading-relaxed" style={{ color: "hsl(0 0% 34%)" }}>
                  {slide.tagline}
                </p>
                <div className="mt-7 lg:mt-auto lg:pt-8">
                  <Link href={slide.ctaLink} className="btn btn--primary !min-w-0">
                    {slide.cta}
                  </Link>
                </div>
              </div>

              <ol className="lg:col-span-7">
                {slide.items.map((item, ii) => (
                  <li
                    key={item.title}
                    className="flex gap-4 border-t border-navy/10 py-3.5 first:border-t-0 first:pt-0 last:pb-0"
                  >
                    <span className="display w-7 shrink-0 pt-0.5 text-xs font-semibold text-forge-dark tabular-nums" aria-hidden="true">
                      {pad(ii + 1)}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-ink sm:text-[0.95rem]">{item.title}</p>
                      {item.body && (
                        <p className="mt-1 max-w-[58ch] text-sm leading-relaxed" style={{ color: "hsl(0 0% 36%)" }}>
                          {item.body}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </article>
        ))}
      </div>

      <div className="rail featured-foot">
        <div className="h-[3px] w-full bg-navy/10" aria-hidden="true">
          <span
            ref={fillRef}
            className="block h-full origin-left bg-forge"
            style={{ transform: `scaleX(${slides.length > 1 ? index / (slides.length - 1) : 1})` }}
          />
        </div>
      </div>
    </section>
  );
}
