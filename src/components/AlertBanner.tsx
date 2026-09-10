import React, { useState } from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  X,
  BellRing,
  Activity,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { SystemAlert } from '../types';

interface Props {
  alerts: SystemAlert[];
  onSelectStation: (stationId: string) => void;
  onOpenAlertDetails: (alert: SystemAlert) => void;
}

export const AlertBanner: React.FC<Props> = ({
  alerts,
  onSelectStation,
  onOpenAlertDetails,
}) => {
  const [dismissed, setDismissed] = useState(false);
  const activeAlert = alerts[0]; // Most urgent

  if (!activeAlert || dismissed) return null;

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 text-white shadow-xl shadow-rose-950/20 py-3.5 px-4 sm:px-6">
      {/* Animated glowing wave line */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3 relative z-10">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md shrink-0 animate-bounce">
            <BellRing className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-black uppercase rounded bg-white text-rose-700 tracking-wider shadow-xs">
                Авто-оповещение системы
              </span>
              <span className="text-xs font-semibold text-rose-100 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5" />
                {activeAlert.timestamp}
              </span>
            </div>
            <p className="text-sm font-bold text-white mt-1 leading-snug">
              {activeAlert.title}: <span className="font-normal text-rose-100">{activeAlert.message}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-center shrink-0">
          <button
            id={`inspect-alert-${activeAlert.stationId}`}
            onClick={() => onSelectStation(activeAlert.stationId)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white text-rose-800 hover:bg-rose-50 text-xs font-extrabold shadow-md active:scale-95 transition-all"
          >
            <span>Карточка {activeAlert.stationId}</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            id="open-alert-protocol-btn"
            onClick={() => onOpenAlertDetails(activeAlert)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/30 backdrop-blur-xs transition-all"
          >
            <span>Протокол инцидента</span>
          </button>

          <button
            onClick={() => setDismissed(true)}
            title="Скрыть оповещение"
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors ml-1"
            aria-label="Скрыть"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
