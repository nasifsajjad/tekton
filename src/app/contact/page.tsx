import type { Metadata } from "next";
import { Suspense } from "react";
import { getContent } from "@/lib/content";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import WhatsAppButton from "@/components/WhatsAppButton";

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
        <section className="grain bg-navy-deep pt-44 pb-fluid-5">
          <div className="rail">
            <div className="hero-rise">
              <h1 className="display max-w-[12ch] text-header-lg text-white">{c.contact.title}</h1>
              <p className="mt-6 max-w-[56ch] text-lg leading-relaxed text-gray-on-dark-2">
                {c.contact.intro}
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white py-fluid-6 text-ink">
          <div className="rail">
            <div className="grid gap-12 lg:grid-cols-2">
              {/* Contact details */}
              <Reveal>
                <dl className="space-y-8">
                  <div className="border-t border-neutral-800 pt-6">
                    <dt className="eyebrow text-gray-on-light">Phone</dt>
                    <dd className="mt-2">
                      <a
                        href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                        className="display text-header-sm text-ink transition-colors hover:text-forge-dark"
                      >
                        {contact.phone}
                      </a>
                    </dd>
                    <dd className="mt-4">
                      <Suspense>
                        <WhatsAppButton
                          number={contact.whatsapp}
                          label={c.contact.whatsappLabel}
                          greeting={c.contact.whatsappGreeting}
                        />
                      </Suspense>
                    </dd>
                  </div>
                  <div className="border-t border-neutral-800 pt-6">
                    <dt className="eyebrow text-gray-on-light">Email</dt>
                    <dd className="mt-2">
                      <a
                        href={`mailto:${contact.email}`}
                        className="display text-header-xs break-all text-ink transition-colors hover:text-forge-dark"
                      >
                        {contact.email}
                      </a>
                    </dd>
                  </div>
                  <div className="border-t border-neutral-800 pt-6">
                    <dt className="eyebrow text-gray-on-light">Office</dt>
                    <dd className="mt-2 text-lg text-ink">{contact.address}</dd>
                  </div>
                  <div className="border-t border-neutral-800 pt-6">
                    <dt className="eyebrow text-gray-on-light">Working hours</dt>
                    <dd className="mt-2 text-lg text-ink">{contact.hours}</dd>
                    <dd className="mt-2 text-sm text-gray-on-light">{c.contact.responseNote}</dd>
                  </div>
                </dl>
              </Reveal>

              {/* Form */}
              <Reveal delay={120}>
                <Suspense>
                  <ContactForm
                    email={contact.email}
                    formTitle={c.contact.formTitle}
                    formNote={c.contact.formNote}
                  />
                </Suspense>
              </Reveal>
            </div>
          </div>
        </section>
      </main>
      <Footer content={c} />
    </>
  );
}
