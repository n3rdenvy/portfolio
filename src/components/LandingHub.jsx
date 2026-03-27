import { LayoutGroup, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import HubResumePortfolioNav from './HubResumePortfolioNav';
import { markHubLeavingToPortfolio } from '../utils/pageTransitions';

const MotionH1 = motion.h1;
const MotionDiv = motion.div;

const HUB_VISITED_KEY = 'erik-portfolio-hub-visited';

function readHasSeenHub() {
  try {
    return localStorage.getItem(HUB_VISITED_KEY) === '1';
  } catch {
    return true;
  }
}

export default function LandingHub() {
  const reduceMotion = useReducedMotion();
  const [hasSeenHub] = useState(readHasSeenHub);
  const isFirstVisit = !hasSeenHub;
  const skipIntro = !isFirstVisit || reduceMotion;

  const [phase, setPhase] = useState(() => (skipIntro ? 'ready' : 'overlay'));

  const showIntroOverlay = isFirstVisit && !reduceMotion && phase === 'overlay';

  const useSharedHeadline = isFirstVisit && !reduceMotion;

  const headlineClass =
    'font-satoshi text-[clamp(1.875rem,1.2rem+3.2vw,3rem)] font-bold leading-tight tracking-tight text-white';

  const headlineMotionProps = useMemo(
    () => (useSharedHeadline ? { layoutId: 'hub-headline' } : {}),
    [useSharedHeadline],
  );

  useEffect(() => {
    if (skipIntro) {
      if (isFirstVisit && reduceMotion) {
        try {
          localStorage.setItem(HUB_VISITED_KEY, '1');
        } catch {
          /* ignore */
        }
      }
      return;
    }
    const id = window.setTimeout(() => setPhase('ready'), 1000);
    return () => window.clearTimeout(id);
  }, [isFirstVisit, reduceMotion, skipIntro]);

  useEffect(() => {
    if (phase !== 'ready' || skipIntro) return;
    const id = window.setTimeout(() => {
      try {
        localStorage.setItem(HUB_VISITED_KEY, '1');
      } catch {
        /* ignore */
      }
    }, 1400);
    return () => window.clearTimeout(id);
  }, [phase, skipIntro]);

  const bodyVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0.01 : 0.55,
        ease: [0.22, 1, 0.36, 1],
        delay: reduceMotion ? 0 : 0.08,
      },
    },
  };

  return (
    <LayoutGroup id="landing-hub">
      <div className="relative w-full">
        {showIntroOverlay && (
          <div className="pointer-events-none fixed inset-0 z-[15] flex items-center justify-center">
            <MotionH1 layoutId="hub-headline" className={headlineClass}>
              Heya! I&apos;m Erik.
            </MotionH1>
          </div>
        )}

        <div className="w-full px-6 pb-[clamp(8rem,22svh,12rem)] pt-16 text-center md:px-10 md:pb-28 md:pt-20 lg:pb-32 lg:pt-24">
          <div className="mx-auto w-full max-w-2xl">
            {showIntroOverlay ? (
              <div
                className="min-h-[clamp(2.5rem,2rem+2vw,3.25rem)] w-full shrink-0"
                aria-hidden
              />
            ) : (
              <MotionH1 {...headlineMotionProps} className={`${headlineClass} w-full`}>
                Heya! I&apos;m Erik.
              </MotionH1>
            )}
          </div>

          {phase === 'ready' && (
            <MotionDiv
              key={skipIntro ? 'hub-body-static' : 'hub-body-intro'}
              className="mt-6 flex w-full flex-col gap-6 text-left font-satoshi text-white"
              initial={skipIntro ? false : 'hidden'}
              animate="visible"
              variants={bodyVariants}
            >
              <div className="mx-auto flex w-full max-w-xl flex-col gap-5 text-sm leading-relaxed md:text-base">
                <p className="indent-6 md:indent-8">
                  I have spent the last few years leading interior{' '}
                  <strong className="font-black">design strategy</strong> at IKEA,
                  where I learned that the most complex problems usually require
                  the{' '}
                  <strong className="font-black">
                    simplest, most clear answers.
                  </strong>{' '}
                  I enjoy getting to the root of a problem and finding a reason
                  to laugh along the way.
                </p>
                <p className="indent-6 md:indent-8">
                  My career has{' '}
                  <strong className="font-black">focused on user experience</strong>{' '}
                  across multiple industries, so moving into{' '}
                  <strong className="font-black">UX</strong> and{' '}
                  <strong className="font-black">Agentic Design</strong> is the
                  natural next step. When I am not auditing design systems, I am
                  usually participating in a D&amp;D campaign, skating ten miles,
                  or destressing with my cats.
                </p>
              </div>

              <div className="mx-auto mt-12 w-full max-w-xl md:mt-14 lg:mx-0 lg:max-w-none">
                <HubResumePortfolioNav
                  centerSlot={
                    <h2
                      id="hub-how-can-i-help"
                      className={`${headlineClass} w-full text-center`}
                    >
                      How can I help?
                    </h2>
                  }
                />
                <p className="mt-6 text-center text-sm leading-relaxed text-white/80">
                  <Link
                    to="/transit-pulse-ax"
                    onClick={() => markHubLeavingToPortfolio()}
                    className="font-medium text-white underline decoration-white/35 underline-offset-[5px] transition hover:decoration-white/70"
                  >
                    Transit Pulse
                  </Link>
                  <span className="text-white/60"> — case study (shell, a11y, telemetry UX)</span>
                </p>
              </div>
            </MotionDiv>
          )}
        </div>
      </div>
    </LayoutGroup>
  );
}
