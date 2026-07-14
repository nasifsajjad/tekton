import type { Metadata } from "next";
import Link from "next/link";
import { getContent } from "@/lib/content";
import { MediaImage } from "@/components/Media";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ProductTabs from "@/components/ProductTabs";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent();
  return {
    title: "Products",
    description: c.products.intro,
    alternates: { canonical: "/products" },
    openGraph: {
      title: `Products — ${c.global.brand.fullName}`,
      description: c.products.intro,
      url: "/products",
    },
  };
}

export default async function ProductsPage() {
  const c = await getContent();
  const allCategories = c.products.tabs.flatMap((t) => t.categories);
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${c.global.brand.fullName} — Product Categories`,
    numberOfItems: allCategories.length,
    itemListElement: allCategories.map((cat, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "ProductGroup",
        name: cat.name,
        description: cat.description,
      },
    })),
  };

  return (
    <>
      <Nav brandName={c.global.brand.name} cta={c.home.hero.ctaPrimary} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />
      <main id="main-content">
        {/* Page hero — dark */}
        <section className="grain relative overflow-hidden bg-navy-deep pt-44 pb-fluid-5">
          <div className="absolute inset-0">
            <MediaImage
              file="products-hero.jpg"
              alt="Rows of industrial valves and fittings in a supplier warehouse"
              aspect="21/9"
              className="h-full opacity-40"
              eager
            />
            <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/50 to-navy-deep" aria-hidden="true" />
          </div>
          <div className="rail relative z-10">
            <div className="hero-rise">
              <h1 className="display max-w-[14ch] text-header-lg text-white">{c.products.title}</h1>
            </div>
            <div className="hero-rise hero-rise-2">
              <p className="mt-6 max-w-[56ch] text-lg leading-relaxed text-gray-on-dark-2">
                {c.products.intro}
              </p>
            </div>
          </div>
        </section>

        {/* Tabs — light */}
        <section className="bg-white py-fluid-6 text-ink">
          <div className="rail">
            <ProductTabs tabs={c.products.tabs} quoteCta={c.products.dialogCta} search={c.products.search} />
          </div>
        </section>

        {/* CTA band — yellow */}
        <section className="bg-forge py-fluid-5 text-navy-deep">
          <div className="rail flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div>
              <h2 className="display max-w-[20ch] text-header-sm">{c.products.cta.title}</h2>
              <p className="mt-3 max-w-[56ch] text-base leading-relaxed text-navy-deep/80">
                {c.products.cta.body}
              </p>
            </div>
            <Link href="/contact" className="btn btn--black shrink-0">
              {c.products.cta.button}
            </Link>
          </div>
        </section>
      </main>
      <Footer content={c} />
    </>
  );
}
