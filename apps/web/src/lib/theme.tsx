import { useCallback, useEffect, useMemo, useState } from 'react';

import { THEME_STORAGE_KEY, ThemeContext, type Theme, type ThemeContextValue } from './theme-context';

function readInitialTheme(): Theme {
  // index.html already applied the theme before first paint; we just read it back.
  const applied = document.documentElement.dataset.theme;
  if (applied === 'dark' || applied === 'light') return applied;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(readInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Private browsing or blocked storage: the theme just won't survive the session.
    }
  }, [theme]);

  // Until someone picks explicitly, follow the system preference.
  useEffect(() => {
    let chosen = false;
    try {
      chosen = localStorage.getItem(THEME_STORAGE_KEY) !== null;
    } catch {
      chosen = false;
    }
    if (chosen) return;

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (event: MediaQueryListEvent) => setTheme(event.matches ? 'dark' : 'light');
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const set = useCallback((next: Theme) => setTheme(next), []);
  const toggle = useCallback(() => setTheme((current) => (current === 'dark' ? 'light' : 'dark')), []);
  const value = useMemo<ThemeContextValue>(() => ({ theme, toggle, set }), [theme, toggle, set]);

  return <ThemeContext value={value}>{children}</ThemeContext>;
}
