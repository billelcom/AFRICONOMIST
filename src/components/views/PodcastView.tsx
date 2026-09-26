'use client';

import React, { useState } from 'react';
import { 
  Mic, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Clock, 
  Calendar, 
  Tag, 
  Headphones, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  Share2,
  Download,
  CheckCircle2
} from 'lucide-react';

interface PodcastEpisode {
  id: number;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  guestAr: string;
  guestEn: string;
  duration: string;
  date: string;
  categoryAr: string;
  categoryEn: string;
  audioLengthSec: number;
}

const PODCAST_EPISODES: PodcastEpisode[] = [
  {
    id: 1,
    titleAr: 'الحلقة 42: أسرار السيولة في غرب أفريقيا ومستقبل عملة «الإيكو» الموحدة',
    titleEn: 'Ep. 42: West African Liquidity & The Strategic Future of the Eco Currency',
    descAr: 'تحليل استقصائي حول خطط البنك المركزي لدول غرب أفريقيا (BCEAO)، وتحديات فك الارتباط بالفرنك الإفريقي CFA، وحجم احتياطيات النقد الأجنبي.',
    descEn: 'Deep-dive inquiry into BCEAO central bank reserves, the political economy of delinking from the CFA franc, and sovereign FX stability.',
    guestAr: 'د. ممادو ديالو - خبير السياسات النقدية الإقليمية',
    guestEn: 'Dr. Mamadou Diallo - Regional Monetary Policy Fellow',
    duration: '28:15',
    date: '2026-09-24',
    categoryAr: 'السياسات النقدية والعملات',
    categoryEn: 'Monetary Policy & Currencies',
    audioLengthSec: 1695
  },
  {
    id: 2,
    titleAr: 'الحلقة 41: ثورة الهيدروجين الأخضر والتعدين الحرج بين شمال وجنوب القارة',
    titleEn: 'Ep. 41: Green Hydrogen Mega-Projects & Critical Minerals Extraction',
    descAr: 'كيف تعيد مشاريع الطاقة المتجددة في الجزائر، المغرب، موريتانيا، ومناجم الليثيوم في ناميبيا وزيمبابوي رسم سلاسل الإمداد العالمية؟',
    descEn: 'Analyzing hydrogen mega-hubs in North Africa and critical battery mineral corridors driving clean energy geopolitics.',
    guestAr: 'م. سفيان بلقاسم - استشاري أسواق الطاقة الإفريقية',
    guestEn: 'Eng. Sofiane Belkacem - Energy Transition Consultant',
    duration: '34:40',
    date: '2026-09-20',
    categoryAr: 'الطاقة والتعدين',
    categoryEn: 'Energy & Mining',
    audioLengthSec: 2080
  },
  {
    id: 3,
    titleAr: 'الحلقة 40: كواليس إعادة هيكلة الديون السيادية وسندات اليوروبوند في 2026',
    titleEn: 'Ep. 40: Sovereign Debt Restructuring & Eurobond Issuance Dynamics',
    descAr: 'قراءة في تسويات إطار العمل المشترك لمجموعة العشرين، وخيارات كينيا وزامبيا وغانا لإعادة التوازن المالي وتجنب التخلف عن السداد.',
    descEn: 'Behind the scenes of G20 Common Framework restructurings, sovereign spreads, and debt sustainability across Sub-Saharan Africa.',
    guestAr: 'أ. كلير نوانكو - محللة أسواق السندات السيادية - لاغوس',
    guestEn: 'Claire Nwankwo - Sovereign Debt Analyst, Lagos',
    duration: '41:10',
    date: '2026-09-15',
    categoryAr: 'الأسواق المالية والديون',
    categoryEn: 'Capital Markets & Debt',
    audioLengthSec: 2470
  },
  {
    id: 4,
    titleAr: 'الحلقة 39: منطقة التجارة الحرة القارية (AfCFTA): أين وصلت سلاسل القيمة؟',
    titleEn: 'Ep. 39: AfCFTA Implementation Reality: Intra-African Trade Corridors',
    descAr: 'تقييم شامل لشهادات المنشأ الرقمية، الربط الجمركي، وحركة الشحن البحري والجوي بين الموانئ المحورية في القارة.',
    descEn: 'Real-world assessment of digital rules of origin, customs interoperability, and multimodal logistics corridors.',
    guestAr: 'د. كواسي منساه - منسق مبادرات التجارة البينية',
    guestEn: 'Dr. Kwasi Mensah - Intra-African Trade Coordinator',
    duration: '31:25',
    date: '2026-09-08',
    categoryAr: 'التجارة والصناعة',
    categoryEn: 'Trade & Industry',
    audioLengthSec: 1885
  }
];

interface PodcastViewProps {
  lang: 'ar' | 'en';
  onNavigateHome: () => void;
}

export const PodcastView: React.FC<PodcastViewProps> = ({
  lang,
  onNavigateHome
}) => {
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const [activeEpisodeId, setActiveEpisodeId] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progressSec, setProgressSec] = useState<number>(315);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const currentEpisode = PODCAST_EPISODES.find(e => e.id === activeEpisodeId) || PODCAST_EPISODES[0];

  const togglePlay = (id: number) => {
    if (activeEpisodeId === id) {
      setIsPlaying(!isPlaying);
    } else {
      setActiveEpisodeId(id);
      setIsPlaying(true);
      setProgressSec(0);
    }
  };

  const handleShare = (id: number) => {
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const formatSec = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-10 pb-16 animate-in fade-in duration-300">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0e1225] via-[#090d1a] to-[#05070e] border border-slate-800 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
            <Mic className="w-3.5 h-3.5" />
            <span>{isAr ? 'الصحافة الصوتية والتحليل الأسبوعي' : 'Audio Journalism & Weekly Macro Briefs'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            {isAr ? 'بودكاست لافريكونوميست | صوت الاقتصاد الإفريقي' : 'L’Africonomist Podcast | Voice of African Finance'}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
            {isAr
              ? 'حوارات معمقة وتحقيقات صوتية حصرية مع كبار واضعي السياسات النقدية، محافظي البنوك المركزية، ومديري صناديق الاستثمار في القارة الإفريقية.'
              : 'In-depth investigative audio dialogues with central bank governors, sovereign wealth advisors, and institutional asset managers across Africa.'}
          </p>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={onNavigateHome}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <span>{isAr ? 'العودة للرئيسية' : 'Back to Home'}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs text-slate-400">
              {isAr ? 'متاح أسبوعياً عبر كافة منصات البودكاست' : 'Available weekly on Apple, Spotify & Google Podcasts'}
            </span>
          </div>
        </div>
      </div>

      {/* Featured Interactive Player */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0d1428] via-[#090e1c] to-[#060914] border border-indigo-500/40 shadow-xl space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold">
                {isAr ? currentEpisode.categoryAr : currentEpisode.categoryEn}
              </span>
              <span className="text-slate-400 text-xs flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-500" />
                {currentEpisode.date}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white truncate">
              {isAr ? currentEpisode.titleAr : currentEpisode.titleEn}
            </h2>
            <p className="text-xs text-amber-400 font-serif">
              {isAr ? `ضيف الحلقة: ${currentEpisode.guestAr}` : `Guest: ${currentEpisode.guestEn}`}
            </p>
          </div>

          <button
            onClick={() => handleShare(currentEpisode.id)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors shrink-0"
            title={isAr ? 'مشاركة الحلقة' : 'Share episode'}
          >
            {copiedId === currentEpisode.id ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Scrub Bar & Player Controls */}
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-3">
            <button
              onClick={() => togglePlay(currentEpisode.id)}
              className="w-12 h-12 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 transition-all active:scale-95 shrink-0"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            <div className="flex-1 space-y-1">
              <div 
                className="w-full h-2 rounded-full bg-slate-800 overflow-hidden cursor-pointer relative"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                  setProgressSec(Math.round(pct * currentEpisode.audioLengthSec));
                }}
              >
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-amber-400 transition-all duration-150"
                  style={{ width: `${(progressSec / currentEpisode.audioLengthSec) * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>{formatSec(progressSec)}</span>
                <span>{currentEpisode.duration}</span>
              </div>
            </div>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors shrink-0"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Episode Archive List */}
      <div className="space-y-4">
        <div className="border-b border-slate-800 pb-2 flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Headphones className="w-4 h-4 text-indigo-400" />
            {isAr ? 'أرشيف الحلقات الكامل' : 'All Published Episodes'}
          </h3>
          <span className="text-xs text-indigo-400 font-mono">
            {PODCAST_EPISODES.length} {isAr ? 'حلقات' : 'Episodes'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PODCAST_EPISODES.map((ep) => (
            <div
              key={ep.id}
              className={`p-5 rounded-2xl border transition-all ${
                activeEpisodeId === ep.id
                  ? 'bg-[#0d1428] border-indigo-500/50 ring-1 ring-indigo-500/30 shadow-lg'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => togglePlay(ep.id)}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                    activeEpisodeId === ep.id && isPlaying
                      ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/40'
                      : 'bg-slate-800 text-indigo-400 hover:bg-indigo-500/20'
                  }`}
                  aria-label="Play episode"
                >
                  {activeEpisodeId === ep.id && isPlaying ? (
                    <Pause className="w-5 h-5 fill-current" />
                  ) : (
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  )}
                </button>

                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-mono font-medium">
                      {isAr ? ep.categoryAr : ep.categoryEn}
                    </span>
                    <span className="text-slate-400">{ep.duration} دقيقة</span>
                    <span className="text-slate-500">·</span>
                    <span className="text-slate-400">{ep.date}</span>
                  </div>

                  <h4 className="text-sm font-bold text-white line-clamp-2">
                    {isAr ? ep.titleAr : ep.titleEn}
                  </h4>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {isAr ? ep.descAr : ep.descEn}
                  </p>

                  <div className="pt-1 flex items-center justify-between text-xs text-amber-400 font-serif">
                    <span className="truncate">{isAr ? ep.guestAr : ep.guestEn}</span>
                    {activeEpisodeId === ep.id && isPlaying && (
                      <span className="text-[10px] text-emerald-400 font-mono font-bold animate-pulse">
                        {isAr ? 'جاري الاستماع الآن' : 'Now Playing'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
