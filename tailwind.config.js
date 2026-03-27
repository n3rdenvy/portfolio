/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        satoshi: ['Satoshi', 'sans-serif'],
      },
      colors: {
        /**
         * Page background follows `data-bg-depth` on `<html>` (see index.css).
         * RGB channels only — supports opacity modifiers e.g. `bg-slateBg/90`.
         */
        slateBg: 'rgb(var(--color-slate-bg) / <alpha-value>)',
        slateGlass: 'rgba(255, 255, 255, 0.05)',
        textPrimary: '#F8FAFC',
        textSecondary: '#94A3B8',
        accent: '#38BDF8',
        /** Alias for legacy class names */
        cerulean: '#38BDF8',
        clay: {
          bg: '#F2EFED',
          infill: '#F9F8F7',
          border: '#FFFFFF',
        },
        slate: {
          /** Fixed ink for text on accent / clay (deepest ocean tone) */
          bg: '#0A1820',
          glass: 'rgba(255, 255, 255, 0.05)',
          edge: 'rgba(255, 255, 255, 0.1)',
        },
      },
      boxShadow: {
        'clay-flat': 'inset 0 1px 1px 0 rgba(255,255,255,1), 0 2px 4px 0 rgba(0,0,0,0.03)',
        'slate-glass': '0 8px 32px 0 rgba(0, 0, 0, 0.45), inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
      },
      backdropBlur: {
        glass: '12px',
      },
    },
  },
  plugins: [],
};
