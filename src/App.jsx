import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { NavDepthProvider } from './context/NavDepthContext';
import { ThemeProvider } from './context/ThemeContext';
import RootLayout from './layouts/RootLayout';
import TJunctionShell from './components/TJunctionShell';
import Accessibility from './pages/Accessibility';
import Process from './pages/Process';
import ROI from './pages/ROI';
import Commercials from './pages/Commercials';
import ComingSoon from './pages/ComingSoon';
import TransitPulseAx from './pages/TransitPulseAx';
import Visualization3D from './pages/Visualization3D';
import Contact from './pages/Contact';
import Portfolio from './pages/Portfolio';
import Resume from './pages/Resume';
import DevTools from './pages/DevTools';
import IkeaWork from './pages/IkeaWork';
import Eris from './pages/Eris';
import Inhabit from './pages/Inhabit';
import NerdsOnly from './pages/NerdsOnly';
import NotFound from './pages/NotFound';
import RouteMeta from './components/RouteMeta';

const ROUTES = [
  { path: '/accessibility', Component: Accessibility },
  { path: '/process', Component: Process },
  { path: '/roi', Component: ROI },
  { path: '/contact', Component: Contact },
  { path: '/commercials', Component: Commercials },
  { path: '/3d-visualization', Component: Visualization3D },
  { path: '/transit-pulse-ax', Component: TransitPulseAx },
  { path: '/coming-soon', Component: ComingSoon },
  { path: '/dev-tools', Component: DevTools },
  { path: '/ikea', Component: IkeaWork },
  { path: '/eris', Component: Eris },
  { path: '/inhabit', Component: Inhabit },
];

function App() {
  return (
    <BrowserRouter>
      {/* Site-wide prefers-reduced-motion: transform/layout animations collapse
          to opacity when the OS preference is set. */}
      <MotionConfig reducedMotion="user">
      <ThemeProvider>
      <NavDepthProvider>
        <RouteMeta />
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/" element={<TJunctionShell />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/resume" element={<Resume />} />
            {ROUTES.map((route) => {
              const Page = route.Component;
              return <Route key={route.path} path={route.path} element={<Page />} />;
            })}
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/nerds-only" element={<NerdsOnly />} />
        </Routes>
      </NavDepthProvider>
      </ThemeProvider>
      </MotionConfig>
    </BrowserRouter>
  );
}

export default App;
