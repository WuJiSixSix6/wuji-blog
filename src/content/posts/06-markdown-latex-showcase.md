---
title: "无极排版指南：Markdown、LaTeX 公式与文章引用全览"
subtitle: "一篇即看即用的写作样板，展示公式块、代码高亮、文本高亮、提示框、图片灯箱与站内交叉引用。"
date: "2026-11-20"
category: "写作指南"
tags: ["Markdown", "LaTeX", "KaTeX", "排版美学"]
summary: "无缝将日常 Markdown 笔记转化为精美前端博客文章：全面支持 KaTeX 行内/块级公式、==高亮==、加粗斜体、语法高亮代码块、Obsidian 提示块、图片点击放大与 [[文章引用]]。"
featured: true
accent: "#22d3ee"
---

## 文本排版与语义美化

日常用 Markdown 写作时，无需记忆任何复杂的 HTML 标签，本站会自动为所有排版元素注入克制而清晰的视觉层次：

- **加粗强调**用于突出核心结论，*斜体文字*赋予引述与外文词汇书卷气息，***加粗斜体***用于极强提示，~~删除线~~保留思考演变的痕迹。
- 使用 `==双等号语法==` 可以无缝渲染 ==荧光笔高亮效果==，例如：在暗夜与宣纸双主题下，==关键句都会自动适配高对比度的柔和底色==[^1]。
- 快捷键样式也开箱即用：按下 <kbd>⌘</kbd> + <kbd>K</kbd> 随时唤起全站极速检索面板。

## LaTeX 数学公式（KaTeX 原生渲染）

本站内置完整本地化的 **KaTeX** 引擎，支持行内公式 `$...$` / `\(...\)` 以及独立公式块 `$$...$$` / `\[...\]`，零 CDN 延迟，自动支持移动端横向滚动。

### 行内公式示例

欧拉恒等式 $e^{i\pi} + 1 = 0$ 将数学中最重要的五个常数联系在一起；在深度学习中，Scaled Dot-Product Attention 的缩放因子为 $\frac{1}{\sqrt{d_k}}$，其中向量维度 $d_k \in \mathbb{N}^+$。

### 独立公式块示例

高斯积分与傅里叶变换：

$$
\int_{-\infty}^{+\infty} e^{-x^2}\,dx = \sqrt{\pi}, \qquad \hat{f}(\xi) = \int_{-\infty}^{+\infty} f(x)\, e^{-2\pi i x \xi}\,dx
$$

Transformer 自注意力机制矩阵形式：

$$
\mathrm{Attention}(Q, K, V) = \mathrm{softmax}\!\left(\frac{Q K^{\top}}{\sqrt{d_k}}\right) V
$$

麦克斯韦方程组（对齐环境 `aligned`）：

$$
\begin{aligned}
\nabla \cdot \mathbf{E} &= \frac{\rho}{\varepsilon_0} \\
\nabla \cdot \mathbf{B} &= 0 \\
\nabla \times \mathbf{E} &= -\frac{\partial \mathbf{B}}{\partial t} \\
\nabla \times \mathbf{B} &= \mu_0 \mathbf{J} + \mu_0 \varepsilon_0 \frac{\partial \mathbf{E}}{\partial t}
\end{aligned}
$$

## 文章引用与超链接

### 1. 站内文章交叉引用（WikiLink 语法）

写作时可以直接使用 Obsidian 风格的双括号 `[[slug]]` 或 `[[slug|自定义标题]]` 引用本站其他文章，点击后平滑路由跳转、无整页刷新：

- 关于本站的建站初心，请参阅 [[wuji-philosophy-and-digital-garden]]。
- 如果你想了解背景粒子流场的数学实现，可以阅读 [[webgl-canvas-flow-field-animation|无极星流 Canvas 粒子算法解析]]。
- 部署调优方案详见 [[linux-nginx-zero-downtime-deploy]]。

### 2. 外部超链接与引用块

外部链接会自动附带右上角指示箭头并在新标签页安全打开，例如 [KaTeX 官方文档](https://katex.org/) 与 [无极的 GitHub 主页](https://github.com/WuJiSixSix6)。

> 好的工具应该隐身于创作之后——你只管专注思考与书写 Markdown，剩下的排版、光影与动效交给「无极」。

### 3. 智能提示块（Callouts）

> [!TIP] 写作小技巧
> 在任意普通引用块第一行加上 `[!NOTE]`、`[!TIP]`、`[!IMPORTANT]`、`[!WARNING]` 或 `[!CAUTION]`，系统会自动将其美化为带图标与语义色带的高级卡片。

> [!NOTE] 无缝迁移 Obsidian / Typora 笔记
> 只要在 `.md` 文件顶部补充 `title`、`date`、`category` 等 Frontmatter 元数据，就能把你平时的笔记原封不动地发布为博客文章[^2]。

> [!WARNING] 公式与代码块隔离
> 放在反引号 `` `$100` `` 或围栏代码块中的美元符号不会触发公式解析，确保代码片段原样展示。

## 图片自动美化与灯箱放大

普通 Markdown 图片语法 `![图片说明](路径)` 会自动套上圆角玻璃画框与居中题注。**点击下方图片** 即可体验全屏灯箱缩放效果：

![图 1：无极博客 Markdown + LaTeX 自动化渲染管线（点击可全屏放大）](/images/wuji-flow-diagram.svg)

## 代码块语法高亮与一键复制

支持 TypeScript、Python、C++、Go、Rust、Bash、Nginx、SQL、LaTeX 等主流语言，右上角自带一键复制按钮：

```python
import numpy as np

def softmax(logits: np.ndarray, temperature: float = 1.0) -> np.ndarray:
    """数值稳定的 Softmax 实现"""
    shifted = (logits - np.max(logits, axis=-1, keepdims=True)) / temperature
    exp_vals = np.exp(shifted)
    return exp_vals / np.sum(exp_vals, axis=-1, keepdims=True)

probs = softmax(np.array([2.0, 1.0, 0.1]))
print(np.round(probs, 4))
```

## 任务列表与数据表格

- [x] 行内与块级 LaTeX 公式（KaTeX 本地渲染）
- [x] 文本 `==高亮==`、**加粗**、*斜体*、~~删除线~~ 与 `<kbd>` 键帽
- [x] 代码块语法高亮与一键复制
- [x] 图片自动画框题注与点击灯箱放大
- [x] 站内 `[[文章引用]]`、外部超链接与学术脚注

| Markdown 语法 | 渲染效果说明 | 适用场景 |
| :--- | :--- | :--- |
| `$a^2 + b^2 = c^2$` | 行内 KaTeX 公式 | 数学推导、算法复杂度 |
| `$$...$$` | 独立居中公式块 | 定理、矩阵、多行方程组 |
| `==重点内容==` | 柔和荧光笔高亮 | 阅读笔记、关键结论 |
| `[[文章slug]]` | 站内卡片式文章引用 | 知识网络双向串联 |
| `> [!TIP]` | 彩色语义提示框 | 经验提示、注意事项 |

[^1]: 本站采用 CSS `color-mix()` 动态计算高亮底色，自动适配暗色与浅色主题对比度。
[^2]: 新增文章只需将 `.md` 文件放入 `src/content/posts/` 目录并运行一次构建部署脚本。
