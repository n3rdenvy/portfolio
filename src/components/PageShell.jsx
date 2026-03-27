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
    <div className="flex min-h-[100svh] min-w-[320px] flex-col px-4 pb-28 pt-[max(0.5rem,env(safe-area-inset-top,0px))] md:px-8 md:pb-32 md:pt-24">
      <div
        className={`mx-auto flex w-full min-h-0 min-w-[320px] max-w-full flex-1 flex-col text-white ${MAX_WIDTH[width]}`}
      >
        {children}
      </div>
    </div>
  );
}
