import React from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  ShieldCheck 
} from 'lucide-react';
import { Article } from '../../types';

interface SectorSection {
  id: string;
  nameAr: string;
  nameEn: string;
  icon: any;
  accentColor: string;
  descriptionAr: string;
  descriptionEn: string;
}

interface SectorNewsGridProps {
  isAr: boolean;
  sector: SectorSection;
  articles: Article[];
  expanded: boolean;
  onToggleExpansion: () => void;
  onScroll: (direction: 'prev' | 'next') => void;
  onOpenInEditor: (article: Article) => void;
  renderArticleCard: (art: Article, idx: number, isMobile: boolean, totalCount: number) => React.ReactNode;
}

export const SectorNewsGrid: React.FC<SectorNewsGridProps> = ({
  isAr,
  sector,
  articles,
  expanded,
  onToggleExpansion,
  onScroll,
  onOpenInEditor,
  renderArticleCard
}) => {
  const SectorIcon = sector.icon;

  return (
    <section key={sector.id} className="space-y-4 w-full max-w-full min-w-0 overflow-hidden">
      {/* Sector Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 w-full max-w-full min-w-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${sector.accentColor} border flex items-center justify-center shrink-0`}>
            <SectorIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg md:text-xl font-black text-white flex items-center gap-2 truncate">
              <span className="truncate">{isAr ? sector.nameAr : sector.nameEn}</span>
              <span className="text-[10px] sm:text-[11px] font-mono px-2 py-0.2 rounded-full bg-slate-800 text-amber-300 border border-slate-700 shrink-0">
                {articles.length} {isAr ? 'تقارير' : 'reports'}
              </span>
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-400 line-clamp-1">
              {isAr ? sector.descriptionAr : sector.descriptionEn}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {articles.length > 3 && (
            <button
              type="button"
              onClick={onToggleExpansion}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
            >
              <span>
                {expanded
                  ? (isAr ? 'عرض أقل' : 'Show less')
                  : (isAr ? `عرض كل التقارير (${articles.length})` : `View all (${articles.length})`)}
              </span>
            </button>
          )}

          <div className="flex sm:hidden items-center gap-1">
            <button
              type="button"
              onClick={() => onScroll('prev')}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700 shadow-sm"
              title={isAr ? 'السابق' : 'Previous'}
            >
              <ChevronRight className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => onScroll('next')}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700 shadow-sm"
              title={isAr ? 'التالي' : 'Next'}
            >
              <ChevronLeft className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slider */}
      <div 
        id={`sector-slider-${sector.id}`}
        className="md:hidden overflow-x-auto no-scrollbar scroll-smooth flex gap-3 pb-2 snap-x snap-mandatory w-full max-w-full min-w-0"
      >
        {articles.map((art, idx) => 
          renderArticleCard(art, idx, true, articles.length)
        )}
      </div>

      {/* Desktop Grid */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 w-full max-w-full min-w-0">
        {(expanded ? articles : articles.slice(0, 3)).map((art, idx) => 
          renderArticleCard(art, idx, false, articles.length)
        )}
      </div>
    </section>
  );
};
