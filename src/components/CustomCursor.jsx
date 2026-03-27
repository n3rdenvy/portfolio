import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';

const MotionDiv = motion.div;

const SPRING = { stiffness: 400, damping: 35, mass: 0.4 };

/** Horizontal squeeze only (narrower hand); stroke width unchanged in user units. */
const HAND_SCALE_X = 0.78;

/**
 * Classic “pointer hand” silhouette (Lucide hand paths): four fingers + palm + thumb.
 * Scaled narrower on X about viewBox center so it reads less “wide” than the stock icon.
 */
function PointerHandGlyph({ className }) {
  return (
    <svg
      className={className}
      width={28}
      height={32}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <g transform={`translate(12, 12) scale(${HAND_SCALE_X}, 1) translate(-12, -12)`}>
        <g
          fill="none"
          stroke="var(--amber-brand)"
          strokeWidth={1.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="nonScalingStroke"
        >
          <path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2" />
          <path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2" />
          <path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8" />
          <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
        </g>
      </g>
    </svg>
  );
}

function isAriaDisabled(el) {
  const v = el.getAttribute?.('aria-disabled');
  return v === 'true' || v === '1';
}

function isPointerTarget(node) {
  let el = node;
  while (el && el.nodeType === 1 && el !== document.documentElement) {
    if (isAriaDisabled(el)) return false;

    const tag = el.tagName;
    if (tag === 'A' && el.hasAttribute('href')) return true;
    if (tag === 'BUTTON') return !el.disabled;
    if (tag === 'INPUT') {
      const type = el.type?.toLowerCase() ?? '';
      if (type === 'button' || type === 'submit' || type === 'reset') return !el.disabled;
    }
    if (tag === 'SELECT') return !el.disabled;
    if (tag === 'SUMMARY') return true;
    if (tag === 'LABEL' && el.hasAttribute('for')) return true;

    const role = el.getAttribute('role');
    if (role === 'button' || role === 'link' || role === 'tab') return true;

    el = el.parentElement;
  }
  return false;
}

export default function CustomCursor() {
  const [mode, setMode] = useState('dot');
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, SPRING);
  const springY = useSpring(y, SPRING);

  const onMove = useCallback(
    (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const hit = document.elementFromPoint(e.clientX, e.clientY);
      const next = hit && isPointerTarget(hit) ? 'pointer' : 'dot';
      setMode((prev) => (prev === next ? prev : next));
    },
    [x, y],
  );

  useEffect(() => {
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [onMove]);

  return (
    <MotionDiv
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-50"
      style={{
        x: springX,
        y: springY,
        marginLeft: mode === 'dot' ? -6 : -19,
        marginTop: mode === 'dot' ? -6 : -5,
      }}
    >
      {mode === 'dot' ? (
        <MotionDiv
          key="dot"
          initial={false}
          animate={{ opacity: 1, scale: 1 }}
          className="h-3 w-3 rounded-full border"
          style={{
            borderColor: 'var(--amber-brand)',
            backgroundColor: 'rgba(255, 201, 51, 0.4)',
          }}
        />
      ) : (
        <MotionDiv
          key="pointer"
          initial={{ opacity: 0.92, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 520, damping: 34 }}
          className="block"
        >
          <PointerHandGlyph />
        </MotionDiv>
      )}
    </MotionDiv>
  );
}
