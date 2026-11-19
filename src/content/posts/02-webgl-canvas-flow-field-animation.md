---
title: "用数学绘制光影：交互式流体粒子动画的设计与性能优化"
subtitle: "拆解本站背景「无极星流」背后的流场公式、指针引力与 60fps 渲染策略。"
date: "2026-11-15"
category: "前端动效"
tags: ["Canvas", "动画设计", "性能优化", "TypeScript"]
summary: "如何让网页背景既有令人惊艳的动态氛围，又不会拖慢阅读体验与笔记本风扇？本文结合本站 WuJiCanvas 的实现，深入解析流场粒子算法与高刷性能优化技巧。"
featured: true
accent: "#818cf8"
---

## 为什么选择流场粒子？

在设计个人博客的主视觉时，纯静态渐变往往显得单调，而过重的 3D 模型又容易造成首屏卡顿。相比之下，**基于 HTML5 Canvas 的二维流场粒子（Flow Field Particles）** 在视觉张力与性能开销之间达到了绝佳平衡。

它只需几十行核心数学逻辑，就能呈现出如同星云流转、墨韵晕染般的自然轨迹。

## 核心原理：用三角函数模拟卷曲流场

在真正的流体仿真中，计算 Navier-Stokes 方程代价较高。对于背景氛围动画，我们可以用一组相位随时间缓慢漂移的谐波函数来近似连续向量场：

```ts
// 根据粒子坐标 (x, y) 与全局时间 tick 计算流场方向角
const angle =
  Math.sin(p.x * 0.0022 + tick) * Math.PI +
  Math.cos(p.y * 0.0022 - tick * 0.8) * Math.PI;

p.vx += Math.cos(angle) * 0.012 * p.speed;
p.vy += Math.sin(angle) * 0.012 * p.speed;
```

### 加入指针的切向旋涡引力

如果粒子只是直线奔向鼠标，画面会很快聚成一团。更优雅的做法是把**径向引力**和**切向旋转力**叠加，让鼠标周围形成柔和的太极旋涡感：

```ts
const dx = pointer.x - p.x;
const dy = pointer.y - p.y;
const dist = Math.hypot(dx, dy);

if (dist < 210 && dist > 18) {
  const force = (1 - dist / 210) * 0.045;
  // 0.65 向心牵引 + 0.55 切向环绕
  p.vx += ((dx / dist) * 0.65 - (dy / dist) * 0.55) * force;
  p.vy += ((dy / dist) * 0.65 + (dx / dist) * 0.55) * force;
}
```

最后再配合 `0.965` 的阻尼系数（Friction Damping），粒子既能对光标做出灵敏响应，又始终保持丝绸般的阻尼惯性。

## 必须守住的性能底线

再炫酷的动画，一旦掉帧或让 CPU 狂转就是灾难。在实际工程中，以下四项优化至关重要：

1. **限制 DPR 上限**：Retina 屏设备像素比可能高达 3，将 `dpr = Math.min(window.devicePixelRatio || 1, 2)` 可减少一半以上的像素填充压力，肉眼却几乎无差别。
2. **后台自动休眠**：监听 `document.visibilitychange`，标签页切走时立即暂停绘制循环，零电量浪费。
3. **尊重无障碍偏好**：检测 `prefers-reduced-motion: reduce`，为对动态敏感的用户自动降低运动幅度。
4. **移动端自适应粒子密度**：小屏设备上自动减半粒子数量并缩小连线阈值，保证滚动丝滑。

> 好的视觉动效像空气与光线：第一眼让你眼前一亮，静下心阅读时又悄然退居幕后。
