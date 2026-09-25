import React, { useState, useMemo } from 'react';
import { AfricanCountryProfile, Article } from '../../types';
import { CountriesRibbon } from '../CountriesRibbon';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  Search, 
  Globe2, 
  SlidersHorizontal, 
  Layers, 
  Sparkles, 
  Clock, 
  Users, 
  ArrowUpRight,
  ChevronRight,
  ChevronLeft,
  RotateCcw
} from 'lucide-react';
import { getCountryFlag } from '../../lib/africanGeoProximity';

interface DataJournalismViewProps {
  countries: AfricanCountryProfile[];
  articles: Article[];
  lang: 'ar' | 'en';
  onSelectCountry: (slug: string) => void;
  onSelectArticle: (article: Article) => void;
  onOpenUpdater?: () => void;
}

export const DataJournalismView: React.FC<DataJournalismViewProps> = ({
  countries,
  articles,
  lang,
  onSelectCountry,
  onSelectArticle,
  onOpenUpdater,
}) => {
  const isAr = lang === 'ar';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState<'rank' | 'gdp' | 'growth'>('rank');

  // Filtered and sorted countries
  const filteredCountries = useMemo(() => {
    return countries.filter(c => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        c.nameAr.toLowerCase().includes(q) ||
        c.nameEn.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.capital.toLowerCase().includes(q)
      );
    }).sort((a, b) => {
      if (selectedSort === 'gdp') {
        const gdpA = parseFloat(a.gdp.replace(/[^0-9.]/g, '')) || 0;
        const gdpB = parseFloat(b.gdp.replace(/[^0-9.]/g, '')) || 0;
        return gdpB - gdpA;
      }
      if (selectedSort === 'growth') {
        const grA = parseFloat(a.gdpGrowth.replace(/[^0-9.-]/g, '')) || 0;
        const grB = parseFloat(b.gdpGrowth.replace(/[^0-9.-]/g, '')) || 0;
        return grB - grA;
      }
      return a.rank - b.rank;
    });
  }, [countries, searchQuery, selectedSort]);

  // Data journalism articles
  const dataArticles = useMemo(() => {
    return articles.filter(a => 
      a.status === 'published' && 
      (a.journalisticType === 'صحافة البيانات' || a.category === 'Macroeconomics' || a.category === 'Markets')
    );
  }, [articles]);

  return (
    <div className="space-y-8 pb-20">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#0e1628] via-[#09101d] to-[#060a14] border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-bold">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>{isAr ? 'صحافة البيانات والتحليل الكمي' : 'Data Journalism & Quantitative Intelligence'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {isAr ? 'مرصد القوة الاقتصادية الإفريقية وتصنيف الـ 54 دولة' : 'Pan-African Sovereign Economic Power Index'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {isAr 
                ? 'نموذج محاكاة البيانات الاقتصادية الحية وتصنيف شامل لجميع الدول الإفريقية وفق الناتج المحلي الإجمالي، مؤشرات النمو الحقيقي، ومؤشر القوة السيادية المدقق.' 
                : 'Interactive dynamic ranking model for all 54 African nations tracking nominal GDP, real growth trajectory, and verified macroeconomic robustness.'}
            </p>
          </div>

          {onOpenUpdater && (
            <button
              onClick={onOpenUpdater}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/10 transition-all shrink-0 cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>{isAr ? 'محاكاة البيانات وتحديث المؤشرات' : 'Launch Macroeconomic Simulator'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 1. قسم بطاقة الدول الأفريقية وترتيبها حسب القوة (المنقول من الرئيسية) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg sm:text-xl font-bold text-white">
              {isAr ? 'بطاقة الدول الأفريقية وترتيبها حسب القوة والناتج' : 'African Countries Power & GDP Ranking Ribbon'}
            </h2>
          </div>
          <span className="text-xs text-amber-400 font-mono font-bold bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
            54 {isAr ? 'دولة' : 'Nations'}
          </span>
        </div>

        {/* شريط الدول الأفريقية الـ 54 بكامل خصائص الترتيب والمحاكاة التفاعلية */}
        <CountriesRibbon
          countries={countries}
          selectedSlug=""
          onSelectCountry={onSelectCountry}
          onOpenUpdater={onOpenUpdater}
          lang={lang}
        />
      </section>

      {/* 2. جدول ومصفوفة المقارنة التحليلية الشاملة */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-400" />
              {isAr ? 'المصفوفة الاقتصادية الشاملة للدول' : 'Comprehensive Sovereign Macro Matrix'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isAr ? 'بيانات معتمدة من البنك الدولي وبنك التنمية الإفريقي وصندوق النقد الدولي' : 'Verified data from World Bank, AfDB, and IMF repositories'}
            </p>
          </div>

          {/* Controls: Search + Sort */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute top-2.5 right-3 rtl:right-3 ltr:left-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAr ? 'بحث عن دولة أو عاصمة...' : 'Search country or capital...'}
                className="bg-slate-900 border border-slate-800 rounded-lg py-1.5 px-8 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 w-48 sm:w-56"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setSelectedSort('rank')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  selectedSort === 'rank' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {isAr ? 'الترتيب' : 'Rank'}
              </button>
              <button
                onClick={() => setSelectedSort('gdp')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  selectedSort === 'gdp' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {isAr ? 'الناتج' : 'GDP'}
              </button>
              <button
                onClick={() => setSelectedSort('growth')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  selectedSort === 'growth' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {isAr ? 'النمو' : 'Growth'}
              </button>
            </div>
          </div>
        </div>

        {/* Matrix Grid of Countries */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {filteredCountries.map((c) => {
            const flag = getCountryFlag(c.code);
            const isRankUp = (c.rankMovement || 0) > 0;
            const isRankDown = (c.rankMovement || 0) < 0;

            return (
              <div
                key={c.code}
                onClick={() => onSelectCountry(c.slug)}
                className="p-4 rounded-xl bg-[#0c1220] border border-slate-800 hover:border-amber-500/40 transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl leading-none">{flag}</span>
                      <div>
                        <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                          {isAr ? c.nameAr : c.nameEn}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-mono">{c.code} · {c.capital}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 font-mono text-xs">
                      <span className="font-bold text-amber-400">#{c.rank}</span>
                      {isRankUp && <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />}
                      {isRankDown && <TrendingDown className="w-3.5 h-3.5 text-rose-400" />}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 my-3 p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80 text-[11px] font-mono">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">{isAr ? 'الناتج الاسمي:' : 'Nominal GDP:'}</span>
                      <span className="font-bold text-white">{c.gdp}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">{isAr ? 'النمو السنوي:' : 'Real Growth:'}</span>
                      <span className={`font-bold ${c.gdpGrowth.startsWith('-') ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {c.gdpGrowth}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10.5px] text-slate-400">
                  <span>{isAr ? 'مؤشر القوة السيادية:' : 'Power Score:'}</span>
                  <span className="font-bold text-amber-400 font-mono">{c.powerScore || 85}/100</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. تقارير صحافة البيانات المرتبطة */}
      {dataArticles.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-teal-400" />
              {isAr ? 'تحقيقات وتقارير صحافة البيانات' : 'Data Journalism In-Depth Reports'}
            </h3>
            <span className="text-xs text-slate-400">{dataArticles.length} {isAr ? 'تقارير بيانية' : 'Reports'}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dataArticles.map((art) => (
              <article
                key={art.id}
                onClick={() => onSelectArticle(art)}
                className="p-5 rounded-xl bg-[#0c1220] border border-slate-800 hover:border-teal-500/40 transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-2 font-medium">
                    <span className="text-teal-400 font-bold">{art.sector || art.category}</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span>{isAr ? art.countryName : art.countryNameEn}</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="font-mono text-emerald-400">{art.factCheck.score}% {isAr ? 'دقة' : 'Accuracy'}</span>
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-teal-300 transition-colors line-clamp-2 leading-snug mb-2">
                    {isAr ? art.title : art.titleEn}
                  </h4>

                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                    {isAr ? art.summary : art.summaryEn}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>{art.publishedAt || art.createdAt}</span>
                  <span className="text-teal-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform font-sans font-medium">
                    {isAr ? 'طالع التحقيق البياني' : 'Read Data Story'}
                    {isAr ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
