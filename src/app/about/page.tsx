import type { Metadata } from "next";
import Link from "next/link";
import { getContent } from "@/lib/content";
import { MediaImage } from "@/components/Media";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import StatCounter from "@/components/StatCounter";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent();
  return {
    title: "About",
    description: c.about.intro,
    alternates: { canonical: "/about" },
    openGraph: {
      title: `About — ${c.global.brand.fullName}`,
      description: c.about.intro,
      url: "/about",
    },
  };
}

export default async function AboutPage() {
  const c = await getContent();

  return (
    <>
      <Nav brandName={c.global.brand.name} cta={c.home.hero.ctaPrimary} />
      <main id="main-content">
        <section className="grain bg-navy-deep pt-44 pb-fluid-6">
          <div className="rail">
            <div className="hero-rise">
              <h1 className="display max-w-[14ch] text-header-lg text-white">{c.about.title}</h1>
              <p className="mt-6 max-w-[56ch] text-lg leading-relaxed text-gray-on-dark-2">
                {c.about.intro}
              </p>
            </div>

            {/* Stats */}
            <div className="hero-rise hero-rise-2">
              <dl className="mt-16 grid grid-cols-2 gap-8 border-t border-neutral-200 pt-8 md:grid-cols-4">
                {c.about.stats.map((s) => (
                  <div key={s.label}>
                    <dd className="display text-header-sm text-forge"><StatCounter value={s.value} /></dd>
                    <dt className="mt-2 text-sm text-gray-on-dark-2">{s.label}</dt>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* Story — light */}
        <section className="bg-white py-fluid-6 text-ink">
          <div className="rail grid gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <div className="space-y-6">
                {c.about.paragraphs.map((p, i) => (
                  <p key={i} className="max-w-[64ch] text-lg leading-loose" style={{ color: "hsl(0 0% 25%)" }}>
                    {p}
                  </p>
                ))}
              </div>
            </Reveal>
            <Reveal delay={120} className="lg:col-span-5">
              <MediaImage
                file="about-facility.jpg"
                alt="Tekton warehouse and dispatch area in Bahrain"
                aspect="4/5"
              />
            </Reveal>
          </div>
        </section>

        {/* Values — dark */}
        <section className="grain bg-navy-deep py-fluid-6">
          <div className="rail">
            <Reveal>
              <h2 className="display max-w-[16ch] text-header text-white">How We Work</h2>
            </Reveal>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {c.about.values.map((v, i) => (
                <Reveal key={v.title} delay={i * 90}>
                  <div className="h-full border-t border-neutral-200 pt-6">
                    <h3 className="display text-header-xs text-forge">{v.title}</h3>
                    <p className="mt-3 text-base leading-relaxed text-gray-on-dark-2">{v.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <p className="mt-16 max-w-[60ch] border-t border-neutral-200 pt-6 text-sm leading-relaxed text-neutral-500">
              {c.about.note}
            </p>
          </div>
        </section>

        {/* CTA — yellow */}
        <section className="bg-forge py-fluid-5 text-navy-deep">
          <div className="rail flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <h2 className="display max-w-[20ch] text-header-sm">
              Put us on your next enquiry list.
            </h2>
            <Link href="/contact" className="btn btn--black-outline shrink-0">
              Contact sales
            </Link>
          </div>
        </section>
      </main>
      <Footer content={c} />
    </>
  );
}
