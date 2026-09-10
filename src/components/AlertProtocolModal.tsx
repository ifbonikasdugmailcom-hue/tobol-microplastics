import React from 'react';
import {
  X,
  AlertTriangle,
  ShieldAlert,
  Clock,
  MapPin,
  TrendingUp,
  FileText,
  Download,
  CheckCircle2,
  BellRing,
  ExternalLink,
} from 'lucide-react';
import { SystemAlert } from '../types';

interface Props {
  alert: SystemAlert | null;
  onClose: () => void;
  onInspectStation: (stationId: string) => void;
}

export const AlertProtocolModal: React.FC<Props> = ({
  alert,
  onClose,
  onInspectStation,
}) => {
  if (!alert) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl rounded-3xl border border-rose-500/40 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-rose-600 via-rose-700 to-red-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-md animate-bounce">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-white text-rose-700">
                Автоматический протокол тревоги
              </span>
              <h3 className="text-lg font-black mt-1">{alert.title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Protocol Details */}
        <div className="p-5 sm:p-6 space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                Станция фиксации:
              </span>
              <span className="font-extrabold text-slate-900 dark:text-white font-mono">
                {alert.stationId} • {alert.stationName}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                Время фиксации инцидента:
              </span>
              <span className="font-extrabold text-slate-900 dark:text-white font-mono">
                {alert.timestamp}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 dark:bg-rose-500/10 space-y-2">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-extrabold text-xs uppercase">
              <TrendingUp className="w-4 h-4" />
              <span>Характер аномалии:</span>
            </div>
            <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
              {alert.message}
            </p>
            <div className="pt-2 text-xs font-mono font-bold text-rose-600 dark:text-rose-400">
              Зафиксированное изменение: {alert.metricChange}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Автоматически принятые меры:
            </span>
            <div className="flex items-start gap-2 text-slate-800 dark:text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>{alert.actionTaken}</span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              onInspectStation(alert.stationId);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-600/30 transition-all"
          >
            <span>Перейти к станции {alert.stationId}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs"
            >
              <Download className="w-4 h-4" />
              <span>Экспорт PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
