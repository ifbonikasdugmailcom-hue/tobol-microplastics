import React, { useState, useMemo } from 'react';
import {
  Newspaper,
  BookOpen,
  GraduationCap,
  Sparkles,
  Search,
  PlusCircle,
  Tag,
  Clock,
  Calendar,
  Eye,
  Heart,
  ArrowRight,
  Filter,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { Article, ArticleCategory, StationData } from '../types';

interface Props {
  articles: Article[];
  onOpenArticle: (article: Article) => void;
  onOpenPublishModal: () => void;
  onSelectStationById: (stationId: string) => void;
  stations: StationData[];
}

export const NewsSection: React.FC<Props> = ({
  articles,
  onOpenArticle,
  onOpenPublishModal,
  onSelectStationById,
  stations,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'quick'>('newest');

  // Compute available tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    articles.forEach((a) => a.tags.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [articles]);

  // Counts by category
  const counts = useMemo(() => {
    return {
      all: articles.length,
      news: articles.filter((a) => a.category === 'news').length,
      science: articles.filter((a) => a.category === 'science').length,
      education: articles.filter((a) => a.category === 'education').length,
    };
  }, [articles]);

  // Filter & sort articles
  const filteredArticles = useMemo(() => {
    return articles
      .filter((a) => {
        if (selectedCategory !== 'all' && a.category !== selectedCategory) {
          return false;
        }
        if (selectedTag && !a.tags.includes(selectedTag)) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = a.title.toLowerCase().includes(q);
          const matchSummary = a.summary.toLowerCase().includes(q);
          const matchTags = a.tags.some((t) => t.toLowerCase().includes(q));
          const matchAuthor = a.author.name.toLowerCase().includes(q);
          if (!matchTitle && !matchSummary && !matchTags && !matchAuthor) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return b.viewsCount - a.viewsCount;
        if (sortBy === 'quick') return a.readTimeMinutes - b.readTimeMinutes;
        return 0; // Default order in mock/user array
      });
  }, [articles, selectedCategory, selectedTag, searchQuery, sortBy]);

  const featuredArticle = useMemo(() => {
    return articles.find((a) => a.featured) || articles[0];
  }, [articles]);

  const getCategoryBadge = (cat: ArticleCategory) => {
    switch (cat) {
      case 'science':
        return {
          label: 'Научная статья',
          className: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30',
        };
      case 'news':
        return {
          label: 'Новости проекта',
          className: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30',
        };
      case 'education':
        return {
          label: 'Образовательный материал',
          className: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
        };
    }
  };

  return (
    <section id="news-and-articles" className="scroll-mt-24 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30">
            <Newspaper className="w-3.5 h-3.5" />
            <span>Научно-информационный портал</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
            Новости, наука и образование
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Публикации полевых гидрологических экспедиций, спектрометрические исследования микропластика в бассейне реки Тобол и просветительские материалы для жителей региона.
          </p>
        </div>

        {/* Publish Action Button */}
        <div className="relative z-10 shrink-0">
          <button
            onClick={onOpenPublishModal}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-white font-extrabold text-sm shadow-lg shadow-cyan-500/25 active:scale-95 transition-all"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Опубликовать материал</span>
          </button>
        </div>
      </div>

      {/* Categories Bar & Search Toolbar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedTag(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
              selectedCategory === 'all'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/25'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Все материалы</span>
            <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-black/20 text-white">
              {counts.all}
            </span>
          </button>

          <button
            onClick={() => {
              setSelectedCategory('science');
              setSelectedTag(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
              selectedCategory === 'science'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Научные статьи</span>
            <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-black/20 text-white">
              {counts.science}
            </span>
          </button>

          <button
            onClick={() => {
              setSelectedCategory('news');
              setSelectedTag(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
              selectedCategory === 'news'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/25'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Newspaper className="w-4 h-4" />
            <span>Новости проекта</span>
            <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-black/20 text-white">
              {counts.news}
            </span>
          </button>

          <button
            onClick={() => {
              setSelectedCategory('education');
              setSelectedTag(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
              selectedCategory === 'education'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Образовательные материалы</span>
            <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-black/20 text-white">
              {counts.education}
            </span>
          </button>
        </div>

        {/* Search & Sort Row */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по статьям, авторам, тегам или станциям (напр. Т-03, Рамановская, Курган)..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 shrink-0 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Сортировка:</span>
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="newest">Сначала новые</option>
              <option value="popular">По популярности</option>
              <option value="quick">Короткие статьи</option>
            </select>
          </div>
        </div>

        {/* Tag Filters */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 mr-1">
            <Tag className="w-3 h-3" />
            <span>Теги:</span>
          </span>
          {allTags.map((tag) => {
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => setSelectedTag(isSelected ? null : tag)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  isSelected
                    ? 'bg-cyan-600 text-white font-bold'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                #{tag}
              </button>
            );
          })}
          {selectedTag && (
            <button
              onClick={() => setSelectedTag(null)}
              className="text-[11px] text-rose-500 hover:underline ml-1 font-semibold"
            >
              Сбросить тег
            </button>
          )}
        </div>
      </div>

      {/* Featured Paper Hero Card (if no search active) */}
      {!searchQuery && !selectedTag && selectedCategory === 'all' && featuredArticle && (
        <div
          onClick={() => onOpenArticle(featuredArticle)}
          className="group cursor-pointer rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 p-6 sm:p-8 shadow-xl hover:shadow-2xl hover:border-indigo-500/60 transition-all relative overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-500 text-white flex items-center gap-1 shadow-sm">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Главный научный материал</span>
                </span>
                <span className="text-xs text-slate-400">
                  {featuredArticle.publishedAt}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white group-hover:text-indigo-300 transition-colors leading-tight">
                {featuredArticle.title}
              </h3>

              <p className="text-sm text-slate-300 line-clamp-3 leading-relaxed">
                {featuredArticle.summary}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2">
                <div className="flex items-center gap-2">
                  <img
                    src={featuredArticle.author.avatar}
                    alt={featuredArticle.author.name}
                    className="w-7 h-7 rounded-full object-cover border border-indigo-400"
                  />
                  <span className="font-bold text-slate-200">
                    {featuredArticle.author.name}
                  </span>
                </div>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{featuredArticle.readTimeMinutes} мин чтения</span>
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{featuredArticle.viewsCount}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  <span>{featuredArticle.likesCount}</span>
                </span>
              </div>

              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 group-hover:text-indigo-300">
                  <span>Читать полное исследование</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 h-56 sm:h-72 rounded-2xl overflow-hidden border border-slate-700 shadow-inner relative">
              <img
                src={featuredArticle.imageUrl}
                alt={featuredArticle.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center text-[11px] text-white/90">
                <span className="bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs">
                  Гидрохимическая лаборатория
                </span>
                {featuredArticle.relatedStationIds && (
                  <span className="bg-indigo-600/80 px-2 py-0.5 rounded font-mono font-bold">
                    {featuredArticle.relatedStationIds.join(', ')}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Articles Grid */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-16 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <Newspaper className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
            Материалы не найдены
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Попробуйте изменить запрос, сбросить выбранный тег или выбрать другую категорию.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedTag(null);
              setSelectedCategory('all');
            }}
            className="px-4 py-2 rounded-xl bg-cyan-600 text-white font-bold text-xs hover:bg-cyan-500 transition-all"
          >
            Сбросить все фильтры
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((art) => {
            const badge = getCategoryBadge(art.category);
            return (
              <article
                key={art.id}
                onClick={() => onOpenArticle(art)}
                className="group cursor-pointer rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-xl hover:border-cyan-500/50 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Article Image */}
                  <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={art.imageUrl}
                      alt={art.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold border backdrop-blur-md ${badge.className}`}>
                        {badge.label}
                      </span>
                    </div>
                    {art.relatedStationIds && art.relatedStationIds.length > 0 && (
                      <div className="absolute top-3 right-3 flex gap-1">
                        {art.relatedStationIds.map((st) => (
                          <span
                            key={st}
                            className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-slate-950/80 text-cyan-300 border border-cyan-500/30 backdrop-blur-xs"
                          >
                            {st}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{art.publishedAt}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{art.readTimeMinutes} мин</span>
                      </span>
                    </div>

                    <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2 leading-snug">
                      {art.title}
                    </h3>

                    <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-3 leading-relaxed">
                      {art.summary}
                    </p>

                    {/* Tag chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {art.tags.slice(0, 3).map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                        >
                          #{t}
                        </span>
                      ))}
                      {art.tags.length > 3 && (
                        <span className="text-[10px] text-slate-600 dark:text-slate-300 self-center">
                          +{art.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <img
                      src={art.author.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                      alt={art.author.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-slate-700 dark:text-slate-300 font-medium truncate max-w-[120px]">
                      {art.author.name}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 font-bold text-cyan-600 dark:text-cyan-400 group-hover:translate-x-0.5 transition-transform">
                    <span>Читать</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};
