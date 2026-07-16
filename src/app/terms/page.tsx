import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContent } from "@/lib/content";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms that govern use of the Tekton Global Trading & Services website.",
  alternates: { canonical: "/terms" },
};

export default async function TermsPage() {
  const c = await getContent();
  if (!c.legal?.terms) notFound();
  return <LegalPage content={c} page={c.legal.terms} />;
}
