import * as Framer from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LandingHub from './LandingHub';
import { hubNavLinkCore, hubNavLabelClass } from './HubResumePortfolioNav';
import { useNavDepth } from '../context/NavDepthContext';
import { markHubLeavingToContact } from '../utils/pageTransitions';
import {
  HUB_NAV_EDGE_PULSE_TRANSITION,
  HUB_NAV_PULSE_Y,
} from '../utils/hubNavMotion';

export default function TJunctionShell() {
  const navigate = useNavigate();
  const { setHomePanelDepth } = useNavDepth();
  const reduceMotion = Framer.useReducedMotion();

  // Magnetic pull for Let's Chat CTA
  const chatRef = useRef(null);
  const chatX = Framer.useMotionValue(0);
  const chatY = Framer.useMotionValue(0);
  const chatSpringX = Framer.useSpring(chatX, { stiffness: 180, damping: 16 });
  const chatSpringY = Framer.useSpring(chatY, { stiffness: 180, damping: 16 });

  useEffect(() => {
    if (reduceMotion) return;
    const onMove = (e) => {
      const el = chatRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const range = Math.max(rect.width, rect.height) * 2.5;
      if (dist < range) {
        const factor = (1 - dist / range) * 0.35;
        chatX.set(dx * factor);
        chatY.set(dy * factor);
      } else {
        chatX.set(0);
        chatY.set(0);
      }
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [reduceMotion, chatX, chatY]);

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

  const pulseYPos = reduceMotion ? { y: 0 } : { y: [0, HUB_NAV_PULSE_Y, 0] };

  return (
    <div className="relative min-h-full w-full overflow-hidden">
      <div className="relative min-h-[min(100svh,48rem)] w-full">
        <LandingHub />

        <nav
          className="pointer-events-none fixed inset-x-0 z-20 px-4 bottom-[calc(env(safe-area-inset-bottom,0px)+2.7rem)] pb-1 pt-1.5 md:bottom-0 md:pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] md:pt-2"
          aria-label="Hub navigation"
        >
          <div className="pointer-events-auto mx-auto flex w-full max-w-sm justify-center md:max-w-2xl">
            <Framer.motion.div
              ref={chatRef}
              style={{ x: chatSpringX, y: chatSpringY }}
            >
              <Link
                to="/contact"
                onClick={() => markHubLeavingToContact()}
                aria-label="Contact. Open contact page"
                className={`${hubNavLinkCore} nav-amber-wrap inline-flex flex-col items-center gap-1`}
              >
                <div className="relative z-10 inline-flex cursor-pointer flex-col items-center justify-center gap-1">
                  <span className={`relative z-10 ${hubNavLabelClass}`}>Let&apos;s chat</span>
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
            </Framer.motion.div>
          </div>
        </nav>
      </div>
    </div>
  );
}
