export default function BrandLogo({
  className = "h-12 w-auto",
  priority = false,
  light = false,
}: {
  className?: string;
  priority?: boolean;
  /** Render the complete supplied artwork in white on dark surfaces. */
  light?: boolean;
}) {
  return (
    // Losslessly optimized brand artwork (WebP, 1440x480). A plain image keeps
    // it cacheable and out of the JS bundle.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/tekton-header-footer.webp"
      alt="Tekton Global Industrial Trading & Services"
      className={`${className} ${light ? "brightness-0 invert" : ""}`}
      width="1440"
      height="480"
      loading={priority ? "eager" : "lazy"}
      decoding="async"
    />
  );
}
