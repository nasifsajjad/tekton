/**
 * The Tekton T-mark from the favicon: a solid square with the T glyph
 * knocked out. Colors are passed in so the mark reads correctly on
 * yellow (nav) and black (footer) surfaces alike.
 */
export default function LogoMark({
  square,
  glyph,
  className = "size-5",
}: {
  square: string;
  glyph: string;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" style={{ fill: square }} />
      <path d="M14 16h36v10H38v22H26V26H14z" style={{ fill: glyph }} />
    </svg>
  );
}
