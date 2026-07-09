"use client";

/**
 * Client-side media slot for use inside client components (tabs, sliders).
 * Whether the file exists is decided on the server and passed down, since
 * client components cannot touch the filesystem.
 */
export function MediaSlot({
  file,
  exists,
  alt,
  aspect,
  dark = false,
  className = "",
}: {
  file: string;
  exists: boolean;
  alt: string;
  aspect: string;
  dark?: boolean;
  className?: string;
}) {
  if (exists) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`/media/${file}`}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`w-full object-cover ${className}`}
        style={{ aspectRatio: aspect }}
      />
    );
  }
  return (
    <div
      role="img"
      aria-label={alt}
      className={`relative w-full overflow-hidden ${dark ? "bg-neutral-100" : "bg-neutral-950"} ${className}`}
      style={{
        aspectRatio: aspect,
        backgroundImage: `repeating-linear-gradient(-45deg, transparent 0 22px, ${
          dark ? "hsl(0 0% 14%)" : "hsl(0 0% 88%)"
        } 22px 24px)`,
      }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
        <span className="inline-block size-3 bg-forge" aria-hidden="true" />
        <span className={`font-mono text-xs ${dark ? "text-neutral-500" : "text-neutral-400"}`}>
          media/{file}
        </span>
        <span className={`text-[11px] tracking-widest uppercase ${dark ? "text-neutral-400" : "text-neutral-500"}`}>
          {aspect.replace("/", ":")}
        </span>
      </div>
    </div>
  );
}
