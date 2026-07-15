"use server";

import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  listBackupsFromDisk,
  readBackupFromDisk,
  saveContentToDisk,
  type BackupInfo,
  type SiteContent,
} from "@/lib/content";
import { MEDIA_SLOTS } from "@/lib/mediaSlots";
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

const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;

/**
 * Replace one of the site's image slots. The upload is re-encoded server-side
 * (EXIF rotation applied, resized to a sane ceiling, converted to the format
 * the site serves), so editors can upload any image straight from a phone.
 */
export async function uploadMedia(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAuthenticated())) {
    return { ok: false, error: "Session expired. Please log in again." };
  }
  const slot = String(formData.get("slot") ?? "");
  const file = formData.get("file");
  if (!MEDIA_SLOTS.some((s) => s.file === slot)) {
    return { ok: false, error: "Unknown image slot." };
  }
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "No file received." };
  }
  if (!file.type.startsWith("image/")) {
    return { ok: false, error: "Please upload an image file." };
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return { ok: false, error: "Image is larger than 12MB. Please use a smaller file." };
  }

  try {
    const input = Buffer.from(await file.arrayBuffer());
    if (slot === "brand-logo") {
      // Logo keeps transparency and full quality; sized for header/footer use.
      const out = await sharp(input).rotate().resize({ width: 1440, withoutEnlargement: true }).webp({ lossless: true, effort: 6 }).toBuffer();
      await fs.writeFile(path.join(process.cwd(), "public", "brand", "tekton-header-footer.webp"), out);
    } else if (slot === "og-image.jpg") {
      // Social preview has a fixed spec.
      const out = await sharp(input).rotate().resize({ width: 1200, height: 630, fit: "cover" }).jpeg({ quality: 85 }).toBuffer();
      await fs.writeFile(path.join(process.cwd(), "public", "media", slot), out);
    } else {
      const out = await sharp(input).rotate().resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true }).jpeg({ quality: 85 }).toBuffer();
      await fs.writeFile(path.join(process.cwd(), "public", "media", slot), out);
    }
  } catch (err) {
    return {
      ok: false,
      error: `Could not process the image: ${err instanceof Error ? err.message : "unknown error"}`,
    };
  }

  for (const p of PUBLIC_PATHS) revalidatePath(p);
  return { ok: true };
}

export async function listBackups(): Promise<{ ok: boolean; backups: BackupInfo[]; error?: string }> {
  if (!(await isAuthenticated())) {
    return { ok: false, backups: [], error: "Session expired. Please log in again." };
  }
  return { ok: true, backups: await listBackupsFromDisk() };
}

/**
 * Publish an earlier snapshot. The content being replaced is snapshotted
 * first (inside saveContentToDisk), so a restore can itself be undone.
 */
export async function restoreBackup(
  file: string
): Promise<{ ok: boolean; content?: SiteContent; error?: string }> {
  if (!(await isAuthenticated())) {
    return { ok: false, error: "Session expired. Please log in again." };
  }
  try {
    const content = await readBackupFromDisk(file);
    await saveContentToDisk(content);
    for (const p of PUBLIC_PATHS) revalidatePath(p);
    revalidatePath("/admin");
    return { ok: true, content };
  } catch (err) {
    return {
      ok: false,
      error: `Could not restore: ${err instanceof Error ? err.message : "unknown error"}`,
    };
  }
}
