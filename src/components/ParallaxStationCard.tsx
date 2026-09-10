import React, { useRef, useState, useCallback } from 'react';
import {
  Activity,
  Droplets,
  Thermometer,
  Wind,
  Layers,
  ArrowUpRight,
  Sparkles,
  ChevronRight,
  Radio,
  AlertTriangle,
} from 'lucide-react';
import { StationData } from '../types';
import { WaveIndicator } from './WaveIndicator';

interface Props {
  station: StationData;
  isSelected?: boolean;
  onSelectStation: (station: StationData) => void;
  index?: number;
}

export const ParallaxStationCard: React.FC<Props> = ({
  station,
  isSelected = false,
  onSelectStation,
  index = 0,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState<React.CSSProperties>({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    transition: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.4s ease',
  });
  const [glareStyle, setGlareStyle] = useState<React.CSSProperties>({
    opacity: 0,
    background: 'transparent',
  });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle 3D tilt: max +-14 degrees
    const rotateX = -((y - centerY) / centerY) * 14;
    const rotateY = ((x - centerX) / centerX) * 14;

    // Glare coordinates
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTransformStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.03, 1.03, 1.03)`,
      transition: 'transform 0.08s ease-out',
    });

    setGlareStyle({
      opacity: 1,
      background: `radial-gradient(circle at ${glareX.toFixed(1)}% ${glareY.toFixed(1)}%, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.06) 45%, transparent 75%)`,
      transition: 'opacity 0.15s ease-out',
    });
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransformStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.5s ease',
    });
    setGlareStyle({
      opacity: 0,
      background: 'transparent',
      transition: 'opacity 0.4s ease-out',
    });
  };

  const getStatusVisuals = () => {
    switch (station.ecoStatus) {
      case 'alarm':
        return {
          waveColor: 'rose' as const,
          borderColor: 'border-rose-500/50 hover:border-rose-400',
          badgeBg: 'bg-rose-500/15 border-rose-500/40 text-rose-700 dark:text-rose-300',
          accentColor: 'text-rose-600 dark:text-rose-400',
          pillBg: 'bg-rose-500 text-white',
          glowShadow: 'hover:shadow-[0_20px_40px_-15px_rgba(239,68,68,0.4)]',
          title: 'Тревога (>20)',
          intensity: 'rapid' as const,
        };
      case 'elevated':
        return {
          waveColor: 'amber' as const,
          borderColor: 'border-orange-500/40 hover:border-orange-400',
          badgeBg: 'bg-orange-500/15 border-orange-500/40 text-orange-700 dark:text-orange-300',
          accentColor: 'text-orange-600 dark:text-orange-400',
          pillBg: 'bg-orange-500 text-white',
          glowShadow: 'hover:shadow-[0_20px_40px_-15px_rgba(249,115,22,0.35)]',
          title: 'Повышенный (15-20)',
          intensity: 'moderate' as const,
        };
      case 'observation':
        return {
          waveColor: 'amber' as const,
          borderColor: 'border-amber-500/40 hover:border-amber-400',
          badgeBg: 'bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-amber-300',
          accentColor: 'text-amber-600 dark:text-amber-400',
          pillBg: 'bg-amber-500 text-white',
          glowShadow: 'hover:shadow-[0_20px_40px_-15px_rgba(234,179,8,0.3)]',
          title: 'Наблюдение (8-14)',
          intensity: 'moderate' as const,
        };
      case 'low':
      default:
        return {
          waveColor: 'emerald' as const,
          borderColor: 'border-emerald-500/40 hover:border-emerald-400',
          badgeBg: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300',
          accentColor: 'text-emerald-600 dark:text-emerald-400',
          pillBg: 'bg-emerald-500 text-white',
          glowShadow: 'hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.3)]',
          title: 'Низкий (0-7)',
          intensity: 'calm' as const,
        };
    }
  };

  const visuals = getStatusVisuals();
  const isAlarm = station.ecoStatus === 'alarm';

  return (
    <div
      className="perspective-1000 w-full"
      style={{
        perspective: '1000px',
      }}
    >
      <div
        ref={cardRef}
        id={`station-card-${station.id}`}
        onClick={() => onSelectStation(station)}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={transformStyle}
        className={`group relative rounded-3xl p-5 sm:p-6 border bg-white/95 dark:bg-slate-900/95 backdrop-blur-md cursor-pointer select-none transition-colors duration-200 overflow-hidden flex flex-col justify-between preserve-3d shadow-lg ${
          visuals.borderColor
        } ${visuals.glowShadow} ${
          isSelected
            ? 'ring-2 ring-cyan-500 shadow-2xl dark:shadow-cyan-950/50'
            : ''
        }`}
      >
        {/* Dynamic 3D Glare Light Reflection Overlay */}
        <div
          className="absolute inset-0 pointer-events-none rounded-3xl z-40 transition-opacity duration-200"
          style={glareStyle}
        />

        {/* Floating background capillary aura */}
        <div
          className={`absolute -right-12 -top-12 w-36 h-36 rounded-full blur-2xl pointer-events-none opacity-20 transition-opacity duration-300 ${
            isAlarm ? 'bg-rose-500' : 'bg-cyan-500'
          } ${isHovered ? 'opacity-40 scale-125' : ''}`}
        />

        {/* Card Header with 3D Depth Layering */}
        <div
          className="relative z-10 space-y-3"
          style={{ transform: isHovered ? 'translateZ(26px)' : 'translateZ(0px)', transition: 'transform 0.15s ease-out' }}
        >
          {/* Top Row: Station ID Badge + Live Acoustic Wave Equalizer */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-xl text-xs font-black font-mono tracking-wider shadow-sm flex items-center gap-1.5 ${visuals.pillBg}`}
              >
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>{station.id}</span>
              </span>

              <span
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border uppercase ${visuals.badgeBg}`}
              >
                {visuals.title}
              </span>
            </div>

            {/* Live Wave Equalizer Indicator for the graphic card */}
            <WaveIndicator
              variant="equalizer"
              color={visuals.waveColor}
              label={`${station.flowSpeed} м/с`}
              className="hidden sm:inline-flex"
            />
          </div>

          {/* Station Title and Geo location */}
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-1">
              {station.name.split('(')[0].trim()}
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 line-clamp-1">
              {station.location}
            </p>
          </div>
        </div>

        {/* Center Prominent Metric with High 3D Depth */}
        <div
          className="relative z-10 my-4 py-3 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60"
          style={{
            transform: isHovered ? 'translateZ(36px)' : 'translateZ(0px)',
            transition: 'transform 0.15s ease-out',
          }}
        >
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block">
                Микропластик (Март)
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span
                  className={`text-3xl font-black font-mono tracking-tight ${visuals.accentColor}`}
                >
                  {station.particleCount}
                </span>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  част./м³
                </span>
              </div>
            </div>

            <div className="text-right">
              <span
                className={`inline-flex items-center text-xs font-black font-mono px-2 py-0.5 rounded-lg ${
                  station.dynamics.direction === 'up'
                    ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300'
                    : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                }`}
              >
                {station.dynamics.direction === 'up' ? '▲ +' : '▼ -'}
                {station.dynamics.percentage}%
              </span>
              <span className="block text-[9.5px] text-slate-600 dark:text-slate-300 mt-0.5">
                к январю
              </span>
            </div>
          </div>

          {/* Micro-Telemetry Grid */}
          <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-700/80 grid grid-cols-3 gap-2 text-[11px]">
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <Wind className="w-3.5 h-3.5 text-sky-500 shrink-0" />
              <span className="font-mono font-bold truncate">{station.flowSpeed} м/с</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <Thermometer className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span className="font-mono font-bold truncate">{station.waterTemp} °C</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <Droplets className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
              <span className="font-mono font-bold truncate">{station.turbidity} NTU</span>
            </div>
          </div>
        </div>

        {/* Plastic Type & Action Footer */}
        <div
          className="relative z-10 space-y-3"
          style={{
            transform: isHovered ? 'translateZ(24px)' : 'translateZ(0px)',
            transition: 'transform 0.15s ease-out',
          }}
        >
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-300 font-medium">
              Доминирующий тип:
            </span>
            <span className="font-bold text-slate-900 dark:text-slate-100 truncate max-w-[150px]">
              {station.plasticType}
            </span>
          </div>

          {/* Action Trigger Link with Hover Animation */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-[11px] font-bold text-cyan-700 dark:text-cyan-400 group-hover:underline flex items-center gap-1">
              <span>Полный спектральный анализ</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
            <span className="text-[10px] font-mono text-slate-600 dark:text-slate-300">
              {station.analysisTime}
            </span>
          </div>
        </div>

        {/* Integrated Animated River Wave at the Bottom of Card */}
        <div className="absolute -bottom-0.5 left-0 right-0 z-0 opacity-75 group-hover:opacity-100 transition-opacity">
          <WaveIndicator
            variant="stream"
            color={visuals.waveColor}
            height={26}
            intensity={visuals.intensity}
          />
        </div>
      </div>
    </div>
  );
};
