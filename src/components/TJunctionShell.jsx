import * as Framer from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTJunctionSwipe } from '../hooks/useTJunctionSwipe';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Activity,
  Box,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clapperboard,
  FileText,
  Send,
  Share2,
  Sparkles,
} from 'lucide-react';
import InteractiveButton from './InteractiveButton';
import PortfolioHubCard from './PortfolioHubCard';
import ReturnToHub from './ReturnToHub';

const LINKEDIN_URL = 'https://www.linkedin.com/in/';

const ABOUT_COPY =
  'Trauma-informed design and systems architecture shape how products collect attention, surface state, and recover from error. Erik Smith works at that intersection: humane patterns inside rigorous technical frames.';

const PORTFOLIO_HUB_CARDS = [
  {
    to: '/commercials',
    title: 'Commercials & Interior Expertise',
    description: 'Spec work, commissioned motion, and set-forward visual systems.',
    icon: Clapperboard,
  },
  {
    to: '/3d-visualization',
    title: '3D Visualization Portfolio',
    description: 'Spatial studies, materials, and real-time presentation frames.',
    icon: Box,
  },
  {
    to: '/transit-pulse-ax',
    title: 'Transit Pulse AX App',
    description: 'Application shell, accessibility posture, and operational telemetry UX.',
    icon: Activity,
  },
  {
    to: '/coming-soon',
    title: 'Coming Soon',
    description: 'New case studies and experiments in the pipeline.',
    icon: Sparkles,
    badge: 'Soon',
  },
];

/** @typedef {{ from: string, to: string }} Nav */

/** Entering panel = `to`, exiting panel = `from`. */
function transitionForNav({ from, to }) {
  if (from === to) {
    return {
      enter: { x: 0, y: 0, opacity: 1 },
      exitPrev: { x: 0, y: 0, opacity: 1 },
    };
  }

  if (to === 'south' && from === 'center') {
    return {
      enter: { x: 0, y: '100%', opacity: 0.92 },
      exitPrev: { x: 0, y: '-48%', opacity: 0 },
    };
  }
  if (from === 'south' && to === 'center') {
    return {
      enter: { x: 0, y: '-100%', opacity: 0.92 },
      exitPrev: { x: 0, y: '100%', opacity: 0 },
    };
  }

  const xOrder = { west: -1, center: 0, east: 1 };
  const fromX = xOrder[from];
  const toX = xOrder[to];
  if (fromX !== undefined && toX !== undefined && from !== 'south' && to !== 'south') {
    const dx = toX - fromX;
    if (dx > 0) {
      return {
        enter: { x: '100%', y: 0, opacity: 0.94 },
        exitPrev: { x: '-48%', y: 0, opacity: 0 },
      };
    }
    if (dx < 0) {
      return {
        enter: { x: '-100%', y: 0, opacity: 0.94 },
        exitPrev: { x: '48%', y: 0, opacity: 0 },
      };
    }
  }

  return {
    enter: { x: 0, y: 0, opacity: 0 },
    exitPrev: { x: 0, y: 0, opacity: 0 },
  };
}

const spring = { type: 'spring', stiffness: 280, damping: 32, mass: 0.85 };

function readInitialFacet() {
  if (typeof window === 'undefined') return 'center';
  try {
    return new URLSearchParams(window.location.search).get('wing') === 'east' ? 'east' : 'center';
  } catch {
    return 'center';
  }
}

function readInitialNav() {
  if (typeof window === 'undefined') return { from: 'center', to: 'center' };
  try {
    return new URLSearchParams(window.location.search).get('wing') === 'east'
      ? { from: 'center', to: 'east' }
      : { from: 'center', to: 'center' };
  } catch {
    return { from: 'center', to: 'center' };
  }
}

export default function TJunctionShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const [facet, setFacet] = useState(readInitialFacet);
  const [nav, setNav] = useState(readInitialNav);
  const facetRef = useRef(facet);
  const panelRef = useRef(null);

  useEffect(() => {
    facetRef.current = facet;
  }, [facet]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('wing') !== 'east') return;
    params.delete('wing');
    const q = params.toString();
    navigate({ pathname: '/', search: q ? `?${q}` : '' }, { replace: true });
    setNav({ from: facetRef.current, to: 'east' });
    setFacet('east');
  }, [location.search, navigate]);

  const go = useCallback((to) => {
    setNav({ from: facet, to });
    setFacet(to);
  }, [facet]);

  useTJunctionSwipe(panelRef, facet, go);

  const { enter, exitPrev } = transitionForNav(nav);

  const pageVariants = {
    initial: enter,
    animate: { x: 0, y: 0, opacity: 1 },
    exit: exitPrev,
  };

  return (
    <div className="relative min-h-[100svh] overflow-hidden">
      <Framer.AnimatePresence mode="wait">
        <Framer.motion.div
          ref={panelRef}
          key={facet}
          role="region"
          aria-label={
            facet === 'center'
              ? 'Home'
              : facet === 'west'
                ? 'Resume and LinkedIn'
                : facet === 'east'
                  ? 'Portfolio hub'
                  : 'About'
          }
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={spring}
          className="absolute inset-0 overflow-y-auto px-4 pb-28 pt-20 md:px-8"
        >
          {facet === 'center' && <CenterView onNavigate={go} />}
          {facet === 'west' && <WestView onBack={() => go('center')} />}
          {facet === 'east' && <EastView />}
          {facet === 'south' && <SouthView onBack={() => go('center')} />}
        </Framer.motion.div>
      </Framer.AnimatePresence>
    </div>
  );
}

function CenterView({ onNavigate }) {
  return (
    <div className="relative mx-auto flex min-h-[min(100svh,48rem)] max-w-2xl flex-col items-center justify-center text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-textSecondary">Welcome</p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-textPrimary md:text-4xl">Erik Smith</h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-textSecondary md:text-base">
        Systems architect · spatial hub navigation — choose a direction to explore.
      </p>

      <div className="absolute left-0 top-1/2 -translate-y-1/2 md:left-2">
        <InteractiveButton
          type="button"
          onClick={() => onNavigate('west')}
          className="inline-flex w-56 items-center justify-center gap-1 px-3 py-2.5"
          aria-label="Resume and links (west)"
        >
          <ChevronLeft className="size-4 shrink-0" aria-hidden />
          <span className="text-xs font-medium">&lt; Resume &amp; Links</span>
        </InteractiveButton>
      </div>

      <div className="absolute right-0 top-1/2 -translate-y-1/2 md:right-2">
        <InteractiveButton
          type="button"
          onClick={() => onNavigate('east')}
          className="inline-flex w-56 items-center justify-center gap-1 px-3 py-2.5"
          aria-label="Open portfolio hub (east)"
        >
          <span className="text-xs font-medium">Portfolio Hub &gt;</span>
          <ChevronRight className="size-4 shrink-0" aria-hidden />
        </InteractiveButton>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 md:bottom-12">
        <InteractiveButton
          as={Link}
          to="/contact"
          className="inline-flex w-56 flex-col items-center justify-center gap-1 px-3 py-2.5 no-underline"
          aria-label="Let's chat — open contact"
        >
          <span className="text-xs font-medium">Let&apos;s chat!</span>
          <Send className="size-4 shrink-0" aria-hidden />
        </InteractiveButton>
      </div>
    </div>
  );
}

function WestView({ onBack }) {
  return (
    <div className="mx-auto flex min-h-full max-w-lg flex-col justify-center gap-8 py-8">
      <InteractiveButton
        type="button"
        onClick={onBack}
        className="self-start inline-flex items-center gap-2 px-4 py-2.5"
        aria-label="Back to home"
      >
        <ChevronRight className="size-4 rotate-180" aria-hidden />
        Home
      </InteractiveButton>

      <div>
        <h2 className="text-2xl font-bold tracking-tight text-textPrimary">Resume & LinkedIn</h2>
        <p className="mt-2 text-sm text-textSecondary">
          Professional profile and downloadable CV.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
        <InteractiveButton
          as="a"
          href="/resume-technical.pdf"
          download
          className="inline-flex items-center justify-center gap-2 no-underline"
        >
          <FileText className="size-4 shrink-0" aria-hidden />
          Technical resume (PDF)
        </InteractiveButton>
        <InteractiveButton
          as="a"
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 no-underline"
        >
          <Share2 className="size-4 shrink-0" aria-hidden />
          LinkedIn
        </InteractiveButton>
      </div>
    </div>
  );
}

function EastView() {
  return (
    <div className="mx-auto flex min-h-full max-w-5xl flex-col justify-center gap-10 py-8">
      <ReturnToHub />

      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-textSecondary">East wing</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-textPrimary md:text-4xl">Portfolio hub</h2>
        <p className="mt-3 text-sm leading-relaxed text-textSecondary md:text-base">
          Pick a stream to open its detail page.
        </p>
      </header>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-stretch">
        {PORTFOLIO_HUB_CARDS.map((card) => (
          <li key={card.to} className="flex h-full min-h-0">
            <PortfolioHubCard
              to={card.to}
              title={card.title}
              description={card.description}
              icon={card.icon}
              badge={card.badge}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function SouthView({ onBack }) {
  return (
    <div className="mx-auto flex min-h-full max-w-2xl flex-col justify-center gap-8 py-8">
      <InteractiveButton
        type="button"
        onClick={onBack}
        className="self-start inline-flex items-center gap-2 px-4 py-2.5"
        aria-label="Back to home"
      >
        <ChevronUp className="size-4" aria-hidden />
        Home
      </InteractiveButton>

      <div>
        <h2 className="text-2xl font-bold tracking-tight text-textPrimary">About Me</h2>
        <p className="mt-4 text-base leading-relaxed text-textSecondary md:text-lg">
          {ABOUT_COPY}
        </p>
      </div>
    </div>
  );
}
