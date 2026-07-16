import Link from "next/link";
import { getContent } from "@/lib/content";
import { MediaImage, hasMedia } from "@/components/Media";
import MotionBackground from "@/components/MotionBackground";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import IndustrialSequence from "@/components/IndustrialSequence";
import Reveal from "@/components/Reveal";
import SupplyLineTabs from "@/components/SupplyLineTabs";

const SUPPLY_MEDIA = ["supply-products.jpg", "supply-services.jpg", "supply-programs.jpg"];

export default async function Home() {
  const c = await getContent();
  return (
    <>
      <Nav brandName={c.global.brand.name} cta={c.home.hero.ctaPrimary} />
      <main id="main-content">
        <IndustrialSequence alt={c.global.imageAlts?.sequence || undefined} />

        {/* ============ 1. HERO — living canvas over navy, CSS-only entrance ============ */}
        <section className="grain relative flex min-h-svh flex-col justify-end overflow-hidden bg-navy-deep pt-32">
          <MotionBackground />
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-80"
            style={{
              backgroundImage:
                "linear-gradient(120deg, rgba(249,160,60,.16), transparent 38%), repeating-linear-gradient(90deg, transparent 0 11.8%, rgba(255,255,255,.045) 11.8% 12%)",
            }}
          />
          <div
            aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-b from-transparent to-navy-deep"
          />
          <div className="rail relative z-10 pb-20 sm:pb-24">
            <div className="hero-rise">
              <h1 className="display max-w-[16ch] text-header-xl text-white">{c.home.hero.title}</h1>
            </div>
            <div className="hero-rise hero-rise-2">
              <p className="mt-6 max-w-[54ch] text-lg leading-relaxed text-gray-on-dark-2">
                {c.home.hero.subtitle}
              </p>
            </div>
            <div className="hero-rise hero-rise-3">
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href={c.home.hero.ctaPrimaryLink} className="btn btn--primary">
                  {c.home.hero.ctaPrimary}
                </Link>
                <Link href={c.home.hero.ctaSecondaryLink} className="btn btn--white-outline">
                  {c.home.hero.ctaSecondary}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ============ 2. PLATFORM — two-column, light ============ */}
        <section className="bg-surface py-fluid-6 text-ink">
          <div className="rail grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <h2 className="display max-w-[16ch] text-header">{c.home.platform.title}</h2>
              <p className="mt-6 max-w-[56ch] text-lg leading-relaxed" style={{ color: "hsl(0 0% 30%)" }}>
                {c.home.platform.body}
              </p>
              <Link href={c.home.platform.ctaLink} className="btn btn--black-outline mt-8">
                {c.home.platform.cta}
              </Link>
            </Reveal>
            <Reveal delay={120}>
              <MediaImage
                file="home-platform.jpg"
                alt={c.global.imageAlts?.homePlatform || "Warehouse racking stocked with boxed industrial parts"}
                aspect="4/3"
              />
            </Reveal>
          </div>
        </section>

        {/* ============ 3. TRUST — two-column, light ============ */}
        <section className="bg-white py-fluid-6 text-ink">
          <div className="rail grid items-center gap-12 lg:grid-cols-2">
            <Reveal className="lg:order-2">
              <h2 className="display max-w-[16ch] text-header">{c.home.trust.title}</h2>
              <p className="mt-6 max-w-[56ch] text-lg leading-relaxed" style={{ color: "hsl(0 0% 30%)" }}>
                {c.home.trust.body}
              </p>
              <Link href={c.home.trust.ctaLink} className="btn btn--black-outline mt-8">
                {c.home.trust.cta}
              </Link>
            </Reveal>
            <Reveal delay={120} className="lg:order-1">
              <MediaImage
                file="home-oem.jpg"
                alt={c.global.imageAlts?.homeOem || "Machined OEM part with its manufacturer certificate and tags"}
                aspect="4/3"
              />
            </Reveal>
          </div>
        </section>

        {/* ============ 4. STATEMENT — one-column, light ============ */}
        <section className="bg-surface py-fluid-6 text-ink">
          <div className="rail">
            <Reveal>
              <h2 className="display max-w-[20ch] text-header">{c.home.statement.title}</h2>
              <p className="mt-6 max-w-[52ch] text-lg leading-relaxed" style={{ color: "hsl(0 0% 30%)" }}>
                {c.home.statement.body}
              </p>
              <Link href={c.home.statement.ctaLink} className="btn btn--black-outline mt-8">
                {c.home.statement.cta}
              </Link>
            </Reveal>
          </div>
        </section>

        {/* ============ 5. INSIGHTS & APPLICATIONS — card row ============ */}
        <section className="border-t border-neutral-900 bg-white py-fluid-6 text-ink">
          <div className="rail">
            <Reveal>
              <h2 className="display max-w-[20ch] text-header">{c.home.insights.title}</h2>
            </Reveal>
            <div className="mt-12 grid gap-px bg-neutral-800 sm:grid-cols-2 lg:grid-cols-4">
              {c.home.insights.cards.map((card, i) => (
                <Reveal key={card.title} delay={i * 80} className="h-full">
                  <Link href={card.link} className="group flex h-full flex-col bg-white">
                    <div className="overflow-hidden">
                      <MediaImage
                        file={`insight-${i + 1}.jpg`}
                        alt={card.title}
                        aspect="3/2"
                        className="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between p-6">
                      <div>
                        <span className="eyebrow text-gray-on-light">{card.tag}</span>
                        <h3 className="display mt-3 text-header-xs group-hover:underline group-hover:underline-offset-4">
                          {card.title}
                        </h3>
                      </div>
                      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium" aria-hidden="true">
                        {card.link.startsWith("/products") ? "View products" : card.link.startsWith("/contact") ? "Talk to us" : "Explore"}
                        <span className="transition-transform duration-300 ease-out group-hover:translate-x-1">→</span>
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>

            {/* Industry cards */}
            <div className="mt-8 grid gap-px bg-neutral-800 sm:grid-cols-2">
              {c.home.insights.industries.map((ind, i) => (
                <Link
                  key={ind.name}
                  href={ind.link}
                  className="group relative block overflow-hidden bg-neutral-100"
                >
                  <MediaImage
                    file={`industry-${i + 1}.jpg`}
                    alt={`${ind.name} facilities in the Gulf`}
                    aspect="21/9"
                    className="opacity-70 transition-[opacity,transform] duration-700 ease-out group-hover:scale-[1.03] group-hover:opacity-50"
                  />
                  <div className="absolute inset-0 flex items-end p-6">
                    <h3 className="display text-header-sm text-white">
                      <span className="mr-0 inline-block h-[2px] w-0 bg-forge align-middle transition-all duration-300 ease-out group-hover:mr-3 group-hover:w-6" aria-hidden="true" />
                      {ind.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ============ 6. SUPPLY LINE — dark tabs with accordions ============ */}
        <section className="grain bg-navy-deep py-fluid-6">
          <div className="rail">
            <Reveal>
              <h2 className="display max-w-[16ch] text-header text-white">{c.home.supplyLine.title}</h2>
              <p className="mt-4 max-w-[52ch] text-lg leading-relaxed text-gray-on-dark-2">
                {c.home.supplyLine.subtitle}
              </p>
            </Reveal>

            {/* Pillars */}
            <div className="mt-12 grid gap-8 border-t border-white/15 pt-10 md:grid-cols-3">
              {c.home.supplyLine.pillars.map((p, i) => (
                <Reveal key={p.title} delay={i * 90}>
                  <h3 className="display text-header-xs text-forge">{p.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-gray-on-dark-2">{p.body}</p>
                </Reveal>
              ))}
            </div>

            {/* Tabs + accordions */}
            <div className="mt-16">
              <SupplyLineTabs
                tabs={c.home.supplyLine.tabs.map((t, i) => ({
                  ...t,
                  mediaFile: SUPPLY_MEDIA[i] ?? `supply-${i + 1}.jpg`,
                  mediaExists: hasMedia(SUPPLY_MEDIA[i] ?? `supply-${i + 1}.jpg`),
                }))}
              />
            </div>
          </div>
        </section>

        {/* ============ 7. WHY — one-column statement, light ============ */}
        <section className="bg-white py-fluid-6 text-ink">
          <div className="rail">
            <Reveal>
              <h2 className="display max-w-[16ch] text-header">{c.home.why.title}</h2>
              <p className="mt-6 max-w-[54ch] text-lg leading-relaxed" style={{ color: "hsl(0 0% 30%)" }}>
                {c.home.why.body}
              </p>
              <Link href={c.home.why.ctaLink} className="btn btn--black-outline mt-8">
                {c.home.why.cta}
              </Link>
            </Reveal>
          </div>
        </section>

        {/* ============ 8. FOOTER CALLOUTS — three columns, yellow ============ */}
        <section className="bg-forge py-fluid-5 text-navy-deep">
          <div className="rail grid gap-10 md:grid-cols-3">
            {c.home.callouts.map((call, i) => (
              <Reveal key={call.title} delay={i * 90}>
                <div className="flex h-full flex-col border-t-2 border-navy-deep pt-6">
                  <h2 className="display text-header-xs">{call.title}</h2>
                  <p className="mt-3 flex-1 text-base leading-relaxed text-navy-deep/80">{call.body}</p>
                  <div className="mt-6">
                    {call.ctaLink.startsWith("tel:") ? (
                      <a href={call.ctaLink} className="btn btn--black-outline !min-w-0">
                        {call.cta}
                      </a>
                    ) : (
                      <Link href={call.ctaLink} className="btn btn--black-outline !min-w-0">
                        {call.cta}
                      </Link>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </main>
      <Footer content={c} />
    </>
  );
}
