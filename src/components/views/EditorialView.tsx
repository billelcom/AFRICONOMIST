import React, { useState } from 'react';
import { Article, UserRole } from '../../types';
import { 
  ShieldCheck, 
  Sparkles, 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  Lock, 
  FileEdit, 
  Database, 
  Clock, 
  AlertTriangle,
  Code2,
  Send,
  Plus
} from 'lucide-react';

interface EditorialViewProps {
  articles: Article[];
  onUpdateArticleStatus: (articleId: string, status: Article['status'], reviewer: string, note?: string) => void;
  onAddNewDraft: (newArticle: Article) => void;
  lang: 'ar' | 'en';
}

export const EditorialView: React.FC<EditorialViewProps> = ({
  articles,
  onUpdateArticleStatus,
  onAddNewDraft,
  lang
}) => {
  const isAr = lang === 'ar';

  const [activeRole, setActiveRole] = useState<UserRole>('HUMAN_EDITOR');
  const [selectedStatus, setSelectedStatus] = useState<string>('pending_review');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [reviewNote, setReviewNote] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const pendingArticles = articles.filter(a => a.status === 'pending_review');
  const publishedArticles = articles.filter(a => a.status === 'published');
  const rejectedArticles = articles.filter(a => a.status === 'rejected');

  const filteredArticles = articles.filter(a => {
    if (selectedStatus === 'all') return true;
    return a.status === selectedStatus;
  });

  const activeArticle = articles.find(a => a.id === selectedArticleId) || filteredArticles[0];

  const handleApprove = (id: string) => {
    onUpdateArticleStatus(id, 'published', 'د. بليغ حمدي (رئيس التحرير الاقتصادي)', reviewNote || 'تمت المصادقة على الأرقام والمصادر المرفقة');
    setReviewNote('');
  };

  const handleReject = (id: string) => {
    onUpdateArticleStatus(id, 'rejected', 'فريق الرقابة التحريرية', reviewNote || 'تم الرفض لعدم كفاية المصادر الموثقة');
    setReviewNote('');
  };

  const handleRequestRevision = (id: string) => {
    onUpdateArticleStatus(id, 'revision_requested', 'فريق التحرير', reviewNote || 'يرجى مراجعة إحصائيات التضخم الشهرية مقارنة بالسنوية');
    setReviewNote('');
  };

  // Simulate AI Agent generating a fresh economic draft with Zod schema
  const handleSimulateAiDraft = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const generatedDraft: Article = {
        id: `art-ai-${Date.now()}`,
        slug: `ethiopia-stock-exchange-inauguration-${Date.now()}`,
        title: 'بورصة إثيوبيا للأوراق المالية (ESX) تبدأ التداول التجريبي وتستهدف إدراج 50 شركة',
        titleEn: 'Ethiopian Securities Exchange Commences Pilot Trading Targeting 50 Listings',
        summary: 'خطوة تاريخية في ثاني أكبر دولة أفريقية سكاناً لفتح سوق رأس المال أمام الاستثمار الأجنبي المباشر.',
        summaryEn: 'Landmark milestone in Africa’s second most populous nation opening capital markets to global institutional asset managers.',
        content: [
          'دشنت بورصة إثيوبيا للأوراق المالية (ESX) في أديس أبابا مرحلة التداول التجريبي بالتعاون مع صندوق التنمية المالية الأفريقي (FSD Africa).',
          'تخطط البورصة لجذب إدراجات أولية للبنوك التجارية وشركات الاتصالات الحكومية والخاصة وعلى رأسها إثيو تليكوم (Ethio Telecom).',
          'بيانات التحقق: تم التوافق مع قرار البنك المركزي الإثيوبي رقم NBE/ESX/2026/09 بشأن تحويل العملات الأجنبية للأرباح الرأسمالية.'
        ],
        contentEn: [
          'The Ethiopian Securities Exchange in Addis Ababa began operational test runs in partnership with FSD Africa.',
          'Initial public offerings slated for 2026-2027 include tier-1 commercial banks and Ethio Telecom.',
          'Fact check confirmed National Bank of Ethiopia foreign exchange dividend repatriation guarantees.'
        ],
        category: 'Markets',
        countryCode: 'PAN_AFRICA',
        countryName: 'إثيوبيا / عموم أفريقيا',
        countryNameEn: 'Ethiopia / Pan-Africa',
        status: 'pending_review',
        authorType: 'AI_AGENT',
        aiModel: 'Gemini 1.5 Flash (Economic Ingestion Protocol)',
        citations: [
          {
            id: `cit-gen-${Date.now()}`,
            sourceName: 'National Bank of Ethiopia Official Directive',
            url: 'https://nbe.gov.et/directives/capital-markets-2026',
            publishDate: '2026-09-23',
            verified: true,
            credibilityScore: 97,
            snippet: 'Capital account liberalization framework for sovereign securities exchange executed.'
          }
        ],
        factCheck: {
          score: 96,
          verifiedClaimsCount: 6,
          totalClaimsCount: 6,
          biasRating: 'Neutral',
          riskScore: 'Low',
          checkedAt: '2026-09-23'
        },
        createdAt: '2026-09-23 15:00',
        readTimeMinutes: 2,
        featured: false,
        marketImpact: 'positive'
      };

      onAddNewDraft(generatedDraft);
      setSelectedArticleId(generatedDraft.id);
      setSelectedStatus('pending_review');
      setIsGenerating(false);
    }, 900);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Route & Security Banner */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-mono text-amber-400">
            <Lock className="w-4 h-4 text-rose-400" />
            <span className="text-slate-400">Next.js Protected Route:</span>
            <span className="font-bold">/app/(dashboard)/editorial/page.tsx</span>
          </div>
          <p className="text-[11px] text-slate-400">
            {isAr 
              ? 'بوابة المراجعة التحريرية المشفرة - مخصصة حصرياً للمحررين البشريين المعتمدين عبر Firebase Custom Claims'
              : 'Zero-Trust Editorial Portal - Restricted to verified Human Editors via RBAC Claims'}
          </p>
        </div>

        {/* RBAC Role Switcher (For Demo & Verification) */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-lg border border-slate-800">
          <span className="text-slate-400 text-[11px] px-2 font-medium">
            {isAr ? 'الدور الحالي (RBAC):' : 'Active Role:'}
          </span>
          <button
            onClick={() => setActiveRole('HUMAN_EDITOR')}
            className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
              activeRole === 'HUMAN_EDITOR'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            HUMAN_EDITOR
          </button>
          <button
            onClick={() => setActiveRole('GUEST')}
            className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
              activeRole === 'GUEST'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            GUEST (Unauthorized)
          </button>
        </div>
      </div>

      {/* If GUEST (Role test) */}
      {activeRole === 'GUEST' ? (
        <div className="p-12 text-center rounded-2xl bg-[#0c1220] border border-rose-900/50 space-y-4 max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">
            {isAr ? '403 - غير مصرح بالدخول (RBAC Zero-Trust)' : '403 - Forbidden: Role Insufficient'}
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isAr 
              ? 'تفرض معمارية النظام التحقق من Custom Claims للمستخدم. لا يمكن لغير المحررين البشريين المعتمدين استعراض مسودات الذكاء الاصطناعي قبل نشرها.'
              : 'System architecture enforces strict Firebase Auth custom claims validation. Only HUMAN_EDITOR or ADMIN can access this view.'}
          </p>
          <button
            onClick={() => setActiveRole('HUMAN_EDITOR')}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-colors"
          >
            {isAr ? 'التبديل إلى دور المحرر البشري (HUMAN_EDITOR)' : 'Switch back to HUMAN_EDITOR'}
          </button>
        </div>
      ) : (
        /* Authorized Editorial Review Workspace */
        <div className="space-y-6">
          {/* Action Bar & Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">{isAr ? 'المسودات قيد المراجعة' : 'Pending Review'}</span>
              <div className="text-2xl font-black font-mono text-rose-400 mt-1">{pendingArticles.length}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">{isAr ? 'المقالات المعتمدة والمنشورة' : 'Approved & Published'}</span>
              <div className="text-2xl font-black font-mono text-emerald-400 mt-1">{publishedArticles.length}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">{isAr ? 'المسودات المرفوضة' : 'Rejected'}</span>
              <div className="text-2xl font-black font-mono text-slate-400 mt-1">{rejectedArticles.length}</div>
            </div>

            {/* Ingestion Trigger Button */}
            <div className="flex items-center">
              <button
                onClick={handleSimulateAiDraft}
                disabled={isGenerating}
                className="w-full h-full min-h-[64px] p-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
              >
                <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>
                  {isGenerating 
                    ? (isAr ? 'جاري الرصد والتوليد...' : 'Agent Ingesting...') 
                    : (isAr ? 'محاكاة استلام مسودة AI جديدة' : 'Simulate Ingest AI Draft')}
                </span>
              </button>
            </div>
          </div>

          {/* Review Workspace: Queue Column + Inspection & Action Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Queue List (5 Cols) */}
            <div className="lg:col-span-5 space-y-3">
              {/* Status Segmented Buttons */}
              <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800">
                <button
                  onClick={() => setSelectedStatus('pending_review')}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    selectedStatus === 'pending_review'
                      ? 'bg-rose-500 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isAr ? 'قيد المراجعة' : 'Pending'} ({pendingArticles.length})
                </button>
                <button
                  onClick={() => setSelectedStatus('published')}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    selectedStatus === 'published'
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isAr ? 'منشور' : 'Published'} ({publishedArticles.length})
                </button>
                <button
                  onClick={() => setSelectedStatus('all')}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    selectedStatus === 'all'
                      ? 'bg-slate-700 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isAr ? 'الكل' : 'All'}
                </button>
              </div>

              {/* Draft Cards */}
              <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
                {filteredArticles.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500 bg-slate-900/40 rounded-xl border border-slate-800">
                    {isAr ? 'لا توجد مسودات في هذا القسم' : 'No drafts in this view'}
                  </div>
                ) : (
                  filteredArticles.map((art) => (
                    <div
                      key={art.id}
                      onClick={() => setSelectedArticleId(art.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        activeArticle?.id === art.id
                          ? 'bg-[#121a2c] border-amber-500 shadow-md'
                          : 'bg-[#0d1320] border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-mono text-slate-400 text-[11px]">{art.countryName}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                          art.status === 'published' 
                            ? 'bg-emerald-500/20 text-emerald-400' 
                            : art.status === 'rejected'
                            ? 'bg-rose-500/20 text-rose-400'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {art.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white line-clamp-2 mb-2 leading-snug">
                        {isAr ? art.title : art.titleEn}
                      </h4>
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>{art.citations.length} مصادر موثقة</span>
                        <span className="text-emerald-400 font-mono">{art.factCheck.score}% دقة</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right Inspection & Decision Panel (7 Cols) */}
            <div className="lg:col-span-7 p-6 rounded-xl bg-[#0c1220] border border-slate-800 space-y-6">
              {activeArticle ? (
                <>
                  <div className="space-y-3 pb-4 border-b border-slate-800">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-amber-400 font-bold">{activeArticle.category}</span>
                        <span>·</span>
                        <span className="text-slate-400">{activeArticle.countryName}</span>
                        <span>·</span>
                        <span className="text-slate-500 font-mono">{activeArticle.id}</span>
                      </div>
                      <span className="text-xs font-mono text-slate-400">
                        {isAr ? 'وقت الإنشاء: ' : 'Created: '}
                        {activeArticle.createdAt}
                      </span>
                    </div>

                    <h2 className="text-lg sm:text-xl font-bold text-white leading-tight">
                      {isAr ? activeArticle.title : activeArticle.titleEn}
                    </h2>

                    <p className="text-xs text-slate-300 bg-slate-900/80 p-3 rounded-lg border border-slate-800 leading-relaxed">
                      {isAr ? activeArticle.summary : activeArticle.summaryEn}
                    </p>
                  </div>

                  {/* Fact Check Details & Citations in Draft */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block mb-1">{isAr ? 'وكيل الذكاء الاصطناعي:' : 'AI Model:'}</span>
                      <span className="text-slate-200 font-mono text-[11px]">{activeArticle.aiModel}</span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block mb-1">{isAr ? 'نتيجة فحص الحقائق:' : 'Fact Score:'}</span>
                      <span className="text-emerald-400 font-bold font-mono">
                        {activeArticle.factCheck.score}% ({activeArticle.factCheck.verifiedClaimsCount} ادعاء تم التحقق منه)
                      </span>
                    </div>
                  </div>

                  {/* Citations Box */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-400">
                      {isAr ? 'المصادر والروابط المستخرجة بواسطة الوكيل (Citations):' : 'Extracted Source Citations:'}
                    </span>
                    {activeArticle.citations.map((c, i) => (
                      <div key={i} className="p-2.5 rounded bg-slate-900 border border-slate-800 text-xs">
                        <div className="flex justify-between font-bold text-slate-300">
                          <span>{c.sourceName}</span>
                          <span className="text-emerald-400 font-mono">{c.credibilityScore}% موثوقية</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 italic">"{c.snippet}"</p>
                      </div>
                    ))}
                  </div>

                  {/* Human-in-the-Loop Decision Box */}
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/60 space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1.5">
                        {isAr ? 'ملاحظة المدقق البشري وسجل التدقيق (Audit Log Note):' : 'Human Editor Review Note:'}
                      </label>
                      <textarea
                        value={reviewNote}
                        onChange={(e) => setReviewNote(e.target.value)}
                        placeholder={isAr ? 'أدخل ملاحظاتك التحريرية، سبب الاعتماد أو أسباب طلب التعديل...' : 'Enter editorial remarks or verification instructions...'}
                        className="w-full h-20 p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500 resize-none"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      <button
                        onClick={() => handleApprove(activeArticle.id)}
                        disabled={activeArticle.status === 'published'}
                        className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>{isAr ? 'اعتماد ونشر في الموقع (Approve)' : 'Approve & Publish'}</span>
                      </button>

                      <button
                        onClick={() => handleRequestRevision(activeArticle.id)}
                        className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>{isAr ? 'طلب إعادة تنقيح من الوكيل' : 'Request Revision'}</span>
                      </button>

                      <button
                        onClick={() => handleReject(activeArticle.id)}
                        disabled={activeArticle.status === 'rejected'}
                        className="px-4 py-2 rounded-lg bg-rose-600/80 hover:bg-rose-500 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>{isAr ? 'رفض المسودة (Reject)' : 'Reject Draft'}</span>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-12 text-center text-slate-500 text-sm">
                  {isAr ? 'اختر مسودة من القائمة للمراجعة' : 'Select a draft to inspect'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
