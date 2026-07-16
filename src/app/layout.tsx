import type { Metadata, Viewport } from "next";
import { Archivo, Inter } from "next/font/google";
import { getContent } from "@/lib/content";
import { mediaVersion } from "@/components/Media";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tektonindustrial.com";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f9a03c",
};

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent();
  const title = c.seo?.home?.title || `${c.global.brand.fullName} — ${c.global.brand.tagline}`;
  const description = c.seo?.home?.description || c.home.hero.subtitle;
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: `%s — ${c.global.brand.fullName}`,
    },
    description,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      siteName: c.global.brand.fullName,
      title,
      description,
      url: "/",
      images: [{ url: `/media/og-image.jpg?v=${mediaVersion("og-image.jpg")}`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon: "/brand/tekton-mark.png",
      shortcut: "/brand/tekton-mark.png",
      apple: "/brand/tekton-mark.png",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const c = await getContent();
  const org = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    name: c.global.brand.fullName,
    url: SITE_URL,
    email: c.global.contact.email,
    telephone: c.global.contact.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: c.global.contact.address,
      addressLocality: c.global.contact.location || "Manama",
      addressCountry: "BH",
    },
    openingHours: c.global.contact.hours,
    description: c.home.hero.subtitle,
  };
  const analytics = c.global.analytics;

  return (
    <html lang="en" className={`${archivo.variable} ${inter.variable}`}>
      <body>
        <a href="#main-content" className="fixed top-3 left-3 z-[200] -translate-y-20 bg-forge px-4 py-3 font-bold text-navy-deep transition-transform focus:translate-y-0">
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }}
        />
        {children}
        <FloatingWhatsApp
          number={c.global.contact.whatsapp}
          greeting={c.contact.whatsappGreeting}
          label={c.contact.whatsappLabel}
        />
        {analytics?.scriptSrc && (
          <script
            defer
            src={analytics.scriptSrc}
            data-website-id={analytics.websiteId || undefined}
            data-domain={analytics.websiteId || undefined}
          />
        )}
      </body>
    </html>
  );
}
