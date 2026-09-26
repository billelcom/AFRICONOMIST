// src/components/views/StaticViews.tsx
import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Mic, 
  Video, 
  FileText,
  Play,
  Volume2
} from 'lucide-react';

interface StaticViewProps {
  lang: 'ar' | 'en';
}

export const AboutView: React.FC<StaticViewProps> = ({ lang }) => {
  const isAr = lang === 'ar';
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 border-b border-slate-800 pb-6">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <FileText className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {isAr ? 'لافريكونوميست | من نحن' : 'L’Africonomist | About Us'}
          </h1>
          <p className="text-sm text-amber-400 font-serif mt-1">
            {isAr ? 'صحيفة الاقتصاد الإفريقي المستقلة' : 'The Independent African Economic Journal'}
          </p>
        </div>
      </div>
      <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
        <p className="text-base text-slate-200">
          {isAr 
            ? '«لافريكونوميست» هي صحيفة ومؤسسة صحفية مالية متخصصة في رصد التحولات الاستثمارية، السياسات النقدية، وثروات القارة الأفريقية عبر الـ 54 دولة.'
            : 'L’Africonomist is a premier independent financial publication dedicated to tracking macroeconomic shifts, monetary policy, and capital markets across all 54 African nations.'}
        </p>
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <span className="font-bold text-amber-400 block text-lg">
            {isAr ? 'رسالتنا التحريرية الصارمة:' : 'Our Editorial Mission:'}
          </span>
          <ul className="space-y-3 text-slate-400 list-disc list-inside">
            <li>{isAr ? 'صحافة بيانات استقصائية مدعومة بالوثائق الرسمية والأرقام المقارنة.' : 'Data-backed investigative journalism grounded in official primary records.'}</li>
            <li>{isAr ? 'مبدأ الرقابة البشرية المشددة (Human-in-the-Loop) قبل إجازة أي تقرير.' : 'Strict Human-in-the-Loop oversight before any editorial publishing.'}</li>
            <li>{isAr ? 'استقلالية كاملة وتغطية شاملة لكافة أقاليم القارة من القاهرة إلى جوهانسبرغ.' : 'Uncompromising independence covering all continental regions from Cairo to Johannesburg.'}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export const PrivacyView: React.FC<StaticViewProps> = ({ lang }) => {
  const isAr = lang === 'ar';
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 border-b border-slate-800 pb-6">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {isAr ? 'ميثاق النزاهة التحريرية والخصوصية' : 'Editorial Integrity & Privacy Charter'}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {isAr ? 'صحيفة الاقتصاد الإفريقي' : 'African Economic Journal Standard'}
          </p>
        </div>
      </div>
      <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <span className="font-bold text-rose-400 block text-lg">
            {isAr ? '1. حماية المصادر وسرية البيانات' : '1. Source Protection & Data Confidentiality'}
          </span>
          <p className="text-slate-400 text-base">
            {isAr 
              ? 'نلتزم بأعلى معايير حماية البيانات المالية المشفرة ومصادر التسريبات الاستقصائية وفق المواثيق الدولية لحرية الصحافة المالية.'
              : 'We adhere to the highest global encryption standards and confidential source protection for financial whistleblowers.'}
          </p>
        </div>
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <span className="font-bold text-emerald-400 block text-lg">
            {isAr ? '2. التزام الحياد ومكافحة التضليل المالي' : '2. Impartiality & Zero Market Manipulation'}
          </span>
          <p className="text-slate-400 text-base">
            {isAr 
              ? 'يحظر على محررينا وكتّابنا أي تضارب في المصالح أو المتاجرة بالأسهم والسندات بناءً على معلومات غير معلنة.'
              : 'Our editorial desk strictly prohibits insider trading, conflict of interest, or biased financial promotion.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export const PodcastView: React.FC<StaticViewProps> = ({ lang }) => {
  const isAr = lang === 'ar';
  const [playingPodcastId, setPlayingPodcastId] = useState<number | null>(null);
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 border-b border-slate-800 pb-6">
        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
          <Mic className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {isAr ? 'بودكاست لافريكونوميست' : 'L’Africonomist Podcast'}
          </h1>
          <p className="text-sm text-indigo-400 mt-1">
            {isAr ? 'صوت الاقتصاد والأسواق الإفريقية الأسبوعي' : 'Weekly African Macro & Markets Brief'}
          </p>
        </div>
      </div>
      <div className="space-y-4">
        {[
          { id: 1, titleAr: 'الحلقة 42: أسرار السيولة في غرب أفريقيا ومستقبل الفرنك الإفريقي', titleEn: 'Ep. 42: West Africa Liquidity & The Eco Currency Future', dur: '28:15', date: 'اليوم' },
          { id: 2, titleAr: 'الحلقة 41: ثورة الهيدروجين الأخضر والتعدين في شمال وجنوب القارة', titleEn: 'Ep. 41: Green Hydrogen & Critical Minerals Revolution', dur: '34:40', date: 'منذ يومين' },
          { id: 3, titleAr: 'الحلقة 40: كواليس الديون السيادية وسندات اليوروبوند في 2026', titleEn: 'Ep. 40: Sovereign Debt Restructuring & Eurobonds in 2026', dur: '41:10', date: 'الأسبوع الماضي' },
        ].map((item) => (
          <div key={item.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4 hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setPlayingPodcastId(playingPodcastId === item.id ? null : item.id)}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                  playingPodcastId === item.id 
                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/40' 
                    : 'bg-slate-800 text-indigo-400 hover:bg-indigo-500/20'
                }`}
              >
                {playingPodcastId === item.id ? <Volume2 className="w-6 h-6 animate-pulse" /> : <Play className="w-6 h-6 fill-current ml-1" />}
              </button>
              <div>
                <h4 className="text-base font-bold text-white mb-1">{isAr ? item.titleAr : item.titleEn}</h4>
                <span className="text-xs text-slate-400">{item.date} · {item.dur} {isAr ? 'دقيقة' : 'min'}</span>
              </div>
            </div>
            {playingPodcastId === item.id && (
              <span className="text-xs text-indigo-400 font-mono px-3 py-1 rounded bg-indigo-500/10 border border-indigo-500/30 shrink-0">
                {isAr ? 'جاري التشغيل...' : 'Playing...'}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export const VideoReportsView: React.FC<StaticViewProps> = ({ lang }) => {
  const isAr = lang === 'ar';
  
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-4 border-b border-slate-800 pb-6">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
          <Video className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {isAr ? 'التقارير المصورة والوثائقيات الاقتصادية' : 'Video Reports & Economic Documentaries'}
          </h1>
          <p className="text-sm text-rose-400 mt-1">
            {isAr ? 'صحيفة الاقتصاد الإفريقي المرئية' : 'Visual African Financial Journalism'}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { id: 1, titleAr: 'وثائقي: ممرات التجارة البينية AfCFTA وخارطة الموانئ', tag: 'تحقيق مرئي', dur: '12:40' },
          { id: 2, titleAr: 'تقرير ميداني: مناجم الليثيوم في زيمبابوي ومستقبل البطاريات', tag: 'تغطية ميدانية', dur: '08:25' },
          { id: 3, titleAr: 'بورتريه: قادة الفنتك الصاعدون في نيجيريا وكينيا', tag: 'لقاء خاص', dur: '15:10' },
          { id: 4, titleAr: 'رسوم متحركة بيانية: كيف تتشكل أسعار صرف العملات الإفريقية؟', tag: 'صحافة مصورة', dur: '06:50' },
        ].map((v) => (
          <div key={v.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 group cursor-pointer hover:border-amber-500/30 transition-colors">
            <div className="aspect-video rounded-xl bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center relative overflow-hidden border border-slate-800">
              <div className="w-12 h-12 rounded-full bg-amber-500/90 text-slate-950 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                <Play className="w-5 h-5 fill-current ml-1" />
              </div>
              <span className="absolute bottom-2 right-2 text-xs px-2 py-1 rounded-md bg-black/80 text-slate-200 font-mono">
                {v.dur}
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white line-clamp-2 leading-snug mb-2">{v.titleAr}</h4>
              <span className="text-xs text-amber-400/80 block font-medium">{v.tag}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
