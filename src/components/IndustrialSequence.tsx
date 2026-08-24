"use client";

/**
 * Homepage operational hero. The supplied 4K MP4 is served unchanged,
 * preserving source quality while native playback buffers progressively.
 */
export default function IndustrialSequence({
  alt = "Industrial operations in motion",
}: {
  alt?: string;
}) {
  return (
    <section className="industrial-sequence" aria-labelledby="industry-sequence-title">
      <video
        className="industrial-sequence__video absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={alt}
      >
        <source src="/media/industrial-hero.mp4" type="video/mp4" />
      </video>

      <div className="industrial-sequence__shade" aria-hidden="true" />
      <div className="industrial-sequence__content rail">
        <p className="eyebrow text-forge">Tekton operational sequence</p>
        <h2 id="industry-sequence-title" className="display mt-3 max-w-[11ch] text-header-lg text-white sm:text-header-xl">
          Keep the industry moving.
        </h2>
        <p className="mt-4 max-w-[44ch] text-base leading-relaxed text-gray-on-dark-2 sm:text-lg">
          From a single rotating bearing to a fully operational plant, every component has a role to play.
        </p>
      </div>
    </section>
  );
}
