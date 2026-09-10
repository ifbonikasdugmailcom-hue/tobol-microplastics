import React from 'react';
import {
  X,
  Calendar,
  Clock,
  Activity,
  Microscope,
  Layers,
  TrendingUp,
  TrendingDown,
  Minus,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Droplets,
  Thermometer,
  Gauge,
  Compass,
  Cpu,
  Download,
  Share2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { StationData } from '../types';
import { ECO_LEVELS } from '../data/mockData';

interface Props {
  station: StationData | null;
  onClose: () => void;
  onSelectStationById: (id: string) => void;
  stations: StationData[];
}

export const StationDetailModal: React.FC<Props> = ({
  station,
  onClose,
  onSelectStationById,
  stations,
}) => {
  if (!station) return null;

  const currentLevel = ECO_LEVELS.find((l) => l.id === station.ecoStatus) || ECO_LEVELS[0];
  const currentIndex = stations.findIndex((s) => s.id === station.id);
  const prevStation = stations[(currentIndex - 1 + stations.length) % stations.length];
  const nextStation = stations[(currentIndex + 1) % stations.length];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden transition-all"
        role="dialog"
        aria-modal="true"
        aria-labelledby="station-detail-title"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span
              className={`flex items-center justify-center w-12 h-12 rounded-2xl text-lg font-black font-mono shadow-md ${
                station.ecoStatus === 'alarm'
                  ? 'bg-rose-500 text-white shadow-rose-500/30 ring-2 ring-rose-400/40'
                  : station.ecoStatus === 'observation'
                  ? 'bg-amber-500 text-white shadow-amber-500/30'
                  : station.ecoStatus === 'elevated'
                  ? 'bg-orange-500 text-white shadow-orange-500/30'
                  : 'bg-emerald-500 text-white shadow-emerald-500/30'
              }`}
            >
              {station.id}
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold border flex items-center gap-1.5 ${currentLevel.badgeBg} ${currentLevel.badgeBorder}`}
                >
                  <span className={`w-2 h-2 rounded-full ${currentLevel.dotColor}`} />
                  {currentLevel.title}
                </span>
                <span className="text-xs text-slate-600 dark:text-slate-300 font-mono">
                  Обновлено: {station.lastTransmission}
                </span>
              </div>
              <h3
                id="station-detail-title"
                className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-1"
              >
                {station.name}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick switcher between stations */}
            <div className="hidden sm:flex items-center gap-1 border border-slate-200 dark:border-slate-700 rounded-xl p-1 bg-white dark:bg-slate-800">
              <button
                onClick={() => onSelectStationById(prevStation.id)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                title={`Перейти к ${prevStation.id}`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold px-1 text-slate-600 dark:text-slate-300 font-mono">
                {station.id}
              </span>
              <button
                onClick={() => onSelectStationById(nextStation.id)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                title={`Перейти к ${nextStation.id}`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={onClose}
              id="close-station-modal-btn"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Закрыть окно"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Main 7 Key Indicators Required by User */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {/* 1. Дата анализа */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                <Calendar className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>Дата анализа</span>
              </div>
              <p className="text-base font-extrabold text-slate-900 dark:text-white mt-1.5 font-mono">
                {station.analysisDate}
              </p>
              <span className="text-[11px] text-slate-600 dark:text-slate-300">
                По протоколу капиллярного зонда
              </span>
            </div>

            {/* 2. Время */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                <Clock className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>Время замера</span>
              </div>
              <p className="text-base font-extrabold text-slate-900 dark:text-white mt-1.5 font-mono">
                {station.analysisTime} (UTC+5)
              </p>
              <span className="text-[11px] text-slate-600 dark:text-slate-300">
                Синхронизация по спутнику ГЛОНАСС
              </span>
            </div>

            {/* 3. Количество обнаруженных частиц */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-cyan-500/10 to-transparent dark:from-cyan-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-800 dark:text-cyan-300">
                  <Activity className="w-4 h-4" />
                  <span>Количество частиц</span>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-800 dark:text-cyan-200">
                  Март 2026
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-1.5">
                <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
                  {station.particleCount}
                </span>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  частиц / м³
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                Январь: {station.monthlyData.jan} • Февраль: {station.monthlyData.feb}
              </span>
            </div>

            {/* 4. Размер частиц */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                <Microscope className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>Размер частиц</span>
              </div>
              <p className="text-base font-extrabold text-slate-900 dark:text-white mt-1.5 font-mono">
                {station.particleSize}
              </p>
              <span className="text-[11px] text-slate-600 dark:text-slate-300">
                Микроволокна, фрагменты, микросферы
              </span>
            </div>

            {/* 5. Тип пластика */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                <Layers className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>Тип пластика</span>
              </div>
              <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-1.5 line-clamp-2">
                {station.plasticType}
              </p>
              <span className="text-[11px] text-slate-600 dark:text-slate-300">
                Спектроскопия рамановского рассеяния
              </span>
            </div>

            {/* 6. Динамика изменения */}
            <div
              className={`p-4 rounded-2xl border ${
                station.dynamics.direction === 'up'
                  ? 'border-rose-500/30 bg-rose-500/10'
                  : 'border-emerald-500/30 bg-emerald-500/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  <TrendingUp className="w-4 h-4 text-rose-500" />
                  <span>Динамика изменения</span>
                </div>
                <span
                  className={`text-xs font-mono font-black px-2 py-0.5 rounded-full ${
                    station.dynamics.direction === 'up'
                      ? 'bg-rose-500 text-white'
                      : 'bg-emerald-500 text-white'
                  }`}
                >
                  {station.dynamics.direction === 'up' ? '+' : ''}
                  {station.dynamics.percentage}%
                </span>
              </div>
              <p className="text-xs font-bold text-slate-900 dark:text-white mt-2 leading-relaxed">
                {station.dynamics.description}
              </p>
            </div>
          </div>

          {/* 7. Экологический статус — Детальная полоса */}
          <div
            className={`p-5 rounded-2xl border ${currentLevel.badgeBorder} ${currentLevel.badgeBg} transition-all`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 shadow-sm shrink-0">
                  {station.ecoStatus === 'alarm' ? (
                    <ShieldAlert className="w-7 h-7 text-rose-500 animate-pulse" />
                  ) : station.ecoStatus === 'observation' ? (
                    <AlertTriangle className="w-7 h-7 text-amber-500" />
                  ) : (
                    <ShieldCheck className="w-7 h-7 text-emerald-500" />
                  )}
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    Экологический статус участка реки
                  </span>
                  <h4 className="text-lg font-black text-slate-950 dark:text-white">
                    {currentLevel.title} ({currentLevel.range})
                  </h4>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block">
                  Нормативный регламент:
                </span>
                <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                  {currentLevel.actionRequired}
                </span>
              </div>
            </div>
          </div>

          {/* Photo & Polymer breakdown section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Station / Sampling high-res photo */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 overflow-hidden">
              <div className="relative aspect-video w-full overflow-hidden group">
                <img
                  src={station.photoUrl}
                  alt={`Фотография станции ${station.id}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded bg-cyan-500 text-white">
                      Фотофиксация
                    </span>
                    <span className="text-xs text-white/90 font-mono">
                      {station.location}
                    </span>
                  </div>
                  <p className="text-xs text-white/80 mt-1 line-clamp-1 font-medium">
                    {station.description}
                  </p>
                </div>
              </div>
              <div className="p-3.5 bg-white dark:bg-slate-900 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <Cpu className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <span>Оборудование: {station.sensorModel}</span>
                </div>
              </div>
            </div>

            {/* Polymer Composition Breakdown */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Спектральный состав полимеров
                  </h4>
                </div>
                <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300">
                  100% пробы
                </span>
              </div>

              {/* Progress segments bar */}
              <div className="w-full h-3.5 rounded-full overflow-hidden flex mt-4 bg-slate-100 dark:bg-slate-800">
                {station.plasticBreakdown.map((item, idx) => (
                  <div
                    key={idx}
                    style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                    className="h-full transition-all duration-500"
                    title={`${item.type}: ${item.percentage}%`}
                  />
                ))}
              </div>

              {/* Breakdown itemized list */}
              <div className="mt-4 space-y-2.5">
                {station.plasticBreakdown.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-3 h-3 rounded-md shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {item.type}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {item.percentage}%
                    </span>
                  </div>
                ))}
              </div>

              {/* Hydrological sensor extra stats */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-[10px] text-slate-600 dark:text-slate-300 block">Темп. воды</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                    {station.waterTemp}°C
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-[10px] text-slate-600 dark:text-slate-300 block">Скорость течения</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                    {station.flowSpeed} м/с
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-[10px] text-slate-600 dark:text-slate-300 block">Мутность</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                    {station.turbidity} NTU
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 font-mono">
            <span>Широта: {station.coordinates.lat}°</span>
            <span>•</span>
            <span>Долгота: {station.coordinates.lng}°</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Печать протокола</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-white text-xs font-bold shadow-md shadow-cyan-600/30 transition-all"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
