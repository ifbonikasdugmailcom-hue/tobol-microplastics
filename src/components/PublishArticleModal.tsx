import React, { useState } from 'react';
import {
  X,
  FileText,
  Send,
  Sparkles,
  Tag,
  MapPin,
  Clock,
  Eye,
  Edit3,
  Bot,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { Article, ArticleCategory, StationData } from '../types';
import tobolSensorPhoto from '../assets/images/tobol_river_sensor_1789014218959.jpg';
import labMicroscopePhoto from '../assets/images/microplastic_lab_1789014234138.jpg';
import stationPolePhoto from '../assets/images/tobol_station_pole_1789014248861.jpg';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (newArticle: Article) => void;
  stations: StationData[];
}

export const PublishArticleModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onPublish,
  stations,
}) => {
  const [category, setCategory] = useState<ArticleCategory>('science');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState('Исследователь гидрологии Тобола');
  const [authorRole, setAuthorRole] = useState('Специалист экологической лаборатории');
  const [readTimeMinutes, setReadTimeMinutes] = useState(5);
  const [selectedStationIds, setSelectedStationIds] = useState<string[]>(['Т-03']);
  const [tagInput, setTagInput] = useState('Микропластик, Тобол2026, Экомониторинг');
  const [selectedPhotoKey, setSelectedPhotoKey] = useState<'lab' | 'sensor' | 'pole'>('lab');
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const photoMap = {
    lab: labMicroscopePhoto,
    sensor: tobolSensorPhoto,
    pole: stationPolePhoto,
  };

  // Helper to generate template with AI assistance
  const handleGenerateAiTemplate = () => {
    setIsAiGenerating(true);
    setTimeout(() => {
      if (category === 'science') {
        setTitle('Оценка кинетики седиментации микрополимеров на участке Курганского створа');
        setSummary('Гидродинамическое исследование осаждения полистирола и полиэтилена при различных гидрологических режимах реки Тобол.');
        setContent(`## Введение
Анализ данных со станции Т-03 показал устойчивую корреляцию между скоростью потока и концентрацией взвешенных микрополимеров. В марте 2026 года при расходе 0.65 м/с зафиксирован рост доли тяжелых гранул.

### Методы и полевой отбор
Пробы отбирались с горизонтов 0.5 м, 1.5 м и придонного слоя. Спектроскопия подтвердила преобладание полистирола (45%).

### Предварительные выводы
Снижение расхода в межень может способствовать ускоренной седиментации в донные отложения, что создает риск вторичного загрязнения при весеннем половодье.`);
        setTagInput('Седиментация, Полистирол, Т03, ДонныеОтложения, Лаборатория');
      } else if (category === 'news') {
        setTitle('Модернизация капиллярных ловушек на гидропосту Т-02: внедрен оптический сенсор 4-го поколения');
        setSummary('На станции Т-02 (Средний Тобол) установлена новая микрофлюидная проточная ячейка с автоматической очисткой от водорослей.');
        setContent(`## Завершение монтажных работ
Инженерная бригада проекта завершила модернизацию станции мониторинга Т-02 ниже города Костанай. 

### Новые характеристики оборудования:
- Разрешающая способность детекции частиц от 0.05 мм;
- Непрерывная передача данных через сотовый и спутниковый канал телеметрии;
- Устойчивость к перепадам температур и весеннему ледоходу.

Станция функционирует в штатном режиме 24/7.`);
        setTagInput('НовостиПроекта, Модернизация, Т02, Телеметрия, Сенсоры');
      } else {
        setTitle('Как читать карту капиллярного мониторинга Тобола: руководство для эко-активистов');
        setSummary('Пошаговое объяснение цветовых индикаторов, единиц измерения и алгоритма действий при обнаружении превышений.');
        setContent(`## Что означают цвета на карте?
- **Зеленый (Низкий)**: фоновое естественное состояние (до 7 частиц/м³);
- **Желтый (Наблюдение)**: умеренное присутствие микроволокон (8–14 частиц/м³);
- **Оранжевый (Повышенный)**: зона антропогенной нагрузки (15–20 частиц/м³);
- **Алый (Экологическая тревога)**: залповый сброс (> 20 частиц/м³).

### Как передать данные в проект?
Если вы заметили признаки сброса пластиковых отходов в пойме, зафиксируйте геометку и отправьте координаты через форму обратной связи.`);
        setTagInput('Образование, Инструкция, ЭкоАктивизм, КартаТобола');
      }
      setIsAiGenerating(false);
    }, 600);
  };

  const handleToggleStation = (stId: string) => {
    setSelectedStationIds((prev) =>
      prev.includes(stId) ? prev.filter((id) => id !== stId) : [...prev, stId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim() || !content.trim()) {
      setErrorMessage('Пожалуйста, заполните заголовок, краткое описание и текст материала.');
      return;
    }

    const tags = tagInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter((t) => t.length > 0);

    const newArticle: Article = {
      id: `art-user-${Date.now()}`,
      title: title.trim(),
      category,
      summary: summary.trim(),
      content: content.trim(),
      author: {
        name: authorName.trim() || 'Эколог-исследователь',
        role: authorRole.trim() || 'Участник мониторинга Тобола',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      },
      publishedAt: '09 сентября 2026',
      readTimeMinutes: Math.max(2, readTimeMinutes),
      imageUrl: photoMap[selectedPhotoKey],
      tags: tags.length > 0 ? tags : ['Экомониторинг', 'Тобол'],
      relatedStationIds: selectedStationIds,
      viewsCount: 1,
      likesCount: 0,
      featured: false,
    };

    onPublish(newArticle);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-cyan-600/10 via-sky-600/10 to-transparent">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-600 text-white shadow-md">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Публикация материала о реке Тобол
              </h2>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                Новости проекта, научные статьи о микропластике и образовательные материалы
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher & AI helper */}
        <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 p-1 bg-slate-200 dark:bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('edit')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'edit'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Редактор</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'preview'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Предпросмотр</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleGenerateAiTemplate}
            disabled={isAiGenerating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:opacity-90 text-white text-xs font-bold shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-200 animate-spin" />
            <span>{isAiGenerating ? 'Генерация черновика...' : 'ИИ-помощник: заполнить черновик'}</span>
          </button>
        </div>

        {errorMessage && (
          <div className="mx-5 mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-5">
          {activeTab === 'edit' ? (
            <>
              {/* Category Select */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Категория публикации:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setCategory('science')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      category === 'science'
                        ? 'border-indigo-500 bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 font-extrabold ring-2 ring-indigo-500/30'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="text-xs font-bold">🔬 Научная статья</div>
                    <div className="text-[11px] opacity-80 mt-0.5">Спектроскопия, седиментация, расчеты</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCategory('news')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      category === 'news'
                        ? 'border-cyan-500 bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 font-extrabold ring-2 ring-cyan-500/30'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="text-xs font-bold">📰 Новости проекта</div>
                    <div className="text-[11px] opacity-80 mt-0.5">Экспедиции, датчики, обновления</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCategory('education')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      category === 'education'
                        ? 'border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-extrabold ring-2 ring-emerald-500/30'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="text-xs font-bold">🎓 Образование</div>
                    <div className="text-[11px] opacity-80 mt-0.5">Ликбез, памятки, ихтиофауна</div>
                  </button>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Заголовок материала:
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Например: Спектральный анализ микроволокон полистирола на створе Т-03"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              {/* Summary */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Краткая аннотация (лид для карточки):
                </label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={2}
                  placeholder="Краткое резюме (1-3 предложения), которое будет видно в ленте новостей..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              {/* Full Content */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Полный текст материала (поддерживает ## Заголовки, списки, цитаты):
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={8}
                  placeholder="## Введение&#10;Подробное описание результатов исследования или новости...&#10;&#10;### Выводы&#10;* Пункт 1&#10;* Пункт 2"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              {/* Author & Read Time */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Имя автора:
                  </label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Должность / организация:
                  </label>
                  <input
                    type="text"
                    value={authorRole}
                    onChange={(e) => setAuthorRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Время чтения (мин):
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={readTimeMinutes}
                    onChange={(e) => setReadTimeMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>
              </div>

              {/* Related Stations */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Привязать к станциям мониторинга Тобола:
                </label>
                <div className="flex flex-wrap gap-2">
                  {stations.map((st) => {
                    const isSelected = selectedStationIds.includes(st.id);
                    return (
                      <button
                        type="button"
                        key={st.id}
                        onClick={() => handleToggleStation(st.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all ${
                          isSelected
                            ? 'bg-cyan-600 text-white border-cyan-500 shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                        }`}
                      >
                        {st.id} ({st.particleCount} част.)
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Photo Select */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Обложка публикации:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedPhotoKey('lab')}
                    className={`relative rounded-xl overflow-hidden border-2 aspect-video ${
                      selectedPhotoKey === 'lab' ? 'border-cyan-500 ring-2 ring-cyan-500/40' : 'border-transparent opacity-60'
                    }`}
                  >
                    <img src={labMicroscopePhoto} alt="Лаборатория" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 left-1 text-[10px] font-bold text-white bg-black/60 px-1.5 rounded">Микроскоп</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPhotoKey('sensor')}
                    className={`relative rounded-xl overflow-hidden border-2 aspect-video ${
                      selectedPhotoKey === 'sensor' ? 'border-cyan-500 ring-2 ring-cyan-500/40' : 'border-transparent opacity-60'
                    }`}
                  >
                    <img src={tobolSensorPhoto} alt="Буй Тобол" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 left-1 text-[10px] font-bold text-white bg-black/60 px-1.5 rounded">Буй на реке</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPhotoKey('pole')}
                    className={`relative rounded-xl overflow-hidden border-2 aspect-video ${
                      selectedPhotoKey === 'pole' ? 'border-cyan-500 ring-2 ring-cyan-500/40' : 'border-transparent opacity-60'
                    }`}
                  >
                    <img src={stationPolePhoto} alt="Мачта" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 left-1 text-[10px] font-bold text-white bg-black/60 px-1.5 rounded">Береговой пост</span>
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Теги через запятую:
                </label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Микропластик, Тобол2026, Гидрохимия"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>
            </>
          ) : (
            /* Live Preview */
            <div className="space-y-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-400">
                {category === 'science' ? 'Научная статья' : category === 'news' ? 'Новости проекта' : 'Образовательный материал'}
              </span>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                {title || 'Без названия'}
              </h2>
              <div className="text-xs text-slate-500">
                {authorName} • {readTimeMinutes} мин чтения
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 italic p-3 rounded-xl bg-cyan-500/10 border-l-2 border-cyan-500">
                {summary || 'Краткая аннотация будет здесь...'}
              </p>
              <div className="prose dark:prose-invert text-xs leading-relaxed">
                {content || 'Текст публикации...'}
              </div>
            </div>
          )}

          {/* Footer actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs shadow-lg shadow-cyan-600/30 active:scale-95 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Опубликовать на сайте</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
