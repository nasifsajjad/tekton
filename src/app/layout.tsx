import type { Metadata } from "next";
import { Archivo, Inter } from "next/font/google";
import { getContent } from "@/lib/content";
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

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent();
  const title = `${c.global.brand.fullName} — ${c.global.brand.tagline}`;
  const description = c.home.hero.subtitle;
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
      images: [{ url: "/media/og-image.jpg", width: 1200, height: 630 }],
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
    "@type": "Organization",
    name: c.global.brand.fullName,
    url: SITE_URL,
    email: c.global.contact.email,
    telephone: c.global.contact.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Manama",
      addressCountry: "BH",
    },
    description: c.home.hero.subtitle,
  };

  return (
    <html lang="en" className={`${archivo.variable} ${inter.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }}
        />
        {children}
      </body>
    </html>
  );
}
