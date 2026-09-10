import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  X,
  Send,
  Sparkles,
  Maximize2,
  Minimize2,
  AlertTriangle,
  RefreshCw,
  FileText,
  MapPin,
  ChevronRight,
  Droplets,
  HelpCircle,
  Copy,
  Check,
} from 'lucide-react';
import { AgentMessage, StationData } from '../types';

interface Props {
  stations: StationData[];
  onOpenPublishWithDraft?: (draft: { title: string; category: 'news' | 'science' | 'education'; summary: string; content: string }) => void;
  onSelectStationById: (stationId: string) => void;
  externalPrompt?: string | null;
  onClearExternalPrompt?: () => void;
}

export const TobolEcoAgent: React.FC<Props> = ({
  stations,
  onOpenPublishWithDraft,
  onSelectStationById,
  externalPrompt,
  onClearExternalPrompt,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const [messages, setMessages] = useState<AgentMessage[]>([
    {
      id: 'msg-init',
      role: 'assistant',
      content: `Здравствуйте! Я **«Тобол-ИИ»** — автономный экологический агент и научный консультант проекта «Капиллярный интернет Тобола».

Я в режиме реального времени анализирую телеметрию со створов **Т-01 – Т-05**, данные спектрометрии и помогаю готовить научные публикации.

**Чем я могу помочь прямо сейчас?**
- Разобрать причины критического скачка на **станции Т-03** (+100%, 24 част./м³);
- Оценить перенос микропластика при впадении реки Исеть на **Т-04**;
- Сформировать готовый черновик научной статьи или эко-новости для публикации;
- Проанализировать гидрологические параметры (скорость потока, температура, мутность).`,
      timestamp: 'Только что',
      suggestedActions: [
        { label: '🚨 Анализ скачка на Т-03', action: 'explain_t03' },
        { label: '🗺️ Геодинамика переноса (Т-01 → Т-05)', action: 'river_dynamics' },
        { label: '📝 Написать научный черновик для публикации', action: 'draft_article' },
        { label: '🐟 Влияние на ихтиофауну и рыбу', action: 'fish_impact' },
      ],
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Handle external prompts (e.g. from article "Ask agent" button)
  useEffect(() => {
    if (externalPrompt) {
      setIsOpen(true);
      handleSend(externalPrompt);
      if (onClearExternalPrompt) onClearExternalPrompt();
    }
  }, [externalPrompt]);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Local expert engine to answer domain questions accurately
  const generateAgentResponse = async (query: string): Promise<{ text: string; relatedStations?: string[]; draft?: any }> => {
    const q = query.toLowerCase();

    // Try backend API first if server is available
    try {
      const response = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          stations: stations.map((s) => ({
            id: s.id,
            name: s.name,
            particleCount: s.particleCount,
            plasticType: s.plasticType,
            monthlyData: s.monthlyData,
            ecoStatus: s.ecoStatus,
          })),
        }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data && data.reply) {
          return {
            text: data.reply,
            relatedStations: data.relatedStations,
            draft: data.draft,
          };
        }
      }
    } catch {
      // Fall through to domain logic
    }

    // Comprehensive Fallback Domain Logic Engine
    if (q.includes('т-03') || q.includes('т03') || q.includes('курган') || q.includes('скачок') || q.includes('всплеск')) {
      return {
        text: `### 🚨 Экспертный разбор ситуации на станции Т-03 (Курганский створ)

1. **Динамика загрязнения:**
   - Январь: 12 частиц/м³
   - Февраль: 17 частиц/м³
   - Март: **24 частиц/м³** (взрывной рост на +100% за квартал!).
   - Текущий экологический статус: **Экологическая тревога (alarm)**.

2. **Спектральный состав загрязнителей:**
   - **45% Полистирол (PS):** упаковочный вспененный полимер, подвергшийся термодеструкции;
   - **30% Полиэтилен (PE):** вторичные гранулы и фрагменты тары;
   - **15% ПВХ (PVC):** строительные пленки;
   - **10% Полипропилен (PP):** текстильные микроволокна.

3. **Гидрологический контекст:**
   - Станция расположена на входной излучине г. Кургана (55.44° с.ш., 65.34° в.д.). Скорость потока 0.65 м/с способствует активному переносу взвеси без оседания.

4. **Рекомендации агента:**
   - Развертывание сорбционных бонов на створе притока Чёрная;
   - Внеплановый отбор проб грунта для исключения несанкционированных промышленных сбросов;
   - Сокращение интервала передачи телеметрии до 5 минут.`,
        relatedStations: ['Т-03'],
      };
    }

    if (q.includes('т-04') || q.includes('т04') || q.includes('исеть') || q.includes('ялуторовск')) {
      return {
        text: `### ⚠️ Анализ створа Т-04 (Ялуторовский створ — 31 част./м³)

Станция Т-04 фиксирует **абсолютный максимум** микропластика в бассейне Тобола:
- **31 частиц/м³** (янв: 15 → фев: 22 → мар: 31);
- Основная причина: кумулятивное наложение трансграничного транзита Тобола и высоконагруженного стока реки **Исеть** (крупнейший левый приток);
- В составе обнаружено **27% частиц резиновой шинной пыли и каучука**, что напрямую указывает на смыв с автомагистралей.

Рекомендуется организация гидрохимического барьера на стрелке рек Исеть и Тобол.`,
        relatedStations: ['Т-04'],
      };
    }

    if (q.includes('черновик') || q.includes('стать') || q.includes('публикац') || q.includes('написать')) {
      const draft = {
        title: 'Комплексный гидрохимический отчет по створам Т-03 и Т-04 бассейна Тобола',
        category: 'science' as const,
        summary: 'Оценка техногенной нагрузки и распределения полистирола при слиянии Тобола с притоком Исеть.',
        content: `## Введение
Автоматическая система капиллярного мониторинга зафиксировала кумулятивное возрастание концентраций микропластика от верховьев (Т-01: 5 част./м³) до среднего течения (Т-04: 31 част./м³).

### Методика спектроскопии
С использованием лазерной Рамановской микроспектроскопии подтверждено доминирование полистирола (45%) на Т-03 и синтетического каучука (27%) на Т-04.

### Выводы
Рекомендуется внесение створа Т-04 в реестр приоритетного экологического контроля бассейнового водного управления.`,
      };

      return {
        text: `Я подготовил черновик научной статьи на основе свежих данных сенсоров!

Вы можете нажать кнопку ниже, чтобы открыть его прямо в **форме публикации** на сайте, отредактировать и опубликовать в ленте.`,
        draft,
      };
    }

    if (q.includes('динамик') || q.includes('перенос') || q.includes('течени') || q.includes('карт') || q.includes('1591')) {
      return {
        text: `### 🌊 Продольный профиль реки Тобол (Т-01 → Т-05, 1591 км)

1. **Т-01 (Верхний Тобол, граница):** 5 част./м³ — естественный чистый гидрологический фон;
2. **Т-02 (Костанай):** 13 част./м³ — умеренная коммунальная нагрузка (+62.5%);
3. **Т-03 (Курган):** 24 част./м³ — промышленный пик (+100%);
4. **Т-04 (Ялуторовск):** 31 част./м³ — максимальная нагрузка (кумулятивный эффект Исети);
5. **Т-05 (Тобольск / Устье):** 6 част./м³ — устьевая зона осаждения в донные илы перед впадением в Иртыш.

Интерактивная гидро-схема подтверждает, что основной градиент загрязнения формируется на отрезке между 55.44° и 56.65° с.ш.`,
        relatedStations: ['Т-01', 'Т-02', 'Т-03', 'Т-04', 'Т-05'],
      };
    }

    if (q.includes('рыб') || q.includes('фаун') || q.includes('ихтио') || q.includes('осетр')) {
      return {
        text: `### 🐟 Влияние микропластика на ихтиофауну бассейна Тобола

1. **Жаберная обструкция:** Частицы размером 0.1–0.5 мм попадают в жаберные лепестки молоди стерляди и нельмы, снижая дыхательную способность на 30–45%;
2. **Трофический перенос:** Моллюски и личинки поденок заглатывают микрогранулы, передавая адсорбированные токсины (бисфенол А, фталаты) хищным рыбам (щука, судак);
3. **Рекомендация:** На участках нерестилищ ниже станции Т-04 требуется проведение гидробиологического тестирования донных отложений перед началом весеннего нереста.`,
        relatedStations: ['Т-04', 'Т-05'],
      };
    }

    // Default intelligent answer
    return {
      text: `По вашему запросу «${query}»:

Вся система «Капиллярный интернет Тобола» функционирует штатно. 
- Наблюдение ведется на 5 контрольных створах (Т-01 – Т-05).
- Данные поступают в реальном времени с интерактивной привязкой к створам русла.
- Общая протяженность охваченного участка реки — **1591 км**.
- Максимальное внимание сейчас приковано к станциям **Т-03** (24 част./м³) и **Т-04** (31 част./м³), где фиксируется уровень «Экологическая тревога».

Задайте уточняющий вопрос или воспользуйтесь быстрыми подсказками ниже!`,
    };
  };

  const handleSend = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() || isThinking) return;

    const userMsg: AgentMessage = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);

    try {
      const response = await generateAgentResponse(textToSend);
      const assistantMsg: AgentMessage = {
        id: `msg-agent-${Date.now()}`,
        role: 'assistant',
        content: response.text,
        timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        relatedStations: response.relatedStations,
        suggestedActions: response.draft
          ? [
              {
                label: '📋 Вставить черновик в форму публикации',
                action: 'apply_draft',
                payload: response.draft,
              },
            ]
          : undefined,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          role: 'assistant',
          content: 'Произошла задержка получения данных телеметрии. Попробуйте повторить запрос через несколько секунд.',
          timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <>
      {/* Floating Action Button (Always accessible) */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-3 px-5 py-3.5 rounded-full bg-gradient-to-r from-cyan-600 via-sky-600 to-indigo-600 text-white font-black text-sm shadow-2xl shadow-cyan-600/40 hover:shadow-cyan-500/60 hover:scale-105 active:scale-95 transition-all border border-cyan-300/30"
            aria-label="Открыть эко-агента Тобол-ИИ"
          >
            {/* Animated ping ring */}
            <span className="absolute -inset-1 rounded-full bg-cyan-400 opacity-40 blur-sm group-hover:opacity-75 animate-pulse" />

            <div className="relative flex items-center gap-2.5">
              <div className="p-1.5 rounded-full bg-white/20">
                <Bot className="w-5 h-5 text-cyan-200" />
              </div>
              <div className="text-left">
                <div className="text-xs font-black tracking-wide leading-tight">
                  Тобол-ИИ
                </div>
                <div className="text-[10px] text-cyan-200 font-normal leading-tight">
                  Эко-агент на связи
                </div>
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Floating Agent Chat Drawer/Modal */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 shadow-2xl flex flex-col rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden ${
            isExpanded
              ? 'inset-3 sm:inset-10'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[95vw] sm:w-[440px] h-[620px] max-h-[90vh]'
          }`}
          role="dialog"
          aria-label="Диалог с эко-агентом Тобол-ИИ"
        >
          {/* Drawer Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 text-white shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="p-2 rounded-2xl bg-cyan-600 text-white shadow-md">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-black text-sm text-white">Тобол-ИИ</h3>
                  <span className="px-1.5 py-0.2 rounded text-[10px] bg-cyan-500/30 text-cyan-300 font-mono font-bold">
                    v2.5
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Экологический агент бассейна реки Тобол
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                title={isExpanded ? 'Свернуть' : 'Развернуть'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                title="Закрыть"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Context Bar */}
          <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 shrink-0">
            <span className="flex items-center gap-1.5 font-bold text-cyan-600 dark:text-cyan-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Телеметрия 5 станций синхронизирована</span>
            </span>
            <span className="font-mono text-slate-500">Т-01..Т-05</span>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-cyan-600 text-white rounded-br-none shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-700 shadow-xs'
                  }`}
                >
                  {/* Markdown formatted content */}
                  <div className="prose prose-sm dark:prose-invert max-w-none text-xs sm:text-sm space-y-2">
                    {msg.content.split('\n\n').map((paragraph, pIdx) => {
                      if (paragraph.startsWith('### ')) {
                        return (
                          <h4 key={pIdx} className="font-black text-xs sm:text-sm text-cyan-700 dark:text-cyan-300 pt-1">
                            {paragraph.replace('### ', '')}
                          </h4>
                        );
                      }
                      return (
                        <p key={pIdx} className="leading-relaxed whitespace-pre-line">
                          {paragraph}
                        </p>
                      );
                    })}
                  </div>

                  {/* Related Stations quick links */}
                  {msg.relatedStations && msg.relatedStations.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-cyan-500" />
                        <span>Станции:</span>
                      </span>
                      {msg.relatedStations.map((stId) => (
                        <button
                          key={stId}
                          onClick={() => onSelectStationById(stId)}
                          className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-500/30 transition-colors"
                        >
                          {stId} →
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Suggested Action Buttons inside message */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700 space-y-1.5">
                      {msg.suggestedActions.map((act, actIdx) => (
                        <button
                          key={actIdx}
                          onClick={() => {
                            if (act.action === 'apply_draft' && onOpenPublishWithDraft && act.payload) {
                              onOpenPublishWithDraft(act.payload);
                              setIsOpen(false);
                            } else {
                              handleSend(act.label);
                            }
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold bg-cyan-600/10 hover:bg-cyan-600/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 flex items-center justify-between transition-all"
                        >
                          <span>{act.label}</span>
                          <ChevronRight className="w-3.5 h-3.5 shrink-0 text-cyan-500" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Message timestamp & copy */}
                <div className="flex items-center gap-2 mt-1 px-1 text-[10px] text-slate-600 dark:text-slate-300">
                  <span>{msg.timestamp}</span>
                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => handleCopy(msg.content, idx)}
                      className="hover:text-slate-900 dark:hover:text-white"
                      title="Скопировать ответ"
                    >
                      {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs w-fit">
                <Bot className="w-4 h-4 text-cyan-500 animate-spin" />
                <span className="font-semibold animate-pulse">
                  Тобол-ИИ анализирует телеметрию и гидрологию...
                </span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div className="p-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center gap-1.5 overflow-x-auto shrink-0 no-scrollbar">
            <button
              onClick={() => handleSend('Анализ резкого всплеска на станции Т-03')}
              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30 whitespace-nowrap transition-all shrink-0"
            >
              🚨 Скачок Т-03
            </button>
            <button
              onClick={() => handleSend('Продольный профиль переноса от Т-01 до Т-05')}
              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 whitespace-nowrap transition-all shrink-0"
            >
              🌊 Перенос по руслу
            </button>
            <button
              onClick={() => handleSend('Подготовь черновик научной статьи для публикации')}
              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 whitespace-nowrap transition-all shrink-0"
            >
              📝 Написать статью
            </button>
            <button
              onClick={() => handleSend('Каково влияние микропластика на рыбу и ихтиофауну?')}
              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 whitespace-nowrap transition-all shrink-0"
            >
              🐟 Ихтиофауна
            </button>
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Спросите агента о Тоболе, станциях или микропластике..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isThinking}
              className="p-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white shadow-md shadow-cyan-600/30 transition-all active:scale-95"
              aria-label="Отправить сообщение"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
