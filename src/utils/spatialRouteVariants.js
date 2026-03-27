const ease = [0.22, 1, 0.36, 1];

const slideTransition = { duration: 0.42, ease };
const fadeTransition = { duration: 0.32, ease };

function isHomePath(pathname) {
  return pathname === '/' || pathname === '';
}

function isPortfolioPath(pathname) {
  return pathname === '/portfolio';
}

function isResumePath(pathname) {
  return pathname === '/resume';
}

/**
 * Framer Motion variants keyed by `location.pathname` via `custom`.
 * Home: fade only. Portfolio: horizontal from/to +x. Resume: horizontal from/to −x.
 */
export const spatialPageVariants = {
  initial: (pathname) => {
    if (isPortfolioPath(pathname)) {
      return { x: '100%', opacity: 1 };
    }
    if (isResumePath(pathname)) {
      return { x: '-100%', opacity: 1 };
    }
    if (isHomePath(pathname)) {
      return { opacity: 0, x: 0 };
    }
    return { opacity: 0, x: 0 };
  },
  animate: (pathname) => ({
    x: 0,
    opacity: 1,
    transition: isHomePath(pathname) ? fadeTransition : slideTransition,
  }),
  exit: (pathname) => {
    if (isPortfolioPath(pathname)) {
      return { x: '100%', opacity: 1, transition: slideTransition };
    }
    if (isResumePath(pathname)) {
      return { x: '-100%', opacity: 1, transition: slideTransition };
    }
    if (isHomePath(pathname)) {
      return { opacity: 0, x: 0, transition: fadeTransition };
    }
    return { opacity: 0, x: 0, transition: fadeTransition };
  },
};
