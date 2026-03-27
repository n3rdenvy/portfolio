import { LayoutGrid } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { hubEnterStateForPath, markPageLeavingToHub } from '../utils/pageTransitions';

/**
 * @param {{ aboveEmbed?: boolean }} props — raise stacking when a full-viewport iframe sits underneath.
 */
export default function ReturnToPortfolioButton({ aboveEmbed = false }) {
  const { pathname } = useLocation();

  return (
    <div
      className={[
        'site-fixed-nav-tl pointer-events-none flex items-start justify-start',
        aboveEmbed ? 'site-fixed-nav-tl--above-embed' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
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
}
