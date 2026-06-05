import { useState } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function DyslexiaToggle({ dyslexia, setDyslexia }) {
  const { theme } = useTheme();
  const reduceMotion = useReducedMotion();
  const [expanded, setExpanded] = useState(false);
  const isWarm = theme === 'v2';

  const active_style = isWarm
    ? 'border-[rgba(140,90,40,0.60)] bg-[rgba(180,100,20,0.20)] text-[#2A1A08] shadow-[0_0_18px_rgba(180,100,20,0.35)]'
    : 'border-white/50 bg-white/15 text-white shadow-[0_0_18px_rgba(255,255,255,0.20)]';

  const inactive_style = isWarm
    ? 'border-[rgba(140,90,40,0.30)] bg-[rgba(255,248,238,0.90)] text-[#2A1A08] shadow-[0_4px_24px_rgba(100,60,20,0.18)] hover:bg-[rgba(255,243,228,0.96)]'
    : 'border-white/20 bg-black/50 text-white shadow-[0_4px_24px_rgba(0,0,0,0.5)] hover:border-white/40 hover:bg-black/70';

  return (
    <motion.button
      onClick={() => setDyslexia(!dyslexia)}
      onHoverStart={() => setExpanded(true)}
      onHoverEnd={() => setExpanded(false)}
      aria-label={dyslexia ? 'Disable dyslexia mode' : 'Enable dyslexia mode'}
      aria-pressed={dyslexia}
      className={[
        'fixed bottom-6 z-[80] flex h-11 items-center justify-end overflow-hidden rounded-full',
        'backdrop-blur-md transition-[border-color,background-color,color,box-shadow] duration-300',
        'md:bottom-8',
        dyslexia ? active_style : inactive_style,
      ].join(' ')}
      style={{ right: '5.5rem' }}
      animate={{ width: expanded ? 'auto' : 44 }}
      transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 340, damping: 28 }}
    >
      <AnimatePresence>
        {expanded && (
          <motion.span
            key="label"
            initial={reduceMotion ? false : { opacity: 0, x: 6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 4 }}
            transition={{ duration: 0.15 }}
            className="pl-4 pr-1 text-[13px] font-semibold whitespace-nowrap"
          >
            Dyslexia Mode
          </motion.span>
        )}
      </AnimatePresence>
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center text-[15px] font-bold${dyslexia ? ' dyslexia-toggle-preview' : ''}`}
        style={dyslexia ? {} : { fontFamily: "'OpenDyslexic', sans-serif" }}
      >
        D
      </span>
    </motion.button>
  );
}
