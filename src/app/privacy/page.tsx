import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContent } from "@/lib/content";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Tekton Global Trading & Services handles information on this website.",
  alternates: { canonical: "/privacy" },
};

export default async function PrivacyPage() {
  const c = await getContent();
  if (!c.legal?.privacy) notFound();
  return <LegalPage content={c} page={c.legal.privacy} />;
}
