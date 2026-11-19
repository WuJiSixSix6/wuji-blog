import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Clock,
  Code2,
  Compass,
  Feather,
  Layers,
  Sparkles,
  Tag,
} from 'lucide-react';
import { allPosts, getBlogMetrics } from '../lib/posts';
import { WuJiOrbital } from '../components/WuJiOrbital';
import { MagneticButton } from '../components/MagneticButton';
import { SpotlightCard } from '../components/SpotlightCard';

const phrases = [
  '以代码构筑秩序，以文字安放思考',
  '探索交互动效、工程架构与极简美学',
  '无极而太极，在数字花园中持续生长',
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [typed, setTyped] = useState('');
  const [deleting, setDeleting] = useState(false);

  const metrics = getBlogMetrics();
  const featuredPosts = allPosts.filter((p) => p.featured).slice(0, 3);
  const displayFeatured = featuredPosts.length > 0 ? featuredPosts : allPosts.slice(0, 3);

  useEffect(() => {
    const current = phrases[phraseIdx];
    let timeout: number;

    if (!deleting && typed.length < current.length) {
      timeout = window.setTimeout(() => setTyped(current.slice(0, typed.length + 1)), 62);
    } else if (!deleting && typed.length === current.length) {
      timeout = window.setTimeout(() => setDeleting(true), 2400);
    } else if (deleting && typed.length > 0) {
      timeout = window.setTimeout(() => setTyped(current.slice(0, typed.length - 1)), 32);
    } else {
      setDeleting(false);
      setPhraseIdx((prev) => (prev + 1) % phrases.length);
    }

    return () => window.clearTimeout(timeout);
  }, [typed, deleting, phraseIdx]);

  return (
    <div className="relative z-10">
      {/* HERO SECTION */}
      <section className="mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-center px-6 pt-28 pb-16 lg:pt-32">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          {/* Left Hero Copy */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-7 lg:col-span-7"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2.5">
              <span
                className="glass-panel inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium"
                style={{ color: 'var(--text-secondary)' }}
              >
                <span className="relative flex h-2 w-2">
                  <span
                    className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                    style={{ background: 'var(--accent-1)' }}
                  />
                  <span
                    className="relative inline-flex h-2 w-2 rounded-full"
                    style={{ background: 'var(--accent-1)' }}
                  />
                </span>
                WuJi Digital Garden · 持续更新中
              </span>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-3">
              <h1 className="font-serif-cn text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl lg:leading-[1.15]">
                你好，我是{' '}
                <span className="text-aurora inline-block">无极</span>
                <span
                  className="font-mono-code ml-3 inline-block align-middle text-xl font-medium tracking-widest sm:text-2xl"
                  style={{ color: 'var(--text-muted)' }}
                >
                  / WuJi
                </span>
              </h1>
              <div
                className="flex min-h-[2rem] items-center text-base font-medium sm:text-xl"
                style={{ color: 'var(--text-secondary)' }}
              >
                <span>{typed}</span>
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.9, repeat: Infinity }}
                  className="ml-1 inline-block h-5 w-[2px] rounded-full"
                  style={{ background: 'var(--accent-1)' }}
                />
              </div>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="max-w-xl text-sm leading-relaxed sm:text-base"
              style={{ color: 'var(--text-secondary)' }}
            >
              欢迎来到我的个人空间。这里没有算法推荐的喧嚣，只有关于前端动效、系统架构、效率工具与独立思考的长文记录。愿每一行代码与每一段文字，都能经受时间的打磨。
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 pt-1">
              <MagneticButton
                onClick={() => navigate('/blog')}
                className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all"
              >
                <span
                  className="absolute inset-0 -z-10 transition-transform duration-300 group-hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, var(--accent-1), var(--accent-2), var(--accent-3))',
                  }}
                />
                <BookOpen className="h-4 w-4" />
                <span>开始阅读博客</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </MagneticButton>

              <MagneticButton
                onClick={() => navigate('/archive')}
                className="glass-panel inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-colors hover:border-[var(--accent-1)]"
              >
                <Compass className="h-4 w-4" style={{ color: 'var(--accent-1)' }} />
                <span>浏览时间归档</span>
              </MagneticButton>
            </motion.div>

            {/* Quick Stats Pill Row */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-6 pt-3 text-xs sm:text-sm"
              style={{ color: 'var(--text-muted)' }}
            >
              <div className="flex items-center gap-2">
                <span className="font-mono-code text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  {metrics.totalPosts}
                </span>
                <span>篇原创文章</span>
              </div>
              <span className="h-3.5 w-px" style={{ background: 'var(--border-strong)' }} />
              <div className="flex items-center gap-2">
                <span className="font-mono-code text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  {(metrics.totalWords / 1000).toFixed(1)}k+
                </span>
                <span>累计字数</span>
              </div>
              <span className="h-3.5 w-px" style={{ background: 'var(--border-strong)' }} />
              <div className="flex items-center gap-2">
                <span className="font-mono-code text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  {metrics.totalCategories}
                </span>
                <span>大内容专栏</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Hero Orbital Emblem */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
            className="lg:col-span-5"
          >
            <WuJiOrbital />
          </motion.div>
        </div>
      </section>

      {/* BENTO PHILOSOPHY & FOCUS STRIP */}
      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-4 md:grid-cols-12">
          <SpotlightCard className="p-6 md:col-span-5" accent="var(--accent-1)">
            <div className="flex items-center gap-2 text-xs font-medium tracking-wider uppercase" style={{ color: 'var(--accent-1)' }}>
              <Feather className="h-4 w-4" />
              无极之道 · Philosophy
            </div>
            <h3 className="font-serif-cn mt-3 text-xl font-bold">
              「大道至简，动静相宜」
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              追求克制而有生命力的界面设计。优秀的博客不止承载文字，更应通过细腻的排版、柔和的光影与恰到好处的微交互，让阅读本身成为一种享受。
            </p>
          </SpotlightCard>

          <SpotlightCard className="p-6 md:col-span-4" accent="var(--accent-2)">
            <div className="flex items-center gap-2 text-xs font-medium tracking-wider uppercase" style={{ color: 'var(--accent-2)' }}>
              <Code2 className="h-4 w-4" />
              探索领域 · Craft
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {['React & TS', 'Motion 动效', 'Canvas / WebGL', '系统架构', 'Linux 运维', '设计工程', '写作方法论'].map(
                (skill) => (
                  <span
                    key={skill}
                    className="rounded-lg px-2.5 py-1 text-xs font-medium"
                    style={{
                      background: 'var(--accent-soft)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    {skill}
                  </span>
                )
              )}
            </div>
          </SpotlightCard>

          <SpotlightCard className="p-6 md:col-span-3" accent="var(--accent-3)">
            <div className="flex items-center gap-2 text-xs font-medium tracking-wider uppercase" style={{ color: 'var(--accent-3)' }}>
              <Layers className="h-4 w-4" />
              双主题美学
            </div>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              点击右上角切换 <strong style={{ color: 'var(--text-primary)' }}>暗夜无极</strong> 与{' '}
              <strong style={{ color: 'var(--text-primary)' }}>宣纸水墨</strong>，体验圆形扩散视觉过渡与动态星流背景。
            </p>
          </SpotlightCard>
        </div>
      </section>

      {/* FEATURED ARTICLES */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55 }}
          className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"
        >
          <div>
            <div
              className="flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase"
              style={{ color: 'var(--accent-1)' }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Featured Essays
            </div>
            <h2 className="font-serif-cn mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              精选文章
            </h2>
          </div>
          <Link
            to="/blog"
            className="group inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-[var(--accent-1)]"
            style={{ color: 'var(--text-secondary)' }}
          >
            查看全部文章
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {displayFeatured.map((post, index) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
            >
              <SpotlightCard
                accent={post.accent}
                onClick={() => navigate(`/blog/${post.slug}`)}
                className="flex h-full cursor-pointer flex-col justify-between p-6"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs">
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

                  <h3 className="font-serif-cn mt-4 text-xl font-bold leading-snug transition-colors group-hover:text-[var(--accent-1)]">
                    {post.title}
                  </h3>

                  <p
                    className="mt-3 line-clamp-3 text-sm leading-relaxed"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {post.summary}
                  </p>
                </div>

                <div
                  className="mt-6 flex items-center justify-between border-t pt-4 text-xs"
                  style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {post.readingMinutes} 分钟
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Tag className="h-3.5 w-3.5" />
                      {post.tags[0] || '随笔'}
                    </span>
                  </div>
                  <span
                    className="inline-flex items-center gap-1 font-medium transition-transform group-hover:translate-x-1"
                    style={{ color: 'var(--accent-1)' }}
                  >
                    阅读
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* RECENT STREAM */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <div
              className="font-mono-code text-xs tracking-[0.2em] uppercase"
              style={{ color: 'var(--text-muted)' }}
            >
              Latest Stream
            </div>
            <h2 className="font-serif-cn mt-1.5 text-2xl font-bold sm:text-3xl">近期更新</h2>
          </div>
          <span className="font-mono-code text-xs" style={{ color: 'var(--text-muted)' }}>
            共 {allPosts.length} 篇
          </span>
        </div>

        <div className="space-y-3">
          {allPosts.map((post, idx) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
            >
              <Link
                to={`/blog/${post.slug}`}
                className="glass-panel group flex flex-col justify-between gap-4 rounded-2xl px-6 py-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--accent-1)] sm:flex-row sm:items-center"
              >
                <div className="min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <span className="inline-flex items-center gap-1 font-mono-code">
                      <Calendar className="h-3.5 w-3.5" />
                      {post.date}
                    </span>
                    <span>·</span>
                    <span style={{ color: post.accent || 'var(--accent-1)' }}>{post.category}</span>
                    <span>·</span>
                    <span>{post.wordCount} 字</span>
                  </div>
                  <h3 className="font-serif-cn truncate text-lg font-bold transition-colors group-hover:text-[var(--accent-1)]">
                    {post.title}
                  </h3>
                  <p className="line-clamp-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {post.summary}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <div className="hidden flex-wrap gap-1.5 lg:flex">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md px-2 py-0.5 text-[11px]"
                        style={{
                          background: 'var(--bg-secondary)',
                          color: 'var(--text-secondary)',
                          border: '1px solid var(--border-subtle)',
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-xl transition-all group-hover:translate-x-1"
                    style={{
                      background: 'var(--accent-soft)',
                      color: 'var(--accent-1)',
                    }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};
