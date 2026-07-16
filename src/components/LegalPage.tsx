import type { SiteContent, LegalPage as LegalPageContent } from "@/lib/content";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";

/** Shared renderer for the privacy-policy and terms-of-use pages. */
export default function LegalPage({
  content,
  page,
}: {
  content: SiteContent;
  page: LegalPageContent;
}) {
  return (
    <>
      <Nav brandName={content.global.brand.name} cta={content.home.hero.ctaPrimary} />
      <main id="main-content">
        <section className="grain bg-navy-deep pt-44 pb-fluid-5">
          <div className="rail">
            <div className="hero-rise">
              <h1 className="display max-w-[16ch] text-header-lg text-white">{page.title}</h1>
              <p className="mt-4 text-sm text-gray-on-dark-2">Last updated: {page.updated}</p>
            </div>
          </div>
        </section>

        <section className="bg-white py-fluid-6 text-ink">
          <div className="rail max-w-3xl">
            {page.sections.map((section) => (
              <Reveal key={section.heading} className="mt-10 first:mt-0">
                <h2 className="display text-header-xs">{section.heading}</h2>
                <p className="mt-3 max-w-[70ch] text-base leading-relaxed" style={{ color: "hsl(0 0% 28%)" }}>
                  {section.body}
                </p>
              </Reveal>
            ))}
          </div>
        </section>
      </main>
      <Footer content={content} />
    </>
  );
}
