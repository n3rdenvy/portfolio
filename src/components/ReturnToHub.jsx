import { Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { hubEnterStateForPath, markPageLeavingToHub } from '../utils/pageTransitions';

/**
 * @param {{ mobileLayout?: 'bar' | 'pill-end' }} props
 * `pill-end` — below `md`, fixed strip with one right-aligned pill (Contact). `md+` unchanged.
 */
export default function ReturnToHub({ mobileLayout = 'bar' }) {
  const { pathname } = useLocation();
  if (pathname === '/') {
    return null;
  }

  const pillEnd = mobileLayout === 'pill-end';

  const linkClass = pillEnd
    ? [
        'return-to-hub-link site-fixed-nav-tl btn-theme flex shrink-0 items-center gap-2 no-underline',
        'px-4 py-2.5 text-xs font-semibold tracking-tight md:text-sm',
        'max-md:pointer-events-auto max-md:relative max-md:left-auto max-md:right-auto max-md:top-auto max-md:z-auto',
        'max-md:min-h-10 max-md:w-fit max-md:rounded-full max-md:border max-md:border-white/15 max-md:bg-slateBg/92',
        'max-md:px-3 max-md:py-1.5 max-md:shadow-[0_8px_30px_rgba(0,0,0,0.35)] max-md:backdrop-blur-md',
      ].join(' ')
    : 'return-to-hub-link site-fixed-nav-tl btn-theme flex w-fit shrink-0 items-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-tight no-underline md:text-sm';

  return (
    <nav
      className={
        pillEnd
          ? 'z-[60] max-md:pointer-events-none max-md:fixed max-md:inset-x-0 max-md:top-0 max-md:flex max-md:flex-col max-md:items-end max-md:border-0 max-md:bg-transparent max-md:px-4 max-md:pb-2 max-md:pt-[max(0.375rem,env(safe-area-inset-top,0px))] sm:max-md:px-6 md:contents'
          : 'return-to-hub-bar max-md:border-b max-md:border-white/10 max-md:bg-slateBg/95 max-md:px-4 max-md:py-3 max-md:backdrop-blur-md md:contents'
      }
      aria-label="Return to portfolio hub"
    >
      <Link
        to="/"
        state={hubEnterStateForPath(pathname)}
        onClick={() => markPageLeavingToHub(pathname)}
        className={linkClass}
      >
        <Home className="size-4 shrink-0" strokeWidth={2} aria-hidden />
        Home
      </Link>
    </nav>
  );
}
