import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

const MotionDiv = motion.div;

export default function FlipFeatureCard({ title, body }) {
  const [flipped, setFlipped] = useState(false);
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
      scale.set(dist < 200 ? 1 + (1 - dist / 200) * 0.016 : 1);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [reduceMotion, scale]);

  function flip() {
    setFlipped((f) => !f);
  }

  function onKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      flip();
    }
  }

  const frontZ = flipped ? 'z-[1]' : 'z-[2]';
  const backZ = flipped ? 'z-[2]' : 'z-[1]';

  return (
    <motion.div
      ref={wrapRef}
      style={{ scale: springScale, transformOrigin: 'center' }}
      className="h-[min(22rem,50svh)] [perspective:1000px]"
    >
      <MotionDiv
        className="relative h-full w-full cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/45 focus-visible:ring-offset-2 focus-visible:ring-offset-slateBg"
        role="button"
        tabIndex={0}
        aria-pressed={flipped}
        aria-label={`${title}. Press Space or Enter to flip.`}
        onClick={flip}
        onKeyDown={onKeyDown}
        initial={false}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          className={`glass absolute inset-0 flex flex-col justify-center rounded-2xl p-6 text-left [backface-visibility:hidden] ${frontZ}`}
        >
          <h3 className="text-base font-semibold leading-snug tracking-tight text-white">{title}</h3>
          <p className="mt-4 text-xs tracking-tight text-white">Click to flip</p>
        </div>
        <div
          className={`glass absolute inset-0 flex flex-col justify-center rounded-2xl p-6 text-left [backface-visibility:hidden] ${backZ}`}
          style={{ transform: 'rotateY(180deg)' }}
        >
          <p className="text-sm leading-relaxed text-white">{body}</p>
        </div>
      </MotionDiv>
    </motion.div>
  );
}
