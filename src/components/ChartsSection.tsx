import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Info,
  Calendar,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { StationData } from '../types';
import { WaveIndicator } from './WaveIndicator';

interface Props {
  stations: StationData[];
  onSelectStation: (station: StationData) => void;
  isDark: boolean;
}

export const ChartsSection: React.FC<Props> = ({
  stations,
  onSelectStation,
  isDark,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<'all' | 'jan' | 'feb' | 'mar'>('all');
  const [chartType, setChartType] = useState<'grouped' | 'trend'>('grouped');
  const [hoveredStationId, setHoveredStationId] = useState<string | null>(null);

  // Maximum value for scaling the chart (max value is 31 or 35)
  const maxValue = 35;

  // Compute station with the sharpest increase
  const sortedBySurge = [...stations].sort((a, b) => b.dynamics.percentage - a.dynamics.percentage);
  const highestSurgeStation = sortedBySurge[0];

  return (
    <div
      id="section-charts"
      className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-5 sm:p-7 shadow-xl space-y-6 transition-all"
    >
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <BarChart3 className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Графики динамики микропластика (Январь – Март)
            </h2>
            <WaveIndicator variant="equalizer" color="cyan" label="Живая динамика" className="hidden sm:inline-flex ml-2" />
          </div>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 mt-1">
            Количество микропластика, <span className="font-mono font-bold text-cyan-700 dark:text-cyan-300">частиц/м³</span>. Наглядно показывает, на каком участке реки Тобол происходит рост загрязнения.
          </p>
        </div>

        {/* View Mode & Month filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Chart Type Toggle */}
          <div className="flex rounded-xl p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold">
            <button
              onClick={() => setChartType('grouped')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                chartType === 'grouped'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Столбцы (Янв/Фев/Мар)
            </button>
            <button
              onClick={() => setChartType('trend')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                chartType === 'trend'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Линии тренда
            </button>
          </div>

          {/* Month Selector */}
          <div className="flex rounded-xl p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold">
            {(['all', 'jan', 'feb', 'mar'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMonth(m)}
                className={`px-2.5 py-1.5 rounded-lg uppercase tracking-wider transition-all ${
                  selectedMonth === m
                    ? 'bg-cyan-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {m === 'all' ? 'Все' : m === 'jan' ? 'Янв' : m === 'feb' ? 'Фев' : 'Мар'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Critical surge callout banner */}
      <div className="p-4 sm:p-5 rounded-2xl border border-rose-500/30 bg-rose-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-500 text-white shrink-0 shadow-md shadow-rose-500/30">
            <TrendingUp className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase text-rose-600 dark:text-rose-400">
                Ключевой вывод анализа
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                Скачок +100%
              </span>
            </div>
            <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
              Наибольший скачок микропластика зафиксирован на участке{' '}
              <button
                onClick={() => {
                  const st = stations.find((s) => s.id === 'Т-03');
                  if (st) onSelectStation(st);
                }}
                className="text-rose-700 dark:text-rose-300 underline font-black hover:text-rose-800"
              >
                Т-03 (Курганский створ)
              </button>
              : рост с <span className="font-mono">12</span> до <span className="font-mono">24 част./м³</span>!
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            const st = stations.find((s) => s.id === 'Т-03');
            if (st) onSelectStation(st);
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/30 transition-all active:scale-95 shrink-0"
        >
          <span>Смотреть анализ Т-03</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Interactive Chart Canvas */}
      <div className="p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70">
        {/* Y-axis grid scale reference */}
        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 font-mono pb-2 border-b border-slate-200 dark:border-slate-800">
          <span>Шкала: 0 — 35 частиц/м³</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-cyan-400 inline-block" />
              Январь
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-sky-500 inline-block" />
              Февраль
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-rose-500 inline-block" />
              Март (Текущий)
            </span>
            <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-bold border-l pl-3 border-slate-300 dark:border-slate-700">
              <span className="w-2 h-0.5 bg-rose-500 inline-block border-t border-dashed" />
              Порог тревоги (20)
            </span>
          </div>
        </div>

        {/* Chart Visualization Area */}
        <div className="relative pt-8 pb-4 min-h-[280px] flex items-end justify-between gap-2 sm:gap-6 border-b border-slate-300 dark:border-slate-700 overflow-hidden">
          {/* Animated river wave indicator along chart baseline */}
          <div className="absolute bottom-0 left-0 right-0 pointer-events-none opacity-30 z-0">
            <WaveIndicator variant="stream" color="cyan" height={36} intensity="calm" />
          </div>
          {/* Reference Line: Alarm Threshold (20) */}
          <div
            className="absolute left-0 right-0 border-b-2 border-dashed border-rose-500/50 pointer-events-none z-10"
            style={{ bottom: `${(20 / maxValue) * 100}%` }}
          >
            <span className="absolute -top-5 right-2 text-[10px] font-mono font-bold bg-rose-500 text-white px-1.5 py-0.5 rounded shadow-xs">
              Критический порог: 20 част./м³
            </span>
          </div>

          {/* Reference Line: Observation (8) */}
          <div
            className="absolute left-0 right-0 border-b border-dashed border-amber-500/40 pointer-events-none"
            style={{ bottom: `${(8 / maxValue) * 100}%` }}
          >
            <span className="absolute -top-4 right-2 text-[10px] font-mono font-semibold text-amber-600 dark:text-amber-400">
              Порог наблюдения: 8
            </span>
          </div>

          {/* Columns for each Station */}
          {stations.map((st) => {
            const isHovered = hoveredStationId === st.id;
            const isAlarm = st.ecoStatus === 'alarm';
            const heightJan = (st.monthlyData.jan / maxValue) * 100;
            const heightFeb = (st.monthlyData.feb / maxValue) * 100;
            const heightMar = (st.monthlyData.mar / maxValue) * 100;

            return (
              <div
                key={st.id}
                className="flex-1 flex flex-col items-center group cursor-pointer"
                onClick={() => onSelectStation(st)}
                onMouseEnter={() => setHoveredStationId(st.id)}
                onMouseLeave={() => setHoveredStationId(null)}
              >
                {/* Station top tag */}
                <div className="mb-2 text-center">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-md text-xs font-mono font-black transition-all ${
                      isAlarm
                        ? 'bg-rose-500 text-white ring-2 ring-rose-300 animate-pulse'
                        : isHovered
                        ? 'bg-cyan-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {st.id}
                  </span>
                  {st.dynamics.direction === 'up' && (
                    <span className="block text-[10px] font-bold text-rose-600 dark:text-rose-400 mt-0.5">
                      +{st.dynamics.percentage}%
                    </span>
                  )}
                </div>

                {/* Bars group */}
                <div className="w-full max-w-[80px] h-[220px] flex items-end justify-center gap-1 sm:gap-2 px-1 rounded-t-xl bg-slate-200/40 dark:bg-slate-900/40 transition-colors group-hover:bg-slate-200 dark:group-hover:bg-slate-800/80">
                  {/* January Bar */}
                  {(selectedMonth === 'all' || selectedMonth === 'jan') && (
                    <div
                      className="flex-1 min-w-[8px] bg-cyan-400 dark:bg-cyan-500 rounded-t-md relative group/bar transition-all duration-500"
                      style={{ height: `${heightJan}%` }}
                    >
                      <span className="opacity-0 group-hover/bar:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold bg-slate-900 text-white px-1 rounded pointer-events-none z-20">
                        {st.monthlyData.jan}
                      </span>
                    </div>
                  )}

                  {/* February Bar */}
                  {(selectedMonth === 'all' || selectedMonth === 'feb') && (
                    <div
                      className="flex-1 min-w-[8px] bg-sky-500 dark:bg-sky-600 rounded-t-md relative group/bar transition-all duration-500"
                      style={{ height: `${heightFeb}%` }}
                    >
                      <span className="opacity-0 group-hover/bar:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold bg-slate-900 text-white px-1 rounded pointer-events-none z-20">
                        {st.monthlyData.feb}
                      </span>
                    </div>
                  )}

                  {/* March Bar (Current) */}
                  {(selectedMonth === 'all' || selectedMonth === 'mar') && (
                    <div
                      className={`flex-1 min-w-[10px] rounded-t-md relative group/bar transition-all duration-500 ${
                        isAlarm
                          ? 'bg-rose-500 dark:bg-rose-600 shadow-[0_0_12px_rgba(239,68,68,0.5)]'
                          : st.ecoStatus === 'observation'
                          ? 'bg-amber-500 dark:bg-amber-600'
                          : 'bg-emerald-500 dark:bg-emerald-600'
                      }`}
                      style={{ height: `${heightMar}%` }}
                    >
                      <span className="opacity-0 group-hover/bar:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold bg-slate-900 text-white px-1 rounded pointer-events-none z-20">
                        {st.monthlyData.mar}
                      </span>
                    </div>
                  )}
                </div>

                {/* Bottom label */}
                <div className="mt-2 text-center">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate max-w-[90px]">
                    {st.name.split('(')[1]?.replace(')', '') || st.id}
                  </span>
                  <span className="text-[11px] font-mono font-extrabold text-slate-700 dark:text-slate-300">
                    {st.particleCount} част.
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Chart Footer Legend */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-1.5">
            <Info className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
            <span>
              Данные усреднены по результатам 72 капиллярных сканирований в каждом календарном месяце.
            </span>
          </div>
          <span className="font-mono text-cyan-700 dark:text-cyan-300 font-semibold">
            Единица: частиц микропластика на 1 м³ речной воды
          </span>
        </div>
      </div>
    </div>
  );
};
