import { motion, useReducedMotion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

// V1 — organic blob shape (the original FluidBlob feel)
function BlobIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden fill="currentColor">
      <path d="M20 10c1.5 3 1 7-1.5 9.5S13 22 10 21s-6-3-7-7 1-8 4-10 7-2 9 0 2.5 3 4 6z" />
    </svg>
  );
}

// V2 — nested arcs suggesting the ceramic seifert shell form
function ShellIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden fill="none">
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        d="M12 3C7.6 3 4 6.5 4 11c0 4 2.8 7.5 7 9"
      />
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        d="M12 7.5C9.5 7.5 7.5 9.5 7.5 12c0 1.8 1 3.4 2.5 4.2"
      />
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        d="M12 12c-.8 0-1.5.6-1.2 1.5"
      />
    </svg>
  );
}

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const reduceMotion = useReducedMotion();
  const isV2 = theme === 'v2';

  return (
    <motion.button
      onClick={() => setTheme(isV2 ? 'v1' : 'v2')}
      aria-label={`Switch to ${isV2 ? 'V1 dark mode' : 'V2 warm mode'}`}
      className={[
        'fixed bottom-6 right-6 z-[80] flex h-11 w-11 items-center justify-center rounded-full',
        'backdrop-blur-md transition-[border-color,background-color,color] duration-300',
        'md:bottom-8 md:right-8',
        isV2
          ? 'border border-[rgba(140,90,40,0.30)] bg-[rgba(255,248,238,0.90)] text-[#2A1A08] shadow-[0_4px_24px_rgba(100,60,20,0.18)] hover:bg-[rgba(255,243,228,0.96)]'
          : 'border border-white/20 bg-black/50 text-white shadow-[0_4px_24px_rgba(0,0,0,0.5)] hover:border-white/40 hover:bg-black/70',
      ].join(' ')}
      whileHover={reduceMotion ? {} : { scale: 1.1 }}
      whileTap={reduceMotion ? {} : { scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {/* Show icon for the mode you can switch TO */}
      <motion.span
        key={theme}
        initial={reduceMotion ? false : { opacity: 0, rotate: -15, scale: 0.8 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="flex items-center justify-center"
      >
        {isV2 ? <BlobIcon /> : <ShellIcon />}
      </motion.span>
    </motion.button>
  );
}
