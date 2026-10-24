import React from 'react';
import { 
  Image as ImageIcon, 
  Eye, 
  ShieldCheck, 
  Clock, 
  Link as LinkIcon, 
  X, 
  Upload, 
  Sparkles, 
  Check, 
  Trash2 
} from 'lucide-react';

interface CoverImagePreset {
  id: string;
  nameAr: string;
  nameEn: string;
  url: string;
}

interface CoverImageSelectorProps {
  isAr: boolean;
  editableTitle: string;
  editableImageUrl: string;
  setEditableImageUrl: (url: string) => void;
  editableSummary: string;
  editableCountry: string;
  editableSector: string;
  presets: CoverImagePreset[];
  onUploadClick: () => void;
}

export const CoverImageSelector: React.FC<CoverImageSelectorProps> = ({
  isAr,
  editableTitle,
  editableImageUrl,
  setEditableImageUrl,
  editableSummary,
  editableCountry,
  editableSector,
  presets,
  onUploadClick
}) => {
  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-[#080C17] border border-slate-800 shadow-xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ImageIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
              <span>{isAr ? 'صورة المقال الرئيسية' : 'Lead Article Image'}</span>
            </h3>
            <p className="text-[10.5px] text-slate-400 mt-0.5">
              {isAr 
                ? 'تظهر هذه الصورة في صدارة التقرير وبطاقات العرض المعتمدة.' 
                : 'This image appears at the forefront of the verified editorial report.'}
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
          {editableImageUrl ? (isAr ? 'صورة معتمدة' : 'Custom Image Set') : (isAr ? 'صورة افتراضية' : 'Default Placeholder')}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Column A: Live Homepage Card Preview */}
        <div className="lg:col-span-5 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-bold flex items-center gap-1 text-amber-400">
              <Eye className="w-3.5 h-3.5" />
              <span>{isAr ? 'المعاينة الحية في بطاقة الصفحة الرئيسية:' : 'Live Homepage Card Preview:'}</span>
            </span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-br from-[#0d1424] via-[#0a0f1c] to-[#070b14] border border-amber-500/30 shadow-lg relative overflow-hidden group">
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2 font-medium">
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-slate-200 font-bold truncate">{editableCountry}</span>
                <span className="text-slate-600">·</span>
                <span className="text-amber-400/90 truncate font-sans">{editableSector}</span>
              </div>
              <div className="flex items-center gap-1 font-mono text-[9px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                <ShieldCheck className="w-2.5 h-2.5" />
                <span>97% {isAr ? 'دقة' : ''}</span>
              </div>
            </div>

            <div className="flex items-start justify-between gap-2.5 mb-2">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm sm:text-base font-bold text-white line-clamp-2 leading-snug">
                  {editableTitle || (isAr ? 'عنوان التقرير الصحفي...' : 'Article Headline...')}
                </h4>
                <div className="flex items-center gap-1 text-[9px] font-mono text-slate-400 mt-1">
                  <Clock className="w-2.5 h-2.5 text-slate-500" />
                  <span>{isAr ? 'اليوم · 16:30' : 'Today · 16:30'}</span>
                </div>
              </div>

              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border border-amber-500/40 shadow-md relative bg-slate-900 group-hover:scale-105 transition-transform duration-300">
                <img
                  src={editableImageUrl || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=300&q=80'}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"></div>
              </div>
            </div>

            <div className="my-2 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent"></div>

            <p className="text-[11px] text-slate-300/85 line-clamp-2 leading-relaxed">
              {editableSummary || (isAr ? 'الموجز التحريري المعروض أسفل الفاصل مباشرة بالصفحة الرئيسية...' : 'Summary text appearing below divider on frontpage...')}
            </p>
          </div>
        </div>

        {/* Column B: URL, Upload, and Presets */}
        <div className="lg:col-span-7 space-y-3.5">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>{isAr ? 'رابط الصورة المباشر (URL):' : 'Direct Image URL:'}</span>
              </span>
              {editableImageUrl && (
                <button
                  type="button"
                  onClick={() => setEditableImageUrl('')}
                  className="text-[10px] text-rose-400 hover:text-rose-300 hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>{isAr ? 'إزالة / إعادة ضبط' : 'Clear'}</span>
                </button>
              )}
            </label>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={editableImageUrl}
                  onChange={(e) => setEditableImageUrl(e.target.value)}
                  placeholder={isAr ? "الصق رابط صورة المقال هنا (https://...)" : "Paste image URL here (https://...)"}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <button
                type="button"
                onClick={onUploadClick}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                <span>{isAr ? 'رفع من الجهاز' : 'Upload File'}</span>
              </button>
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAr ? 'نماذج صور صحفية واقتصادية جاهزة عالية الدقة:' : 'High-Resolution Pan-African Photo Presets:'}</span>
            </span>

            <div className="flex flex-wrap gap-1.5">
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setEditableImageUrl(preset.url)}
                  className={`px-2.5 py-1.5 rounded-lg text-[10.5px] font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                    editableImageUrl === preset.url
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                      : 'bg-slate-950/80 hover:bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span>{isAr ? preset.nameAr : preset.nameEn}</span>
                  {editableImageUrl === preset.url && (
                    <Check className="w-3 h-3 text-amber-400" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
