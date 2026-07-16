import { existsSync, statSync } from "fs";
import path from "path";
import Image from "next/image";

function mediaExists(file: string): boolean {
  return existsSync(path.join(process.cwd(), "public", "media", file));
}

/**
 * Cache-busting version derived from the file's mtime. When the CMS replaces
 * an image (same filename), the URL changes and visitors get the new file
 * immediately instead of waiting out the CDN/browser cache.
 */
export function mediaVersion(file: string): string {
  try {
    return Math.round(statSync(path.join(process.cwd(), "public", "media", file)).mtimeMs).toString(36);
  } catch {
    return "0";
  }
}

/**
 * Image slot backed by /public/media/<file>. Renders the real image once the
 * file is uploaded; until then it shows a branded placeholder naming the file
 * so the client knows exactly what to drop in. Aspect ratio is reserved either
 * way, so uploading media never shifts the layout.
 */
export function MediaImage({
  file,
  alt,
  aspect,
  className = "",
  eager = false,
}: {
  file: string;
  alt: string;
  aspect: string; // e.g. "4/3"
  className?: string;
  eager?: boolean;
}) {
  if (mediaExists(file)) {
    return (
      <Image
        src={`/media/${file}?v=${mediaVersion(file)}`}
        alt={alt}
        width={1600}
        height={1000}
        priority={eager}
        sizes="(min-width: 1024px) 50vw, 100vw"
        quality={82}
        className={`w-full object-cover ${className}`}
        style={{ aspectRatio: aspect }}
      />
    );
  }
  return (
    <div
      role="img"
      aria-label={alt}
      className={`relative w-full overflow-hidden bg-neutral-100 ${className}`}
      style={{
        aspectRatio: aspect,
        backgroundImage:
          "repeating-linear-gradient(-45deg, transparent 0 22px, hsl(0 0% 14%) 22px 24px)",
      }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
        <span className="inline-block size-3 bg-forge" aria-hidden="true" />
        <span className="font-mono text-xs text-neutral-500">media/{file}</span>
        <span className="text-[11px] tracking-widest text-neutral-400 uppercase">
          {aspect.replace("/", ":")}
        </span>
      </div>
    </div>
  );
}

/** True if /public/media/<file> exists — used for the hero video slot. */
export function hasMedia(file: string): boolean {
  return mediaExists(file);
}

/** True if a site-absolute public path (e.g. /brand/partners/senko.webp)
 *  exists on disk. Server-side only. */
export function publicFileExists(sitePath: string): boolean {
  if (!sitePath.startsWith("/") || sitePath.includes("..")) return false;
  return existsSync(path.join(process.cwd(), "public", ...sitePath.slice(1).split("/")));
}
