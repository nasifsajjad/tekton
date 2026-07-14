"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

/**
 * Quote request form. Builds a prefilled mailto: message so it works with no
 * mail server or third-party form service; the client's email address is the
 * single point of delivery. Swap for an API-backed form later if needed.
 * Arriving with ?product=&category= (from a product dialog) prefills the
 * message so the enquiry names the exact catalogue line.
 */
export default function ContactForm({
  email,
  formTitle,
  formNote,
}: {
  email: string;
  formTitle: string;
  formNote: string;
}) {
  const params = useSearchParams();
  const product = params.get("product");
  const category = params.get("category");
  const [form, setForm] = useState({
    name: "",
    company: "",
    phone: "",
    message: product
      ? `Quote request for: ${product}${category ? ` (${category})` : ""}\n\nQuantity:\nPart number / specification:`
      : "",
  });

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = `Quote request — ${form.company || form.name}`;
    const body = [
      `Name: ${form.name}`,
      `Company: ${form.company}`,
      `Phone: ${form.phone}`,
      "",
      form.message,
    ].join("\n");
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  const inputClass =
    "mt-1.5 w-full border border-white/25 bg-white px-4 py-3 text-ink outline-none transition-colors placeholder:text-gray-on-light-2 focus:border-forge focus:ring-2 focus:ring-forge/30";

  return (
    <form onSubmit={handleSubmit} className="border border-white/15 bg-navy p-6 shadow-2xl shadow-black/10 sm:p-8">
      <h2 className="display text-header-xs text-white">{formTitle}</h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="eyebrow text-neutral-500">Name</span>
          <input type="text" required value={form.name} onChange={set("name")} className={inputClass} autoComplete="name" />
        </label>
        <label className="block">
          <span className="eyebrow text-neutral-500">Company</span>
          <input type="text" value={form.company} onChange={set("company")} className={inputClass} autoComplete="organization" />
        </label>
        <label className="block sm:col-span-2">
          <span className="eyebrow text-neutral-500">Phone</span>
          <input type="tel" value={form.phone} onChange={set("phone")} className={inputClass} autoComplete="tel" />
        </label>
        <label className="block sm:col-span-2">
          <span className="eyebrow text-neutral-500">What do you need?</span>
          <textarea
            required
            rows={5}
            value={form.message}
            onChange={set("message")}
            className={`${inputClass} resize-y`}
            placeholder="Part numbers, quantities, equipment make and model…"
          />
        </label>
      </div>
      <button type="submit" className="btn btn--primary mt-6">
        Send enquiry
      </button>
      <p className="mt-4 text-xs leading-relaxed text-neutral-500">{formNote}</p>
    </form>
  );
}
