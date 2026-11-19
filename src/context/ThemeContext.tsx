import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ThemeMode } from '../types/blog';

interface ThemeContextValue {
  theme: ThemeMode;
  toggleTheme: (e?: React.MouseEvent) => void;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'dark';
    const saved = window.localStorage.getItem('wuji-theme');
    return saved === 'light' || saved === 'dark' ? saved : 'dark';
  });

  const applyTheme = useCallback((next: ThemeMode) => {
    document.documentElement.setAttribute('data-theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
    try {
      window.localStorage.setItem('wuji-theme', next);
    } catch {
      // ignore storage restrictions
    }
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  const setTheme = useCallback(
    (next: ThemeMode) => {
      setThemeState(next);
      applyTheme(next);
    },
    [applyTheme]
  );

  const toggleTheme = useCallback(
    (event?: React.MouseEvent) => {
      const next: ThemeMode = theme === 'dark' ? 'light' : 'dark';
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const docWithTransition = document as Document & {
        startViewTransition?: (cb: () => void) => { ready: Promise<void> };
      };

      if (!docWithTransition.startViewTransition || prefersReducedMotion || !event) {
        setTheme(next);
        return;
      }

      const x = event.clientX;
      const y = event.clientY;
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const transition = docWithTransition.startViewTransition(() => {
        setTheme(next);
      });

      transition.ready
        .then(() => {
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration: 560,
              easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
              pseudoElement: '::view-transition-new(root)',
            }
          );
        })
        .catch(() => {
          // fallback already applied
        });
    },
    [theme, setTheme]
  );

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
