import { Home } from 'lucide-react';
import { Fragment, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { FIXED_NAV_PORTAL_ID } from '../utils/fixedNavPortal';
import { hubEnterStateForPath, markPageLeavingToHub } from '../utils/pageTransitions';

/**
 * @param {{ mobileLayout?: 'bar' | 'pill-end' }} props
 * `pill-end` — below `md`, top strip with Home as a trailing pill. `md+`: corner anchor (same as `.site-fixed-nav-tl`).
 */
export default function ReturnToHub({ mobileLayout = 'bar' }) {
  const { pathname } = useLocation();
  const [root, setRoot] = useState(null);

  useLayoutEffect(() => {
    setRoot(document.getElementById(FIXED_NAV_PORTAL_ID));
  }, []);

  if (pathname === '/') {
    return null;
  }

  const pillEnd = mobileLayout === 'pill-end';

  const linkClass = pillEnd
    ? [
        'return-to-hub-link site-fixed-nav-tl btn-theme flex shrink-0 items-center gap-2 no-underline',
        'px-4 py-2.5 text-xs font-semibold tracking-tight md:text-sm',
        'max-md:min-h-10 max-md:w-fit max-md:rounded-full max-md:border max-md:border-white/15 max-md:bg-slateBg/92',
        'max-md:px-3 max-md:py-1.5 max-md:shadow-[0_8px_30px_rgba(0,0,0,0.35)] max-md:backdrop-blur-md',
      ].join(' ')
    : 'return-to-hub-link site-fixed-nav-tl btn-theme flex w-fit shrink-0 items-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-tight no-underline md:text-sm';

  const nav = (
    <nav
      className={
        pillEnd
          ? 'pointer-events-none absolute inset-x-0 top-0 z-[60] flex flex-col items-end px-4 pb-2 pt-[max(0.375rem,env(safe-area-inset-top,0px))] sm:px-6 md:pointer-events-none md:inset-auto md:left-auto md:right-auto md:top-auto md:contents md:p-0'
          : 'return-to-hub-bar pointer-events-none absolute inset-x-0 top-0 z-[60] border-b border-white/10 bg-slateBg/95 px-4 py-3 backdrop-blur-md md:pointer-events-none md:inset-auto md:contents md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none'
      }
      aria-label="Return to portfolio hub"
    >
      <Link
        to="/"
        state={hubEnterStateForPath(pathname)}
        onClick={() => markPageLeavingToHub(pathname)}
        className={`${linkClass} pointer-events-auto`}
      >
        <Home className="size-4 shrink-0" strokeWidth={2} aria-hidden />
        Home
      </Link>
    </nav>
  );

  return (
    <Fragment>
      {!pillEnd ? (
        <div className="max-md:h-[3.25rem] max-md:shrink-0 md:hidden" aria-hidden />
      ) : null}
      {root ? createPortal(nav, root) : null}
    </Fragment>
  );
}
