"use client";

import Script from "next/script";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

/**
 * Quote request form submitted to the site's own API. A visible reCAPTCHA is
 * verified server-side before the API forwards the message by email, so the
 * visitor never leaves Tekton's website.
 * Arriving with ?product=&category= (from a product dialog) prefills the
 * message so the enquiry names the exact catalogue line.
 */
export default function ContactForm({
  formTitle,
  formNote,
  captchaSiteKey,
}: {
  formTitle: string;
  formNote: string;
  captchaSiteKey: string;
}) {
  const params = useSearchParams();
  const product = params.get("product");
  const category = params.get("category");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [captchaReady, setCaptchaReady] = useState(false);
  const captchaContainer = useRef<HTMLDivElement>(null);
  const captchaWidgetId = useRef<number | null>(null);
  const initialMessage = product
    ? `Quote request for: ${product}${category ? ` (${category})` : ""}\n\nQuantity:\nPart number / specification:`
    : "";

  const inputClass =
    "mt-1.5 w-full border border-white/25 bg-white px-4 py-3 text-ink outline-none transition-colors placeholder:text-gray-on-light-2 focus:border-forge focus:ring-2 focus:ring-forge/30";

  useEffect(() => {
    if (!captchaReady || !captchaSiteKey || !captchaContainer.current || !window.grecaptcha || captchaWidgetId.current !== null) return;
    captchaWidgetId.current = window.grecaptcha.render(captchaContainer.current, {
      sitekey: captchaSiteKey,
      theme: "dark",
    });
  }, [captchaReady, captchaSiteKey]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    if (!String(formData.get("g-recaptcha-response") ?? "")) {
      setStatus("error");
      setError("Please complete the reCAPTCHA checkbox before sending your enquiry.");
      return;
    }

    setStatus("sending");
    setError("");
    try {
      const response = await fetch("/api/contact", { method: "POST", body: formData });
      const result = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok) throw new Error(result.error || "The enquiry could not be sent.");

      form.reset();
      window.grecaptcha?.reset(captchaWidgetId.current ?? undefined);
      setStatus("success");
    } catch (submitError) {
      setStatus("error");
      setError(submitError instanceof Error ? submitError.message : "The enquiry could not be sent. Please try again.");
      window.grecaptcha?.reset(captchaWidgetId.current ?? undefined);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className="border border-white/15 bg-navy p-6 shadow-2xl shadow-black/10 sm:p-8"
    >
      <input
        type="text"
        name="_honey"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] size-px overflow-hidden"
      />
      <h2 className="display text-header-xs text-white">{formTitle}</h2>
      {status === "success" && (
        <p role="status" className="mt-5 border border-forge/60 bg-forge/10 px-4 py-3 text-sm leading-relaxed text-white">
          Thank you. Your enquiry has been sent to our sales team.
        </p>
      )}
      {status === "error" && (
        <p role="alert" className="mt-5 border border-red-300/60 bg-red-950/35 px-4 py-3 text-sm leading-relaxed text-white">
          {error}
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
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            className={`${inputClass} cursor-pointer file:mr-4 file:border-0 file:bg-navy-deep file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white`}
          />
        </label>
      </div>
      {captchaSiteKey ? (
        <>
          <Script src="https://www.google.com/recaptcha/api.js?render=explicit" strategy="afterInteractive" onReady={() => setCaptchaReady(true)} />
          <div className="mt-6 max-w-full overflow-x-auto">
            <div ref={captchaContainer} />
          </div>
        </>
      ) : (
        <p role="alert" className="mt-6 border border-forge/60 bg-forge/10 px-4 py-3 text-sm leading-relaxed text-white">
          Enquiries are temporarily unavailable while reCAPTCHA is being configured.
        </p>
      )}
      <button type="submit" disabled={!captchaSiteKey || status === "sending"} className="btn btn--primary mt-6 disabled:cursor-not-allowed disabled:opacity-55">
        {status === "sending" ? "Sending…" : "Send enquiry"}
      </button>
      {formNote && <p className="mt-4 text-xs leading-relaxed text-gray-on-dark-2">{formNote}</p>}
    </form>
  );
}

declare global {
  interface Window {
    grecaptcha?: {
      render: (container: HTMLElement, options: { sitekey: string; theme?: "dark" | "light" }) => number;
      reset: (widgetId?: number) => void;
    };
  }
}
