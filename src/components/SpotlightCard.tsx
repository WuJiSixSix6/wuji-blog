import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  accent?: string;
  tilt?: boolean;
  onClick?: () => void;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  accent,
  tilt = true,
  onClick,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [coords, setCoords] = useState({ x: 50, y: 50, active: false });
  const [rotate, setRotate] = useState({ rx: 0, ry: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoords({ x, y, active: true });

    if (tilt) {
      const px = (x / rect.width - 0.5) * 2;
      const py = (y / rect.height - 0.5) * 2;
      setRotate({ rx: -py * 3.5, ry: px * 3.5 });
    }
  };

  const handleMouseLeave = () => {
    setCoords((prev) => ({ ...prev, active: false }));
    setRotate({ rx: 0, ry: 0 });
  };

  const glowColor = accent || 'var(--accent-1)';

  return (
    <motion.div
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: rotate.rx,
        rotateY: rotate.ry,
      }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      style={{ transformPerspective: 900 }}
      className={`glass-panel group relative overflow-hidden rounded-2xl transition-colors duration-300 ${className}`}
    >
      {/* Dynamic cursor spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: coords.active ? 1 : 0,
          background: `radial-gradient(360px circle at ${coords.x}px ${coords.y}px, color-mix(in srgb, ${glowColor} 18%, transparent), transparent 65%)`,
        }}
      />
      {/* Top specular highlight line */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-50 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `linear-gradient(90deg, transparent, ${glowColor}, transparent)`,
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
};
