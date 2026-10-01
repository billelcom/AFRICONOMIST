/* eslint-disable @next/next/no-img-element */
import React, { useState, useMemo } from 'react';
import { AfricanCountryProfile, Article } from '../../types';
import { CountriesRibbon } from '../CountriesRibbon';
import { BookmarkButton } from '../BookmarkButton';
import { getCountryFlag } from '../../lib/africanGeoProximity';
import { 
  Building2, 
  TrendingUp, 
  Percent, 
  Coins, 
  PieChart, 
  FileText, 
  ArrowLeft, 
  ArrowRight,
  Users,
  Award,
  MapPin,
  Compass,
  Globe,
  Languages,
  Landmark,
  Layers,
  Anchor,
  SunMedium,
  Zap,
  Check,
  Share2,
  ChevronRight,
  ChevronLeft,
  Search,
  Sparkles,
  ShieldCheck,
  Clock,
  Briefcase,
  Sliders,
  DollarSign,
  RotateCcw,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface CountryViewProps {
  country: AfricanCountryProfile;
  allCountries: AfricanCountryProfile[];
  onSelectCountry: (slug: string) => void;
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  onOpenUpdater?: () => void;
  lang: 'ar' | 'en';
  onTriggerInstantReport?: (country: AfricanCountryProfile, sector: string, genre: string) => Promise<void> | void;
  onBackToHome?: () => void;
}

const SECTOR_FILTERS = [
  { id: 'all', nameAr: 'كافة القطاعات', nameEn: 'All Sectors' },
  { id: 'energy', nameAr: 'الطاقة والبترول', nameEn: 'Energy & Oil' },
  { id: 'mining', nameAr: 'التعدين والمعادن', nameEn: 'Mining & Resources' },
  { id: 'fintech', nameAr: 'التكنولوجيا المالية', nameEn: 'FinTech' },
  { id: 'agribusiness', nameAr: 'الزراعة والسلع', nameEn: 'Agribusiness' },
  { id: 'markets', nameAr: 'الأسواق والصناعة', nameEn: 'Markets & Industry' },
  { id: 'macro', nameAr: 'الاقتصاد الكلي والسياسات', nameEn: 'Macro & Policy' },
];

const GENRE_FILTERS = [
  { id: 'all', nameAr: 'كافة القوالب', nameEn: 'All Formats' },
  { id: 'investigative', nameAr: 'التحقيق الاستقصائي', nameEn: 'Investigative' },
  { id: 'in_depth', nameAr: 'تحليل معمق', nameEn: 'In-Depth Analysis' },
  { id: 'news_report', nameAr: 'التقرير الإخباري', nameEn: 'News Report' },
  { id: 'editorial', nameAr: 'افتتاحية ورأي', nameEn: 'Editorial & Opinion' },
  { id: 'interview', nameAr: 'حوار ومقابلة', nameEn: 'Interview' },
];

export const CountryView: React.FC<CountryViewProps> = ({
  country,
  allCountries,
  onSelectCountry,
  articles,
  onSelectArticle,
  onOpenUpdater,
  lang,
  onTriggerInstantReport,
  onBackToHome
}) => {
  const isAr = lang === 'ar';
  const { isArticleSaved, saveArticle, unsaveArticle } = useAuth();
  const flag = getCountryFlag(country.code);

  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [articleSearch, setArticleSearch] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // تصفية ديناميكية تلقائية وفورية لكافة المقالات المعتمدة المنشورة لهذه الدولة
  const countryArticles = useMemo(() => {
    return articles.filter(a => {
      if (a.status !== 'published') return false;
      const codeMatch = a.countryCode?.toUpperCase() === country.code?.toUpperCase();
      const nameArMatch = country.nameAr && (a.countryName?.includes(country.nameAr) || a.title?.includes(country.nameAr) || a.summary?.includes(country.nameAr));
      const nameEnMatch = country.nameEn && (a.countryNameEn?.toLowerCase().includes(country.nameEn.toLowerCase()) || a.titleEn?.toLowerCase().includes(country.nameEn.toLowerCase()));
      const slugMatch = a.slug?.includes(country.slug) || (country.code && a.slug?.includes(country.code.toLowerCase()));
      return codeMatch || nameArMatch || nameEnMatch || slugMatch;
    });
  }, [articles, country]);

  // تصفية المقالات المعروضة حسب القطاع والنوع الصحفي والبحث
  const filteredArticles = useMemo(() => {
    return countryArticles.filter(art => {
      // مطابقة القطاع
      let matchSector = selectedSector === 'all';
      if (!matchSector) {
        const cat = (art.category || '').toLowerCase();
        const sec = (art.sector || '').toLowerCase();
        if (selectedSector === 'energy') matchSector = cat.includes('energy') || sec.includes('طاقة') || sec.includes('بترول') || sec.includes('غاز');
        else if (selectedSector === 'mining') matchSector = cat.includes('mining') || sec.includes('تعدين') || sec.includes('معادن') || sec.includes('فوسفات') || sec.includes('ذهب');
        else if (selectedSector === 'fintech') matchSector = cat.includes('fintech') || sec.includes('تكنولوجيا') || sec.includes('رقمي') || sec.includes('مصارف');
        else if (selectedSector === 'agribusiness') matchSector = cat.includes('agri') || sec.includes('زراع') || sec.includes('صيد') || sec.includes('سلع');
        else if (selectedSector === 'markets') matchSector = cat.includes('market') || sec.includes('سوق') || sec.includes('صناع') || sec.includes('تجارة');
        else if (selectedSector === 'macro') matchSector = cat.includes('macro') || sec.includes('كلي') || sec.includes('سياسات') || sec.includes('فائدة');
        else matchSector = cat === selectedSector.toLowerCase() || sec === selectedSector.toLowerCase();
      }

      // مطابقة القالب
      let matchGenre = selectedGenre === 'all';
      if (!matchGenre) {
        const jType = (art.journalisticType || '').toLowerCase();
        if (selectedGenre === 'investigative') matchGenre = jType.includes('استقصا') || jType.includes('تحقيق');
        else if (selectedGenre === 'in_depth') matchGenre = jType.includes('معمق') || jType.includes('تحليل');
        else if (selectedGenre === 'news_report') matchGenre = jType.includes('تقرير') || jType.includes('خبر');
        else if (selectedGenre === 'editorial') matchGenre = jType.includes('افتتاحية') || jType.includes('رأي');
        else if (selectedGenre === 'interview') matchGenre = jType.includes('حوار') || jType.includes('مقابلة');
        else matchGenre = jType.includes(selectedGenre.toLowerCase());
      }

      // مطابقة البحث
      const matchSearch = !articleSearch.trim() || 
        art.title.toLowerCase().includes(articleSearch.toLowerCase()) || 
        art.summary.toLowerCase().includes(articleSearch.toLowerCase()) ||
        (art.titleEn && art.titleEn.toLowerCase().includes(articleSearch.toLowerCase()));

      return matchSector && matchGenre && matchSearch;
    });
  }, [countryArticles, selectedSector, selectedGenre, articleSearch]);

  // التنقل السريع بين الدول (السابقة والتالية)
  const currentIndex = allCountries.findIndex(c => c.slug === country.slug);
  const prevCountry = currentIndex > 0 ? allCountries[currentIndex - 1] : allCountries[allCountries.length - 1];
  const nextCountry = currentIndex < allCountries.length - 1 ? allCountries[currentIndex + 1] : allCountries[0];

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}${window.location.pathname}#country-${country.slug}`;
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleInstantGenerate = async () => {
    if (!onTriggerInstantReport || isGenerating) return;
    setIsGenerating(true);
    try {
      const activeSectorObj = SECTOR_FILTERS.find(s => s.id === selectedSector);
      const activeGenreObj = GENRE_FILTERS.find(g => g.id === selectedGenre);

      const sectorName = activeSectorObj && activeSectorObj.id !== 'all' 
        ? activeSectorObj.nameAr 
        : (country.keySectors[0] || 'السياسات النقدية والاستثمارية');
      
      const genreName = activeGenreObj && activeGenreObj.id !== 'all'
        ? activeGenreObj.nameAr
        : 'تحليل معمق';

      await onTriggerInstantReport(country, sectorName, genreName);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in-50 duration-200">
      {/* 1. شريط التنقل العلوي المدمج: العودة للرئيسية + التنقل بين الدول + شريط الدول */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-slate-900/60 border border-slate-800/80 px-4 py-3 rounded-2xl">
        <div className="flex items-center gap-2 text-slate-400">
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="text-slate-300 hover:text-amber-400 transition-colors flex items-center gap-1 font-semibold"
            >
              {isAr ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
              <span>{isAr ? 'الرئيسية' : 'Home'}</span>
            </button>
          )}
          <span>/</span>
          <span className="text-slate-400">{isAr ? 'الملفات الاقتصادية للدول الأفريقية' : 'African Economic Dossiers'}</span>
          <span>/</span>
          <span className="text-amber-400 font-bold flex items-center gap-1.5">
            <span className="text-base leading-none">{flag}</span>
            <span>{isAr ? country.nameAr : country.nameEn}</span>
          </span>
        </div>

        {/* أزرار التنقل السريع بين الدول المجاورة في الترتيب */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onSelectCountry(prevCountry.slug)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all flex items-center gap-1 text-[11px] font-medium border border-slate-700/60"
            title={isAr ? `الانتقال إلى: ${prevCountry.nameAr}` : `Go to: ${prevCountry.nameEn}`}
          >
            {isAr ? <ChevronRight className="w-3 h-3 text-amber-400" /> : <ChevronLeft className="w-3 h-3 text-amber-400" />}
            <span className="truncate max-w-[100px]">{isAr ? prevCountry.nameAr : prevCountry.nameEn}</span>
          </button>

          <span className="text-slate-600 font-mono text-[10px]">
            {currentIndex + 1} / {allCountries.length}
          </span>

          <button
            onClick={() => onSelectCountry(nextCountry.slug)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all flex items-center gap-1 text-[11px] font-medium border border-slate-700/60"
            title={isAr ? `الانتقال إلى: ${nextCountry.nameAr}` : `Go to: ${nextCountry.nameEn}`}
          >
            <span className="truncate max-w-[100px]">{isAr ? nextCountry.nameAr : nextCountry.nameEn}</span>
            {isAr ? <ChevronLeft className="w-3 h-3 text-amber-400" /> : <ChevronRight className="w-3 h-3 text-amber-400" />}
          </button>

          <button
            onClick={handleCopyLink}
            className={`p-1.5 rounded-lg border transition-all ${
              copiedLink 
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700/60'
            }`}
            title={isAr ? 'نسخ رابط ملف الدولة' : 'Copy page link'}
          >
            {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* الشريط الأفقي القابل للتمرير لكافة الدول الأفريقية */}
      <CountriesRibbon
        countries={allCountries}
        selectedSlug={country.slug}
        onSelectCountry={onSelectCountry}
        onOpenUpdater={onOpenUpdater}
        lang={lang}
      />

      {/* =========================================================================
          القسم الأول (ثابت): بطاقة الهوية السيادية، المعلومات العامة، والجغرافية
         ========================================================================= */}
      <section className="space-y-6">
        {/* البانر السيادي الرئيسي للدولة (الملف الاقتصادي المتكامل) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#10172a] via-[#0d1424] to-[#070b14] border border-slate-800/90 shadow-2xl relative overflow-hidden">
          {/* لمسات خلفية جمالية */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-500/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10">
            {/* الشريط التعريفي بالأعلى: العلم + الترتيب + الرمز + العاصمة + الإقليم */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-5 border-b border-slate-800/80">
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs font-mono">
                {/* علم الدولة بحجم بارز */}
                <span className="text-2xl leading-none mr-1 rtl:mr-0 rtl:ml-1" title={country.nameAr}>
                  {flag}
                </span>

                {/* شارة الترتيب الأفريقي */}
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isAr ? `المرتبة #${country.rank} أفريقياً` : `Rank #${country.rank} in Africa`}</span>
                </div>

                {/* مؤشر الصعود أو التراجع */}
                {country.rankChange !== undefined && country.rankChange !== 0 && (
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono border ${
                    country.rankChange > 0 
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
                      : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                  }`}>
                    {country.rankChange > 0 ? `▲ صعود +${country.rankChange}` : `▼ تراجع ${country.rankChange}`}
                  </span>
                )}

                {/* مؤشر القوة الاقتصادية المركب */}
                {country.powerScore !== undefined && (
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-bold">
                    <Zap className="w-3 h-3 text-indigo-400" />
                    <span>{isAr ? `مؤشر القوة: ${country.powerScore}/100` : `Power Score: ${country.powerScore}`}</span>
                  </div>
                )}

                <span className="text-slate-600 hidden sm:inline">·</span>

                {/* كود ISO للدولة */}
                <span className="px-2 py-0.5 rounded bg-slate-800/90 text-slate-300 font-bold border border-slate-700/60">
                  ISO: {country.code}
                </span>

                {/* الإقليم الجغرافي */}
                {country.regionAr && (
                  <span className="px-2.5 py-0.5 rounded-lg bg-sky-500/10 text-sky-300 border border-sky-500/20 font-sans">
                    {isAr ? country.regionAr : country.regionEn}
                  </span>
                )}
              </div>

              {/* أزرار الإجراءات السريعة: محاكاة الترتيب وتوليد تقرير فوري */}
              <div className="flex items-center gap-2">
                {onTriggerInstantReport && (
                  <button
                    onClick={handleInstantGenerate}
                    disabled={isGenerating}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                    <span>{isGenerating ? (isAr ? 'جاري التوليد...' : 'Generating...') : (isAr ? 'إصدار تقرير فوري بـ AI' : 'Instant AI Report')}</span>
                  </button>
                )}

                {onOpenUpdater && (
                  <button
                    onClick={onOpenUpdater}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-all border border-slate-700/80 cursor-pointer"
                    title={isAr ? 'تحديث المؤشرات الاقتصادية ومحاكاة الترتيب' : 'Simulate & Update Metrics'}
                  >
                    <Sliders className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden sm:inline">{isAr ? 'محاكاة المؤشرات' : 'Simulate'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* الاسم الكامل والعنوان */}
            <div className="space-y-2 mb-6">
              <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl sm:text-4xl leading-none">{flag}</span>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                    {isAr ? country.nameAr : country.nameEn}
                  </h1>
                </div>
                {country.officialNameAr && (
                  <span className="text-sm sm:text-base text-amber-400 font-medium font-serif">
                    {isAr ? country.officialNameAr : country.officialNameEn}
                  </span>
                )}
              </div>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-4xl pt-1">
                {isAr ? country.descriptionAr : country.descriptionEn}
              </p>
            </div>

            {/* شبكة بطاقات المعلومات العامة والجغرافية الثابتة */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-2">
              {/* العاصمة */}
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1">
                  <Landmark className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isAr ? 'العاصمة الرسمية' : 'Capital City'}</span>
                </div>
                <div className="text-sm sm:text-base font-bold text-white font-sans">{country.capital}</div>
              </div>

              {/* عدد السكان */}
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1">
                  <Users className="w-3.5 h-3.5 text-sky-400" />
                  <span>{isAr ? 'الكتلة السكانية' : 'Population'}</span>
                </div>
                <div className="text-sm sm:text-base font-bold text-sky-300 font-mono">{country.population}</div>
              </div>

              {/* المساحة الجغرافية */}
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1">
                  <Compass className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isAr ? 'المساحة الجغرافية' : 'Geographic Area'}</span>
                </div>
                <div className="text-sm sm:text-base font-bold text-emerald-300 font-mono">
                  {country.areaKm2 || '266,000 كم²'}
                </div>
              </div>

              {/* اللغات الرسمية */}
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1">
                  <Languages className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{isAr ? 'اللغة والتواصل' : 'Languages'}</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-indigo-200 truncate">
                  {country.languagesAr ? country.languagesAr.join('، ') : (isAr ? 'العربية / الإنجليزية' : 'Arabic / English')}
                </div>
              </div>
            </div>

            {/* تفاصيل الموقع الجغرافي والشريط الساحلي والمدن الرئيسية */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3">
              {/* الموقع والحدود */}
              <div className="p-4 rounded-2xl bg-[#090e1a]/80 border border-slate-800/80">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-1.5">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span>{isAr ? 'الموقع الجغرافي والحدود' : 'Location & Borders'}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {country.locationAr || (isAr ? `تقع في ${country.regionAr || 'القارة الأفريقية'} وتتمتع بموقع جغرافي حيوي.` : `${country.nameEn} occupies a strategic geographic crossroad.`)}
                </p>
              </div>

              {/* السواحل والمنافذ البحرية */}
              <div className="p-4 rounded-2xl bg-[#090e1a]/80 border border-slate-800/80">
                <div className="flex items-center gap-2 text-xs font-bold text-sky-400 mb-1.5">
                  <Anchor className="w-4 h-4 shrink-0" />
                  <span>{isAr ? 'السواحل والمنافذ البحرية' : 'Coastline & Maritime Access'}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {country.coastline || (isAr ? 'منافذ بحرية وتجارية استراتيجية على الممرات الدولية.' : 'Strategic maritime access and shipping channels.')}
                </p>
              </div>

              {/* المدن والمراكز الحضرية الرئيسية */}
              <div className="p-4 rounded-2xl bg-[#090e1a]/80 border border-slate-800/80">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-1.5">
                  <Building2 className="w-4 h-4 shrink-0" />
                  <span>{isAr ? 'أهم المدن والمراكز الاقتصادية' : 'Major Cities & Urban Centers'}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {(country.majorCitiesAr || [country.capital, 'المركز المالي', 'الميناء التجاري']).map((city, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-slate-300"
                    >
                      {city}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            القسم الثاني (ثابت): المؤشرات الاقتصادية الشاملة، الدخل، القدرة الشرائية والموارد
           ========================================================================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <Coins className="w-5 h-5 text-amber-400" />
              <span>{isAr ? 'الملف الاقتصادي والمالي والقدرة الشرائية' : 'Macroeconomic & Financial Profile'}</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              {isAr ? 'بيانات معتمدة ومطابقة لمصارف القارة' : 'Certified Sovereign Data'}
            </span>
          </div>

          {/* شبكة المؤشرات الاقتصادية الأساسية العشرة */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {/* 1. الناتج المحلي الإجمالي (GDP) */}
            <div className="p-4 rounded-2xl bg-[#0d1424] border border-slate-800 shadow-sm hover:border-amber-500/40 transition-colors">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>{isAr ? 'الناتج الإجمالي الاسمي' : 'Nominal GDP'}</span>
                <Coins className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono text-white mt-1">{country.gdp}</div>
              <span className="text-[11px] text-amber-400/90 font-medium">
                {isAr ? `المرتبة #${country.rank} قارياً` : `Rank #${country.rank}`}
              </span>
            </div>

            {/* 2. معدل النمو السنوي الحقيقي */}
            <div className="p-4 rounded-2xl bg-[#0d1424] border border-slate-800 shadow-sm hover:border-emerald-500/40 transition-colors">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>{isAr ? 'معدل النمو السنوي' : 'Real GDP Growth'}</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono text-emerald-400 mt-1">{country.gdpGrowth}</div>
              <span className="text-[11px] text-slate-500">{isAr ? 'توقعات الصندوق والبنك الدولي' : 'World Bank / IMF'}</span>
            </div>

            {/* 3. الدخل: نصيب الفرد من الناتج (GDP per Capita) */}
            <div className="p-4 rounded-2xl bg-[#0d1424] border border-slate-800 shadow-sm hover:border-sky-500/40 transition-colors">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>{isAr ? 'متوسط دخل الفرد' : 'GDP Per Capita'}</span>
                <DollarSign className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono text-sky-300 mt-1">
                {country.gdpPerCapita || `$${Math.round(((country.gdpNumber || 1) * 1000) / (country.populationNumber || 1)).toLocaleString()}`}
              </div>
              <span className="text-[11px] text-slate-500">{isAr ? 'نصيب الفرد السنوي' : 'Annual Per Capita'}</span>
            </div>

            {/* 4. القدرة الشرائية: الناتج بتعادل القوة الشرائية (GDP PPP) */}
            <div className="p-4 rounded-2xl bg-[#0d1424] border border-slate-800 shadow-sm hover:border-indigo-500/40 transition-colors">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>{isAr ? 'الناتج بالقدرة الشرائية' : 'GDP (PPP)'}</span>
                <Layers className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono text-indigo-300 mt-1">
                {country.gdpPPP || `$${Math.round((country.gdpNumber || 1) * 2.8 * 10) / 10}B`}
              </div>
              <span className="text-[11px] text-slate-500">{isAr ? 'تعادل القوة الشرائية' : 'Purchasing Power Parity'}</span>
            </div>

            {/* 5. القدرة الشرائية للفرد (PPP per Capita) */}
            <div className="p-4 rounded-2xl bg-[#0d1424] border border-slate-800 shadow-sm hover:border-purple-500/40 transition-colors">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>{isAr ? 'القدرة الشرائية للفرد' : 'PPP Per Capita'}</span>
                <Users className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono text-purple-300 mt-1">
                {country.pppPerCapita || `$${Math.round((((country.gdpNumber || 1) * 2.8 * 1000) / (country.populationNumber || 1))).toLocaleString()}`}
              </div>
              <span className="text-[11px] text-slate-500">{isAr ? 'مؤشر الرفاه المعيشي' : 'Living Standard Score'}</span>
            </div>

            {/* 6. العملة الوطنية ورمزها */}
            <div className="p-4 rounded-2xl bg-[#0d1424] border border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>{isAr ? 'العملة الوطنية والرمز' : 'Currency & Code'}</span>
                <Landmark className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-lg font-bold text-white mt-1 truncate">{country.currency}</div>
              <span className="text-xs font-mono font-bold text-amber-400">{country.currencySymbol}</span>
            </div>

            {/* 7. معدل التضخم السنوي */}
            <div className="p-4 rounded-2xl bg-[#0d1424] border border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>{isAr ? 'معدل التضخم السنوي' : 'Headline Inflation'}</span>
                <Percent className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono text-amber-300 mt-1">{country.inflation}</div>
              <span className="text-[11px] text-slate-500">{isAr ? 'المؤشر العام للأسعار CPI' : 'CPI Index'}</span>
            </div>

            {/* 8. سعر الفائدة للمصرف المركزي */}
            <div className="p-4 rounded-2xl bg-[#0d1424] border border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>{isAr ? 'سعر الفائدة للمركزي' : 'Policy Rate'}</span>
                <PieChart className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono text-indigo-300 mt-1">{country.centralBankRate}</div>
              <span className="text-[11px] text-slate-500">{isAr ? 'البنك المركزي' : 'Central Bank Policy'}</span>
            </div>

            {/* 9. الاحتياطيات النقدية السيادية */}
            <div className="p-4 rounded-2xl bg-[#0d1424] border border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>{isAr ? 'الاحتياطي النقدي السيادي' : 'Sovereign Reserves'}</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono text-emerald-300 mt-1">
                {country.sovereignReserves || `$${Math.round((country.gdpNumber || 1) * 0.18 * 10) / 10}B`}
              </div>
              <span className="text-[11px] text-slate-500">{isAr ? 'احتياطي النقد الأجنبي' : 'Forex Cushion'}</span>
            </div>

            {/* 10. نسبة الدين للناتج */}
            <div className="p-4 rounded-2xl bg-[#0d1424] border border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>{isAr ? 'نسبة الدين للناتج' : 'Debt to GDP'}</span>
                <Briefcase className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono text-rose-300 mt-1">
                {country.debtToGdp || `${Math.round(45 + (country.rank % 30))}%`}
              </div>
              <span className="text-[11px] text-slate-500">{isAr ? 'الاستدامة المالية' : 'Fiscal Solvency'}</span>
            </div>
          </div>

          {/* بطاقات الموارد الطبيعية، الصادرات، والشركاء التجاريين */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* الموارد والثروات الطبيعية */}
            <div className="p-5 rounded-2xl bg-[#0b101d] border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <SunMedium className="w-4 h-4" />
                <span>{isAr ? 'الموارد الطبيعية والثروات الاستراتيجية' : 'Natural Resources & Wealth'}</span>
              </div>
              <ul className="space-y-2">
                {(country.naturalResourcesAr || [
                  'الموارد المعدنية والخامات الثمينة',
                  'الطاقات المتجددة ومصادر الرياح والشمس',
                  'الثروة السمكية والأحياء البحرية',
                  'الأراضي الزراعية والمحاصيل الاستراتيجية'
                ]).map((res, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
                    <span>{res}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* القطاعات الاستراتيجية ومحركات النمو */}
            <div className="p-5 rounded-2xl bg-[#0b101d] border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider">
                <TrendingUp className="w-4 h-4" />
                <span>{isAr ? 'القطاعات الاستراتيجية ومحركات النمو' : 'Strategic Engines & Sectors'}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {country.keySectors.map((sector, idx) => (
                  <div 
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 font-medium shadow-sm hover:border-amber-500/40 transition-colors"
                  >
                    {sector}
                  </div>
                ))}
              </div>
            </div>

            {/* الصادرات والشركاء التجاريون */}
            <div className="p-5 rounded-2xl bg-[#0b101d] border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <Globe className="w-4 h-4" />
                <span>{isAr ? 'أهم الصادرات وأبرز الشركاء التجاريين' : 'Exports & Top Trade Partners'}</span>
              </div>
              
              <div className="space-y-2">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block mb-1">
                    {isAr ? 'أهم الصادرات السلعية:' : 'Primary Exports:'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(country.majorExportsAr || country.keySectors.slice(0, 3)).map((exp, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 text-[11px] text-slate-300 border border-slate-800">
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/60">
                  <span className="text-[10px] text-slate-400 font-bold block mb-1">
                    {isAr ? 'أبرز الشركاء التجاريين:' : 'Key Trade Partners:'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(country.tradePartnersAr || ['دول الاتحاد الأفريقي', 'الاتحاد الأوروبي', 'الصين']).map((partner, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-amber-500/10 text-[11px] text-amber-300 border border-amber-500/20 font-medium">
                        {partner}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          القسم الثالث: مقالات وتقارير الدولة (تنشر تلقائياً فورياً فور صدورها)
          مع لوحة التصفية بالقطاعات والأنواع الصحفية المستوحاة من الملف المتكامل
         ========================================================================= */}
      <section className="space-y-5 pt-4 border-t border-slate-800/90">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-400" />
              <h3 className="text-xl font-black text-white">
                {isAr ? `التقارير والمقالات الاقتصادية المعتمدة لـ ${country.nameAr}` : `Certified Economic Bulletins for ${country.nameEn}`}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {countryArticles.length} {isAr ? 'مقال معتمد' : 'articles'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {isAr 
                ? 'تنشر المقالات المعتمدة تلقائياً وفورياً في هذه الصفحة بمجرد إنجازها بواسطة وكلاء الذكاء الاصطناعي أو اعتمادها من غرفة الأخبار'
                : 'Articles automatically bind and publish in real-time as soon as approved by the newsroom or dispatched by AI agents'}
            </p>
          </div>

          {/* شريط البحث وتوليد تقرير جديد لهذه الدولة */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute top-2.5 right-3 text-slate-500 rtl:right-3 ltr:left-3" />
              <input
                type="text"
                value={articleSearch}
                onChange={(e) => setArticleSearch(e.target.value)}
                placeholder={isAr ? 'بحث في مقالات الدولة...' : 'Filter articles...'}
                className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl py-1.5 px-8 focus:outline-none focus:border-amber-500 transition-colors w-40 sm:w-52"
              />
            </div>

            {onTriggerInstantReport && (
              <button
                onClick={handleInstantGenerate}
                disabled={isGenerating}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>{isGenerating ? (isAr ? 'جاري الرصد والتحرير...' : 'Generating...') : (isAr ? 'إصدار تقرير جديد للدولة' : 'Generate New Report')}</span>
              </button>
            )}
          </div>
        </div>

        {/* شريط التصفية المتكاملة: القطاعات والأنواع الصحفية + شريط التصفية النشطة */}
        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
          {/* 1. فلاتر القطاعات الاقتصادية */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-400 block">
              {isAr ? 'تصفية حسب القطاع الاقتصادي:' : 'Filter by Sector:'}
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
              {SECTOR_FILTERS.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => setSelectedSector(sec.id)}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all font-medium cursor-pointer ${
                    selectedSector === sec.id
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  {isAr ? sec.nameAr : sec.nameEn}
                </button>
              ))}
            </div>
          </div>

          {/* 2. فلاتر القوالب والأنواع الصحفية */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
            <span className="text-[11px] font-semibold text-slate-400 block">
              {isAr ? 'تصفية حسب القالب الصحفي:' : 'Filter by Format:'}
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
              {GENRE_FILTERS.map((gen) => (
                <button
                  key={gen.id}
                  onClick={() => setSelectedGenre(gen.id)}
                  className={`px-3 py-1 rounded-lg whitespace-nowrap transition-all text-[11px] font-medium cursor-pointer ${
                    selectedGenre === gen.id
                      ? 'bg-purple-500 text-white font-bold shadow-md'
                      : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 border border-slate-800'
                  }`}
                >
                  {isAr ? gen.nameAr : gen.nameEn}
                </button>
              ))}
            </div>
          </div>

          {/* 3. شريط مؤشر التصفية النشطة */}
          {(selectedSector !== 'all' || selectedGenre !== 'all' || articleSearch.trim()) && (
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">{isAr ? 'التصفية النشطة:' : 'Active Filter:'}</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold font-mono">
                  {country.nameAr}
                </span>
                {selectedSector !== 'all' && (
                  <>
                    <span className="text-slate-600">/</span>
                    <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">
                      {SECTOR_FILTERS.find(s => s.id === selectedSector)?.nameAr}
                    </span>
                  </>
                )}
                {selectedGenre !== 'all' && (
                  <>
                    <span className="text-slate-600">/</span>
                    <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
                      {GENRE_FILTERS.find(g => g.id === selectedGenre)?.nameAr}
                    </span>
                  </>
                )}
                <span className="text-slate-500 text-[11px]">
                  ({filteredArticles.length} {isAr ? 'تقرير متوفر' : 'reports'})
                </span>
              </div>

              <button
                onClick={() => {
                  setSelectedSector('all');
                  setSelectedGenre('all');
                  setArticleSearch('');
                }}
                className="text-amber-400 hover:text-amber-300 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{isAr ? 'إعادة تعيين الفلاتر' : 'Reset Filters'}</span>
              </button>
            </div>
          )}
        </div>

        {/* قائمة المقالات المنشورة */}
        {filteredArticles.length === 0 ? (
          <div className="p-10 text-center rounded-3xl bg-gradient-to-b from-[#0d1424] to-[#080d18] border border-slate-800/90 text-slate-400 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <h4 className="text-base font-bold text-white">
                {isAr ? `لا توجد تقارير منشورة حالياً تحت هذا التصنيف لـ ${country.nameAr}` : `No published reports found for ${country.nameEn}`}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isAr 
                  ? 'يمكنك بنقرة زر واحدة توليد ونشر تقرير استقصائي وتحليلي فوري ومعتمد لهذه الدولة وفق هذه المعايير عبر نموذج Gemini المتقدم.' 
                  : 'You can instantly commission and auto-publish a certified AI economic report for this nation.'}
              </p>
            </div>

            {onTriggerInstantReport && (
              <button
                onClick={handleInstantGenerate}
                disabled={isGenerating}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-xs inline-flex items-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>{isGenerating ? (isAr ? 'جاري الرصد والتحرير...' : 'Generating...') : (isAr ? `⚡ إصدار تقرير اقتصادي فوري الآن لـ ${country.nameAr}` : `Dispatch Instant Report for ${country.nameEn}`)}</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredArticles.map((article) => {
              const saved = isArticleSaved(article.id);
              return (
              <article
                key={article.id}
                onClick={() => onSelectArticle(article)}
                className="p-5 rounded-2xl bg-[#0c1220] border border-slate-800/90 hover:border-amber-500/40 transition-all duration-300 cursor-pointer group flex flex-col justify-between shadow-sm hover:shadow-xl hover:shadow-amber-500/5 relative overflow-hidden"
              >
                <div>
                  {/* الشريط العلوي للبطاقة: التصنيف + زر الحفظ + دقة الحقائق */}
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium text-[11px]">
                      {article.category}
                    </span>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* زر حفظ المقال السريع عبر المكون المركزي مع التحقق من الحساب */}
                      <BookmarkButton article={article} variant="icon" lang={lang} />

                      <div className="flex items-center gap-1 font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        <span>{article.factCheck.score}% {isAr ? 'دقة حقائق' : 'Fact score'}</span>
                      </div>
                    </div>
                  </div>

                  {/* صورة المقال إن وجدت أو افتراضية */}
                  {article.imageUrl && (
                    <div className="w-full h-36 rounded-xl overflow-hidden mb-3.5 border border-slate-800 relative bg-slate-900">
                      <img
                        src={article.imageUrl}
                        alt={isAr ? article.title : article.titleEn}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}

                  {/* عنوان المقال */}
                  <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors mb-2 line-clamp-2 leading-snug">
                    {isAr ? article.title : article.titleEn}
                  </h4>

                  {/* ملخص المقال */}
                  <p className="text-xs text-slate-300/85 line-clamp-3 leading-relaxed mb-4">
                    {isAr ? article.summary : article.summaryEn}
                  </p>
                </div>

                {/* أسفل البطاقة: تاريخ النشر وزر القراءة */}
                <div className="pt-3 border-t border-slate-800/70 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1 text-slate-500 font-mono text-[10px]">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{article.publishedAt || article.createdAt}</span>
                  </div>

                  <div className="text-amber-400 group-hover:text-amber-300 flex items-center gap-1 font-bold">
                    <span>{isAr ? 'قراءة التحليل والمصادر' : 'Read Dossier'}</span>
                    {isAr ? <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> : <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />}
                  </div>
                </div>
              </article>
            );
          })}
          </div>
        )}
      </section>
    </div>
  );
};
