import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

function D20Icon({ className }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      aria-hidden
    >
      {/* outer pentagon */}
      <polygon
        points="20,2 38,14 32,35 8,35 2,14"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        fill="none"
      />
      {/* top triangle face */}
      <polygon
        points="20,2 38,14 2,14"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
        fill="none"
        opacity="0.6"
      />
      {/* center number hint — top face */}
      <line x1="20" y1="2"  x2="20" y2="14" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
      <line x1="2"  y1="14" x2="20" y2="14" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
      <line x1="38" y1="14" x2="20" y2="14" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
      {/* center-bottom divider */}
      <line x1="8"  y1="35" x2="20" y2="14" stroke="currentColor" strokeWidth="1"   opacity="0.5" />
      <line x1="32" y1="35" x2="20" y2="14" stroke="currentColor" strokeWidth="1"   opacity="0.5" />
      <line x1="8"  y1="35" x2="32" y2="35" stroke="currentColor" strokeWidth="0"   opacity="0" />
      {/* 20 label */}
      <text x="20" y="27" textAnchor="middle" fontSize="9" fontWeight="700"
        fill="currentColor" fontFamily="Satoshi, sans-serif" opacity="0.9">
        20
      </text>
    </svg>
  );
}

const TAPE_TEXT = '◆ NERDS ONLY ◆ NERDS ONLY ◆ NERDS ONLY ◆ NERDS ONLY ◆ NERDS ONLY ◆ NERDS ONLY ◆ NERDS ONLY ◆ ';

function CautionTape({ reverse = false }) {
  const reduceMotion = useReducedMotion();
  return (
    <div
      className="overflow-hidden"
      style={{
        background: 'repeating-linear-gradient(45deg, rgba(200,169,110,0.18) 0px, rgba(200,169,110,0.18) 8px, rgba(160,120,60,0.08) 8px, rgba(160,120,60,0.08) 16px)',
        borderTop: '1px solid rgba(200,169,110,0.25)',
        borderBottom: '1px solid rgba(200,169,110,0.25)',
        height: '20px',
      }}
    >
      <motion.div
        className="flex items-center h-full whitespace-nowrap"
        animate={reduceMotion ? undefined : { x: reverse ? ['0%', '50%'] : ['0%', '-50%'] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
        style={{ width: '200%' }}
      >
        <span
          className="text-[9px] font-bold tracking-[0.22em] uppercase"
          style={{ color: 'rgba(200,169,110,0.75)' }}
        >
          {TAPE_TEXT}{TAPE_TEXT}
        </span>
      </motion.div>
    </div>
  );
}

export default function NerdsOnlyCard() {
  const navigate = useNavigate();
  const wrapRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const scale = useMotionValue(1);
  const springScale = useSpring(scale, { stiffness: 120, damping: 22 });

  useEffect(() => {
    if (reduceMotion) return;
    const onMove = (e) => {
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
      scale.set(dist < 220 ? 1 + (1 - dist / 220) * 0.018 : 1);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [reduceMotion, scale]);

  return (
    <motion.div
      ref={wrapRef}
      style={{ scale: springScale, transformOrigin: 'center' }}
      className="h-full w-full min-w-0"
    >
      <button
        onClick={() => navigate('/nerds-only')}
        className="btn-theme portfolio-hub-card h-full min-h-0 w-full max-w-full overflow-hidden flex flex-col items-stretch text-left !p-0 !gap-0 !justify-start"
        aria-label="Nerd's Only — D&D character gallery"
      >
        {/* Top caution tape */}
        <CautionTape reverse={false} />

        {/* Card body */}
        <div className="flex-1 flex flex-col p-6 md:p-8 gap-4 justify-between">
          <div className="flex items-start justify-between gap-3">
            <D20Icon className="size-9 shrink-0 text-white" />
          </div>
          <div className="mt-3 min-h-0">
            <h2 className="text-base font-semibold leading-snug tracking-tight text-white md:text-lg">
              Nerd's Only
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white text-pretty">
              The party. Nine characters across D&amp;D 5e, Daggerheart, and FATE. Backstories, builds, and lore — no resume required.
            </p>
            <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Systems">
              {['D&D 5e', 'Daggerheart', 'FATE RPG', 'Humblewood', 'Mensa Atra'].map(t => (
                <li
                  key={t}
                  className="rounded-full border border-white/15 px-2 py-0.5 text-[10px] font-medium tracking-tight text-white/60"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom caution tape */}
        <CautionTape reverse={true} />
      </button>
    </motion.div>
  );
}
