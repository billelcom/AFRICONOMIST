'use client';

import React, { useState } from 'react';
import { 
  Video, 
  Play, 
  Pause, 
  Clock, 
  Calendar, 
  Tag, 
  Eye, 
  Share2, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2,
  Film,
  Sparkles,
  Maximize2
} from 'lucide-react';

interface VideoReport {
  id: number;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  categoryAr: string;
  categoryEn: string;
  duration: string;
  date: string;
  views: string;
  thumbnail: string;
  reporterAr: string;
  reporterEn: string;
}

const VIDEO_REPORTS: VideoReport[] = [
  {
    id: 1,
    titleAr: 'وثائقي استقصائي: ممرات التجارة البينية AfCFTA وخارطة الموانئ المحورية',
    titleEn: 'Investigative Documentary: AfCFTA Trade Corridors & Port Hub Infrastructure',
    descAr: 'تحقيق ميداني يرصد حركة الحاويات في موانئ طنجة المتوسط، دوربان، وليكي بنيجيريا، وتأثير الربط الرقمي والسككي على تكلفة الشحن.',
    descEn: 'Field investigation tracking maritime container efficiency at Tanger Med, Durban, and Lekki Deep Sea Port.',
    categoryAr: 'وثائقي استقصائي',
    categoryEn: 'Investigative Documentary',
    duration: '18:45',
    date: '2026-09-22',
    views: '48.2K',
    thumbnail: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80',
    reporterAr: 'فريق التحقيقات الميدانية - لاغوس والدار البيضاء',
    reporterEn: 'Field Investigation Desk - Lagos & Casablanca'
  },
  {
    id: 2,
    titleAr: 'تقرير ميداني: مناجم الليثيوم في زيمبابوي ومستقبل تصنيع البطاريات القارية',
    titleEn: 'Field Report: Zimbabwe Lithium Mines & Continental Battery Manufacturing',
    descAr: 'جولة داخل مناجم بيكيتا وغورومونزي، وفحص سياسات حظر تصدير الخام غير المعالج لتوطين صناعة الخلايا الكهربائية.',
    descEn: 'Inside Bikita and Goromonzi lithium deposits examining export ban policies and domestic value addition.',
    categoryAr: 'تغطية ميدانية',
    categoryEn: 'Field Report',
    duration: '12:20',
    date: '2026-09-18',
    views: '32.9K',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    reporterAr: 'مكتب هراري وجوهانسبرغ',
    reporterEn: 'Harare & Johannesburg Bureau'
  },
  {
    id: 3,
    titleAr: 'بورتريه اقتصادي: قادة شركات التكنولوجيا المالية الصاعدة في نيجيريا وكينيا',
    titleEn: 'Economic Portrait: Fintech Pioneers Shaping East & West African Liquidity',
    descAr: 'لقاءات حصرية مع مؤسسي منصات المدفوعات والتمويل المفتوح التي غيرت تعاملات التجارة غير الرسمية في نيروبي ولاغوس.',
    descEn: 'Exclusive interviews with fintech founders revolutionizing MSME digital payments across Nairobi and Lagos.',
    categoryAr: 'لقاء خاص',
    categoryEn: 'Special Feature',
    duration: '15:10',
    date: '2026-09-14',
    views: '26.4K',
    thumbnail: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80',
    reporterAr: 'مكتب نيروبي للاقتصاد الرقمي',
    reporterEn: 'Nairobi Digital Economy Desk'
  },
  {
    id: 4,
    titleAr: 'رسوم متحركة بيانية: كيف تتشكل أسعار صرف العملات الإفريقية وسوق الموازاة؟',
    titleEn: 'Data Animation: Parallel FX Markets & African Currency Formation Mechanics',
    descAr: 'شرح مبسط وتفاعلي بالبيانات الاقتصادية لحركة العملات الأجنبية، دور الفائدة الأمريكية، واحتياطيات البنوك المركزية.',
    descEn: 'Visual data explainer exploring the gap between official and parallel exchange rates across frontier economies.',
    categoryAr: 'صحافة مصورة وبيانات',
    categoryEn: 'Visual Data Journalism',
    duration: '07:35',
    date: '2026-09-09',
    views: '54.1K',
    thumbnail: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80',
    reporterAr: 'وحدة صحافة البيانات - لافريكونوميست',
    reporterEn: 'Data Journalism Unit - L’Africonomist'
  }
];

interface VideoReportsViewProps {
  lang: 'ar' | 'en';
  onNavigateHome: () => void;
}

export const VideoReportsView: React.FC<VideoReportsViewProps> = ({
  lang,
  onNavigateHome
}) => {
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const [activeVideoId, setActiveVideoId] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const activeVideo = VIDEO_REPORTS.find(v => v.id === activeVideoId) || VIDEO_REPORTS[0];

  const handleShare = (id: number) => {
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-10 pb-16 animate-in fade-in duration-300">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#150d1a] via-[#0e0915] to-[#07050b] border border-slate-800 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
            <Video className="w-3.5 h-3.5" />
            <span>{isAr ? 'الصحافة المصورة والوثائقيات المالية' : 'Visual Journalism & Documentaries'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            {isAr ? 'التقارير المصورة | وثائقيات الاقتصاد الإفريقي' : 'Video Reports | African Financial Documentaries'}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
            {isAr
              ? 'إنتاج استقصائي مرئي فائق الدقة، يرصد من الميدان مسارات التجارة، تحولات الطاقة، وتحديات التنمية الصناعية عبر كافة دول القارة.'
              : 'High-impact investigative visual journalism documenting port corridors, industrial parks, mineral corridors, and fiscal policy from the ground.'}
          </p>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={onNavigateHome}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <span>{isAr ? 'العودة للرئيسية' : 'Back to Home'}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs text-slate-400">
              {isAr ? 'إنتاج حصري لوحدة التحقيقات المرئية' : 'Exclusive L’Africonomist Documentary Productions'}
            </span>
          </div>
        </div>
      </div>

      {/* Featured Video Player Showcase */}
      <div className="rounded-2xl bg-[#0a0d17] border border-rose-500/40 overflow-hidden shadow-2xl space-y-4">
        <div className="relative aspect-video w-full bg-black group overflow-hidden">
          <img 
            src={activeVideo.thumbnail} 
            alt={activeVideo.titleAr}
            className={`w-full h-full object-cover transition-transform duration-700 ${isPlaying ? 'scale-105' : ''}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

          {/* Central Play/Pause Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-rose-600/90 hover:bg-rose-500 text-white flex items-center justify-center shadow-2xl shadow-rose-600/50 transition-all hover:scale-110 active:scale-95 cursor-pointer"
              aria-label={isPlaying ? 'Pause Video' : 'Play Video'}
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 fill-current" />
              ) : (
                <Play className="w-8 h-8 fill-current ml-1" />
              )}
            </button>
          </div>

          {/* Live Playing Indicator */}
          {isPlaying && (
            <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 rounded-full bg-rose-600/90 text-white text-xs font-bold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-white" />
              <span>{isAr ? 'جاري العرض الآن (4K HDR)' : 'Streaming Now (4K HDR)'}</span>
            </div>
          )}

          {/* Video Lower Third Info */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
            <div className="space-y-1 max-w-2xl">
              <span className="px-2.5 py-0.5 rounded bg-rose-500/30 text-rose-300 text-xs font-mono font-bold">
                {isAr ? activeVideo.categoryAr : activeVideo.categoryEn}
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-white drop-shadow-md">
                {isAr ? activeVideo.titleAr : activeVideo.titleEn}
              </h2>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-black/80 text-white font-mono text-xs font-bold shrink-0">
              {activeVideo.duration}
            </span>
          </div>
        </div>

        {/* Video Metadata & Description */}
        <div className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="space-y-1 text-xs text-slate-400">
              <p className="text-amber-400 font-serif font-bold text-sm">
                {isAr ? activeVideo.reporterAr : activeVideo.reporterEn}
              </p>
              <div className="flex items-center gap-3">
                <span>{activeVideo.date}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  {activeVideo.views} {isAr ? 'مشاهدة' : 'views'}
                </span>
              </div>
            </div>

            <button
              onClick={() => handleShare(activeVideo.id)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium transition-colors"
            >
              {copiedId === activeVideo.id ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{isAr ? 'تم نسخ الرابط!' : 'Link Copied!'}</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>{isAr ? 'مشاركة التقرير' : 'Share Video'}</span>
                </>
              )}
            </button>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {isAr ? activeVideo.descAr : activeVideo.descEn}
          </p>
        </div>
      </div>

      {/* Documentary Grid */}
      <div className="space-y-4">
        <div className="border-b border-slate-800 pb-2 flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Film className="w-4 h-4 text-rose-400" />
            {isAr ? 'كافة الوثائقيات والتقارير المصورة' : 'All Video Documentaries'}
          </h3>
          <span className="text-xs text-rose-400 font-mono font-bold">
            {VIDEO_REPORTS.length} {isAr ? 'أعمال مرئية' : 'Reports'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {VIDEO_REPORTS.map((vid) => (
            <div
              key={vid.id}
              onClick={() => {
                setActiveVideoId(vid.id);
                setIsPlaying(true);
                window.scrollTo({ top: 120, behavior: 'smooth' });
              }}
              className={`group rounded-xl overflow-hidden border cursor-pointer transition-all ${
                activeVideoId === vid.id
                  ? 'bg-[#101424] border-rose-500/60 ring-1 ring-rose-500/30 shadow-xl'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="aspect-video relative overflow-hidden bg-slate-950">
                <img 
                  src={vid.thumbnail} 
                  alt={vid.titleAr}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-rose-600/90 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                </div>
                <span className="absolute bottom-2 right-2 text-[10px] px-2 py-0.5 rounded bg-black/80 text-white font-mono font-bold">
                  {vid.duration}
                </span>
              </div>

              <div className="p-4 space-y-2">
                <span className="text-[10px] text-rose-400 font-mono font-medium block">
                  {isAr ? vid.categoryAr : vid.categoryEn}
                </span>
                <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug group-hover:text-amber-400 transition-colors">
                  {isAr ? vid.titleAr : vid.titleEn}
                </h4>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span>{vid.date}</span>
                  <span>{vid.views} {isAr ? 'مشاهدة' : 'views'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
