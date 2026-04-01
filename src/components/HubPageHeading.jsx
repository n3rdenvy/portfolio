/**
 * Shared title block for Portfolio hub and Contact (Let's chat) — same grid column + spacing as the
 * two-column hub layout so headings share identical coordinates.
 */
export const HUB_PAGE_TWO_COL = 'lg:grid lg:grid-cols-2 lg:gap-x-10';

export default function HubPageHeading({ title, subtitle = null, className = '' }) {
  return (
    <header className={['hub-page-heading min-w-0', className].filter(Boolean).join(' ')}>
      <h1 className="page-heading-xl text-white">{title}</h1>
      {subtitle ? (
        <p className="mt-3 text-base leading-relaxed text-white md:mt-4 lg:mt-6">{subtitle}</p>
      ) : null}
    </header>
  );
}

/**
 * First row: heading lives in column 1 only; column 2 is reserved so the title aligns with
 * the left column of the 50/50 split below (matches Contact accordions spine).
 * `align="center"` spans both columns and centers the block (e.g. Portfolio hub above a 2-col card grid).
 */
export function HubPageHeadingRow({
  children,
  align = 'start',
  gridClassName = HUB_PAGE_TWO_COL,
}) {
  if (align === 'center') {
    return (
      <div className={['w-full', gridClassName].join(' ')}>
        <div className="flex min-w-0 flex-col items-center text-center lg:col-span-2">
          {children}
        </div>
      </div>
    );
  }
  return (
    <div className={['w-full', gridClassName].join(' ')}>
      <div className="min-w-0">{children}</div>
      <div className="hidden min-w-0 lg:block" aria-hidden />
    </div>
  );
}
