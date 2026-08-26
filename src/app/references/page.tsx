import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import ReferenceSearch, { type ReferenceRecord } from "@/components/ReferenceSearch";
import { getCatalogBrands } from "@/lib/catalog";
import { getContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Product Reference Database",
  description: "Search Tekton product categories, manufacturer brands, product terms and stored part-number references.",
  alternates: { canonical: "/references" },
};

export default async function ReferencesPage() {
  const c = await getContent();
  const generated: ReferenceRecord[] = c.products.tabs.flatMap((tab) =>
    tab.categories.map((category) => ({
      group: tab.label,
      category: category.name,
      description: category.description,
      products: category.products,
      brands: getCatalogBrands(category.name, category.icon),
      partNumbers: [],
      keywords: [tab.label, category.icon],
    })),
  );
  const manual: ReferenceRecord[] = (c.products.referenceEntries ?? []).map((entry) => ({
    group: "Stored reference",
    category: entry.category || entry.product || entry.partNumber || "Product reference",
    description: entry.notes,
    products: entry.product ? [entry.product] : [],
    brands: entry.brand ? [entry.brand] : [],
    partNumbers: entry.partNumber ? [entry.partNumber] : [],
    keywords: entry.keywords.split(",").map((keyword) => keyword.trim()).filter(Boolean),
  }));
  const records = [...generated, ...manual];

  return (
    <>
      <Nav brandName={c.global.brand.name} cta={c.home.hero.ctaPrimary} />
      <main id="main-content">
        <section className="grain bg-navy-deep pt-44 pb-fluid-5 text-white">
          <div className="rail">
            <p className="eyebrow text-forge">Product intelligence</p>
            <h1 className="display mt-3 max-w-[15ch] text-header-lg">Reference Database</h1>
            <p className="mt-6 max-w-[64ch] text-lg leading-relaxed text-gray-on-dark-2">
              Search manufacturer names, product terms, catalogue groups and stored part numbers from one expandable source.
            </p>
          </div>
        </section>
        <section className="bg-white py-fluid-6 text-ink">
          <div className="rail"><ReferenceSearch records={records} /></div>
        </section>
      </main>
      <Footer content={c} />
    </>
  );
}
