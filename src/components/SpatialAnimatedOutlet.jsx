import * as Framer from 'framer-motion';
import { useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { spatialPageVariants } from '../utils/spatialRouteVariants';

export default function SpatialAnimatedOutlet() {
  const location = useLocation();
  const { pathname } = location;

  useLayoutEffect(() => {
    const depth = pathname === '/' ? 0 : 2;
    document.documentElement.dataset.bgDepth = String(depth);
  }, [pathname]);

  const viewportLocked = pathname === '/resume';

  return (
    <Framer.AnimatePresence mode="wait">
      <Framer.motion.div
        key={pathname}
        id="page-scroll-root"
        className={[
          'absolute inset-0 h-full w-full overflow-x-hidden scrollbar-none',
          viewportLocked ? 'overflow-y-hidden' : 'overflow-y-auto',
        ].join(' ')}
        custom={pathname}
        variants={spatialPageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <Outlet />
      </Framer.motion.div>
    </Framer.AnimatePresence>
  );
}
