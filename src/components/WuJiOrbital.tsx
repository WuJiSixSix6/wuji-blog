import React from 'react';
import { motion } from 'framer-motion';

export const WuJiOrbital: React.FC = () => {
  return (
    <div className="relative mx-auto flex h-[320px] w-[320px] items-center justify-center sm:h-[380px] sm:w-[380px]">
      {/* Ambient radial halo */}
      <motion.div
        animate={{ scale: [1, 1.09, 1], opacity: [0.45, 0.72, 0.45] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute inset-6 rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--accent-1) 34%, transparent) 0%, color-mix(in srgb, var(--accent-3) 22%, transparent) 55%, transparent 75%)',
        }}
      />

      {/* Outer dashed cosmic ring */}
      <motion.svg
        viewBox="0 0 400 400"
        className="absolute inset-0 h-full w-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
      >
        <defs>
          <linearGradient id="orbital-ring-1" x1="0" y1="0" x2="400" y2="400" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="var(--accent-1)" stopOpacity="0.85" />
            <stop offset="50%" stopColor="var(--accent-2)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--accent-3)" stopOpacity="0.85" />
          </linearGradient>
        </defs>
        <circle
          cx="200"
          cy="200"
          r="182"
          fill="none"
          stroke="url(#orbital-ring-1)"
          strokeWidth="1.2"
          strokeDasharray="8 10"
        />
        <circle cx="382" cy="200" r="4.5" fill="var(--accent-1)" />
        <circle cx="18" cy="200" r="3.5" fill="var(--accent-3)" />
      </motion.svg>

      {/* Counter-rotating inclined elliptic orbit */}
      <motion.svg
        viewBox="0 0 400 400"
        className="absolute inset-0 h-full w-full"
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        <ellipse
          cx="200"
          cy="200"
          rx="154"
          ry="84"
          transform="rotate(-24 200 200)"
          fill="none"
          stroke="var(--accent-2)"
          strokeOpacity="0.36"
          strokeWidth="1.3"
        />
        <ellipse
          cx="200"
          cy="200"
          rx="154"
          ry="84"
          transform="rotate(36 200 200)"
          fill="none"
          stroke="var(--accent-1)"
          strokeOpacity="0.28"
          strokeWidth="1.2"
          strokeDasharray="4 6"
        />
        <circle cx="342" cy="142" r="4" fill="var(--accent-2)" />
      </motion.svg>

      {/* Core Glass Medallion */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 220, damping: 18 }}
        className="glass-panel relative flex h-44 w-44 flex-col items-center justify-center rounded-full sm:h-52 sm:w-52"
        style={{
          borderColor: 'color-mix(in srgb, var(--accent-1) 35%, var(--border-subtle))',
        }}
      >
        {/* Inner glowing arc */}
        <motion.svg
          viewBox="0 0 200 200"
          className="pointer-events-none absolute inset-2 h-[calc(100%-16px)] w-[calc(100%-16px)]"
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        >
          <circle
            cx="100"
            cy="100"
            r="92"
            fill="none"
            stroke="url(#orbital-ring-1)"
            strokeWidth="2"
            strokeDasharray="140 440"
            strokeLinecap="round"
          />
        </motion.svg>

        <span className="font-serif-cn text-aurora text-5xl font-black tracking-widest sm:text-6xl">
          无极
        </span>
        <span
          className="font-mono-code mt-1.5 text-[11px] tracking-[0.3em] uppercase"
          style={{ color: 'var(--text-muted)' }}
        >
          WUJI · ∞
        </span>

        {/* Vermilion traditional seal */}
        <span
          className="font-serif-cn mt-3 rounded border px-2 py-0.5 text-[10px] font-semibold tracking-widest"
          style={{
            borderColor: 'color-mix(in srgb, var(--seal-color) 60%, transparent)',
            color: 'var(--seal-color)',
            background: 'color-mix(in srgb, var(--seal-color) 10%, transparent)',
          }}
        >
          行而不辍
        </span>
      </motion.div>

      {/* Floating orbital badges */}
      <motion.div
        animate={{ y: [-5, 5, -5] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        className="glass-panel absolute top-6 right-2 rounded-xl px-3 py-1.5 text-xs font-medium sm:right-0"
      >
        <span className="text-aurora font-mono-code">01 · Code</span>
      </motion.div>
      <motion.div
        animate={{ y: [6, -6, 6] }}
        transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
        className="glass-panel absolute bottom-10 left-0 rounded-xl px-3 py-1.5 text-xs font-medium"
      >
        <span className="text-aurora font-mono-code">02 · Essay</span>
      </motion.div>
      <motion.div
        animate={{ y: [-4, 6, -4] }}
        transition={{ duration: 5.8, repeat: Infinity, ease: 'easeInOut' }}
        className="glass-panel absolute right-6 bottom-4 rounded-xl px-3 py-1.5 text-xs font-medium"
      >
        <span className="text-aurora font-mono-code">03 · Motion</span>
      </motion.div>
    </div>
  );
};
