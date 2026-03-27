/**
 * Spatial route transitions: hints are read when Framer runs exit (sessionStorage set in link onClick).
 * Home hub ↔ portfolio (east): horizontal. Home hub ↔ contact (south): vertical.
 */

export const ROUTE_SPRING = { type: 'spring', stiffness: 260, damping: 34, mass: 0.88 };

/** Session keys — consumed once inside exit runners / initial helpers */
export const HUB_LEAVE_KEY = 'hubLeaveDirection';
export const PAGE_LEAVE_KEY = 'pageLeaveDirection';

/** Values for HUB_LEAVE_KEY when navigating away from `/` */
export const HUB_TO_PORTFOLIO = 'to-portfolio';
export const HUB_TO_CONTACT = 'to-contact';

/** Values for PAGE_LEAVE_KEY when leaving a child route for `/` */
export const LEAVE_PORTFOLIO = 'leave-portfolio';
export const LEAVE_CONTACT = 'leave-contact';

const PORTFOLIO_PATHS = new Set([
  '/commercials',
  '/3d-visualization',
  '/transit-pulse-ax',
  '/coming-soon',
  '/interiors',
]);

export function isPortfolioPath(pathname) {
  return PORTFOLIO_PATHS.has(pathname);
}

/** `location.state` on `Link to="/"` — read on hub to set enter direction */
export function hubEnterStateForPath(pathname) {
  if (pathname === '/contact') return { hubEnter: 'from-contact' };
  if (isPortfolioPath(pathname)) return { hubEnter: 'from-portfolio' };
  return {};
}

/** Set before navigate from hub */
export function markHubLeavingToPortfolio() {
  sessionStorage.setItem(HUB_LEAVE_KEY, HUB_TO_PORTFOLIO);
}

export function markHubLeavingToContact() {
  sessionStorage.setItem(HUB_LEAVE_KEY, HUB_TO_CONTACT);
}

/** Set before navigate to `/` from a leaf page */
export function markPageLeavingToHub(pathname) {
  if (pathname === '/contact') {
    sessionStorage.setItem(PAGE_LEAVE_KEY, LEAVE_CONTACT);
    return;
  }
  if (isPortfolioPath(pathname)) {
    sessionStorage.setItem(PAGE_LEAVE_KEY, LEAVE_PORTFOLIO);
    return;
  }
  sessionStorage.removeItem(PAGE_LEAVE_KEY);
}

export function getRouteInitial(pathname, state) {
  if (pathname === '/' && state?.hubEnter === 'from-portfolio') {
    return { x: '-100%', y: 0, opacity: 0.92 };
  }
  if (pathname === '/' && state?.hubEnter === 'from-contact') {
    return { x: 0, y: '-100%', opacity: 0.92 };
  }
  if (isPortfolioPath(pathname)) {
    return { x: '100%', y: 0, opacity: 0.92 };
  }
  if (pathname === '/contact') {
    return { x: 0, y: '100%', opacity: 0.92 };
  }
  return { x: 0, y: 0, opacity: 0 };
}

/**
 * Returns a function Framer calls when exit starts (reads sessionStorage then).
 * @param {string} pathname — route this motion layer represents (the exiting page's path)
 */
export function makeExitRunnerForPath(pathname) {
  return () => {
    if (pathname === '/') {
      const hub = sessionStorage.getItem(HUB_LEAVE_KEY);
      sessionStorage.removeItem(HUB_LEAVE_KEY);
      if (hub === HUB_TO_PORTFOLIO) {
        return { x: '-100%', y: 0, opacity: 0, transition: ROUTE_SPRING };
      }
      if (hub === HUB_TO_CONTACT) {
        return { x: 0, y: '-100%', opacity: 0, transition: ROUTE_SPRING };
      }
      return { opacity: 0, transition: { duration: 0.2 } };
    }

    const page = sessionStorage.getItem(PAGE_LEAVE_KEY);
    sessionStorage.removeItem(PAGE_LEAVE_KEY);
    if (page === LEAVE_PORTFOLIO) {
      return { x: '100%', y: 0, opacity: 0, transition: ROUTE_SPRING };
    }
    if (page === LEAVE_CONTACT) {
      return { x: 0, y: '100%', opacity: 0, transition: ROUTE_SPRING };
    }
    return { opacity: 0, transition: { duration: 0.2 } };
  };
}
