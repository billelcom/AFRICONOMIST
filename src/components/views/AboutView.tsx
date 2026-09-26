'use client';

import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Globe2, 
  Users, 
  Award, 
  CheckCircle2, 
  Mail, 
  MessageCircle, 
  FileText, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  TrendingUp,
  Cpu
} from 'lucide-react';

interface AboutViewProps {
  lang: 'ar' | 'en';
  onNavigateHome: () => void;
  onNavigateToNewsroom?: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({
  lang,
  onNavigateHome,
  onNavigateToNewsroom
}) => {
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  return (
    <div className="space-y-10 pb-16 animate-in fade-in duration-300">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c1322] via-[#090d18] to-[#05070f] border border-slate-800 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5" />
            <span>{isAr ? 'من نحن | المؤسسة والرسالة الصحفية' : 'About Us | Institutional Profile'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            {isAr ? 'لافريكونوميست | صحيفة الاقتصاد الإفريقي' : 'L’Africonomist | African Economic Journal'}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
            {isAr
              ? 'مؤسسة صحفية واستقصائية مالية رائدة ومستقلة، متخصصة في رصد تدفقات رؤوس الأموال، أسواق السندات، سياسات الطاقة، والتحولات الكبرى في اقتصادات القارة الإفريقية عبر الـ 54 دولة.'
              : 'The leading independent continental financial publication, tracking sovereign debt, capital markets, critical mineral supply chains, and macroeconomic trends across all 54 African nations.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onNavigateHome}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <span>{isAr ? 'العودة للرئيسية والأسواق' : 'Return to Markets'}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </button>
            {onNavigateToNewsroom && (
              <button
                onClick={onNavigateToNewsroom}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 font-medium text-xs transition-colors"
              >
                {isAr ? 'غرفة الأخبار والتدقيق' : 'Newsroom Desk'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* القيادة التحريرية والنشر */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-[#0b101d] border border-amber-500/30 space-y-4 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl" />
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/30 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-amber-400 font-mono font-bold block uppercase tracking-wider">
                {isAr ? 'القيادة التنفيذية والتحريرية' : 'Executive & Editorial Leadership'}
              </span>
              <h2 className="text-lg font-black text-white">
                {isAr ? 'بلال عويش' : 'Billel Aouiche'}
              </h2>
              <p className="text-xs text-slate-400">
                {isAr ? 'المدير العام مسؤول النشر' : 'Publishing Director & General Manager'}
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {isAr
              ? 'يقود الأستاذ بلال عويش الرؤية الإستراتيجية لمشروع «بلومبرغ لأفريقيا»، مع التركيز على التحقيق المعمق في الثروات السيادية، حوكمة الطاقة، وتطوير البنية التقنية المستقلة للصحافة المالية المدعومة بالذكاء الاصطناعي المسؤول والتحقق البشري الصارم.'
              : 'Heading the strategic expansion of L’Africonomist, focusing on high-impact financial investigations, energy transition governance, and verifiable data integrity.'}
          </p>

          <div className="pt-2 flex items-center gap-3 text-xs">
            <a
              href="https://wa.me/213656180056"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span dir="ltr">+213656180056</span>
            </a>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">
              {isAr ? 'المقر الإقليمي والتحريري' : 'Continental Bureau'}
            </span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#0b101d] border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-blue-400 font-mono font-bold block uppercase tracking-wider">
                {isAr ? 'الجهة الناشرة والمطورة' : 'Publishing Entity'}
              </span>
              <h2 className="text-lg font-black text-white">
                GOODATA
              </h2>
              <p className="text-xs text-slate-400">
                {isAr ? 'المطور والبنية التحتية للبيانات الاقتصادية' : 'Financial Data & Systems Infrastructure'}
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {isAr
              ? 'تتولى GOODATA هندسة منصات البيانات الضخمة، تغذية أسعار الصرف الحية، ومحركات الربط الدلالي مع قواعد بيانات MongoDB ومؤشرات البنوك المركزية الإفريقية بما يضمن أداء لحظياً فائق الدقة.'
              : 'GOODATA provides enterprise-grade data intelligence, algorithmic market ticker feeds, and secure infrastructure powering continental economic analytics.'}
          </p>

          <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{isAr ? 'أنظمة رصد وتدفق بيانات حية 24/7' : 'Continuous 24/7 Data Monitoring Engine'}</span>
          </div>
        </div>
      </div>

      {/* ركائز العمل الصحفي الثلاث */}
      <div className="space-y-4">
        <div className="border-b border-slate-800 pb-2">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            {isAr ? 'الركائز التحريرية والتكنولوجية لمنصتنا' : 'Core Editorial & Architectural Pillars'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">
              {isAr ? '1. الرقابة البشرية المشددة (HITL)' : '1. Human-in-the-Loop'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isAr
                ? 'لا يُنشر أي تقرير أو مادة مولدة آلياً إلا بعد مراجعة وتدقيق وتوقيع بشري معتمد، مع احتساب مؤشر موثوقية لكل رقم ومصدر.'
                : 'Every automated brief requires accredited human editorial audit and verification scoring prior to publication.'}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Globe2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">
              {isAr ? '2. تغطية شاملة لكافة الـ 54 دولة' : '2. All 54 African Nations'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isAr
                ? 'من الاقتصادات الكبرى (جنوب أفريقيا، نيجيريا، مصر، الجزائر) إلى الدول الجزرية والناشئة، نوفر ملفاً اقتصادياً محدثاً لكل دولة دون استثناء.'
                : 'From the largest GDP leaders to emerging island economies, comprehensive dossiers cover every African nation.'}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">
              {isAr ? '3. معمارية Zero-Trust للبيانات' : '3. Zero-Trust Security'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isAr
                ? 'فصل صارم بين أسرار النظام، ومصادر الوثائق، وتأمين قنوات التسريب للمبلغين وحماية تامة للمصادر المالية.'
                : 'Enterprise secrets isolation, verified citation chains, and encrypted intake for whistleblower intelligence.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
