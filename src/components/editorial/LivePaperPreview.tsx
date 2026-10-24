import React from 'react';
import { 
  Clock, 
  User, 
  Volume2, 
  BarChart3, 
  Globe2, 
  TrendingUp 
} from 'lucide-react';
import { ArticleGraphicItem } from '../../types';

interface LivePaperPreviewProps {
  isAr: boolean;
  editableCountry: string;
  editableSector: string;
  editableGenre: string;
  estimatedReadTime: number;
  editableAuthor: string;
  editableTitle: string;
  editableImageUrl: string;
  editableSummary: string;
  editableContent: string;
  currentMidGraphics: ArticleGraphicItem[];
  currentEndGraphics: ArticleGraphicItem[];
  setZoomGraphic: (g: ArticleGraphicItem) => void;
}

export const LivePaperPreview: React.FC<LivePaperPreviewProps> = ({
  isAr,
  editableCountry,
  editableSector,
  editableGenre,
  estimatedReadTime,
  editableAuthor,
  editableTitle,
  editableImageUrl,
  editableSummary,
  editableContent,
  currentMidGraphics,
  currentEndGraphics,
  setZoomGraphic
}) => {
  return (
    <div className="w-full max-w-full bg-[#FAF7F0] text-stone-900 rounded-3xl p-6 sm:p-12 lg:p-16 border border-amber-900/10 shadow-2xl space-y-8 animate-in fade-in duration-200">
      <div className="border-b border-stone-300 pb-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-stone-600 font-sans">
          <div className="flex items-center gap-1.5 font-bold text-amber-800 bg-amber-100/70 px-3 py-1 rounded-md border border-amber-200">
            <span>{editableCountry}</span>
            <span>/</span>
            <span>{editableSector}</span>
            <span>/</span>
            <span>{editableGenre}</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-stone-500" />
              <span>{estimatedReadTime} {isAr ? 'دقائق قراءة' : 'min read'}</span>
            </span>
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-stone-500" />
              <span>{editableAuthor}</span>
            </span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-stone-900 leading-tight font-serif">
          {editableTitle}
        </h1>

        <div className="space-y-4">
          {editableImageUrl && (
            <div className="rounded-2xl overflow-hidden border border-amber-900/15 bg-stone-100 shadow-md">
              <img
                src={editableImageUrl}
                alt={editableTitle}
                className="w-full max-h-[380px] object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="p-2.5 bg-stone-200/70 text-[11px] text-stone-600 font-sans flex items-center justify-between border-t border-stone-200">
                <span className="font-medium">{isAr ? 'صورة المقال الرئيسية المعتمدة على الصفحة الرئيسية' : 'Lead report image published to frontpage'}</span>
                <span className="font-mono text-[10px] text-stone-500">{editableCountry} · {editableSector}</span>
              </div>
            </div>
          )}

          <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-sans italic border-r-4 border-amber-700 pe-4">
            {editableSummary}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#F0EBE1] border border-amber-900/10 flex items-center justify-between text-xs text-stone-700">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-amber-800 animate-pulse" />
            <span className="font-bold">{isAr ? 'القارئ الصوتي الذكي جاهز للاستماع' : 'Audio reader ready'}</span>
          </div>
          <span className="font-mono text-[11px] text-stone-500">~{estimatedReadTime}:00</span>
        </div>
      </div>

      <div className="space-y-6 text-stone-800 text-sm sm:text-base font-serif leading-loose">
        {currentMidGraphics[0] && (
          <div
            onClick={() => setZoomGraphic(currentMidGraphics[0])}
            className="w-[50%] max-w-[50%] float-right ms-4 sm:ms-6 mb-4 p-3.5 rounded-2xl bg-white border border-stone-200 shadow-md cursor-pointer hover:border-amber-600 transition-all select-none"
          >
            <div className="flex items-center justify-between text-[11px] font-bold text-amber-900 pb-2 border-b border-stone-100">
              <span className="flex items-center gap-1">
                <BarChart3 className="w-3.5 h-3.5" />
                <span>{currentMidGraphics[0].title}</span>
              </span>
            </div>
            <div className="py-3 space-y-2">
              {(currentMidGraphics[0].dataPoints || []).map((dp, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-[10px] text-stone-600 font-sans">
                    <span>{dp.label}</span>
                    <span className="font-mono font-bold text-stone-800">{dp.desc || `${dp.value}%`}</span>
                  </div>
                  <div className="h-2 rounded-full bg-stone-100 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-600 to-amber-700 rounded-full" style={{ width: `${Math.min(100, dp.value)}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-stone-500 font-sans pt-1 border-t border-stone-100 italic">{currentMidGraphics[0].caption}</p>
          </div>
        )}

        {editableContent.split('\n\n').slice(0, 2).map((p, idx) => (
          <p key={idx} className="text-justify leading-relaxed">{p}</p>
        ))}

        {currentMidGraphics[1] && (
          <div
            onClick={() => setZoomGraphic(currentMidGraphics[1])}
            className="w-[50%] max-w-[50%] float-left me-4 sm:me-6 mb-4 p-3.5 rounded-2xl bg-white border border-stone-200 shadow-md cursor-pointer hover:border-amber-600 transition-all select-none"
          >
            <div className="flex items-center justify-between text-[11px] font-bold text-blue-900 pb-2 border-b border-stone-100">
              <span className="flex items-center gap-1">
                <Globe2 className="w-3.5 h-3.5" />
                <span>{currentMidGraphics[1].title}</span>
              </span>
            </div>
            <div className="py-3 space-y-2">
              {(currentMidGraphics[1].dataPoints || []).map((dp, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-[10px] text-stone-600 font-sans">
                    <span>{dp.label}</span>
                    <span className="font-mono font-bold text-stone-800">{dp.desc || `${dp.value}%`}</span>
                  </div>
                  <div className="h-2 rounded-full bg-stone-100 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-600 to-blue-700 rounded-full" style={{ width: `${Math.min(100, dp.value)}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-stone-500 font-sans pt-1 border-t border-stone-100 italic">{currentMidGraphics[1].caption}</p>
          </div>
        )}

        <div className="my-6 p-4 sm:p-5 rounded-2xl bg-[#F0EBE1] border-r-4 border-amber-600 text-stone-800 italic font-serif text-base sm:text-lg shadow-sm">
          {isAr 
            ? '«إن الاستثمار في البنية التحتية الصناعية والطاقوية السيادية يشكل الركيزة الأساسية لتحقيق التكامل القاري الإفريقي وتفكيك التبعية التاريخية لسلاسل التوريد الخارجية»'
            : 'Sovereign downstream industrial investments dismantle colonial extraction dynamics and anchor authentic continental value chain autonomy.'}
        </div>

        {editableContent.split('\n\n').slice(2).map((p, idx) => (
          <p key={idx} className="text-justify leading-relaxed">{p}</p>
        ))}

        <div className="clear-both" />

        {currentEndGraphics[0] && (
          <div
            onClick={() => setZoomGraphic(currentEndGraphics[0])}
            className="w-full p-5 sm:p-6 rounded-2xl bg-white border border-stone-200 shadow-md cursor-pointer hover:border-purple-600 transition-all select-none space-y-4 my-8"
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-700" />
                <h4 className="text-sm sm:text-base font-bold text-stone-900">{currentEndGraphics[0].title}</h4>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(currentEndGraphics[0].dataPoints || []).map((dp, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                  <div className="text-xs text-stone-500 font-sans">{dp.label}</div>
                  <div className="text-lg font-black text-purple-900 font-mono">{dp.desc || `${dp.value}%`}</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-stone-600 font-sans italic pt-2 border-t border-stone-100">{currentEndGraphics[0].caption}</p>
          </div>
        )}
      </div>
    </div>
  );
};
