import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Clock, Search, SlidersHorizontal, Tag, X } from 'lucide-react';
import { allPosts, getAllCategories, getAllTags } from '../lib/posts';
import { SpotlightCard } from '../components/SpotlightCard';

export const BlogListPage: React.FC = () => {
  const navigate = useNavigate();
  const categories = useMemo(() => ['全部', ...getAllCategories()], []);
  const allTags = useMemo(() => getAllTags(), []);

  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'longest'>('newest');

  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = allPosts.filter((post) => {
      if (selectedCategory !== '全部' && post.category !== selectedCategory) return false;
      if (selectedTag && !post.tags.includes(selectedTag)) return false;
      if (q) {
        const hay = `${post.title} ${post.summary} ${post.category} ${post.tags.join(' ')} ${post.content}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    if (sortBy === 'longest') {
      return [...list].sort((a, b) => b.wordCount - a.wordCount);
    }
    return list;
  }, [selectedCategory, selectedTag, query, sortBy]);

  return (
    <div className="relative z-10 mx-auto max-w-6xl px-6 pt-32 pb-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="max-w-2xl space-y-3"
      >
        <div
          className="font-mono-code text-xs tracking-[0.22em] uppercase"
          style={{ color: 'var(--accent-1)' }}
        >
          Writing Archive · 全部文章
        </div>
        <h1 className="font-serif-cn text-4xl font-black tracking-tight sm:text-5xl">
          无极博客
        </h1>
        <p className="text-sm leading-relaxed sm:text-base" style={{ color: 'var(--text-secondary)' }}>
          记录工程实践、动效设计、效率工具与随笔思考。支持按专栏、标签或全文关键词即时检索。
        </p>
      </motion.div>

      {/* Filter & Search Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.08 }}
        className="glass-panel mt-10 space-y-5 rounded-2xl p-5"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Category Spring Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className="relative rounded-xl px-3.5 py-1.5 text-sm font-medium transition-colors"
                  style={{
                    color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                  }}
                >
                  {active && (
                    <motion.span
                      layoutId="blog-category-pill"
                      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                      className="absolute inset-0 -z-10 rounded-xl"
                      style={{
                        background: 'var(--accent-soft)',
                        border: '1px solid color-mix(in srgb, var(--accent-1) 45%, transparent)',
                      }}
                    />
                  )}
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search & Sort */}
          <div className="flex flex-wrap items-center gap-3">
            <div
              className="flex flex-1 items-center gap-2 rounded-xl px-3.5 py-2 sm:w-64 sm:flex-none"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <Search className="h-4 w-4 shrink-0" style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="筛选标题或关键词..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--text-muted)]"
                style={{ color: 'var(--text-primary)' }}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="清空"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setSortBy((s) => (s === 'newest' ? 'longest' : 'newest'))}
              className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-medium transition-colors hover:border-[var(--accent-1)]"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
              }}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" style={{ color: 'var(--accent-1)' }} />
              {sortBy === 'newest' ? '按时间最新' : '按深度篇幅'}
            </button>
          </div>
        </div>

        {/* Tags Cloud */}
        <div
          className="flex flex-wrap items-center gap-2 border-t pt-4"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <span className="inline-flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
            <Tag className="h-3.5 w-3.5" />
            标签：
          </span>
          {allTags.map(({ tag, count }) => {
            const active = selectedTag === tag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(active ? null : tag)}
                className="rounded-lg px-2.5 py-1 text-xs transition-all"
                style={{
                  background: active ? 'var(--accent-1)' : 'var(--bg-secondary)',
                  color: active ? '#ffffff' : 'var(--text-secondary)',
                  border: `1px solid ${active ? 'transparent' : 'var(--border-subtle)'}`,
                }}
              >
                #{tag} <span className="opacity-70">{count}</span>
              </button>
            );
          })}
          {(selectedCategory !== '全部' || selectedTag || query) && (
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('全部');
                setSelectedTag(null);
                setQuery('');
              }}
              className="ml-auto text-xs underline"
              style={{ color: 'var(--accent-1)' }}
            >
              重置筛选
            </button>
          )}
        </div>
      </motion.div>

      {/* Post Grid */}
      <div className="mt-10">
        {filteredPosts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-panel rounded-2xl py-20 text-center"
          >
            <p className="text-base font-medium">没有匹配的文章</p>
            <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
              试试切换分类或清空搜索关键词
            </p>
          </motion.div>
        ) : (
          <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredPosts.map((post) => (
                <motion.div
                  layout
                  key={post.slug}
                  initial={{ opacity: 0, scale: 0.96, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.35 }}
                >
                  <SpotlightCard
                    accent={post.accent}
                    onClick={() => navigate(`/blog/${post.slug}`)}
                    className="flex h-full cursor-pointer flex-col justify-between p-6"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs">
                        <span
                          className="rounded-full px-2.5 py-0.5 font-medium"
                          style={{
                            background: `color-mix(in srgb, ${post.accent || 'var(--accent-1)'} 16%, transparent)`,
                            color: post.accent || 'var(--accent-1)',
                          }}
                        >
                          {post.category}
                        </span>
                        <span className="font-mono-code" style={{ color: 'var(--text-muted)' }}>
                          {post.date}
                        </span>
                      </div>

                      <h2 className="font-serif-cn mt-4 text-xl font-bold leading-snug transition-colors group-hover:text-[var(--accent-1)]">
                        {post.title}
                      </h2>

                      <p
                        className="mt-3 line-clamp-3 text-sm leading-relaxed"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {post.summary}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md px-2 py-0.5 text-[11px]"
                            style={{
                              background: 'var(--bg-secondary)',
                              color: 'var(--text-muted)',
                            }}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div
                      className="mt-6 flex items-center justify-between border-t pt-4 text-xs"
                      style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {post.readingMinutes} 分钟 · {post.wordCount} 字
                      </span>
                      <span
                        className="inline-flex items-center gap-1 font-medium transition-transform group-hover:translate-x-1"
                        style={{ color: 'var(--accent-1)' }}
                      >
                        全文
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </SpotlightCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};
