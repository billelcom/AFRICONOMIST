import React, { useState, useMemo } from 'react';
import { Article, AfricanCountryProfile, MarketTickerItem } from '../../types';
import { CountriesRibbon } from '../CountriesRibbon';
import { 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  FileText, 
  Sparkles, 
  Clock, 
  ArrowUpRight, 
  Globe2, 
  Coins, 
  Percent, 
  Users, 
  Layers, 
  RotateCcw, 
  ArrowLeft, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { ECONOMIC_SECTORS, JOURNALISTIC_GENRES } from '../../data/reportOptions';
import { getCountryFlag } from '../../lib/africanGeoProximity';

interface HomeViewProps {
  articles: Article[];
  countries: AfricanCountryProfile[];
  tickers: MarketTickerItem[];
  lang: 'ar' | 'en';
  onSelectArticle: (article: Article) => void;
  onSelectCountry: (countrySlug: string) => void;
  onOpenUpdater?: () => void;
  selectedCountrySlug?: string;
  selectedSectorId?: string;
  selectedGenreId?: string;
  onClearFilters?: () => void;
  onNavigateToCountryDossier?: (slug: string) => void;
  onTriggerInstantReport?: (country: AfricanCountryProfile, sectorName: string, genreName: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  articles,
  countries,
  tickers,
  lang,
  onSelectArticle,
  onSelectCountry,
  onOpenUpdater,
  selectedCountrySlug,
  selectedSectorId = 'all',
  selectedGenreId = 'all',
  onClearFilters,
  onNavigateToCountryDossier,
  onTriggerInstantReport,
}) => {
  const isAr = lang === 'ar';
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // ترتيب المقالات الأحدث فالأحدث بشكل زمني عكسي دقيق
  const publishedArticles = useMemo(() => {
    return articles
      .filter(a => a.status === 'published')
      .sort((a, b) => {
        const timeA = a.publishedAt || a.createdAt || '';
        const timeB = b.publishedAt || b.createdAt || '';
        return timeB.localeCompare(timeA);
      });
  }, [articles]);

  const featuredArticle = publishedArticles.find(a => a.featured) || publishedArticles[0];

  // الدولة المختارة إن وجدت
  const activeCountry = useMemo(() => {
    if (!selectedCountrySlug || selectedCountrySlug === 'all') return null;
    return countries.find(c => c.slug === selectedCountrySlug) || null;
  }, [countries, selectedCountrySlug]);

  const activeSector = useMemo(() => {
    if (!selectedSectorId || selectedSectorId === 'all') return null;
    return ECONOMIC_SECTORS.find(s => s.id === selectedSectorId) || null;
  }, [selectedSectorId]);

  const activeGenre = useMemo(() => {
    if (!selectedGenreId || selectedGenreId === 'all') return null;
    return JOURNALISTIC_GENRES.find(g => g.id === selectedGenreId) || null;
  }, [selectedGenreId]);

  // المقالات المصفاة عند اختيار دولة وقطاع ونوع صحفي
  const countryFilteredArticles = useMemo(() => {
    if (!activeCountry) return [];

    return publishedArticles.filter(art => {
      // 1. فحص مطابقة الدولة
      const matchesCountry = 
        art.countryCode === activeCountry.code ||
        art.countryName === activeCountry.nameAr ||
        art.countryNameEn === activeCountry.nameEn;

      if (!matchesCountry) return false;

      // 2. فحص مطابقة القطاع (إن كان محدداً)
      if (activeSector) {
        const matchesSector = 
          art.sector === activeSector.nameAr ||
          art.sector === activeSector.nameEn ||
          (art.category && art.category.toLowerCase().includes(activeSector.id)) ||
          (art.sector && activeSector.nameAr.includes(art.sector));

        if (!matchesSector) return false;
      }

      // 3. فحص مطابقة النوع الصحفي (إن كان محدداً)
      if (activeGenre) {
        const matchesGenre = 
          art.journalisticType === activeGenre.nameAr ||
          art.journalisticType === activeGenre.nameEn;

        if (!matchesGenre) return false;
      }

      return true;
    });
  }, [publishedArticles, activeCountry, activeSector, activeGenre]);

  // المقالات المصفاة بالقطاع العام في الصفحة الرئيسية العامة (قبل اختيار دولة)
  const generalFeedArticles = useMemo(() => {
    return publishedArticles.filter(a => {
      if (selectedCategory === 'all') return true;
      return a.category.toLowerCase() === selectedCategory.toLowerCase();
    });
  }, [publishedArticles, selectedCategory]);

  const categories = [
    { id: 'all', nameAr: 'كافة القطاعات', nameEn: 'All Sectors' },
    { id: 'energy', nameAr: 'الطاقة والبترول', nameEn: 'Energy & Oil' },
    { id: 'fintech', nameAr: 'التكنولوجيا المالية', nameEn: 'FinTech' },
    { id: 'markets', nameAr: 'الأسواق والصناعة', nameEn: 'Markets & Industry' },
  ];

  // =========================================================================
  // الحالة 1: تم اختيار دولة -> عرض تقارير الدولة المختارة وفق القطاع والنوع الصحفي
  // =========================================================================
  if (activeCountry) {
    const flag = getCountryFlag(activeCountry.code);

    return (
      <div className="space-y-6 pb-16">
        {/* شريط معلومات الدولة المختارة والملف الاقتصادي */}
        <div className="p-5 sm:p-7 rounded-2xl bg-gradient-to-br from-[#11192e] to-[#0c1322] border border-slate-800 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="text-xl sm:text-2xl leading-none">{flag}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                  {isAr ? `المرتبة #${activeCountry.rank} أفريقياً` : `Rank #${activeCountry.rank} in Africa`}
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-300 font-bold">{activeCountry.code}</span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-300">{activeCountry.capital}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                <span>{isAr ? activeCountry.nameAr : activeCountry.nameEn}</span>
                <span className="text-xs font-serif font-normal text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                  {isAr ? 'تقارير الدولة والتحليلات المعتمدة' : 'Verified Dossier & Reports'}
                </span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
                {isAr ? activeCountry.descriptionAr : activeCountry.descriptionEn}
              </p>
            </div>

            {/* مؤشرات سريعة وأزرار الإجراءات */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-left rtl:text-right">
                <span className="text-[10px] text-slate-400 block">{isAr ? 'الناتج (GDP)' : 'Nominal GDP'}</span>
                <span className="text-sm font-bold font-mono text-amber-400">{activeCountry.gdp}</span>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-left rtl:text-right">
                <span className="text-[10px] text-slate-400 block">{isAr ? 'النمو السنوي' : 'Real Growth'}</span>
                <span className="text-sm font-bold font-mono text-emerald-400">{activeCountry.gdpGrowth}</span>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-left rtl:text-right">
                <span className="text-[10px] text-slate-400 block">{isAr ? 'العملة الوطنية' : 'Currency'}</span>
                <span className="text-sm font-bold font-mono text-sky-400">{activeCountry.currencySymbol}</span>
              </div>

              {onNavigateToCountryDossier && (
                <button
                  onClick={() => onNavigateToCountryDossier(activeCountry.slug)}
                  className="px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow"
                  title={isAr ? 'عرض الملف الاقتصادي الشامل' : 'View Full Macro Dossier'}
                >
                  <span>{isAr ? 'الملف الاقتصادي الشامل' : 'Full Dossier'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ترويسة التقارير مع إحصائية الفلترة */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <span>
                  {isAr 
                    ? `تقارير ${activeCountry.nameAr}`
                    : `Economic Reports for ${activeCountry.nameEn}`}
                </span>
              </h2>

              <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {countryFilteredArticles.length} {isAr ? 'تقرير' : 'Reports'}
              </span>
            </div>

            <p className="text-xs text-slate-400 mt-1">
              {activeSector 
                ? (isAr ? `تصفية حسب القطاع: ${activeSector.nameAr}` : `Filtered by: ${activeSector.nameEn}`)
                : (isAr ? 'كافة القطاعات الاقتصادية المعتمدة' : 'All approved economic sectors')}
              {activeGenre && (
                <span className="text-purple-400 font-semibold mx-1">
                  · {isAr ? activeGenre.nameAr : activeGenre.nameEn}
                </span>
              )}
            </p>
          </div>

          {onClearFilters && (
            <button
              onClick={onClearFilters}
              className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 transition-colors font-mono self-start sm:self-auto"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{isAr ? 'عرض كافة المقالات الأحدث' : 'Return to Latest Feed'}</span>
            </button>
          )}
        </div>

        {/* شبكة المقالات أو رسالة التوليد الذكي الفوري */}
        {countryFilteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {countryFilteredArticles.map((article) => (
              <article
                key={article.id}
                onClick={() => onSelectArticle(article)}
                className="p-5 rounded-xl bg-[#0c1220] border border-slate-800/90 hover:border-amber-500/40 transition-all cursor-pointer flex flex-col justify-between group shadow-sm hover:shadow-md"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-2.5 font-medium">
                    <span className="text-amber-400">{article.sector || article.category}</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="text-purple-300">{article.journalisticType || 'تقرير إخباري'}</span>
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
                    {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                  </span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="p-8 sm:p-10 rounded-2xl bg-[#0d1424] border border-slate-800 text-center space-y-4 shadow-inner">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>

            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="text-base sm:text-lg font-bold text-white">
                {isAr
                  ? `لا توجد تقارير منشورة حالياً لهذا التصنيف في ${activeCountry.nameAr}`
                  : `No published reports found for this filter in ${activeCountry.nameEn}`}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isAr
                  ? 'يمكنك إطلاق دورة رصد وتحليل فورية بواسطة وكيل الذكاء الاصطناعي (Gemini) لإعداد مسودة تقرير استقصائي حصري لهذا القطاع فوراً.'
                  : 'You can trigger an instant autonomous analysis dispatch using Gemini to draft a verified report right now.'}
              </p>
            </div>

            {onTriggerInstantReport && (
              <button
                onClick={() => {
                  const sectorTitle = activeSector ? activeSector.nameAr : 'الاقتصاد الكلي والسياسات';
                  const genreTitle = activeGenre ? activeGenre.nameAr : 'التقرير الإخباري';
                  onTriggerInstantReport(activeCountry, sectorTitle, genreTitle);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-amber-500/10"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isAr ? 'توليد تقرير فوري لهذا القطاع بواسطة AI' : 'Generate Instant Autonomous Report'}</span>
              </button>
            )}

            {/* عرض مقالات أخرى لنفس الدولة إن وُجدت */}
            {publishedArticles.filter(a => a.countryCode === activeCountry.code).length > 0 && (
              <div className="pt-6 border-t border-slate-800/80 text-right rtl:text-right ltr:text-left">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  {isAr ? `تقارير أخرى متوفرة لـ ${activeCountry.nameAr}:` : `Other reports available for ${activeCountry.nameEn}:`}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {publishedArticles
                    .filter(a => a.countryCode === activeCountry.code)
                    .slice(0, 4)
                    .map(art => (
                      <button
                        key={art.id}
                        onClick={() => onSelectArticle(art)}
                        className="p-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-right rtl:text-right ltr:text-left border border-slate-800 text-xs transition-colors flex items-center justify-between"
                      >
                        <span className="text-slate-200 truncate font-medium">{isAr ? art.title : art.titleEn}</span>
                        <span className="text-amber-400 font-mono text-[11px] shrink-0 mr-2 rtl:mr-2 ltr:ml-2">
                          {art.factCheck.score}%
                        </span>
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // الحالة 2: الصفحة الرئيسية العامة قبل اختيار أي دولة
  // تعرض المقالات الأحدث فالأحدث مع شريط المؤشرات والقصة الرئيسية
  // =========================================================================
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

      {/* Latest Chronological Articles Feed (الأحدث فالأحدث) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">
                {isAr ? 'أحدث التقارير والتحليلات الاقتصادية' : 'Latest Economic Bulletins'}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {isAr ? 'مرتبة زمنياً: الأحدث أولاً' : 'Chronological: Newest First'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
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

        {/* Articles Grid (Chronological Newest First) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {generalFeedArticles.map((article) => (
            <article
              key={article.id}
              onClick={() => onSelectArticle(article)}
              className="p-5 rounded-xl bg-[#0c1220] border border-slate-800/90 hover:border-amber-500/40 transition-all cursor-pointer flex flex-col justify-between group shadow-sm hover:shadow-md"
            >
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-2.5 font-medium">
                  <span className="text-amber-400">{article.sector || article.category}</span>
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
