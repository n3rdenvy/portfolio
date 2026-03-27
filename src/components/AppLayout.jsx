import * as Framer from 'framer-motion';
import { useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useNavDepth } from '../context/NavDepthContext';
import {
  ROUTE_SPRING,
  getRouteInitial,
  makeExitRunnerForPath,
} from '../utils/pageTransitions';

const routeLayerVariants = {
  initial: (custom) => getRouteInitial(custom.path, custom.state),
  animate: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: ROUTE_SPRING,
  },
  exit: (custom) => {
    const run = makeExitRunnerForPath(custom.path);
    return run();
  },
};

export default function AppLayout() {
  const location = useLocation();
  const { pathname } = location;
  const { homePanelDepth } = useNavDepth();

  useLayoutEffect(() => {
    const depth = pathname === '/' ? homePanelDepth : 2;
    document.documentElement.dataset.bgDepth = String(depth);
  }, [pathname, homePanelDepth]);

  return (
    <div className="relative min-h-[100svh] w-full overflow-x-hidden">
      <Framer.AnimatePresence initial={false}>
        <Framer.motion.div
          key={pathname}
          className="min-h-[100svh] w-full"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            width: '100%',
            minHeight: '100svh',
          }}
          variants={routeLayerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          custom={{ path: pathname, state: location.state }}
        >
          <Outlet />
        </Framer.motion.div>
      </Framer.AnimatePresence>
    </div>
  );
}
