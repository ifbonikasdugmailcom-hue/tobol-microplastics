import { EcoIndicatorLevel, StationData, SystemAlert } from '../types';
import tobolSensorPhoto from '../assets/images/tobol_river_sensor_1789014218959.jpg';
import labMicroscopePhoto from '../assets/images/microplastic_lab_1789014234138.jpg';
import stationPolePhoto from '../assets/images/tobol_station_pole_1789014248861.jpg';

export const PHOTO_ASSETS = {
  tobolSensor: tobolSensorPhoto,
  labMicroscope: labMicroscopePhoto,
  stationPole: stationPolePhoto,
};

export const ECO_LEVELS: EcoIndicatorLevel[] = [
  {
    id: 'low',
    title: 'Низкий уровень',
    color: '#10B981',
    badgeBg: 'bg-emerald-500/15 dark:bg-emerald-500/20',
    badgeBorder: 'border-emerald-500/40 text-emerald-700 dark:text-emerald-300',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    dotColor: 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]',
    range: '0 – 7 частиц/м³',
    description: 'Естественный фоновый баланс речной экосистемы. Угрозы для гидробионтов и ихтиофауны не выявлено.',
    actionRequired: 'Плановое капиллярное зондирование раз в 12 часов. Дополнительные меры не требуются.'
  },
  {
    id: 'observation',
    title: 'Требуется наблюдение',
    color: '#EAB308',
    badgeBg: 'bg-amber-500/15 dark:bg-amber-500/20',
    badgeBorder: 'border-amber-500/40 text-amber-700 dark:text-amber-300',
    badgeText: 'text-amber-700 dark:text-amber-300',
    dotColor: 'bg-amber-500 shadow-[0_0_12px_rgba(234,179,8,0.8)]',
    range: '8 – 14 частиц/м³',
    description: 'Умеренное накопление полимерных микроволокон. Фиксируется антропогенный сток.',
    actionRequired: 'Сокращение интервала замеров до 4 часов. Спектроскопическая калибровка капиллярных ячеек.'
  },
  {
    id: 'elevated',
    title: 'Повышенный уровень',
    color: '#F97316',
    badgeBg: 'bg-orange-500/15 dark:bg-orange-500/20',
    badgeBorder: 'border-orange-500/40 text-orange-700 dark:text-orange-300',
    badgeText: 'text-orange-700 dark:text-orange-300',
    dotColor: 'bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.8)]',
    range: '15 – 20 частиц/м³',
    description: 'Заметное превышение базовых нормативов. Риск накопления в тканях речных моллюсков и рыбы.',
    actionRequired: 'Автоматический отбор арбитражных проб в герметичный резервуар. Оповещение районной инспекции.'
  },
  {
    id: 'alarm',
    title: 'Экологическая тревога',
    color: '#EF4444',
    badgeBg: 'bg-rose-500/15 dark:bg-rose-500/25',
    badgeBorder: 'border-rose-500/50 text-rose-700 dark:text-rose-300',
    badgeText: 'text-rose-700 dark:text-rose-300',
    dotColor: 'bg-rose-500 shadow-[0_0_16px_rgba(239,68,68,1)] animate-ping',
    range: '> 20 частиц/м³',
    description: 'Критический залповый сброс полимерных загрязнителей. Угроза биоразнообразию бассейна Тобола.',
    actionRequired: 'Немедленная экстренная передача координат в Минэкологии и Росприроднадзор. Запуск барьерных ловушек.'
  }
];

export const INITIAL_STATIONS: StationData[] = [
  {
    id: 'Т-01',
    name: 'Станция Т-01 (Верхний Тобол)',
    location: 'Верховья Тобола, створ у границы, чистый исток',
    coordinates: { x: 18, y: 78, lat: 52.85, lng: 63.12 },
    analysisDate: '09 сентября 2026',
    analysisTime: '18:40:15',
    particleCount: 5,
    particleSize: '0.05 – 0.65 мм',
    plasticType: 'Полиэтилен (ПЭ) волокнистый',
    plasticBreakdown: [
      { type: 'Полиэтилен (PE)', percentage: 48, color: '#38BDF8' },
      { type: 'Полипропилен (PP)', percentage: 32, color: '#34D399' },
      { type: 'ПЭТ (PET)', percentage: 15, color: '#818CF8' },
      { type: 'Прочие полимеры', percentage: 5, color: '#94A3B8' }
    ],
    dynamics: {
      percentage: 0,
      direction: 'stable',
      description: 'Показатели стабильны: 5 част./м³ (колебание в пределах сезонного фона)'
    },
    ecoStatus: 'low',
    flowSpeed: 0.42,
    waterTemp: 14.8,
    depth: 2.8,
    turbidity: 3.4,
    monthlyData: {
      jan: 5,
      feb: 6,
      mar: 5
    },
    photoUrl: tobolSensorPhoto,
    description: 'Опорный гидрохимический створ верхнего течения реки Тобол. Расположен в зоне с минимальным промышленным воздействием.',
    sensorModel: 'CapillaryOptics-v4 (лазерно-оптический спектрометр)',
    lastTransmission: '2 минуты назад'
  },
  {
    id: 'Т-02',
    name: 'Станция Т-02 (Средний Тобол — Костанайский рубеж)',
    location: 'Ниже агломерации, транзитный русловой участок',
    coordinates: { x: 34, y: 62, lat: 53.24, lng: 63.64 },
    analysisDate: '09 сентября 2026',
    analysisTime: '18:35:48',
    particleCount: 13,
    particleSize: '0.12 – 1.45 мм',
    plasticType: 'ПЭТ-гранулы и микроволокна текстиля',
    plasticBreakdown: [
      { type: 'ПЭТ (PET)', percentage: 44, color: '#818CF8' },
      { type: 'Полиэтилен (PE)', percentage: 28, color: '#38BDF8' },
      { type: 'Полистирол (PS)', percentage: 16, color: '#FBBF24' },
      { type: 'Полиамид (Нейлон)', percentage: 12, color: '#FB7185' }
    ],
    dynamics: {
      percentage: 62.5,
      direction: 'up',
      description: 'Рост на +62.5% с января (8 → 11 → 13 част./м³). Нарастание антропогенного следа.'
    },
    ecoStatus: 'observation',
    flowSpeed: 0.58,
    waterTemp: 15.2,
    depth: 3.4,
    turbidity: 6.2,
    monthlyData: {
      jan: 8,
      feb: 11,
      mar: 13
    },
    photoUrl: stationPolePhoto,
    description: 'Станция мониторинга руслового стока за городской чертой. Фиксирует влияние коммунальных сточных вод и ливневой канализации.',
    sensorModel: 'Tobol-CapillaryFlow 3200 (микрофлюидная проточная ячейка)',
    lastTransmission: '5 минут назад'
  },
  {
    id: 'Т-03',
    name: 'Станция Т-03 (Курганский промышленный створ)',
    location: 'Входная излучина г. Курган, приток реки Черная',
    coordinates: { x: 52, y: 44, lat: 55.44, lng: 65.34 },
    analysisDate: '09 сентября 2026',
    analysisTime: '18:42:02',
    particleCount: 24,
    particleSize: '0.25 – 3.20 мм',
    plasticType: 'Полистирол (PS) и ПЭ-вторичный гранулят',
    plasticBreakdown: [
      { type: 'Полистирол (PS)', percentage: 45, color: '#F87171' },
      { type: 'Полиэтилен (PE)', percentage: 30, color: '#38BDF8' },
      { type: 'ПВХ (PVC)', percentage: 15, color: '#A78BFA' },
      { type: 'Полипропилен (PP)', percentage: 10, color: '#34D399' }
    ],
    dynamics: {
      percentage: 100.0,
      direction: 'up',
      description: 'ВЗРЫВНОЙ РОСТ: увеличение в 2 раза (12 → 17 → 24 част./м³). Требуется немедленное вмешательство!'
    },
    ecoStatus: 'alarm',
    flowSpeed: 0.65,
    waterTemp: 16.1,
    depth: 4.1,
    turbidity: 11.8,
    monthlyData: {
      jan: 12,
      feb: 17,
      mar: 24
    },
    photoUrl: labMicroscopePhoto,
    description: 'Критический участок наблюдения! Зафиксирован резкий двухкратный скачок микропластика за квартал. Обнаружены фрагментированные полистирольные гранулы промышленного происхождения.',
    sensorModel: 'CapillaryNet Hydro-Spectra Ultra (двойной УФ-флуоресцентный датчик)',
    lastTransmission: 'Только что'
  },
  {
    id: 'Т-04',
    name: 'Станция Т-04 (Ялуторовский створ)',
    location: 'Ниже впадения реки Исеть, пойма реки Тобол',
    coordinates: { x: 70, y: 32, lat: 56.65, lng: 66.30 },
    analysisDate: '09 сентября 2026',
    analysisTime: '18:30:12',
    particleCount: 31,
    particleSize: '0.10 – 2.80 мм',
    plasticType: 'Смешанные полимеры, синтетический каучук',
    plasticBreakdown: [
      { type: 'Полиэтилен (PE)', percentage: 38, color: '#38BDF8' },
      { type: 'Шинная пыль/Каучук', percentage: 27, color: '#64748B' },
      { type: 'ПЭТ (PET)', percentage: 22, color: '#818CF8' },
      { type: 'Полипропилен (PP)', percentage: 13, color: '#34D399' }
    ],
    dynamics: {
      percentage: 106.6,
      direction: 'up',
      description: 'Критическая зона: 15 → 22 → 31 част./м³ (кумулятивный эффект сбросов притока Исети).'
    },
    ecoStatus: 'alarm',
    flowSpeed: 0.72,
    waterTemp: 15.6,
    depth: 5.2,
    turbidity: 14.5,
    monthlyData: {
      jan: 15,
      feb: 22,
      mar: 31
    },
    photoUrl: stationPolePhoto,
    description: 'Участок аккумуляции стоков из крупных притоков. Максимальное число взвешенных микрочастиц в водной толще.',
    sensorModel: 'SensorPoint Tobol-Array v5',
    lastTransmission: '1 минуту назад'
  },
  {
    id: 'Т-05',
    name: 'Станция Т-05 (Нижний Тобол / Устьевой створ)',
    location: 'Предстьевой участок Тобола перед слиянием с Иртышом, близ г. Тобольск',
    coordinates: { x: 86, y: 18, lat: 58.15, lng: 68.25 },
    analysisDate: '09 сентября 2026',
    analysisTime: '18:25:30',
    particleCount: 6,
    particleSize: '0.08 – 0.50 мм',
    plasticType: 'Разреженные микронити полиэстера',
    plasticBreakdown: [
      { type: 'Полиэтилен (PE)', percentage: 40, color: '#38BDF8' },
      { type: 'Полиэстер (PET)', percentage: 35, color: '#818CF8' },
      { type: 'Полипропилен (PP)', percentage: 25, color: '#34D399' }
    ],
    dynamics: {
      percentage: 0,
      direction: 'stable',
      description: 'Стабильный уровень: 6 → 7 → 6 част./м³ за счет естественного осаждения и широкого плеса.'
    },
    ecoStatus: 'low',
    flowSpeed: 0.48,
    waterTemp: 14.2,
    depth: 6.8,
    turbidity: 4.8,
    monthlyData: {
      jan: 6,
      feb: 7,
      mar: 6
    },
    photoUrl: tobolSensorPhoto,
    description: 'Устьевой створ перед сбросом в Иртыш. Русло расширяется, часть тяжелых частиц оседает в донных отложениях стариц.',
    sensorModel: 'DeepCapillary Optical Sonar X-1',
    lastTransmission: '4 минуты назад'
  }
];

export const INITIAL_ALERTS: SystemAlert[] = [
  {
    id: 'alt-01',
    stationId: 'Т-03',
    stationName: 'Станция Т-03 (Курганский промышленный створ)',
    timestamp: 'Сегодня в 18:42:02',
    level: 'alarm',
    title: 'РЕЗКОЕ УВЕЛИЧЕНИЕ МИКРОПЛАСТИКА (+100%)',
    message: 'На участке Т-03 зафиксирован критический всплеск концентрации микропластика: 24 част./м³ (в январе было 12). Превышен критический порог биогенной безопасности (20 част./м³).',
    metricChange: '+100% за 60 дней (12 → 17 → 24 част./м³)',
    isRead: false,
    actionTaken: 'Автоматически сформирован протокол инцидента. Сигнал передан дежурному инспектору Росприроднадзора.'
  },
  {
    id: 'alt-02',
    stationId: 'Т-04',
    stationName: 'Станция Т-04 (Ялуторовский створ)',
    timestamp: 'Сегодня в 18:30:12',
    level: 'alarm',
    title: 'ПРЕВЫШЕНИЕ ПОРОГА ЭКОЛОГИЧЕСКОЙ ТРЕВОГИ',
    message: 'На участке Т-04 концентрация частиц достигла 31 част./м³ (+106.6% с января). Основная фракция: резиновая крошка и промышленный полиэтилен.',
    metricChange: '31 част./м³ (порог тревоги: 20 част./м³)',
    isRead: false,
    actionTaken: 'Запущена система аварийного забора капиллярных микропроб №4.'
  },
  {
    id: 'alt-03',
    stationId: 'Т-02',
    stationName: 'Станция Т-02 (Средний Тобол)',
    timestamp: 'Сегодня в 16:15:00',
    level: 'observation',
    title: 'ПЕРЕХОД В СТАТУС НАБЛЮДЕНИЯ',
    message: 'Показатели станции Т-02 поднялись до 13 част./м³. Требуется сокращение интервала капиллярного сканирования.',
    metricChange: '+62.5% динамика роста',
    isRead: true,
    actionTaken: 'Частота телеметрии повышена до 1 замера в 15 минут.'
  }
];

export const GALLERY_ITEMS = [
  {
    title: 'Автономный капиллярный сенсор-буй на реке Тобол',
    subtitle: 'Акватория реки Тобол, круглосуточная передача данных',
    image: tobolSensorPhoto,
    badge: 'Сенсорная сеть',
    tech: 'Оптическая капиллярная проточная спектроскопия'
  },
  {
    title: 'Лабораторная верификация микропластика под микроскопом',
    subtitle: 'Спектральный анализ полимерных частиц в ультрафиолете',
    image: labMicroscopePhoto,
    badge: 'Анализ частиц',
    tech: 'Флуоресцентная микроскопия и рамановский спектр'
  },
  {
    title: 'Береговая метео- и телеметрическая мачта Т-02',
    subtitle: 'Стационарный гидропост с солнечной генерацией и антенной связи',
    image: stationPolePhoto,
    badge: 'Инфраструктура',
    tech: 'Капиллярный интернет и LoRaWAN/NB-IoT шлюз'
  }
];
