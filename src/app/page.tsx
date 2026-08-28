import Link from "next/link";
import { getContent } from "@/lib/content";
import { CATALOG_CATEGORY_IMAGES } from "@/lib/catalog";
import { MediaImage } from "@/components/Media";
import CategoryIcon from "@/components/CategoryIcon";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import IndustrialSequence from "@/components/IndustrialSequence";
import Reveal from "@/components/Reveal";
import SupplyLineTabs from "@/components/SupplyLineTabs";

const INDUSTRY_MEDIA: Record<string, string> = {
  "Oil & Gas": "industry-oil-gas.webp",
  "Power & Energy": "industry-power-energy.webp",
  "Water & Utilities": "industry-water-utilities.webp",
  Petrochemicals: "industry-petrochemicals.webp",
  "Aluminium & Steel": "industry-aluminium-steel.webp",
  "Cement & Construction": "industry-cement-construction.webp",
  "Food & Beverage": "industry-food-beverage.webp",
  "Marine & Offshore": "industry-marine-offshore.webp",
  "Railways & Transport": "industry-railways-transport.webp",
  "Mining & Minerals": "industry-mining-minerals.webp",
};
const INDUSTRY_FALLBACK_MEDIA = Object.values(INDUSTRY_MEDIA);

export default async function Home() {
  const c = await getContent();

  return (
    <>
      <Nav brandName={c.global.brand.name} cta={c.home.hero.ctaPrimary} />
      <main id="main-content">
        <IndustrialSequence alt={c.global.imageAlts?.sequence || undefined} />

        {/* Plant-wide product overview */}
        <section className="bg-surface py-fluid-6 text-ink">
          <div className="rail">
            <div>
              <Reveal>
                <h2 className="display max-w-[16ch] text-header">{c.home.platform.title}</h2>
                <p className="mt-6 max-w-[56ch] text-lg leading-relaxed text-gray-on-light">
                  {c.home.platform.body}
                </p>
              </Reveal>
            </div>

            <Reveal className="mt-14 border-t border-navy/15 pt-10">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <p className="eyebrow text-gray-on-light">Product overview</p>
                  <h3 className="display mt-3 text-header-sm">One route into every part of the plant.</h3>
                </div>
                <Link href={c.home.platform.ctaLink} className="btn btn--black-outline !min-w-0">
                  {c.home.platform.cta}
                </Link>
              </div>
            </Reveal>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {c.products.tabs.map((group, index) => {
                const first = group.categories[0];
                const image = first ? CATALOG_CATEGORY_IMAGES[first.name] : undefined;
                return (
                  <Reveal key={group.label} delay={index * 70} className="h-full">
                    <Link href="/products#catalogue" className="group flex h-full flex-col border border-navy/15 bg-white p-4 transition-colors hover:border-forge">
                      {image && (
                        <div className="relative aspect-[4/5] overflow-hidden bg-surface">
                          {/* Supplied product photography, not generated homepage art. */}
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={decodeURI(image)} alt="" className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" loading="lazy" decoding="async" />
                        </div>
                      )}
                      <div className="mt-4 flex items-start justify-between gap-3">
                        <div>
                          <span className="eyebrow text-gray-on-light">{String(index + 1).padStart(2, "0")}</span>
                          <h4 className="display mt-2 text-lg text-ink">{group.label}</h4>
                        </div>
                        {first && <CategoryIcon icon={first.icon} className="mt-1 size-5 shrink-0 text-forge-dark" />}
                      </div>
                      <p className="mt-3 text-xs leading-relaxed text-gray-on-light">{group.categories.map((category) => category.name).join(" · ")}</p>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
            <Link href={c.home.platform.ctaLink} className="btn btn--black-outline mt-8 w-full sm:hidden">
              {c.home.platform.cta}
            </Link>
          </div>
        </section>

        {/* Industries moved up and expanded to every key sector. */}
        <section className="grain bg-navy-deep py-fluid-6 text-white" aria-labelledby="industries-title">
          <div className="rail">
            <Reveal>
              <p className="eyebrow text-forge">Industries &amp; sectors</p>
              <h2 id="industries-title" className="display mt-3 max-w-[18ch] text-header">Supply experience across Gulf industry.</h2>
            </Reveal>
            <div className="mt-10 grid gap-px bg-white/15 sm:grid-cols-2 lg:grid-cols-5">
              {c.home.insights.industries.map((industry, index) => (
                <Reveal key={industry.name} delay={(index % 5) * 60} className="h-full">
                  <Link href={industry.link} className="group flex h-full flex-col bg-navy-deep transition-colors hover:bg-navy">
                    <div className="overflow-hidden bg-navy">
                      <MediaImage
                        file={INDUSTRY_MEDIA[industry.name] ?? INDUSTRY_FALLBACK_MEDIA[index % INDUSTRY_FALLBACK_MEDIA.length]}
                        alt={`${industry.name} industrial facilities in the Gulf`}
                        aspect="3/2"
                        className="transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                      />
                    </div>
                    <div className="flex min-h-28 flex-1 items-end justify-between gap-4 p-5">
                      <h3 className="display text-lg text-white">{industry.name}</h3>
                      <span className="eyebrow shrink-0 text-forge">{String(index + 1).padStart(2, "0")}</span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Genuine OEM documentation */}
        <section className="bg-white py-fluid-6 text-ink">
          <div className="rail grid items-center gap-12 lg:grid-cols-2">
            <Reveal className="lg:order-2">
              <h2 className="display max-w-[16ch] text-header">{c.home.trust.title}</h2>
              <p className="mt-6 max-w-[56ch] text-lg leading-relaxed text-gray-on-light">{c.home.trust.body}</p>
              <Link href={c.home.trust.ctaLink} className="btn btn--black-outline mt-8">{c.home.trust.cta}</Link>
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

        {c.home.featured && (
          <FeaturedCarousel title={c.home.featured.title} subtitle={c.home.featured.subtitle} slides={c.home.featured.slides} />
        )}

        {/* Insights follow sectors, as requested. */}
        <section className="border-t border-neutral-900 bg-white py-fluid-6 text-ink">
          <div className="rail">
            <Reveal><h2 className="display max-w-[20ch] text-header">{c.home.insights.title}</h2></Reveal>
            <div className="mt-10 grid gap-px bg-neutral-800 sm:grid-cols-2 lg:grid-cols-4">
              {c.home.insights.cards.map((card, index) => (
                <Reveal key={card.title} delay={index * 70} className="h-full">
                  <Link href={card.link} className="group flex h-full flex-col bg-white transition-colors hover:bg-surface">
                    <div className="overflow-hidden">
                      <MediaImage
                        file={`insight-${index + 1}.jpg`}
                        alt={card.title}
                        aspect="3/2"
                        className="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between p-6">
                      <div>
                        <span className="eyebrow text-forge-dark">{card.tag}</span>
                        <h3 className="display mt-3 text-header-xs group-hover:underline group-hover:underline-offset-4">{card.title}</h3>
                      </div>
                      <span className="mt-5 inline-flex text-sm font-semibold" aria-hidden="true">Explore →</span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Products / Services / Programs remain the core Supply Line. */}
        <section className="grain bg-navy-deep py-fluid-6">
          <div className="rail">
            <Reveal>
              <h2 className="display max-w-[16ch] text-header text-white">{c.home.supplyLine.title}</h2>
              <p className="mt-4 max-w-[52ch] text-lg leading-relaxed text-gray-on-dark-2">{c.home.supplyLine.subtitle}</p>
            </Reveal>
            <div className="mt-12 grid gap-8 border-t border-white/15 pt-10 md:grid-cols-3">
              {c.home.supplyLine.pillars.map((pillar, index) => (
                <Reveal key={pillar.title} delay={index * 90}>
                  <h3 className="display text-header-xs text-forge">{pillar.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-gray-on-dark-2">{pillar.body}</p>
                </Reveal>
              ))}
            </div>
            <div className="mt-16">
              <SupplyLineTabs tabs={c.home.supplyLine.tabs} />
            </div>
          </div>
        </section>

        <section className="bg-white py-fluid-6 text-ink">
          <div className="rail">
            <Reveal>
              <h2 className="display max-w-[16ch] text-header">{c.home.why.title}</h2>
              <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-gray-on-light">{c.home.why.body}</p>
              <Link href={c.home.why.ctaLink} className="btn btn--black-outline mt-8">{c.home.why.cta}</Link>
            </Reveal>
          </div>
        </section>

        <section className="bg-forge py-fluid-5 text-navy-deep">
          <div className="rail grid gap-10 md:grid-cols-3">
            {c.home.callouts.map((call, index) => (
              <Reveal key={call.title} delay={index * 90}>
                <div className="flex h-full flex-col border-t-2 border-navy-deep pt-6">
                  <h2 className="display text-header-xs">{call.title}</h2>
                  <p className="mt-3 flex-1 text-base leading-relaxed text-navy-deep/80">{call.body}</p>
                  <div className="mt-6">
                    {call.ctaLink.startsWith("tel:") ? (
                      <a href={call.ctaLink} className="btn btn--black-outline !min-w-0">{call.cta}</a>
                    ) : (
                      <Link href={call.ctaLink} className="btn btn--black-outline !min-w-0">{call.cta}</Link>
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
