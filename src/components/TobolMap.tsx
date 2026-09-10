import React, { useState } from 'react';
import {
  MapPin,
  Waves,
  Eye,
  Activity,
  Layers,
  Sparkles,
  Info,
  Maximize2,
  TrendingUp,
  AlertTriangle,
  Compass,
  Radio,
} from 'lucide-react';
import { StationData } from '../types';
import { ECO_LEVELS } from '../data/mockData';
import { ParallaxStationCard } from './ParallaxStationCard';
import { WaveIndicator } from './WaveIndicator';

interface Props {
  stations: StationData[];
  selectedStationId: string | null;
  onSelectStation: (station: StationData) => void;
  isDark: boolean;
}

export const TobolMap: React.FC<Props> = ({
  stations,
  selectedStationId,
  onSelectStation,
  isDark,
}) => {
  const [hoveredStation, setHoveredStation] = useState<StationData | null>(null);
  const [activeLayers, setActiveLayers] = useState({
    flow: true,
    heatmap: true,
    cities: true,
    capillaries: true,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'alarm':
        return { stroke: '#EF4444', fill: '#F87171', glow: 'rgba(239, 68, 68, 0.45)', ping: '#EF4444' };
      case 'elevated':
        return { stroke: '#F97316', fill: '#FB923C', glow: 'rgba(249, 115, 22, 0.4)', ping: '#F97316' };
      case 'observation':
        return { stroke: '#EAB308', fill: '#FDE047', glow: 'rgba(234, 179, 8, 0.35)', ping: '#EAB308' };
      default:
        return { stroke: '#10B981', fill: '#34D399', glow: 'rgba(16, 185, 129, 0.35)', ping: '#10B981' };
    }
  };

  const getStatusBadge = (status: string) => {
    const level = ECO_LEVELS.find((l) => l.id === status);
    return level || ECO_LEVELS[0];
  };

  // Geographic anchor points for cities along Tobol river
  const cities = [
    { name: 'г. Костанай', x: 260, y: 450, note: 'Трансграничный створ' },
    { name: 'г. Курган', x: 490, y: 310, note: 'Промзона / станция Т-03' },
    { name: 'г. Ялуторовск', x: 700, y: 220, note: 'Устье Исети / Т-04' },
    { name: 'г. Тобольск', x: 880, y: 110, note: 'Слияние с Иртышом / Т-05' },
  ];

  return (
    <div id="section-map" className="relative rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-xl overflow-hidden transition-all duration-300">
      {/* Header section with station quick pills */}
      <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800/80">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                <Compass className="w-5 h-5 animate-spin-slow" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Интерактивная карта реки Тобол
              </h2>
              <WaveIndicator variant="equalizer" color="cyan" label="Живой гидро-поток" className="hidden sm:inline-flex ml-2" />
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 mt-1">
              Капиллярная сенсорная сеть: выберите станцию <span className="font-bold text-cyan-700 dark:text-cyan-300">Т-01 – Т-05</span> для детального анализа проб микропластика
            </p>
          </div>

          {/* Layer toggles */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <button
              onClick={() => setActiveLayers((prev) => ({ ...prev, flow: !prev.flow }))}
              className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                activeLayers.flow
                  ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-800 dark:text-cyan-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              <Waves className="w-3.5 h-3.5" />
              <span>Течение реки</span>
            </button>

            <button
              onClick={() => setActiveLayers((prev) => ({ ...prev, heatmap: !prev.heatmap }))}
              className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                activeLayers.heatmap
                  ? 'bg-rose-500/15 border-rose-500/40 text-rose-800 dark:text-rose-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Шлейф микропластика</span>
            </button>

            <button
              onClick={() => setActiveLayers((prev) => ({ ...prev, cities: !prev.cities }))}
              className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                activeLayers.cities
                  ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-800 dark:text-indigo-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Города</span>
            </button>
          </div>
        </div>

        {/* Station Navigation Strip */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider shrink-0 mr-1">
            Станции:
          </span>
          {stations.map((st) => {
            const isSelected = selectedStationId === st.id;
            const badge = getStatusBadge(st.ecoStatus);
            return (
              <button
                key={st.id}
                id={`station-pill-${st.id}`}
                onClick={() => onSelectStation(st)}
                className={`group flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all shrink-0 ${
                  isSelected
                    ? 'bg-cyan-600 text-white border-cyan-500 shadow-md shadow-cyan-600/30 ring-2 ring-cyan-400/40 scale-105'
                    : 'bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700'
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${badge.dotColor}`} />
                <span>{st.id}</span>
                <span className={`text-[11px] px-1.5 py-0.2 rounded font-mono ${isSelected ? 'bg-white/20 text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                  {st.particleCount} част./м³
                </span>
                {st.ecoStatus === 'alarm' && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* SVG Interactive River Canvas */}
      <div className="relative w-full aspect-[16/9] min-h-[420px] max-h-[580px] bg-gradient-to-b from-slate-50 via-cyan-50/20 to-slate-100 dark:from-slate-950 dark:via-slate-900/90 dark:to-slate-950 select-none overflow-hidden">
        {/* River Topo Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0284c708_1px,transparent_1px),linear-gradient(to_bottom,#0284c708_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        <svg
          viewBox="0 0 1000 560"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Linear gradient along the river length */}
            <linearGradient id="tobolGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0284C7" stopOpacity="0.8" />
              <stop offset="35%" stopColor="#0EA5E9" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#E11D48" stopOpacity="0.95" />
              <stop offset="75%" stopColor="#DC2626" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0.85" />
            </linearGradient>

            <linearGradient id="riverWaterBase" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={isDark ? '#0369A1' : '#38BDF8'} stopOpacity={isDark ? '0.35' : '0.5'} />
              <stop offset="50%" stopColor={isDark ? '#0284C7' : '#0EA5E9'} stopOpacity={isDark ? '0.45' : '0.6'} />
              <stop offset="100%" stopColor={isDark ? '#075985' : '#0284C7'} stopOpacity={isDark ? '0.4' : '0.55'} />
            </linearGradient>

            {/* Microplastic pollution cloud filters */}
            <filter id="pollutionGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="16" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Station glow filter */}
            <filter id="stationGlow">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 2 0" />
            </filter>
          </defs>

          {/* Main River Geometry Path (Tobol River course) */}
          {/* Coordinates: (120, 510) -> (240, 440) -> (360, 390) -> (490, 310) -> (600, 260) -> (710, 210) -> (820, 160) -> (920, 90) */}
          
          {/* River banks / floodplain glow */}
          <path
            d="M 120 510 C 180 490, 220 460, 260 440 C 330 405, 380 400, 440 360 C 490 325, 520 310, 560 290 C 620 260, 680 235, 730 205 C 790 170, 840 150, 920 90"
            fill="none"
            stroke={isDark ? '#0369a1' : '#bae6fd'}
            strokeWidth="38"
            strokeLinecap="round"
            opacity={isDark ? '0.2' : '0.5'}
          />

          {/* Tributaries: Iset River joining near Yalutorovsk, Ubagan River */}
          <path
            d="M 520 120 C 580 140, 650 170, 720 208"
            fill="none"
            stroke={isDark ? '#0284c7' : '#7dd3fc'}
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.6"
          />
          <text x="540" y="135" className="text-[11px] fill-slate-700 dark:fill-slate-300 font-mono font-medium">
            р. Исеть (приток) →
          </text>

          <path
            d="M 280 540 C 330 500, 380 440, 440 365"
            fill="none"
            stroke={isDark ? '#0284c7' : '#7dd3fc'}
            strokeWidth="6"
            strokeLinecap="round"
            opacity="0.5"
          />
          <text x="310" y="525" className="text-[10px] fill-slate-700 dark:fill-slate-300 font-mono">
            ← р. Убаган
          </text>

          {/* Primary River Channel */}
          <path
            id="tobol-river-channel"
            d="M 120 510 C 180 490, 220 460, 260 440 C 330 405, 380 400, 440 360 C 490 325, 520 310, 560 290 C 620 260, 680 235, 730 205 C 790 170, 840 150, 920 90"
            fill="none"
            stroke="url(#riverWaterBase)"
            strokeWidth="20"
            strokeLinecap="round"
          />

          {/* Heatmap Layer of Microplastic Contamination (Red alert cloud around T-03 and T-04) */}
          {activeLayers.heatmap && (
            <g opacity="0.65">
              {/* Hotspot near T-03 (Kurgan: 24 particles) */}
              <ellipse
                cx="500"
                cy="325"
                rx="75"
                ry="45"
                fill="#EF4444"
                opacity="0.35"
                filter="url(#pollutionGlow)"
              />
              {/* Hotspot near T-04 (Yalutorovsk: 31 particles) */}
              <ellipse
                cx="720"
                cy="205"
                rx="65"
                ry="38"
                fill="#F43F5E"
                opacity="0.4"
                filter="url(#pollutionGlow)"
              />
              {/* Moderate cloud near T-02 */}
              <ellipse
                cx="330"
                cy="410"
                rx="45"
                ry="30"
                fill="#F59E0B"
                opacity="0.25"
                filter="url(#pollutionGlow)"
              />
            </g>
          )}

          {/* Animated Water Flow Lines (Currents) */}
          {activeLayers.flow && (
            <>
              <path
                d="M 120 510 C 180 490, 220 460, 260 440 C 330 405, 380 400, 440 360 C 490 325, 520 310, 560 290 C 620 260, 680 235, 730 205 C 790 170, 840 150, 920 90"
                fill="none"
                stroke={isDark ? '#38BDF8' : '#0284C7'}
                strokeWidth="3.5"
                className="animate-river-flow"
                strokeOpacity="0.8"
              />
              <path
                d="M 120 510 C 180 490, 220 460, 260 440 C 330 405, 380 400, 440 360 C 490 325, 520 310, 560 290 C 620 260, 680 235, 730 205 C 790 170, 840 150, 920 90"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="1.5"
                className="animate-river-flow-fast"
                strokeOpacity="0.6"
              />
            </>
          )}

          {/* Capillary telemetry interconnect lines between stations */}
          {activeLayers.capillaries && (
            <g strokeDasharray="4 4" stroke={isDark ? '#0284C7' : '#0EA5E9'} strokeWidth="1.2" opacity="0.4">
              <line x1="160" y1="495" x2="330" y2="415" />
              <line x1="330" y1="415" x2="495" y2="330" />
              <line x1="495" y1="330" x2="715" y2="210" />
              <line x1="715" y1="210" x2="890" y2="105" />
            </g>
          )}

          {/* Cities & Anchors */}
          {activeLayers.cities &&
            cities.map((city, idx) => (
              <g key={idx} className="transition-opacity">
                <circle
                  cx={city.x}
                  cy={city.y}
                  r="4.5"
                  className="fill-indigo-600 dark:fill-indigo-400 stroke-white dark:stroke-slate-900"
                  strokeWidth="2"
                />
                <text
                  x={city.x + 8}
                  y={city.y + 4}
                  className="text-xs font-black fill-slate-900 dark:fill-white select-none"
                  style={{ textShadow: isDark ? '0 1px 4px #000' : '0 1px 4px #fff' }}
                >
                  {city.name}
                </text>
                <text
                  x={city.x + 8}
                  y={city.y + 16}
                  className="text-[10px] font-medium fill-slate-700 dark:fill-slate-300 select-none"
                >
                  {city.note}
                </text>
              </g>
            ))}

          {/* Map Coordinates & River Flow Direction Indicator */}
          <g transform="translate(80, 70)">
            <rect
              width="140"
              height="58"
              rx="12"
              className="fill-white/80 dark:fill-slate-900/80 stroke-slate-200 dark:stroke-slate-800"
            />
            <text x="12" y="22" className="text-[11px] font-bold fill-slate-900 dark:fill-slate-100">
              Бассейн реки Тобол
            </text>
            <text x="12" y="38" className="text-[10px] font-medium fill-cyan-700 dark:fill-cyan-400">
              Направление: С-В (к Иртышу) →
            </text>
            <text x="12" y="50" className="text-[9px] font-mono fill-slate-600 dark:fill-slate-300">
              Общая длина: 1591 км
            </text>
          </g>

          {/* STATIONS T-01 through T-05 */}
          {/* Station Coordinates mapped along the river path */}
          {stations.map((station, index) => {
            // Coordinate mapping on 1000x560 SVG
            const coords = [
              { x: 160, y: 495 }, // T-01
              { x: 330, y: 415 }, // T-02
              { x: 495, y: 330 }, // T-03 (Alarm!)
              { x: 715, y: 210 }, // T-04 (Alarm!)
              { x: 890, y: 105 }, // T-05
            ][index] || { x: 500, y: 280 };

            const isSelected = selectedStationId === station.id;
            const isHovered = hoveredStation?.id === station.id;
            const colors = getStatusColor(station.ecoStatus);
            const isAlarm = station.ecoStatus === 'alarm';

            return (
              <g
                key={station.id}
                id={`map-station-${station.id}`}
                className="cursor-pointer group"
                transform={`translate(${coords.x}, ${coords.y})`}
                onClick={() => onSelectStation(station)}
                onMouseEnter={() => setHoveredStation(station)}
                onMouseLeave={() => setHoveredStation(null)}
              >
                {/* Pulsing radar waves around station */}
                <circle
                  r={isAlarm ? '32' : '22'}
                  fill="none"
                  stroke={colors.stroke}
                  strokeWidth="2"
                  className="animate-capillary-wave"
                  opacity="0.6"
                />

                {isAlarm && (
                  <circle
                    r="45"
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="1.5"
                    className="animate-ping"
                    opacity="0.3"
                  />
                )}

                {/* Outer halo */}
                <circle
                  r={isSelected || isHovered ? '20' : '15'}
                  fill={colors.fill}
                  opacity="0.25"
                  className="transition-all duration-300"
                />

                {/* Core Station Marker */}
                <circle
                  r={isSelected ? '12' : '9.5'}
                  fill={colors.stroke}
                  stroke="#FFFFFF"
                  strokeWidth={isSelected ? '3.5' : '2.5'}
                  className="transition-transform duration-300 group-hover:scale-125"
                />

                {/* Inner White dot */}
                <circle r="3" fill="#FFFFFF" />

                {/* Station Tag Pill */}
                <g transform="translate(0, -26)">
                  <rect
                    x="-32"
                    y="-12"
                    width="64"
                    height="22"
                    rx="11"
                    className={`transition-all ${
                      isSelected
                        ? 'fill-cyan-600 stroke-white'
                        : isAlarm
                        ? 'fill-rose-600 stroke-rose-300'
                        : 'fill-slate-900/90 dark:fill-slate-900/95 stroke-slate-300 dark:stroke-slate-700'
                    }`}
                    strokeWidth="1.5"
                  />
                  <text
                    x="0"
                    y="3"
                    textAnchor="middle"
                    className="text-[11px] font-black fill-white tracking-wider font-mono select-none"
                  >
                    {station.id}
                  </text>
                </g>

                {/* Current Value badge */}
                <g transform="translate(0, 24)">
                  <rect
                    x="-42"
                    y="-8"
                    width="84"
                    height="17"
                    rx="8.5"
                    className="fill-white/95 dark:fill-slate-900/95 stroke-slate-300 dark:stroke-slate-700"
                    strokeWidth="1"
                  />
                  <text
                    x="0"
                    y="4"
                    textAnchor="middle"
                    className={`text-[9.5px] font-bold select-none ${
                      isAlarm ? 'fill-rose-600 dark:fill-rose-400 font-black' : 'fill-slate-700 dark:fill-slate-300'
                    }`}
                  >
                    {station.particleCount} част./м³
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* Hover / Quick Preview Popover */}
        {hoveredStation && (
          <div className="absolute top-4 right-4 z-30 w-72 sm:w-80 p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 pointer-events-none">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${getStatusBadge(hoveredStation.ecoStatus).dotColor}`} />
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {hoveredStation.id} • {hoveredStation.name.split('(')[1]?.replace(')', '') || hoveredStation.id}
                </h4>
              </div>
              <span className="text-[10px] font-mono text-slate-600 dark:text-slate-300">
                {hoveredStation.analysisTime}
              </span>
            </div>

            <div className="mt-2.5 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-300 font-medium">Концентрация:</span>
                <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">
                  {hoveredStation.particleCount} частиц/м³
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-300 font-medium">Размер частиц:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">{hoveredStation.particleSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-300 font-medium">Основной тип:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[140px]">
                  {hoveredStation.plasticType}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-slate-100 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-300 font-medium">Статус:</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(hoveredStation.ecoStatus).badgeBorder} ${getStatusBadge(hoveredStation.ecoStatus).badgeBg}`}>
                  {getStatusBadge(hoveredStation.ecoStatus).title}
                </span>
              </div>
            </div>

            <div className="mt-2 pt-2 text-center text-[11px] font-semibold text-cyan-600 dark:text-cyan-400">
              Нажмите для открытия полной карточки анализа →
            </div>
          </div>
        )}

        {/* River Map Legend Bar */}
        <div className="absolute bottom-3 left-3 right-3 sm:left-6 sm:right-auto z-20 flex flex-wrap items-center gap-2 sm:gap-3 p-2.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-lg">
          <span className="text-[11px] uppercase tracking-wider text-slate-600 dark:text-slate-300 font-bold mr-1">
            Индикация:
          </span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Низкий (0–7)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Наблюдение (8–14)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <span>Повышенный (15–20)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-rose-600 dark:text-rose-400 font-bold">Тревога (&gt;20)</span>
          </div>
        </div>
      </div>

      {/* 3D PARALLAX STATION CARDS SECTION */}
      <div className="p-5 sm:p-7 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                <Sparkles className="w-4 h-4 text-cyan-500" />
              </span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Карточки станций с 3D-параллаксом
              </h3>
              <WaveIndicator variant="equalizer" color="cyan" label="3D Спектрометрия" className="hidden sm:inline-flex" />
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
              Наведите курсор на карточку для интерактивного угла обзора и 3D-глубины. Нажмите для открытия полной карты проб и спектрального паспорта.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-700 dark:text-cyan-400 shrink-0">
            <WaveIndicator variant="pulse" color="cyan" />
            <span>5 станций онлайн</span>
          </div>
        </div>

        {/* Dynamic Wave Ribbon divider */}
        <WaveIndicator variant="ribbon" color="cyan" height={10} className="opacity-60" />

        {/* 5-Column Grid with Parallax 3D Tilt Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 pt-1">
          {stations.map((station, index) => (
            <ParallaxStationCard
              key={station.id}
              station={station}
              isSelected={selectedStationId === station.id}
              onSelectStation={onSelectStation}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
