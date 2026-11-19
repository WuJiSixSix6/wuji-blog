# 无极 · WuJi — 个人博客与数字花园

> 无极而太极，动静生万象。

使用 **React 19 + TypeScript + Vite + Tailwind CSS + Framer Motion** 打造的个人博客网站，融合东方意境与现代交互动效。

## 特性亮点

- **双主题圆形扩散切换**：支持「暗夜无极（深空极光）」与「宣纸水墨（浅色书卷）」双主题，借助 View Transitions API 实现从点击位置扩散的丝滑切换效果。
- **交互式无极星流背景**：自定义高帧率 HTML5 Canvas 流场粒子动画，支持光标引力旋涡、星座连线，并针对移动端、后台标签页与 `prefers-reduced-motion` 自动优化。
- **精美微交互与动效**：旋转太极无极轨道主视觉、弹簧物理磁吸按钮、光标追踪光斑 3D 悬浮卡片、激光阅读进度条、朱红印章共鸣粒子动效。
- **零后端 Markdown + LaTeX 博客系统**：在 `src/content/posts/` 下新增 `.md` 文件即可自动发布，全面支持：
  - **LaTeX 数学公式**：本地 KaTeX 渲染行内 `$...$` / `\(...\)` 与块级 `$$...$$` / `\[...\]` 公式
  - **富文本美化**：`==高亮文本==`、**加粗**、*斜体*、~~删除线~~、`<kbd>` 键帽、任务列表与响应式表格
  - **代码块**：多语言语法高亮与一键复制
  - **提示块与引用**：标准引用、`> [!NOTE]` / `[!TIP]` / `[!WARNING]` 语义卡片、学术脚注 `[^1]`
  - **图片与链接**：图片自动画框题注 + 点击灯箱放大，支持站内 `[[文章slug]]` 交叉引用与外链标识
  - **高效阅读**：侧边栏滚动高亮目录（TOC）、专栏与标签筛选、归档时间轴与 `⌘K / Ctrl+K` 全文检索面板

## 本地开发

```bash
npm install
npm run dev
```

## 写一篇新博客

在 `src/content/posts/` 目录下新建一个 `.md` 文件（例如 `06-my-new-post.md`），顶部添加 Frontmatter：

```markdown
---
title: "你的文章标题"
subtitle: "可选副标题"
date: "2026-11-20"
category: "技术"
tags: ["标签1", "标签2"]
summary: "文章摘要，展示在列表卡片中。"
featured: false
accent: "#38bdf8"
---

## 正文开始

在这里书写你的 Markdown 内容...
```

## 构建与部署

```bash
# 生产构建
npm run build

# 部署到云服务器（先配置环境变量或 .env.local）
DEPLOY_HOST=你的服务器IP DEPLOY_USER=root DEPLOY_PASS=你的密码 ./scripts/deploy.sh
```
