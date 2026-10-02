// src/components/GlobalSearch.tsx
'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Search, 
  X, 
  Globe, 
  Layers, 
  FileText, 
  ArrowRight, 
  ArrowLeft,
  Tag,
  Mic,
  MicOff
} from 'lucide-react';
import { Article, AfricanCountryProfile } from '../types';
import { ALL_54_AFRICAN_COUNTRIES } from '../data/africanCountries';
import { ECONOMIC_SECTORS } from '../data/reportOptions';
import { getCountryFlag } from '../lib/africanGeoProximity';

interface SearchCountryItem {
  code: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  currency: string;
  capital: string;
  flag: string;
}

interface GlobalSearchProps {
  lang: 'ar' | 'en';
  articles?: Article[];
  countries?: AfricanCountryProfile[];
  onSelectCountry?: (countrySlug: string) => void;
  onSelectSector?: (sectorId: string) => void;
  onSelectArticle?: (article: Article) => void;
  variant?: 'desktop' | 'mobile';
  className?: string;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({
  lang,
  articles = [],
  countries = [],
  onSelectCountry,
  onSelectSector,
  onSelectArticle,
  variant = 'desktop',
  className = ''
}) => {
  const isAr = lang === 'ar';
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // تشغيل أو إيقاف ميزة البحث الصوتي (Speech-to-Text)
  const toggleVoiceSearch = () => {
    if (typeof window === 'undefined') return;

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError(isAr ? 'البحث الصوتي غير مدعوم في هذا المتصفح' : 'Voice search is not supported in this browser');
      setTimeout(() => setVoiceError(null), 3500);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = isAr ? 'ar-SA' : 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceError(null);
        setIsOpen(true);
      };

      recognition.onresult = (event: any) => {
        if (event.results && event.results[0] && event.results[0][0]) {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setQuery(transcript.trim());
            setIsOpen(true);
          }
        }
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setVoiceError(isAr ? 'يرجى السماح بالوصول إلى الميكروفون' : 'Please allow microphone access');
        } else if (event.error !== 'no-speech') {
          setVoiceError(isAr ? 'تعذر التعرف على الصوت، حاول مجدداً' : 'Could not recognize speech, try again');
        }
        setIsListening(false);
        setTimeout(() => setVoiceError(null), 3500);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err: any) {
      console.warn('Failed to start speech recognition:', err);
      setIsListening(false);
      setVoiceError(isAr ? 'حدث خطأ أثناء تشغيل الميكروفون' : 'Error starting microphone');
      setTimeout(() => setVoiceError(null), 3500);
    }
  };

  // إيقاف التعرف الصوتي عند إزالة المكون
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // استخدام قائمة الدول الممررة أو القائمة الشاملة لـ 54 دولة
  const effectiveCountries = useMemo<SearchCountryItem[]>(() => {
    const list = countries && countries.length > 0 ? countries : ALL_54_AFRICAN_COUNTRIES;
    return list.map(c => ({
      code: c.code,
      slug: c.slug,
      nameAr: c.nameAr,
      nameEn: c.nameEn,
      currency: c.currencySymbol || c.currency,
      capital: c.capital || '',
      flag: getCountryFlag(c.code)
    }));
  }, [countries]);

  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        if (variant === 'mobile') {
          setIsMobileExpanded(false);
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // اختصار Ctrl+K أو Cmd+K للتركيز على البحث
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (variant === 'mobile') {
          setIsMobileExpanded(true);
        }
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
        if (variant === 'mobile') {
          setIsMobileExpanded(false);
        }
        inputRef.current?.blur();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [variant]);

  // تصفية النتائج الذكية بحسب استعلام البحث بمجرد بدأ الكتابة
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return {
        matchedCountries: [],
        matchedSectors: [],
        matchedArticles: [],
        totalCount: 0
      };
    }

    // 1. مطابقة الدول (الاسم بالعربية، الإنجليزية، الرمز، العملة، العاصمة)
    const matchedCountries = effectiveCountries
      .filter(c => 
        c.nameAr.toLowerCase().includes(q) ||
        c.nameEn.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.currency.toLowerCase().includes(q) ||
        (c.capital && c.capital.toLowerCase().includes(q))
      )
      .slice(0, 4);

    // 2. مطابقة القطاعات الاقتصادية (الاسم بالعربية، الإنجليزية، المجموعة)
    const matchedSectors = ECONOMIC_SECTORS
      .filter(s => 
        s.nameAr.toLowerCase().includes(q) ||
        s.nameEn.toLowerCase().includes(q) ||
        s.groupNameAr.toLowerCase().includes(q) ||
        s.groupNameEn.toLowerCase().includes(q)
      )
      .slice(0, 4);

    // 3. مطابقة المقالات والتقارير (العنوان بالعربية والإنجليزية، والملخص، والدولة)
    const matchedArticles = articles
      .filter(a => 
        (a.title && a.title.toLowerCase().includes(q)) ||
        (a.titleEn && a.titleEn.toLowerCase().includes(q)) ||
        (a.summary && a.summary.toLowerCase().includes(q)) ||
        (a.countryName && a.countryName.toLowerCase().includes(q)) ||
        (a.countryNameEn && a.countryNameEn.toLowerCase().includes(q)) ||
        (a.sector && a.sector.toLowerCase().includes(q))
      )
      .slice(0, 5);

    const totalCount = matchedCountries.length + matchedSectors.length + matchedArticles.length;

    return {
      matchedCountries,
      matchedSectors,
      matchedArticles,
      totalCount
    };
  }, [query, effectiveCountries, articles]);

  const handleCountryClick = (slug: string) => {
    if (onSelectCountry) {
      onSelectCountry(slug);
    }
    setIsOpen(false);
    setIsMobileExpanded(false);
    setQuery('');
  };

  const handleSectorClick = (sectorId: string) => {
    if (onSelectSector) {
      onSelectSector(sectorId);
    }
    setIsOpen(false);
    setIsMobileExpanded(false);
    setQuery('');
  };

  const handleArticleClick = (article: Article) => {
    if (onSelectArticle) {
      onSelectArticle(article);
    }
    setIsOpen(false);
    setIsMobileExpanded(false);
    setQuery('');
  };

  const clearQuery = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  // يظهر دروب داون النتائج فقط بمجرد بدأ الكتابة أو أثناء الاستماع الصوتي
  const shouldShowDropdown = isOpen && (query.trim().length > 0 || isListening);

  // مكون قائمة نتائج البحث المشتركة
  const renderResultsDropdown = () => (
    <div className="max-h-[75vh] overflow-y-auto rounded-2xl bg-[#0B101D] border border-amber-500/30 shadow-2xl p-3 space-y-3.5 animate-in fade-in zoom-in-95 duration-150">
      {/* بطاقة تفاعلية مميزة أثناء الاستماع الصوتي */}
      {isListening && (
        <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 flex items-center justify-between text-xs text-rose-200 animate-in fade-in duration-150">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping shrink-0"></span>
            <span className="font-bold truncate">
              {isAr ? 'جاري الاستماع... تحدث باسم دولة، قطاع، أو موضوع' : 'Listening... Say a country, sector, or topic'}
            </span>
          </div>
          <button
            type="button"
            onClick={toggleVoiceSearch}
            className="text-[10px] px-2 py-0.5 rounded bg-rose-500/30 text-white font-mono hover:bg-rose-500/50 cursor-pointer shrink-0 ms-2"
          >
            {isAr ? 'إيقاف' : 'Stop'}
          </button>
        </div>
      )}

      {/* حالة عدم وجود أي نتائج */}
      {query.trim() && searchResults.totalCount === 0 && !isListening && (
        <div className="py-6 px-3 text-center space-y-2">
          <p className="text-xs text-slate-300">
            {isAr ? 'لم يتم العثور على نتائج تطابق: ' : 'No results found matching: '}
            <span className="text-amber-400 font-bold">&ldquo;{query}&rdquo;</span>
          </p>
          <p className="text-[11px] text-slate-500">
            {isAr 
              ? 'جرب البحث باسم دولة (مثل: مصر، كينيا)، أو قطاع (مثل: طاقة، بنوك)، أو عنوان تقرير.' 
              : 'Try searching by country name, economic sector, or report headline.'}
          </p>
        </div>
      )}

      {/* 1. قسم الدول الأفريقية المطابقة */}
      {searchResults.matchedCountries.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold px-1">
            <span className="flex items-center gap-1 text-emerald-400">
              <Globe className="w-3 h-3" />
              <span>{isAr ? 'الدول الأفريقية' : 'African Countries'}</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              {searchResults.matchedCountries.length}
            </span>
          </div>
          <div className="space-y-1">
            {searchResults.matchedCountries.map((c) => (
              <button
                key={c.slug}
                type="button"
                onClick={() => handleCountryClick(c.slug)}
                className="w-full p-2 rounded-xl bg-slate-900/60 hover:bg-emerald-500/15 border border-slate-800/80 hover:border-emerald-500/40 text-right rtl:text-right ltr:text-left transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className="text-base shrink-0">{c.flag}</span>
                  <div className="truncate">
                    <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {isAr ? c.nameAr : c.nameEn}
                    </span>
                    <span className="text-[10px] text-slate-400 ms-1.5 font-sans">
                      ({isAr ? c.nameEn : c.nameAr})
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 group-hover:text-white">
                    {c.currency}
                  </span>
                  {isAr ? <ArrowLeft className="w-3 h-3 text-slate-500 group-hover:text-emerald-400 transition-colors" /> : <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-emerald-400 transition-colors" />}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 2. قسم القطاعات الاقتصادية المطابقة */}
      {searchResults.matchedSectors.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold px-1">
            <span className="flex items-center gap-1 text-teal-400">
              <Layers className="w-3 h-3" />
              <span>{isAr ? 'القطاعات الاقتصادية' : 'Economic Sectors'}</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              {searchResults.matchedSectors.length}
            </span>
          </div>
          <div className="space-y-1">
            {searchResults.matchedSectors.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => handleSectorClick(s.id)}
                className="w-full p-2 rounded-xl bg-slate-900/60 hover:bg-teal-500/15 border border-slate-800/80 hover:border-teal-500/40 text-right rtl:text-right ltr:text-left transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0">
                    <Tag className="w-3 h-3" />
                  </span>
                  <div className="truncate">
                    <span className="text-xs font-bold text-white group-hover:text-teal-300 transition-colors">
                      {isAr ? s.nameAr : s.nameEn}
                    </span>
                    <span className="text-[10px] text-slate-400 ms-1.5">
                      • {isAr ? s.groupNameAr : s.groupNameEn}
                    </span>
                  </div>
                </div>
                {isAr ? <ArrowLeft className="w-3 h-3 text-slate-500 group-hover:text-teal-400 transition-colors shrink-0" /> : <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-teal-400 transition-colors shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. قسم المقالات والتقارير المطابقة */}
      {searchResults.matchedArticles.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold px-1">
            <span className="flex items-center gap-1 text-amber-400">
              <FileText className="w-3 h-3" />
              <span>{isAr ? 'عناوين التقارير والتحليلات' : 'Articles & Reports'}</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              {searchResults.matchedArticles.length}
            </span>
          </div>
          <div className="space-y-1">
            {searchResults.matchedArticles.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => handleArticleClick(a)}
                className="w-full p-2.5 rounded-xl bg-slate-900/60 hover:bg-amber-500/15 border border-slate-800/80 hover:border-amber-500/40 text-right rtl:text-right ltr:text-left transition-all cursor-pointer flex flex-col gap-1 group"
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400 w-full">
                  <div className="flex items-center gap-1.5 truncate">
                    {a.countryName && (
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 font-bold text-amber-400">
                        {isAr ? a.countryName : (a.countryNameEn || a.countryName)}
                      </span>
                    )}
                    {a.sector && (
                      <span className="text-slate-400 truncate">
                        {a.sector}
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] text-slate-500 shrink-0 font-mono">
                    {a.publishedAt?.split(' ')[0] || a.createdAt?.split(' ')[0] || ''}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-200 group-hover:text-amber-300 transition-colors line-clamp-1 leading-snug">
                  {isAr ? a.title : (a.titleEn || a.title)}
                </h4>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* التذييل الإرشادي */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 px-1">
        <span>{isAr ? 'اضغط ESC للإغلاق' : 'Press ESC to close'}</span>
        <span className="text-amber-500/80 font-medium">
          {isAr ? 'لافريكونوميست · محرك البحث الاقتصادي' : 'L’Africonomist · Macro Search'}
        </span>
      </div>
    </div>
  );

  // =========================================================================
  // 1. شاشة الهاتف (Mobile View)
  // =========================================================================
  if (variant === 'mobile') {
    // الزر المصغر في الهيدر عندما لا يكون البحث مفتوحاً
    if (!isMobileExpanded) {
      return (
        <button
          type="button"
          onClick={() => {
            setIsMobileExpanded(true);
            setIsOpen(true);
            setTimeout(() => inputRef.current?.focus(), 80);
          }}
          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/60 transition-colors text-xs flex items-center justify-center cursor-pointer"
          title={isAr ? 'البحث الشامل في المنصة (دول، قطاعات، تقارير)' : 'Global Search (Countries, Sectors, Articles)'}
          aria-label="Search"
        >
          <Search className="w-3.5 h-3.5 text-amber-400" />
        </button>
      );
    }

    // وضع الهاتف الموسع: شريط بحث مخصص في أعلى الشاشة مباشرة مع ظهور النتائج فور بدأ الكتابة
    return (
      <>
        {/* خلفية معتمة تضمن تركيز المستخدم وتغلق البحث عند النقر عليها */}
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 animate-in fade-in duration-150"
          onClick={() => {
            if (isListening) toggleVoiceSearch();
            setIsMobileExpanded(false);
            setIsOpen(false);
            setQuery('');
          }}
        />

        {/* شريط البحث العلوي المثبت في قمة الشاشة للهاتف */}
        <div 
          ref={containerRef}
          className="fixed top-0 inset-x-0 z-50 bg-[#070A12]/98 backdrop-blur-2xl border-b border-amber-500/40 shadow-2xl p-3 animate-in slide-in-from-top-3 duration-200"
        >
          <div className="max-w-xl mx-auto flex items-center gap-2">
            <div className="relative flex-1 flex items-center">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-slate-400">
                <Search className="w-4 h-4 text-amber-400" />
              </div>

              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
                placeholder={
                  isListening
                    ? (isAr ? '🎙️ جاري الاستماع... تحدث الآن' : '🎙️ Listening... Speak now')
                    : (isAr ? 'ابحث في 54 دولة، قطاعات، أو عناوين...' : 'Search 54 countries, sectors, or articles...')
                }
                className={`w-full py-2 ps-9 pe-16 rounded-xl transition-all text-xs shadow-inner focus:outline-none ${
                  isListening
                    ? 'bg-rose-950/30 border border-rose-500/80 text-white placeholder-rose-300 ring-2 ring-rose-500/40 animate-pulse'
                    : 'bg-slate-900/90 hover:bg-slate-900 focus:bg-[#060A14] border border-slate-700/70 focus:border-amber-500/60 text-white placeholder-slate-400 focus:ring-1 focus:ring-amber-500/40'
                }`}
              />

              <div className="absolute inset-y-0 end-0 flex items-center pe-1.5 gap-1">
                {/* زر الميكروفون للبحث الصوتي */}
                <button
                  type="button"
                  onClick={toggleVoiceSearch}
                  className={`p-1.5 rounded-lg transition-all flex items-center justify-center cursor-pointer ${
                    isListening
                      ? 'bg-rose-500 text-white shadow-lg ring-2 ring-rose-400/50 animate-pulse'
                      : 'text-slate-400 hover:text-amber-400 hover:bg-slate-800/80'
                  }`}
                  title={isListening ? (isAr ? 'جاري الاستماع...' : 'Listening...') : (isAr ? 'البحث الصوتي' : 'Voice search')}
                  aria-label="Voice Search"
                >
                  {isListening ? (
                    <Mic className="w-3.5 h-3.5 text-white animate-bounce" />
                  ) : (
                    <Mic className="w-3.5 h-3.5" />
                  )}
                </button>

                {query && (
                  <button
                    type="button"
                    onClick={clearQuery}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    title={isAr ? 'مسح' : 'Clear'}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* زر إلغاء للعودة الفورية */}
            <button
              type="button"
              onClick={() => {
                if (isListening) toggleVoiceSearch();
                setIsMobileExpanded(false);
                setIsOpen(false);
                setQuery('');
              }}
              className="px-3 py-2 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-700/60 text-xs font-bold shrink-0 transition-colors cursor-pointer active:scale-95"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
          </div>

          {/* رسالة الخطأ الصوتي المنبثقة إن وجدت */}
          {voiceError && (
            <div className="mt-2 mx-auto max-w-xl px-3 py-1.5 rounded-xl bg-rose-600 text-white text-[11px] font-bold shadow-2xl flex items-center gap-1.5 animate-in fade-in duration-150">
              <MicOff className="w-3 h-3 shrink-0" />
              <span>{voiceError}</span>
            </div>
          )}

          {/* ظهور نتائج البحث لمجرد بدأ الكتابة في دروب داون أنيق أسفل شريط البحث مباشرة */}
          {shouldShowDropdown && (
            <div className="mt-3 max-w-xl mx-auto">
              {renderResultsDropdown()}
            </div>
          )}
        </div>
      </>
    );
  }

  // =========================================================================
  // 2. شاشة الحاسوب (Desktop View & In-Drawer)
  // =========================================================================
  return (
    <div 
      ref={containerRef} 
      className={`relative ${className || 'w-56 lg:w-72'}`}
    >
      {/* حقل الإدخال الرئيسي */}
      <div className="relative flex items-center">
        <div className="absolute inset-y-0 start-0 flex items-center ps-2.5 pointer-events-none text-slate-400">
          <Search className="w-3.5 h-3.5 text-amber-400/90" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={
            isListening
              ? (isAr ? '🎙️ جاري الاستماع... تحدث الآن' : '🎙️ Listening... Speak now')
              : (isAr ? 'ابحث في 54 دولة، قطاعات، أو عناوين...' : 'Search 54 countries, sectors, or articles...')
          }
          className={`w-full py-1.5 ps-8 pe-20 sm:pe-24 rounded-xl transition-all text-xs shadow-inner focus:outline-none ${
            isListening
              ? 'bg-rose-950/30 border border-rose-500/80 text-white placeholder-rose-300 ring-2 ring-rose-500/40 animate-pulse'
              : 'bg-slate-900/90 hover:bg-slate-900 focus:bg-[#060A14] border border-slate-700/70 focus:border-amber-500/60 text-white placeholder-slate-400 focus:ring-1 focus:ring-amber-500/40'
          }`}
        />

        {/* أزرار الإجراءات داخل الحقل: البحث الصوتي بالميكروفون + مسح النص + اختصار لوحة المفاتيح */}
        <div className="absolute inset-y-0 end-0 flex items-center pe-1.5 gap-1">
          {/* زر الميكروفون للبحث الصوتي */}
          <button
            type="button"
            onClick={toggleVoiceSearch}
            className={`p-1 rounded-md transition-all flex items-center justify-center cursor-pointer ${
              isListening
                ? 'bg-rose-500 text-white shadow-lg ring-2 ring-rose-400/50 animate-pulse'
                : 'text-slate-400 hover:text-amber-400 hover:bg-slate-800/80'
            }`}
            title={
              isListening
                ? (isAr ? 'جاري الاستماع... اضغط للإيقاف' : 'Listening... Click to stop')
                : (isAr ? 'البحث الصوتي (تحدث للبحث عن دولة أو موضوع)' : 'Voice search (Click and speak)')
            }
            aria-label="Voice Search"
          >
            {isListening ? (
              <Mic className="w-3.5 h-3.5 text-white animate-bounce" />
            ) : (
              <Mic className="w-3.5 h-3.5" />
            )}
          </button>

          {query ? (
            <button
              type="button"
              onClick={clearQuery}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title={isAr ? 'مسح' : 'Clear'}
            >
              <X className="w-3 h-3" />
            </button>
          ) : (
            <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-mono font-semibold text-slate-500 bg-slate-800/80 border border-slate-700/60 rounded">
              <span>⌘K</span>
            </kbd>
          )}
        </div>
      </div>

      {/* رسالة الخطأ الصوتي المنبثقة إن وجدت */}
      {voiceError && (
        <div className="absolute top-full mt-1.5 start-0 z-50 px-3 py-1.5 rounded-xl bg-rose-600 text-white text-[11px] font-bold shadow-2xl flex items-center gap-1.5 animate-in fade-in duration-150">
          <MicOff className="w-3 h-3 shrink-0" />
          <span>{voiceError}</span>
        </div>
      )}

      {/* ظهور النتائج السريعة لمجرد بدأ الكتابة أو أثناء الاستماع الصوتي */}
      {shouldShowDropdown && (
        <div className="absolute top-full mt-2 z-50 start-0 w-[340px] sm:w-[420px]">
          {renderResultsDropdown()}
        </div>
      )}
    </div>
  );
};
