import * as Framer from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  HUB_NAV_EDGE_PULSE_TRANSITION,
  HUB_NAV_PULSE_X,
} from '../utils/hubNavMotion';

export const hubNavLinkCore =
  'btn-theme btn-theme-compact btn-theme-hub-reveal z-20 cursor-pointer text-xs no-underline md:text-sm';

export const hubNavLabelClass =
  'font-semibold uppercase tracking-[0.2em] text-white transition-colors duration-300';

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

/**
 * Welcome hub nav: centered pair on tablet and below; full-width edges on large screens (see LandingHub width).
 * Optional `centerSlot`: on lg, rendered in the middle column, bottom-aligned with the two links.
 */
export default function HubResumePortfolioNav({ centerSlot = null }) {
  const reduceMotion = Framer.useReducedMotion();
  const pulseXNeg = reduceMotion ? { x: 0 } : { x: [0, -HUB_NAV_PULSE_X, 0] };
  const pulseXPos = reduceMotion ? { x: 0 } : { x: [0, HUB_NAV_PULSE_X, 0] };

  const linkRow = (
    <nav
      aria-label="Resume and portfolio"
      className="flex w-full flex-nowrap items-center justify-center gap-x-10 gap-y-3 sm:gap-x-14 md:gap-x-16 lg:justify-between lg:gap-x-0"
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
      <div className="flex flex-col gap-6 lg:hidden">
        {centerSlot}
        {linkRow}
      </div>
      <div className="hidden w-full gap-x-6 lg:grid lg:grid-cols-3 lg:items-end">
        <Link
          to="/resume"
          aria-label="Resume and links (west)"
          className={`${navLinkRowClass} justify-self-start`}
        >
          <ResumeLinkContents pulseXNeg={pulseXNeg} />
        </Link>
        <div className="flex min-w-0 justify-center self-end">{centerSlot}</div>
        <Link
          to="/portfolio"
          aria-label="Open portfolio hub (east)"
          className={`${navLinkRowClass} justify-self-end`}
        >
          <PortfolioLinkContents pulseXPos={pulseXPos} />
        </Link>
      </div>
    </div>
  );
}
