import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, Github, Mail, Sparkles } from 'lucide-react';
import { WuJiLogo } from './WuJiLogo';
import { MagneticButton } from './MagneticButton';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-10 mt-24 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          {/* Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <WuJiLogo size={32} animated={false} />
              <div>
                <div className="font-serif-cn text-base font-bold tracking-wider">无极 · WuJi</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  无极而太极，动静生万象
                </div>
              </div>
            </div>
            <p className="max-w-md text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              写给时间与好奇心的个人博客。在这里沉淀技术思考、交互动效实验与日常随笔。
            </p>
          </div>

          {/* Nav & Actions */}
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-5 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <Link to="/" className="transition-colors hover:text-[var(--accent-1)]">
                首页
              </Link>
              <Link to="/blog" className="transition-colors hover:text-[var(--accent-1)]">
                博客
              </Link>
              <Link to="/archive" className="transition-colors hover:text-[var(--accent-1)]">
                归档
              </Link>
              <Link to="/about" className="transition-colors hover:text-[var(--accent-1)]">
                关于
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="https://github.com/WuJiSixSix6"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl transition-all hover:scale-105"
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                }}
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="mailto:wujisixsix6@gmail.com"
                className="flex h-9 w-9 items-center justify-center rounded-xl transition-all hover:scale-105"
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                }}
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
              <MagneticButton
                onClick={scrollToTop}
                ariaLabel="回到顶部"
                className="flex h-9 w-9 items-center justify-center rounded-xl transition-colors hover:text-[var(--accent-1)]"
              >
                <span
                  className="flex h-full w-full items-center justify-center rounded-xl"
                  style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <ArrowUp className="h-4 w-4" />
                </span>
              </MagneticButton>
            </div>
          </div>
        </div>

        <div
          className="mt-8 flex flex-col items-start justify-between gap-2 border-t pt-6 text-xs sm:flex-row sm:items-center"
          style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
        >
          <span>© {new Date().getFullYear()} 无极 (WuJi). Crafted with code & motion.</span>
          <span className="inline-flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" style={{ color: 'var(--accent-1)' }} />
            React · Framer Motion · Markdown
          </span>
        </div>
      </div>
    </footer>
  );
};
