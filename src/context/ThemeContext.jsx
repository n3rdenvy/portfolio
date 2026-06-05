import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('portfolio-theme') || 'v2'; } catch { return 'v2'; }
  });

  const [dyslexia, setDyslexia] = useState(() => {
    try { return localStorage.getItem('portfolio-dyslexia') === 'true'; } catch { return false; }
  });

  useEffect(() => {
    try { localStorage.setItem('portfolio-theme', theme); } catch {}
    if (theme === 'v2') {
      document.documentElement.dataset.theme = 'warm';
    } else {
      delete document.documentElement.dataset.theme;
    }
  }, [theme]);

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
