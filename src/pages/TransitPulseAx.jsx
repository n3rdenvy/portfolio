import * as Framer from 'framer-motion';
import { useCallback, useEffect, useId, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
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

/** Logical phone width — iframe `src` app sees this as viewport width (mobile breakpoints). */
const PROTOTYPE_FRAME_MAX_W_PX = 390;
/** Cap height so the frame fits on laptop screens without stretching the UI. */
const PROTOTYPE_FRAME_MAX_H_PX = 844;

/** @typedef {'west' | 'east' | null} PanelKey */

const panelShell =
  'rounded-2xl border border-white/10 bg-white/5 p-6 text-white backdrop-blur-[9.9px]';

const panelMotion = {
  west: {
    initial: { x: '-108%' },
    animate: { x: 0 },
    exit: { x: '-108%' },
    className: `bottom-2 left-2 top-2 w-[min(100%,26rem)] md:bottom-4 md:left-4 md:top-4 ${panelShell}`,
  },
  east: {
    initial: { x: '108%' },
    animate: { x: 0 },
    exit: { x: '108%' },
    className: `bottom-2 right-2 top-2 w-[min(100%,26rem)] md:bottom-4 md:right-4 md:top-4 ${panelShell}`,
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
    <div className="flex h-full min-h-0 flex-col overflow-hidden text-white">
      <ReturnToPortfolioButton />

      <div className="relative flex min-h-0 flex-1 flex-col">
        {hasPrototype ? (
          <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden px-3 pb-4 pt-[max(4.5rem,9svh)] md:pb-6 md:pt-[max(5rem,10svh)]">
            <div
              className="relative w-[min(100%,390px)] max-h-full shrink-0 overflow-hidden rounded-[2rem] border border-white/12 bg-black shadow-[0_24px_80px_-20px_rgba(0,0,0,0.65)] ring-1 ring-inset ring-white/[0.06]"
              style={{
                aspectRatio: `${PROTOTYPE_FRAME_MAX_W_PX} / ${PROTOTYPE_FRAME_MAX_H_PX}`,
                maxHeight: `min(${PROTOTYPE_FRAME_MAX_H_PX}px, 100%)`,
              }}
            >
              <iframe
                title="Transit Pulse AX interactive prototype"
                src={TRANSIT_PULSE_PROTOTYPE_URL}
                className="absolute inset-0 h-full w-full border-0"
                allowFullScreen
              />
            </div>
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden p-6 pt-20 md:p-10 md:pt-24">
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
          <div className="absolute left-3 top-1/2 z-[101] -translate-y-1/2 md:left-5">
            <DirectionTrigger
              edge="west"
              label="Concept & Why"
              icon={ChevronLeft}
              isOpen={active === 'west'}
              controlsId={`${baseId}-west`}
              onClick={() => setActive((p) => (p === 'west' ? null : 'west'))}
            />
          </div>

          <div className="absolute right-3 top-1/2 z-[101] -translate-y-1/2 md:right-5">
            <DirectionTrigger
              edge="east"
              iconPosition="end"
              label="Learnings & Process"
              icon={ChevronRight}
              isOpen={active === 'east'}
              controlsId={`${baseId}-east`}
              onClick={() => setActive((p) => (p === 'east' ? null : 'east'))}
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
                className="absolute inset-0 z-[105] bg-black/45 backdrop-blur-[1.35px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={close}
              />
              {active === 'west' && (
                <SlidePanel
                  key="west"
                  panelKey="west"
                  ariaLabel={TRANSIT_PULSE_CONCEPT.title}
                  onClose={close}
                  id={`${baseId}-west`}
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
                  <TransitProcessImageCarousel items={TRANSIT_PULSE_PROCESS_PLACEHOLDERS} />
                </SlidePanel>
              )}
            </>
          )}
        </Framer.AnimatePresence>
      </div>
    </div>
  );
}

/**
 * @param {{ items: { label: string; src: string; hint: string }[] }} props
 */
function TransitProcessImageCarousel({ items }) {
  const [index, setIndex] = useState(0);
  const [imgFailed, setImgFailed] = useState(false);
  const n = items.length;

  useEffect(() => {
    setImgFailed(false);
  }, [index]);

  if (n === 0) return null;

  const item = items[index];
  const go = (delta) => setIndex((i) => (i + delta + n) % n);

  return (
    <div
      className="mt-6 border-t border-white/10 pt-5"
      role="region"
      aria-roledescription="carousel"
      aria-label="Process images"
    >
      <p className="text-xs font-semibold tracking-tight text-white">Process images</p>
      <p className="mt-1 text-[11px] leading-snug text-white/75">
        Drop assets into the paths on each slide, or replace with real imagery.
      </p>
      <div className="relative mt-3 aspect-[4/3] w-full overflow-hidden rounded-xl border border-white/12 bg-black/30">
        {item.src && !imgFailed ? (
          <img
            src={item.src}
            alt={item.label}
            className="h-full w-full object-contain object-center"
            onError={() => setImgFailed(true)}
            draggable={false}
          />
        ) : (
          <div className="flex h-full min-h-[8rem] w-full flex-col justify-end bg-white/[0.06] p-3">
            <span className="text-xs font-medium text-white">{item.label}</span>
            <span className="mt-1 font-mono text-[10px] leading-snug text-white/65">{item.hint}</span>
          </div>
        )}
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <button
          type="button"
          className="btn-theme btn-theme-compact shrink-0 p-2"
          aria-label="Previous process image"
          onClick={() => go(-1)}
        >
          <ChevronLeft className="size-4" strokeWidth={2} aria-hidden />
        </button>
        <div className="flex flex-1 justify-center gap-2" role="tablist" aria-label="Carousel slides">
          {items.map((slide, i) => (
            <button
              key={slide.label}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Show slide ${i + 1} of ${n}: ${slide.label}`}
              className={`h-2 rounded-full transition-[width,background] duration-200 ${
                i === index ? 'w-6 bg-white' : 'w-2 bg-white/35 hover:bg-white/50'
              }`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
        <button
          type="button"
          className="btn-theme btn-theme-compact shrink-0 p-2"
          aria-label="Next process image"
          onClick={() => go(1)}
        >
          <ChevronRight className="size-4" strokeWidth={2} aria-hidden />
        </button>
      </div>
    </div>
  );
}

function DirectionTrigger({
  edge,
  iconPosition = 'start',
  label,
  icon,
  isOpen,
  controlsId,
  onClick,
}) {
  const Glyph = icon;
  const reduceMotion = Framer.useReducedMotion();
  const pulseAnim = reduceMotion
    ? { x: 0, y: 0 }
    : edge === 'east'
      ? { x: [0, HUB_NAV_PULSE_X, 0] }
      : edge === 'west'
        ? { x: [0, -HUB_NAV_PULSE_X, 0] }
        : { y: [0, HUB_NAV_PULSE_Y, 0] };
  const transition = reduceMotion ? { duration: 0 } : HUB_NAV_EDGE_PULSE_TRANSITION;

  const iconEl = (
    <Framer.motion.span
      className="inline-flex shrink-0 opacity-90"
      animate={pulseAnim}
      transition={transition}
    >
      <Glyph className="size-4 shrink-0" strokeWidth={2} aria-hidden />
    </Framer.motion.span>
  );
  const labelEl = (
    <span className="max-w-[10rem] leading-tight md:max-w-none">{label}</span>
  );

  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={isOpen}
      aria-controls={controlsId}
      className={`pointer-events-auto flex items-center gap-2 btn-theme py-2.5 text-xs font-medium tracking-tight md:text-sm ${
        iconPosition === 'end' ? 'pl-4 pr-3 text-right' : 'pl-3 pr-4 text-left'
      }`}
    >
      {iconPosition === 'end' ? (
        <>
          {labelEl}
          {iconEl}
        </>
      ) : (
        <>
          {iconEl}
          {labelEl}
        </>
      )}
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
      className={`pointer-events-auto absolute z-[110] overflow-y-auto overflow-x-hidden pr-1 scrollbar-none ${cfg.className}`}
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
