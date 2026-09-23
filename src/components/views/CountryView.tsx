import React from 'react';
import { AfricanCountryProfile, Article } from '../../types';
import { 
  Building2, 
  TrendingUp, 
  Percent, 
  Coins, 
  PieChart, 
  FileText, 
  ArrowLeft, 
  ArrowRight,
  Code2,
  ExternalLink
} from 'lucide-react';

interface CountryViewProps {
  country: AfricanCountryProfile;
  allCountries: AfricanCountryProfile[];
  onSelectCountry: (slug: string) => void;
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  lang: 'ar' | 'en';
}

export const CountryView: React.FC<CountryViewProps> = ({
  country,
  allCountries,
  onSelectCountry,
  articles,
  onSelectArticle,
  lang
}) => {
  const isAr = lang === 'ar';
  const countryArticles = articles.filter(a => a.countryCode === country.code && a.status === 'published');

  return (
    <div className="space-y-8 pb-16">
      {/* Route & Architecture Banner (Next.js App Router Simulation) */}
      <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-300 font-mono">
          <Code2 className="w-4 h-4 text-amber-400" />
          <span className="text-slate-500">{isAr ? 'مسار Next.js الديناميكي: ' : 'Dynamic Route: '}</span>
          <span className="text-amber-400 font-semibold">/app/countries/[countryCode]/page.tsx</span>
          <span className="text-slate-600">→</span>
          <span className="text-emerald-400 font-semibold">/countries/{country.slug}</span>
        </div>

        {/* Country Quick Selector */}
        <div className="flex items-center gap-1 overflow-x-auto py-1">
          {allCountries.map((c) => (
            <button
              key={c.code}
              onClick={() => onSelectCountry(c.slug)}
              className={`px-2.5 py-1 rounded text-xs transition-colors whitespace-nowrap ${
                c.slug === country.slug
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              {isAr ? c.nameAr : c.nameEn}
            </button>
          ))}
        </div>
      </div>

      {/* Country Header Banner */}
      <div className="p-6 sm:p-8 rounded-xl bg-gradient-to-br from-[#11192e] to-[#0c1322] border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-mono mb-2">
              <span>{isAr ? 'الملف الاقتصادي والمالي الرسمي' : 'Official Sovereign Economic Dossier'}</span>
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
            <div className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-left">
              <span className="text-[10px] text-slate-400 block">{isAr ? 'العملة الوطنية' : 'Currency'}</span>
              <span className="text-sm font-bold font-mono text-amber-400">{country.currency}</span>
            </div>
          </div>
        </div>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-4xl">
          {isAr ? country.descriptionAr : country.descriptionEn}
        </p>
      </div>

      {/* Macroeconomic Indicators Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0d1424] border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>{isAr ? 'الناتج المحلي الإجمالي' : 'Nominal GDP'}</span>
            <Coins className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white mt-1">{country.gdp}</div>
          <span className="text-[11px] text-slate-500">{isAr ? 'حسب تقديرات صندوق النقد' : 'IMF Estimate'}</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0d1424] border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>{isAr ? 'معدل النمو السنوي' : 'Real GDP Growth'}</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1">{country.gdpGrowth}</div>
          <span className="text-[11px] text-slate-500">{isAr ? 'توقعات البنك الدولي' : 'World Bank Outlook'}</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0d1424] border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>{isAr ? 'معدل التضخم السنوي' : 'Headline Inflation'}</span>
            <Percent className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-amber-300 mt-1">{country.inflation}</div>
          <span className="text-[11px] text-slate-500">{isAr ? 'المؤشر العام لأسعار المستهلك' : 'CPI Year-on-Year'}</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0d1424] border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>{isAr ? 'سعر الفائدة للمركزي' : 'Policy Interest Rate'}</span>
            <PieChart className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xl font-bold font-mono text-indigo-300 mt-1">{country.centralBankRate}</div>
          <span className="text-[11px] text-slate-500">{isAr ? 'قرارات لجان السياسة النقدية' : 'Monetary Policy Comm.'}</span>
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
