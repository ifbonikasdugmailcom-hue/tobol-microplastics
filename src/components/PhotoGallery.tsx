import React, { useState } from 'react';
import {
  Camera,
  Maximize2,
  X,
  ExternalLink,
  Sparkles,
  Layers,
  ChevronLeft,
  ChevronRight,
  Droplets,
  Microscope,
} from 'lucide-react';
import { GALLERY_ITEMS } from '../data/mockData';
import { WaveIndicator } from './WaveIndicator';

export const PhotoGallery: React.FC = () => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const activePhoto = selectedPhotoIndex !== null ? GALLERY_ITEMS[selectedPhotoIndex] : null;

  const nextPhoto = () => {
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((selectedPhotoIndex + 1) % GALLERY_ITEMS.length);
    }
  };

  const prevPhoto = () => {
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex(
        (selectedPhotoIndex - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length
      );
    }
  };

  return (
    <div
      id="section-gallery"
      className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-5 sm:p-7 shadow-xl space-y-6 transition-all"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <Camera className="w-5 h-5 animate-pulse" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Фотоархив капиллярного мониторинга Тобола
            </h2>
            <WaveIndicator variant="equalizer" color="cyan" label="Медиа" className="hidden sm:inline-flex ml-2" />
          </div>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 mt-1">
            Высокодетализированные фотоснимки сенсорных буев, речной акватории и лабораторного микроскопического анализа микропластика.
          </p>
        </div>

        <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 self-start md:self-auto">
          3 натурных фотообъекта
        </span>
      </div>

      {/* Grid of 3 Photos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {GALLERY_ITEMS.map((item, index) => (
          <div
            key={index}
            onClick={() => setSelectedPhotoIndex(index)}
            className="group relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />

              {/* Top badge */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-2.5 py-1 text-[11px] font-black uppercase rounded-lg bg-cyan-600 text-white shadow-md">
                  {item.badge}
                </span>
              </div>

              {/* Zoom icon hint */}
              <div className="absolute top-3 right-3 p-2 rounded-xl bg-black/40 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-4 h-4" />
              </div>

              {/* Bottom description on image */}
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className="text-sm font-extrabold leading-snug line-clamp-2 drop-shadow-md">
                  {item.title}
                </h3>
                <p className="text-[11px] text-slate-300 mt-1 line-clamp-1">
                  {item.subtitle}
                </p>
              </div>
            </div>

            {/* Bottom Tech Details Bar */}
            <div className="p-3 bg-white dark:bg-slate-900 flex items-center justify-between text-xs">
              <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 truncate max-w-[200px]">
                {item.tech}
              </span>
              <span className="text-[11px] font-bold text-cyan-700 dark:text-cyan-300 hover:underline">
                Просмотр →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="relative max-w-5xl w-full flex flex-col rounded-3xl overflow-hidden border border-slate-700 bg-slate-900 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 bg-slate-950 border-b border-slate-800 text-white">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-xs font-bold uppercase rounded bg-cyan-500 text-white">
                  {activePhoto.badge}
                </span>
                <h3 className="font-extrabold text-sm sm:text-base">{activePhoto.title}</h3>
              </div>
              <button
                onClick={() => setSelectedPhotoIndex(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Full Image */}
            <div className="relative aspect-video max-h-[70vh] w-full bg-black flex items-center justify-center overflow-hidden">
              <img
                src={activePhoto.image}
                alt={activePhoto.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />

              {/* Navigation arrows */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevPhoto();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextPhoto();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-all"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Footer Description */}
            <div className="p-4 sm:p-5 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-300">
              <div>
                <p className="font-bold text-white text-sm">{activePhoto.subtitle}</p>
                <p className="text-slate-400 mt-0.5">Метод: {activePhoto.tech}</p>
              </div>
              <button
                onClick={() => setSelectedPhotoIndex(null)}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all"
              >
                Вернуться на сайт
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
