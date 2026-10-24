import React from 'react';
import { 
  Image as ImageIcon, 
  X, 
  Trash2 
} from 'lucide-react';
import { ArticleGraphicItem } from '../../types';

interface GraphicEditorModalProps {
  isAr: boolean;
  isNew: boolean;
  editingGraphic: ArticleGraphicItem;
  setEditingGraphic: (g: ArticleGraphicItem) => void;
  onClose: () => void;
  onSave: () => void;
  applyPreset: (type: 'trade' | 'macro' | 'energy' | 'map') => void;
}

export const GraphicEditorModal: React.FC<GraphicEditorModalProps> = ({
  isAr,
  isNew,
  editingGraphic,
  setEditingGraphic,
  onClose,
  onSave,
  applyPreset
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0A0F1D] border border-slate-700 rounded-3xl w-full max-w-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <ImageIcon className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-black text-white">
              {isNew ? (isAr ? 'إضافة تمثيل بياني أو خريطة جديدة' : 'Add New Graphic') : (isAr ? 'تعديل التمثيل البياني' : 'Edit Graphic')}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300">
            {isAr ? 'قوالب جاهزة سريعة ملائمة للاقتصاد الإفريقي:' : 'Quick Presets:'}
          </label>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => applyPreset('trade')} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-amber-300 hover:border-amber-500/50">📈 {isAr ? 'تجارة AfCFTA' : 'Trade'}</button>
            <button type="button" onClick={() => applyPreset('energy')} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-orange-300 hover:border-orange-500/50">⚡ {isAr ? 'طاقة وتكرير' : 'Energy'}</button>
            <button type="button" onClick={() => applyPreset('map')} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-blue-300 hover:border-blue-500/50">🗺️ {isAr ? 'خريطة ممرات' : 'Map'}</button>
            <button type="button" onClick={() => applyPreset('macro')} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-purple-300 hover:border-purple-500/50">💎 {isAr ? 'مؤشرات كلية' : 'Macro'}</button>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-300">{isAr ? 'عنوان التمثيل البياني:' : 'Graphic Title:'}</label>
            <input
              type="text"
              value={editingGraphic.title}
              onChange={(e) => setEditingGraphic({ ...editingGraphic, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-300">{isAr ? 'النوع:' : 'Type:'}</label>
              <select
                value={editingGraphic.type}
                onChange={(e) => setEditingGraphic({ ...editingGraphic, type: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-xs focus:outline-none focus:border-amber-500"
              >
                <option value="chart">{isAr ? 'رسم بياني إحصائي' : 'Statistical Chart'}</option>
                <option value="map">{isAr ? 'خريطة اقتصادية' : 'Economic Map'}</option>
                <option value="infographic">{isAr ? 'إنفوجرافيك بيانات' : 'Infographic'}</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300">{isAr ? 'الموضع وقاعدة العرض:' : 'Position:'}</label>
              <select
                value={editingGraphic.position}
                onChange={(e) => setEditingGraphic({ ...editingGraphic, position: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 font-bold text-xs focus:outline-none focus:border-amber-500"
              >
                <option value="mid">{isAr ? 'وسط المقال (50%)' : 'Mid (50%)'}</option>
                <option value="end">{isAr ? 'نهاية المقال (100%)' : 'End (100%)'}</option>
              </select>
            </div>
          </div>

          {editingGraphic.position === 'mid' && (
            <div className="space-y-1">
              <label className="font-bold text-slate-300">{isAr ? 'المحاذاة:' : 'Alignment:'}</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input type="radio" checked={editingGraphic.align === 'right' || !editingGraphic.align} onChange={() => setEditingGraphic({ ...editingGraphic, align: 'right' })} className="accent-amber-500" />
                  <span>{isAr ? 'يمين' : 'Right'}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input type="radio" checked={editingGraphic.align === 'left'} onChange={() => setEditingGraphic({ ...editingGraphic, align: 'left' })} className="accent-amber-500" />
                  <span>{isAr ? 'يسار' : 'Left'}</span>
                </label>
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="font-bold text-slate-300">{isAr ? 'الشرح والتعليق:' : 'Caption:'}</label>
            <textarea
              rows={2}
              value={editingGraphic.caption}
              onChange={(e) => setEditingGraphic({ ...editingGraphic, caption: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          <div className="space-y-2 border-t border-slate-800 pt-3">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-300">{isAr ? 'نقاط البيانات:' : 'Data Points:'}</label>
              <button
                type="button"
                onClick={() => {
                  const newPts = [...(editingGraphic.dataPoints || []), { label: isAr ? 'مؤشر جديد' : 'New Metric', value: 50, desc: '50%' }];
                  setEditingGraphic({ ...editingGraphic, dataPoints: newPts });
                }}
                className="text-[11px] text-amber-400 font-bold hover:underline"
              >
                + {isAr ? 'إضافة نقطة' : 'Add Point'}
              </button>
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {(editingGraphic.dataPoints || []).map((dp, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                  <input type="text" placeholder="Label" value={dp.label} onChange={(e) => {
                    const pts = [...(editingGraphic.dataPoints || [])];
                    pts[idx].label = e.target.value;
                    setEditingGraphic({ ...editingGraphic, dataPoints: pts });
                  }} className="flex-1 px-2 py-1 rounded bg-slate-900 border border-slate-800 text-white text-xs" />
                  <input type="number" value={dp.value} onChange={(e) => {
                    const pts = [...(editingGraphic.dataPoints || [])];
                    pts[idx].value = Number(e.target.value);
                    setEditingGraphic({ ...editingGraphic, dataPoints: pts });
                  }} className="w-16 px-2 py-1 rounded bg-slate-900 border border-slate-800 text-amber-400 text-xs font-mono" />
                  <input type="text" placeholder="Desc" value={dp.desc || ''} onChange={(e) => {
                    const pts = [...(editingGraphic.dataPoints || [])];
                    pts[idx].desc = e.target.value;
                    setEditingGraphic({ ...editingGraphic, dataPoints: pts });
                  }} className="w-24 px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono" />
                  <button type="button" onClick={() => {
                    const pts = (editingGraphic.dataPoints || []).filter((_, i) => i !== idx);
                    setEditingGraphic({ ...editingGraphic, dataPoints: pts });
                  }} className="p-1 text-rose-400 hover:bg-rose-950/40 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold">Cancel</button>
          <button type="button" onClick={onSave} className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs shadow-lg">Save Graphic</button>
        </div>
      </div>
    </div>
  );
};
