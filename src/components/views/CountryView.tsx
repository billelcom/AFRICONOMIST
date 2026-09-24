import React from 'react';
import { AfricanCountryProfile, Article } from '../../types';
import { CountriesRibbon } from '../CountriesRibbon';
import { 
  Building2, 
  TrendingUp, 
  Percent, 
  Coins, 
  PieChart, 
  FileText, 
  ArrowLeft, 
  ArrowRight,
  ExternalLink,
  Users,
  Award
} from 'lucide-react';

interface CountryViewProps {
  country: AfricanCountryProfile;
  allCountries: AfricanCountryProfile[];
  onSelectCountry: (slug: string) => void;
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  onOpenUpdater?: () => void;
  lang: 'ar' | 'en';
}

export const CountryView: React.FC<CountryViewProps> = ({
  country,
  allCountries,
  onSelectCountry,
  articles,
  onSelectArticle,
  onOpenUpdater,
  lang
}) => {
  const isAr = lang === 'ar';
  const countryArticles = articles.filter(a => a.countryCode === country.code && a.status === 'published');

  return (
    <div className="space-y-8 pb-16">
      {/* Horizontal Scrollable Countries Ribbon (All 54 African Countries) */}
      <CountriesRibbon
        countries={allCountries}
        selectedSlug={country.slug}
        onSelectCountry={onSelectCountry}
        onOpenUpdater={onOpenUpdater}
        lang={lang}
      />

      {/* Country Header Banner */}
      <div className="p-6 sm:p-8 rounded-xl bg-gradient-to-br from-[#11192e] to-[#0c1322] border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-mono mb-2">
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                {isAr ? `المرتبة #${country.rank} أفريقياً` : `Rank #${country.rank} in Africa`}
              </span>
              {country.rankChange !== undefined && country.rankChange !== 0 && (
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${country.rankChange > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                  {country.rankChange > 0 ? `▲ صعود +${country.rankChange}` : `▼ تراجع ${country.rankChange}`}
                </span>
              )}
              <span>·</span>
              <span>{country.code}</span>
              <span>·</span>
              <span>{country.capital}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {isAr ? country.nameAr : country.nameEn}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-left rtl:text-right ltr:text-left">
              <span className="text-[10px] text-slate-400 block">{isAr ? 'العملة الوطنية' : 'Currency'}</span>
              <span className="text-sm font-bold font-mono text-amber-400">{country.currency}</span>
            </div>

            {onOpenUpdater && (
              <button
                onClick={onOpenUpdater}
                className="px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md"
              >
                <span>{isAr ? 'تعديل المعطيات ومحاكاة الترتيب' : 'Simulate & Re-rank'}</span>
              </button>
            )}
          </div>
        </div>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-4xl">
          {isAr ? country.descriptionAr : country.descriptionEn}
        </p>
      </div>

      {/* Macroeconomic Indicators Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-xl bg-[#0d1424] border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>{isAr ? 'الناتج الإجمالي (GDP)' : 'Nominal GDP'}</span>
            <Coins className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white mt-1">{country.gdp}</div>
          <span className="text-[11px] text-slate-500">{isAr ? 'الترتيب: #' + country.rank : 'Rank: #' + country.rank}</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0d1424] border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>{isAr ? 'عدد السكان' : 'Population'}</span>
            <Users className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-xl font-bold font-mono text-sky-300 mt-1">{country.population}</div>
          <span className="text-[11px] text-slate-500">{isAr ? 'بيانات البنك الدولي' : 'World Bank census'}</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0d1424] border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>{isAr ? 'معدل النمو السنوي' : 'Real GDP Growth'}</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1">{country.gdpGrowth}</div>
          <span className="text-[11px] text-slate-500">{isAr ? 'توقعات صندوق النقد' : 'IMF Outlook'}</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0d1424] border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>{isAr ? 'معدل التضخم السنوي' : 'Headline Inflation'}</span>
            <Percent className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-amber-300 mt-1">{country.inflation}</div>
          <span className="text-[11px] text-slate-500">{isAr ? 'المؤشر العام للأسعار' : 'CPI Year-on-Year'}</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0d1424] border border-slate-800 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>{isAr ? 'سعر الفائدة للمركزي' : 'Policy Rate'}</span>
            <PieChart className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xl font-bold font-mono text-indigo-300 mt-1">{country.centralBankRate}</div>
          <span className="text-[11px] text-slate-500">{isAr ? 'البنك المركزي' : 'Central Bank'}</span>
        </div>
      </div>

      {/* Key Strategic Sectors */}
      <div className="p-5 rounded-xl bg-[#0b101c] border border-slate-800">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          {isAr ? 'القطاعات الاستراتيجية ومحركات النمو' : 'Key Growth Engines & Strategic Sectors'}
        </h3>
        <div className="flex flex-wrap gap-2">
          {country.keySectors.map((sector, idx) => (
            <div 
              key={idx}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200"
            >
              {sector}
            </div>
          ))}
        </div>
      </div>

      {/* Articles specific to this Country */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-amber-400" />
          {isAr ? `التقارير الاقتصادية المعتمدة لـ ${country.nameAr}` : `Economic Bulletins for ${country.nameEn}`}
        </h3>

        {countryArticles.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-slate-900/50 border border-slate-800 text-slate-400 text-sm">
            {isAr 
              ? 'لا توجد مقالات منشورة لهذه الدولة حالياً. جاري جمع ومعالجة البيانات بواسطة وكيل الرصد الاقتصادي.'
              : 'No published articles for this country yet. Ingestion agent is currently polling trade feeds.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {countryArticles.map((article) => (
              <div
                key={article.id}
                onClick={() => onSelectArticle(article)}
                className="p-5 rounded-xl bg-[#0d1424] border border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                  <span className="text-amber-400">{article.category}</span>
                  <span>·</span>
                  <span className="text-emerald-400 font-mono">{article.factCheck.score}% دقة حقائق</span>
                </div>
                <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors mb-2">
                  {isAr ? article.title : article.titleEn}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                  {isAr ? article.summary : article.summaryEn}
                </p>
                <div className="text-[11px] text-amber-400 flex items-center gap-1 font-medium">
                  {isAr ? 'قراءة التحليل والمصادر' : 'Read Analysis'}
                  {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
