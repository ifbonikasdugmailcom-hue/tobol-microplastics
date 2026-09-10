import React, { useState } from 'react';
import {
  Table as TableIcon,
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
  ChevronUp,
  Layers,
  Sparkles,
  Search,
  Filter,
  Eye,
  Microscope,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
} from 'lucide-react';
import { StationData } from '../types';
import { ECO_LEVELS } from '../data/mockData';
import { WaveIndicator } from './WaveIndicator';

interface Props {
  stations: StationData[];
  onSelectStation: (station: StationData) => void;
}

type SortField = 'id' | 'jan' | 'feb' | 'mar' | 'growth' | 'status';

export const MovingTable: React.FC<Props> = ({ stations, onSelectStation }) => {
  const [sortField, setSortField] = useState<SortField>('growth');
  const [sortAsc, setSortAsc] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'alarm' | 'observation' | 'low'>('all');
  const [expandedStationId, setExpandedStationId] = useState<string | null>('Т-03');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const filteredStations = stations.filter((st) => {
    const matchesSearch =
      st.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.plasticType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || st.ecoStatus === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const sortedStations = [...filteredStations].sort((a, b) => {
    let diff = 0;
    switch (sortField) {
      case 'id':
        diff = a.id.localeCompare(b.id);
        break;
      case 'jan':
        diff = a.monthlyData.jan - b.monthlyData.jan;
        break;
      case 'feb':
        diff = a.monthlyData.feb - b.monthlyData.feb;
        break;
      case 'mar':
        diff = a.monthlyData.mar - b.monthlyData.mar;
        break;
      case 'growth':
        diff = a.dynamics.percentage - b.dynamics.percentage;
        break;
      case 'status':
        const priority = { alarm: 4, elevated: 3, observation: 2, low: 1 };
        diff = (priority[a.ecoStatus] || 0) - (priority[b.ecoStatus] || 0);
        break;
    }
    return sortAsc ? diff : -diff;
  });

  const getStatusLevel = (status: string) => {
    return ECO_LEVELS.find((l) => l.id === status) || ECO_LEVELS[0];
  };

  return (
    <div
      id="section-table"
      className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-5 sm:p-7 shadow-xl space-y-5 transition-all"
    >
      {/* Table Header & Interactive Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <TableIcon className="w-5 h-5 animate-pulse" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Динамическая таблица мониторинга микропластика
            </h2>
            <WaveIndicator variant="equalizer" color="cyan" label="Живая таблица" className="hidden sm:inline-flex ml-2" />
          </div>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 mt-1">
            Количество микропластика, <span className="font-mono font-bold text-cyan-700 dark:text-cyan-300">частиц/м³</span>. Нажмите на столбец для интерактивной сортировки или на строку для разворота состава.
          </p>
        </div>

        {/* Search and filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по станции..."
              className="pl-9 pr-3 py-1.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="flex rounded-xl p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold">
            {(['all', 'alarm', 'observation', 'low'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                  selectedFilter === filter
                    ? 'bg-cyan-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {filter === 'all'
                  ? 'Все'
                  : filter === 'alarm'
                  ? 'Тревога'
                  : filter === 'observation'
                  ? 'Наблюдение'
                  : 'Норма'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Responsive Moving Table Container */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100/90 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 font-extrabold uppercase tracking-wider select-none">
              <th
                onClick={() => handleSort('id')}
                className="py-3.5 px-4 cursor-pointer hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Участок</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </th>

              <th
                onClick={() => handleSort('jan')}
                className="py-3.5 px-4 cursor-pointer hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Январь</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </th>

              <th
                onClick={() => handleSort('feb')}
                className="py-3.5 px-4 cursor-pointer hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Февраль</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </th>

              <th
                onClick={() => handleSort('mar')}
                className="py-3.5 px-4 cursor-pointer hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors bg-cyan-500/10 dark:bg-cyan-500/20"
              >
                <div className="flex items-center gap-1.5 text-cyan-800 dark:text-cyan-300">
                  <span>Март (Текущий)</span>
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>

              <th
                onClick={() => handleSort('growth')}
                className="py-3.5 px-4 cursor-pointer hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Динамика роста</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </th>

              <th
                onClick={() => handleSort('status')}
                className="py-3.5 px-4 cursor-pointer hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Экологический статус</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </th>

              <th className="py-3.5 px-4 text-center">Действие</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {sortedStations.map((station) => {
              const level = getStatusLevel(station.ecoStatus);
              const isExpanded = expandedStationId === station.id;
              const isAlarm = station.ecoStatus === 'alarm';
              const maxVal = 35;

              return (
                <React.Fragment key={station.id}>
                  <tr
                    className={`group transition-all duration-200 cursor-pointer ${
                      isAlarm
                        ? 'bg-rose-500/5 hover:bg-rose-500/10'
                        : isExpanded
                        ? 'bg-cyan-500/5 dark:bg-cyan-500/10'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    {/* Station Name & ID */}
                    <td
                      onClick={() => setExpandedStationId(isExpanded ? null : station.id)}
                      className="py-3.5 px-4 font-bold"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`flex items-center justify-center w-8 h-8 rounded-xl font-mono font-black text-xs ${
                            isAlarm
                              ? 'bg-rose-500 text-white shadow-xs shadow-rose-500/40'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-100'
                          }`}
                        >
                          {station.id}
                        </span>
                        <div>
                          <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>{station.name}</span>
                            {isAlarm && (
                              <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-600 dark:text-slate-300 font-normal">
                            {station.location}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* January Value + Animated Bar */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                      <div className="space-y-1">
                        <span className="text-sm">{station.monthlyData.jan} част.</span>
                        <div className="w-20 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                          <div
                            className="h-full bg-cyan-400 transition-all duration-700"
                            style={{ width: `${(station.monthlyData.jan / maxVal) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* February Value + Animated Bar */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                      <div className="space-y-1">
                        <span className="text-sm">{station.monthlyData.feb} част.</span>
                        <div className="w-20 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                          <div
                            className="h-full bg-sky-500 transition-all duration-700"
                            style={{ width: `${(station.monthlyData.feb / maxVal) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* March Value (Current) + Animated Bar */}
                    <td className="py-3.5 px-4 font-mono font-extrabold bg-cyan-500/5 dark:bg-cyan-500/10">
                      <div className="space-y-1">
                        <span
                          className={`text-sm ${
                            isAlarm
                              ? 'text-rose-600 dark:text-rose-400 font-black'
                              : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          {station.monthlyData.mar} част./м³
                        </span>
                        <div className="w-24 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                          <div
                            className={`h-full transition-all duration-700 ${
                              isAlarm
                                ? 'bg-rose-500 animate-pulse'
                                : station.ecoStatus === 'observation'
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${(station.monthlyData.mar / maxVal) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Dynamics (Percentage change) */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        {station.dynamics.direction === 'up' ? (
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-300 font-mono font-bold border border-rose-500/30">
                            <TrendingUp className="w-3.5 h-3.5 text-rose-500" />
                            <span>+{station.dynamics.percentage}%</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-mono font-bold border border-emerald-500/30">
                            <Minus className="w-3.5 h-3.5 text-emerald-500" />
                            <span>0% (Стаб.)</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${level.badgeBg} ${level.badgeBorder}`}
                      >
                        <span className={`w-2 h-2 rounded-full ${level.dotColor}`} />
                        <span>{level.title}</span>
                      </span>
                    </td>

                    {/* Action Button */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectStation(station);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-xs active:scale-95 transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Анализ</span>
                      </button>
                    </td>
                  </tr>

                  {/* Expandable sub-row with moving detailed polymer breakdown */}
                  {isExpanded && (
                    <tr className="bg-slate-50/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 animate-in fade-in duration-200">
                      <td colSpan={7} className="p-4 sm:p-5">
                        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 shadow-inner space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <Microscope className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                              <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                                Детальный лабораторный спектр: {station.id}
                              </span>
                              <span className="text-xs text-slate-600 dark:text-slate-300 font-mono">
                                Размер: {station.particleSize}
                              </span>
                            </div>
                            <span className="text-xs font-bold text-cyan-700 dark:text-cyan-300">
                              Основной пластик: {station.plasticType}
                            </span>
                          </div>

                          {/* Dynamic moving polymer fraction bar */}
                          <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-100 dark:bg-slate-700">
                            {station.plasticBreakdown.map((item, idx) => (
                              <div
                                key={idx}
                                style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                                className="h-full transition-all duration-700 hover:opacity-80"
                                title={`${item.type}: ${item.percentage}%`}
                              />
                            ))}
                          </div>

                          {/* Chips */}
                          <div className="flex flex-wrap items-center gap-3 pt-1">
                            {station.plasticBreakdown.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/50 px-2.5 py-1 rounded-lg"
                              >
                                <span
                                  className="w-2.5 h-2.5 rounded-full"
                                  style={{ backgroundColor: item.color }}
                                />
                                <span>{item.type}:</span>
                                <span className="font-mono font-bold text-slate-900 dark:text-white">
                                  {item.percentage}%
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary Footer of Table */}
      <div className="p-3.5 rounded-2xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-700 dark:text-slate-200">
        <span className="font-medium">
          Показано станций: <strong className="text-slate-900 dark:text-white font-mono">{sortedStations.length} из 5</strong>.
          Критический рост наблюдается на участках <strong className="text-rose-600 dark:text-rose-400 font-mono">Т-03 (+100%)</strong> и <strong className="text-rose-600 dark:text-rose-400 font-mono">Т-04 (+106.6%)</strong>.
        </span>
        <button
          onClick={() => {
            const st = stations.find((s) => s.id === 'Т-03');
            if (st) onSelectStation(st);
          }}
          className="text-cyan-600 dark:text-cyan-400 hover:underline font-bold"
        >
          Подробнее о точке скачка Т-03 →
        </button>
      </div>
    </div>
  );
};
