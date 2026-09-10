import React from 'react';

interface WaveIndicatorProps {
  variant?: 'stream' | 'equalizer' | 'ribbon' | 'pulse';
  color?: 'cyan' | 'emerald' | 'amber' | 'rose' | 'indigo' | 'white';
  height?: number;
  className?: string;
  intensity?: 'calm' | 'moderate' | 'rapid';
  label?: string;
}

export const WaveIndicator: React.FC<WaveIndicatorProps> = ({
  variant = 'stream',
  color = 'cyan',
  height = 24,
  className = '',
  intensity = 'moderate',
  label,
}) => {
  const getColorStyles = () => {
    switch (color) {
      case 'rose':
        return {
          stroke1: '#F43F5E',
          stroke2: '#FB7185',
          fill: 'rgba(244, 63, 94, 0.15)',
          bar: 'bg-rose-500',
          glow: 'rgba(244, 63, 94, 0.4)',
          text: 'text-rose-500 dark:text-rose-400',
        };
      case 'amber':
        return {
          stroke1: '#F59E0B',
          stroke2: '#FBBF24',
          fill: 'rgba(245, 158, 11, 0.15)',
          bar: 'bg-amber-500',
          glow: 'rgba(245, 158, 11, 0.4)',
          text: 'text-amber-500 dark:text-amber-400',
        };
      case 'emerald':
        return {
          stroke1: '#10B981',
          stroke2: '#34D399',
          fill: 'rgba(16, 185, 129, 0.15)',
          bar: 'bg-emerald-500',
          glow: 'rgba(16, 185, 129, 0.4)',
          text: 'text-emerald-500 dark:text-emerald-400',
        };
      case 'indigo':
        return {
          stroke1: '#6366F1',
          stroke2: '#818CF8',
          fill: 'rgba(99, 102, 241, 0.15)',
          bar: 'bg-indigo-500',
          glow: 'rgba(99, 102, 241, 0.4)',
          text: 'text-indigo-500 dark:text-indigo-400',
        };
      case 'white':
        return {
          stroke1: '#FFFFFF',
          stroke2: 'rgba(255, 255, 255, 0.8)',
          fill: 'rgba(255, 255, 255, 0.12)',
          bar: 'bg-white',
          glow: 'rgba(255, 255, 255, 0.5)',
          text: 'text-white',
        };
      case 'cyan':
      default:
        return {
          stroke1: '#06B6D4',
          stroke2: '#38BDF8',
          fill: 'rgba(6, 182, 212, 0.15)',
          bar: 'bg-cyan-500',
          glow: 'rgba(6, 182, 212, 0.4)',
          text: 'text-cyan-600 dark:text-cyan-400',
        };
    }
  };

  const colors = getColorStyles();
  const speed = intensity === 'rapid' ? '2.5s' : intensity === 'calm' ? '7s' : '4.5s';
  const speedAlt = intensity === 'rapid' ? '3.5s' : intensity === 'calm' ? '9s' : '6s';

  if (variant === 'equalizer') {
    return (
      <div className={`inline-flex items-center gap-1 h-5 px-1.5 py-0.5 rounded-full bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 ${className}`}>
        {[40, 90, 60, 100, 75, 45].map((defaultHeight, idx) => (
          <span
            key={idx}
            className={`w-1 rounded-full ${colors.bar}`}
            style={{
              height: `${defaultHeight}%`,
              animation: `waveEqualizer ${0.7 + idx * 0.18}s ease-in-out infinite alternate`,
              animationDelay: `${idx * 0.12}s`,
            }}
          />
        ))}
        {label && (
          <span className={`text-[10px] font-mono font-black ml-1 uppercase tracking-wider ${colors.text}`}>
            {label}
          </span>
        )}
      </div>
    );
  }

  if (variant === 'ribbon') {
    return (
      <div className={`relative w-full overflow-hidden pointer-events-none ${className}`} style={{ height: `${height}px` }}>
        <svg
          viewBox="0 0 1200 40"
          preserveAspectRatio="none"
          className="absolute inset-0 w-[200%] h-full"
          style={{
            animation: `waveScroll ${speed} linear infinite`,
          }}
        >
          <path
            d="M 0,20 Q 75,5 150,20 T 300,20 T 450,20 T 600,20 T 750,20 T 900,20 T 1050,20 T 1200,20 Q 1275,5 1350,20 T 1500,20 T 1650,20 T 1800,20 T 1950,20 T 2100,20 T 2250,20 T 2400,20"
            fill="none"
            stroke={colors.stroke1}
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.85"
          />
          <path
            d="M 0,22 Q 75,35 150,22 T 300,22 T 450,22 T 600,22 T 750,22 T 900,22 T 1050,22 T 1200,22 Q 1275,35 1350,22 T 1500,22 T 1650,22 T 1800,22 T 1950,22 T 2100,22 T 2250,22 T 2400,22"
            fill="none"
            stroke={colors.stroke2}
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.6"
          />
        </svg>
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={`relative inline-flex items-center justify-center ${className}`}>
        <span
          className="absolute inset-0 rounded-full animate-ping opacity-75"
          style={{ backgroundColor: colors.stroke1 }}
        />
        <span
          className="relative inline-flex rounded-full w-2.5 h-2.5"
          style={{ backgroundColor: colors.stroke1 }}
        />
      </div>
    );
  }

  // Default 'stream' variant: dual flowing sine-wave SVG with water depth fill
  return (
    <div
      className={`relative w-full overflow-hidden pointer-events-none select-none ${className}`}
      style={{ height: `${height}px` }}
    >
      <svg
        viewBox="0 0 1000 60"
        preserveAspectRatio="none"
        className="absolute inset-0 w-[200%] h-full"
        style={{
          animation: `waveScroll ${speed} linear infinite`,
        }}
      >
        <defs>
          <linearGradient id={`waveGrad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.stroke1} stopOpacity="0.4" />
            <stop offset="100%" stopColor={colors.stroke2} stopOpacity="0.03" />
          </linearGradient>
        </defs>

        {/* First wave layer */}
        <path
          d="M 0,25 C 150,45 350,5 500,25 C 650,45 850,5 1000,25 C 1150,45 1350,5 1500,25 C 1650,45 1850,5 2000,25 L 2000,60 L 0,60 Z"
          fill={`url(#waveGrad-${color})`}
        />
        <path
          d="M 0,25 C 150,45 350,5 500,25 C 650,45 850,5 1000,25 C 1150,45 1350,5 1500,25 C 1650,45 1850,5 2000,25"
          fill="none"
          stroke={colors.stroke1}
          strokeWidth="2"
          opacity="0.8"
        />

        {/* Secondary counter wave layer */}
        <path
          d="M 0,35 C 150,15 350,50 500,35 C 650,15 850,50 1000,35 C 1150,15 1350,50 1500,35 C 1650,15 1850,50 2000,35"
          fill="none"
          stroke={colors.stroke2}
          strokeWidth="1.5"
          strokeDasharray="4 3"
          opacity="0.6"
          style={{
            animation: `waveCounter ${speedAlt} ease-in-out infinite alternate`,
          }}
        />
      </svg>
    </div>
  );
};
