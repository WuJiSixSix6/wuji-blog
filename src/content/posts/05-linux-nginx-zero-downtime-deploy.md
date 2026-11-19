---
title: "轻量云服务器自动化部署实战：Nginx 调优与一键发布"
subtitle: "从静态资源压缩、SPA 路由回退到长效缓存，一份清晰可复用的线上托管指南。"
date: "2026-10-16"
category: "运维部署"
tags: ["Nginx", "Linux", "自动化部署", "性能优化"]
summary: "写好网站只是第一步，让它在云服务器上稳定、高速地运行同样重要。本文总结单页应用（SPA）在 Nginx 上的最佳实践配置与极速发布流程。"
featured: false
accent: "#f59e0b"
---

## 单页应用（SPA）在 Nginx 中的核心配置

使用 React Router 等前端路由方案时，用户直接刷新 `/blog/my-post` 或从外链进入子路由，如果 Nginx 没有配置回退规则，就会直接返回 `404 Not Found`。

核心解决方式就是 `try_files $uri $uri/ /index.html;`。同时，配合 Gzip 压缩与静态资源长效缓存，可以显著缩短跨地域访问的加载时间：

```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    root /var/www/wuji-blog;
    index index.html;

    # 开启 Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml image/svg+xml;

    # Vite 打包产物带有内容哈希，可放心开启一年强缓存
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 入口 HTML 禁止强缓存，确保发版后立即生效
    location = /index.html {
        add_header Cache-Control "no-cache";
    }

    # SPA 路由回退
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 为什么 `index.html` 与 `/assets/` 缓存策略相反？

这是前端部署中最容易被忽略的细节：

- **`/assets/` 目录**：Vite 会为每个 JS/CSS 文件名注入内容指纹（如 `index-C7x82a.js`）。内容不变哈希不变，内容一改文件名必改，因此设置 `immutable` 强缓存既安全又极速。
- **`index.html` 文件**：它是整个站点的清单入口，必须设置 `no-cache`，让浏览器每次轻量协商确认最新版本，从而避免“发版后用户看到的还是旧页面”。

## 一键更新的快乐

当博客写作和发布流足够丝滑时，输出才更容易变成习惯。未来每次在 `src/content/posts/` 下新增一篇 Markdown 文章，只需两条命令：

```bash
npm run build
./scripts/deploy.sh
```

几十秒内，新文章便已同步到 GitHub 并热更新到云端服务器，静候下一位读者的到来。
