const MAX_WIDTH = {
  compact: 'max-w-2xl',
  narrow: 'max-w-3xl',
  process: 'max-w-5xl',
  wide: 'max-w-6xl',
};

/**
 * Pearl layout: shared inset + max-width column aligned with hub wings.
 */
export default function PageShell({ children, width = 'wide' }) {
  return (
    <div className="min-h-[100svh] px-4 pb-28 pt-20 md:px-8 md:pb-32 md:pt-24">
      <div className={`mx-auto w-full text-textPrimary ${MAX_WIDTH[width]}`}>{children}</div>
    </div>
  );
}
