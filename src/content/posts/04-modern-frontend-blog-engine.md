---
title: "现代前端工程化实践：用 Vite 打造零后端的 Markdown 博客引擎"
subtitle: "利用 import.meta.glob、自定义渲染器与代码分割，构建毫秒级加载的静态博客架构。"
date: "2026-10-28"
category: "工程架构"
tags: ["React", "Vite", "Markdown", "工程化"]
summary: "个人博客真的需要沉重的数据库和后台管理系统吗？本文分享如何仅凭 Vite 静态编译能力，实现 Frontmatter 解析、目录生成、全文搜索与代码高亮的极简架构。"
featured: false
accent: "#10b981"
---

## 少即是多：无数据库博客的优势

许多开发者搭建个人博客时，第一反应是设计一套包含后端 API、数据库、富文本编辑器的全栈系统。但运营一段时间后往往会发现：

- 维护数据库备份、后台鉴权和安全补丁消耗了大量精力；
- 写作体验远不如本地编辑器（如 VS Code、Obsidian）流畅；
- 动态渲染在低配云服务器上反而拖慢了首屏速度。

如果把文章回归到最纯粹的 **Git + Markdown 文件**，用构建工具在编译期完成预处理，所有问题迎刃而解。

## 用 Vite 的 `import.meta.glob` 自动发现文章

Vite 原生支持按通配符批量导入静态文本资源。只需几行代码，就能把 `src/content/posts/` 下的所有 `.md` 文件打包进站点：

```ts
const rawModules = import.meta.glob<string>('../content/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});
```

之后我们按顺序完成三条轻量管线：

1. **Frontmatter 解析**：提取标题、日期、专栏、标签与主题强调色。
2. **自定义 Marked 渲染器**：在生成 HTML 的同时提取 `H2/H3` 标题构建侧边栏目录（TOC），并为代码块注入语言标识与一键复制按钮。
3. **中英文混合字数统计**：分别匹配汉字与英文单词，给出更贴近真实节奏的预计阅读时间。

## 打包拆包与缓存策略

为了让浏览器二次访问时几乎瞬间打开，在 `vite.config.ts` 中将变动频率极低的底层依赖拆分为独立 chunk：

```ts
rollupOptions: {
  output: {
    manualChunks: {
      'react-vendor': ['react', 'react-dom', 'react-router-dom'],
      motion: ['framer-motion'],
      markdown: ['marked', 'highlight.js'],
    },
  },
}
```

这样即便以后新增了几十篇博客文章，用户浏览器也只需拉取极小的业务代码增量，底层 vendor 文件全部命中 Nginx 的长效强缓存。
