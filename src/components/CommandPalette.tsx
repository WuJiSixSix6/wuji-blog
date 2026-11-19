import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText, ArrowRight, Sun, Moon, Compass, Sparkles, X } from 'lucide-react';
import { allPosts } from '../lib/posts';
import { useTheme } from '../context/ThemeContext';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ open, onClose }) => {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [open]);

  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allPosts;
    return allPosts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.content.toLowerCase().includes(q)
    );
  }, [query]);

  const quickActions = useMemo(
    () => [
      {
        id: 'action-theme',
        label: theme === 'dark' ? '切换为「宣纸水墨」浅色主题' : '切换为「暗夜无极」深色主题',
        icon: theme === 'dark' ? Sun : Moon,
        run: () => {
          toggleTheme();
          onClose();
        },
      },
      {
        id: 'action-blog',
        label: '浏览全部博客文章',
        icon: Compass,
        run: () => {
          navigate('/blog');
          onClose();
        },
      },
      {
        id: 'action-about',
        label: '关于 无极 (WuJi)',
        icon: Sparkles,
        run: () => {
          navigate('/about');
          onClose();
        },
      },
    ],
    [theme, toggleTheme, navigate, onClose]
  );

  const totalItems = filteredPosts.length + quickActions.length;

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => (totalItems > 0 ? (prev + 1) % totalItems : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => (totalItems > 0 ? (prev - 1 + totalItems) % totalItems : 0));
      } else if (e.key === 'Enter' && totalItems > 0) {
        e.preventDefault();
        if (activeIndex < filteredPosts.length) {
          navigate(`/blog/${filteredPosts[activeIndex].slug}`);
          onClose();
        } else {
          const action = quickActions[activeIndex - filteredPosts.length];
          action?.run();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, activeIndex, filteredPosts, quickActions, totalItems, navigate, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh]"
          style={{ background: 'rgba(2, 6, 23, 0.65)', backdropFilter: 'blur(8px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl overflow-hidden rounded-2xl shadow-2xl"
            style={{
              background: 'var(--bg-elevated-strong)',
              border: '1px solid var(--border-strong)',
            }}
          >
            {/* Search Input */}
            <div
              className="flex items-center gap-3 border-b px-4 py-3.5"
              style={{ borderColor: 'var(--border-subtle)' }}
            >
              <Search className="h-4.5 w-4.5 shrink-0" style={{ color: 'var(--accent-1)' }} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索文章标题、标签、分类或全文关键词..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--text-muted)]"
                style={{ color: 'var(--text-primary)' }}
              />
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1 transition-colors hover:bg-[var(--accent-soft)]"
                style={{ color: 'var(--text-muted)' }}
                aria-label="关闭搜索"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[58vh] overflow-y-auto p-2">
              <div className="px-2.5 py-1.5 text-[11px] font-medium tracking-wider uppercase" style={{ color: 'var(--text-muted)' }}>
                文章 ({filteredPosts.length})
              </div>
              {filteredPosts.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                  未找到包含 “{query}” 的文章
                </div>
              ) : (
                filteredPosts.map((post, idx) => {
                  const isSelected = activeIndex === idx;
                  return (
                    <button
                      key={post.slug}
                      type="button"
                      onMouseEnter={() => setActiveIndex(idx)}
                      onClick={() => {
                        navigate(`/blog/${post.slug}`);
                        onClose();
                      }}
                      className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition-colors"
                      style={{
                        background: isSelected ? 'var(--accent-soft)' : 'transparent',
                      }}
                    >
                      <div className="flex min-w-0 items-start gap-3">
                        <FileText
                          className="mt-0.5 h-4 w-4 shrink-0"
                          style={{ color: isSelected ? 'var(--accent-1)' : 'var(--text-muted)' }}
                        />
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                            {post.title}
                          </div>
                          <div className="mt-0.5 flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                            <span>{post.category}</span>
                            <span>·</span>
                            <span>{post.date}</span>
                            <span>·</span>
                            <span>{post.readingMinutes} 分钟</span>
                          </div>
                        </div>
                      </div>
                      <ArrowRight
                        className="h-3.5 w-3.5 shrink-0 transition-transform"
                        style={{
                          color: isSelected ? 'var(--accent-1)' : 'var(--text-muted)',
                          transform: isSelected ? 'translateX(2px)' : 'none',
                        }}
                      />
                    </button>
                  );
                })
              )}

              <div
                className="mt-2 border-t px-2.5 pt-2.5 pb-1.5 text-[11px] font-medium tracking-wider uppercase"
                style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
              >
                快捷指令
              </div>
              {quickActions.map((action, idx) => {
                const combinedIdx = filteredPosts.length + idx;
                const isSelected = activeIndex === combinedIdx;
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    type="button"
                    onMouseEnter={() => setActiveIndex(combinedIdx)}
                    onClick={action.run}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors"
                    style={{
                      background: isSelected ? 'var(--accent-soft)' : 'transparent',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <span className="flex items-center gap-3">
                      <Icon
                        className="h-4 w-4"
                        style={{ color: isSelected ? 'var(--accent-1)' : 'var(--text-muted)' }}
                      />
                      {action.label}
                    </span>
                    <ArrowRight
                      className="h-3.5 w-3.5"
                      style={{ color: isSelected ? 'var(--accent-1)' : 'var(--text-muted)' }}
                    />
                  </button>
                );
              })}
            </div>

            {/* Footer Hints */}
            <div
              className="flex items-center justify-between border-t px-4 py-2 text-[11px]"
              style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
            >
              <div className="flex items-center gap-3">
                <span>↑↓ 切换</span>
                <span>↵ 打开</span>
                <span>ESC 关闭</span>
              </div>
              <span className="font-mono-code">WuJi Command</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
