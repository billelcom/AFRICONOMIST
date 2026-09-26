import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  FileText, 
  Scale, 
  AlertCircle, 
  CheckCircle2, 
  Key, 
  EyeOff, 
  Server,
  ArrowRight,
  ArrowLeft,
  Mail,
  MessageCircle
} from 'lucide-react';

interface PrivacyTermsViewProps {
  lang: 'ar' | 'en';
  onNavigateHome: () => void;
}

export const PrivacyTermsView: React.FC<PrivacyTermsViewProps> = ({
  lang,
  onNavigateHome
}) => {
  const isAr = lang === 'ar';
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>('privacy');
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  return (
    <div className="space-y-10 pb-16 animate-in fade-in duration-300">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c1322] via-[#090d18] to-[#05070f] border border-slate-800 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isAr ? 'ميثاق النزاهة والضوابط القانونية' : 'Integrity & Legal Governance'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            {isAr ? 'الشروط، الخصوصية وحماية المصادر' : 'Terms of Service, Privacy & Source Security'}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
            {isAr
              ? 'تلتزم «لافريكونوميست» بأرقى المعايير الدولية لحماية سرية البيانات، وصون مصادر الصحافة الاستقصائية المالية، وشفافية جمع واستخدام المؤشرات الاقتصادية دون أي انتهاك لحقوق القراء والمستثمرين.'
              : 'L’Africonomist is firmly committed to international benchmarks in data privacy, strict whistleblower source confidentiality, and clear terms of transparent, unbiased financial reporting.'}
          </p>

          {/* Sub-tab Switcher: Privacy vs Terms */}
          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={() => setActiveTab('privacy')}
              className={`px-4 py-2 rounded-xl font-bold transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'privacy'
                  ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isAr ? 'سياسة الخصوصية وسرية المصادر' : 'Privacy & Source Protection'}</span>
            </button>
            <button
              onClick={() => setActiveTab('terms')}
              className={`px-4 py-2 rounded-xl font-bold transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'terms'
                  ? 'bg-amber-500 text-slate-950 shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{isAr ? 'شروط الخدمة وحقوق الملكية' : 'Terms of Service'}</span>
            </button>
            <button
              onClick={onNavigateHome}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors mr-auto rtl:mr-0 rtl:ml-auto"
            >
              {isAr ? 'العودة للرئيسية' : 'Back to Home'}
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Privacy & Whistleblower Protection */}
      {activeTab === 'privacy' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <EyeOff className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-white">
                {isAr ? '1. حماية مصادر الصحافة الاستقصائية (Whistleblowers)' : '1. Whistleblower & Source Confidentiality'}
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isAr
                  ? 'تلتزم هيئة التحرير برئاسة الأستاذ بلال عويش بالحفاظ الكامل على سرية هوية أي مسرب أو مبلغ عن انتهاكات مالية، تهرّب ضريبي، أو فساد في صفقات الطاقة والتعدين داخل القارة الإفريقية وفق المادة 19 من الإعلان العالمي لحقوق الإنسان ومواثيق الصحافة الدولية.'
                  : 'Under the leadership of Publishing Director Billel Aouiche, L’Africonomist guarantees unconditional protection of confidential whistleblower identities, ensuring end-to-end encrypted intake for financial leaks and regulatory violations.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Server className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-white">
                {isAr ? '2. التشفير وتخزين البيانات' : '2. Encryption & Data Integrity'}
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isAr
                  ? 'تُعالج كافة الاتصالات والنشرات البريدية عبر تشفير TLS 1.3 المتقدم، وتُحفظ البيانات داخل قواعد بيانات مشفرة في مراكز بيانات سيادية، دون مشاركة أي معلومات للقراء أو المشتركين مع أطراف تجارية ثالثة.'
                  : 'All subscriber communications and newsletter dispatches utilize robust TLS 1.3 encryption, ensuring reader confidentiality without third-party commercial monetization.'}
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{isAr ? 'التزامات الخصوصية الأساسية للمنصة' : 'Core Privacy Commitments'}</span>
            </h2>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span>{isAr ? 'لا نبيع أو نؤجر أي بيانات شخصية أو بريد إلكتروني لأي جهة إعلانية أو استثمارية.' : 'We never sell or rent subscriber email addresses or personal metrics to ad brokers.'}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span>{isAr ? 'يحق لأي مشترك إلغاء اشتراكه في النشرة البريدية اليومية بضغطة زر واحدة في أي وقت.' : 'Subscribers may unsubscribe from the daily economic bulletin at any moment with a single click.'}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span>{isAr ? 'استخدام ملفات تعريف الارتباط يقتصر على حفظ تفضيلات اللغة وترتيب الدول في المتصفح محلياً (Local Storage).' : 'Browser storage is used strictly for storing language preferences and offline local ranking states.'}</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Tab 2: Terms of Service */}
      {activeTab === 'terms' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-white">
                {isAr ? '1. الملكية الفكرية وحقوق إعادة النشر' : '1. Intellectual Property & Syndication'}
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isAr
                  ? 'كافة التقارير الاستقصائية والرسوم البيانية والمؤشرات المركبة المنشورة في «لافريكونوميست» مملوكة حصرياً للجهة الناشرة GOODATA وهيئة التحرير. يسمح بالاقتباس المهني بشرط الإشارة الصريحة للمصدر مع رابط مباشر للمقال الأصلي.'
                  : 'All investigative dossiers, datasets, and proprietary macroeconomic composites are protected under international copyright by GOODATA and L’Africonomist. Attribution with direct backlinking is mandatory for journalistic citation.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-white">
                {isAr ? '2. إخلاء المسؤولية الاستثمارية' : '2. Financial & Investment Disclaimer'}
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isAr
                  ? 'المعلومات والتحليلات الواردة في الصحيفة غايتها الإخبارية والبحثية فقط، ولا تُعتبر بأي حال من الأحوال توصية مباشرة لبيع أو شراء أسهم، عملات، أو سندات سيادية. يتحمل المستثمر مسؤوليته الكاملة عن قراراته المالية.'
                  : 'Content published on L’Africonomist is intended strictly for journalistic and analytical research purposes, not financial or investment advice. Investors bear sole responsibility for their portfolio decisions.'}
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-400" />
              <span>{isAr ? 'معايير النزاهة وحظر التداول الداخلي' : 'Anti-Manipulation & Market Standards'}</span>
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isAr
                ? 'يُحظر على محرري ومحللي «لافريكونوميست» حيازة صفقات استثمارية أو تداول أسهم مرتبطة مباشرة بالتقارير الاستقصائية قيد الإعداد، منعاً لأي شبهة تضارب مصالح أو استفادة من معلومات داخلية غير معلنة (Insider Trading).'
                : 'L’Africonomist staff, analysts, and contributors are strictly prohibited from holding trading positions or benefiting from non-public information surrounding companies or sovereign instruments covered in upcoming reports.'}
            </p>
          </div>
        </div>
      )}

      {/* Contact Legal / Editorial Desk */}
      <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="space-y-1 text-center sm:text-right rtl:sm:text-right ltr:sm:text-left">
          <div className="font-bold text-white">{isAr ? 'استفسارات الشفافية وحماية البيانات' : 'Legal & Compliance Inquiries'}</div>
          <p className="text-slate-400 text-[11px]">
            {isAr ? 'المدير العام مسؤول النشر: بلال عويش / الناشر: GOODATA' : 'Publishing Director: Billel Aouiche / Publisher: GOODATA'}
          </p>
        </div>
        <a 
          href="https://wa.me/213656180056"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-bold hover:bg-emerald-500/20 transition-colors shrink-0"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span dir="ltr">+213656180056</span>
        </a>
      </div>
    </div>
  );
};
