'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { AfricanCountryProfile } from '../types';
import { 
  ECONOMIC_SECTORS, 
  JOURNALISTIC_GENRES, 
  EconomicSectorOption, 
  JournalisticGenreOption 
} from '../data/reportOptions';
import { 
  detectUserAfricanCountry, 
  getProximitySortedCountries, 
  getCountryFlag,
  AFRICAN_GEO_DATA
} from '../lib/africanGeoProximity';
import { 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Globe2, 
  Layers, 
  FileText, 
  X, 
  Check,
  Sparkles,
  RotateCcw
} from 'lucide-react';

interface CompactNavigationRibbonsProps {
  countries: AfricanCountryProfile[];
  selectedCountrySlug: string;
  onSelectCountry: (slug: string) => void;
  selectedSectorId: string;
  onSelectSector: (sectorId: string) => void;
  selectedGenreId: string;
  onSelectGenre: (genreId: string) => void;
  lang: 'ar' | 'en';
}

export const CompactNavigationRibbons: React.FC<CompactNavigationRibbonsProps> = ({
  countries,
  selectedCountrySlug,
  onSelectCountry,
  selectedSectorId,
  onSelectSector,
  selectedGenreId,
  onSelectGenre,
  lang,
}) => {
  const isAr = lang === 'ar';
  const countriesScrollRef = useRef<HTMLDivElement>(null);
  const sectorsScrollRef = useRef<HTMLDivElement>(null);
  const genresScrollRef = useRef<HTMLDivElement>(null);

  // كشف دولة المستخدم (الافتراضي DZ لضمان عدم تعارض الـ Hydration حتى يكتمل التركيب)
  const [userCountryCode, setUserCountryCode] = useState<string | null>('DZ');
  const [isLocationSelectorOpen, setIsLocationSelectorOpen] = useState(false);

  useEffect(() => {
    const detected = detectUserAfricanCountry();
    setUserCountryCode(detected);
  }, []);

  const handleManualLocationChange = (code: string | null) => {
    setUserCountryCode(code);
    try {
      if (code) {
        localStorage.setItem('africonomist_detected_country', code);
      } else {
        localStorage.setItem('africonomist_detected_country', 'INTERNATIONAL');
      }
    } catch {
      // Ignored
    }
    setIsLocationSelectorOpen(false);
  };

  // ترتيب الدول بالأقرب فالأقرب وفق دولة المستخدم
  const proximitySortedCountries = useMemo(() => {
    return getProximitySortedCountries(countries, userCountryCode);
  }, [countries, userCountryCode]);

  const selectedCountry = useMemo(() => {
    return countries.find(c => c.slug === selectedCountrySlug);
  }, [countries, selectedCountrySlug]);

  const selectedSector = useMemo(() => {
    return ECONOMIC_SECTORS.find(s => s.id === selectedSectorId);
  }, [selectedSectorId]);

  const selectedGenre = useMemo(() => {
    return JOURNALISTIC_GENRES.find(g => g.id === selectedGenreId);
  }, [selectedGenreId]);

  const scrollRibbon = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (!ref.current) return;
    const amount = 240;
    ref.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth'
    });
  };

  const detectedCountryName = useMemo(() => {
    if (!userCountryCode) return isAr ? 'دولي (خارج أفريقيا)' : 'International (Global)';
    const found = countries.find(c => c.code === userCountryCode);
    return found ? (isAr ? found.nameAr : found.nameEn) : userCountryCode;
  }, [userCountryCode, countries, isAr]);

  return (
    <div className="w-full bg-[#070b14]/98 border-b border-slate-800/90 shadow-md transition-all">
      {/* =========================================================================
          الشريط 1: شريط الدول الأفريقية (Country Ribbon) - متجاوب وستيكي ومدمج
         ========================================================================= */}
      <div className="flex items-center px-2 sm:px-4 py-1 border-b border-slate-800/60 bg-[#090e1b]/80 gap-1.5 sm:gap-2">
        {/* زر التصفية العامة: كافة الدول */}
        <button
          onClick={() => {
            onSelectCountry('');
            onSelectSector('all');
            onSelectGenre('all');
          }}
          className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded text-[11px] sm:text-xs font-semibold transition-all select-none ${
            !selectedCountrySlug || selectedCountrySlug === 'all'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
              : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800'
          }`}
          title={isAr ? 'عرض كافة المقالات والتقارير' : 'View all articles'}
        >
          <Globe2 className="w-3 h-3 text-amber-400" />
          <span>{isAr ? 'الكل' : 'All'}</span>
        </button>

        {/* سهم تمرير يسار على الحاسوب */}
        <button
          onClick={() => scrollRibbon(countriesScrollRef, isAr ? 'right' : 'left')}
          className="hidden sm:flex items-center justify-center p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors shrink-0"
          aria-label="Scroll countries backwards"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        {/* الحاوية القابلة للسحب الأفقي لجميع الدول الـ 54 */}
        <div
          ref={countriesScrollRef}
          className="flex-1 flex items-center gap-1.5 overflow-x-auto py-0.5 scroll-smooth scrollbar-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {proximitySortedCountries.map((country, index) => {
            const isSelected = selectedCountrySlug === country.slug;
            const flag = getCountryFlag(country.code);
            const isUserOwnCountry = userCountryCode === country.code;

            return (
              <button
                key={country.code}
                onClick={() => {
                  if (isSelected) {
                    onSelectCountry('');
                  } else {
                    onSelectCountry(country.slug);
                  }
                }}
                className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium transition-all select-none ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-md shadow-amber-500/20 ring-1 ring-amber-400'
                    : isUserOwnCountry
                      ? 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 font-semibold'
                      : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800/80 hover:text-white'
                }`}
                title={`${isAr ? country.nameAr : country.nameEn} (المرتبة #${country.rank})`}
              >
                <span className="text-xs leading-none">{flag}</span>
                <span className="truncate max-w-[90px] sm:max-w-[120px]">
                  {isAr ? country.nameAr : country.nameEn}
                </span>
                {isUserOwnCountry && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" title={isAr ? 'دولتك الحالية' : 'Your Location'} />
                )}
              </button>
            );
          })}
        </div>

        {/* سهم تمرير يمين على الحاسوب */}
        <button
          onClick={() => scrollRibbon(countriesScrollRef, isAr ? 'left' : 'right')}
          className="hidden sm:flex items-center justify-center p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors shrink-0"
          aria-label="Scroll countries forward"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {/* مؤشر الدولة المكتشفة الجغرافي */}
        <div className="relative shrink-0">
          <button
            onClick={() => setIsLocationSelectorOpen(prev => !prev)}
            className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors font-mono"
            title={isAr ? 'تغيير أو محاكاة موقع الدولة للتصفح' : 'Change or simulate location'}
          >
            <MapPin className="w-2.5 h-2.5 text-amber-400" />
            <span className="hidden md:inline max-w-[80px] truncate">{detectedCountryName}</span>
          </button>

          {/* القائمة المنبثقة لاختيار موقع المستخدم */}
          {isLocationSelectorOpen && (
            <div className="absolute right-0 rtl:right-auto rtl:left-0 top-full mt-1.5 w-64 bg-[#0d1322] border border-slate-700 rounded-xl shadow-2xl z-50 p-2 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-1 px-1">
                <span className="font-bold text-white text-[11px]">
                  {isAr ? 'موقعك لترتيب دول الجوار' : 'Location for Neighbor Sorting'}
                </span>
                <button 
                  onClick={() => setIsLocationSelectorOpen(false)}
                  className="text-slate-400 hover:text-white p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>

              <div className="max-h-48 overflow-y-auto space-y-1 py-1">
                <button
                  onClick={() => handleManualLocationChange('DZ')}
                  className={`w-full text-right rtl:text-right ltr:text-left px-2 py-1.5 rounded flex items-center justify-between ${
                    userCountryCode === 'DZ' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>🇩🇿 الجزائر (دول الجوار: تونس، مالي...)</span>
                  {userCountryCode === 'DZ' && <Check className="w-3 h-3 text-amber-400" />}
                </button>
                <button
                  onClick={() => handleManualLocationChange('EG')}
                  className={`w-full text-right rtl:text-right ltr:text-left px-2 py-1.5 rounded flex items-center justify-between ${
                    userCountryCode === 'EG' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>🇪🇬 مصر (دول الجوار: ليبيا، السودان...)</span>
                  {userCountryCode === 'EG' && <Check className="w-3 h-3 text-amber-400" />}
                </button>
                <button
                  onClick={() => handleManualLocationChange('NG')}
                  className={`w-full text-right rtl:text-right ltr:text-left px-2 py-1.5 rounded flex items-center justify-between ${
                    userCountryCode === 'NG' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>🇳🇬 نيجيريا (دول الجوار: النيجر، بنين...)</span>
                  {userCountryCode === 'NG' && <Check className="w-3 h-3 text-amber-400" />}
                </button>
                <button
                  onClick={() => handleManualLocationChange('ZA')}
                  className={`w-full text-right rtl:text-right ltr:text-left px-2 py-1.5 rounded flex items-center justify-between ${
                    userCountryCode === 'ZA' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>🇿🇦 جنوب أفريقيا (دول الجوار: ناميبيا...)</span>
                  {userCountryCode === 'ZA' && <Check className="w-3 h-3 text-amber-400" />}
                </button>
                <button
                  onClick={() => handleManualLocationChange(null)}
                  className={`w-full text-right rtl:text-right ltr:text-left px-2 py-1.5 rounded flex items-center justify-between ${
                    userCountryCode === null ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>🌍 خارج أفريقيا (ترتيب حسب تعداد السكان)</span>
                  {userCountryCode === null && <Check className="w-3 h-3 text-amber-400" />}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          الشريط 2: شريط قطاع النشاط (Economic Sectors Ribbon) - يظهر فور اختيار دولة
         ========================================================================= */}
      {selectedCountry && (
        <div className="flex items-center px-2 sm:px-4 py-1 border-b border-slate-800/50 bg-[#060a14]/95 gap-1.5 sm:gap-2 animate-fadeIn">
          {/* عنوان / شارة القطاع */}
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold shrink-0 border border-emerald-500/20">
            <Layers className="w-2.5 h-2.5" />
            <span className="hidden sm:inline">{isAr ? 'قطاع النشاط:' : 'Sector:'}</span>
          </div>

          {/* زر كافة القطاعات */}
          <button
            onClick={() => {
              onSelectSector('all');
              onSelectGenre('all');
            }}
            className={`flex-shrink-0 px-2 py-0.5 rounded text-[10.5px] font-medium transition-all select-none ${
              !selectedSectorId || selectedSectorId === 'all'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800/80'
            }`}
          >
            {isAr ? 'كافة القطاعات' : 'All Sectors'}
          </button>

          {/* سهم تمرير يسار */}
          <button
            onClick={() => scrollRibbon(sectorsScrollRef, isAr ? 'right' : 'left')}
            className="hidden sm:flex items-center justify-center p-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800 shrink-0"
            aria-label="Scroll sectors backwards"
          >
            <ChevronRight className="w-3 h-3" />
          </button>

          {/* الحاوية القابلة للسحب الأفقي للقطاعات الاقتصادية */}
          <div
            ref={sectorsScrollRef}
            className="flex-1 flex items-center gap-1.5 overflow-x-auto py-0.5 scroll-smooth scrollbar-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {ECONOMIC_SECTORS.map((sector) => {
              const isSelected = selectedSectorId === sector.id;

              return (
                <button
                  key={sector.id}
                  onClick={() => {
                    if (isSelected) {
                      onSelectSector('all');
                      onSelectGenre('all');
                    } else {
                      onSelectSector(sector.id);
                    }
                  }}
                  className={`flex-shrink-0 px-2 py-0.5 rounded text-[10.5px] font-medium transition-all select-none ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm ring-1 ring-emerald-400'
                      : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800/80 hover:text-white'
                  }`}
                >
                  {isAr ? sector.nameAr : sector.nameEn}
                </button>
              );
            })}
          </div>

          {/* سهم تمرير يمين */}
          <button
            onClick={() => scrollRibbon(sectorsScrollRef, isAr ? 'left' : 'right')}
            className="hidden sm:flex items-center justify-center p-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800 shrink-0"
            aria-label="Scroll sectors forward"
          >
            <ChevronLeft className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* =========================================================================
          الشريط 3: شريط الأنواع الصحفية (Journalistic Genres Ribbon) - يظهر عند الضغط على أي قطاع
         ========================================================================= */}
      {selectedCountry && selectedSectorId && selectedSectorId !== 'all' && (
        <div className="flex items-center px-2 sm:px-4 py-1 bg-[#050711] gap-1.5 sm:gap-2 animate-fadeIn">
          {/* عنوان / شارة النوع الصحفي */}
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 text-[10px] font-mono font-bold shrink-0 border border-purple-500/20">
            <FileText className="w-2.5 h-2.5" />
            <span className="hidden sm:inline">{isAr ? 'النوع الصحفي:' : 'Genre:'}</span>
          </div>

          {/* زر كافة الأنواع */}
          <button
            onClick={() => onSelectGenre('all')}
            className={`flex-shrink-0 px-2 py-0.5 rounded text-[10.5px] font-medium transition-all select-none ${
              !selectedGenreId || selectedGenreId === 'all'
                ? 'bg-purple-500 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800/80'
            }`}
          >
            {isAr ? 'كافة الأنواع' : 'All Genres'}
          </button>

          {/* سهم تمرير يسار */}
          <button
            onClick={() => scrollRibbon(genresScrollRef, isAr ? 'right' : 'left')}
            className="hidden sm:flex items-center justify-center p-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800 shrink-0"
            aria-label="Scroll genres backwards"
          >
            <ChevronRight className="w-3 h-3" />
          </button>

          {/* الحاوية القابلة للسحب الأفقي للأنواع الصحفية الـ 18 */}
          <div
            ref={genresScrollRef}
            className="flex-1 flex items-center gap-1.5 overflow-x-auto py-0.5 scroll-smooth scrollbar-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {JOURNALISTIC_GENRES.map((genre) => {
              const isSelected = selectedGenreId === genre.id;

              return (
                <button
                  key={genre.id}
                  onClick={() => {
                    if (isSelected) {
                      onSelectGenre('all');
                    } else {
                      onSelectGenre(genre.id);
                    }
                  }}
                  className={`flex-shrink-0 px-2 py-0.5 rounded text-[10.5px] font-medium transition-all select-none ${
                    isSelected
                      ? 'bg-purple-500 text-slate-950 font-bold shadow-sm ring-1 ring-purple-400'
                      : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800/80 hover:text-white'
                  }`}
                  title={isAr ? genre.descriptionAr : genre.descriptionEn}
                >
                  {isAr ? genre.nameAr : genre.nameEn}
                </button>
              );
            })}
          </div>

          {/* سهم تمرير يمين */}
          <button
            onClick={() => scrollRibbon(genresScrollRef, isAr ? 'left' : 'right')}
            className="hidden sm:flex items-center justify-center p-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800 shrink-0"
            aria-label="Scroll genres forward"
          >
            <ChevronLeft className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* مسار الفلترة النشطة وزر الإلغاء السريع */}
      {selectedCountry && (
        <div className="px-3 py-1 bg-slate-950/60 flex items-center justify-between text-[10.5px] text-slate-400 border-t border-slate-800/40">
          <div className="flex items-center gap-1.5 overflow-hidden">
            <span className="text-slate-500 font-mono">{isAr ? 'التصفية النشطة:' : 'Filter:'}</span>
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <span>{getCountryFlag(selectedCountry.code)}</span>
              <span>{isAr ? selectedCountry.nameAr : selectedCountry.nameEn}</span>
            </span>
            {selectedSector && selectedSectorId !== 'all' && (
              <>
                <span className="text-slate-600">/</span>
                <span className="text-emerald-400 font-medium">
                  {isAr ? selectedSector.nameAr : selectedSector.nameEn}
                </span>
              </>
            )}
            {selectedGenre && selectedGenreId !== 'all' && (
              <>
                <span className="text-slate-600">/</span>
                <span className="text-purple-400 font-medium">
                  {isAr ? selectedGenre.nameAr : selectedGenre.nameEn}
                </span>
              </>
            )}
          </div>

          <button
            onClick={() => {
              onSelectCountry('');
              onSelectSector('all');
              onSelectGenre('all');
            }}
            className="text-amber-400 hover:text-amber-300 font-mono text-[10px] flex items-center gap-1 shrink-0 ml-2"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span>{isAr ? 'عرض الكل' : 'Clear'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
