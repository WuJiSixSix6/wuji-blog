import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { allPosts, getBlogMetrics } from '../lib/posts';

export const ArchivePage: React.FC = () => {
  const metrics = getBlogMetrics();

  const grouped = useMemo(() => {
    const map = new Map<string, typeof allPosts>();
    for (const post of allPosts) {
      const year = post.date.slice(0, 4) || '2026';
      const arr = map.get(year) || [];
      arr.push(post);
      map.set(year, arr);
    }
    return Array.from(map.entries()).sort((a, b) => (a[0] < b[0] ? 1 : -1));
  }, []);

  return (
    <div className="relative z-10 mx-auto max-w-4xl px-6 pt-32 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="space-y-3"
      >
        <div
          className="font-mono-code text-xs tracking-[0.22em] uppercase"
          style={{ color: 'var(--accent-1)' }}
        >
          Timeline · 时间归档
        </div>
        <h1 className="font-serif-cn text-4xl font-black tracking-tight sm:text-5xl">
          时光印记
        </h1>
        <p className="text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>
          截至目前共沉淀 <strong style={{ color: 'var(--text-primary)' }}>{metrics.totalPosts}</strong> 篇文章，
          累计约 <strong style={{ color: 'var(--text-primary)' }}>{metrics.totalWords.toLocaleString()}</strong> 字。
        </p>
      </motion.div>

      <div className="mt-14 space-y-14">
        {grouped.map(([year, posts]) => (
          <section key={year} className="relative">
            <div className="mb-6 flex items-baseline gap-3">
              <h2 className="font-mono-code text-aurora text-3xl font-bold">{year}</h2>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {posts.length} 篇文章
              </span>
            </div>

            <div
              className="relative space-y-4 border-l-2 pl-6 sm:pl-8"
              style={{ borderColor: 'var(--border-subtle)' }}
            >
              {posts.map((post, idx) => (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.45, delay: idx * 0.06 }}
                  className="relative"
                >
                  {/* Glowing timeline dot */}
                  <span
                    className="absolute top-6 -left-[31px] h-3.5 w-3.5 rounded-full border-2 sm:-left-[39px]"
                    style={{
                      background: post.accent || 'var(--accent-1)',
                      borderColor: 'var(--bg-primary)',
                      boxShadow: `0 0 14px ${post.accent || 'var(--accent-1)'}`,
                    }}
                  />

                  <Link
                    to={`/blog/${post.slug}`}
                    className="glass-panel group block rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--accent-1)]"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-3" style={{ color: 'var(--text-muted)' }}>
                        <span className="inline-flex items-center gap-1 font-mono-code">
                          <Calendar className="h-3.5 w-3.5" />
                          {post.date}
                        </span>
                        <span
                          className="rounded-full px-2 py-0.5 font-medium"
                          style={{
                            background: `color-mix(in srgb, ${post.accent || 'var(--accent-1)'} 16%, transparent)`,
                            color: post.accent || 'var(--accent-1)',
                          }}
                        >
                          {post.category}
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                        <Clock className="h-3.5 w-3.5" />
                        {post.readingMinutes} 分钟
                      </span>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between gap-4">
                      <h3 className="font-serif-cn text-lg font-bold transition-colors group-hover:text-[var(--accent-1)]">
                        {post.title}
                      </h3>
                      <ArrowRight
                        className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1"
                        style={{ color: 'var(--accent-1)' }}
                      />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};
