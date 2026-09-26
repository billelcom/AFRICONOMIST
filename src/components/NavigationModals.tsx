// src/components/NavigationModals.tsx
import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Mic, 
  Video, 
  Lock, 
  Mail, 
  UserCheck, 
  Play, 
  Sparkles, 
  CheckCircle2, 
  FileText,
  Volume2
} from 'lucide-react';

export type NavModalType = 'about' | 'privacy' | 'podcast' | 'video' | 'auth' | null;

interface NavigationModalsProps {
  activeModal: NavModalType;
  onClose: () => void;
  lang: 'ar' | 'en';
  onNavigateToNewsroom?: () => void;
}

export const NavigationModals: React.FC<NavigationModalsProps> = ({
  activeModal,
  onClose,
  lang,
  onNavigateToNewsroom
}) => {
  const isAr = lang === 'ar';
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [isAuthSuccess, setIsAuthSuccess] = useState(false);
  const [playingPodcastId, setPlayingPodcastId] = useState<number | null>(null);

  if (!activeModal) return null;

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthSuccess(true);
    setTimeout(() => {
      setIsAuthSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#0A0E17] border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative max-h-[85vh] overflow-y-auto ring-1 ring-amber-500/20">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 sm:left-auto sm:right-4 text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-900 border border-slate-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 1. من نحن (About Us) */}
        {activeModal === 'about' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">
                  {isAr ? 'لافريكونوميست | من نحن' : 'L’Africonomist | About Us'}
                </h3>
                <p className="text-xs text-amber-400 font-serif">
                  {isAr ? 'صحيفة الاقتصاد الإفريقي المستقلة' : 'The Independent African Economic Journal'}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                {isAr 
                  ? '«لافريكونوميست» هي صحيفة ومؤسسة صحفية مالية متخصصة في رصد التحولات الاستثمارية، السياسات النقدية، وثروات القارة الأفريقية عبر الـ 54 دولة.'
                  : 'L’Africonomist is a premier independent financial publication dedicated to tracking macroeconomic shifts, monetary policy, and capital markets across all 54 African nations.'}
              </p>
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <span className="font-bold text-amber-400 block">
                  {isAr ? 'رسالتنا التحريرية الصارمة:' : 'Our Editorial Mission:'}
                </span>
                <ul className="space-y-1.5 text-slate-400 list-disc list-inside">
                  <li>{isAr ? 'صحافة بيانات استقصائية مدعومة بالوثائق الرسمية والأرقام المقارنة.' : 'Data-backed investigative journalism grounded in official primary records.'}</li>
                  <li>{isAr ? 'مبدأ الرقابة البشرية المشددة (Human-in-the-Loop) قبل إجازة أي تقرير.' : 'Strict Human-in-the-Loop oversight before any editorial publishing.'}</li>
                  <li>{isAr ? 'استقلالية كاملة وتغطية شاملة لكافة أقاليم القارة من القاهرة إلى جوهانسبرغ.' : 'Uncompromising independence covering all continental regions from Cairo to Johannesburg.'}</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 2. الشروط والخصوصية (Terms & Privacy) */}
        {activeModal === 'privacy' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">
                  {isAr ? 'ميثاق النزاهة التحريرية والخصوصية' : 'Editorial Integrity & Privacy Charter'}
                </h3>
                <p className="text-xs text-slate-400">
                  {isAr ? 'صحيفة الاقتصاد الإفريقي' : 'African Economic Journal Standard'}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="font-bold text-rose-400 block">
                  {isAr ? '1. حماية المصادر وسرية البيانات' : '1. Source Protection & Data Confidentiality'}
                </span>
                <p className="text-slate-400">
                  {isAr 
                    ? 'نلتزم بأعلى معايير حماية البيانات المالية المشفرة ومصادر التسريبات الاستقصائية وفق المواثيق الدولية لحرية الصحافة المالية.'
                    : 'We adhere to the highest global encryption standards and confidential source protection for financial whistleblowers.'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="font-bold text-emerald-400 block">
                  {isAr ? '2. التزام الحياد ومكافحة التضليل المالي' : '2. Impartiality & Zero Market Manipulation'}
                </span>
                <p className="text-slate-400">
                  {isAr 
                    ? 'يحظر على محررينا وكتّابنا أي تضارب في المصالح أو المتاجرة بالأسهم والسندات بناءً على معلومات غير معلنة.'
                    : 'Our editorial desk strictly prohibits insider trading, conflict of interest, or biased financial promotion.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 3. البودكاست (Podcasts) */}
        {activeModal === 'podcast' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">
                  {isAr ? 'بودكاست لافريكونوميست' : 'L’Africonomist Podcast'}
                </h3>
                <p className="text-xs text-indigo-400">
                  {isAr ? 'صوت الاقتصاد والأسواق الإفريقية الأسبوعي' : 'Weekly African Macro & Markets Brief'}
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {[
                { id: 1, titleAr: 'الحلقة 42: أسرار السيولة في غرب أفريقيا ومستقبل الفرنك الإفريقي', titleEn: 'Ep. 42: West Africa Liquidity & The Eco Currency Future', dur: '28:15', date: 'اليوم' },
                { id: 2, titleAr: 'الحلقة 41: ثورة الهيدروجين الأخضر والتعدين في شمال وجنوب القارة', titleEn: 'Ep. 41: Green Hydrogen & Critical Minerals Revolution', dur: '34:40', date: 'منذ يومين' },
                { id: 3, titleAr: 'الحلقة 40: كواليس الديون السيادية وسندات اليوروبوند في 2026', titleEn: 'Ep. 40: Sovereign Debt Restructuring & Eurobonds in 2026', dur: '41:10', date: 'الأسبوع الماضي' },
              ].map((item) => (
                <div key={item.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setPlayingPodcastId(playingPodcastId === item.id ? null : item.id)}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                        playingPodcastId === item.id 
                          ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/40' 
                          : 'bg-slate-800 text-indigo-400 hover:bg-indigo-500/20'
                      }`}
                    >
                      {playingPodcastId === item.id ? <Volume2 className="w-4 h-4 animate-pulse" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                    </button>
                    <div>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{isAr ? item.titleAr : item.titleEn}</h4>
                      <span className="text-[10px] text-slate-400">{item.date} · {item.dur} دقيقة</span>
                    </div>
                  </div>
                  {playingPodcastId === item.id && (
                    <span className="text-[10px] text-indigo-400 font-mono px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/30 shrink-0">
                      {isAr ? 'جاري التشغيل...' : 'Playing...'}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. التقارير المصورة (Video Reports) */}
        {activeModal === 'video' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">
                  {isAr ? 'التقارير المصورة والوثائقيات الاقتصادية' : 'Video Reports & Economic Documentaries'}
                </h3>
                <p className="text-xs text-rose-400">
                  {isAr ? 'صحيفة الاقتصاد الإفريقي المرئية' : 'Visual African Financial Journalism'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 1, titleAr: 'وثائقي: ممرات التجارة البينية AfCFTA وخارطة الموانئ', tag: 'تحقيق مرئي', dur: '12:40' },
                { id: 2, titleAr: 'تقرير ميداني: مناجم الليثيوم في زيمبابوي ومستقبل البطاريات', tag: 'تغطية ميدانية', dur: '08:25' },
                { id: 3, titleAr: 'بورتريه: قادة الفنتك الصاعدون في نيجيريا وكينيا', tag: 'لقاء خاص', dur: '15:10' },
                { id: 4, titleAr: 'رسوم متحركة بيانية: كيف تتشكل أسعار صرف العملات الإفريقية؟', tag: 'صحافة مصورة', dur: '06:50' },
              ].map((v) => (
                <div key={v.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2 group cursor-pointer hover:border-amber-500/30 transition-colors">
                  <div className="aspect-video rounded-lg bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center relative overflow-hidden border border-slate-800">
                    <div className="w-8 h-8 rounded-full bg-amber-500/90 text-slate-950 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </div>
                    <span className="absolute bottom-1.5 right-1.5 text-[9px] px-1.5 py-0.5 rounded bg-black/70 text-slate-200 font-mono">
                      {v.dur}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-2">{v.titleAr}</h4>
                  <span className="text-[10px] text-amber-400/80 block">{v.tag}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. التسجيل (Authentication / Membership) */}
        {activeModal === 'auth' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">
                  {isAr ? 'تسجيل الدخول وعضوية القراء' : 'Reader Membership & Sign In'}
                </h3>
                <p className="text-xs text-amber-400 font-serif">
                  {isAr ? 'لافريكونوميست · صحيفة الاقتصاد الإفريقي' : 'L’Africonomist · African Economic Journal'}
                </p>
              </div>
            </div>

            {isAuthSuccess ? (
              <div className="p-6 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">
                  {isAr ? 'تم تسجيل الدخول بنجاح!' : 'Welcome back! Signed in successfully.'}
                </h4>
                <p className="text-xs text-slate-400">
                  {isAr ? 'مرحباً بك في دائرة قراء لافريكونوميست الاقتصادية الموثوقة.' : 'Enjoy full access to premium African economic intelligence.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleAuthSubmit} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{isAr ? 'البريد الإلكتروني المهني' : 'Work Email'}</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="analyst@bloomberg-africa.com"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/60"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{isAr ? 'كلمة المرور' : 'Password'}</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/60"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-medium text-xs transition-colors"
                  >
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>{isAr ? 'دخول / تسجيل فوري' : 'Sign In / Register'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Modal Footer */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <span>{isAr ? 'لافريكونوميست © 2026' : 'L’Africonomist © 2026'}</span>
          {onNavigateToNewsroom && (
            <button
              onClick={() => {
                onClose();
                onNavigateToNewsroom();
              }}
              className="text-amber-400/80 hover:text-amber-300 underline"
            >
              {isAr ? 'الانتقال إلى غرفة الأخبار' : 'Go to Newsroom'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
