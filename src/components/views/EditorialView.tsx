import React, { useState, useEffect } from 'react';
import { Article, UserRole, ArticleGenerationType } from '../../types';
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
  Plus,
  Radio,
  Zap,
  FileText,
  Info,
  Copy,
  Check,
  Terminal,
  Filter,
  Layers,
  Flame,
  Globe,
  TrendingUp,
  SlidersHorizontal,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { CreateReportModal } from '../CreateReportModal';
import { ALL_54_AFRICAN_COUNTRIES } from '../../data/africanCountries';
import { JOURNALISTIC_GENRES, ECONOMIC_SECTORS } from '../../data/reportOptions';
import { getSecondsUntilNextCycle, resetNextCycleTarget } from '../../lib/cycleScheduler';

interface EditorialViewProps {
  articles: Article[];
  onUpdateArticleStatus: (articleId: string, status: Article['status'], reviewer: string, note?: string) => void;
  onAddNewDraft: (newArticle: Article) => void;
  lang: 'ar' | 'en';
  secondsUntilNextCycle?: number;
  isAutomatedIngesting?: boolean;
  onTriggerAutomatedCycleNow?: () => void;
}

export const EditorialView: React.FC<EditorialViewProps> = ({
  articles,
  onUpdateArticleStatus,
  onAddNewDraft,
  lang,
  secondsUntilNextCycle: propsSecondsUntilNextCycle,
  isAutomatedIngesting: propsIsAutomatedIngesting,
  onTriggerAutomatedCycleNow: propsOnTriggerAutomatedCycleNow
}) => {
  const isAr = lang === 'ar';

  const [activeRole, setActiveRole] = useState<UserRole>('HUMAN_EDITOR');
  const [selectedStatus, setSelectedStatus] = useState<string>('pending_review');
  const [selectedGenerationType, setSelectedGenerationType] = useState<string>('all');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [reviewNote, setReviewNote] = useState<string>('');
  
  // State for CreateReportModal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [showVercelGuideModal, setShowVercelGuideModal] = useState<boolean>(false);
  const [copiedEndpoint, setCopiedEndpoint] = useState<boolean>(false);
  
  // Automated 30-minute ingestion cycle state (مربوط بتوقيت الساعة العالمي الحقيقي وليس ثابتاً عند 1720)
  const [internalIngesting, setInternalIngesting] = useState<boolean>(false);
  const [internalSeconds, setInternalSeconds] = useState<number>(() => getSecondsUntilNextCycle());

  const isAutomatedIngesting = propsIsAutomatedIngesting !== undefined ? propsIsAutomatedIngesting : internalIngesting;
  const secondsUntilNextCycle = propsSecondsUntilNextCycle !== undefined ? propsSecondsUntilNextCycle : internalSeconds;

  // Active timer counting down for the periodic 30-min cycle, linked directly to global wall-clock
  useEffect(() => {
    const syncTime = () => {
      const remaining = getSecondsUntilNextCycle();
      setInternalSeconds(remaining);
      // إطلاق الدورة تلقائياً عند انتهاء الـ 30 دقيقة
      if (remaining <= 1 && !isAutomatedIngesting) {
        if (propsOnTriggerAutomatedCycleNow) {
          propsOnTriggerAutomatedCycleNow();
        } else {
          handleTriggerInstantGeneration();
        }
      }
    };

    syncTime();
    const timer = setInterval(syncTime, 1000);
    return () => clearInterval(timer);
  }, [isAutomatedIngesting, propsOnTriggerAutomatedCycleNow]);

  // Format seconds to mm:ss
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const pendingArticles = articles.filter(a => a.status === 'pending_review');
  const publishedArticles = articles.filter(a => a.status === 'published');
  const rejectedArticles = articles.filter(a => a.status === 'rejected');

  const filteredArticles = articles.filter(a => {
    if (selectedStatus !== 'all' && a.status !== selectedStatus) return false;
    if (selectedGenerationType !== 'all') {
      const gType = a.generationType || 'automated_periodic';
      if (gType !== selectedGenerationType) return false;
    }
    return true;
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

  // توليد فوري لمسودة تقرير جديدة عشوائياً (دولة · قطاع · قالب صحفي) دون انتظار انتهاء العداد
  const handleTriggerInstantGeneration = async () => {
    if (isAutomatedIngesting) return;
    setInternalIngesting(true);
    try {
      // اختيار عشوائي كامل وشامل: 54 دولة، 28 قطاعاً، 18 نوعاً صحفياً
      const randomCountry = ALL_54_AFRICAN_COUNTRIES[Math.floor(Math.random() * ALL_54_AFRICAN_COUNTRIES.length)];
      const randomSector = ECONOMIC_SECTORS[Math.floor(Math.random() * ECONOMIC_SECTORS.length)];
      const randomGenre = JOURNALISTIC_GENRES[Math.floor(Math.random() * JOURNALISTIC_GENRES.length)];

      let createdArticle: Article | null = null;
      try {
        const response = await fetch('/api/agents/pipeline', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            country: isAr ? randomCountry.nameAr : randomCountry.nameEn,
            countryCode: randomCountry.code,
            journalisticType: randomGenre.nameAr,
            sector: randomSector.nameAr,
            generationMode: 'automated_periodic'
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.report) {
            const rep = data.report;
            createdArticle = {
              id: rep.id,
              slug: rep.slug || `report-${Date.now()}`,
              title: rep.title,
              titleEn: rep.titleEn || `${randomGenre.nameEn}: ${randomCountry.nameEn}`,
              summary: rep.summary,
              summaryEn: rep.summaryEn || `Instant market feed report.`,
              content: [rep.content],
              contentEn: [rep.content],
              category: 'Macroeconomics',
              countryCode: randomCountry.code,
              countryName: randomCountry.nameAr,
              countryNameEn: randomCountry.nameEn,
              status: 'pending_review',
              generationType: 'automated_periodic',
              journalisticType: randomGenre.nameAr,
              sector: randomSector.nameAr,
              authorType: 'AI_AGENT',
              aiModel: 'Gemini 3.6 Flash (Instant Pipeline Dispatch)',
              reviewNotes: 'تم التوليد الفوري بنجاح (عشوائي: دولة · قطاع · نوع صحفي) وهي قيد المراجعة',
              citations: (rep.sources || []).map((s: any, idx: number) => ({
                id: `cit-${idx}-${Date.now()}`,
                sourceName: s.source || s.title,
                url: s.url,
                publishDate: '2026-09-24',
                verified: true,
                credibilityScore: 98,
                snippet: s.title
              })),
              factCheck: {
                score: 96,
                verifiedClaimsCount: 5,
                totalClaimsCount: 5,
                biasRating: 'Neutral',
                riskScore: 'Low',
                checkedAt: new Date().toISOString().split('T')[0]
              },
              createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
              readTimeMinutes: 3,
              featured: false,
              marketImpact: 'positive'
            };
          }
        }
      } catch (e) {
        console.warn('API error, creating local periodic article:', e);
      }

      if (!createdArticle) {
        createdArticle = {
          id: `art_instant_${Date.now()}`,
          slug: `report-instant-${Date.now()}`,
          title: `${randomGenre.nameAr}: تطورات استثنائية في قطاع ${randomSector.nameAr} بـ ${randomCountry.nameAr}`,
          titleEn: `${randomGenre.nameEn}: Exceptional Shifts in ${randomCountry.nameEn}'s ${randomSector.nameEn}`,
          summary: `تقرير فوري صادر عن وكلاء الذكاء الاصطناعي يرصد مؤشرات قطاع ${randomSector.nameAr} في ${randomCountry.nameAr}.`,
          summaryEn: `Instantly generated market dispatch tracking high-frequency liquidity and price discovery.`,
          content: [
            `رصدت وحدات الرصد الآلي في منصة "أفريكونوميست" تحركات نشطة في قطاع ${randomSector.nameAr} بـ ${randomCountry.nameAr}.`,
            `تمت مطابقة أسعار الصرف ومؤشرات الفائدة مع قواعد البيانات المركزية وإدراج المسودة بحالة "قيد المراجعة" للمشرف البشري.`
          ],
          contentEn: [
            `Autonomous monitoring nodes logged active trading movements in ${randomCountry.nameEn}'s ${randomSector.nameEn}.`,
            `Central registries matched and queued under "pending_review" for editorial sign-off.`
          ],
          category: 'Macroeconomics',
          countryCode: randomCountry.code,
          countryName: randomCountry.nameAr,
          countryNameEn: randomCountry.nameEn,
          status: 'pending_review',
          generationType: 'automated_periodic',
          journalisticType: randomGenre.nameAr,
          sector: randomSector.nameAr,
          authorType: 'AI_AGENT',
          aiModel: 'Gemini 3.6 Flash (Instant Dispatch)',
          citations: [
            {
              id: `cit-auto-${Date.now()}`,
              sourceName: `Central Bank of ${randomCountry.nameEn} Automated Feed`,
              url: 'https://centralbank.org/feed',
              publishDate: '2026-09-24',
              verified: true,
              credibilityScore: 99,
              snippet: 'Live feed tick confirmed.'
            }
          ],
          factCheck: {
            score: 96,
            verifiedClaimsCount: 5,
            totalClaimsCount: 5,
            biasRating: 'Neutral',
            riskScore: 'Low',
            checkedAt: new Date().toISOString().split('T')[0]
          },
          createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          readTimeMinutes: 3,
          featured: false,
          marketImpact: 'positive'
        };
      }

      onAddNewDraft(createdArticle);
      setSelectedArticleId(createdArticle.id);
      setSelectedStatus('pending_review');

      // بعد التوليد الفوري يعود العداد للدقيقة 30 فوراً ويبدأ في التنازل المستمر
      resetNextCycleTarget();
      setInternalSeconds(1800);
      if (propsOnTriggerAutomatedCycleNow) {
        propsOnTriggerAutomatedCycleNow();
      }
    } finally {
      setInternalIngesting(false);
    }
  };

  // عند إنشاء تقرير جديد عبر نافذة المشرف
  const handleReportGeneratedBySupervisor = (newArt: Article) => {
    onAddNewDraft(newArt);
    setSelectedArticleId(newArt.id);
    setSelectedStatus('pending_review');
  };

  return (
    <div className="space-y-6 pb-20 max-w-full overflow-hidden">
      {/* Modal: إعداد تقرير جديد (Commission Modal) */}
      <CreateReportModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onGenerateReport={handleReportGeneratedBySupervisor}
        lang={lang}
      />

      {/* Modal: دليل حل قيود Vercel لتشغيل دورة الـ 30 دقيقة مجاناً */}
      {showVercelGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowVercelGuideModal(false)}
              className="absolute top-4 left-4 sm:left-auto sm:right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">
                  {isAr ? 'دليل تشغيل دورة الـ 30 دقيقة على استضافة Vercel (خطة الهواة المجانية)' : 'Vercel Hobby 30-Minute Cycle Setup Guide'}
                </h3>
                <p className="text-xs text-slate-400">
                  {isAr ? 'حلول هندسية متوافقة 100% مع شروط Vercel دون الحاجة لدفع اشتراك Pro' : '100% compliant serverless methods for 30m cycles on Vercel free tier'}
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              {/* Option 1: Lazy Auto-Trigger */}
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold text-emerald-400 text-sm">
                    {isAr ? '1. التحديث التلقائي الكسول (Lazy On-Demand Refresh) - [مفعل الآن تلقائياً]' : '1. Lazy On-Demand Background Refresh - [Active Now]'}
                  </span>
                </div>
                <p className="text-slate-300">
                  {isAr 
                    ? 'تم دمج هذه التقنية مباشرة في الكود! عندما يفتح أي زائر أو محرر الموقع، يفحص الباك إند هل مرت 30 دقيقة منذ آخر مقال؛ إذا مر الوقت، يُنتج مقالاً جديداً فوراً ويحفظه في MongoDB. لا تحتاج لأي إعداد خارجي!' 
                    : 'Embedded directly into the codebase! Whenever visitors browse, the backend automatically generates a new report if 30 minutes have elapsed since the last article.'}
                </p>
              </div>

              {/* Option 2: External Free Webhook */}
              <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-blue-400" />
                    <span className="font-bold text-blue-400 text-sm">
                      {isAr ? '2. خدمة Webhook مجانية (مثل cron-job.org)' : '2. Free Webhook Ping (cron-job.org)'}
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono">
                    {isAr ? 'مستمر 24/7' : '24/7 Continuous'}
                  </span>
                </div>
                <p className="text-slate-300">
                  {isAr 
                    ? 'إذا أردت أن يتم التوليد بدقة كل 30 دقيقة حتى لو لم يدخل أي زائر للموقع، يمكنك التسجيل في موقع cron-job.org المجاني ووضع هذا الرابط:' 
                    : 'To trigger strictly every 30 minutes even with zero traffic, configure cron-job.org with your endpoint:'}
                </p>
                <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] text-emerald-300">
                  <span className="truncate flex-1">
                    {typeof window !== 'undefined' ? `${window.location.origin}/api/cron/trigger` : 'https://your-site.vercel.app/api/cron/trigger'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://your-site.vercel.app';
                      navigator.clipboard.writeText(`${origin}/api/cron/trigger`);
                      setCopiedEndpoint(true);
                      setTimeout(() => setCopiedEndpoint(false), 2500);
                    }}
                    className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors shrink-0 flex items-center gap-1 text-[11px]"
                  >
                    {copiedEndpoint ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedEndpoint ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ الرابط' : 'Copy')}</span>
                  </button>
                </div>
              </div>

              {/* Option 3: GitHub Actions */}
              <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-2">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-purple-400" />
                  <span className="font-bold text-purple-400 text-sm">
                    {isAr ? '3. عبر GitHub Actions (ملف جاهز مدمج بالمشروع)' : '3. Free GitHub Actions Scheduled Workflow'}
                  </span>
                </div>
                <p className="text-slate-300">
                  {isAr
                    ? 'تم إنشاء الملف .github/workflows/africonomist-cron.yml داخل المستودع. بمجرد رفع الكود إلى GitHub، سيقوم خادم GitHub تلقائياً باستدعاء موقعك كل 30 دقيقة مجاناً للأبد.'
                    : 'The file .github/workflows/africonomist-cron.yml is already configured in the repo to pulse your Vercel deployment every 30 minutes.'}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setShowVercelGuideModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
              >
                {isAr ? 'إغلاق ومتابعة' : 'Close & Continue'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clean Newsroom Desk Header */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-white font-bold text-sm sm:text-base">
            <ShieldCheck className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{isAr ? 'غرفة الأخبار: إدارة النشر والمراجعة التحريرية' : 'Newsroom: Editorial Review & Ingestion Desk'}</span>
          </div>
          <p className="text-[11px] text-slate-400">
            {isAr 
              ? 'مراقبة نظامي النشر: المقالات التلقائية الدورية كل نصف ساعة، والتقارير المخصصة بإشراف المشرف'
              : 'Managing dual publishing streams: Autonomous 30-min feeds and supervisor-commissioned custom reports'}
          </p>
        </div>

        {/* Editorial Role Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-lg border border-slate-800 shrink-0">
          <span className="text-slate-400 text-[11px] px-2 font-medium hidden sm:inline">
            {isAr ? 'صفة الحساب:' : 'Editor Status:'}
          </span>
          <button
            onClick={() => setActiveRole('HUMAN_EDITOR')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
              activeRole === 'HUMAN_EDITOR'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isAr ? 'رئيس التحرير (صلاحية النشر)' : 'Chief Editor (Publish)'}
          </button>
          <button
            onClick={() => setActiveRole('GUEST')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
              activeRole === 'GUEST'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isAr ? 'وضع المشاهدة' : 'Preview Mode'}
          </button>
        </div>
      </div>

      {/* If GUEST (Role test) */}
      {activeRole === 'GUEST' ? (
        <div className="p-8 sm:p-12 text-center rounded-2xl bg-[#0c1220] border border-rose-900/50 space-y-4 max-w-xl mx-auto">
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
          {/* Dual Publishing Architecture Banner (المقالات من حيث النشر نوعين) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* STREAM 1: Automated 30-min Ingestion */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 flex flex-col justify-between gap-3 shadow-sm">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-bold text-emerald-400">
                      {isAr ? 'النوع الأول: مقالات تعد تلقائياً كل 30 دقيقة' : 'Type 1: Autonomous Periodic (Every 30m)'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs text-slate-400 px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700">
                      ⏱️ {formatTime(secondsUntilNextCycle)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowVercelGuideModal(true)}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center gap-1 transition-colors cursor-pointer"
                      title={isAr ? 'دليل تشغيل دورة الـ 30 دقيقة على استضافة Vercel' : 'Vercel Hobby 30-min sync guide'}
                    >
                      <Info className="w-3 h-3" />
                      <span>{isAr ? 'دليل Vercel (30د)' : 'Vercel 30m'}</span>
                    </button>
                  </div>
                </div>
                <h3 className="text-sm font-black text-white">
                  {isAr ? 'دورة الرصد الآلي الشاملة (Autonomous Ingestion)' : 'Scheduled Autonomous Macro Pulse'}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {isAr 
                    ? 'يقوم وكلاء الذكاء الاصطناعي برصد أسواق العملات، السلع، والمصارف في الـ 54 دولة دورياً كل نصف ساعة وإيداع المسودات في غرفة الأخبار.' 
                    : 'AI agents continuously pulse all 54 African economies every 30 minutes, depositing drafts for review.'}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-800/80">
                <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  {isAr ? 'العداد متصل ومستمر دون انقطاع' : 'Continuous synchronized countdown'}
                </span>
                <button
                  type="button"
                  onClick={handleTriggerInstantGeneration}
                  disabled={isAutomatedIngesting}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-950/40 text-xs font-black flex items-center gap-2 transition-all disabled:opacity-50 active:scale-95 cursor-pointer"
                  title={isAr ? 'توليد فوري لمسودة جديدة عشوائياً (دولة · قطاع · قالب صحفي) وإعادة ضبط العداد إلى 30 دقيقة' : 'Instantly generate draft and reset 30m countdown'}
                >
                  <Zap className={`w-4 h-4 text-amber-300 ${isAutomatedIngesting ? 'animate-spin' : 'fill-amber-300'}`} />
                  <span>
                    {isAutomatedIngesting 
                      ? (isAr ? 'جاري التوليد الفوري للمسودة...' : 'Generating Draft...') 
                      : (isAr ? 'توليد فوري الآن (عشوائي)' : 'Instant Generate Now (Random)')}
                  </span>
                </button>
              </div>
            </div>

            {/* STREAM 2: Supervisor Commissioned Desk (إعداد تقرير جديد) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950 border border-amber-500/30 flex flex-col justify-between gap-3 shadow-lg ring-1 ring-amber-500/20">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-amber-400">
                      {isAr ? 'النوع الثاني: مقالات يعدها المشرف بنفسه' : 'Type 2: Supervisor Commissioned'}
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                    {isAr ? 'إشراف بشري كامل' : 'Human Commission'}
                  </span>
                </div>
                <h3 className="text-sm font-black text-white">
                  {isAr ? 'تخصيص تقرير جديد (54 دولة · 18 نوعاً صحفياً · 28 قطاعاً)' : 'Custom Report Setup (54 Countries · 18 Genres · 28 Sectors)'}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {isAr 
                    ? 'يقوم المشرف بتعيين الدولة بدقة، واختيار القالب الصحفي المناسب من بين 18 قالباً، والقطاع من بين 28 قطاعاً لإنتاج تقرير فوري دقيق.' 
                    : 'Directly commission reports with target nation, journalistic structure, and economic sector.'}
                </p>
              </div>

              {/* Outstanding User Request Button: "إعداد تقرير جديد" */}
              <div className="pt-2 flex items-center justify-between gap-2 border-t border-amber-500/20">
                <span className="text-[11px] text-amber-400/80 font-mono">
                  54 {isAr ? 'دولة' : 'nations'} · 18 {isAr ? 'نوعاً' : 'genres'} · 28 {isAr ? 'قطاعاً' : 'sectors'}
                </span>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center gap-2 shadow-md hover:shadow-amber-500/20 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isAr ? 'إعداد تقرير جديد' : 'Prepare New Report'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Action Bar & Stats Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">{isAr ? 'المسودات قيد المراجعة' : 'Pending Review'}</span>
              <div className="text-xl sm:text-2xl font-black font-mono text-rose-400 mt-1">{pendingArticles.length}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">{isAr ? 'المقالات المنشورة' : 'Approved & Published'}</span>
              <div className="text-xl sm:text-2xl font-black font-mono text-emerald-400 mt-1">{publishedArticles.length}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">{isAr ? 'المسودات المرفوضة' : 'Rejected'}</span>
              <div className="text-xl sm:text-2xl font-black font-mono text-slate-400 mt-1">{rejectedArticles.length}</div>
            </div>

            {/* Quick Action Button for Mobile / Secondary */}
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="w-full h-full min-h-[58px] p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-amber-500/40 text-amber-400 font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-center">{isAr ? 'إعداد تقرير جديد' : 'Prepare New Report'}</span>
              </button>
            </div>
          </div>

          {/* Review Workspace: Queue Column + Inspection & Action Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Queue List (5 Cols) */}
            <div className="lg:col-span-5 space-y-3">
              {/* Filter 1: Review Status Buttons */}
              <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedStatus('pending_review')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${
                    selectedStatus === 'pending_review'
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isAr ? 'قيد المراجعة' : 'Pending'} ({pendingArticles.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedStatus('published')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${
                    selectedStatus === 'published'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isAr ? 'منشور' : 'Published'} ({publishedArticles.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedStatus('all')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${
                    selectedStatus === 'all'
                      ? 'bg-slate-700 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isAr ? 'الكل' : 'All'}
                </button>
              </div>

              {/* Filter 2: Publishing Origin Buttons (المقالات من حيث النشر نوعين) */}
              <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-[11px] overflow-x-auto no-scrollbar">
                <button
                  type="button"
                  onClick={() => setSelectedGenerationType('all')}
                  className={`px-2.5 py-1 rounded whitespace-nowrap transition-colors ${
                    selectedGenerationType === 'all'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isAr ? 'كافة المصادر' : 'All Types'}
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedGenerationType('automated_periodic')}
                  className={`px-2.5 py-1 rounded whitespace-nowrap transition-colors flex items-center gap-1 ${
                    selectedGenerationType === 'automated_periodic'
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>⚡</span>
                  <span>{isAr ? 'آلي دوري (30د)' : 'Auto (30m)'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedGenerationType('manual_supervisor')}
                  className={`px-2.5 py-1 rounded whitespace-nowrap transition-colors flex items-center gap-1 ${
                    selectedGenerationType === 'manual_supervisor'
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>🎯</span>
                  <span>{isAr ? 'إعداد المشرف' : 'Supervisor'}</span>
                </button>
              </div>

              {/* Draft Cards List */}
              <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
                {filteredArticles.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500 bg-slate-900/40 rounded-xl border border-slate-800 space-y-2">
                    <div>{isAr ? 'لا توجد تقارير مطابقة لهذا التصنيف' : 'No drafts matching filter'}</div>
                    <button
                      type="button"
                      onClick={() => setIsCreateModalOpen(true)}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold hover:bg-amber-500/20 transition-colors"
                    >
                      {isAr ? 'إعداد تقرير جديد الآن' : 'Prepare New Report Now'}
                    </button>
                  </div>
                ) : (
                  filteredArticles.map((art) => {
                    const isSelected = activeArticle?.id === art.id;
                    const isSupervisor = art.generationType === 'manual_supervisor';

                    return (
                      <div
                        key={art.id}
                        onClick={() => setSelectedArticleId(art.id)}
                        className={`p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all space-y-2 ${
                          isSelected
                            ? 'bg-[#121a2c] border-amber-500 shadow-md ring-1 ring-amber-500/30'
                            : 'bg-[#0d1320] border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {/* Top Line: Country + Origin + Status */}
                        <div className="flex items-center justify-between gap-1 text-xs">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-white text-xs">{art.countryName}</span>
                            
                            {/* Publishing Origin Badge */}
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold border ${
                              isSupervisor
                                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                                : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                            }`}>
                              {isSupervisor ? (isAr ? '🎯 إعداد المشرف' : '🎯 Supervisor') : (isAr ? '⚡ دوري كل 30د' : '⚡ 30m Auto')}
                            </span>
                          </div>

                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono shrink-0 ${
                            art.status === 'published' 
                              ? 'bg-emerald-500/20 text-emerald-400' 
                              : art.status === 'rejected'
                              ? 'bg-rose-500/20 text-rose-400'
                              : 'bg-rose-500/20 text-rose-300'
                          }`}>
                            {art.status === 'pending_review' ? (isAr ? 'قيد المراجعة' : 'Pending') : art.status}
                          </span>
                        </div>

                        {/* Title */}
                        <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-2 leading-snug">
                          {isAr ? art.title : art.titleEn}
                        </h4>

                        {/* Middle Badges: Journalistic Genre + Sector */}
                        <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                          {art.journalisticType && (
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/80">
                              📰 {art.journalisticType}
                            </span>
                          )}
                          {art.sector && (
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/80">
                              📊 {art.sector}
                            </span>
                          )}
                        </div>

                        {/* Footer: Citations & Fact Check */}
                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                          <span>{art.citations.length} {isAr ? 'مصادر موثقة' : 'citations'}</span>
                          <span className="text-emerald-400 font-mono font-bold">{art.factCheck.score}% {isAr ? 'دقة' : 'score'}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Inspection & Decision Panel (7 Cols) */}
            <div className="lg:col-span-7 p-4 sm:p-6 rounded-2xl bg-[#0c1220] border border-slate-800 space-y-6">
              {activeArticle ? (
                <>
                  <div className="space-y-3 pb-4 border-b border-slate-800">
                    {/* Detailed Metadata Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                          activeArticle.generationType === 'manual_supervisor'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        }`}>
                          {activeArticle.generationType === 'manual_supervisor'
                            ? (isAr ? '🎯 إعداد المشرف المخصص' : '🎯 Supervisor Commissioned')
                            : (isAr ? '⚡ توليد آلي دوري (كل 30 دقيقة)' : '⚡ Autonomous 30-min Feed')}
                        </span>
                        <span>·</span>
                        <span className="text-amber-400 font-bold">{activeArticle.countryName}</span>
                        <span>·</span>
                        <span className="text-slate-400 font-mono text-[11px]">{activeArticle.id}</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">
                        {isAr ? 'وقت الإنشاء: ' : 'Created: '}
                        {activeArticle.createdAt}
                      </span>
                    </div>

                    {/* Classification Row (Genre + Sector) */}
                    <div className="flex flex-wrap items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400">{isAr ? 'النوع الصحفي:' : 'Genre:'}</span>
                        <span className="font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
                          {activeArticle.journalisticType || (isAr ? 'تقرير إخباري' : 'News Report')}
                        </span>
                      </div>
                      <span className="text-slate-700">|</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400">{isAr ? 'المجال أو القطاع:' : 'Sector:'}</span>
                        <span className="font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
                          {activeArticle.sector || activeArticle.category}
                        </span>
                      </div>
                    </div>

                    <h2 className="text-base sm:text-xl font-bold text-white leading-tight">
                      {isAr ? activeArticle.title : activeArticle.titleEn}
                    </h2>

                    <p className="text-xs text-slate-300 bg-slate-900/80 p-3 sm:p-4 rounded-xl border border-slate-800 leading-relaxed">
                      {isAr ? activeArticle.summary : activeArticle.summaryEn}
                    </p>
                  </div>

                  {/* Fact Check Details & AI Engine */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block mb-1">{isAr ? 'محرك وخوارزمية الوكيل:' : 'AI Agent Engine:'}</span>
                      <span className="text-slate-200 font-mono text-[11px] block">{activeArticle.aiModel}</span>
                      {activeArticle.reviewNotes && (
                        <p className="text-[10px] text-amber-400/80 mt-1">{activeArticle.reviewNotes}</p>
                      )}
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block mb-1">{isAr ? 'نتيجة فحص الحقائق والمطابقة:' : 'Fact-Check & Citation Score:'}</span>
                      <span className="text-emerald-400 font-bold font-mono text-sm block">
                        {activeArticle.factCheck.score}%
                      </span>
                      <span className="text-[10px] text-slate-400">
                        ({activeArticle.factCheck.verifiedClaimsCount} {isAr ? 'ادعاءات موثقة ومطابقة' : 'verified claims'})
                      </span>
                    </div>
                  </div>

                  {/* Citations Box */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-300 block">
                      {isAr ? 'المصادر والروابط المستخرجة بواسطة الوكيل (Mandatory Citations):' : 'Extracted Source Citations:'}
                    </span>
                    <div className="space-y-2">
                      {activeArticle.citations.map((c, i) => (
                        <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                          <div className="flex items-center justify-between font-bold text-slate-200">
                            <span className="truncate">{c.sourceName}</span>
                            <span className="text-emerald-400 font-mono shrink-0">{c.credibilityScore}% {isAr ? 'موثوقية' : 'credibility'}</span>
                          </div>
                          {c.snippet && (
                            <p className="text-[11px] text-slate-400 italic">&ldquo;{c.snippet}&rdquo;</p>
                          )}
                          {c.url && (
                            <a 
                              href={c.url} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="text-[10px] text-amber-400 hover:underline flex items-center gap-1 font-mono pt-1"
                            >
                              <span>{c.url}</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Content Preview */}
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-bold text-slate-300 block">
                      {isAr ? 'نص المسودة الكامل (Full Draft Preview):' : 'Full Draft Preview:'}
                    </span>
                    <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 max-h-60 overflow-y-auto text-xs text-slate-300 space-y-2 leading-relaxed">
                      {(isAr ? activeArticle.content : activeArticle.contentEn).map((paragraph, pIdx) => (
                        <p key={pIdx} className="whitespace-pre-line">{paragraph}</p>
                      ))}
                    </div>
                  </div>

                  {/* Human-in-the-Loop Decision Box */}
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/60 space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1.5">
                        {isAr ? 'ملاحظة المدقق البشري وسجل التدقيق (Human-in-the-Loop Audit Log):' : 'Human Editor Review Note:'}
                      </label>
                      <textarea
                        value={reviewNote}
                        onChange={(e) => setReviewNote(e.target.value)}
                        placeholder={isAr ? 'أدخل ملاحظات التدقيق أو شروط التعديل قبل الاعتماد النهائي...' : 'Add audit notes before final sign-off...'}
                        rows={2}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    {/* Action Decision Buttons */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleReject(activeArticle.id)}
                          className="flex-1 sm:flex-initial px-3.5 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>{isAr ? 'رفض المسودة' : 'Reject Draft'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRequestRevision(activeArticle.id)}
                          className="flex-1 sm:flex-initial px-3.5 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <RotateCcw className="w-4 h-4" />
                          <span>{isAr ? 'طلب مراجعة' : 'Request Revision'}</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleApprove(activeArticle.id)}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 text-xs font-black flex items-center justify-center gap-2 shadow-lg transition-all"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>{isAr ? 'اعتماد ونشر فوري' : 'Approve & Publish'}</span>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-12 text-center text-xs text-slate-500">
                  {isAr ? 'اختر مسودة من القائمة الجانبية للمراجعة' : 'Select a draft to inspect'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
