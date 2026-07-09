import { createHmac, timingSafeEqual } from "crypto";
import { cookies, headers } from "next/headers";

const COOKIE_NAME = "tekton_admin";
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

// In-memory login throttle keyed by client IP. Resets on process restart,
// which is acceptable for a single-admin brochure site.
const attempts = new Map<string, { count: number; first: number }>();

function adminPassword(): string | null {
  const pw = process.env.ADMIN_PASSWORD;
  if (pw && pw.length > 0) return pw;
  // Development fallback only. In production the editor stays locked
  // until ADMIN_PASSWORD is configured.
  if (process.env.NODE_ENV !== "production") return "tekton2026";
  return null;
}

function sessionToken(): string | null {
  const pw = adminPassword();
  if (!pw) return null;
  return createHmac("sha256", pw).update("tekton-admin-session-v1").digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

async function clientKey(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0].trim() ??
    h.get("x-real-ip") ??
    "local"
  );
}

export async function loginThrottled(): Promise<boolean> {
  const key = await clientKey();
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || now - entry.first > WINDOW_MS) return false;
  return entry.count >= MAX_ATTEMPTS;
}

export async function recordLoginAttempt(success: boolean): Promise<void> {
  const key = await clientKey();
  if (success) {
    attempts.delete(key);
    return;
  }
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || now - entry.first > WINDOW_MS) {
    attempts.set(key, { count: 1, first: now });
  } else {
    entry.count += 1;
  }
}

export function passwordConfigured(): boolean {
  return adminPassword() !== null;
}

export function verifyPassword(password: string): boolean {
  const pw = adminPassword();
  if (!pw) return false;
  return safeEqual(password, pw);
}

export async function createSession(): Promise<void> {
  const token = sessionToken();
  if (!token) return;
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function isAuthenticated(): Promise<boolean> {
  const expected = sessionToken();
  if (!expected) return false;
  const store = await cookies();
  const value = store.get(COOKIE_NAME)?.value;
  if (!value) return false;
  return safeEqual(value, expected);
}
