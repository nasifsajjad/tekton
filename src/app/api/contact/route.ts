import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_ATTACHMENT_BYTES = 8 * 1024 * 1024;
const ALLOWED_ATTACHMENT_TYPES = new Set(["application/pdf", "image/jpeg", "image/png", "image/webp"]);

export async function POST(request: NextRequest) {
  const captchaSecret = process.env.RECAPTCHA_SECRET_KEY;
  const captchaEnabled = Boolean(captchaSecret && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY);

  try {
    const incoming = await request.formData();
    if (String(incoming.get("_honey") ?? "")) {
      return NextResponse.json({ ok: true });
    }

    const name = String(incoming.get("name") ?? "").trim();
    const company = String(incoming.get("company") ?? "").trim();
    const email = String(incoming.get("email") ?? "").trim();
    const phone = String(incoming.get("phone") ?? "").trim();
    const message = String(incoming.get("message") ?? "").trim();
    const captchaToken = String(incoming.get("g-recaptcha-response") ?? "");

    if (!name || !company || !email || !message) {
      return NextResponse.json({ ok: false, error: "Please complete the required fields." }, { status: 400 });
    }
    if (!/^\S+@\S+\.\S+$/.test(email) || name.length > 120 || company.length > 160 || email.length > 254 || phone.length > 50 || message.length > 10000) {
      return NextResponse.json({ ok: false, error: "Please check the information you entered." }, { status: 400 });
    }
    if (captchaEnabled) {
      if (!captchaToken) {
        return NextResponse.json({ ok: false, error: "Please complete the reCAPTCHA checkbox." }, { status: 400 });
      }

      const verification = new URLSearchParams({ secret: captchaSecret!, response: captchaToken });
      const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
      if (forwardedFor) verification.set("remoteip", forwardedFor);

      const captchaResponse = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: verification,
        cache: "no-store",
      });
      const captchaResult = (await captchaResponse.json()) as { success?: boolean };
      if (!captchaResponse.ok || !captchaResult.success) {
        return NextResponse.json({ ok: false, error: "reCAPTCHA verification failed. Please try again." }, { status: 400 });
      }
    }

    const outbound = new FormData();
    outbound.set("name", name);
    outbound.set("company", company);
    outbound.set("email", email);
    outbound.set("phone", phone);
    outbound.set("message", message);
    outbound.set("_subject", "New quote request from tektonindustrial.com");
    outbound.set("_template", "table");
    outbound.set("_captcha", "false");
    outbound.set("_replyto", email);
    outbound.set("_url", new URL("/contact", request.nextUrl.origin).toString());

    const attachment = incoming.get("attachment");
    if (attachment instanceof File && attachment.size > 0) {
      if (attachment.size > MAX_ATTACHMENT_BYTES) {
        return NextResponse.json({ ok: false, error: "Attachments must be smaller than 8 MB." }, { status: 400 });
      }
      if (!ALLOWED_ATTACHMENT_TYPES.has(attachment.type)) {
        return NextResponse.json({ ok: false, error: "Attach a PDF, JPG, PNG or WebP file." }, { status: 400 });
      }
      outbound.set("attachment", attachment, attachment.name);
    }

    const recipient = process.env.CONTACT_FORM_RECIPIENT?.trim();
    if (!recipient) {
      return NextResponse.json({ ok: false, error: "The enquiry recipient is not configured yet." }, { status: 503 });
    }
    const deliveryResponse = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipient)}`, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: outbound,
      cache: "no-store",
    });
    const deliveryResult = (await deliveryResponse.json().catch(() => null)) as { success?: boolean; message?: string } | null;
    if (!deliveryResponse.ok || deliveryResult?.success === false) {
      return NextResponse.json({ ok: false, error: "The enquiry could not be delivered. Please try again." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "The enquiry could not be sent. Please try again." }, { status: 500 });
  }
}
