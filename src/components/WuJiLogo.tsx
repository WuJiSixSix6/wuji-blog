import React from 'react';
import { motion } from 'framer-motion';

interface WuJiLogoProps {
  size?: number;
  animated?: boolean;
}

export const WuJiLogo: React.FC<WuJiLogoProps> = ({ size = 36, animated = true }) => {
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        animate={animated ? { rotate: 360 } : undefined}
        transition={animated ? { duration: 28, repeat: Infinity, ease: 'linear' } : undefined}
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="wuji-logo-grad" x1="6" y1="6" x2="58" y2="58" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="var(--accent-1)" />
            <stop offset="50%" stopColor="var(--accent-2)" />
            <stop offset="100%" stopColor="var(--accent-3)" />
          </linearGradient>
        </defs>
        <circle
          cx="32"
          cy="32"
          r="27"
          stroke="url(#wuji-logo-grad)"
          strokeWidth="2.2"
          strokeDasharray="118 50"
          strokeLinecap="round"
        />
        <circle
          cx="32"
          cy="32"
          r="21"
          stroke="url(#wuji-logo-grad)"
          strokeWidth="1.2"
          strokeOpacity="0.45"
          strokeDasharray="4 6"
        />
        <circle cx="59" cy="32" r="2.8" fill="var(--accent-1)" />
      </motion.svg>
      <span
        className="font-serif-cn pointer-events-none absolute font-bold select-none"
        style={{
          fontSize: Math.round(size * 0.42),
          color: 'var(--text-primary)',
          lineHeight: 1,
        }}
      >
        无
      </span>
    </div>
  );
};
