export type ArticleStatus = 'draft' | 'pending_review' | 'published' | 'rejected' | 'revision_requested';

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
  countryCode: 'EG' | 'NG' | 'ZA' | 'KE' | 'MA' | 'RW' | 'PAN_AFRICA';
  countryName: string;
  countryNameEn: string;
  status: ArticleStatus;
  authorType: 'AI_AGENT' | 'HUMAN_JOURNALIST' | 'HYBRID';
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
  gdpGrowth: string;
  inflation: string;
  centralBankRate: string;
  currency: string;
  currencySymbol: string;
  keySectors: string[];
  descriptionAr: string;
  descriptionEn: string;
}
