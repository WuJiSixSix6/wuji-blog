import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  Clock,
  FileText,
  List,
  Share2,
  Sparkles,
  X,
} from 'lucide-react';
import { allPosts, getPostBySlug } from '../lib/posts';

interface SparkParticle {
  id: number;
  dx: number;
  dy: number;
  color: string;
}

export const PostDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = slug ? getPostBySlug(slug) : undefined;

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 24, restDelta: 0.001 });

  const proseRef = useRef<HTMLDivElement | null>(null);
  const [activeHeading, setActiveHeading] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [claps, setClaps] = useState<number>(0);
  const [sparks, setSparks] = useState<SparkParticle[]>([]);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  // Close lightbox on Escape
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox]);

  // Load saved claps per article
  useEffect(() => {
    if (!post) return;
    try {
      const saved = Number(localStorage.getItem(`wuji-claps-${post.slug}`) || '18');
      setClaps(Number.isFinite(saved) ? saved : 18);
    } catch {
      setClaps(18);
    }
  }, [post]);

  // Code copy, internal SPA wiki-links, and image lightbox click delegation
  useEffect(() => {
    const container = proseRef.current;
    if (!container) return;

    const handleClick = async (e: MouseEvent) => {
      const el = e.target as HTMLElement;

      // 1. Copy code button
      const copyBtn = el.closest<HTMLButtonElement>('[data-copy-code]');
      if (copyBtn) {
        const encoded = copyBtn.getAttribute('data-copy-code') || '';
        const codeText = decodeURIComponent(encoded);
        try {
          await navigator.clipboard.writeText(codeText);
          copyBtn.textContent = 'Copied ✓';
          setTimeout(() => {
            copyBtn.textContent = 'Copy';
          }, 1800);
        } catch {
          copyBtn.textContent = 'Failed';
        }
        return;
      }

      // 2. Internal SPA article link / [[wikilink]]
      const internalLink = el.closest<HTMLAnchorElement>('a[data-internal-href]');
      if (internalLink && !e.metaKey && !e.ctrlKey && !e.shiftKey) {
        const href = internalLink.getAttribute('data-internal-href');
        if (href) {
          e.preventDefault();
          navigate(href);
          return;
        }
      }

      // 3. Image lightbox zoom
      const img = el.closest<HTMLImageElement>('img[data-lightbox-src]');
      if (img) {
        const src = img.getAttribute('data-lightbox-src') || img.src;
        const alt = img.getAttribute('data-lightbox-alt') || img.alt || '';
        setLightbox({ src, alt });
      }
    };

    container.addEventListener('click', handleClick);
    return () => container.removeEventListener('click', handleClick);
  }, [post?.slug, navigate]);

  // Scroll-spy for Table of Contents
  useEffect(() => {
    if (!post || post.toc.length === 0) return;
    setActiveHeading(post.toc[0].id);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        }
      },
      { rootMargin: '-96px 0px -65% 0px', threshold: 0 }
    );

    const headings = post.toc
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [post]);

  if (!post) {
    return (
      <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-6 pt-32 text-center">
        <h1 className="font-serif-cn text-3xl font-bold">文章未找到</h1>
        <p className="mt-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
          这篇文章可能已迁移或尚未发布。
        </p>
        <button
          type="button"
          onClick={() => navigate('/blog')}
          className="mt-6 rounded-xl px-5 py-2.5 text-sm font-medium text-white"
          style={{ background: 'linear-gradient(135deg, var(--accent-1), var(--accent-2))' }}
        >
          返回博客列表
        </button>
      </div>
    );
  }

  const currentIdx = allPosts.findIndex((p) => p.slug === post.slug);
  const prevPost = currentIdx > 0 ? allPosts[currentIdx - 1] : null;
  const nextPost = currentIdx < allPosts.length - 1 ? allPosts[currentIdx + 1] : null;

  const handleClap = () => {
    const nextCount = claps + 1;
    setClaps(nextCount);
    try {
      localStorage.setItem(`wuji-claps-${post.slug}`, String(nextCount));
    } catch {
      // ignore
    }

    const colors = ['#38bdf8', '#818cf8', '#c084fc', '#f43f5e', '#34d399'];
    const batch: SparkParticle[] = Array.from({ length: 8 }).map((_, i) => {
      const angle = (Math.PI * 2 * i) / 8 + (Math.random() - 0.5) * 0.4;
      const dist = 28 + Math.random() * 26;
      return {
        id: Date.now() + i,
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist,
        color: colors[i % colors.length],
      };
    });
    setSparks(batch);
    window.setTimeout(() => setSparks([]), 650);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="relative z-10 pb-20">
      {/* Top Laser Reading Progress Bar */}
      <motion.div
        style={{
          scaleX,
          transformOrigin: '0% 50%',
          background: 'linear-gradient(90deg, var(--accent-1), var(--accent-2), var(--accent-3))',
        }}
        className="fixed inset-x-0 top-0 z-[60] h-[3px]"
      />

      <article className="mx-auto max-w-6xl px-6 pt-28 sm:pt-32">
        {/* Back Link */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-[var(--accent-1)]"
            style={{ color: 'var(--text-secondary)' }}
          >
            <ArrowLeft className="h-4 w-4" />
            返回全部文章
          </Link>
        </motion.div>

        {/* Article Hero Header */}
        <motion.header
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="glass-panel relative mt-6 overflow-hidden rounded-3xl p-7 sm:p-10"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full blur-3xl opacity-30"
            style={{ background: post.accent || 'var(--accent-1)' }}
          />

          <div className="relative z-10 space-y-5">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span
                className="rounded-full px-3 py-1 font-semibold"
                style={{
                  background: `color-mix(in srgb, ${post.accent || 'var(--accent-1)'} 18%, transparent)`,
                  color: post.accent || 'var(--accent-1)',
                }}
              >
                {post.category}
              </span>
              <span className="inline-flex items-center gap-1.5 font-mono-code" style={{ color: 'var(--text-muted)' }}>
                <Calendar className="h-3.5 w-3.5" />
                {post.date}
              </span>
              <span className="inline-flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                <Clock className="h-3.5 w-3.5" />
                约 {post.readingMinutes} 分钟阅读
              </span>
              <span className="inline-flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                <FileText className="h-3.5 w-3.5" />
                {post.wordCount} 字
              </span>
            </div>

            <h1 className="font-serif-cn text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-[2.65rem]">
              {post.title}
            </h1>

            {post.subtitle && (
              <p className="max-w-3xl text-base leading-relaxed sm:text-lg" style={{ color: 'var(--text-secondary)' }}>
                {post.subtitle}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg px-2.5 py-1 text-xs"
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
          </div>
        </motion.header>

        {/* Body + Sticky TOC */}
        <div className="mt-10 grid gap-10 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="min-w-0 lg:col-span-8 xl:col-span-9"
          >
            <div className="glass-panel rounded-3xl p-6 sm:p-10">
              <div
                ref={proseRef}
                className="wuji-prose"
                dangerouslySetInnerHTML={{ __html: post.html }}
              />

              {/* Interaction Bar: Ink Seal Clap + Share */}
              <div
                className="mt-14 flex flex-col items-center justify-between gap-5 border-t pt-8 sm:flex-row"
                style={{ borderColor: 'var(--border-subtle)' }}
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.88 }}
                      whileHover={{ scale: 1.05 }}
                      onClick={handleClap}
                      className="flex items-center gap-2.5 rounded-2xl px-5 py-3 text-sm font-semibold transition-colors"
                      style={{
                        background: 'color-mix(in srgb, var(--seal-color) 12%, transparent)',
                        border: '1px solid color-mix(in srgb, var(--seal-color) 45%, transparent)',
                        color: 'var(--seal-color)',
                      }}
                    >
                      <span className="font-serif-cn text-base font-bold">印</span>
                      <span>赞赏共鸣</span>
                      <span className="font-mono-code rounded-md px-1.5 py-0.5 text-xs" style={{ background: 'var(--bg-elevated)' }}>
                        {claps}
                      </span>
                    </motion.button>

                    <AnimatePresence>
                      {sparks.map((s) => (
                        <motion.span
                          key={s.id}
                          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                          animate={{ x: s.dx, y: s.dy, opacity: 0, scale: 0.2 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.6, ease: 'easeOut' }}
                          className="pointer-events-none absolute top-1/2 left-1/2 h-2 w-2 rounded-full"
                          style={{ background: s.color }}
                        />
                      ))}
                    </AnimatePresence>
                  </div>

                  <button
                    type="button"
                    onClick={handleShare}
                    className="inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition-colors hover:border-[var(--accent-1)]"
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {copiedLink ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-400" />
                        已复制链接
                      </>
                    ) : (
                      <>
                        <Share2 className="h-4 w-4" style={{ color: 'var(--accent-1)' }} />
                        分享文章
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <Sparkles className="h-3.5 w-3.5" style={{ color: 'var(--accent-1)' }} />
                  作者：无极 (WuJi)
                </div>
              </div>
            </div>

            {/* Prev / Next Navigation */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {prevPost ? (
                <Link
                  to={`/blog/${prevPost.slug}`}
                  className="glass-panel group rounded-2xl p-5 transition-all hover:-translate-y-0.5 hover:border-[var(--accent-1)]"
                >
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                    上一篇
                  </div>
                  <div className="font-serif-cn mt-2 line-clamp-1 font-bold transition-colors group-hover:text-[var(--accent-1)]">
                    {prevPost.title}
                  </div>
                </Link>
              ) : (
                <div />
              )}

              {nextPost && (
                <Link
                  to={`/blog/${nextPost.slug}`}
                  className="glass-panel group rounded-2xl p-5 text-right transition-all hover:-translate-y-0.5 hover:border-[var(--accent-1)]"
                >
                  <div className="flex items-center justify-end gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                    下一篇
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                  <div className="font-serif-cn mt-2 line-clamp-1 font-bold transition-colors group-hover:text-[var(--accent-1)]">
                    {nextPost.title}
                  </div>
                </Link>
              )}
            </div>
          </motion.div>

          {/* Sticky TOC Sidebar */}
          {post.toc.length > 0 && (
            <aside className="hidden lg:col-span-4 lg:block xl:col-span-3">
              <div className="glass-panel sticky top-24 rounded-2xl p-5">
                <div
                  className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-wider uppercase"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <List className="h-3.5 w-3.5" style={{ color: 'var(--accent-1)' }} />
                  文章目录
                </div>
                <nav className="space-y-1 border-l" style={{ borderColor: 'var(--border-subtle)' }}>
                  {post.toc.map((item) => {
                    const active = activeHeading === item.id;
                    return (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={`block border-l-2 py-1.5 text-xs leading-snug transition-all ${
                          item.level === 3 ? 'pl-5' : 'pl-3'
                        }`}
                        style={{
                          marginLeft: '-1px',
                          borderColor: active ? 'var(--accent-1)' : 'transparent',
                          color: active ? 'var(--accent-1)' : 'var(--text-secondary)',
                          fontWeight: active ? 600 : 400,
                        }}
                      >
                        {item.text}
                      </a>
                    );
                  })}
                </nav>
              </div>
            </aside>
          )}
        </div>
      </article>

      {/* Image Lightbox Modal */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-[110] flex flex-col items-center justify-center p-4 sm:p-8"
            style={{ background: 'rgba(2, 6, 23, 0.86)', backdropFilter: 'blur(10px)' }}
          >
            <button
              type="button"
              onClick={() => setLightbox(null)}
              aria-label="关闭大图预览"
              className="absolute top-5 right-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>
            <motion.img
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              src={lightbox.src}
              alt={lightbox.alt}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[82vh] max-w-[92vw] rounded-2xl border border-white/15 object-contain shadow-2xl"
            />
            {lightbox.alt && (
              <p className="mt-4 max-w-2xl text-center text-sm text-slate-300">
                {lightbox.alt}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
