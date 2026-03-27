import { LayoutGrid } from 'lucide-react';
import { Fragment, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { FIXED_NAV_PORTAL_ID } from '../utils/fixedNavPortal';
import { hubEnterStateForPath, markPageLeavingToHub } from '../utils/pageTransitions';

/**
 * Rendered via portal above page content so `position: fixed` is not captured by Framer’s transformed route layer.
 */
export default function ReturnToPortfolioButton() {
  const { pathname } = useLocation();
  const [root, setRoot] = useState(null);

  useLayoutEffect(() => {
    setRoot(document.getElementById(FIXED_NAV_PORTAL_ID));
  }, []);

  const tree = (
    <div className="site-fixed-nav-tl pointer-events-none flex items-start justify-start">
      <Link
        to="/?wing=east"
        state={hubEnterStateForPath(pathname)}
        onClick={() => markPageLeavingToHub(pathname)}
        className="pointer-events-auto inline-flex shrink-0 items-center gap-2 btn-theme px-4 py-2.5 text-xs font-semibold tracking-tight no-underline sm:text-sm"
      >
        <LayoutGrid className="size-4 shrink-0" strokeWidth={2} aria-hidden />
        Return to portfolio
      </Link>
    </div>
  );

  return (
    <Fragment>
      <div className="h-[3.25rem] shrink-0 md:hidden" aria-hidden />
      {root ? createPortal(tree, root) : null}
    </Fragment>
  );
}
