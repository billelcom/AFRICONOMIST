import React from 'react';
import { 
  ShieldCheck, 
  ChevronLeft 
} from 'lucide-react';
import { Article } from '../../types';

interface EditorialArticleCardProps {
  article: Article;
  idx: number;
  isMobile: boolean;
  totalCount: number;
  isAr: boolean;
  onClick: (art: Article) => void;
}

export const EditorialArticleCard: React.FC<EditorialArticleCardProps> = ({
  article,
  idx,
  isMobile,
  totalCount,
  isAr,
  onClick
}) => {
  const isPending = article.status === 'pending_review';
  
  return (
    <div
      onClick={() => onClick(article)}
      className={`${
        isMobile 
          ? 'w-full min-w-full max-w-full shrink-0 snap-center' 
          : 'w-full min-w-0 max-w-full'
      } bg-[#0A0F1D] hover:bg-[#0E1528] border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 space-y-3 cursor-pointer transition-all duration-200 group shadow-lg flex flex-col justify-between overflow-hidden break-words`}
    >
      {/* Top Bar: Country & Journalistic Genre */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs gap-1.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-amber-300 font-bold border border-slate-700 truncate">
              🌍 {article.countryName}
            </span>
            <span className="text-[10px] text-slate-400 font-mono shrink-0">
              {article.countryCode}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {isMobile && (
              <span className="text-[10px] font-mono text-slate-500 sm:hidden">
                [{idx + 1}/{totalCount}]
              </span>
            )}
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold font-mono ${
              isPending 
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}>
              {isPending ? (isAr ? 'قيد المراجعة' : 'Pending') : (isAr ? 'منشور' : 'Published')}
            </span>
          </div>
        </div>

        {/* Journalistic Genre Pill */}
        <div className="inline-block text-[11px] font-bold text-amber-400/90 bg-amber-500/10 px-2.5 py-0.5 rounded-lg border border-amber-500/20 max-w-full truncate">
          📰 {article.journalisticType || (isAr ? 'التحقيق الصحفي' : 'Investigative')}
        </div>

        {/* Title */}
        <h4 className="text-sm sm:text-base md:text-lg font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug break-words">
          {article.title}
        </h4>

        {/* Summary preview */}
        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed break-words">
          {article.summary}
        </p>
      </div>

      {/* Footer of Card */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
        <span className="flex items-center gap-1 shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>{article.factCheck?.score || 96}% {isAr ? 'دقة' : 'score'}</span>
        </span>
        <span className="text-amber-400/90 group-hover:translate-x-1 transition-transform flex items-center gap-0.5 font-bold shrink-0">
          <span>{isAr ? 'فتح المحرر' : 'Open Editor'}</span>
          <ChevronLeft className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" />
        </span>
      </div>
    </div>
  );
};
