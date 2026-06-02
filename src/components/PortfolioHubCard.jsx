import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { markHubLeavingToPortfolio } from '../utils/pageTransitions';
import AiBadge from './AiBadge';

export default function PortfolioHubCard({ to, title, description, icon: Icon, badge, aiTools }) {
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
      const threshold = 220;
      scale.set(dist < threshold ? 1 + (1 - dist / threshold) * 0.018 : 1);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [reduceMotion, scale]);

  return (
    <motion.div
      ref={wrapRef}
      style={{ scale: springScale, transformOrigin: 'center' }}
      className="h-full"
    >
      <Link
        to={to}
        onClick={() => markHubLeavingToPortfolio()}
        className={['btn-theme', 'portfolio-hub-card', 'h-full min-h-0 w-full p-6 md:p-8'].join(' ')}
      >
        <div className="flex items-start justify-between gap-3">
          {Icon ? (
            <Icon className="size-9 shrink-0 text-white" strokeWidth={1.35} aria-hidden />
          ) : null}
          <div className="flex items-center gap-2">
            {badge ? (
              <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold tracking-tight text-white">
                {badge}
              </span>
            ) : null}
            {aiTools?.length ? <AiBadge models={aiTools} /> : null}
          </div>
        </div>
        <div className="min-h-0">
          <h3 className="text-base font-semibold leading-snug tracking-tight text-white md:text-lg">
            {title}
          </h3>
          {description ? (
            <p className="mt-2 text-sm leading-relaxed text-white text-pretty">{description}</p>
          ) : null}
        </div>
      </Link>
    </motion.div>
  );
}
