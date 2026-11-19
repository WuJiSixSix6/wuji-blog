import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Compass, Feather, Github, Mail, Sparkles, Terminal } from 'lucide-react';
import { SpotlightCard } from '../components/SpotlightCard';
import { WuJiLogo } from '../components/WuJiLogo';

const pillars = [
  {
    icon: Code2,
    title: '工程与架构',
    accent: '#38bdf8',
    desc: '热衷于构建清晰、可维护的软件系统。从现代前端工程到云端自动化部署，享受把复杂问题拆解为优雅抽象的过程。',
  },
  {
    icon: Sparkles,
    title: '动效与美学',
    accent: '#818cf8',
    desc: '相信好的动效不是炫技，而是符合直觉的物理反馈与情绪表达。用 Canvas、弹簧物理与排版细节赋予界面呼吸感。',
  },
  {
    icon: Feather,
    title: '写作与沉淀',
    accent: '#c084fc',
    desc: '写作是最好的思考方式。在这个独立博客里坚持长期主义，把踩过的坑、读过的书与闪过的灵感变成可复利的数字资产。',
  },
];

const stackGroups = [
  { label: 'Frontend & Motion', items: ['TypeScript', 'React', 'Vite', 'Tailwind CSS', 'Framer Motion', 'HTML5 Canvas'] },
  { label: 'Backend & Infra', items: ['Node.js', 'Python', 'Linux', 'Nginx', 'Docker', 'GitHub Actions'] },
  { label: 'Writing & Craft', items: ['Markdown', 'Obsidian', 'Figma', 'Typography', 'UI Design'] },
];

export const AboutPage: React.FC = () => {
  return (
    <div className="relative z-10 mx-auto max-w-5xl px-6 pt-32 pb-16">
      {/* Intro Hero Card */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-panel relative overflow-hidden rounded-3xl p-8 sm:p-12"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full blur-3xl opacity-25"
          style={{ background: 'linear-gradient(135deg, var(--accent-1), var(--accent-3))' }}
        />

        <div className="relative z-10 flex flex-col items-start gap-8 md:flex-row md:items-center">
          <div className="shrink-0">
            <WuJiLogo size={88} />
          </div>
          <div className="space-y-4">
            <div
              className="font-mono-code text-xs tracking-[0.22em] uppercase"
              style={{ color: 'var(--accent-1)' }}
            >
              About Me · 关于博主
            </div>
            <h1 className="font-serif-cn text-3xl font-black sm:text-4xl">
              无极 <span className="text-aurora">(WuJi)</span>
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed sm:text-base" style={{ color: 'var(--text-secondary)' }}>
              取名「无极」，源自“无极而太极”——象征不设边界的好奇心与自洽的创造力。我是一名热爱技术、设计与写作的创造者，正在互联网的一隅耕耘自己的数字花园。
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <a
                href="https://github.com/WuJiSixSix6"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white transition-transform hover:scale-[1.03]"
                style={{ background: 'linear-gradient(135deg, var(--accent-1), var(--accent-2))' }}
              >
                <Github className="h-4 w-4" />
                GitHub @WuJiSixSix6
              </a>
              <a
                href="mailto:wujisixsix6@gmail.com"
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors hover:border-[var(--accent-1)]"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                }}
              >
                <Mail className="h-4 w-4" style={{ color: 'var(--accent-1)' }} />
                wujisixsix6@gmail.com
              </a>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Three Pillars */}
      <section className="mt-12 grid gap-6 md:grid-cols-3">
        {pillars.map((pillar, idx) => {
          const Icon = pillar.icon;
          return (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
            >
              <SpotlightCard accent={pillar.accent} className="h-full p-6">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{
                    background: `color-mix(in srgb, ${pillar.accent} 16%, transparent)`,
                    color: pillar.accent,
                  }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="font-serif-cn mt-5 text-xl font-bold">{pillar.title}</h2>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {pillar.desc}
                </p>
              </SpotlightCard>
            </motion.div>
          );
        })}
      </section>

      {/* Tech Stack & Writing Setup */}
      <section className="mt-12 grid gap-6 md:grid-cols-12">
        <SpotlightCard className="p-7 md:col-span-7" accent="var(--accent-1)">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase" style={{ color: 'var(--accent-1)' }}>
            <Terminal className="h-4 w-4" />
            技术栈与工具箱
          </div>
          <div className="mt-5 space-y-5">
            {stackGroups.map((group) => (
              <div key={group.label}>
                <div className="font-mono-code mb-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                  {group.label}
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-lg px-3 py-1 text-xs font-medium"
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SpotlightCard>

        <SpotlightCard className="p-7 md:col-span-5" accent="var(--accent-3)">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase" style={{ color: 'var(--accent-3)' }}>
            <Compass className="h-4 w-4" />
            关于本站
          </div>
          <ul className="mt-5 space-y-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            <li>• 使用 React 19 + TypeScript + Vite + Framer Motion 独立构建</li>
            <li>• 内置自定义 HTML5 Canvas 无极星流粒子引力场动画</li>
            <li>• 支持「暗夜无极」与「宣纸水墨」圆形扩散双主题切换</li>
            <li>• 原生 Markdown 文章驱动，支持代码高亮、TOC 目录与 ⌘K 全文检索</li>
            <li>• 开源托管于 GitHub，并直接部署在独立云服务器上运行</li>
          </ul>
        </SpotlightCard>
      </section>
    </div>
  );
};
