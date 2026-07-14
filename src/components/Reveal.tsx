/**
 * Structural reveal wrapper. Content is visible in the server response so
 * headings and media remain immediate LCP candidates without hydration work.
 */
export default function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return <div className={className}>{children}</div>;
}
