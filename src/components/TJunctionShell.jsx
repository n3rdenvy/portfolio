import * as Framer from 'framer-motion';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNavDepth } from '../context/NavDepthContext';
import { markHubLeavingToContact } from '../utils/pageTransitions';
import {
  HUB_NAV_EDGE_PULSE_TRANSITION,
  HUB_NAV_PULSE_X,
  HUB_NAV_PULSE_Y,
} from '../utils/hubNavMotion';

const navLinkShell =
  'btn-theme btn-theme-compact btn-theme-hub-reveal fixed z-20 max-w-[min(100vw-2rem,14rem)] cursor-pointer text-xs no-underline md:text-sm';

const navLabelClass =
  'font-semibold uppercase tracking-[0.2em] text-white transition-colors duration-300';

export default function TJunctionShell() {
  const navigate = useNavigate();
  const { setHomePanelDepth } = useNavDepth();
  const reduceMotion = Framer.useReducedMotion();

  useEffect(() => {
    setHomePanelDepth(0);
  }, [setHomePanelDepth]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('wing') !== 'east') return;
      params.delete('wing');
      const q = params.toString();
      navigate({ pathname: '/portfolio', search: q ? `?${q}` : '' }, { replace: true });
    } catch {
      /* ignore */
    }
  }, [navigate]);

  const pulseXNeg = reduceMotion ? { x: 0 } : { x: [0, -HUB_NAV_PULSE_X, 0] };
  const pulseXPos = reduceMotion ? { x: 0 } : { x: [0, HUB_NAV_PULSE_X, 0] };
  const pulseYPos = reduceMotion ? { y: 0 } : { y: [0, HUB_NAV_PULSE_Y, 0] };

  return (
    <div className="relative min-h-full w-full overflow-hidden">
      <div className="relative min-h-[min(100svh,48rem)] w-full">
        <div className="mx-auto flex max-w-2xl flex-col items-center justify-center px-6 pb-36 pt-12 text-center md:px-10 md:pb-40 md:pt-16">
          <p className="text-xs font-semibold tracking-tight text-white">Welcome</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl">Erik Smith</h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white md:text-base">
            Systems architect · spatial hub navigation<span className="text-white/90"> · </span>
            choose a direction to explore.
          </p>
        </div>

        <Link
          to="/resume"
          aria-label="Resume and links (west)"
          className={`${navLinkShell} nav-amber-wrap left-3 top-1/2 inline-flex -translate-y-1/2 items-center gap-1.5 md:left-10 lg:left-16 xl:left-24`}
        >
          <div className="relative z-10 inline-flex cursor-pointer items-center justify-center">
            <span className="relative z-10 inline-flex items-center gap-1.5">
              <Framer.motion.span
                className="inline-flex shrink-0 text-white"
                animate={pulseXNeg}
                transition={HUB_NAV_EDGE_PULSE_TRANSITION}
              >
                <ChevronLeft className="size-4 shrink-0" strokeWidth={2} aria-hidden />
              </Framer.motion.span>
              <span className={navLabelClass}>Resume</span>
            </span>
            <div className="nav-amber-glow-bar" aria-hidden />
          </div>
        </Link>

        <Link
          to="/portfolio"
          aria-label="Open portfolio hub (east)"
          className={`${navLinkShell} nav-amber-wrap right-3 top-1/2 inline-flex -translate-y-1/2 items-center gap-1.5 md:right-10 lg:right-16 xl:right-24`}
        >
          <div className="relative z-10 inline-flex cursor-pointer items-center justify-center">
            <span className="relative z-10 inline-flex items-center gap-1.5">
              <span className={navLabelClass}>Portfolio</span>
              <Framer.motion.span
                className="inline-flex shrink-0 text-white"
                animate={pulseXPos}
                transition={HUB_NAV_EDGE_PULSE_TRANSITION}
              >
                <ChevronRight className="size-4 shrink-0" strokeWidth={2} aria-hidden />
              </Framer.motion.span>
            </span>
            <div className="nav-amber-glow-bar" aria-hidden />
          </div>
        </Link>

        <Link
          to="/contact"
          onClick={() => markHubLeavingToContact()}
          aria-label="Contact. Open contact page"
          className={`${navLinkShell} nav-amber-wrap bottom-10 left-1/2 inline-flex -translate-x-1/2 flex-col gap-1 md:bottom-14`}
        >
          <div className="relative z-10 inline-flex cursor-pointer flex-col items-center justify-center gap-1">
            <span className={`relative z-10 ${navLabelClass}`}>Let&apos;s chat</span>
            <Framer.motion.span
              className="relative z-10 inline-flex text-white"
              animate={pulseYPos}
              transition={HUB_NAV_EDGE_PULSE_TRANSITION}
            >
              <ChevronDown className="size-4 shrink-0" strokeWidth={2} aria-hidden />
            </Framer.motion.span>
            <div className="nav-amber-glow-bar" aria-hidden />
          </div>
        </Link>
      </div>
    </div>
  );
}
