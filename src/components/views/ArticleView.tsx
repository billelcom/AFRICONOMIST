import React, { useState } from 'react';
import { Article } from '../../types';
import { shareContent } from '../../lib/pwa/webShare';
import { 
  ShieldCheck, 
  Sparkles, 
  ExternalLink, 
  Clock, 
  FileCheck2, 
  CheckCircle2, 
  AlertCircle,
  Share2,
  Code2,
  ArrowRight,
  ArrowLeft,
  BookOpen
} from 'lucide-react';

interface ArticleViewProps {
  article: Article;
  onBack: () => void;
  lang: 'ar' | 'en';
  onNavigateToEditorial?: () => void;
}

export const ArticleView: React.FC<ArticleViewProps> = ({
  article,
  onBack,
  lang,
  onNavigateToEditorial
}) => {
  const isAr = lang === 'ar';
  const [activeCitationId, setActiveCitationId] = useState<string | null>(null);

  const paragraphs = isAr ? article.content : article.contentEn;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Article Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-colors text-xs font-medium cursor-pointer"
        >
          {isAr ? <ArrowRight className="w-3.5 h-3.5 text-amber-400" /> : <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />}
          <span>{isAr ? 'العودة للرئيسية والأسواق' : 'Back to Markets'}</span>
        </button>

        <button
          onClick={() => shareContent({
            title: isAr ? article.title : article.titleEn,
            text: isAr ? article.summary : article.summaryEn,
            url: typeof window !== 'undefined' ? window.location.href : undefined
          })}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 text-amber-400 border border-slate-800 hover:border-amber-500/40 transition-colors text-xs font-bold cursor-pointer"
          title={isAr ? 'مشاركة التقرير عبر واجهة النظام' : 'Share via Web Share'}
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{isAr ? 'مشاركة التقرير' : 'Share Report'}</span>
        </button>
      </div>

      {/* Main Article Header */}
      <article className="space-y-6">
        {/* Zero-Pill Metadata */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-medium">
          <span className="text-amber-400 font-bold uppercase">{article.category}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="text-white font-bold">{isAr ? article.countryName : article.countryNameEn}</span>
          
          {article.journalisticType && (
            <>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-semibold border border-slate-700">
                📰 {article.journalisticType}
              </span>
            </>
          )}

          {article.sector && (
            <>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
                📊 {article.sector}
              </span>
            </>
          )}

          {article.generationType && (
            <>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] border ${
                article.generationType === 'manual_supervisor'
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                  : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
              }`}>
                {article.generationType === 'manual_supervisor'
                  ? (isAr ? '🎯 إعداد المشرف المخصص' : '🎯 Supervisor Commission')
                  : (isAr ? '⚡ دوري كل 30 دقيقة' : '⚡ 30m Auto Ingest')}
              </span>
            </>
          )}

          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            {article.readTimeMinutes} {isAr ? 'دقائق للقراءة' : 'min read'}
          </span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="text-slate-400 font-mono">{article.publishedAt || article.createdAt}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
          {isAr ? article.title : article.titleEn}
        </h1>

        {/* Lead Summary */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#0e1627] border-r-4 border-amber-500 text-slate-200 text-base sm:text-lg leading-relaxed font-medium">
          {isAr ? article.summary : article.summaryEn}
        </div>

        {/* AI & Editorial Verification Pill-Free Badge Box */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-200">
                {isAr ? 'إنتاج مشترك (وكيل اقتصادي + مراجعة بشرية)' : 'Hybrid AI & Human Editorial'}
              </div>
              <div className="text-slate-400 mt-0.5">
                {isAr ? 'النموذج التحليلي: ' : 'Model: '}
                <span className="text-slate-300 font-mono">{article.aiModel}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-emerald-400 flex items-center gap-1">
                <span>{isAr ? 'معتمد من المدقق البشري' : 'Human Editor Verified'}</span>
              </div>
              <div className="text-slate-400 mt-0.5">
                {article.reviewedBy || (isAr ? 'بانتظار الاعتماد النهائي' : 'Pending Signoff')}
              </div>
            </div>
          </div>
        </div>

        {/* Article Body + Citations Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">
          {/* Main Paragraphs (8 Cols) */}
          <div className="lg:col-span-8 space-y-6 text-slate-200 leading-relaxed text-base sm:text-lg">
            {paragraphs.map((para, idx) => (
              <p key={idx} className="relative">
                {para}
                {/* Interactive citation mark matching paragraph index */}
                {article.citations[idx] && (
                  <button
                    onClick={() => setActiveCitationId(article.citations[idx].id)}
                    className="inline-flex items-center justify-center mx-1 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-xs font-mono font-bold hover:bg-amber-500/40 border border-amber-500/40 transition-colors"
                    title={`عرض مصدر التوثيق #${idx + 1}`}
                  >
                    [{idx + 1}]
                  </button>
                )}
              </p>
            ))}

            {article.reviewNotes && (
              <div className="mt-8 p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                <span className="font-bold text-amber-400 block mb-1">
                  {isAr ? 'ملاحظة المدقق البشري المسجلة في قاعدة البيانات:' : 'Human Editor Audit Log Note:'}
                </span>
                {article.reviewNotes}
              </div>
            )}
          </div>

          {/* Citations & Fact-Check Sidebar (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Fact Check Report Box */}
            <div className="p-5 rounded-xl bg-[#0c1220] border border-slate-800">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-emerald-400" />
                  {isAr ? 'تقرير فحص الحقائق (Zero-Trust)' : 'Fact-Check Verification'}
                </h3>
                <span className="text-sm font-bold font-mono text-emerald-400">
                  {article.factCheck.score}%
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>{isAr ? 'الادعاءات الرقمية المفحوصة:' : 'Verified Claims:'}</span>
                  <span className="font-mono text-white">
                    {article.factCheck.verifiedClaimsCount} / {article.factCheck.totalClaimsCount}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>{isAr ? 'مؤشر الحياد والنزاهة:' : 'Objectivity Rating:'}</span>
                  <span className="text-emerald-400 font-semibold">{article.factCheck.biasRating}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>{isAr ? 'مستوى المخاطر التحريرية:' : 'Editorial Risk:'}</span>
                  <span className="text-emerald-400 font-mono">{article.factCheck.riskScore}</span>
                </div>
              </div>
            </div>

            {/* Citations List with Verified Badges */}
            <div className="p-5 rounded-xl bg-[#0c1220] border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                {isAr ? 'المصادر والروابط الموثقة (Citations)' : 'Verified Citations'}
              </h3>

              <div className="space-y-2.5">
                {article.citations.map((cit, idx) => (
                  <div
                    key={cit.id}
                    className={`p-3 rounded-lg border text-xs transition-all ${
                      activeCitationId === cit.id
                        ? 'bg-amber-500/15 border-amber-500/60 shadow-sm'
                        : 'bg-slate-900 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-slate-200 mb-1">
                      <span className="flex items-center gap-1">
                        <span className="font-mono text-amber-400">[{idx + 1}]</span>
                        <span className="truncate max-w-[170px]">{cit.sourceName}</span>
                      </span>
                      <span className="text-emerald-400 text-[10px] font-mono flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" />
                        {cit.credibilityScore}%
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 italic mb-2">
                      &ldquo;{cit.snippet}&rdquo;
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800">
                      <span>{cit.publishDate}</span>
                      <a
                        href={cit.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-amber-400 hover:underline flex items-center gap-1 font-medium"
                      >
                        {isAr ? 'الرابط المرجعي' : 'Source'}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};
