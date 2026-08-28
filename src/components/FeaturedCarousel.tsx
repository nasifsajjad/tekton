import Link from "next/link";
import type { FeaturedSlide } from "@/lib/content";

const pad = (n: number) => String(n).padStart(2, "0");

/** Stable, brand-neutral services grid with no scroll hijacking. */
export default function FeaturedCarousel({
  title,
  subtitle,
  slides,
}: {
  title: string;
  subtitle: string;
  slides: FeaturedSlide[];
}) {
  if (slides.length === 0) return null;

  return (
    <section className="featured-section border-y border-navy/10 bg-white text-ink" aria-labelledby="featured-services-title">
      <div className="rail">
        <p className="eyebrow text-gray-on-light">Industrial support</p>
        <h2 id="featured-services-title" className="display featured-title mt-3 max-w-[24ch]">
          {title}
        </h2>
        <p className="featured-sub mt-4 max-w-[62ch] leading-relaxed text-gray-on-light">
          {subtitle}
        </p>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {slides.map((slide, index) => (
            <article key={slide.title} className="featured-service-card flex h-full flex-col bg-white p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4 border-b border-navy/10 pb-5">
                <span className="eyebrow text-gray-on-light">Service</span>
                <span className="display text-sm font-semibold text-forge-dark tabular-nums" aria-hidden="true">
                  {pad(index + 1)}
                </span>
              </div>
              <h3 className="display mt-6 text-header-xs text-ink">{slide.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-on-light">{slide.tagline}</p>
              <ul className="mt-6 space-y-3 text-sm text-ink">
                {slide.items.map((item) => (
                  <li key={item.title} className="flex gap-3 border-t border-navy/10 pt-3 first:border-t-0 first:pt-0">
                    <span className="mt-2 size-1.5 shrink-0 bg-forge" aria-hidden="true" />
                    <span>
                      <span className="font-semibold">{item.title}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-10">
                <Link href={slide.ctaLink} className="btn btn--black-outline !min-w-0 self-start !px-6 !py-2.5 text-sm">
                  {slide.cta}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
