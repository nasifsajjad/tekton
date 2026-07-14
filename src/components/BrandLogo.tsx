export default function BrandLogo({
  className = "h-14 w-auto",
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    // The supplied SVG is the canonical brand artwork. A plain image keeps it
    // cacheable and prevents the large embedded artwork from entering JS.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/tekton-logo.svg"
      alt="Tekton Global Industrial Trading & Services"
      className={className}
      width="1500"
      height="1500"
      loading={priority ? "eager" : "lazy"}
      decoding="async"
    />
  );
}
