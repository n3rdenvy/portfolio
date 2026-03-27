import { motion } from 'framer-motion';
import { useState } from 'react';

const MotionDiv = motion.div;

export default function FlipFeatureCard({ title, body }) {
  const [flipped, setFlipped] = useState(false);

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
    <div className="h-[min(22rem,50svh)] [perspective:1000px]">
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
    </div>
  );
}
