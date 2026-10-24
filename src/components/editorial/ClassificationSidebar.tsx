import React, { useRef, useEffect } from 'react';
import { 
  Building2, 
  Flame, 
  Coins, 
  Briefcase, 
  ChevronDown, 
  Search, 
  Globe 
} from 'lucide-react';
import { ALL_54_AFRICAN_COUNTRIES } from '../../data/africanCountries';
import { JOURNALISTIC_GENRES, ECONOMIC_SECTORS } from '../../data/reportOptions';

interface ClassificationSidebarProps {
  isAr: boolean;
  isSupervisor: boolean;
  editableCountry: string;
  setEditableCountry: (c: string) => void;
  editableSector: string;
  setEditableSector: (s: string) => void;
  editableGenre: string;
  setEditableGenre: (g: string) => void;
  editableMarketImpact: 'positive' | 'negative' | 'neutral';
  setEditableMarketImpact: (m: 'positive' | 'negative' | 'neutral') => void;
  openDropdown: 'country' | 'sector' | 'genre' | null;
  setOpenDropdown: (d: 'country' | 'sector' | 'genre' | null) => void;
  countryRegionFilter: string;
  setCountryRegionFilter: (f: string) => void;
  sectorGroupFilter: string;
  setSectorGroupFilter: (f: string) => void;
  genreCategoryFilter: string;
  setGenreCategoryFilter: (f: string) => void;
  AFRICAN_REGIONS: any[];
  SECTOR_GROUPS: any[];
  GENRE_CATEGORIES: any[];
  filteredCountries: any[];
  filteredSectors: any[];
  filteredGenres: any[];
  selectedGenreObj: any;
  getCountryFlagEmoji: (code: string) => string;
  // Added for more complete refactor
  editableAuthor: string;
  setEditableAuthor: (a: string) => void;
}

export const ClassificationSidebar: React.FC<ClassificationSidebarProps> = ({
  isAr,
  isSupervisor,
  editableCountry,
  setEditableCountry,
  editableSector,
  setEditableSector,
  editableGenre,
  setEditableGenre,
  editableMarketImpact,
  setEditableMarketImpact,
  openDropdown,
  setOpenDropdown,
  countryRegionFilter,
  setCountryRegionFilter,
  sectorGroupFilter,
  setSectorGroupFilter,
  genreCategoryFilter,
  setGenreCategoryFilter,
  AFRICAN_REGIONS,
  SECTOR_GROUPS,
  GENRE_CATEGORIES,
  filteredCountries,
  filteredSectors,
  filteredGenres,
  selectedCountryObj,
  selectedSectorObj,
  selectedGenreObj,
  getCountryFlagEmoji,
  editableAuthor,
  setEditableAuthor
}) => {
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [setOpenDropdown]);

  return (
    <div ref={sidebarRef} className="space-y-6">
      {/* 0. Breadcrumb Classification Preview (المعاينة المركبة الحية) */}
      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/90 shadow-inner space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono flex items-center gap-1.5">
            <Globe className="w-3 h-3 text-amber-400" />
            <span>{isAr ? 'وسم التصنيف الثلاثي للمقال:' : 'Breadcrumb Classification:'}</span>
          </span>
          <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
            {isAr ? 'تحديث لحظي' : 'Live Sync'}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#080C17] border border-amber-500/30 text-amber-300 font-bold shadow-sm">
            <span className="text-sm">{selectedCountryObj ? getCountryFlagEmoji(selectedCountryObj.code) : '🌍'}</span>
            <span>{editableCountry}</span>
          </span>
          <span className="text-slate-600 font-bold">/</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#080C17] border border-blue-500/30 text-blue-300 font-bold shadow-sm">
            <Building2 className="w-3 h-3 text-blue-400" />
            <span>{editableSector}</span>
          </span>
          <span className="text-slate-600 font-bold">/</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#080C17] border border-purple-500/30 text-purple-300 font-bold shadow-sm">
            <Search className="w-3 h-3 text-purple-400" />
            <span>{editableGenre}</span>
          </span>
        </div>
      </div>
      {/* 1. Market Impact */}
      <div className="p-5 rounded-2xl bg-[#080C17] border border-slate-800 shadow-xl space-y-3">
        <label className="text-xs font-bold text-slate-400 block">{isAr ? 'تقييم التأثير على الأسواق:' : 'Market Impact Assessment:'}</label>
        <div className="grid grid-cols-3 gap-2">
          {['positive', 'neutral', 'negative'].map((impact) => (
            <button
              key={impact}
              type="button"
              onClick={() => setEditableMarketImpact(impact as any)}
              className={`py-2 rounded-xl text-[10px] font-bold border transition-all ${
                editableMarketImpact === impact
                  ? impact === 'positive' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' :
                    impact === 'negative' ? 'bg-rose-500/20 border-rose-500 text-rose-300' :
                    'bg-amber-500/20 border-amber-500 text-amber-300'
                  : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
              }`}
            >
              {impact === 'positive' ? (isAr ? 'إيجابي' : 'Bullish') :
               impact === 'negative' ? (isAr ? 'سلبي' : 'Bearish') :
               (isAr ? 'محايد' : 'Neutral')}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Country Selection */}
      <div className="p-5 rounded-2xl bg-[#080C17] border border-slate-800 shadow-xl space-y-3 relative">
        <label className="text-xs font-bold text-slate-400 block">{isAr ? 'الدولة المستهدفة:' : 'Target African Nation:'}</label>
        <button
          type="button"
          onClick={() => setOpenDropdown(openDropdown === 'country' ? null : 'country')}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white hover:border-amber-500/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-base">{selectedCountryObj ? getCountryFlagEmoji(selectedCountryObj.code) : '🌍'}</span>
            <span className="font-bold">{editableCountry}</span>
          </div>
          <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${openDropdown === 'country' ? 'rotate-180' : ''}`} />
        </button>

        {openDropdown === 'country' && (
          <div className="absolute left-0 right-0 top-full mt-2 z-30 bg-[#0F172A] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="p-2 border-b border-slate-800 bg-slate-900/50 flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={countryRegionFilter}
                onChange={(e) => setCountryRegionFilter(e.target.value)}
                className="flex-1 bg-transparent text-[10px] text-slate-300 focus:outline-none"
              >
                {AFRICAN_REGIONS.map(r => <option key={r.id} value={r.id}>{isAr ? r.labelAr : r.labelEn}</option>)}
              </select>
            </div>
            <div className="max-h-60 overflow-y-auto no-scrollbar grid grid-cols-2 p-1 gap-1">
              {filteredCountries.map(c => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => { setEditableCountry(isAr ? c.nameAr : c.nameEn); setOpenDropdown(null); }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 text-[11px] text-slate-300 text-right transition-colors"
                >
                  <span>{getCountryFlagEmoji(c.code)}</span>
                  <span className="truncate">{isAr ? c.nameAr : c.nameEn}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. Sector Selection */}
      <div className="p-5 rounded-2xl bg-[#080C17] border border-slate-800 shadow-xl space-y-3 relative">
        <label className="text-xs font-bold text-slate-400 block">{isAr ? 'القطاع الاقتصادي:' : 'Economic Sector:'}</label>
        <button
          type="button"
          onClick={() => setOpenDropdown(openDropdown === 'sector' ? null : 'sector')}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white hover:border-amber-500/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-amber-400" />
            <span className="font-bold">{editableSector}</span>
          </div>
          <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${openDropdown === 'sector' ? 'rotate-180' : ''}`} />
        </button>

        {openDropdown === 'sector' && (
          <div className="absolute left-0 right-0 top-full mt-2 z-30 bg-[#0F172A] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="p-2 border-b border-slate-800 bg-slate-900/50 flex items-center gap-2">
              <Briefcase className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={sectorGroupFilter}
                onChange={(e) => setSectorGroupFilter(e.target.value)}
                className="flex-1 bg-transparent text-[10px] text-slate-300 focus:outline-none"
              >
                {SECTOR_GROUPS.map(g => <option key={g.id} value={g.id}>{isAr ? g.labelAr : g.labelEn}</option>)}
              </select>
            </div>
            <div className="max-h-60 overflow-y-auto no-scrollbar p-1 space-y-1">
              {filteredSectors.map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => { setEditableSector(isAr ? s.nameAr : s.nameEn); setOpenDropdown(null); }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-800 text-[11px] text-slate-300 text-right transition-colors"
                >
                  <span className="truncate">{isAr ? s.nameAr : s.nameEn}</span>
                  <span className="text-[9px] text-slate-500 uppercase">{s.group}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. Genre Selection */}
      <div className="p-5 rounded-2xl bg-[#080C17] border border-slate-800 shadow-xl space-y-3 relative">
        <label className="text-xs font-bold text-slate-400 block">{isAr ? 'القالب التحريري:' : 'Journalistic Genre:'}</label>
        <button
          type="button"
          onClick={() => setOpenDropdown(openDropdown === 'genre' ? null : 'genre')}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white hover:border-amber-500/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-blue-400" />
            <span className="font-bold">{editableGenre}</span>
          </div>
          <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${openDropdown === 'genre' ? 'rotate-180' : ''}`} />
        </button>

        {openDropdown === 'genre' && (
          <div className="absolute left-0 right-0 top-full mt-2 z-30 bg-[#0F172A] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="p-2 border-b border-slate-800 bg-slate-900/50 flex items-center gap-2">
              <Coins className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={genreCategoryFilter}
                onChange={(e) => setGenreCategoryFilter(e.target.value)}
                className="flex-1 bg-transparent text-[10px] text-slate-300 focus:outline-none"
              >
                {GENRE_CATEGORIES.map(g => <option key={g.id} value={g.id}>{isAr ? g.labelAr : g.labelEn}</option>)}
              </select>
            </div>
            <div className="max-h-60 overflow-y-auto no-scrollbar p-1 space-y-1">
              {filteredGenres.map(g => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => { setEditableGenre(isAr ? g.nameAr : g.nameEn); setOpenDropdown(null); }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-800 text-[11px] text-slate-300 text-right transition-colors"
                >
                  <span className="truncate">{isAr ? g.nameAr : g.nameEn}</span>
                  <span className="text-[9px] text-slate-500 uppercase">{g.category}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 5. Author Attribution */}
      <div className="p-5 rounded-2xl bg-[#080C17] border border-slate-800 shadow-xl space-y-3">
        <label className="text-xs font-bold text-slate-400 block flex items-center gap-2">
          <span>{isAr ? 'اسم الكاتب أو الهيئة:' : 'Author / Bureau Attribution:'}</span>
        </label>
        <div className="relative">
          <input
            type="text"
            value={editableAuthor}
            onChange={(e) => setEditableAuthor(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs font-bold focus:outline-none focus:border-amber-500 transition-colors"
            placeholder={isAr ? "اسم الكاتب..." : "Author name..."}
          />
        </div>
      </div>
    </div>
  );
};
