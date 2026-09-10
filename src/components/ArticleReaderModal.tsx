import React, { useState } from 'react';
import {
  X,
  Clock,
  Calendar,
  Share2,
  Printer,
  Bookmark,
  Heart,
  Tag,
  MapPin,
  Bot,
  ArrowLeft,
  Check,
  BookOpen,
} from 'lucide-react';
import { Article, StationData } from '../types';

interface Props {
  article: Article | null;
  onClose: () => void;
  onSelectStationById: (stationId: string) => void;
  onAskAgentAboutArticle: (articleTitle: string) => void;
  stations: StationData[];
}

export const ArticleReaderModal: React.FC<Props> = ({
  article,
  onClose,
  onSelectStationById,
  onAskAgentAboutArticle,
  stations,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!article) return null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const getCategoryLabel = (cat: Article['category']) => {
    switch (cat) {
      case 'science':
        return { label: 'Научная статья', color: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30' };
      case 'news':
        return { label: 'Новости проекта', color: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30' };
      case 'education':
        return { label: 'Образовательный материал', color: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30' };
    }
  };

  const catInfo = getCategoryLabel(article.category);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Sticky Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shrink-0">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Назад к списку</span>
          </button>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isLiked
                  ? 'bg-rose-500/15 border-rose-500/30 text-rose-600 dark:text-rose-400'
                  : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Понравилось"
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{article.likesCount + (isLiked ? 1 : 0)}</span>
            </button>

            <button
              onClick={() => setIsSaved(!isSaved)}
              className={`p-2 rounded-xl border text-xs font-semibold transition-all ${
                isSaved
                  ? 'bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400'
                  : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="В закладки"
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500 text-amber-500' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              title="Скопировать ссылку"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={handlePrint}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all hidden sm:flex"
              title="Печать материала"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Article Body */}
        <div className="overflow-y-auto p-5 sm:p-8 lg:p-10 space-y-6">
          {/* Category & Metadata */}
          <div className="flex flex-wrap items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${catInfo.color}`}>
              {catInfo.label}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300">
              <Calendar className="w-3.5 h-3.5" />
              <span>{article.publishedAt}</span>
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300">
              <Clock className="w-3.5 h-3.5" />
              <span>{article.readTimeMinutes} мин чтения</span>
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{article.viewsCount} просмотров</span>
            </span>
          </div>

          {/* Article Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
            {article.title}
          </h1>

          {/* Summary Lead Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-cyan-500/10 dark:bg-cyan-500/15 border-l-4 border-cyan-500 text-slate-800 dark:text-slate-200 text-sm sm:text-base font-medium leading-relaxed">
            {article.summary}
          </div>

          {/* Author Card */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <img
                src={article.author.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                alt={article.author.name}
                className="w-11 h-11 rounded-full object-cover border-2 border-cyan-500"
              />
              <div>
                <div className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {article.author.name}
                </div>
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  {article.author.role}
                </div>
              </div>
            </div>

            {/* Ask AI Agent about this paper button */}
            <button
              onClick={() => {
                onClose();
                onAskAgentAboutArticle(article.title);
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white text-xs font-extrabold shadow-md shadow-cyan-600/20 active:scale-95 transition-all"
            >
              <Bot className="w-4 h-4 text-cyan-200 animate-pulse" />
              <span className="hidden sm:inline">Спросить ИИ-агента</span>
            </button>
          </div>

          {/* Featured Image */}
          {article.imageUrl && (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg max-h-[380px]">
              <img
                src={article.imageUrl}
                alt={article.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover max-h-[380px]"
              />
            </div>
          )}

          {/* Rendered Text Content */}
          <div className="prose prose-slate dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed space-y-4">
            {article.content.split('\n\n').map((block, idx) => {
              if (block.startsWith('## ')) {
                return (
                  <h2 key={idx} className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white pt-4 border-b border-slate-200 dark:border-slate-800 pb-2">
                    {block.replace('## ', '')}
                  </h2>
                );
              }
              if (block.startsWith('### ')) {
                return (
                  <h3 key={idx} className="text-lg sm:text-xl font-extrabold text-cyan-700 dark:text-cyan-300 pt-3">
                    {block.replace('### ', '')}
                  </h3>
                );
              }
              if (block.startsWith('```')) {
                const code = block.replace(/```[a-z]*\n?/g, '');
                return (
                  <pre key={idx} className="p-4 rounded-xl bg-slate-900 text-cyan-300 font-mono text-xs overflow-x-auto border border-slate-800 shadow-inner">
                    <code>{code}</code>
                  </pre>
                );
              }
              if (block.startsWith('* ') || block.startsWith('- ')) {
                const items = block.split('\n');
                return (
                  <ul key={idx} className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                    {items.map((item, itemIdx) => (
                      <li key={itemIdx}>{item.replace(/^[*|-]\s/, '')}</li>
                    ))}
                  </ul>
                );
              }
              if (/^\d+\.\s/.test(block)) {
                const items = block.split('\n');
                return (
                  <ol key={idx} className="list-decimal pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                    {items.map((item, itemIdx) => (
                      <li key={itemIdx}>{item.replace(/^\d+\.\s/, '')}</li>
                    ))}
                  </ol>
                );
              }
              return (
                <p key={idx} className="leading-relaxed">
                  {block}
                </p>
              );
            })}
          </div>

          {/* Linked Stations Section */}
          {article.relatedStationIds && article.relatedStationIds.length > 0 && (
            <div className="mt-8 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                <MapPin className="w-4 h-4 text-cyan-500" />
                <span>Связанные станции мониторинга на карте:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {article.relatedStationIds.map((stId) => {
                  const station = stations.find((s) => s.id === stId);
                  return (
                    <button
                      key={stId}
                      onClick={() => {
                        onClose();
                        onSelectStationById(stId);
                      }}
                      className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-cyan-600/10 hover:bg-cyan-600/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 transition-all"
                    >
                      <span>{stId}</span>
                      {station && <span className="font-sans font-normal opacity-80">({station.particleCount} част./м³)</span>}
                      <span>→</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1 text-xs text-slate-700 dark:text-slate-300 font-semibold">
              <Tag className="w-3.5 h-3.5" />
              <span>Теги материала:</span>
            </span>
            {article.tags.map((t, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
              >
                #{t}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 shrink-0">
          <span>Проект «Капиллярный интернет Тобола» • Свободный доступ</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold transition-all"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
