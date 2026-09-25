import React, { useState } from 'react';
import { Article, AfricanCountryProfile, MarketTickerItem } from '../../types';
import { CountriesRibbon } from '../CountriesRibbon';
import { 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  FileText, 
  Sparkles, 
  ExternalLink, 
  Clock, 
  ArrowUpRight,
  Filter,
  BarChart3,
  Globe2,
  ChevronRight
} from 'lucide-react';

interface HomeViewProps {
  articles: Article[];
  countries: AfricanCountryProfile[];
  tickers: MarketTickerItem[];
  lang: 'ar' | 'en';
  onSelectArticle: (article: Article) => void;
  onSelectCountry: (countrySlug: string) => void;
  onOpenUpdater?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  articles,
  countries,
  tickers,
  lang,
  onSelectArticle,
  onSelectCountry,
  onOpenUpdater,
}) => {
  const isAr = lang === 'ar';
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const publishedArticles = articles.filter(a => a.status === 'published');
  const featuredArticle = publishedArticles.find(a => a.featured) || publishedArticles[0];
  
  const filteredArticles = publishedArticles.filter(a => {
    if (selectedCategory === 'all') return true;
    return a.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const categories = [
    { id: 'all', nameAr: 'كافة القطاعات', nameEn: 'All Sectors' },
    { id: 'energy', nameAr: 'الطاقة والبترول', nameEn: 'Energy & Oil' },
    { id: 'fintech', nameAr: 'التكنولوجيا المالية', nameEn: 'FinTech' },
    { id: 'markets', nameAr: 'الأسواق والصناعة', nameEn: 'Markets & Industry' },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Financial Ticker & Macro Indicators */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {tickers.slice(0, 4).map((ticker) => (
          <div 
            key={ticker.symbol}
            className="p-3.5 rounded-lg bg-[#0e1422] border border-slate-800/80 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-mono font-medium">{ticker.symbol}</span>
              <span className={`flex items-center text-[11px] font-mono font-semibold ${ticker.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {ticker.isPositive ? '+' : ''}{ticker.change}
              </span>
            </div>
            <div className="text-lg font-bold text-white font-mono tracking-tight">
              {ticker.price}
            </div>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">
              {isAr ? ticker.nameAr : ticker.name}
            </p>
          </div>
        ))}
      </section>

      {/* Main Hero Story + Market Focus Split */}
      {featuredArticle && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Breaking Analysis (8 Cols) */}
          <div 
            onClick={() => onSelectArticle(featuredArticle)}
            className="lg:col-span-8 p-6 sm:p-8 rounded-xl bg-gradient-to-b from-[#101728] to-[#0b101c] border border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer group relative overflow-hidden shadow-lg"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

            {/* Zero-Pill Clean Metadata Header */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-amber-500 mb-3 font-medium">
              <span className="text-amber-400 font-bold uppercase tracking-wider">
                {isAr ? 'تقرير استقصائي معتمد' : 'Verified Lead Story'}
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400">{isAr ? featuredArticle.countryName : featuredArticle.countryNameEn}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {featuredArticle.readTimeMinutes} {isAr ? 'دقائق قراءة' : 'min read'}
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-emerald-400 flex items-center gap-1 font-mono">
                <ShieldCheck className="w-3.5 h-3.5" />
                {featuredArticle.factCheck.score}% {isAr ? 'دقة حقائق' : 'Fact Score'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-4 group-hover:text-amber-300 transition-colors">
              {isAr ? featuredArticle.title : featuredArticle.titleEn}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 font-normal">
              {isAr ? featuredArticle.summary : featuredArticle.summaryEn}
            </p>

            {/* Zero-Trust AI & Verification Footer Note */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {isAr ? 'صيغ بواسطة: ' : 'Drafted by: '}
                  <strong className="text-slate-300 font-normal">{featuredArticle.aiModel}</strong>
                </span>
                <span aria-hidden="true" className="text-slate-600">|</span>
                <span className="text-emerald-300">
                  {isAr ? 'اعتماد المحرر: ' : 'Reviewed by: '}
                  {featuredArticle.reviewedBy}
                </span>
              </div>

              <span className="inline-flex items-center gap-1 text-amber-400 group-hover:translate-x-1 transition-transform font-medium">
                {isAr ? 'اقرأ التحليل الكامل وتتبع المصادر' : 'Read Full Analysis & Citations'}
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Side Pan-African Quick Index & Top Economies (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-5 rounded-xl bg-[#0d1320] border border-slate-800">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-amber-400" />
                  {isAr ? 'أكبر الاقتصادات الأفريقية' : 'Top African Economies'}
                </h2>
                <span className="text-[11px] text-amber-400 font-mono font-bold">54 Nations</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {countries.slice(0, 8).map((c) => (
                  <button
                    key={c.code}
                    onClick={() => onSelectCountry(c.slug)}
                    className="p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800/60 text-right rtl:text-right ltr:text-left transition-all group flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold text-slate-200 group-hover:text-amber-400 truncate">
                        #{c.rank} {isAr ? c.nameAr : c.nameEn}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono">{c.gdpGrowth}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-1 flex items-center justify-between">
                      <span className="text-amber-400 font-semibold">{c.gdp}</span>
                      <span className="text-[10px] text-slate-500">{c.code}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Zero-Trust Editorial Standards Banner */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-white">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                {isAr ? 'معايير النزاهة والتدقيق المالي' : 'Financial Integrity Standards'}
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                {isAr
                  ? 'تخضع كافة المؤشرات والبيانات لمطابقة دقيقة مع النشرات الدورية للبنوك المركزية وصندوق النقد الدولي ومؤسسات التمويل القارية.'
                  : 'All indicators and macroeconomic feeds are verified against official central bank bulletins, IMF statistics, and AfDB reports.'}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Full 54 African Countries Horizontal Ribbon Section */}
      <section className="space-y-2">
        <CountriesRibbon
          countries={countries}
          selectedSlug=""
          onSelectCountry={onSelectCountry}
          onOpenUpdater={onOpenUpdater}
          lang={lang}
        />
      </section>

      {/* Sector Filter Bar (Clean Functional Buttons, NOT pills) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white">
              {isAr ? 'أحدث التقارير والتحليلات الاقتصادية' : 'Latest Economic Bulletins'}
            </h2>
            <p className="text-xs text-slate-400">
              {isAr ? 'تقارير فورية مستخلصة من إفصاحات البنوك المركزية ومؤشرات التجارة' : 'Sourced from central bank disclosures and trade feeds'}
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-lg border border-slate-800">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {isAr ? cat.nameAr : cat.nameEn}
              </button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredArticles.map((article) => (
            <article
              key={article.id}
              onClick={() => onSelectArticle(article)}
              className="p-5 rounded-xl bg-[#0c1220] border border-slate-800/90 hover:border-amber-500/40 transition-all cursor-pointer flex flex-col justify-between group shadow-sm hover:shadow-md"
            >
              <div>
                {/* Zero-Pill Discipline: Unboxed metadata with typographic separators */}
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-2.5 font-medium">
                  <span className="text-amber-400">{article.category}</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span>{isAr ? article.countryName : article.countryNameEn}</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="font-mono text-emerald-400">{article.factCheck.score}% دقة</span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug mb-3">
                  {isAr ? article.title : article.titleEn}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                  {isAr ? article.summary : article.summaryEn}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {typeof article.publishedAt === 'string' && article.publishedAt.includes(' ')
                    ? article.publishedAt.split(' ')[0]
                    : (typeof article.publishedAt === 'string' ? article.publishedAt : 'Today')}
                </span>

                <span className="text-amber-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-medium">
                  {isAr ? 'عرض التفاصيل' : 'Details'}
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
