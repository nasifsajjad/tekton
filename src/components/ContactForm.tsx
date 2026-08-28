"use client";

import { useSearchParams } from "next/navigation";

/**
 * Quote request form delivered by FormSubmit. Its hosted reCAPTCHA remains on,
 * and a honeypot provides a second lightweight spam filter.
 * Arriving with ?product=&category= (from a product dialog) prefills the
 * message so the enquiry names the exact catalogue line.
 */
export default function ContactForm({
  email,
  formTitle,
  formNote,
  successUrl,
}: {
  email: string;
  formTitle: string;
  formNote: string;
  successUrl: string;
}) {
  const params = useSearchParams();
  const product = params.get("product");
  const category = params.get("category");
  const submitted = params.get("submitted") === "true";
  const initialMessage = product
    ? `Quote request for: ${product}${category ? ` (${category})` : ""}\n\nQuantity:\nPart number / specification:`
    : "";

  const inputClass =
    "mt-1.5 w-full border border-white/25 bg-white px-4 py-3 text-ink outline-none transition-colors placeholder:text-gray-on-light-2 focus:border-forge focus:ring-2 focus:ring-forge/30";

  return (
    <form
      action={`https://formsubmit.co/${email}`}
      method="POST"
      encType="multipart/form-data"
      className="border border-white/15 bg-navy p-6 shadow-2xl shadow-black/10 sm:p-8"
    >
      <input type="hidden" name="_subject" value="New quote request from tektonindustrial.com" />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="_captcha" value="true" />
      <input type="hidden" name="_next" value={successUrl} />
      <input
        type="text"
        name="_honey"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] size-px overflow-hidden"
      />
      <h2 className="display text-header-xs text-white">{formTitle}</h2>
      {submitted && (
        <p role="status" className="mt-5 border border-forge/60 bg-forge/10 px-4 py-3 text-sm leading-relaxed text-white">
          Thank you. Your enquiry has been sent to our sales team.
        </p>
      )}
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="eyebrow text-gray-on-dark-2">Name</span>
          <input type="text" name="name" required className={inputClass} autoComplete="name" />
        </label>
        <label className="block">
          <span className="eyebrow text-gray-on-dark-2">Company</span>
          <input type="text" name="company" className={inputClass} autoComplete="organization" />
        </label>
        <label className="block">
          <span className="eyebrow text-gray-on-dark-2">Email</span>
          <input type="email" name="email" required className={inputClass} autoComplete="email" />
        </label>
        <label className="block">
          <span className="eyebrow text-gray-on-dark-2">Phone</span>
          <input type="tel" name="phone" className={inputClass} autoComplete="tel" />
        </label>
        <label className="block sm:col-span-2">
          <span className="eyebrow text-gray-on-dark-2">What do you need?</span>
          <textarea
            name="message"
            required
            rows={5}
            defaultValue={initialMessage}
            className={`${inputClass} resize-y`}
            placeholder="Part numbers, quantities, equipment make and model…"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="eyebrow text-gray-on-dark-2">Photo or drawing (optional)</span>
          <input
            type="file"
            name="attachment"
            accept="image/*,.pdf"
            className={`${inputClass} cursor-pointer file:mr-4 file:border-0 file:bg-navy-deep file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white`}
          />
        </label>
      </div>
      <button type="submit" className="btn btn--primary mt-6">
        Send enquiry
      </button>
      <p className="mt-4 text-xs leading-relaxed text-gray-on-dark-2">{formNote}</p>
    </form>
  );
}
