import React, { useRef, useState, useMemo } from 'react';
import { AfricanCountryProfile } from '../types';
import { 
  Building2, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  TrendingUp, 
  Users, 
  Zap,
  Sliders,
  ArrowUp,
  ArrowDown,
  Percent,
  Sparkles
} from 'lucide-react';
import { 
  RankingCriteria, 
  rankCountriesDynamically 
} from '../lib/dynamicEconomicRanking';

interface CountriesRibbonProps {
  countries: AfricanCountryProfile[];
  selectedSlug: string;
  onSelectCountry: (slug: string) => void;
  onOpenUpdater?: () => void;
  lang: 'ar' | 'en';
}

export const CountriesRibbon: React.FC<CountriesRibbonProps> = ({
  countries,
  selectedSlug,
  onSelectCountry,
  onOpenUpdater,
  lang
}) => {
  const isAr = lang === 'ar';
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [criteria, setCriteria] = useState<RankingCriteria>('power');
  const [searchTerm, setSearchTerm] = useState('');

  // إعادة الحساب والترتيب التلقائي الديناميكي عند تغير المعطيات أو المعيار
  const rankedCountries = useMemo(() => {
    return rankCountriesDynamically(countries, criteria);
  }, [countries, criteria]);

  const filteredCountries = useMemo(() => {
    if (!searchTerm.trim()) return rankedCountries;
    const term = searchTerm.toLowerCase();
    return rankedCountries.filter(c =>
      c.nameAr.toLowerCase().includes(term) ||
      c.nameEn.toLowerCase().includes(term) ||
      c.code.toLowerCase().includes(term) ||
      c.capital.toLowerCase().includes(term)
    );
  }, [rankedCountries, searchTerm]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 380;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <div className="bg-[#0b101d] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
      {/* Top Header & Sort/Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Title & Count Badge */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-white font-extrabold text-sm sm:text-base">
                {isAr ? 'الدول الأفريقية الـ 54' : 'All 54 African Sovereign States'}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                54 / 54
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 animate-pulse">
                <Sparkles className="w-3 h-3" />
                {isAr ? 'ترتيب ديناميكي تلقائي' : 'Dynamic Auto-Ranking'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {isAr
                ? 'يعاد ترتيب الدول تلقائياً وفورياً بناءً على إحصائيات القوة والناتج المحدثة'
                : 'Countries dynamically re-rank automatically based on updated power & GDP metrics'}
            </p>
          </div>
        </div>

        {/* Controls: Search + Dynamic Criteria Switchers + Simulation Updater Button */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute top-2.5 right-3 text-slate-500 rtl:right-3 ltr:left-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isAr ? 'ابحث عن أي دولة...' : 'Search 54 countries...'}
              className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-lg py-1.5 px-8 focus:outline-none focus:border-amber-500 transition-colors w-36 sm:w-44"
            />
          </div>

          {/* Dynamic Sorting Criteria Buttons */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px]">
            <button
              onClick={() => setCriteria('power')}
              className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
                criteria === 'power'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title={isAr ? 'مؤشر القوة الاقتصادية المركب' : 'Composite Power Index'}
            >
              <Zap className="w-3 h-3" />
              <span>{isAr ? 'مؤشر القوة' : 'Power Index'}</span>
            </button>
            <button
              onClick={() => setCriteria('gdp')}
              className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
                criteria === 'gdp'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title={isAr ? 'ترتيب حسب حجم الناتج المحلي' : 'Sort by Nominal GDP'}
            >
              <TrendingUp className="w-3 h-3" />
              <span>{isAr ? 'الناتج (GDP)' : 'GDP'}</span>
            </button>
            <button
              onClick={() => setCriteria('growth')}
              className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
                criteria === 'growth'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title={isAr ? 'أسرع الاقتصادات نمواً' : 'Fastest Growing'}
            >
              <Percent className="w-3 h-3" />
              <span>{isAr ? 'النمو' : 'Growth'}</span>
            </button>
            <button
              onClick={() => setCriteria('population')}
              className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
                criteria === 'population'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title={isAr ? 'ترتيب حسب عدد السكان' : 'Sort by Population'}
            >
              <Users className="w-3 h-3" />
              <span>{isAr ? 'السكان' : 'Pop.'}</span>
            </button>
          </div>

          {/* Live Data Simulation / Updater Trigger Button */}
          {onOpenUpdater && (
            <button
              onClick={onOpenUpdater}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 text-amber-300 border border-amber-500/40 text-xs font-semibold transition-all shadow-sm"
              title={isAr ? 'تعديل المعطيات واختبار الترتيب التلقائي' : 'Modify data & test auto re-ranking'}
            >
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAr ? 'تحديث المعطيات' : 'Update Metrics'}</span>
            </button>
          )}

          {/* Scroll Navigation Arrows */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => handleScroll('right')}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
              title={isAr ? 'تمرير للأمام' : 'Scroll forward'}
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleScroll('left')}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
              title={isAr ? 'تمرير للخلف' : 'Scroll backward'}
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Smooth Scrollable Ribbon Container */}
      <div 
        ref={scrollContainerRef}
        className="flex items-stretch gap-3 overflow-x-auto pb-2 pt-1 scroll-smooth scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent"
        style={{ scrollbarWidth: 'thin' }}
      >
        {filteredCountries.map((c, index) => {
          const isSelected = c.slug === selectedSlug;
          const rankChange = c.rankChange || 0;

          return (
            <button
              key={c.code}
              onClick={() => onSelectCountry(c.slug)}
              className={`flex-shrink-0 w-56 sm:w-60 text-right rtl:text-right ltr:text-left p-3.5 rounded-xl border transition-all duration-300 group relative ${
                isSelected
                  ? 'bg-gradient-to-br from-amber-500/20 to-amber-600/10 border-amber-500 text-white shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/50'
                  : 'bg-[#0f172a]/70 hover:bg-[#131d35] border-slate-800/90 text-slate-300 hover:border-slate-700'
              }`}
            >
              {/* Top Row: Rank Badge + Rank Movement Indicator + Code */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                    isSelected 
                      ? 'bg-amber-500 text-slate-950 font-extrabold' 
                      : c.rank <= 5 
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                        : c.rank <= 15
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400'
                  }`}>
                    #{c.rank}
                  </span>

                  {/* Rank Dynamic Movement Indicator */}
                  {rankChange > 0 && (
                    <span className="flex items-center text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-1 py-0.5 rounded border border-emerald-500/30 font-mono" title={`صعود ${rankChange} مراكز`}>
                      <ArrowUp className="w-2.5 h-2.5" />
                      +{rankChange}
                    </span>
                  )}
                  {rankChange < 0 && (
                    <span className="flex items-center text-[10px] font-bold text-rose-400 bg-rose-500/15 px-1 py-0.5 rounded border border-rose-500/30 font-mono" title={`تراجع ${Math.abs(rankChange)} مراكز`}>
                      <ArrowDown className="w-2.5 h-2.5" />
                      {rankChange}
                    </span>
                  )}
                </div>

                <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                  {c.code} · {c.currencySymbol}
                </span>
              </div>

              {/* Country Name & Capital */}
              <h4 className={`font-bold text-sm truncate group-hover:text-amber-400 transition-colors ${
                isSelected ? 'text-amber-300' : 'text-slate-100'
              }`}>
                {isAr ? c.nameAr : c.nameEn}
              </h4>
              <p className="text-[10px] text-slate-500 truncate mb-2">
                {c.capital}
              </p>

              {/* Metrics Pill Grid */}
              <div className="space-y-1.5 text-[11px] pt-2 border-t border-slate-800/60 font-mono">
                {/* Composite Power Score (When Available) */}
                {c.powerScore !== undefined && (
                  <div className="flex items-center justify-between text-slate-400 bg-slate-950/40 px-1.5 py-0.5 rounded">
                    <span className="text-[10px] text-amber-400/90 font-semibold">{isAr ? 'نقاط القوة:' : 'Power Score:'}</span>
                    <span className="text-amber-400 font-bold">{c.powerScore} <span className="text-[9px] text-slate-500">/100</span></span>
                  </div>
                )}
                
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] text-slate-500">{isAr ? 'الناتج (GDP):' : 'Nominal GDP:'}</span>
                  <span className="text-amber-400 font-bold">{c.gdp}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] text-slate-500">{isAr ? 'النمو السنوي:' : 'Annual Growth:'}</span>
                  <span className={c.gdpGrowth.startsWith('+') ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                    {c.gdpGrowth}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] text-slate-500">{isAr ? 'السكان:' : 'Population:'}</span>
                  <span className="text-slate-300">{c.population}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
