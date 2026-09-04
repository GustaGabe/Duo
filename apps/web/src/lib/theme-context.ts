import { createContext, use } from 'react';

export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'duo-theme';

export interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
  set: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const context = use(ThemeContext);
  if (!context) throw new Error('useTheme must be used inside <ThemeProvider>.');
  return context;
}
