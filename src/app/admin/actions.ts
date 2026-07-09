"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { saveContentToDisk, type SiteContent } from "@/lib/content";
import {
  createSession,
  destroySession,
  isAuthenticated,
  loginThrottled,
  passwordConfigured,
  recordLoginAttempt,
  verifyPassword,
} from "@/lib/auth";

const PUBLIC_PATHS = ["/", "/products", "/about", "/contact"];

export async function login(
  _prevState: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  if (!passwordConfigured()) {
    return { error: "Editor is locked: set ADMIN_PASSWORD on the server first." };
  }
  if (await loginThrottled()) {
    return { error: "Too many attempts. Try again in 15 minutes." };
  }
  const password = String(formData.get("password") ?? "");
  const ok = verifyPassword(password);
  await recordLoginAttempt(ok);
  if (!ok) {
    return { error: "Incorrect password." };
  }
  await createSession();
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/admin");
}

export async function saveContent(
  content: SiteContent
): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAuthenticated())) {
    return { ok: false, error: "Session expired. Please log in again." };
  }
  try {
    await saveContentToDisk(content);
  } catch (err) {
    return {
      ok: false,
      error: `Could not save: ${err instanceof Error ? err.message : "unknown error"}`,
    };
  }
  for (const p of PUBLIC_PATHS) revalidatePath(p);
  revalidatePath("/admin");
  return { ok: true };
}
