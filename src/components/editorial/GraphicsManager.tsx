import React from 'react';
import { 
  Image as ImageIcon, 
  Plus, 
  BarChart3, 
  Globe2, 
  TrendingUp, 
  Edit3, 
  Trash2 
} from 'lucide-react';
import { ArticleGraphicItem } from '../../types';

interface GraphicsManagerProps {
  isAr: boolean;
  graphics: ArticleGraphicItem[];
  onAddClick: () => void;
  onEditClick: (g: ArticleGraphicItem) => void;
  onDeleteClick: (id: string) => void;
}

export const GraphicsManager: React.FC<GraphicsManagerProps> = ({
  isAr,
  graphics,
  onAddClick,
  onEditClick,
  onDeleteClick
}) => {
  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-[#080C17] border border-slate-800 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-black text-white">
              {isAr ? 'إدارة الرسوم البيانية والخرائط والإنفوجرافيك للمقال' : 'Article Visuals & Infographics Deck'}
            </h3>
          </div>
          <p className="text-[11px] text-slate-400">
            {isAr 
              ? 'قاعدة العرض: الصور في وسط المقال تأخذ 50% مع التواء النص، وفي نهاية المقال تأخذ 100% كامل العرض.' 
              : 'Display rules: Mid-article graphics take 50% with text wrapping; End graphic takes 100% full width.'}
          </p>
        </div>

        <button
          type="button"
          onClick={onAddClick}
          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isAr ? 'إضافة تمثيل بياني جديد' : 'Add New Graphic'}</span>
        </button>
      </div>

      {graphics.length === 0 ? (
        <div className="p-8 text-center rounded-xl bg-slate-950 border border-dashed border-slate-800 space-y-2">
          <ImageIcon className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-xs text-slate-400">{isAr ? 'لا توجد رسوم بيانية مرفقة بالمقال حالياً.' : 'No graphics attached to this report yet.'}</p>
          <button
            type="button"
            onClick={onAddClick}
            className="text-[10px] text-amber-500 font-bold hover:underline"
          >
            {isAr ? 'أضف أول تمثيل بياني' : 'Add your first graphic'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {graphics.map((g) => (
            <div key={g.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between group">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center border shrink-0 ${
                  g.type === 'chart' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
                  g.type === 'map' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                  'bg-purple-500/10 border-purple-500/30 text-purple-400'
                }`}>
                  {g.type === 'chart' ? <BarChart3 className="w-4.5 h-4.5" /> : 
                   g.type === 'map' ? <Globe2 className="w-4.5 h-4.5" /> : 
                   <TrendingUp className="w-4.5 h-4.5" />}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{g.title}</h4>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5 uppercase">
                    {g.position === 'mid' ? (isAr ? 'وسط النص' : 'Mid') : (isAr ? 'نهاية النص' : 'End')} · {g.type}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => onEditClick(g)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteClick(g.id)}
                  className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
