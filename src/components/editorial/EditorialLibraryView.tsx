import React from 'react';
import { 
  BookOpen, 
  Archive, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft 
} from 'lucide-react';
import { Article } from '../../types';
import { SectorNewsGrid } from './SectorNewsGrid';
import { EditorialArticleCard } from './EditorialArticleCard';

interface EditorialLibraryViewProps {
  isAr: boolean;
  activeTab: 'library' | 'archive';
  publishedArticles: Article[];
  archivedArticles: Article[];
  handleOpenInEditor: (article: Article) => void;
  SECTOR_SECTIONS: any[];
  expandedSectors: Record<string, boolean>;
  toggleSectorExpansion: (id: string) => void;
  handleScrollSector: (id: string, dir: 'prev' | 'next') => void;
}

export const EditorialLibraryView: React.FC<EditorialLibraryViewProps> = ({
  isAr,
  activeTab,
  publishedArticles,
  archivedArticles,
  handleOpenInEditor,
  SECTOR_SECTIONS,
  expandedSectors,
  toggleSectorExpansion,
  handleScrollSector
}) => {
  const articlesToList = activeTab === 'library' ? publishedArticles : archivedArticles;
  const isArchive = activeTab === 'archive';

  // Group by sector for consistent UI with overview
  const getSectorArticlesMap = (list: Article[]) => {
    const map: Record<string, Article[]> = {};
    SECTOR_SECTIONS.forEach(sector => {
      const matching = list.filter(a => {
         // This logic should match the one in EditorialView for consistency
         if (sector.id === 'energy') return a.category === 'Energy' || a.sector?.includes('طاقة') || a.sector?.includes('نفط') || a.sector?.includes('غاز');
         if (sector.id === 'mining') return a.category === 'Mining' || a.sector?.includes('تعدين') || a.sector?.includes('معادن');
         if (sector.id === 'tech_digital') return a.category === 'FinTech' || a.sector?.includes('تكنولوجيا') || a.sector?.includes('رقمي');
         if (sector.id === 'trade_industry') return a.sector?.includes('تجارة') || a.sector?.includes('موانئ') || a.sector?.includes('صناعة');
         if (sector.id === 'sustainable') return a.category === 'Agribusiness' || a.sector?.includes('زراعة') || a.sector?.includes('غذاء');
         return a.category === 'Markets' || a.category === 'Macroeconomics' || a.sector?.includes('مال') || a.sector?.includes('استثمار');
      });
      map[sector.id] = matching;
    });
    return map;
  };

  const sectorMap = getSectorArticlesMap(articlesToList);

  return (
    <div className="space-y-8 animate-in fade-in duration-200 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2.5">
            {isArchive ? <Archive className="w-6 h-6 text-slate-400" /> : <BookOpen className="w-6 h-6 text-teal-400" />}
            <span>{isArchive ? (isAr ? 'أرشيف المقالات والمرفوضات' : 'Editorial Archive') : (isAr ? 'مكتبة التقارير المعتمدة والمنشورة' : 'Editorial Library')}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isArchive 
              ? (isAr ? 'سجل المقالات المستبعدة والمسودات المؤرشفة للمراجعة اللاحقة.' : 'History of rejected drafts and archived editorial records.')
              : (isAr ? 'استعراض كافة التقارير التي تم اعتمادها ونشرها للجمهور.' : 'Browse all approved and published reports.')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${isArchive ? 'bg-slate-500/15 text-slate-300 border-slate-500/30' : 'bg-teal-500/15 text-teal-300 border-teal-500/30'}`}>
            {articlesToList.length} {isAr ? 'مقال' : 'articles'}
          </span>
        </div>
      </div>

      {articlesToList.length === 0 ? (
        <div className="p-20 text-center rounded-3xl bg-[#090D18] border border-slate-800 space-y-3">
          <CheckCircle2 className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">
            {isAr ? 'لا توجد مقالات هنا حالياً' : 'No articles found in this section'}
          </h3>
          <p className="text-sm text-slate-500">
            {isAr ? 'سيتم سرد المقالات هنا بمجرد معالجتها من قبل المشرف.' : 'Articles will appear here once processed by a supervisor.'}
          </p>
        </div>
      ) : (
        <div className="space-y-10 w-full">
          {SECTOR_SECTIONS.map((sector) => {
            const sectorArticles = sectorMap[sector.id] || [];
            if (sectorArticles.length === 0) return null;

            return (
              <SectorNewsGrid
                key={sector.id}
                isAr={isAr}
                sector={sector}
                articles={sectorArticles}
                expanded={expandedSectors[sector.id]}
                onToggleExpansion={() => toggleSectorExpansion(sector.id)}
                onScroll={(direction) => handleScrollSector(sector.id, direction)}
                onOpenInEditor={handleOpenInEditor}
                renderArticleCard={(art, idx, isMobile, totalCount) => (
                  <EditorialArticleCard
                    key={art.id || idx}
                    article={art}
                    idx={idx}
                    isMobile={isMobile}
                    totalCount={totalCount}
                    isAr={isAr}
                    onClick={handleOpenInEditor}
                  />
                )}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
