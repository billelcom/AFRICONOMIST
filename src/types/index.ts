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

export interface ArticleGraphicItem {
  id: string;
  title: string;
  titleEn?: string;
  type: 'chart' | 'map' | 'infographic';
  caption: string;
  captionEn?: string;
  position: 'mid' | 'end'; // 'mid' takes 50% width with text wrapping, 'end' takes 100% width!
  align?: 'right' | 'left';
  dataPoints?: { label: string; value: number; color?: string; desc?: string }[];
  details?: string;
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
  graphics?: ArticleGraphicItem[];
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
  officialNameAr?: string;
  officialNameEn?: string;
  capital: string;
  gdp: string;
  gdpNumber: number; // بالمليار دولار
  population: string;
  populationNumber: number; // بالملايين
  rank: number; // الترتيب الاقتصادي
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

  // معلومات عامة وجغرافية إضافية
  regionAr?: string; // إقليم: شمال أفريقيا، غرب، شرق، وسط، الجنوب الإفريقي
  regionEn?: string;
  areaKm2?: string; // المساحة الجغرافية: كم²
  areaNumber?: number;
  languagesAr?: string[]; // اللغات الرسمية والمتداولة
  languagesEn?: string[];
  locationAr?: string; // الموقع الجغرافي والحدود
  locationEn?: string;
  coastline?: string; // السواحل والمنافذ البحرية
  majorCitiesAr?: string[]; // المدن الرئيسية
  majorCitiesEn?: string[];
  climateAr?: string; // المناخ والطبيعة
  climateEn?: string;

  // معلومات اقتصادية ومالية وقدرة شرائية تفصيلية
  gdpPerCapita?: string; // نصيب الفرد من الناتج / متوسط الدخل
  gdpPerCapitaNumber?: number;
  gdpPPP?: string; // الناتج المحلي الإجمالي بتعادل القوة الشرائية
  gdpPPPNumber?: number;
  pppPerCapita?: string; // القدرة الشرائية للفرد
  naturalResourcesAr?: string[]; // الموارد والثروات الطبيعية (معادن، طاقة، زراعة، صيد)
  naturalResourcesEn?: string[];
  majorExportsAr?: string[]; // أهم الصادرات
  majorExportsEn?: string[];
  tradePartnersAr?: string[]; // أبرز الشركاء التجاريين
  tradePartnersEn?: string[];
  sovereignReserves?: string; // الاحتياطيات النقدية السيادية
  debtToGdp?: string; // نسبة الدين للناتج
}
