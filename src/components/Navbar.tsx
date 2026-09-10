import React, { useState } from 'react';
import {
  Waves,
  Sun,
  Moon,
  Bell,
  Radio,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  X,
  MapPin,
  Newspaper,
  Bot,
} from 'lucide-react';
import { SystemAlert } from '../types';

interface Props {
  isDark: boolean;
  onToggleTheme: () => void;
  alerts: SystemAlert[];
  soundEnabled: boolean;
  onToggleSound: () => void;
  onSelectAlert: (alert: SystemAlert) => void;
  onTriggerSurgeSimulation: () => void;
  onOpenAgent: () => void;
}

export const Navbar: React.FC<Props> = ({
  isDark,
  onToggleTheme,
  alerts,
  soundEnabled,
  onToggleSound,
  onSelectAlert,
  onTriggerSurgeSimulation,
  onOpenAgent,
}) => {
  const [showAlertDropdown, setShowAlertDropdown] = useState(false);
  const unreadAlerts = alerts.filter(a => !a.isRead);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl border-b transition-colors duration-300 bg-white/90 dark:bg-slate-950/90 border-slate-200 dark:border-slate-800/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-600 to-sky-400 text-white shadow-md shadow-cyan-500/20">
            <Waves className="w-6 h-6 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-500/20">
                Спецпроект
              </span>
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>5 станций онлайн</span>
              </div>
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Капиллярный интернет Тобола
            </h1>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-200">
          <button
            onClick={() => scrollTo('section-map')}
            className="px-3 py-1.5 rounded-lg hover:bg-cyan-500/10 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-1"
          >
            <Waves className="w-3.5 h-3.5 text-cyan-500" />
            <span>Карта и станции</span>
          </button>
          <button
            onClick={() => scrollTo('news-and-articles')}
            className="px-3 py-1.5 rounded-lg hover:bg-cyan-500/10 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-1"
          >
            <Newspaper className="w-3.5 h-3.5 text-cyan-500" />
            <span>Новости и статьи</span>
          </button>
          <button
            onClick={() => scrollTo('section-charts')}
            className="px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Графики (Янв-Мар)
          </button>
          <button
            onClick={() => scrollTo('section-table')}
            className="px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Таблица
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* AI Agent trigger button */}
          <button
            onClick={onOpenAgent}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white shadow-md shadow-cyan-600/20 active:scale-95 transition-all"
            title="Открыть ИИ-агента Тобол-ИИ"
          >
            <Bot className="w-4 h-4 text-cyan-200" />
            <span className="hidden sm:inline">Тобол-ИИ</span>
          </button>

          {/* Surge simulation button */}
          <button
            id="trigger-surge-btn"
            onClick={onTriggerSurgeSimulation}
            title="Смоделировать резкий скачок микропластика"
            className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-300 hover:bg-amber-500/20 active:scale-95 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Тест скачка</span>
          </button>


          {/* Sound alert toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Звук оповещений включен' : 'Звук оповещений отключен'}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Переключить звук"
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            ) : (
              <VolumeX className="w-5 h-5 text-slate-400" />
            )}
          </button>

          {/* Alerts Bell with Badge */}
          <div className="relative">
            <button
              id="alerts-bell-btn"
              onClick={() => setShowAlertDropdown(!showAlertDropdown)}
              className="relative p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Оповещения"
            >
              <Bell className={`w-5 h-5 ${unreadAlerts.length > 0 ? 'text-rose-500 animate-bounce' : ''}`} />
              {unreadAlerts.length > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-950">
                  {unreadAlerts.length}
                </span>
              )}
            </button>

            {/* Alerts Dropdown */}
            {showAlertDropdown && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl p-4 shadow-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      Автоматические оповещения
                    </span>
                  </div>
                  <button
                    onClick={() => setShowAlertDropdown(false)}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      onClick={() => {
                        onSelectAlert(alert);
                        setShowAlertDropdown(false);
                      }}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all hover:scale-[1.01] ${
                        alert.level === 'alarm'
                          ? 'bg-rose-500/10 border-rose-500/30 hover:border-rose-500/60'
                          : 'bg-amber-500/10 border-amber-500/30 hover:border-amber-500/60'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-semibold text-rose-600 dark:text-rose-400 mb-1">
                        <span>{alert.stationId} • {alert.timestamp}</span>
                        {!alert.isRead && (
                          <span className="px-1.5 py-0.5 rounded bg-rose-500 text-white text-[10px]">
                            Новое
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                        {alert.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                        {alert.message}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                  <span className="text-[11px] text-slate-600 dark:text-slate-300">
                    Система мониторинга Тобола • Авто-протокол
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Theme switcher: Dark / Light */}
          <button
            id="theme-toggle-btn"
            onClick={onToggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
            title={isDark ? 'Включить светлую тему' : 'Включить тёмную тему'}
            aria-label="Сменить тему оформления"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-amber-400 animate-spin-slow" />
            ) : (
              <Moon className="w-5 h-5 text-slate-700" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
