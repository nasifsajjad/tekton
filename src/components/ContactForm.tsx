"use client";

import { useState } from "react";

/**
 * Quote request form. Builds a prefilled mailto: message so it works with no
 * mail server or third-party form service; the client's email address is the
 * single point of delivery. Swap for an API-backed form later if needed.
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
  const [form, setForm] = useState({
    name: "",
    company: "",
    phone: "",
    message: "",
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
    "mt-1.5 w-full border-2 border-neutral-300 bg-neutral-100 px-4 py-3 text-white outline-none transition-colors focus:border-forge";

  return (
    <form onSubmit={handleSubmit} className="border border-neutral-200 bg-neutral-100 p-6 sm:p-8">
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
