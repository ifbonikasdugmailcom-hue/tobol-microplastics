export type EcoStatusType = 'low' | 'observation' | 'elevated' | 'alarm';

export interface PlasticBreakdown {
  type: string; // e.g., 'ПЭТ (бутылки, волокна)', 'ПЭНД (пленка)', 'Полипропилен (упаковка)', 'Полистирол'
  percentage: number;
  color: string;
}

export interface StationData {
  id: string; // 'T-01', 'T-02', etc.
  name: string; // 'Станция Т-01 (Верхний Тобол / Приграничный створ)'
  location: string; // 'Костанайский гидропост / река Тобол'
  coordinates: { x: number; y: number; lat: number; lng: number };
  analysisDate: string; // '12 марта 2026'
  analysisTime: string; // '14:35:20'
  particleCount: number; // частиц/м³ (текущее значение за Март)
  particleSize: string; // '0.15 – 1.8 мм'
  plasticType: string; // Основной тип пластика
  plasticBreakdown: PlasticBreakdown[];
  dynamics: {
    percentage: number; // e.g. +41.2
    direction: 'up' | 'down' | 'stable';
    description: string;
  };
  ecoStatus: EcoStatusType;
  flowSpeed: number; // м/с
  waterTemp: number; // °C
  depth: number; // м
  turbidity: number; // NTU
  monthlyData: {
    jan: number;
    feb: number;
    mar: number;
  };
  photoUrl: string;
  description: string;
  sensorModel: string;
  lastTransmission: string;
}

export interface EcoIndicatorLevel {
  id: EcoStatusType;
  title: string;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  dotColor: string;
  range: string;
  description: string;
  actionRequired: string;
}

export interface SystemAlert {
  id: string;
  stationId: string;
  stationName: string;
  timestamp: string;
  level: EcoStatusType;
  title: string;
  message: string;
  metricChange: string;
  isRead: boolean;
  actionTaken: string;
}

export type ArticleCategory = 'news' | 'science' | 'education';

export interface Article {
  id: string;
  title: string;
  category: ArticleCategory;
  summary: string;
  content: string; // Markdown or rich HTML
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  publishedAt: string;
  readTimeMinutes: number;
  imageUrl: string;
  tags: string[];
  relatedStationIds?: string[];
  viewsCount: number;
  likesCount: number;
  featured?: boolean;
}

export interface AgentMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedActions?: {
    label: string;
    action: string;
    payload?: any;
  }[];
  relatedStations?: string[];
  isThinking?: boolean;
}

