import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('portfolio-theme') || 'v2'; } catch { return 'v2'; }
  });

  useEffect(() => {
    try { localStorage.setItem('portfolio-theme', theme); } catch {}
    if (theme === 'v2') {
      document.documentElement.dataset.theme = 'warm';
    } else {
      delete document.documentElement.dataset.theme;
    }
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
