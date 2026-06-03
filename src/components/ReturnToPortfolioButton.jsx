import { Home } from 'lucide-react';
import { Fragment, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { FIXED_NAV_PORTAL_ID } from '../utils/fixedNavPortal';
import { hubEnterStateForPath, markPageLeavingToHub } from '../utils/pageTransitions';

/**
 * Rendered via portal above page content so `position: fixed` is not captured by Framer's transformed route layer.
 */
export default function ReturnToPortfolioButton() {
  const { pathname } = useLocation();
  const [root, setRoot] = useState(null);

  useLayoutEffect(() => {
    setRoot(document.getElementById(FIXED_NAV_PORTAL_ID));
  }, []);

  const tree = (
    <nav
      className="pointer-events-none absolute inset-x-0 top-0 z-[60] flex flex-col items-end px-4 pb-2 pt-[max(0.375rem,env(safe-area-inset-top,0px))] sm:px-6 md:pointer-events-none md:inset-auto md:left-auto md:right-auto md:top-auto md:contents md:p-0"
      aria-label="Return to portfolio"
    >
      <Link
        to="/?wing=east"
        state={hubEnterStateForPath(pathname)}
        onClick={() => markPageLeavingToHub(pathname)}
        className="return-to-hub-link site-fixed-nav-tl btn-theme glass-hub-pill pointer-events-auto flex shrink-0 items-center gap-2 no-underline px-4 py-2.5 text-xs font-semibold tracking-tight md:text-sm max-md:min-h-10 max-md:w-fit max-md:rounded-full max-md:px-3 max-md:py-1.5"
      >
        <Home className="size-4 shrink-0" strokeWidth={2} aria-hidden />
        Return to portfolio
      </Link>
    </nav>
  );

  return (
    <Fragment>
      <div className="max-md:h-[3.25rem] max-md:shrink-0 md:hidden" aria-hidden />
      {root ? createPortal(tree, root) : null}
    </Fragment>
  );
}
