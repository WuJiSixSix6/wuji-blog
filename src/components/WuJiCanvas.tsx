import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  hueIndex: number;
  phase: number;
  speed: number;
}

export const WuJiCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useTheme();
  const themeRef = useRef(theme);
  themeRef.current = theme;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let animationId = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const pointer = {
      x: width * 0.5,
      y: height * 0.4,
      active: false,
    };

    const particleCount = width < 768 ? 42 : 84;
    const particles: Particle[] = [];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2 + 0.9,
        hueIndex: i % 3,
        phase: Math.random() * Math.PI * 2,
        speed: 0.35 + Math.random() * 0.55,
      });
    }

    const onMouseMove = (e: MouseEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    };

    const onMouseLeave = () => {
      pointer.active = false;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave);

    let tick = 0;
    let isVisible = !document.hidden;

    const onVisibility = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', onVisibility);

    const draw = () => {
      animationId = window.requestAnimationFrame(draw);
      if (!isVisible) return;

      tick += prefersReducedMotion ? 0.002 : 0.007;
      const isDark = themeRef.current === 'dark';

      ctx.clearRect(0, 0, width, height);

      // Ambient breathing WuJi dual-orb aurora field
      const orb1X = width * (0.22 + Math.sin(tick * 0.55) * 0.06);
      const orb1Y = height * (0.24 + Math.cos(tick * 0.45) * 0.05);
      const orb2X = width * (0.78 + Math.cos(tick * 0.5) * 0.06);
      const orb2Y = height * (0.68 + Math.sin(tick * 0.4) * 0.06);

      const g1 = ctx.createRadialGradient(orb1X, orb1Y, 0, orb1X, orb1Y, Math.max(width, height) * 0.42);
      if (isDark) {
        g1.addColorStop(0, 'rgba(56, 189, 248, 0.13)');
        g1.addColorStop(0.5, 'rgba(99, 102, 241, 0.06)');
        g1.addColorStop(1, 'rgba(5, 7, 14, 0)');
      } else {
        g1.addColorStop(0, 'rgba(31, 111, 120, 0.11)');
        g1.addColorStop(0.5, 'rgba(59, 89, 152, 0.04)');
        g1.addColorStop(1, 'rgba(246, 244, 238, 0)');
      }
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, width, height);

      const g2 = ctx.createRadialGradient(orb2X, orb2Y, 0, orb2X, orb2Y, Math.max(width, height) * 0.4);
      if (isDark) {
        g2.addColorStop(0, 'rgba(192, 132, 252, 0.11)');
        g2.addColorStop(0.5, 'rgba(16, 185, 129, 0.04)');
        g2.addColorStop(1, 'rgba(5, 7, 14, 0)');
      } else {
        g2.addColorStop(0, 'rgba(200, 62, 55, 0.075)');
        g2.addColorStop(0.5, 'rgba(31, 111, 120, 0.035)');
        g2.addColorStop(1, 'rgba(246, 244, 238, 0)');
      }
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, width, height);

      const palette = isDark
        ? ['rgba(56, 189, 248, ', 'rgba(129, 140, 248, ', 'rgba(192, 132, 252, ']
        : ['rgba(31, 111, 120, ', 'rgba(51, 65, 85, ', 'rgba(200, 62, 55, '];

      const linkDistance = width < 768 ? 105 : 138;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Gentle curl-inspired flow field
        const angle =
          Math.sin(p.x * 0.0022 + tick) * Math.PI +
          Math.cos(p.y * 0.0022 - tick * 0.8) * Math.PI;

        if (!prefersReducedMotion) {
          p.vx += Math.cos(angle) * 0.012 * p.speed;
          p.vy += Math.sin(angle) * 0.012 * p.speed;
        }

        // Mouse orbital attraction / gentle swirl
        if (pointer.active && !prefersReducedMotion) {
          const dx = pointer.x - p.x;
          const dy = pointer.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 210 && dist > 18) {
            const force = (1 - dist / 210) * 0.045;
            // Combine gentle pull with tangential swirl
            p.vx += ((dx / dist) * 0.65 - (dy / dist) * 0.55) * force;
            p.vy += ((dy / dist) * 0.65 + (dx / dist) * 0.55) * force;
          }
        }

        // Friction damping
        p.vx *= 0.965;
        p.vy *= 0.965;
        p.x += p.vx;
        p.y += p.vy;

        // Soft wrap around edges
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // Draw particle with breathing alpha
        const alpha = (isDark ? 0.5 : 0.34) + Math.sin(tick * 2 + p.phase) * 0.22;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${palette[p.hueIndex]}${Math.max(0.12, alpha).toFixed(3)})`;
        ctx.fill();

        // Constellation links
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.hypot(dx, dy);
          if (dist < linkDistance) {
            const lineAlpha = (1 - dist / linkDistance) * (isDark ? 0.17 : 0.11);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `${palette[p.hueIndex]}${lineAlpha.toFixed(3)})`;
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }

        // Subtle pointer highlight lines
        if (pointer.active) {
          const pdx = p.x - pointer.x;
          const pdy = p.y - pointer.y;
          const pdist = Math.hypot(pdx, pdy);
          if (pdist < 155) {
            const pAlpha = (1 - pdist / 155) * (isDark ? 0.28 : 0.18);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(pointer.x, pointer.y);
            ctx.strokeStyle = `${palette[0]}${pAlpha.toFixed(3)})`;
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }
      }
    };

    animationId = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
};
