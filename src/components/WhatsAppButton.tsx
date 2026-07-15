"use client";

import { useSearchParams } from "next/navigation";

/**
 * One-click WhatsApp chat link. Number comes from the CMS (any format —
 * non-digits are stripped for wa.me). When the visitor arrives from a
 * product dialog (?product=&category=), the opening message is prefilled
 * with that product so the enquiry lands ready to answer.
 */
export default function WhatsAppButton({
  number,
  label,
  greeting,
}: {
  number: string;
  label: string;
  greeting: string;
}) {
  const params = useSearchParams();
  const digits = number.replace(/\D/g, "");
  if (!digits) return null;

  const product = params.get("product");
  const category = params.get("category");
  const text = product
    ? `${greeting} Product: ${product}${category ? ` (${category})` : ""}.`
    : greeting;

  return (
    <a
      href={`https://wa.me/${digits}?text=${encodeURIComponent(text)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="btn mt-2 !min-w-0 border-2 !border-[#25D366] bg-[#25D366] text-navy-deep transition-colors hover:bg-transparent hover:text-ink"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-5">
        <path d="M12 2a9.9 9.9 0 0 0-8.55 15L2 22l5.15-1.35A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.06.8.82-2.98-.2-.31A8.2 8.2 0 1 1 12 20.2Zm4.5-6.13c-.25-.12-1.47-.72-1.69-.8-.23-.09-.4-.13-.56.12-.17.25-.64.8-.79.97-.14.17-.29.19-.54.06a6.7 6.7 0 0 1-1.97-1.21 7.4 7.4 0 0 1-1.36-1.7c-.14-.24-.02-.37.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.25-.42.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42h-.48c-.17 0-.44.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.57.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.6.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29Z" />
      </svg>
      {label}
    </a>
  );
}
