import { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const ThemeContext = createContext(null);

/** Routes that are hardcoded dark — the warm `data-theme` overrides would repaint
 *  their `text-white*` classes dark-on-dark, so warm is suppressed while on them. */
const FORCED_DARK_ROUTES = ['/nerds-only'];

export function ThemeProvider({ children }) {
  const { pathname } = useLocation();
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('portfolio-theme') || 'v2'; } catch { return 'v2'; }
  });

  const [dyslexia, setDyslexia] = useState(() => {
    try { return localStorage.getItem('portfolio-dyslexia') === 'true'; } catch { return false; }
  });

  const warmSuppressed = FORCED_DARK_ROUTES.includes(pathname);

  useEffect(() => {
    try { localStorage.setItem('portfolio-theme', theme); } catch {}
    if (theme === 'v2' && !warmSuppressed) {
      document.documentElement.dataset.theme = 'warm';
    } else {
      delete document.documentElement.dataset.theme;
    }
  }, [theme, warmSuppressed]);

  useEffect(() => {
    try { localStorage.setItem('portfolio-dyslexia', dyslexia); } catch {}
    if (dyslexia) {
      document.documentElement.classList.add('dyslexia');
    } else {
      document.documentElement.classList.remove('dyslexia');
    }
  }, [dyslexia]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, dyslexia, setDyslexia }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
