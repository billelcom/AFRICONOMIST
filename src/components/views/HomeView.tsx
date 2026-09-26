/* eslint-disable @next/next/no-img-element */
import React, { useState, useMemo } from 'react';
import { Article, AfricanCountryProfile, MarketTickerItem } from '../../types';
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
  ExternalLink,
  ChevronDown,
  ChevronUp,
  X,
  UserCheck,
  Timer
} from 'lucide-react';
import { ECONOMIC_SECTORS, JOURNALISTIC_GENRES } from '../../data/reportOptions';
import { getCountryFlag } from '../../lib/africanGeoProximity';
import { DraggableFloatingContainer } from '../DraggableFloatingContainer';
import { EditorialLeadCarousel } from '../EditorialLeadCarousel';
import { InteractiveTopCard } from '../InteractiveTopCard';

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

/**
 * Creative, organized, comprehensive, and non-distracting report card
 * Designed specifically for African economic and financial journalism.
 */
interface CreativeReportCardProps {
  article: Article;
  onSelect: (art: Article) => void;
  isAr: boolean;
}

const CreativeReportCard: React.FC<CreativeReportCardProps> = ({ article, onSelect, isAr }) => {
  const flag = getCountryFlag(article.countryCode);
  
  const formattedDateTime = useMemo(() => {
    const raw = article.publishedAt || article.createdAt;
    if (!raw) return isAr ? 'اليوم' : 'Today';
    if (raw.includes(' ')) {
      const [datePart, timePart] = raw.split(' ');
      return `${datePart} · ${timePart}`;
    }
    return raw;
  }, [article.publishedAt, article.createdAt, isAr]);

  const author = article.authorName || (isAr ? 'فريق التحرير الاقتصادي' : 'Financial Desk');
  
  // Deterministic fallback for reader count if not explicitly set
  const readers = article.readersCount || (
    1450 + (Math.abs(article.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)) % 3200)
  );

  return (
    <article
      onClick={() => onSelect(article)}
      className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#0d1424] via-[#0a0f1c] to-[#070b14] border border-slate-800/90 hover:border-amber-500/40 transition-all duration-300 cursor-pointer flex flex-col justify-between group shadow-sm hover:shadow-xl hover:shadow-amber-500/5 relative overflow-hidden"
    >
      <div>
        {/* Top Minimal Strip: Country Flag + Country Name + Sector + Fact-Check */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-3 font-medium">
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-sm leading-none shrink-0">{flag}</span>
            <span className="text-slate-300 font-bold truncate">
              {isAr ? article.countryName : article.countryNameEn}
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-amber-400/90 truncate font-sans">
              {article.sector || article.category}
            </span>
          </div>

          <div className="flex items-center gap-1 font-mono text-[10px] text-emerald-400/90 shrink-0 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>{article.factCheck.score}% {isAr ? 'دقة' : ''}</span>
          </div>
        </div>

        {/* Title Area + Small Square Image Box Side-by-Side */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug">
              {isAr ? article.title : article.titleEn}
            </h3>

            {/* الوقت والتاريخ بخط دقيق وصغير جداً */}
            <div className="flex items-center gap-1 text-[9.5px] sm:text-[10px] font-mono text-slate-400/90 mt-1.5 tracking-tight">
              <Clock className="w-3 h-3 text-slate-500 shrink-0" />
              <span>{formattedDateTime}</span>
            </div>
          </div>

          {/* مربع لصورة صغيرة جانب العنوان */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border border-slate-700/60 shadow-md relative bg-slate-900 group-hover:border-amber-500/40 transition-colors">
            <img
              src={article.imageUrl || 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=200&q=80'}
              alt={isAr ? article.title : article.titleEn}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
          </div>
        </div>

        {/* فاصل دقيق وأنيق بين العنوان والصورة والملخص */}
        <div className="my-2.5 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent"></div>

        {/* ملخص بعد الفاصل */}
        <p className="text-xs text-slate-300/85 line-clamp-3 leading-relaxed mb-4 font-normal">
          {isAr ? article.summary : article.summaryEn}
        </p>
      </div>

      {/* أسفل البطاقة: كاتب المقال + دقائق القراءة + عدد القراء بأيقونة وعدد فقط */}
      <div className="pt-2.5 border-t border-slate-800/70 flex items-center justify-between text-[11px] text-slate-400 gap-2">
        {/* كاتب المقال */}
        <div className="flex items-center gap-1.5 truncate max-w-[42%]">
          <span className="text-[10px] text-slate-500 shrink-0">{isAr ? 'بقلم:' : 'By:'}</span>
          <span className="text-slate-300 font-medium truncate text-[11px]">
            {author}
          </span>
        </div>

        {/* دقائق القراءة: الأيقونة والعدد وكلمة دقيقة فقط بين الكاتب وعدد المشاهدات */}
        <div 
          className="flex items-center gap-1 text-slate-300 bg-slate-900/90 px-2 py-0.5 rounded-lg border border-slate-800 text-[10.5px] font-medium shrink-0"
          title={isAr ? `${article.readTimeMinutes || 3} دقيقة قراءة` : `${article.readTimeMinutes || 3} min read`}
        >
          <Timer className="w-3 h-3 text-amber-400 shrink-0" />
          <span className="font-bold text-amber-300 font-mono">{article.readTimeMinutes || 3}</span>
          <span className="text-slate-400">{isAr ? 'دقيقة' : 'min'}</span>
        </div>

        {/* عدد القراء بأيقونة وعدد فقط + مؤشر التفاصيل */}
        <div className="flex items-center gap-2 shrink-0 font-mono">
          <div 
            className="flex items-center gap-1 text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 text-[10.5px]"
            title={isAr ? 'عدد القراء' : 'Readers count'}
          >
            <Users className="w-3 h-3 text-amber-400" />
            <span>{readers.toLocaleString()}</span>
          </div>

          <span className="text-slate-400 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all">
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </article>
  );
};

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
  
  // حالة الـ Accordion للهاتف على مرحلتين:
  // 0: الأيقونة الطافية فقط
  // 1: الشريط مع العنوان والسهم للأسفل
  // 2: القائمة الحالية لأكبر الاقتصادات موسعة
  const [mobileAccordionStage, setMobileAccordionStage] = useState<0 | 1 | 2>(0);

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
    { id: 'mining', nameAr: 'التعدين والمعادن', nameEn: 'Mining & Resources' },
    { id: 'agribusiness', nameAr: 'الزراعة والسلع', nameEn: 'Agribusiness' },
    { id: 'markets', nameAr: 'الأسواق والصناعة', nameEn: 'Markets & Industry' },
  ];

  // =========================================================================
  // الحالة 1: تم اختيار دولة -> عرض تقارير الدولة المختارة وفق القطاع والنوع الصحفي
  // =========================================================================
  if (activeCountry) {
    const flag = getCountryFlag(activeCountry.code);

    return (
      <div className="space-y-6 pb-16">
        {/* بطاقة الساعة والطقس والمشاركة */}
        <InteractiveTopCard lang={lang} className="mb-2" />

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

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                {isAr ? `ملف الاقتصاد والتقارير: ${activeCountry.nameAr}` : `Economic Dossier: ${activeCountry.nameEn}`}
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                {isAr ? activeCountry.descriptionAr : activeCountry.descriptionEn}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {onNavigateToCountryDossier && (
                <button
                  onClick={() => onNavigateToCountryDossier(activeCountry.slug)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5 border border-slate-700/60"
                >
                  <span>{isAr ? 'الملف الاقتصادي المتكامل' : 'View Full Dossier'}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                </button>
              )}

              {onClearFilters && (
                <button
                  onClick={onClearFilters}
                  className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-xs transition-colors border border-slate-800 flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{isAr ? 'إلغاء التصفية' : 'Clear Filters'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Macro Indicators Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80 font-mono text-xs">
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/60">
              <span className="text-slate-400 text-[11px] block font-sans">{isAr ? 'الناتج الإجمالي' : 'Nominal GDP'}</span>
              <span className="text-base font-bold text-white mt-0.5 block">{activeCountry.gdp}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/60">
              <span className="text-slate-400 text-[11px] block font-sans">{isAr ? 'النمو السنوي' : 'Real Growth'}</span>
              <span className={`text-base font-bold mt-0.5 block ${activeCountry.gdpGrowth.startsWith('-') ? 'text-rose-400' : 'text-emerald-400'}`}>
                {activeCountry.gdpGrowth}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/60">
              <span className="text-slate-400 text-[11px] block font-sans">{isAr ? 'العملة الوطنية' : 'Currency'}</span>
              <span className="text-base font-bold text-amber-400 mt-0.5 block">{activeCountry.currency}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/60">
              <span className="text-slate-400 text-[11px] block font-sans">{isAr ? 'التعداد السكاني' : 'Population'}</span>
              <span className="text-base font-bold text-slate-300 mt-0.5 block">{activeCountry.population}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Breadcrumbs / Active Filter Ribbon Status */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">{isAr ? 'التصفية النشطة:' : 'Active Filter:'}</span>
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold font-mono">
              {activeCountry.nameAr}
            </span>
            {activeSector && (
              <>
                <span className="text-slate-600">/</span>
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">
                  {isAr ? activeSector.nameAr : activeSector.nameEn}
                </span>
              </>
            )}
            {activeGenre && (
              <>
                <span className="text-slate-600">/</span>
                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
                  {isAr ? activeGenre.nameAr : activeGenre.nameEn}
                </span>
              </>
            )}
            <span className="text-slate-500 text-[11px]">
              ({countryFilteredArticles.length} {isAr ? 'تقرير متوفر' : 'reports'})
            </span>
          </div>

          {onClearFilters && (
            <button
              onClick={onClearFilters}
              className="text-amber-400 hover:text-amber-300 text-xs font-semibold flex items-center gap-1 transition-colors"
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
              <CreativeReportCard
                key={article.id}
                article={article}
                onSelect={onSelectArticle}
                isAr={isAr}
              />
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
      {/* Editorial Lead Stories Carousel (8 Horizontal Slides with Columnist Card & Videos) + Desktop Top Economies Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Editorial Carousel (8 Cols on Desktop, Full Width on Mobile) */}
        <div className="lg:col-span-8">
          <EditorialLeadCarousel
            onSelectArticle={onSelectArticle}
            lang={lang}
          />
        </div>

        {/* 
          قسم أكبر الاقتصاديات الأفريقية:
          يبقى على حاله بالنسبة للحاسوب (hidden lg:block lg:col-span-4)
        */}
        <div className="hidden lg:block lg:col-span-4 space-y-4">
            <div className="p-5 rounded-xl bg-[#0d1320] border border-slate-800">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-amber-400" />
                  {isAr ? 'أكبر الاقتصادات الأفريقية' : 'Top African Economies'}
                </h2>
                <span className="text-[11px] text-amber-400 font-mono font-bold">54 Nations</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {countries.slice(0, 8).map((c) => {
                  const flag = getCountryFlag(c.code);
                  return (
                    <button
                      key={c.code}
                      onClick={() => onSelectCountry(c.slug)}
                      className="p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800/60 text-right rtl:text-right ltr:text-left transition-all group flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-bold text-slate-200 group-hover:text-amber-400 truncate flex items-center gap-1">
                          <span className="text-sm">{flag}</span>
                          <span>#{c.rank} {isAr ? c.nameAr : c.nameEn}</span>
                        </span>
                        <span className="text-[10px] text-emerald-400 font-mono">{c.gdpGrowth}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-1 flex items-center justify-between">
                        <span className="text-amber-400 font-semibold">{c.gdp}</span>
                        <span className="text-[10px] text-slate-500">{c.code}</span>
                      </div>
                    </button>
                  );
                })}
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

      {/* =========================================================================
          MOBILE TWO-STAGE ACCORDION: أكبر الاقتصادات الأفريقية (خاص بالهاتف فقط)
          المرحلة 1: أيقونة طافية على اليمين أو اليسار قابلة للسحب والتحريك بحرية.
          عند الضغط يظهر شريط فيه العنوان مع سهم للأسفل.
          المرحلة 2: عند الضغط على السهم/الشريط تظهر القائمة الحالية لأكبر الاقتصادات الأفريقية.
         ========================================================================= */}
      <div className="lg:hidden">
        <DraggableFloatingContainer
          defaultAlign={isAr ? 'right' : 'left'}
          defaultBottomOffset={100}
          isOpen={mobileAccordionStage > 0}
          zIndex={36}
        >
          {({ isDragging }) => (
            <div className="relative">
              {/* المرحلة 0: الأيقونة الطافية القابلة للسحب والنقل */}
              {mobileAccordionStage === 0 && (
                <button
                  onClick={() => {
                    if (!isDragging) {
                      setMobileAccordionStage(1);
                    }
                  }}
                  className="flex items-center gap-2 p-3 sm:p-3.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-2xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all border border-amber-300/40 cursor-grab active:cursor-grabbing"
                  aria-label={isAr ? 'فتح أكبر الاقتصادات الأفريقية' : 'Open Top African Economies'}
                  title={isAr ? 'أكبر الاقتصادات الأفريقية (اسحب للتحريك)' : 'Top African Economies (Drag to move)'}
                >
                  <Globe2 className="w-5 h-5 text-slate-950" />
                  <span className="text-xs font-black tracking-tight hidden xs:inline sm:inline">
                    {isAr ? 'أكبر الاقتصادات' : 'Top Economies'}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping"></span>
                </button>
              )}

              {/* المرحلة 1 & 2: شريط فيه العنوان مع سهم للأسفل */}
              {mobileAccordionStage > 0 && (
                <div className="w-[92vw] sm:w-[380px] shadow-2xl rounded-2xl bg-[#090e1a]/98 backdrop-blur-xl border border-amber-500/40 ring-1 ring-amber-500/20 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
                  {/* شريط العنوان مع سهم للأسفل / للأعلى (المرحلة 1) */}
                  <div 
                    onClick={() => {
                      if (!isDragging) {
                        setMobileAccordionStage(prev => prev === 1 ? 2 : 1);
                      }
                    }}
                    className="px-4 py-3 bg-gradient-to-r from-slate-900 via-[#0d1424] to-slate-900 flex items-center justify-between cursor-pointer border-b border-slate-800/80 select-none group"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 border border-amber-500/30">
                        <Globe2 className="w-4 h-4" />
                      </div>
                      <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                        {isAr ? 'أكبر الاقتصادات الأفريقية' : 'Top African Economies'}
                      </h3>
                      <span className="text-[10px] text-amber-400 font-mono px-1.5 py-0.2 rounded bg-amber-500/10 font-bold">
                        8
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* سهم للأسفل في المرحلة 1، أو للأعلى في المرحلة 2 */}
                      <div className="p-1 rounded-lg bg-slate-800 text-amber-400 group-hover:bg-slate-700 transition-colors">
                        {mobileAccordionStage === 2 ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4 animate-bounce" />
                        )}
                      </div>

                      {/* زر تصغير للعودة للأيقونة الطافية */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMobileAccordionStage(0);
                        }}
                        className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        title={isAr ? 'تصغير' : 'Minimize'}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* المرحلة 2: القائمة الحالية لأكبر الاقتصاديات الأفريقية */}
                  {mobileAccordionStage === 2 && (
                    <div className="p-3 max-h-[55vh] overflow-y-auto space-y-2 animate-in fade-in duration-200">
                      <div className="grid grid-cols-2 gap-2">
                        {countries.slice(0, 8).map((c) => {
                          const flag = getCountryFlag(c.code);
                          return (
                            <button
                              key={c.code}
                              onClick={() => {
                                onSelectCountry(c.slug);
                                setMobileAccordionStage(0);
                              }}
                              className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800/80 text-right rtl:text-right ltr:text-left transition-all flex flex-col justify-between"
                            >
                              <div className="flex items-center justify-between w-full">
                                <span className="text-xs font-bold text-slate-200 truncate flex items-center gap-1">
                                  <span className="text-sm">{flag}</span>
                                  <span>#{c.rank} {isAr ? c.nameAr : c.nameEn}</span>
                                </span>
                                <span className="text-[10px] text-emerald-400 font-mono">{c.gdpGrowth}</span>
                              </div>
                              <div className="text-[11px] text-slate-400 font-mono mt-1 flex items-center justify-between">
                                <span className="text-amber-400 font-bold">{c.gdp}</span>
                                <span className="text-[9.5px] text-slate-500">{c.code}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      <div className="pt-2 border-t border-slate-800/60 text-center">
                        <span className="text-[10px] text-slate-400">
                          {isAr ? 'اضغط على أي دولة لعرض ملفها الاقتصادي وتقاريرها' : 'Tap any nation to view detailed profile'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </DraggableFloatingContainer>
      </div>

      {/* 
        =========================================================================
        باقي الصفحة: عرض التقارير (أقل شيء عشر تقارير مختلفة)
        بطاقة إبداعية منظمة ومنسقة وشاملة وغير مشتتة للقارئ
        =========================================================================
      */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">
                {isAr ? 'أحدث التقارير والتحليلات الاقتصادية' : 'Latest Economic Bulletins'}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {generalFeedArticles.length} {isAr ? 'تقارير مدققة' : 'Verified Reports'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {isAr ? 'تقارير فورية مستخلصة من إفصاحات البنوك المركزية ومؤشرات التجارة ومصادر الاستثمار' : 'Direct intelligence sourced from central bank disclosures and verified commodity trade streams'}
            </p>
          </div>

          {/* تبويبات القطاعات */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-lg border border-slate-800 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
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

        {/* شبكة التقارير الإبداعية (أكثر من 10 تقارير معروضة بالتفصيل الإبداعي المبتكر) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {generalFeedArticles.map((article) => (
            <CreativeReportCard
              key={article.id}
              article={article}
              onSelect={onSelectArticle}
              isAr={isAr}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
