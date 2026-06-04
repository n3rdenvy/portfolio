/**
 * Welcome hub — mobile layout locked; do not change without explicit user permission
 * (see `.cursor/rules/welcome-hub-mobile-locked.mdc`).
 */
import { LayoutGroup, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import HubResumePortfolioNav from './HubResumePortfolioNav';

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

        <div className="w-full px-8 pb-[clamp(5.25rem,11svh,7.5rem)] pt-32 text-center sm:px-10 md:px-14 md:pb-28 md:pt-28 lg:px-16 lg:pb-32 lg:pt-32">
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
              className="mt-12 flex w-full flex-col gap-12 text-left font-satoshi text-white md:mt-10 md:gap-10 lg:mt-12 lg:gap-12"
              initial={skipIntro ? false : 'hidden'}
              animate="visible"
              variants={bodyVariants}
            >
              <div className="mx-auto flex w-full max-w-xl flex-col gap-5 px-1 text-sm leading-relaxed sm:px-2 md:px-3 md:text-base">
                <p className="indent-4 md:indent-6">
                  I spent the last five years as an{' '}
                  <strong className="font-black">interior design leader</strong>{' '}
                  at IKEA, thinking about how people move through spaces, what
                  they actually need from a room, and which products earn their
                  place in it. Late 2025 I started taking{' '}
                  <strong className="font-black">UX seriously</strong>, and got
                  into it the way I tend to get into things: by building.
                </p>
                <p className="indent-4 md:indent-6">
                  Since then I have shipped a real-time transit app backed by
                  actual user research, built a{' '}
                  <strong className="font-black">fully local AI stack</strong>,
                  and made a few tools that improve my daily workflow. When I am
                  not working through a design problem, I am usually
                  participating in a D&amp;D campaign, skating ten miles, or
                  destressing with my cats.
                </p>
              </div>

              <div className="mx-auto w-full max-w-xl lg:mx-0 lg:max-w-none">
                <HubResumePortfolioNav
                  centerSlot={
                    <h2
                      id="hub-how-can-i-help"
                      className={`${headlineClass} w-full max-w-full text-center`}
                    >
                      How can I help?
                    </h2>
                  }
                />
              </div>
            </MotionDiv>
          )}
        </div>
      </div>
    </LayoutGroup>
  );
}
