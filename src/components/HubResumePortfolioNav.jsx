import * as Framer from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  HUB_NAV_EDGE_PULSE_TRANSITION,
  HUB_NAV_PULSE_X,
} from '../utils/hubNavMotion';

export const hubNavLinkCore =
  'btn-theme btn-theme-compact btn-theme-hub-reveal z-20 cursor-pointer text-xs no-underline md:text-sm';

export const hubNavLabelClass =
  'font-semibold uppercase tracking-[0.2em] text-white transition-colors duration-300';

// Magnetic pull toward cursor within a proximity radius — desktop pointer only
function useMagnetic(strength = 0.30) {
  const ref = useRef(null);
  const reduceMotion = Framer.useReducedMotion();
  const x = Framer.useMotionValue(0);
  const y = Framer.useMotionValue(0);
  const springX = Framer.useSpring(x, { stiffness: 180, damping: 16 });
  const springY = Framer.useSpring(y, { stiffness: 180, damping: 16 });

  useEffect(() => {
    if (reduceMotion) {
      x.set(0);
      y.set(0);
      return;
    }
    const onMove = (e) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const range = Math.max(rect.width, rect.height) * 2.2;
      if (dist < range) {
        const factor = (1 - dist / range) * strength;
        x.set(dx * factor);
        y.set(dy * factor);
      } else {
        x.set(0);
        y.set(0);
      }
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [reduceMotion, strength, x, y]);

  return { ref, style: { x: springX, y: springY } };
}

const MotionLink = Framer.motion(Link);

function ResumeLinkContents({ pulseXNeg }) {
  return (
    <div className="relative z-10 inline-flex cursor-pointer items-center justify-center">
      <span className="relative z-10 inline-flex items-center gap-1.5">
        <Framer.motion.span
          className="inline-flex shrink-0 text-white"
          animate={pulseXNeg}
          transition={HUB_NAV_EDGE_PULSE_TRANSITION}
        >
          <ChevronLeft className="size-4 shrink-0" strokeWidth={2} aria-hidden />
        </Framer.motion.span>
        <span className={hubNavLabelClass}>Resume</span>
      </span>
      <div className="nav-amber-glow-bar" aria-hidden />
    </div>
  );
}

function PortfolioLinkContents({ pulseXPos }) {
  return (
    <div className="relative z-10 inline-flex cursor-pointer items-center justify-center">
      <span className="relative z-10 inline-flex items-center gap-1.5">
        <span className={hubNavLabelClass}>Portfolio</span>
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
  );
}

const navLinkRowClass = `${hubNavLinkCore} nav-amber-wrap inline-flex`;

export default function HubResumePortfolioNav({ centerSlot = null }) {
  const reduceMotion = Framer.useReducedMotion();
  const pulseXNeg = reduceMotion ? { x: 0 } : { x: [0, -HUB_NAV_PULSE_X, 0] };
  const pulseXPos = reduceMotion ? { x: 0 } : { x: [0, HUB_NAV_PULSE_X, 0] };

  // Separate magnetic hooks — desktop links only (mobile layout omitted for pointer relevance)
  const resumeMagnetic = useMagnetic(0.30);
  const portfolioMagnetic = useMagnetic(0.30);

  const linkRow = (
    <nav
      aria-label="Resume and portfolio"
      className="flex w-full flex-nowrap items-center justify-center gap-x-[clamp(4.5rem,20vw,9rem)] gap-y-3 sm:gap-x-28 md:gap-x-40"
    >
      <Link
        to="/resume"
        aria-label="Resume and links (west)"
        className={navLinkRowClass}
      >
        <ResumeLinkContents pulseXNeg={pulseXNeg} />
      </Link>
      <Link
        to="/portfolio"
        aria-label="Open portfolio hub (east)"
        className={navLinkRowClass}
      >
        <PortfolioLinkContents pulseXPos={pulseXPos} />
      </Link>
    </nav>
  );

  if (!centerSlot) {
    return linkRow;
  }

  return (
    <div className="w-full">
      {/* Mobile / tablet: centered stack, no magnetic (touch doesn't have hover proximity) */}
      <div className="flex flex-col gap-6 lg:hidden">
        {centerSlot}
        <div className="mt-16 w-full sm:mt-[4.5rem]">{linkRow}</div>
      </div>

      {/* Desktop: 3-column with magnetic pull on Resume and Portfolio */}
      <div className="hidden w-full gap-x-12 lg:grid lg:grid-cols-3 lg:items-end xl:gap-x-16">
        <MotionLink
          to="/resume"
          aria-label="Resume and links (west)"
          ref={resumeMagnetic.ref}
          style={{ ...resumeMagnetic.style }}
          className={`${navLinkRowClass} justify-self-start`}
        >
          <ResumeLinkContents pulseXNeg={pulseXNeg} />
        </MotionLink>

        <div className="flex min-w-0 justify-center self-end">{centerSlot}</div>

        <MotionLink
          to="/portfolio"
          aria-label="Open portfolio hub (east)"
          ref={portfolioMagnetic.ref}
          style={{ ...portfolioMagnetic.style }}
          className={`${navLinkRowClass} justify-self-end`}
        >
          <PortfolioLinkContents pulseXPos={pulseXPos} />
        </MotionLink>
      </div>
    </div>
  );
}
