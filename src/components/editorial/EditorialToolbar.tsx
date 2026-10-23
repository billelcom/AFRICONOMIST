import React from 'react';
import { 
  ChevronRight, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  ExternalLink, 
  FileEdit, 
  Eye 
} from 'lucide-react';
import { Article } from '../../types';

interface EditorialToolbarProps {
  isAr: boolean;
  onBackToOverview: () => void;
  hasPrevArticle: boolean;
  onPrevArticle: () => void;
  articleIndex: number;
  totalArticlesCount: number;
  hasNextArticle: boolean;
  onNextArticle: () => void;
  articleStatus: string;
  onPreviewArticle?: (article: Article) => void;
  currentArticle: Article;
  viewMode: 'edit' | 'paper_preview';
  setViewMode: (mode: 'edit' | 'paper_preview') => void;
}

export const EditorialToolbar: React.FC<EditorialToolbarProps> = ({
  isAr,
  onBackToOverview,
  hasPrevArticle,
  onPrevArticle,
  articleIndex,
  totalArticlesCount,
  hasNextArticle,
  onNextArticle,
  articleStatus,
  onPreviewArticle,
  currentArticle,
  viewMode,
  setViewMode
}) => {
  return (
    <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0A0F1D] to-slate-900 border border-slate-800 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-3 w-full max-w-full">
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2.5 sm:gap-3 w-full lg:w-auto">
        <div className="flex items-center justify-between w-full sm:w-auto gap-2">
          <button
            onClick={onBackToOverview}
            className="px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold cursor-pointer border border-slate-700 hover:border-slate-600 shadow-sm shrink-0"
          >
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 rtl:rotate-0 ltr:rotate-180 text-amber-400" />
            <span>{isAr ? 'غرفة الأخبار والأقسام' : 'Newsroom Desks'}</span>
          </button>

          <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-950 p-1 sm:p-1.5 rounded-xl border border-slate-800 shadow-inner shrink-0">
            <button
              type="button"
              disabled={!hasPrevArticle}
              onClick={onPrevArticle}
              className={`px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold flex items-center gap-1 transition-colors ${
                hasPrevArticle 
                  ? 'text-slate-200 hover:bg-slate-800 hover:text-amber-400 cursor-pointer' 
                  : 'text-slate-600 cursor-not-allowed'
              }`}
            >
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 rtl:rotate-0 ltr:rotate-180" />
              <span>{isAr ? 'السابق' : 'Prev'}</span>
            </button>

            <span className="font-mono text-[11px] sm:text-xs font-bold text-amber-400 px-1.5 sm:px-2">
              {articleIndex + 1} / {totalArticlesCount}
            </span>

            <button
              type="button"
              disabled={!hasNextArticle}
              onClick={onNextArticle}
              className={`px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold flex items-center gap-1 transition-colors ${
                hasNextArticle 
                  ? 'text-slate-200 hover:bg-slate-800 hover:text-amber-400 cursor-pointer' 
                  : 'text-slate-600 cursor-not-allowed'
              }`}
            >
              <span>{isAr ? 'التالي' : 'Next'}</span>
              <ArrowLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5 rtl:rotate-0 ltr:rotate-180" />
            </button>
          </div>
        </div>

        <div className="h-5 w-px bg-slate-800 hidden sm:block mx-0.5" />

        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <span className={`text-[11px] sm:text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl font-bold font-mono border flex items-center gap-1.5 ${
            articleStatus === 'published'
              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
              : articleStatus === 'rejected'
              ? 'bg-slate-800 text-slate-300 border-slate-700'
              : 'bg-rose-500/15 text-rose-300 border-rose-500/30 animate-pulse'
          }`}>
            {articleStatus === 'published' ? (isAr ? '✅ معتمد ومنشور' : 'Published') :
             articleStatus === 'rejected' ? (isAr ? '📦 في الأرشيف' : 'Archived') :
             (isAr ? '⏳ قيد المراجعة البشرية' : 'Pending Review')}
          </span>

          {onPreviewArticle && (
            <button
              type="button"
              onClick={() => onPreviewArticle(currentArticle)}
              className="px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-xl bg-gradient-to-r from-amber-500/15 to-amber-600/20 hover:from-amber-500/25 hover:to-amber-600/30 text-amber-300 border border-amber-500/40 text-[11px] sm:text-xs font-bold flex items-center gap-1.5 sm:gap-2 shadow-sm transition-all cursor-pointer hover:text-white"
            >
              <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
              <span>{isAr ? 'فتح صفحة المقال المستقلة' : 'Open in Article View'}</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 shadow-inner">
          <button
            type="button"
            onClick={() => setViewMode('edit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'edit'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileEdit className="w-3.5 h-3.5" />
            <span>{isAr ? 'المحرر الموسع' : 'Expansive Editor'}</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('paper_preview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'paper_preview'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isAr ? 'المعاينة الورقية الحية' : 'Live Paper Preview'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
