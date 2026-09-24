import React from 'react';
import { 
  Building2, 
  Globe2, 
  ShieldCheck, 
  Code2, 
  Flame, 
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  LayoutGrid,
  Activity
} from 'lucide-react';

interface HeaderProps {
  currentTab: 'home' | 'country' | 'article' | 'editorial' | 'architecture';
  onSelectTab: (tab: 'home' | 'country' | 'article' | 'editorial' | 'architecture') => void;
  lang: 'ar' | 'en';
  onToggleLang: () => void;
  pendingDraftsCount: number;
  onOpenHealthCheck?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  lang,
  onToggleLang,
  pendingDraftsCount,
  onOpenHealthCheck
}) => {
  const isAr = lang === 'ar';

  return (
    <header className="sticky top-0 z-40 bg-[#080C14]/95 backdrop-blur-md border-b border-slate-800">
      {/* Top Utility Ribbon */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/40">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-amber-500 font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            {isAr ? 'بث مباشر - أسواق المال الأفريقية' : 'Live Feed - Pan-African Markets'}
          </span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline text-slate-400 font-mono">
            {isAr ? 'معيار Zero-Trust التحليلي المعتمد' : 'Zero-Trust AI Financial Verification'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {onOpenHealthCheck && (
            <button
              onClick={onOpenHealthCheck}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors font-mono text-[11px]"
              title={isAr ? 'فحص صحة الخدمات السحابية ومستودع GitHub' : 'Cloud Health-Check & GitHub Diagnostics'}
            >
              <Activity className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
              <span>{isAr ? 'فحص السحابة (GitHub)' : 'Cloud Health'}</span>
            </button>
          )}

          <button
            onClick={onToggleLang}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/60 transition-colors"
            title="Toggle Language / تغيير اللغة"
            aria-label="Toggle Language"
          >
            <Globe2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold">{isAr ? 'English' : 'العربية'}</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Text Logo */}
        <div 
          onClick={() => onSelectTab('home')}
          className="flex flex-col cursor-pointer group select-none"
        >
          <div className="flex items-center gap-2">
            <span className="font-black tracking-tight text-white text-xl sm:text-2xl font-mono group-hover:text-amber-400 transition-colors">
              {isAr ? 'آفريكونوميست' : 'Africonomist'}
            </span>
            <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          </div>
          <p className="text-[10px] text-slate-400 -mt-0.5 hidden sm:block">
            {isAr ? 'الصحافة الاقتصادية والمالية الأفريقية' : 'African Economic & Financial Intelligence'}
          </p>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Main Navigation">
          <button
            onClick={() => onSelectTab('home')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 ${
              currentTab === 'home'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>{isAr ? 'الرئيسية والأسواق' : 'Markets & News'}</span>
          </button>

          <button
            onClick={() => onSelectTab('country')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 ${
              currentTab === 'country'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>{isAr ? 'ملفات الدول' : 'Countries'}</span>
          </button>

          <button
            onClick={() => onSelectTab('article')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors hidden md:flex items-center gap-1.5 ${
              currentTab === 'article'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>{isAr ? 'قراءة مقال' : 'Article Reader'}</span>
          </button>

          {/* Hidden Editorial Review Dashboard */}
          <button
            onClick={() => onSelectTab('editorial')}
            className={`relative px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 ${
              currentTab === 'editorial'
                ? 'bg-rose-500/15 text-rose-300 border border-rose-500/40'
                : 'text-slate-300 hover:text-rose-300 hover:bg-rose-950/20'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-rose-400" />
            <span>{isAr ? 'لوحة التحرير' : 'Editorial Review'}</span>
            {pendingDraftsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white font-mono">
                {pendingDraftsCount}
              </span>
            )}
          </button>

          {/* Architecture & Scaffolding Blueprint Explorer */}
          <button
            onClick={() => onSelectTab('architecture')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all flex items-center gap-1.5 border shadow-sm ${
              currentTab === 'architecture'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold border-amber-400'
                : 'bg-slate-900 hover:bg-slate-800 text-amber-300 border-amber-500/40'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>{isAr ? 'دليل المعمارية والأكواد' : 'Architecture Blueprint'}</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
