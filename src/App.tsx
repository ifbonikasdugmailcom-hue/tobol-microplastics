import React, { useState, useEffect } from 'react';
import {
  Waves,
  Activity,
  AlertTriangle,
  Compass,
  Radio,
  Sparkles,
  Droplets,
  Microscope,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  FileCheck,
  RefreshCw,
  Bell,
  Eye,
  Newspaper,
  Bot,
} from 'lucide-react';
import { StationData, SystemAlert, Article } from './types';
import { INITIAL_STATIONS, INITIAL_ALERTS, ECO_LEVELS } from './data/mockData';
import { INITIAL_ARTICLES } from './data/articlesData';
import { playAlertChime } from './utils/audioAlert';
import { Navbar } from './components/Navbar';
import { AlertBanner } from './components/AlertBanner';
import { TobolMap } from './components/TobolMap';
import { StationDetailModal } from './components/StationDetailModal';
import { ChartsSection } from './components/ChartsSection';
import { MovingTable } from './components/MovingTable';
import { EcoStatusSystem } from './components/EcoStatusSystem';
import { PhotoGallery } from './components/PhotoGallery';
import { NewsSection } from './components/NewsSection';
import { ArticleReaderModal } from './components/ArticleReaderModal';
import { PublishArticleModal } from './components/PublishArticleModal';
import { TobolEcoAgent } from './components/TobolEcoAgent';
import { AlertProtocolModal } from './components/AlertProtocolModal';
import { AnimatedRiverBackground } from './components/AnimatedRiverBackground';
import { WaveIndicator } from './components/WaveIndicator';

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [stations, setStations] = useState<StationData[]>(INITIAL_STATIONS);
  const [selectedStation, setSelectedStation] = useState<StationData | null>(null);
  const [alerts, setAlerts] = useState<SystemAlert[]>(INITIAL_ALERTS);
  const [activeAlertProtocol, setActiveAlertProtocol] = useState<SystemAlert | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Articles & News state (with local storage persistence)
  const [articles, setArticles] = useState<Article[]>(() => {
    try {
      const saved = localStorage.getItem('tobol_articles_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_ARTICLES;
  });

  const [activeReadingArticle, setActiveReadingArticle] = useState<Article | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [publishDraft, setPublishDraft] = useState<{
    title: string;
    category: 'news' | 'science' | 'education';
    summary: string;
    content: string;
  } | null>(null);
  const [agentExternalPrompt, setAgentExternalPrompt] = useState<string | null>(null);

  const handlePublishArticle = (newArticle: Article) => {
    setArticles((prev) => {
      const updated = [newArticle, ...prev];
      try {
        localStorage.setItem('tobol_articles_data', JSON.stringify(updated));
      } catch {
        // storage quota
      }
      return updated;
    });
    setToastMessage(`✅ Статья «${newArticle.title.slice(0, 35)}...» успешно опубликована в ленте!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  };

  const handleOpenPublishWithDraft = (draft: {
    title: string;
    category: 'news' | 'science' | 'education';
    summary: string;
    content: string;
  }) => {
    setPublishDraft(draft);
    setIsPublishModalOpen(true);
  };

  const handleSelectStationById = (stationId: string) => {
    const found = stations.find((s) => s.id === stationId);
    if (found) {
      setSelectedStation(found);
    }
  };


  // Sync dark theme with document html tag
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  // Trigger surge simulation to demonstrate the automatic alert requirement:
  // "При резком увеличении показателей сайт автоматически формирует уведомление"
  const handleTriggerSurgeSimulation = () => {
    const timestamp = new Date().toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    // Artificially simulate sharp spike on T-03
    setStations((prevStations) =>
      prevStations.map((st) => {
        if (st.id === 'Т-03') {
          const newMar = st.monthlyData.mar + 6; // from 24 to 30
          return {
            ...st,
            particleCount: newMar,
            monthlyData: { ...st.monthlyData, mar: newMar },
            dynamics: {
              percentage: Math.round(((newMar - st.monthlyData.jan) / st.monthlyData.jan) * 100),
              direction: 'up',
              description: `РЕЗКИЙ ВСПЛЕСК: Зафиксирован залповый рост до ${newMar} част./м³ (+${Math.round(
                ((newMar - st.monthlyData.jan) / st.monthlyData.jan) * 100
              )}% с января)!`,
            },
            ecoStatus: 'alarm',
            lastTransmission: 'Только что (экстренно)',
          };
        }
        return st;
      })
    );

    const newAlert: SystemAlert = {
      id: `alt-${Date.now()}`,
      stationId: 'Т-03',
      stationName: 'Станция Т-03 (Курганский промышленный створ)',
      timestamp: `Сегодня в ${timestamp}`,
      level: 'alarm',
      title: '🚨 ЭКСТРЕННЫЙ СКАЧОК МИКРОПЛАСТИКА НА Т-03',
      message: `Капиллярный сенсор зафиксировал залповый сброс полистирола: концентрация подскочила до 30 частиц/м³. Превышение допустимого порога в 1.5 раза!`,
      metricChange: 'Резкий скачок: +150% относительно базового фона',
      isRead: false,
      actionTaken: 'Автоматически сформирован протокол ЧС. Направлено шлюзовое уведомление в водную инспекцию бассейна реки Тобол.',
    };

    setAlerts((prev) => [newAlert, ...prev]);

    if (soundEnabled) {
      playAlertChime('alarm');
    }

    setToastMessage('⚠️ Автоматически сформировано экстренное уведомление: Резкий скачок на станции Т-03!');
    setTimeout(() => {
      setToastMessage(null);
    }, 6000);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'} relative overflow-x-hidden`}>
      {/* Animated River Stream & Particle Background */}
      <AnimatedRiverBackground isDark={isDark} />

      {/* Floating System Notification Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 max-w-md p-4 rounded-2xl bg-rose-600 text-white shadow-2xl animate-in slide-in-from-top-4 fade-in duration-300 flex items-start gap-3 border border-white/20">
          <AlertTriangle className="w-5 h-5 shrink-0 animate-bounce" />
          <div className="text-xs font-bold leading-snug">
            {toastMessage}
          </div>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar
        isDark={isDark}
        onToggleTheme={toggleTheme}
        alerts={alerts}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        onSelectAlert={(alert) => setActiveAlertProtocol(alert)}
        onTriggerSurgeSimulation={handleTriggerSurgeSimulation}
        onOpenAgent={() =>
          setAgentExternalPrompt('Проанализируй текущую гидрологическую обстановку на станциях Т-01–Т-05')
        }
      />

      {/* Automatic System Alert Banner */}
      <AlertBanner
        alerts={alerts}
        onSelectStation={handleSelectStationById}
        onOpenAlertDetails={(alert) => setActiveAlertProtocol(alert)}
      />

      {/* Main Container */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Project Hero Introduction */}
        <section className="relative overflow-hidden rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800/80 bg-gradient-to-br from-white/95 via-sky-50/40 to-cyan-50/30 dark:from-slate-900/90 dark:via-slate-900/70 dark:to-cyan-950/30 backdrop-blur-md shadow-xl">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-cyan-500/10 text-cyan-800 dark:text-cyan-300 border border-cyan-500/20">
              <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>Экологическая инициатива мониторинга</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-700 via-sky-600 to-indigo-700 dark:from-cyan-400 dark:via-sky-400 dark:to-indigo-400">
                «Капиллярный интернет Тобола»
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
              Единый портал непрерывного сбора данных от автономных станций мониторинга{' '}
              <span className="font-bold text-slate-950 dark:text-white font-mono">Т-01 | Т-02 | Т-03 | Т-04 | Т-05</span>. 
              Интерактивная карта русла и 3D-станции, спектроскопия микропластика, статьи и автономный ИИ-агент.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  const el = document.getElementById('section-map');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-cyan-600/30 transition-all active:scale-95"
              >
                <Waves className="w-4 h-4" />
                <span>Интерактивная карта русла</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('news-and-articles');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 text-xs sm:text-sm font-bold transition-all"
              >
                <Newspaper className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>Новости и статьи ({articles.length})</span>
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('section-charts');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-bold transition-all"
              >
                <span>Графика динамики (Янв–Мар)</span>
              </button>
            </div>
          </div>

          {/* Quick Real-Time Metric Ticker Cards with Wave Indicators */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="relative p-3.5 rounded-2xl bg-white/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 overflow-hidden group hover:shadow-md transition-all">
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <Radio className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Станции сети</span>
                </div>
                <WaveIndicator variant="equalizer" color="emerald" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
                5 / 5
              </div>
              <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-bold">
                100% телеметрия онлайн
              </span>
              <div className="absolute -bottom-1 left-0 right-0 opacity-40">
                <WaveIndicator variant="stream" color="emerald" height={14} intensity="calm" />
              </div>
            </div>

            <div className="relative p-3.5 rounded-2xl bg-white/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 overflow-hidden group hover:shadow-md transition-all">
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <Compass className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Протяженность</span>
                </div>
                <WaveIndicator variant="equalizer" color="cyan" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
                1591 км
              </div>
              <span className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                Бассейн реки Тобол
              </span>
              <div className="absolute -bottom-1 left-0 right-0 opacity-40">
                <WaveIndicator variant="stream" color="cyan" height={14} intensity="calm" />
              </div>
            </div>

            <div className="relative p-3.5 rounded-2xl border border-rose-500/30 bg-rose-500/10 dark:bg-rose-500/15 overflow-hidden group hover:shadow-md transition-all">
              <div className="flex items-center justify-between text-xs font-bold">
                <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-300">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                  <span>Эко-тревога</span>
                </div>
                <WaveIndicator variant="equalizer" color="rose" />
              </div>
              <div className="text-2xl font-black text-rose-700 dark:text-rose-300 font-mono mt-1">
                Т-03 & Т-04
              </div>
              <span className="text-[11px] text-rose-700 dark:text-rose-300 font-semibold">
                Скачок до 24 и 31 част./м³
              </span>
              <div className="absolute -bottom-1 left-0 right-0 opacity-50">
                <WaveIndicator variant="stream" color="rose" height={14} intensity="rapid" />
              </div>
            </div>

            <div className="relative p-3.5 rounded-2xl bg-white/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 overflow-hidden group hover:shadow-md transition-all">
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <Microscope className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Основной полимер</span>
                </div>
                <WaveIndicator variant="equalizer" color="indigo" />
              </div>
              <div className="text-xl font-black text-slate-900 dark:text-white mt-1 truncate">
                Полистирол / ПЭ
              </div>
              <span className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                0.05 – 3.2 мм фракции
              </span>
              <div className="absolute -bottom-1 left-0 right-0 opacity-40">
                <WaveIndicator variant="stream" color="indigo" height={14} intensity="calm" />
              </div>
            </div>
          </div>
        </section>

        {/* 1. ИНТЕРАКТИВНАЯ КАРТА-СХЕМА ТОБОЛА (Т-01 - Т-05) С 3D-ПАРАЛЛАКС КАРТОЧКАМИ */}
        <TobolMap
          stations={stations}
          selectedStationId={selectedStation?.id || null}
          onSelectStation={(station) => setSelectedStation(station)}
          isDark={isDark}
        />

        {/* НОВОСТИ, НАУЧНЫЕ СТАТЬИ И ОБРАЗОВАТЕЛЬНЫЕ МАТЕРИАЛЫ */}
        <NewsSection
          articles={articles}
          onReadArticle={(article) => setActiveReadingArticle(article)}
          onOpenPublish={() => {
            setPublishDraft(null);
            setIsPublishModalOpen(true);
          }}
          onSelectStationById={handleSelectStationById}
          onAskAgentAboutArticle={(article) => {
            setAgentExternalPrompt(
              `Подробно объясни научную и практическую значимость материала: «${article.title}» в контексте проекта «Капиллярный интернет Тобола».`
            );
          }}
        />

        {/* 2. ГРАФИКИ ДИНАМИКИ (ЯНВАРЬ, ФЕВРАЛЬ, МАРТ) */}
        <ChartsSection
          stations={stations}
          onSelectStation={(station) => setSelectedStation(station)}
          isDark={isDark}
        />

        {/* 2b. ДИНАМИЧЕСКАЯ ТАБЛИЦА С ДВИЖЕНИЕМ И СОРТИРОВКОЙ */}
        <MovingTable
          stations={stations}
          onSelectStation={(station) => setSelectedStation(station)}
        />

        {/* 3. СИСТЕМА ЭКОЛОГИЧЕСКОЙ ИНДИКАЦИИ (4 УРОВНЯ + АВТО-ОПОВЕЩЕНИЯ) */}
        <EcoStatusSystem
          stations={stations}
          onSelectStation={(station) => setSelectedStation(station)}
          onTriggerSurgeSimulation={handleTriggerSurgeSimulation}
        />

        {/* ФОТОАРХИВ ПРОЕКТА */}
        <PhotoGallery />

        {/* Scientific methodology and footer info */}
        <footer className="pt-8 pb-12 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Waves className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span className="font-bold text-slate-800 dark:text-slate-200">
              «Капиллярный интернет Тобола» — Система автоматизированного эко-мониторинга
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-600 dark:text-slate-300 font-medium">
            <span>Станции: Т-01 • Т-02 • Т-03 • Т-04 • Т-05</span>
            <span>•</span>
            <span>Лазерная проточная цитометрия & Рамановская спектроскопия</span>
            <span>•</span>
            <span>2026</span>
          </div>
        </footer>
      </main>

      {/* Floating Eco-Agent Assistant */}
      <TobolEcoAgent
        stations={stations}
        onOpenPublishWithDraft={handleOpenPublishWithDraft}
        onSelectStationById={handleSelectStationById}
        externalPrompt={agentExternalPrompt}
        onClearExternalPrompt={() => setAgentExternalPrompt(null)}
      />

      {/* Station Details Modal (All 7 required analysis metrics + photo) */}
      {selectedStation && (
        <StationDetailModal
          station={selectedStation}
          onClose={() => setSelectedStation(null)}
          onSelectStationById={handleSelectStationById}
          stations={stations}
        />
      )}

      {/* Article Reader Modal */}
      {activeReadingArticle && (
        <ArticleReaderModal
          article={activeReadingArticle}
          onClose={() => setActiveReadingArticle(null)}
          onSelectStationById={handleSelectStationById}
          onAskAgent={(prompt) => setAgentExternalPrompt(prompt)}
        />
      )}

      {/* Publish Article Modal */}
      <PublishArticleModal
        isOpen={isPublishModalOpen}
        onClose={() => {
          setIsPublishModalOpen(false);
          setPublishDraft(null);
        }}
        onPublish={handlePublishArticle}
        initialDraft={publishDraft}
      />

      {/* Alert Protocol Modal */}
      {activeAlertProtocol && (
        <AlertProtocolModal
          alert={activeAlertProtocol}
          onClose={() => setActiveAlertProtocol(null)}
          onInspectStation={handleSelectStationById}
        />
      )}

    </div>
  );
}
