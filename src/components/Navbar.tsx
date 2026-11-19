import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sun, Moon, Menu, X, Github, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { WuJiLogo } from './WuJiLogo';

interface NavbarProps {
  onOpenSearch: () => void;
}

const navItems = [
  { path: '/', label: '首页', en: 'Home' },
  { path: '/blog', label: '博客', en: 'Blog' },
  { path: '/archive', label: '归档', en: 'Archive' },
  { path: '/about', label: '关于', en: 'About' },
];

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <motion.nav
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-300 sm:px-5 ${
          scrolled
            ? 'glass-panel shadow-xl'
            : 'border border-transparent bg-transparent'
        }`}
      >
        {/* Brand */}
        <Link
          to="/"
          className="group flex items-center gap-3 focus:outline-none"
        >
          <WuJiLogo size={36} />
          <div className="flex flex-col leading-tight">
            <span className="font-serif-cn text-base font-bold tracking-wider transition-colors group-hover:text-[var(--accent-1)]">
              无极
            </span>
            <span
              className="font-mono-code text-[10px] tracking-[0.22em] uppercase"
              style={{ color: 'var(--text-muted)' }}
            >
              WuJi · Blog
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div
          className="hidden items-center gap-1 rounded-full p-1 md:flex"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
                style={{
                  color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
              >
                {active && (
                  <motion.span
                    layoutId="nav-active-pill"
                    transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                    className="absolute inset-0 -z-10 rounded-full"
                    style={{
                      background:
                        'linear-gradient(135deg, color-mix(in srgb, var(--accent-1) 22%, transparent), color-mix(in srgb, var(--accent-3) 20%, transparent))',
                      border: '1px solid color-mix(in srgb, var(--accent-1) 42%, transparent)',
                    }}
                  />
                )}
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenSearch}
            className="group flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs transition-all hover:scale-[1.02]"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
            }}
            aria-label="搜索文章"
          >
            <Search className="h-3.5 w-3.5 transition-colors group-hover:text-[var(--accent-1)]" />
            <span className="hidden sm:inline">搜索</span>
            <kbd
              className="font-mono-code hidden rounded px-1.5 py-0.5 text-[10px] sm:inline"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)',
              }}
            >
              ⌘K
            </kbd>
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl transition-all hover:scale-105"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
            }}
            aria-label={theme === 'dark' ? '切换至宣纸水墨主题' : '切换至暗夜无极主题'}
            title={theme === 'dark' ? '切换至宣纸水墨主题' : '切换至暗夜无极主题'}
          >
            <AnimatePresence mode="wait" initial={false}>
              {theme === 'dark' ? (
                <motion.span
                  key="sun"
                  initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.22 }}
                >
                  <Sun className="h-4 w-4 text-amber-300" />
                </motion.span>
              ) : (
                <motion.span
                  key="moon"
                  initial={{ rotate: 90, opacity: 0, scale: 0.6 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: -90, opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.22 }}
                >
                  <Moon className="h-4 w-4 text-indigo-700" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <a
            href="https://github.com/WuJiSixSix6"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-9 w-9 items-center justify-center rounded-xl transition-all hover:scale-105 sm:flex"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
            }}
            aria-label="GitHub"
          >
            <Github className="h-4 w-4" />
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-xl md:hidden"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
            }}
            aria-label="菜单"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            className="glass-panel mx-auto mt-2 max-w-6xl rounded-2xl p-3 md:hidden"
          >
            <div className="flex flex-col gap-1">
              {navItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium transition-colors"
                    style={{
                      background: active ? 'var(--accent-soft)' : 'transparent',
                      color: active ? 'var(--accent-1)' : 'var(--text-primary)',
                    }}
                  >
                    <span>{item.label}</span>
                    <span className="font-mono-code text-xs" style={{ color: 'var(--text-muted)' }}>
                      {item.en}
                    </span>
                  </Link>
                );
              })}
              <div
                className="mt-2 flex items-center justify-between border-t pt-2.5 px-2 text-xs"
                style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" style={{ color: 'var(--accent-1)' }} />
                  {theme === 'dark' ? '暗夜无极主题' : '宣纸水墨主题'}
                </span>
                <a
                  href="https://github.com/WuJiSixSix6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:underline"
                  style={{ color: 'var(--accent-1)' }}
                >
                  <Github className="h-3.5 w-3.5" />
                  GitHub
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
