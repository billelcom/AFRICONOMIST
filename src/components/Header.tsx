// src/components/Header.tsx
import React, { useState } from 'react';
import { 
  Globe2, 
  ShieldCheck, 
  LayoutGrid, 
  FileText, 
  Mic, 
  Video, 
  BarChart3, 
  Search, 
  User, 
  Building2
} from 'lucide-react';
import { NavigationModals, NavModalType } from './NavigationModals';
import { PWABar } from './pwa/PWABar';
import { PWAInstallButton } from './pwa/PWAInstallButton';

export type HeaderTab = 'home' | 'country' | 'article' | 'editorial' | 'data-journalism' | 'about' | 'privacy' | 'podcast' | 'video';

interface HeaderProps {
  currentTab: HeaderTab;
  onSelectTab: (tab: HeaderTab) => void;
  lang: 'ar' | 'en';
  onToggleLang: () => void;
  pendingDraftsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  lang,
  onToggleLang,
  pendingDraftsCount
}) => {
  const isAr = lang === 'ar';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [activeModal, setActiveModal] = useState<NavModalType>(null);

  const handleNavClick = (action: () => void) => {
    action();
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="w-full bg-[#070A12]/95 backdrop-blur-md border-b border-slate-800/80">
        {/* =========================================================================
            1. MOBILE HEADER BAR (شريط الهاتف المخصص: مسافة متوازنة وجميلة بين اللوغو والشعار)
           ========================================================================= */}
        <div className="md:hidden px-3.5 py-2.5 flex items-center justify-between border-b border-slate-800/60">
          {/* الجانب الأيمن (في العربية): اللوغو والشعار بمسافة مريحة متوازنة (لا متلاصقان ولا متباعدان) */}
          <div 
            onClick={() => handleNavClick(() => onSelectTab('home'))}
            className="flex flex-col cursor-pointer select-none group"
          >
            <div className="flex items-center gap-1.5">
              <span className={`font-brand-artistic font-bold text-white leading-tight group-hover:text-amber-400 transition-colors ${
                isAr 
                  ? 'text-[15px] sm:text-base tracking-wide' 
                  : 'text-[11px] sm:text-xs tracking-wider uppercase'
              }`}>
                {isAr ? 'لافريكونوميست' : 'L’AFRICONOMIST'}
              </span>
              <span className={`rounded-full bg-amber-500 animate-pulse ${
                isAr ? 'w-1.5 h-1.5' : 'w-1 h-1'
              }`}></span>
            </div>
            <p className={`font-serif text-amber-400/90 font-medium leading-none ${
              isAr ? 'text-[9.5px] pt-1' : 'text-[7.5px] pt-0.5 tracking-tight'
            }`}>
              {isAr ? 'صحيفة الاقتصاد الإفريقي' : 'African Economic Journal'}
            </p>
          </div>

          {/* الجانب الأيسر (على جهة اليسار): شريط PWA (أيقونة التثبيت فقط في الهاتف) + زر تسجيل + أيقونة اللغة + أيقونة القائمة burger */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* أدوات PWA: في الهاتف تظهر أيقونة التثبيت فقط دون العبارة النصية */}
            <PWABar lang={lang} iconOnly={true} />

            {/* زر تسجيل */}
            <button
              onClick={() => setActiveModal('auth')}
              className={`rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black flex items-center gap-1 shadow-sm transition-all active:scale-95 cursor-pointer ${
                isAr 
                  ? 'px-2.5 py-1 text-[11px]' 
                  : 'px-1.5 py-0.5 text-[9px] font-bold'
              }`}
              title={isAr ? 'تسجيل الدخول / العضوية' : 'Sign In'}
            >
              <User className={isAr ? "w-3 h-3" : "w-2.5 h-2.5"} />
              <span>{isAr ? 'تسجيل' : 'Sign In'}</span>
            </button>

            {/* أيقونة اللغة */}
            <button
              onClick={onToggleLang}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/60 transition-colors text-xs flex items-center justify-center cursor-pointer"
              title="تغيير اللغة / Toggle Language"
              aria-label="Language Toggle"
            >
              <Globe2 className="w-3.5 h-3.5 text-amber-400" />
            </button>

            {/* أيقونة القائمة Menu Burger الإبداعية (3 أسطر تتحول إلى X عند الضغط) */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
              className="relative w-8 h-8 flex flex-col items-center justify-center gap-1 p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 hover:text-amber-400 focus:outline-none transition-colors select-none cursor-pointer"
              aria-label={isMobileMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
            >
              <span
                className={`block h-0.5 w-4 bg-current rounded-full transition-all duration-300 ease-in-out ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-1.5 bg-amber-400' : ''
                }`}
              />
              <span
                className={`block h-0.5 w-4 bg-current rounded-full transition-all duration-200 ease-in-out ${
                  isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`block h-0.5 w-4 bg-current rounded-full transition-all duration-300 ease-in-out ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-1.5 bg-amber-400' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* =========================================================================
            2. MOBILE DROPDOWN MENU (القائمة المنسدلة للهاتف)
           ========================================================================= */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#070B14]/98 backdrop-blur-2xl border-b border-slate-800/90 shadow-2xl px-4 py-4 space-y-3 animate-in slide-in-from-top-3 duration-200">
            {/* روابط القائمة المنسدلة الـ 8 بتصميم إبداعي وخط صغير ومنسق */}
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {/* 1. الرئيسية */}
              <button
                onClick={() => handleNavClick(() => onSelectTab('home'))}
                className={`p-2.5 rounded-xl text-right flex items-center gap-2 border transition-all ${
                  currentTab === 'home'
                    ? 'bg-amber-500/15 text-amber-400 border-amber-500/30 font-bold'
                    : 'bg-slate-900/60 text-slate-300 border-slate-800/70 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">{isAr ? 'الرئيسية' : 'Home'}</span>
              </button>

              {/* 2. من نحن */}
              <button
                onClick={() => handleNavClick(() => onSelectTab('about'))}
                className={`p-2.5 rounded-xl text-right flex items-center gap-2 border transition-all ${
                  currentTab === 'about'
                    ? 'bg-blue-500/15 text-blue-400 border-blue-500/30 font-bold'
                    : 'bg-slate-900/60 text-slate-300 border-slate-800/70 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="truncate">{isAr ? 'من نحن' : 'About Us'}</span>
              </button>

              {/* 3. الشروط والخصوصية */}
              <button
                onClick={() => handleNavClick(() => onSelectTab('privacy'))}
                className={`p-2.5 rounded-xl text-right flex items-center gap-2 border transition-all ${
                  currentTab === 'privacy'
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 font-bold'
                    : 'bg-slate-900/60 text-slate-300 border-slate-800/70 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{isAr ? 'الشروط والخصوصية' : 'Terms & Privacy'}</span>
              </button>

              {/* 4. كل التقارير */}
              <button
                onClick={() => handleNavClick(() => onSelectTab('home'))}
                className="p-2.5 rounded-xl text-right flex items-center gap-2 border bg-slate-900/60 text-slate-300 border-slate-800/70 hover:bg-slate-800/60 hover:text-white transition-all"
              >
                <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">{isAr ? 'كل التقارير' : 'All Reports'}</span>
              </button>

              {/* 5. البودكاست */}
              <button
                onClick={() => handleNavClick(() => onSelectTab('podcast'))}
                className={`p-2.5 rounded-xl text-right flex items-center justify-between border transition-all ${
                  currentTab === 'podcast'
                    ? 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30 font-bold'
                    : 'bg-slate-900/60 text-slate-300 border-slate-800/70 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Mic className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="truncate">{isAr ? 'البودكاست' : 'Podcasts'}</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                  {isAr ? 'صوتي' : 'Audio'}
                </span>
              </button>

              {/* 6. التقارير المصورة */}
              <button
                onClick={() => handleNavClick(() => onSelectTab('video'))}
                className={`p-2.5 rounded-xl text-right flex items-center justify-between border transition-all ${
                  currentTab === 'video'
                    ? 'bg-rose-500/15 text-rose-400 border-rose-500/30 font-bold'
                    : 'bg-slate-900/60 text-slate-300 border-slate-800/70 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Video className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span className="truncate">{isAr ? 'التقارير المصورة' : 'Video Reports'}</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-mono">
                  {isAr ? 'مرئي' : 'Video'}
                </span>
              </button>

              {/* 7. صحافة البيانات */}
              <button
                onClick={() => handleNavClick(() => onSelectTab('data-journalism'))}
                className={`p-2.5 rounded-xl text-right flex items-center gap-2 border transition-all ${
                  currentTab === 'data-journalism'
                    ? 'bg-teal-500/15 text-teal-300 border-teal-500/30 font-bold'
                    : 'bg-slate-900/60 text-slate-300 border-slate-800/70 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span className="truncate">{isAr ? 'صحافة البيانات' : 'Data Journalism'}</span>
              </button>

              {/* 8. استقصاء وتقصي */}
              <button
                onClick={() => handleNavClick(() => onSelectTab('home'))}
                className="p-2.5 rounded-xl text-right flex items-center gap-2 border bg-slate-900/60 text-slate-300 border-slate-800/70 hover:bg-slate-800/60 hover:text-white transition-all"
              >
                <Search className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">{isAr ? 'استقصاء وتقصي' : 'Investigations'}</span>
              </button>
            </div>

            {/* زر تثبيت تطبيق الـ PWA للهاتف */}
            <div className="pt-2 border-t border-slate-800/60">
              <PWAInstallButton variant="full" lang={lang} />
            </div>

            {/* في الأسفل: غرفة الأخبار تقابلها التسجيل */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2">
              <button
                onClick={() => handleNavClick(() => onSelectTab('editorial'))}
                className={`flex-1 p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  currentTab === 'editorial'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-lg'
                    : 'bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-rose-400" />
                <span>{isAr ? 'غرفة الأخبار' : 'Newsroom Desk'}</span>
                {pendingDraftsCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white font-mono">
                    {pendingDraftsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleNavClick(() => setActiveModal('auth'))}
                className="flex-1 p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 shadow-lg transition-all cursor-pointer"
              >
                <User className="w-4 h-4" />
                <span>{isAr ? 'التسجيل / العضوية' : 'Sign In / Register'}</span>
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            3. DESKTOP HEADER (شاشة الحاسوب: شريطان منفصلان أنيقان)
           ========================================================================= */}
        <div className="hidden md:block">
          {/* الشريط العلوي (Top Bar): اللوغو يقابله تغيير اللغة، التسجيل، وغرفة الأخبار */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between border-b border-slate-800/80">
            {/* اللوغو والشعار */}
            <div 
              onClick={() => onSelectTab('home')}
              className="flex items-center gap-2 cursor-pointer group shrink-0 select-none"
            >
              <span className={`font-brand-artistic font-bold text-white group-hover:text-amber-400 transition-colors ${
                isAr 
                  ? 'text-xl lg:text-2xl tracking-normal' 
                  : 'text-sm lg:text-[15px] tracking-wider uppercase font-black'
              }`}>
                {isAr ? 'لافريكونوميست' : 'L’AFRICONOMIST'}
              </span>
              <span className={`inline-block rounded-full bg-amber-500 animate-pulse ${
                isAr ? 'w-2 h-2' : 'w-1.5 h-1.5'
              }`}></span>
              <span className={`text-amber-400/90 font-serif font-medium whitespace-nowrap ${
                isAr ? 'text-xs' : 'text-[10.5px] tracking-tight'
              }`}>
                {isAr ? 'صحيفة الاقتصاد الإفريقي' : 'African Economic Journal'}
              </span>
            </div>

            {/* يقابله: أدوات PWA + تغيير اللغة + التسجيل + غرفة الأخبار */}
            <div className="flex items-center gap-2 lg:gap-2.5 shrink-0">
              {/* أدوات PWA (تثبيت، مشاركة، إشعارات) */}
              <PWABar lang={lang} />

              {/* زر تغيير اللغة */}
              <button
                onClick={onToggleLang}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-700/60 transition-colors text-xs font-semibold cursor-pointer"
                title="Toggle Language / تغيير اللغة"
              >
                <Globe2 className="w-3.5 h-3.5 text-amber-400" />
                <span>{isAr ? 'English' : 'العربية'}</span>
              </button>

              {/* زر تسجيل */}
              <button
                onClick={() => setActiveModal('auth')}
                className={`rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black flex items-center gap-1.5 shadow-sm transition-all whitespace-nowrap cursor-pointer active:scale-95 ${
                  isAr 
                    ? 'px-3.5 py-1.5 text-xs' 
                    : 'px-2.5 py-1 text-[10.5px] font-bold'
                }`}
              >
                <User className={isAr ? "w-3.5 h-3.5" : "w-3 h-3"} />
                <span>{isAr ? 'تسجيل' : 'Sign In'}</span>
              </button>

              {/* زر غرفة الأخبار */}
              <button
                onClick={() => onSelectTab('editorial')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  currentTab === 'editorial'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                    : 'bg-slate-900 hover:bg-rose-950/20 text-slate-300 hover:text-rose-300 border border-slate-800'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-rose-400" />
                <span>{isAr ? 'غرفة الأخبار' : 'Newsroom'}</span>
                {pendingDraftsCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white font-mono">
                    {pendingDraftsCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* شريط القائمة تحته (Sub-Header Menu Bar): روابط القائمة بنفس التنسيق الأنيق */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-11 flex items-center justify-between text-xs">
            <nav className="flex items-center gap-1 lg:gap-1.5 overflow-x-auto no-scrollbar shrink min-w-0" aria-label="Desktop Navigation">
              {/* 1. الرئيسية */}
              <button
                onClick={() => onSelectTab('home')}
                className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap text-xs cursor-pointer ${
                  currentTab === 'home'
                    ? 'bg-amber-500/15 text-amber-400 font-bold border border-amber-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-850'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>{isAr ? 'الرئيسية' : 'Home'}</span>
              </button>

              {/* 2. كل التقارير */}
              <button
                onClick={() => onSelectTab('home')}
                className="px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-850 transition-colors flex items-center gap-1.5 whitespace-nowrap text-xs cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-amber-400/80" />
                <span>{isAr ? 'كل التقارير' : 'All Reports'}</span>
              </button>

              {/* 3. استقصاء وتقصي */}
              <button
                onClick={() => onSelectTab('home')}
                className="px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-850 transition-colors flex items-center gap-1.5 whitespace-nowrap text-xs cursor-pointer"
              >
                <Search className="w-3.5 h-3.5 text-amber-400/80" />
                <span>{isAr ? 'استقصاء وتقصي' : 'Investigations'}</span>
              </button>

              {/* 4. صحافة البيانات */}
              <button
                onClick={() => onSelectTab('data-journalism')}
                className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap text-xs cursor-pointer ${
                  currentTab === 'data-journalism'
                    ? 'bg-teal-500/15 text-teal-300 font-bold border border-teal-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-850'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 text-teal-400" />
                <span>{isAr ? 'صحافة البيانات' : 'Data Journalism'}</span>
              </button>

              {/* 5. البودكاست */}
              <button
                onClick={() => onSelectTab('podcast')}
                className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap text-xs cursor-pointer ${
                  currentTab === 'podcast'
                    ? 'bg-indigo-500/15 text-indigo-400 font-bold border border-indigo-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-850'
                }`}
              >
                <Mic className="w-3.5 h-3.5 text-indigo-400" />
                <span>{isAr ? 'البودكاست' : 'Podcasts'}</span>
              </button>

              {/* 6. التقارير المصورة */}
              <button
                onClick={() => onSelectTab('video')}
                className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap text-xs cursor-pointer ${
                  currentTab === 'video'
                    ? 'bg-rose-500/15 text-rose-400 font-bold border border-rose-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-850'
                }`}
              >
                <Video className="w-3.5 h-3.5 text-rose-400" />
                <span>{isAr ? 'التقارير المصورة' : 'Video Reports'}</span>
              </button>

              {/* 7. من نحن */}
              <button
                onClick={() => onSelectTab('about')}
                className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap text-xs cursor-pointer ${
                  currentTab === 'about'
                    ? 'bg-blue-500/15 text-blue-400 font-bold border border-blue-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-850'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                <span>{isAr ? 'من نحن' : 'About Us'}</span>
              </button>

              {/* 8. الشروط والخصوصية */}
              <button
                onClick={() => onSelectTab('privacy')}
                className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap text-xs cursor-pointer ${
                  currentTab === 'privacy'
                    ? 'bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-850'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isAr ? 'الشروط والخصوصية' : 'Terms & Privacy'}</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Pop-up Modals for Navigation (من نحن، الشروط، البودكاست، الفيديو، التسجيل) */}
      <NavigationModals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        lang={lang}
        onNavigateToNewsroom={() => onSelectTab('editorial')}
      />
    </>
  );
};
