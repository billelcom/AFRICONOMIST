export type ArticleStatus = 'draft' | 'pending_review' | 'published' | 'rejected' | 'revision_requested';

export type ArticleGenerationType = 'automated_periodic' | 'manual_supervisor';

export type UserRole = 'HUMAN_EDITOR' | 'ADMIN' | 'AI_AGENT_INGEST' | 'AI_AGENT_WRITER' | 'GUEST';

export interface Citation {
  id: string;
  sourceName: string;
  url: string;
  publishDate: string;
  verified: boolean;
  credibilityScore: number; // 0 - 100
  snippet: string;
}

export interface FactCheckReport {
  score: number; // 0 - 100
  verifiedClaimsCount: number;
  totalClaimsCount: number;
  biasRating: 'Neutral' | 'Slight Bias' | 'High Bias';
  riskScore: 'Low' | 'Medium' | 'High';
  checkedAt: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  summary: string;
  summaryEn: string;
  content: string[];
  contentEn: string[];
  category: 'Energy' | 'FinTech' | 'Agribusiness' | 'Mining' | 'Macroeconomics' | 'Markets';
  countryCode: string;
  countryName: string;
  countryNameEn: string;
  status: ArticleStatus;
  generationType?: ArticleGenerationType;
  journalisticType?: string;
  sector?: string;
  authorType: 'AI_AGENT' | 'HUMAN_JOURNALIST' | 'HYBRID';
  authorName?: string;
  authorNameEn?: string;
  authorRole?: string;
  authorRoleEn?: string;
  readersCount?: number;
  imageUrl?: string;
  aiModel?: string;
  reviewedBy?: string;
  reviewNotes?: string;
  citations: Citation[];
  factCheck: FactCheckReport;
  publishedAt?: string;
  createdAt: string;
  readTimeMinutes: number;
  featured: boolean;
  marketImpact?: 'positive' | 'negative' | 'neutral';
}

export interface MarketTickerItem {
  symbol: string;
  name: string;
  nameAr: string;
  price: string;
  change: string;
  isPositive: boolean;
  type: 'currency' | 'commodity' | 'index';
}

export interface AfricanCountryProfile {
  code: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  capital: string;
  gdp: string;
  gdpNumber: number; // بالمليار دولار
  population: string;
  populationNumber: number; // بالملايين
  rank: number; // الترتيب الاقتصادي 1-54
  gdpGrowth: string;
  inflation: string;
  centralBankRate: string;
  currency: string;
  currencySymbol: string;
  keySectors: string[];
  powerScore?: number; // مؤشر القوة الاقتصادية المركب المحسوب ديناميكياً
  rankChange?: number; // التغير في الترتيب مقارنة بالأساس (+1 صعود، -1 هبوط، 0)
  lastUpdated?: string;
  descriptionAr: string;
  descriptionEn: string;
}
