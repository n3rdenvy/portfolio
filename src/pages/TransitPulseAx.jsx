import * as Framer from 'framer-motion';
import { useCallback, useEffect, useId, useState } from 'react';
import { ChevronDown, ChevronRight, ChevronUp, X } from 'lucide-react';
import ReturnToPortfolioButton from '../components/ReturnToPortfolioButton';
import {
  TRANSIT_PULSE_CONCEPT,
  TRANSIT_PULSE_LEARNINGS,
  TRANSIT_PULSE_PROCESS_PLACEHOLDERS,
  TRANSIT_PULSE_PROTOTYPE_URL,
} from '../data/transitPulseAx';
import {
  HUB_NAV_EDGE_PULSE_TRANSITION,
  HUB_NAV_PULSE_X,
  HUB_NAV_PULSE_Y,
} from '../utils/hubNavMotion';

const spring = { type: 'spring', stiffness: 320, damping: 36, mass: 0.9 };

/** @typedef {'north' | 'east' | 'south' | null} PanelKey */

const panelShell =
  'rounded-2xl border border-white/10 bg-white/5 p-6 text-white backdrop-blur-md';

const panelMotion = {
  north: {
    initial: { y: '-108%' },
    animate: { y: 0 },
    exit: { y: '-108%' },
    className: `left-2 right-2 top-2 max-h-[min(48vh,28rem)] md:left-6 md:right-6 ${panelShell}`,
  },
  east: {
    initial: { x: '108%' },
    animate: { x: 0 },
    exit: { x: '108%' },
    className: `bottom-2 right-2 top-2 w-[min(100%,26rem)] md:bottom-4 md:right-4 md:top-4 ${panelShell}`,
  },
  south: {
    initial: { y: '108%' },
    animate: { y: 0 },
    exit: { y: '108%' },
    className: `bottom-2 left-2 right-2 max-h-[min(52vh,32rem)] md:bottom-4 md:left-4 md:right-4 ${panelShell}`,
  },
};

export default function TransitPulseAx() {
  const baseId = useId();
  const [active, setActive] = useState(/** @type {PanelKey} */ (null));

  const close = useCallback(() => setActive(null), []);

  useEffect(() => {
    if (!active) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, close]);

  const hasPrototype = Boolean(TRANSIT_PULSE_PROTOTYPE_URL);

  return (
    <div className="flex min-h-[100svh] flex-col bg-slateBg text-white">
      <ReturnToPortfolioButton />

      <div className="relative min-h-0 flex-1">
        {hasPrototype ? (
          <iframe
            title="Transit Pulse AX interactive prototype"
            src={TRANSIT_PULSE_PROTOTYPE_URL}
            className="absolute inset-0 h-full w-full border-0"
            allowFullScreen
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-6 pt-24 md:p-10 md:pt-28">
            <div className="frame-theme-media max-w-md px-8 py-10 text-center">
              <p className="text-xs font-semibold tracking-tight text-white">Prototype</p>
              <p className="mt-3 text-sm leading-relaxed text-white">
                Set{' '}
                <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-white">
                  VITE_TRANSIT_PULSE_PROTOTYPE_URL
                </code>{' '}
                in your environment to embed the live Transit Pulse build (Figma embed, staging URL, etc.).
              </p>
            </div>
          </div>
        )}

        <nav
          className="pointer-events-none absolute inset-0 z-[100]"
          aria-label="Transit Pulse case study navigation"
        >
          <div className="absolute left-1/2 top-[max(5.5rem,12svh)] z-[101] -translate-x-1/2 md:top-[max(6rem,10svh)]">
            <DirectionTrigger
              edge="north"
              label="Concept & Why"
              icon={ChevronUp}
              isOpen={active === 'north'}
              controlsId={`${baseId}-north`}
              onClick={() => setActive((p) => (p === 'north' ? null : 'north'))}
            />
          </div>

          <div className="absolute right-3 top-1/2 z-[101] -translate-y-1/2 md:right-5">
            <DirectionTrigger
              label="Learnings & process"
              icon={ChevronRight}
              isOpen={active === 'east'}
              controlsId={`${baseId}-east`}
              onClick={() => setActive((p) => (p === 'east' ? null : 'east'))}
            />
          </div>

          <div className="absolute bottom-[max(1.25rem,4svh)] left-1/2 z-[101] -translate-x-1/2 md:bottom-6">
            <DirectionTrigger
              edge="south"
              label="Process images"
              icon={ChevronDown}
              isOpen={active === 'south'}
              controlsId={`${baseId}-south`}
              onClick={() => setActive((p) => (p === 'south' ? null : 'south'))}
            />
          </div>
        </nav>

        <Framer.AnimatePresence>
          {active && (
            <>
              <Framer.motion.button
                type="button"
                key="backdrop"
                aria-label="Close panel"
                className="absolute inset-0 z-[105] bg-black/45 backdrop-blur-[2px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={close}
              />
              {active === 'north' && (
                <SlidePanel
                  key="north"
                  panelKey="north"
                  ariaLabel={TRANSIT_PULSE_CONCEPT.title}
                  onClose={close}
                  id={`${baseId}-north`}
                >
                  <p className="text-xs font-semibold tracking-tight text-white">
                    {TRANSIT_PULSE_CONCEPT.title}
                  </p>
                  <div className="mt-4 space-y-3 text-sm leading-relaxed text-white">
                    {TRANSIT_PULSE_CONCEPT.body.map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                </SlidePanel>
              )}
              {active === 'east' && (
                <SlidePanel
                  key="east"
                  panelKey="east"
                  ariaLabel={TRANSIT_PULSE_LEARNINGS.title}
                  onClose={close}
                  id={`${baseId}-east`}
                >
                  <p className="text-xs font-semibold tracking-tight text-white">
                    {TRANSIT_PULSE_LEARNINGS.title}
                  </p>
                  <ul className="mt-4 list-disc space-y-2 pl-4 text-sm leading-relaxed text-white">
                    {TRANSIT_PULSE_LEARNINGS.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </SlidePanel>
              )}
              {active === 'south' && (
                <SlidePanel
                  key="south"
                  panelKey="south"
                  ariaLabel="Process images"
                  onClose={close}
                  id={`${baseId}-south`}
                >
                  <p className="text-xs font-semibold tracking-tight text-white">Process images</p>
                  <p className="mt-2 text-xs text-white">
                    Drop assets into the paths shown on each tile, or replace this grid with real imagery.
                  </p>
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {TRANSIT_PULSE_PROCESS_PLACEHOLDERS.map(({ label, hint }) => (
                      <div
                        key={label}
                        className="flex aspect-[4/3] flex-col justify-end rounded-xl border border-white/12 bg-white/[0.06] p-3"
                      >
                        <span className="text-xs font-medium text-white">{label}</span>
                        <span className="mt-1 font-mono text-[10px] leading-snug text-white">
                          {hint}
                        </span>
                      </div>
                    ))}
                  </div>
                </SlidePanel>
              )}
            </>
          )}
        </Framer.AnimatePresence>
      </div>
    </div>
  );
}

function DirectionTrigger({ edge, label, icon, isOpen, controlsId, onClick }) {
  const Glyph = icon;
  const reduceMotion = Framer.useReducedMotion();
  const pulseAnim = reduceMotion
    ? { x: 0, y: 0 }
    : edge === 'north'
      ? { y: [0, -HUB_NAV_PULSE_Y, 0] }
      : edge === 'east'
        ? { x: [0, HUB_NAV_PULSE_X, 0] }
        : { y: [0, HUB_NAV_PULSE_Y, 0] };
  const transition = reduceMotion ? { duration: 0 } : HUB_NAV_EDGE_PULSE_TRANSITION;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={isOpen}
      aria-controls={controlsId}
      className="pointer-events-auto flex items-center gap-2 btn-theme py-2.5 pl-3 pr-4 text-left text-xs font-medium tracking-tight md:text-sm"
    >
      <Framer.motion.span
        className="inline-flex shrink-0 opacity-90"
        animate={pulseAnim}
        transition={transition}
      >
        <Glyph className="size-4 shrink-0" strokeWidth={2} aria-hidden />
      </Framer.motion.span>
      <span className="max-w-[10rem] leading-tight md:max-w-none">{label}</span>
    </button>
  );
}

function SlidePanel({ children, panelKey, ariaLabel, onClose, id }) {
  const cfg = panelMotion[panelKey];
  return (
    <Framer.motion.div
      id={id}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      className={`pointer-events-auto absolute z-[110] overflow-y-auto pr-1 ${cfg.className}`}
      initial={cfg.initial}
      animate={cfg.animate}
      exit={cfg.initial}
      transition={spring}
    >
      <button
        type="button"
        onClick={onClose}
        className="btn-theme absolute right-3 top-3 z-[1] p-2.5"
        aria-label="Close panel"
      >
        <X className="size-4" strokeWidth={2} aria-hidden />
      </button>
      <div className="pt-1 pr-12">{children}</div>
    </Framer.motion.div>
  );
}
