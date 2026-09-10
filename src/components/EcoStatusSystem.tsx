import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Radio,
  BellRing,
  Zap,
  Activity,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Info,
} from 'lucide-react';
import { ECO_LEVELS } from '../data/mockData';
import { StationData } from '../types';
import { WaveIndicator } from './WaveIndicator';

interface Props {
  stations: StationData[];
  onSelectStation: (station: StationData) => void;
  onTriggerSurgeSimulation: () => void;
}

export const EcoStatusSystem: React.FC<Props> = ({
  stations,
  onSelectStation,
  onTriggerSurgeSimulation,
}) => {
  // Count stations per status
  const countByStatus = (status: string) =>
    stations.filter((s) => s.ecoStatus === status).length;

  return (
    <div
      id="section-indicators"
      className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-5 sm:p-7 shadow-xl space-y-6 transition-all"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <Activity className="w-5 h-5 animate-pulse" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Система экологической индикации реки Тобол
            </h2>
            <WaveIndicator variant="equalizer" color="cyan" label="Шкала качества" className="hidden sm:inline-flex ml-2" />
          </div>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 mt-1">
            4-уровневая капиллярная шкала оценки загрязненности речного бассейна микропластиком.
          </p>
        </div>

        {/* Trigger Simulation Button */}
        <button
          onClick={onTriggerSurgeSimulation}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 text-white font-extrabold text-xs shadow-md shadow-rose-600/20 hover:opacity-90 active:scale-95 transition-all self-start md:self-auto"
        >
          <Zap className="w-4 h-4 text-amber-200" />
          <span>Тест авто-уведомления при скачке</span>
        </button>
      </div>

      {/* 4 Cards for Each Indicator Level */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {ECO_LEVELS.map((level) => {
          const activeStations = stations.filter((s) => s.ecoStatus === level.id);
          const isAlarm = level.id === 'alarm';

          return (
            <div
              key={level.id}
              className={`relative rounded-2xl p-5 border transition-all duration-300 hover:shadow-lg flex flex-col justify-between ${
                isAlarm
                  ? 'border-rose-500/40 bg-gradient-to-b from-rose-500/10 to-transparent dark:from-rose-500/20'
                  : level.id === 'elevated'
                  ? 'border-orange-500/40 bg-gradient-to-b from-orange-500/10 to-transparent dark:from-orange-500/20'
                  : level.id === 'observation'
                  ? 'border-amber-500/40 bg-gradient-to-b from-amber-500/10 to-transparent dark:from-amber-500/20'
                  : 'border-emerald-500/40 bg-gradient-to-b from-emerald-500/10 to-transparent dark:from-emerald-500/20'
              }`}
            >
              <div>
                {/* Status Dot & Range */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-3.5 h-3.5 rounded-full ${level.dotColor}`} />
                    <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                      {level.range}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      activeStations.length > 0
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {activeStations.length} {activeStations.length === 1 ? 'станция' : 'станции'}
                  </span>
                </div>

                {/* Level Title */}
                <h3 className="text-base font-black text-slate-900 dark:text-white mt-3">
                  {level.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-700 dark:text-slate-200 mt-2 leading-relaxed">
                  {level.description}
                </p>

                {/* Action Required */}
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block">
                    Автоматический протокол:
                  </span>
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 mt-1">
                    {level.actionRequired}
                  </p>
                </div>
              </div>

              {/* Active Stations in this category */}
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
                {activeStations.length > 0 ? (
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-slate-600 dark:text-slate-300 font-bold block">
                      Участки в этом статусе:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeStations.map((st) => (
                        <button
                          key={st.id}
                          onClick={() => onSelectStation(st)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-mono font-black border transition-all hover:scale-105 active:scale-95 ${
                            isAlarm
                              ? 'bg-rose-500 text-white border-rose-400 shadow-xs'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700'
                          }`}
                        >
                          {st.id} ({st.particleCount} част.)
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-slate-600 dark:text-slate-300 italic">
                    На данный момент станций нет
                  </span>
                )}
              </div>

              {/* Dynamic Wave Indicator at bottom of each indicator card */}
              <div className="mt-4 pt-2 -mx-5 -mb-5 overflow-hidden rounded-b-2xl opacity-60">
                <WaveIndicator
                  variant="stream"
                  color={isAlarm ? 'rose' : level.id === 'elevated' ? 'amber' : level.id === 'observation' ? 'amber' : 'emerald'}
                  height={18}
                  intensity={isAlarm ? 'rapid' : 'calm'}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Automated Alert Mechanism Explanation Box */}
      <div className="p-5 rounded-2xl border border-cyan-500/30 bg-cyan-500/5 dark:bg-cyan-500/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-cyan-600 text-white shrink-0 shadow-md shadow-cyan-600/30">
            <BellRing className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Как работает автоматическое формирование уведомлений?
            </h4>
            <p className="text-xs text-slate-700 dark:text-slate-200 mt-1 leading-relaxed max-w-3xl">
              Капиллярные сенсоры Тобола ведут непрерывный мониторинг. При резком увеличении показателей (рост &gt;25% за цикл или превышение порога в 20 част./м³ на участках вроде <strong className="text-rose-600 dark:text-rose-400">Т-03</strong>) система немедленно:
              <br />
              1) Формирует звуковое и визуальное оповещение на сайте;
              <br />
              2) Фиксирует точку сброса на интерактивной карте алым шлейфом;
              <br />
              3) Отправляет экстренный протокол в службу мониторинга водных ресурсов бассейна реки Тобол.
            </p>
          </div>
        </div>

        <button
          onClick={onTriggerSurgeSimulation}
          className="shrink-0 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-600/30 transition-all active:scale-95"
        >
          Запустить демонстрацию оповещения
        </button>
      </div>
    </div>
  );
};
