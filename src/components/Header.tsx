'use client';
/* eslint-disable @next/next/no-img-element */
// src/components/Header.tsx
import React, { useState, useEffect } from 'react';
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
  Building2,
  Bell,
  Bookmark,
  Crown,
  Sparkles,
  UserPlus,
  Loader2
} from 'lucide-react';
import { NavigationModals, NavModalType } from './NavigationModals';
import { PWABar } from './pwa/PWABar';
import { PWAInstallButton } from './pwa/PWAInstallButton';
import { ShareButton } from './ShareButton';
import { GlobalSearch } from './GlobalSearch';
import { useAuth } from '../context/AuthContext';
import { Article, AfricanCountryProfile } from '../types';

export type HeaderTab = 
  | 'home' 
  | 'country' 
  | 'article' 
  | 'editorial' 
  | 'data-journalism' 
  | 'about' 
  | 'privacy' 
  | 'podcast' 
  | 'video'
  | 'profile'
  | 'notifications';

interface HeaderProps {
  currentTab: HeaderTab;
  onSelectTab: (tab: HeaderTab) => void;
  lang: 'ar' | 'en';
  onToggleLang: () => void;
  pendingDraftsCount: number;
  articles?: Article[];
  countries?: AfricanCountryProfile[];
  onSelectCountry?: (countrySlug: string) => void;
  onSelectSector?: (sectorId: string) => void;
  onSelectArticle?: (article: Article) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  lang,
  onToggleLang,
  pendingDraftsCount,
  articles = [],
  countries = [],
  onSelectCountry,
  onSelectSector,
  onSelectArticle
}) => {
  const isAr = lang === 'ar';
  const { user, profile, role, unreadCount } = useAuth();
  const isAuthenticated = Boolean(user || profile);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [activeModal, setActiveModal] = useState<NavModalType>(null);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false);

  const handleOpenAuthModal = (mode: 'signin' | 'signup' = 'signin') => {
    setIsAuthLoading(true);
    setAuthModalMode(mode);
    setTimeout(() => {
      setActiveModal('auth');
      setIsAuthLoading(false);
    }, 280);
  };

  // استماع لفتح نافذة تسجيل الدخول/إنشاء الحساب من أي مكان في التطبيق (مثل زر الحفظ)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleOpenAuth = (e: Event) => {
      const customEvent = e as CustomEvent<{ mode?: 'signin' | 'signup' }>;
      const mode = customEvent.detail?.mode === 'signup' ? 'signup' : 'signin';
      setAuthModalMode(mode);
      setActiveModal('auth');
    };
    window.addEventListener('open-auth-modal', handleOpenAuth);
    return () => window.removeEventListener('open-auth-modal', handleOpenAuth);
  }, []);

  // ميثاق أمني صارم: غرفة الأخبار تظهر فقط بعد تسجيل الدخول للأدمن، المشرفين، والمحررين
  // القراء لا تظهر لهم غرفة الأخبار إطلاقاً لا قبل التسجيل ولا بعد التسجيل
  const canAccessNewsroom = Boolean(
    user && 
    (role === 'ADMIN' || role === 'SUPERVISOR' || role === 'EDITOR' ||
     profile?.role === 'ADMIN' || profile?.role === 'SUPERVISOR' || profile?.role === 'EDITOR')
  );

  const handleNavClick = (action: () => void) => {
    action();
    setIsMobileMenuOpen(false);
  };

  const getRoleBadgeClasses = (userRole: string) => {
    switch (userRole) {
      case 'ADMIN':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'SUPERVISOR':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'EDITOR':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  return (
    <>
      <header className="w-full bg-[#070A12]/95 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-40">
        {/* =========================================================================
            1. MOBILE HEADER BAR (شريط الهاتف المخصص: متوازن ومرتب)
           ========================================================================= */}
        <div className="md:hidden px-3.5 py-2.5 flex items-center justify-between border-b border-slate-800/60">
          {/* الجانب الأيمن (في العربية): اللوغو والشعار */}
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

          {/* الجانب الأيسر: إشعارات + حساب / تسجيل + PWA + لغة + قائمة */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* أيقونة الإشعارات مع العداد بالهاتف (لا تظهر إلا بعد تسجيل الدخول) */}
            {isAuthenticated && (
              <button
                onClick={() => onSelectTab('notifications')}
                className={`relative p-1.5 rounded-lg border transition-colors flex items-center justify-center cursor-pointer ${
                  currentTab === 'notifications'
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                }`}
                title={isAr ? 'الإشعارات والتنبيهات' : 'Notifications'}
                aria-label="Notifications"
              >
                <Bell className="w-3.5 h-3.5 text-amber-400" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white font-mono text-[9px] font-bold flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
            )}

            {/* أدوات PWA: في الهاتف تظهر أيقونة التثبيت فقط دون العبارة النصية */}
            <PWABar lang={lang} iconOnly={true} />

            {/* محرك البحث الشامل للهاتف */}
            <GlobalSearch
              lang={lang}
              articles={articles}
              countries={countries}
              onSelectCountry={onSelectCountry}
              onSelectSector={onSelectSector}
              onSelectArticle={onSelectArticle}
              variant="mobile"
            />

            {/* زر الحساب أو التسجيل */}
            {profile ? (
              <button
                onClick={() => handleNavClick(() => onSelectTab('profile'))}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-300 font-bold text-xs cursor-pointer hover:bg-amber-500/25 transition-all shadow-sm"
                title={isAr ? 'صفحة حسابي والمقالات المحفوظة' : 'My Account'}
              >
                {profile.photoURL ? (
                  <img 
                    src={profile.photoURL} 
                    alt={profile.displayName} 
                    className="w-4 h-4 rounded-full object-cover border border-amber-500/40" 
                  />
                ) : (
                  <User className="w-3 h-3 text-amber-400" />
                )}
                <span className="text-[11px] font-black text-amber-300">
                  {isAr ? 'حسابي' : 'Account'}
                </span>
              </button>
            ) : (
              <button
                disabled={isAuthLoading}
                onClick={() => handleOpenAuthModal('signin')}
                className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 text-[10.5px] font-black shadow-sm transition-all active:scale-95 cursor-pointer flex items-center justify-center min-w-[62px] h-7 gap-1"
                title={isAr ? 'تسجيل' : 'Register / Sign In'}
              >
                {isAuthLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-950" />
                ) : (
                  <>
                    <UserPlus className="w-3 h-3 text-slate-950" />
                    <span>{isAr ? 'تسجيل' : 'Register'}</span>
                  </>
                )}
              </button>
            )}

            {/* أيقونة اللغة */}
            <button
              onClick={onToggleLang}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/60 transition-colors text-xs flex items-center justify-center cursor-pointer"
              title="تغيير اللغة / Toggle Language"
              aria-label="Language Toggle"
            >
              <Globe2 className="w-3.5 h-3.5 text-amber-400" />
            </button>

            {/* أيقونة القائمة Menu Burger الإبداعية */}
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
            {/* حقل البحث داخل القائمة المنسدلة للهاتف */}
            <div className="pb-1">
              <GlobalSearch
                lang={lang}
                articles={articles}
                countries={countries}
                onSelectCountry={(slug) => handleNavClick(() => onSelectCountry && onSelectCountry(slug))}
                onSelectSector={(sectorId) => handleNavClick(() => onSelectSector && onSelectSector(sectorId))}
                onSelectArticle={(article) => handleNavClick(() => onSelectArticle && onSelectArticle(article))}
                variant="desktop"
                className="w-full"
              />
            </div>

            {/* روابط القائمة المنسدلة بتصميم إبداعي وخط صغير ومنسق */}
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {/* 1. الرئيسية */}
              <button
                onClick={() => handleNavClick(() => onSelectTab('home'))}
                className={`p-2.5 rounded-xl text-right flex items-center gap-2 border transition-all cursor-pointer ${
                  currentTab === 'home'
                    ? 'bg-amber-500/15 text-amber-400 border-amber-500/30 font-bold'
                    : 'bg-slate-900/60 text-slate-300 border-slate-800/70 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">{isAr ? 'الرئيسية' : 'Home'}</span>
              </button>

              {/* 2. ملفات الدول */}
              <button
                onClick={() => handleNavClick(() => onSelectTab('country'))}
                className={`p-2.5 rounded-xl text-right flex items-center justify-between border transition-all cursor-pointer ${
                  currentTab === 'country'
                    ? 'bg-amber-500/15 text-amber-400 border-amber-500/30 font-bold'
                    : 'bg-slate-900/60 text-slate-300 border-slate-800/70 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Globe2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">{isAr ? 'ملفات الدول' : 'Countries'}</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
                  55
                </span>
              </button>

              {/* 3. صفحتي الشخصية */}
              <button
                onClick={() => handleNavClick(() => onSelectTab('profile'))}
                className={`p-2.5 rounded-xl text-right flex items-center justify-between border transition-all cursor-pointer ${
                  currentTab === 'profile'
                    ? 'bg-amber-500/15 text-amber-400 border-amber-500/30 font-bold'
                    : 'bg-slate-900/60 text-slate-300 border-slate-800/70 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <User className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">{isAr ? 'حسابي والملف' : 'My Profile'}</span>
                </div>
                {profile && (
                  <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">
                    {role}
                  </span>
                )}
              </button>

              {/* 4. الإشعارات والتنبيهات (خاصة بمن لديهم حساب فقط) */}
              {isAuthenticated && (
                <button
                  onClick={() => handleNavClick(() => onSelectTab('notifications'))}
                  className={`p-2.5 rounded-xl text-right flex items-center justify-between border transition-all cursor-pointer ${
                    currentTab === 'notifications'
                      ? 'bg-amber-500/15 text-amber-400 border-amber-500/30 font-bold'
                      : 'bg-slate-900/60 text-slate-300 border-slate-800/70 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Bell className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{isAr ? 'الإشعارات' : 'Notifications'}</span>
                  </div>
                  {unreadCount > 0 && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-mono font-bold">
                      {unreadCount}
                    </span>
                  )}
                </button>
              )}

              {/* 5. صحافة البيانات */}
              <button
                onClick={() => handleNavClick(() => onSelectTab('data-journalism'))}
                className={`p-2.5 rounded-xl text-right flex items-center gap-2 border transition-all cursor-pointer ${
                  currentTab === 'data-journalism'
                    ? 'bg-teal-500/15 text-teal-300 border-teal-500/30 font-bold'
                    : 'bg-slate-900/60 text-slate-300 border-slate-800/70 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span className="truncate">{isAr ? 'صحافة البيانات' : 'Data Journalism'}</span>
              </button>

              {/* 6. البودكاست */}
              <button
                onClick={() => handleNavClick(() => onSelectTab('podcast'))}
                className={`p-2.5 rounded-xl text-right flex items-center justify-between border transition-all cursor-pointer ${
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

              {/* 7. التقارير المصورة */}
              <button
                onClick={() => handleNavClick(() => onSelectTab('video'))}
                className={`p-2.5 rounded-xl text-right flex items-center justify-between border transition-all cursor-pointer ${
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
                  {isAr ? 'فيديو' : 'Video'}
                </span>
              </button>

              {/* 8. من نحن */}
              <button
                onClick={() => handleNavClick(() => onSelectTab('about'))}
                className={`p-2.5 rounded-xl text-right flex items-center gap-2 border transition-all cursor-pointer ${
                  currentTab === 'about'
                    ? 'bg-blue-500/15 text-blue-400 border-blue-500/30 font-bold'
                    : 'bg-slate-900/60 text-slate-300 border-slate-800/70 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="truncate">{isAr ? 'من نحن' : 'About Us'}</span>
              </button>

              {/* 9. الشروط والخصوصية */}
              <button
                onClick={() => handleNavClick(() => onSelectTab('privacy'))}
                className={`p-2.5 rounded-xl text-right flex items-center gap-2 border transition-all cursor-pointer ${
                  currentTab === 'privacy'
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 font-bold'
                    : 'bg-slate-900/60 text-slate-300 border-slate-800/70 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{isAr ? 'الشروط والخصوصية' : 'Terms & Privacy'}</span>
              </button>

              {/* 10. زر مشاركة المنصة */}
              <ShareButton lang={lang} variant="drawer-item" />
            </div>

            {/* زر الحساب، مع زر غرفة الأخبار حصرياً للأدمن والمشرفين والمحررين فقط بعد تسجيل الدخول */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2">
              {canAccessNewsroom && (
                <button
                  onClick={() => handleNavClick(() => onSelectTab('editorial'))}
                  className={`flex-1 p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
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
              )}

              <button
                disabled={isAuthLoading}
                onClick={() => {
                  if (profile) {
                    handleNavClick(() => setActiveModal('auth'));
                  } else {
                    handleNavClick(() => handleOpenAuthModal('signin'));
                  }
                }}
                className={`${canAccessNewsroom ? 'flex-1' : 'w-full'} p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 shadow-lg transition-all cursor-pointer h-10`}
              >
                {isAuthLoading && !profile ? (
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                ) : (
                  <>
                    <User className="w-4 h-4" />
                    <span>{profile ? (isAr ? 'تبديل الدور' : 'Switch Role') : (isAr ? 'تسجيل' : 'Register')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            3. DESKTOP HEADER (شاشة الحاسوب: شريطان أنيقان)
           ========================================================================= */}
        <div className="hidden md:block">
          {/* الشريط العلوي (Top Bar) */}
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

            {/* محرك البحث الشامل للدول والقطاعات والتقارير */}
            <div className="flex-1 max-w-xs lg:max-w-md mx-3 lg:mx-6">
              <GlobalSearch
                lang={lang}
                articles={articles}
                countries={countries}
                onSelectCountry={onSelectCountry}
                onSelectSector={onSelectSector}
                onSelectArticle={onSelectArticle}
                variant="desktop"
              />
            </div>

            {/* أدوات PWA + الإشعارات + الملف الشخصي / التسجيل + اللغة + غرفة الأخبار */}
            <div className="flex items-center gap-2 lg:gap-2.5 shrink-0">
              {/* أدوات PWA */}
              <PWABar lang={lang} />

              {/* زر الإشعارات والتنبيهات للحاسوب مع العداد (خاص بمن لديهم حساب فقط) */}
              {isAuthenticated && (
                <button
                  onClick={() => onSelectTab('notifications')}
                  className={`relative p-2 rounded-xl border transition-all flex items-center justify-center cursor-pointer group ${
                    currentTab === 'notifications'
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 shadow-md'
                      : 'bg-slate-900 hover:bg-slate-850 text-slate-300 border-slate-700/60'
                  }`}
                  title={isAr ? 'مركز الإشعارات والتنبيهات' : 'Notifications Center'}
                >
                  <Bell className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white font-mono text-[10px] font-bold flex items-center justify-center animate-pulse shadow-sm">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
              )}

              {/* زر تغيير اللغة */}
              <button
                onClick={onToggleLang}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-700/60 transition-colors text-xs font-semibold cursor-pointer"
                title="Toggle Language / تغيير اللغة"
              >
                <Globe2 className="w-3.5 h-3.5 text-amber-400" />
                <span>{isAr ? 'English' : 'العربية'}</span>
              </button>

              {/* الملف الشخصي أو زر تسجيل الدخول */}
              {profile ? (
                <button
                  onClick={() => onSelectTab('profile')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all cursor-pointer group shadow-sm ${
                    currentTab === 'profile'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-2 ring-amber-500/30'
                      : 'bg-slate-900/90 hover:bg-slate-800 border-amber-500/40 text-slate-200 hover:border-amber-400'
                  }`}
                  title={isAr ? 'الانتقال إلى صفحة حسابي والمقالات المحفوظة' : 'My Account & Saved Articles'}
                >
                  {profile.photoURL ? (
                    <img 
                      src={profile.photoURL} 
                      alt={profile.displayName} 
                      className="w-6 h-6 rounded-lg object-cover border border-amber-500/40" 
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs border border-amber-500/30">
                      {profile.displayName.charAt(0)}
                    </div>
                  )}
                  <span className="text-xs font-black text-amber-400 group-hover:text-amber-300 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isAr ? 'حسابي' : 'My Account'}</span>
                  </span>
                  <span className="text-xs font-medium text-slate-300 truncate max-w-[85px] group-hover:text-white">
                    ({profile.displayName.split(' ')[0]})
                  </span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-md font-mono font-bold border ${getRoleBadgeClasses(role)}`}>
                    {role}
                  </span>
                </button>
              ) : (
                <button
                  disabled={isAuthLoading}
                  onClick={() => handleOpenAuthModal('signin')}
                  className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-xs flex items-center justify-center min-w-[78px] h-8 gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
                  title={isAr ? 'تسجيل' : 'Register / Sign In'}
                >
                  {isAuthLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5 text-slate-950" />
                      <span>{isAr ? 'تسجيل' : 'Register'}</span>
                    </>
                  )}
                </button>
              )}

              {/* زر غرفة الأخبار - يظهر فقط بعد تسجيل الدخول للادمن، المشرفين، والمحررين */}
              {canAccessNewsroom && (
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
              )}
            </div>
          </div>

          {/* شريط القائمة تحته (Sub-Header Menu Bar) */}
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

              {/* 2. ملفات الدول */}
              <button
                onClick={() => onSelectTab('country')}
                className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap text-xs cursor-pointer ${
                  currentTab === 'country'
                    ? 'bg-amber-500/15 text-amber-400 font-bold border border-amber-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-850'
                }`}
              >
                <Globe2 className="w-3.5 h-3.5 text-amber-400" />
                <span>{isAr ? 'ملفات الدول (55)' : 'Countries (55)'}</span>
              </button>

              {/* 3. صفحتي الشخصية */}
              <button
                onClick={() => onSelectTab('profile')}
                className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap text-xs cursor-pointer ${
                  currentTab === 'profile'
                    ? 'bg-amber-500/15 text-amber-400 font-bold border border-amber-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-850'
                }`}
              >
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>{isAr ? 'حسابي والملف الشخصي' : 'My Profile'}</span>
              </button>

              {/* 4. الإشعارات (خاصة بمن لديهم حساب فقط) */}
              {isAuthenticated && (
                <button
                  onClick={() => onSelectTab('notifications')}
                  className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap text-xs cursor-pointer ${
                    currentTab === 'notifications'
                      ? 'bg-amber-500/15 text-amber-400 font-bold border border-amber-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-850'
                  }`}
                >
                  <Bell className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isAr ? 'الإشعارات' : 'Notifications'}</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white font-mono">
                      {unreadCount}
                    </span>
                  )}
                </button>
              )}

              {/* 5. صحافة البيانات */}
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

              {/* 6. البودكاست */}
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

              {/* 7. التقارير المصورة */}
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

              {/* 8. من نحن */}
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

              {/* 9. الشروط والخصوصية */}
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
        onClose={() => {
          setActiveModal(null);
          setIsAuthLoading(false);
        }}
        lang={lang}
        initialAuthMode={authModalMode}
        onNavigateToNewsroom={canAccessNewsroom ? () => onSelectTab('editorial') : undefined}
        onNavigateToProfile={() => onSelectTab('profile')}
        onBackToHome={() => onSelectTab('home')}
      />
    </>
  );
};
