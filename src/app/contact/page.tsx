import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent();
  return {
    title: "Contact Us",
    description: c.contact.intro,
    alternates: { canonical: "/contact" },
    openGraph: {
      title: `Contact Us — ${c.global.brand.fullName}`,
      description: c.contact.intro,
      url: "/contact",
    },
  };
}

export default async function ContactPage() {
  const c = await getContent();
  const { contact } = c.global;

  return (
    <>
      <Nav brandName={c.global.brand.name} cta={c.home.hero.ctaPrimary} />
      <main id="main-content">
        <section className="bg-navy-deep pt-44 pb-fluid-6">
          <div className="rail">
            <Reveal>
              <h1 className="display max-w-[12ch] text-header-lg text-white">{c.contact.title}</h1>
              <p className="mt-6 max-w-[56ch] text-lg leading-relaxed text-gray-on-dark-2">
                {c.contact.intro}
              </p>
            </Reveal>

            <div className="mt-16 grid gap-12 lg:grid-cols-2">
              {/* Contact details */}
              <Reveal>
                <dl className="space-y-8">
                  <div className="border-t border-neutral-200 pt-6">
                    <dt className="eyebrow text-neutral-500">Phone</dt>
                    <dd className="mt-2">
                      <a
                        href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                        className="display text-header-sm text-white transition-colors hover:text-forge"
                      >
                        {contact.phone}
                      </a>
                    </dd>
                  </div>
                  <div className="border-t border-neutral-200 pt-6">
                    <dt className="eyebrow text-neutral-500">Email</dt>
                    <dd className="mt-2">
                      <a
                        href={`mailto:${contact.email}`}
                        className="display text-header-xs break-all text-white transition-colors hover:text-forge"
                      >
                        {contact.email}
                      </a>
                    </dd>
                  </div>
                  <div className="border-t border-neutral-200 pt-6">
                    <dt className="eyebrow text-neutral-500">Office</dt>
                    <dd className="mt-2 text-lg text-white">{contact.address}</dd>
                  </div>
                  <div className="border-t border-neutral-200 pt-6">
                    <dt className="eyebrow text-neutral-500">Working hours</dt>
                    <dd className="mt-2 text-lg text-white">{contact.hours}</dd>
                    <dd className="mt-2 text-sm text-gray-on-dark-2">{c.contact.responseNote}</dd>
                  </div>
                </dl>
              </Reveal>

              {/* Form */}
              <Reveal delay={120}>
                <ContactForm
                  email={contact.email}
                  formTitle={c.contact.formTitle}
                  formNote={c.contact.formNote}
                />
              </Reveal>
            </div>
          </div>
        </section>
      </main>
      <Footer content={c} />
    </>
  );
}
