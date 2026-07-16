import Link from "next/link";
import { getContent } from "@/lib/content";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default async function NotFound() {
  const c = await getContent();
  return (
    <>
      <Nav brandName={c.global.brand.name} cta={c.home.hero.ctaPrimary} />
      <main id="main-content">
        <section className="grain flex min-h-svh flex-col justify-center bg-navy-deep pt-32 pb-fluid-6">
          <div className="rail">
            <p className="eyebrow text-forge">Error 404</p>
            <h1 className="display mt-3 max-w-[16ch] text-header-lg text-white">
              This page has left the warehouse.
            </h1>
            <p className="mt-6 max-w-[54ch] text-lg leading-relaxed text-gray-on-dark-2">
              The address may have changed or never existed. Everything we stock is one click away.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/" className="btn btn--primary">Back to home</Link>
              <Link href="/products" className="btn btn--white-outline">Browse products</Link>
              <Link href="/contact" className="btn btn--white-outline">Contact us</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer content={c} />
    </>
  );
}
