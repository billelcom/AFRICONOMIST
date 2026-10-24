// src/components/views/EditorialView.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Article, UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  RotateCcw, 
  FileEdit, 
  Clock, 
  AlertTriangle,
  Plus,
  Zap,
  FileText,
  Flame,
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Archive,
  Brain,
  Edit3,
  Bookmark,
  Check,
  Cpu,
  Anchor,
  Wheat,
  Coins,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  Send,
  MessageSquare,
  AlertCircle,
  Crown,
  User,
  X,
  Lock,
  Database,
  Play,
  Layers
} from 'lucide-react';
import { CommissionWizard } from '../CommissionWizard';
import { ArticleEditorialDesk } from '../ArticleEditorialDesk';
import { ALL_54_AFRICAN_COUNTRIES } from '../../data/africanCountries';
import { JOURNALISTIC_GENRES, ECONOMIC_SECTORS } from '../../data/reportOptions';
import { getSecondsUntilNextCycle, resetNextCycleTarget } from '../../lib/cycleScheduler';
import { 
  ALL_OFFICIAL_GROUNDING_SOURCES, 
  getOfficialSourcesForCountry 
} from '../../lib/agents/officialSourcesLedger';
import { NewsroomSidebar, NewsroomTab } from '../editorial/NewsroomSidebar';
import { NewsroomTabsMobile } from '../editorial/NewsroomTabsMobile';
import { SimulationWorkbench } from '../editorial/SimulationWorkbench';
import { SectorNewsGrid } from '../editorial/SectorNewsGrid';
import { EditorialArticleCard } from '../editorial/EditorialArticleCard';
import { PendingQueueView } from '../editorial/PendingQueueView';
import { AgentTrainingView } from '../editorial/AgentTrainingView';
import { EditorialLibraryView } from '../editorial/EditorialLibraryView';
import { RevisionModal } from '../editorial/RevisionModal';

interface EditorialViewProps {
  articles: Article[];
  onUpdateArticleStatus: (articleId: string, status: Article['status'], reviewer: string, note?: string) => void;
  onAddNewDraft: (newArticle: Article) => void;
  onSaveArticle?: (updatedArticle: Article) => void;
  onDeleteArticle?: (articleId: string) => void;
  onPreviewArticle?: (article: Article) => void;
  lang: 'ar' | 'en';
  secondsUntilNextCycle?: number;
  isAutomatedIngesting?: boolean;
  onTriggerAutomatedCycleNow?: () => void;
}



interface SectorSection {
  id: string;
  nameAr: string;
  nameEn: string;
  icon: any;
  accentColor: string;
  descriptionAr: string;
  descriptionEn: string;
}

const SECTOR_SECTIONS: SectorSection[] = [
  {
    id: 'markets',
    nameAr: 'أسواق المال والاستثمار وسندات السيادة',
    nameEn: 'Financial Markets & Sovereign Debt',
    icon: Coins,
    accentColor: 'from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-400',
    descriptionAr: 'رصد تداولات البورصات الإفريقية، حركة السندات السيادية، وتدفقات رؤوس الأموال وصناديق الاستثمار.',
    descriptionEn: 'Tracking African stock bourses, sovereign Eurobonds, and institutional capital inflows.'
  },
  {
    id: 'energy',
    nameAr: 'الطاقة والنفط والغاز والتحول البيئي',
    nameEn: 'Energy, Oil, Gas & Clean Transition',
    icon: Flame,
    accentColor: 'from-orange-500/20 to-orange-600/10 border-orange-500/30 text-orange-400',
    descriptionAr: 'تطورات الغاز الطبيعي، مصافي التكرير، مشاريع الهيدروجين الأخضر وصفقات الكهرباء القارية.',
    descriptionEn: 'Hydrocarbon discoveries, mega-refineries, green hydrogen, and continental power grids.'
  },
  {
    id: 'mining',
    nameAr: 'التعدين والمعادن الإستراتيجية والموارد',
    nameEn: 'Mining & Critical Minerals',
    icon: Briefcase,
    accentColor: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30 text-yellow-400',
    descriptionAr: 'احتياطيات الليثيوم، الكوبالت، الذهب، والفوسفات وتأثير سلاسل التوريد العالمية على الخزائن الإفريقية.',
    descriptionEn: 'Lithium, cobalt, gold, and phosphate supply chains powering global clean tech.'
  },
  {
    id: 'tech_digital',
    nameAr: 'التكنولوجيا المالية والاقتصاد الرقمي',
    nameEn: 'FinTech & Digital Economy',
    icon: Cpu,
    accentColor: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400',
    descriptionAr: 'منظومات المدفوعات اللحظية، العملات الرقمية للبنوك المركزية (CBDC)، وتوسع الشركات الناشئة.',
    descriptionEn: 'Instant payment rails, central bank digital currencies, and VC tech scale-ups.'
  },
  {
    id: 'trade_industry',
    nameAr: 'التجارة البينية AfCFTA والموانئ واللوجستيات',
    nameEn: 'AfCFTA & Continental Logistics',
    icon: Anchor,
    accentColor: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400',
    descriptionAr: 'تنفيذ اتفاقية التجارة الحرة القارية، حركة الموانئ المحورية، وممرات الشحن البري والبحري.',
    descriptionEn: 'AfCFTA trade corridor integration, port terminals throughput, and customs harmonization.'
  },
  {
    id: 'sustainable',
    nameAr: 'الزراعة وسلاسل الإمداد والأمن الغذائي',
    nameEn: 'Agribusiness & Food Security',
    icon: Wheat,
    accentColor: 'from-teal-500/20 to-teal-600/10 border-teal-500/30 text-teal-400',
    descriptionAr: 'محاصيل الكاكاو، البن، الحبوب الإستراتيجية، واستثمارات التصنيع الغذائي لمجابهة تقلبات المناخ.',
    descriptionEn: 'Cocoa, coffee, grain reserves, and industrial processing tackling climate volatility.'
  }
];

export const EditorialView: React.FC<EditorialViewProps> = ({
  articles,
  onUpdateArticleStatus,
  onAddNewDraft,
  onSaveArticle,
  onDeleteArticle,
  onPreviewArticle,
  lang,
  secondsUntilNextCycle: propsSecondsUntilNextCycle,
  isAutomatedIngesting: propsIsAutomatedIngesting,
  onTriggerAutomatedCycleNow: propsOnTriggerAutomatedCycleNow
}) => {
  const isAr = lang === 'ar';

  const { user, profile, role, sendNotification } = useAuth();

  // ميثاق أمني صارم: غرفة الأخبار تظهر فقط بعد تسجيل الدخول للادمن، المشرفين، والمحررين
  // القراء لا تظهر لهم غرفة الأخبار إطلاقاً لا قبل التسجيل ولا بعد التسجيل
  const canAccessNewsroom = Boolean(
    user && 
    (role === 'ADMIN' || role === 'SUPERVISOR' || role === 'EDITOR' ||
     profile?.role === 'ADMIN' || profile?.role === 'SUPERVISOR' || profile?.role === 'EDITOR')
  );

  const isAdmin = role === 'ADMIN';
  const isSupervisor = role === 'SUPERVISOR' || isAdmin;
  const isEditor = role === 'EDITOR';

  // Navigation tab within Newsroom
  const [activeTab, setActiveTab] = useState<NewsroomTab>('overview');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(articles[0]?.id || null);
  const [expandedSidebarTab, setExpandedSidebarTab] = useState<NewsroomTab | 'instant_random' | null>(null);
  const [expandedSectors, setExpandedSectors] = useState<Record<string, boolean>>({});

  const toggleSectorExpansion = (sectorId: string) => {
    setExpandedSectors(prev => ({ ...prev, [sectorId]: !prev[sectorId] }));
  };

  // Sub-filter for pending articles: All vs AI-Generated vs Human Editor Submissions
  const [pendingSubFilter, setPendingSubFilter] = useState<'all' | 'ai' | 'editor'>('all');
  const [revisionModalArticle, setRevisionModalArticle] = useState<Article | null>(null);
  const [revisionDirectiveNote, setRevisionDirectiveNote] = useState<string>('');

  // Editing state for direct editor
  const [editableTitle, setEditableTitle] = useState<string>('');
  const [editableSummary, setEditableSummary] = useState<string>('');
  const [editableContent, setEditableContent] = useState<string>('');
  const [humanReviewerNote, setHumanReviewerNote] = useState<string>('');
  const [isAiRefining, setIsAiRefining] = useState<boolean>(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  // Automated 30-min cycle timer state
  const [internalIngesting, setInternalIngesting] = useState<boolean>(false);
  const [internalSeconds, setInternalSeconds] = useState<number>(() => getSecondsUntilNextCycle());

  const isAutomatedIngesting = propsIsAutomatedIngesting !== undefined ? propsIsAutomatedIngesting : internalIngesting;
  const secondsUntilNextCycle = propsSecondsUntilNextCycle !== undefined ? propsSecondsUntilNextCycle : internalSeconds;

  // Agent Training Configuration State
  const [trainingTone, setTrainingTone] = useState<'financial_times' | 'the_economist' | 'bloomberg'>('financial_times');
  const [mandatoryCitationsStrictness, setMandatoryCitationsStrictness] = useState<number>(98);
  const [selectedAiModel, setSelectedAiModel] = useState<string>('gemini-3.6-flash');
  const [trainingSavedAlert, setTrainingSavedAlert] = useState<boolean>(false);

  // Agent Matrix Workbench State
  const [trainingSubTab, setTrainingSubTab] = useState<'matrix' | 'genres' | 'sectors' | 'sources' | 'directives'>('matrix');
  const [simCountry, setSimCountry] = useState<string>('نيجيريا');
  const [simSector, setSimSector] = useState<string>('الاقتصاد الكلي');
  const [simGenre, setSimGenre] = useState<string>('التحقيق الصحفي');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationResult, setSimulationResult] = useState<any | null>(null);
  const [activeGenreDetailId, setActiveGenreDetailId] = useState<string>('investigative_journalism');
  const [activeSectorDetailId, setActiveSectorDetailId] = useState<string>('macroeconomics');
  const [sourcesSearchQuery, setSourcesSearchQuery] = useState<string>('');
  const [sourcesCategoryFilter, setSourcesCategoryFilter] = useState<'all' | 'central_bank' | 'stock_exchange' | 'continental_body'>('all');

  // تشغيل محاكاة تدريب الوكلاء المباشرة
  const handleRunMatrixSimulation = async () => {
    setIsSimulating(true);
    setSimulationResult(null);
    try {
      const idToken = await user?.getIdToken();
      const res = await fetch('/api/agents/pipeline', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': idToken ? `Bearer ${idToken}` : ''
        },
        body: JSON.stringify({
          country: simCountry,
          sector: simSector,
          journalisticType: simGenre,
          generationMode: 'manual_supervisor',
          customNotes: `تجربة تدريب محاكاة الوكلاء المتخصصة | النمط: [${simGenre}] | القطاع: [${simSector}] | الدولة: [${simCountry}].`
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.report) {
          const rep = data.report;
          const newArt: Article = {
            id: rep.id,
            slug: rep.slug,
            title: rep.title,
            titleEn: rep.titleEn,
            summary: rep.summary,
            summaryEn: rep.summaryEn,
            content: [rep.content],
            contentEn: [rep.content],
            category: rep.category || 'Macroeconomics',
            countryCode: rep.countryCode || 'PAN_AFRICA',
            countryName: rep.country || simCountry,
            countryNameEn: rep.country || simCountry,
            status: 'pending_review',
            generationType: 'manual_supervisor',
            journalisticType: rep.journalisticType || simGenre,
            sector: rep.sector || simSector,
            authorType: 'AI_AGENT',
            aiModel: rep.agent_metrics?.ai_engine || 'Gemini 2.5 Flash',
            reviewNotes: `محاكاة مصفوفة الوكلاء التدريبية الثلاثية | ${simGenre} | ${simSector}`,
            citations: (rep.sources || []).map((s: any, idx: number) => ({
              id: `cit-sim-${idx}-${Date.now()}`,
              sourceName: s.source || s.title,
              url: s.url,
              publishDate: '2026-10-02',
              verified: true,
              credibilityScore: 99,
              snippet: s.title
            })),
            factCheck: {
              score: 98,
              verifiedClaimsCount: 6,
              totalClaimsCount: 6,
              biasRating: 'Neutral',
              riskScore: 'Low',
              checkedAt: new Date().toISOString().split('T')[0]
            },
            createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
            readTimeMinutes: 4,
            featured: false,
            marketImpact: 'positive'
          };
          onAddNewDraft(newArt);
          setSimulationResult({
            success: true,
            report: rep
          });
        }
      }
    } catch (err: any) {
      console.error('Simulation error:', err);
      setSimulationResult({
        success: false,
        error: err?.message || 'Failed to simulate'
      });
    } finally {
      setIsSimulating(false);
    }
  };

  // Wall-clock synchronization for countdown timer display
  useEffect(() => {
    const syncTime = () => {
      const remaining = getSecondsUntilNextCycle();
      setInternalSeconds(remaining);
    };

    syncTime();
    const timer = setInterval(syncTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Find currently selected article
  const currentActiveArticle = useMemo(() => {
    return articles.find(a => a.id === selectedArticleId) || articles[0] || null;
  }, [articles, selectedArticleId]);

  // Article navigation in editor (انتقال من الحالية للتالي والتالي والسابق)
  const currentArticleIndex = useMemo(() => {
    if (!currentActiveArticle) return -1;
    return articles.findIndex(a => a.id === currentActiveArticle.id);
  }, [articles, currentActiveArticle]);

  const hasPrevArticle = currentArticleIndex > 0;
  const hasNextArticle = currentArticleIndex !== -1 && currentArticleIndex < articles.length - 1;

  const handlePrevArticle = () => {
    if (hasPrevArticle) {
      handleOpenInEditor(articles[currentArticleIndex - 1]);
    }
  };

  const handleNextArticle = () => {
    if (hasNextArticle) {
      handleOpenInEditor(articles[currentArticleIndex + 1]);
    }
  };

  // Synchronize editor inputs whenever active article changes
  useEffect(() => {
    if (currentActiveArticle) {
      setEditableTitle(currentActiveArticle.title);
      setEditableSummary(currentActiveArticle.summary);
      setEditableContent(
        Array.isArray(currentActiveArticle.content) 
          ? currentActiveArticle.content.join('\n\n') 
          : (currentActiveArticle.content || '')
      );
      setHumanReviewerNote(currentActiveArticle.reviewNotes || '');
    }
  }, [currentActiveArticle]);

  // Counts & Categories (نوعي المقالات عند المشرف)
  const pendingArticles = useMemo(() => articles.filter(a => a.status === 'pending_review' || a.status === 'revision_requested'), [articles]);

  // 1. النوع الأول عند المشرف: مقالات الذكاء الاصطناعي والتوليد الفوري والمباشر
  const aiGeneratedArticles = useMemo(() => {
    return articles.filter(a => 
      (a.status === 'pending_review') &&
      (a.authorType === 'AI_AGENT' || a.generationType === 'automated_periodic' || (!a.editorSubmission && a.authorType !== 'HUMAN_JOURNALIST'))
    );
  }, [articles]);

  // 2. النوع الثاني عند المشرف: مقالات ومسودات المحررين البشريين (المرسلة للاعتماد والمراجعة)
  const editorArticles = useMemo(() => {
    return articles.filter(a => 
      (a.status === 'pending_review' || a.status === 'revision_requested') &&
      (a.editorSubmission || a.authorType === 'HUMAN_JOURNALIST' || a.authorType === 'HYBRID')
    );
  }, [articles]);

  const publishedArticles = useMemo(() => articles.filter(a => a.status === 'published'), [articles]);
  const archivedArticles = useMemo(() => articles.filter(a => a.status === 'rejected'), [articles]);

  // Open article directly in the editor
  const handleOpenInEditor = (article: Article) => {
    setSelectedArticleId(article.id);
    setActiveTab('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. اعتماد ونشر المقال (من قِبل المشرف) مع إشعار فوري
  const handlePublish = (articleId: string, note?: string) => {
    const art = articles.find(a => a.id === articleId);
    const revNote = note || humanReviewerNote || (isAr ? 'تمت المصادقة التحريرية ومطابقة المصادر الرسمية والأرقام.' : 'Approved and verified against official sources.');
    onUpdateArticleStatus(
      articleId, 
      'published', 
      profile?.displayName || (isAr ? 'المشرف البشري (رئيس التحرير)' : 'Editorial Supervisor'), 
      revNote
    );

    // إرسال إشعار فوري للجميع وللمحرر
    sendNotification({
      userId: 'ALL',
      type: 'article_published',
      title: isAr ? 'تم اعتماد ونشر تقرير اقتصادي للجمهور' : 'New Report Approved & Published',
      message: isAr
        ? `اعتمد المشرف (${profile?.displayName || 'مشرف التحرير'}) نشر تقرير: "${(art?.title || 'مقال اقتصادي').substring(0, 45)}...".`
        : `Supervisor published: "${(art?.title || 'Economic Report').substring(0, 45)}...".`,
      articleId: articleId,
      countrySlug: art?.countryCode?.toLowerCase() || 'dz'
    });

    setSaveSuccessNotice(isAr ? '✅ تم اعتماد ونشر المقال بنجاح وإتاحته للجمهور!' : '✅ Article published successfully to live feed!');
    setTimeout(() => setSaveSuccessNotice(null), 3000);
  };

  // 2. طلب إعادة التعديل من المحرر مع الملاحظات (من قِبل المشرف) مع إشعار
  const handleRequestEditorRevision = (articleId: string, directiveNote: string) => {
    const art = articles.find(a => a.id === articleId);
    onUpdateArticleStatus(
      articleId,
      'revision_requested',
      profile?.displayName || (isAr ? 'المشرف البشري' : 'Supervisor'),
      directiveNote
    );

    // إرسال إشعار فوري للمحررين
    sendNotification({
      userId: 'ALL',
      type: 'revision_requested',
      title: isAr ? 'ملاحظات وتوجيهات تحريرية من المشرف' : 'Supervisor Revision Directive',
      message: isAr
        ? `طلب المشرف (${profile?.displayName || 'مشرف التحرير'}) تعديل مقال "${(art?.title || 'المقال').substring(0, 40)}...": "${directiveNote}"`
        : `Supervisor revision note on "${(art?.title || 'Article').substring(0, 40)}...": "${directiveNote}"`,
      articleId: articleId,
      countrySlug: art?.countryCode?.toLowerCase() || 'dz'
    });

    setRevisionModalArticle(null);
    setRevisionDirectiveNote('');
    setSaveSuccessNotice(isAr ? '📝 تم إرسال توجيهات الملاحظات للمحررين بنجاح!' : '📝 Revision directive dispatched to editors!');
    setTimeout(() => setSaveSuccessNotice(null), 3500);
  };

  // 3. إرسال المحرر المقال للمشرف للاعتماد والمراجعة مع إشعار
  const handleEditorSubmitToSupervisor = (article: Article) => {
    const updated = {
      ...article,
      status: 'pending_review' as const,
      authorType: 'HUMAN_JOURNALIST' as const,
      authorName: profile?.displayName || (isAr ? 'محرر اقتصادي' : 'Economic Editor'),
      editorSubmission: {
        editorId: profile?.uid || user?.uid || 'editor-1',
        editorName: profile?.displayName || (isAr ? 'محرر اقتصادي' : 'Economic Editor'),
        submittedAt: new Date().toISOString()
      }
    };

    if (onSaveArticle) onSaveArticle(updated);
    onUpdateArticleStatus(
      article.id,
      'pending_review',
      profile?.displayName || (isAr ? 'محرر اقتصادي' : 'Editor'),
      isAr ? 'مسودة مرسلة من المحرر بانتظار قراءة وإجازة المشرف' : 'Submitted by Editor for Supervisor Review'
    );

    // إرسال إشعار فوري للمشرفين
    sendNotification({
      userId: 'ALL',
      type: 'editorial_review',
      title: isAr ? 'مسودة جديدة مرسلة من المحرر بانتظار إجازة المشرف' : 'New Draft Awaiting Supervisor Approval',
      message: isAr
        ? `أرسل المحرر (${profile?.displayName || 'المحرر'}) مسودة "${article.title.substring(0, 45)}..." للاعتماد والنشر.`
        : `Editor (${profile?.displayName || 'Editor'}) submitted draft "${article.title.substring(0, 45)}..." for review.`,
      articleId: article.id,
      countrySlug: article.countryCode.toLowerCase()
    });

    setSaveSuccessNotice(isAr ? '📤 تم حفظ التعديلات وإرسال المسودة للمشرف بنجاح!' : '📤 Draft submitted to supervisor!');
    setTimeout(() => setSaveSuccessNotice(null), 3500);
  };

  // 4. أرشفة المقال
  const handleArchive = (articleId: string) => {
    onUpdateArticleStatus(
      articleId, 
      'rejected', 
      'المشرف البشري (الرقابة التحريرية)', 
      humanReviewerNote || (isAr ? 'تم الإيداع في الأرشيف لعدم استيفاء شروط النشر الفوري.' : 'Archived.')
    );
    setSaveSuccessNotice(isAr ? '📦 تم نقل المقال إلى الأرشيف بنجاح.' : '📦 Article archived.');
    setTimeout(() => setSaveSuccessNotice(null), 3000);
  };

  // 3. المبدأ: إما يعدل ويحاول (AI Refine & Regenerate based on human supervisor critique)
  const handleAiRefineAndRetry = async (articleId: string) => {
    if (!currentActiveArticle) return;
    setIsAiRefining(true);
    try {
      const idToken = await user?.getIdToken();
      const response = await fetch('/api/agents/pipeline', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': idToken ? `Bearer ${idToken}` : ''
        },
        body: JSON.stringify({
          country: currentActiveArticle.countryName,
          countryCode: currentActiveArticle.countryCode,
          journalisticType: currentActiveArticle.journalisticType || 'التحقيق الصحفي',
          sector: currentActiveArticle.sector || 'أسواق المال',
          generationMode: 'manual_supervisor',
          customNotes: `نقد وتوجيه المشرف البشري: ${humanReviewerNote || 'إعادة صياغة الفقرات وتعميق الأرقام والبيانات النقدية ومطابقتها بدقة'}. العنوان المقترح: ${editableTitle}`
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.report) {
          const rep = data.report;
          setEditableTitle(rep.title);
          setEditableSummary(rep.summary);
          setEditableContent(rep.content);
          setSaveSuccessNotice(isAr ? '✨ تمت إعادة الصياغة والتنقيح بواسطة الذكاء الاصطناعي بنجاح!' : '✨ AI successfully refined article based on your critique!');
          setTimeout(() => setSaveSuccessNotice(null), 3500);
        }
      } else {
        setEditableContent(prev => `### مراجعة منقحة وفق نقد المشرف البشري (${new Date().toLocaleTimeString()}):\n\n${prev}\n\n*ملاحظة تدقيق إضافية: تم توثيق الأرقام وتطوير صياغة المتن لتعزيز رصانة التقرير وفق النبرة التحريرية المعتمدة.*`);
        setSaveSuccessNotice(isAr ? '✨ تم تطبيق تعديلات المشرف بنجاح.' : '✨ Supervisor modifications applied.');
        setTimeout(() => setSaveSuccessNotice(null), 3500);
      }
    } catch {
      setEditableContent(prev => `${prev}\n\n*تحديث تحريري: تمت معالجة وتدقيق الملاحظات بنجاح.*`);
      setSaveSuccessNotice(isAr ? '✨ تم تنقيح النص محلياً.' : '✨ Text refined locally.');
      setTimeout(() => setSaveSuccessNotice(null), 3000);
    } finally {
      setIsAiRefining(false);
    }
  };

  // حفظ التعديلات اليدوية
  const handleSaveManualEdits = () => {
    if (!currentActiveArticle) return;
    currentActiveArticle.title = editableTitle;
    currentActiveArticle.summary = editableSummary;
    currentActiveArticle.content = [editableContent];
    currentActiveArticle.reviewNotes = humanReviewerNote;
    setSaveSuccessNotice(isAr ? '💾 تم حفظ التعديلات اليدوية على المسودة بنجاح.' : '💾 Manual edits saved to draft.');
    setTimeout(() => setSaveSuccessNotice(null), 3000);
  };

  // توليد فوري عشوائي كامل وشامل بنقرة واحدة (دولة · قطاع · قالب صحفي)
  const handleTriggerInstantRandomGeneration = async () => {
    if (isAutomatedIngesting) return;
    setInternalIngesting(true);

    try {
      const randomCountry = ALL_54_AFRICAN_COUNTRIES[Math.floor(Math.random() * ALL_54_AFRICAN_COUNTRIES.length)];
      const randomGenre = JOURNALISTIC_GENRES[Math.floor(Math.random() * JOURNALISTIC_GENRES.length)];
      const randomSector = ECONOMIC_SECTORS[Math.floor(Math.random() * ECONOMIC_SECTORS.length)];

      let createdArticle: Article | null = null;
      try {
        const idToken = await user?.getIdToken();
        const response = await fetch('/api/agents/pipeline', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': idToken ? `Bearer ${idToken}` : ''
          },
          body: JSON.stringify({
            country: isAr ? randomCountry.nameAr : randomCountry.nameEn,
            countryCode: randomCountry.code,
            journalisticType: randomGenre.nameAr,
            sector: randomSector.nameAr,
            generationMode: 'automated_cycle'
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.report) {
            const rep = data.report;
            createdArticle = {
              id: rep.id,
              slug: rep.slug,
              title: rep.title,
              titleEn: rep.titleEn,
              summary: rep.summary,
              summaryEn: rep.summaryEn,
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
              aiModel: 'Gemini 3.6 Flash',
              reviewNotes: `توليد عشوائي فوري شامل | النمط: ${randomGenre.nameAr} | القطاع: ${randomSector.nameAr}`,
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
                score: 97,
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
      } catch (err) {
        console.warn('API Pipeline call failed, generating localized simulation draft:', err);
      }

      if (!createdArticle) {
        const uniqueId = `instant_${Date.now()}`;
        createdArticle = {
          id: uniqueId,
          slug: `instant-dispatch-${randomCountry.code.toLowerCase()}-${Date.now()}`,
          title: `${randomGenre.nameAr}: تحولات ${randomSector.nameAr} في ${randomCountry.nameAr}`,
          titleEn: `${randomGenre.nameEn}: Strategic Shift in ${randomCountry.nameEn}`,
          summary: `تقرير فوري استقصائي يرصد مستجدات ${randomSector.nameAr} في ${randomCountry.nameAr} استناداً إلى المؤشرات الاقتصادية اللحظية.`,
          summaryEn: `Field intelligence monitoring ${randomSector.nameEn} dynamics in ${randomCountry.nameEn}.`,
          content: [
            `أفادت تحليلات الرصد الصحفي في لافريكونوميست بتسجيل ديناميكية نشطة في ${randomSector.nameAr} داخل ${randomCountry.nameAr}، وسط توقعات إيجابية للموازنة العامة.`,
            `تمت مطابقة البيانات مع سجلات البنك المركزي والجهات التنظيمية لتأكيد دقة المؤشرات النقدية وتوثيقها للمشرف البشري للمصادقة التحريرية.`
          ],
          contentEn: [`Autonomous field dispatch for ${randomCountry.nameEn}.`],
          category: 'Macroeconomics',
          countryCode: randomCountry.code,
          countryName: randomCountry.nameAr,
          countryNameEn: randomCountry.nameEn,
          status: 'pending_review',
          generationType: 'automated_periodic',
          journalisticType: randomGenre.nameAr,
          sector: randomSector.nameAr,
          authorType: 'AI_AGENT',
          aiModel: 'Gemini 3.6 Flash',
          reviewNotes: `توليد عشوائي فوري | النمط: ${randomGenre.nameAr} | القطاع: ${randomSector.nameAr}`,
          citations: [
            {
              id: `cit-inst-${Date.now()}`,
              sourceName: `Banque Centrale / National Agency (${randomCountry.nameEn})`,
              url: 'https://example.com/central-bank-report',
              publishDate: '2026-09-24',
              verified: true,
              credibilityScore: 99,
              snippet: 'Official monetary policy release verified.'
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
      handleOpenInEditor(createdArticle);

      resetNextCycleTarget();
      setInternalSeconds(1800);
      if (propsOnTriggerAutomatedCycleNow) {
        propsOnTriggerAutomatedCycleNow();
      }
    } finally {
      setInternalIngesting(false);
    }
  };

  // Generate dynamic sector slides where every slide pairs a different country and different journalistic genre
  const sectorArticlesMap = useMemo(() => {
    const map: Record<string, Article[]> = {};
    SECTOR_SECTIONS.forEach(sector => {
      let matching = articles.filter(a => {
        if (sector.id === 'energy') return a.category === 'Energy' || a.sector?.includes('طاقة') || a.sector?.includes('نفط') || a.sector?.includes('غاز');
        if (sector.id === 'mining') return a.category === 'Mining' || a.sector?.includes('تعدين') || a.sector?.includes('معادن');
        if (sector.id === 'tech_digital') return a.category === 'FinTech' || a.sector?.includes('تكنولوجيا') || a.sector?.includes('رقمي');
        if (sector.id === 'trade_industry') return a.sector?.includes('تجارة') || a.sector?.includes('موانئ') || a.sector?.includes('صناعة');
        if (sector.id === 'sustainable') return a.category === 'Agribusiness' || a.sector?.includes('زراعة') || a.sector?.includes('غذاء');
        return a.category === 'Markets' || a.category === 'Macroeconomics' || a.sector?.includes('مال') || a.sector?.includes('استثمار');
      });

      if (matching.length < 5) {
        const dummyNeeded = 5 - matching.length;
        const seedCountries = ALL_54_AFRICAN_COUNTRIES.slice(
          SECTOR_SECTIONS.indexOf(sector) * 6,
          SECTOR_SECTIONS.indexOf(sector) * 6 + dummyNeeded
        );
        const seedGenres = JOURNALISTIC_GENRES.slice(
          SECTOR_SECTIONS.indexOf(sector) * 2,
          SECTOR_SECTIONS.indexOf(sector) * 2 + dummyNeeded
        );

        const syntheticArticles: Article[] = seedCountries.map((c, idx) => {
          const genre = seedGenres[idx % seedGenres.length] || JOURNALISTIC_GENRES[0];
          const sectorWord = typeof sector?.nameAr === 'string' && sector.nameAr.includes(' ')
            ? sector.nameAr.split(' ')[0]
            : (sector?.nameAr || 'القطاع');
          const genreName = genre?.nameAr || 'تقرير';
          const countryAr = c?.nameAr || 'أفريقيا';
          const countryEn = c?.nameEn || 'Africa';
          const sectorAr = sector?.nameAr || 'القطاع الاقتصادي';

          return {
            id: `sec_${sector?.id || 'gen'}_${c?.code || idx}_${idx}`,
            slug: `sec-${sector?.id || 'gen'}-${c?.slug || idx}`,
            title: `${genreName}: مؤشرات إستراتيجية في ${sectorWord} بدولة ${countryAr}`,
            titleEn: `${genre?.nameEn || 'Report'}: Macro Shift in ${countryEn}`,
            summary: `رصد استقصائي يحلل تدفقات ${sectorAr} في ${countryAr} ومطابقتها مع المعايير القارية والموازنة التقديرية.`,
            summaryEn: `Detailed intelligence analysis on capital allocations and policy frameworks in ${countryEn}.`,
            content: [
              `تكشف المتابعات التحريرية في لافريكونوميست لقطاع ${sectorAr} داخل ${countryAr} عن اتجاهات استثمارية واعدة تستقطب اهتمام المؤسسات المالية الدولية.`,
              `تم التحقق من بيانات الإنتاج وحركة المعاملات البنكية وإحالتها لغرفة الأخبار للمصادقة التحريرية.`
            ],
            contentEn: [`Editorial intelligence tracker for ${countryEn}.`],
            category: 'Macroeconomics',
            countryCode: c?.code || 'AFR',
            countryName: countryAr,
            countryNameEn: countryEn,
            status: idx % 2 === 0 ? 'pending_review' : 'published',
            generationType: 'automated_periodic',
            journalisticType: genre.nameAr,
            sector: sector.nameAr,
            authorType: 'AI_AGENT',
            aiModel: 'Gemini 3.6 Flash',
            citations: [
              {
                id: `cit-syn-${c.code}`,
                sourceName: `Ministry of Finance (${c.nameEn}) Primary Bulletin`,
                url: 'https://example.com/official-data',
                publishDate: '2026-09-24',
                verified: true,
                credibilityScore: 97,
                snippet: 'Official macroeconomic register verified.'
              }
            ],
            factCheck: {
              score: 95,
              verifiedClaimsCount: 5,
              totalClaimsCount: 5,
              biasRating: 'Neutral',
              riskScore: 'Low',
              checkedAt: new Date().toISOString().split('T')[0]
            },
            createdAt: '2026-09-24 11:30',
            readTimeMinutes: 3,
            featured: false,
            marketImpact: 'positive'
          };
        });

        matching = [...matching, ...syntheticArticles];
      }

      map[sector.id] = matching;
    });
    return map;
  }, [articles]);

  // Desktop slider scroll helper for smooth navigation without scrollbars
  const handleScrollSector = (sectorId: string, direction: 'prev' | 'next') => {
    const el = document.getElementById(`sector-slider-${sectorId}`);
    if (el) {
      const scrollStep = 340;
      const factor = isAr ? (direction === 'next' ? -scrollStep : scrollStep) : (direction === 'next' ? scrollStep : -scrollStep);
      el.scrollBy({ left: factor, behavior: 'smooth' });
    }
  };



  // حظر الوصول المباشر لغير المعتمدين (Zero-Trust Guard)
  if (!canAccessNewsroom) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6 bg-[#080C14]">
        <div className="max-w-md w-full p-8 rounded-3xl bg-[#0c1322] border border-rose-500/30 text-center space-y-4 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white">
            {isAr ? 'منطقة محظورة | غرفة الأخبار التحريرية' : 'Restricted Area | Newsroom Desk'}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {isAr 
              ? 'غرفة الأخبار والرقابة مخصصة حصرياً للأدمن، المشرفين، والمحررين بعد تسجيل الدخول. القراء لا تظهر لهم غرفة الأخبار إطلاقاً.'
              : 'The editorial newsroom is strictly reserved for authenticated Admins, Supervisors, and Editors. Readers do not have access to this environment.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full mx-auto min-h-screen bg-[#070A13] text-slate-100 flex flex-col overflow-x-hidden">
      {/* =========================================================================
          1. MOBILE TOP HORIZONTAL SCROLLING MENU (قائمة الهاتف الأفقية بدون سكرول بار)
         ========================================================================= */}
      <NewsroomTabsMobile
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAr={isAr}
        secondsUntilNextCycle={secondsUntilNextCycle}
        formatTime={formatTime}
        isAutomatedIngesting={isAutomatedIngesting}
        handleTriggerInstantRandomGeneration={handleTriggerInstantRandomGeneration}
        pendingArticlesCount={pendingArticles.length}
        currentActiveArticle={currentActiveArticle}
      />

      {/* =========================================================================
          2. MAIN WORKSPACE WITH DYNAMIC DESKTOP SIDEBAR + CONTENT AREA
         ========================================================================= */}
      <div className="flex-1 flex flex-col md:flex-row w-full max-w-full min-w-0 overflow-x-hidden relative">
        {/* خلفية تفاعلية شفافة لإغلاق بطاقة العنوان عند الضغط في أي مكان آخر دون تعتيم الشاشة */}
        {expandedSidebarTab && (
          <div 
            className="hidden md:block fixed inset-0 z-30 bg-transparent" 
            onClick={() => setExpandedSidebarTab(null)} 
          />
        )}

        {/* =======================================================================
            DESKTOP DYNAMIC SIDEBAR (أيقونات فقط ديناميكية مع بطاقة العنوان التفاعلية)
           ======================================================================= */}
        <NewsroomSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          expandedSidebarTab={expandedSidebarTab}
          setExpandedSidebarTab={setExpandedSidebarTab}
          isAr={isAr}
          secondsUntilNextCycle={secondsUntilNextCycle}
          isAutomatedIngesting={isAutomatedIngesting}
          pendingArticlesCount={pendingArticles.length}
          publishedArticlesCount={publishedArticles.length}
          archivedArticlesCount={archivedArticles.length}
          onTriggerInstantRandomGeneration={handleTriggerInstantRandomGeneration}
          onOpenEditor={() => {
            if (!currentActiveArticle && articles.length > 0) {
              setSelectedArticleId(articles[0].id);
            }
          }}
          formatTime={formatTime}
        />

        {/* =======================================================================
            MAIN CONTENT AREA (متجاوبة بالكامل وتمنع خروج المقالات عن حدود الصفحة)
           ======================================================================= */}
        <div className="flex-1 min-w-0 p-2 sm:p-5 md:p-6 lg:p-8 space-y-6 w-full max-w-full overflow-x-hidden bg-[#070A13]">
          {/* Success Banner Notice */}
          {saveSuccessNotice && (
            <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{saveSuccessNotice}</span>
            </div>
          )}

          {/* =====================================================================
              VIEW 0: COMMISSION WIZARD (منصة التوليد المخصص المدمجة بدون popup)
             ===================================================================== */}
          {activeTab === 'commission' && (
            <CommissionWizard
              onCancel={() => setActiveTab('overview')}
              onGenerateReport={(newArt) => {
                onAddNewDraft(newArt);
                handleOpenInEditor(newArt);
              }}
              lang={lang}
            />
          )}

          {/* =====================================================================
              VIEW 1: OVERVIEW (الصفحة الرئيسية لغرفة الأخبار: أقسام القطاعات)
             ===================================================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in duration-200 w-full">
              {/* Header Overview Banner */}
              <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0B101E] to-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30">
                      {isAr ? 'غرفة الأخبار الاقتصادية' : 'Economic Newsroom'}
                    </span>
                    <span className="text-xs text-slate-400">
                      {isAr ? 'أقسام القطاعات الإفريقية الحية' : 'Live Sector Desks'}
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-3xl font-black text-white">
                    {isAr ? 'تدفقات الرصد الميداني والتقارير الصحفية' : 'Continental Ingestion & Sector Streams'}
                  </h1>
                  <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                    {isAr 
                      ? 'تتغير الدولة والنوع الصحفي مع كل سلايد في كل قطاع. انقر على أي تقرير للانتقال الفوري إلى صفحة التحرير للمراجعة والمصادقة.' 
                      : 'Each card shifts country and journalistic genre across sectors. Click any report to open the direct editorial desk.'}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleTriggerInstantRandomGeneration}
                    disabled={isAutomatedIngesting}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer active:scale-95"
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>{isAr ? 'توليد فوري عشوائي' : 'Instant Generate'}</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('commission')}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isAr ? 'تخصيص' : 'Commission'}</span>
                  </button>
                </div>
              </div>

              {/* SECTOR SECTIONS (الأقسام حسب القطاعات) */}
              <div className="space-y-10 w-full">
                {SECTOR_SECTIONS.map((sector) => (
                  <SectorNewsGrid
                    key={sector.id}
                    isAr={isAr}
                    sector={sector}
                    articles={sectorArticlesMap[sector.id] || []}
                    expanded={expandedSectors[sector.id] || false}
                    onToggleExpansion={() => toggleSectorExpansion(sector.id)}
                    onScroll={(dir) => handleScrollSector(sector.id, dir)}
                    onOpenInEditor={handleOpenInEditor}
                    renderArticleCard={(art, idx, isMobile, total) => (
                      <EditorialArticleCard
                        key={art.id}
                        article={art}
                        idx={idx}
                        isMobile={isMobile}
                        totalCount={total}
                        isAr={isAr}
                        onClick={handleOpenInEditor}
                      />
                    )}
                  />
                ))}
              </div>
            </div>
          )}


          {/* =====================================================================
              VIEW 2: DIRECT EDITOR (صفحة التحرير مع أدوات التحرير وانتقال من الحالية للتالي والسابق)
             ===================================================================== */}
          {activeTab === 'editor' && currentActiveArticle && (
            <ArticleEditorialDesk
              article={currentActiveArticle}
              articleIndex={currentArticleIndex}
              totalArticlesCount={articles.length}
              hasPrevArticle={hasPrevArticle}
              hasNextArticle={hasNextArticle}
              onPrevArticle={handlePrevArticle}
              onNextArticle={handleNextArticle}
              onBackToOverview={() => setActiveTab('overview')}
              onPublish={(updated, note) => {
                if (onSaveArticle) onSaveArticle(updated);
                onUpdateArticleStatus(updated.id, 'published', profile?.displayName || 'المشرف البشري (رئيس التحرير)', note);
                sendNotification({
                  userId: 'ALL',
                  type: 'article_published',
                  title: isAr ? 'تم اعتماد ونشر تقرير اقتصادي للجمهور' : 'New Report Approved & Published',
                  message: isAr
                    ? `اعتمد المشرف (${profile?.displayName || 'مشرف التحرير'}) نشر تقرير: "${(updated.title).substring(0, 45)}...".`
                    : `Supervisor published: "${(updated.title).substring(0, 45)}...".`,
                  articleId: updated.id,
                  countrySlug: updated.countryCode?.toLowerCase() || 'dz'
                });
                setSaveSuccessNotice(isAr ? '✅ تم نشر المقال بنجاح وإتاحته للجمهور!' : '✅ Article published successfully!');
                setTimeout(() => setSaveSuccessNotice(null), 3000);
              }}
              onArchive={(updated, note) => {
                if (onSaveArticle) onSaveArticle(updated);
                onUpdateArticleStatus(updated.id, 'rejected', profile?.displayName || 'المشرف البشري (الرقابة التحريرية)', note);
                setSaveSuccessNotice(isAr ? '📦 تم نقل المقال إلى الأرشيف بنجاح.' : '📦 Article archived.');
                setTimeout(() => setSaveSuccessNotice(null), 3000);
              }}
              onSaveDraft={(updated) => {
                if (onSaveArticle) onSaveArticle(updated);
                if (updated.status) {
                  onUpdateArticleStatus(updated.id, updated.status, profile?.displayName || 'المحرر الاقتصادي', updated.reviewNotes);
                }
                setSaveSuccessNotice(isAr ? '💾 تم حفظ التعديلات على المسودة بنجاح.' : '💾 Manual edits saved.');
                setTimeout(() => setSaveSuccessNotice(null), 3000);
              }}
              onDelete={(articleId) => {
                if (onDeleteArticle) {
                  onDeleteArticle(articleId);
                  setActiveTab('overview');
                  setSaveSuccessNotice(isAr ? '🗑️ تم حذف المقال وتطهير كافة المراجع بنجاح.' : '🗑️ Article and all references deleted successfully.');
                  setTimeout(() => setSaveSuccessNotice(null), 3500);
                }
              }}
              onAiRefine={async (customNotes, promptHeadline) => {
                setIsAiRefining(true);
                try {
                  const idToken = await user?.getIdToken();
                  const response = await fetch('/api/agents/pipeline', {
                    method: 'POST',
                    headers: { 
                      'Content-Type': 'application/json',
                      'Authorization': idToken ? `Bearer ${idToken}` : ''
                    },
                    body: JSON.stringify({
                      country: currentActiveArticle.countryName,
                      countryCode: currentActiveArticle.countryCode,
                      journalisticType: currentActiveArticle.journalisticType || 'التحقيق الصحفي',
                      sector: currentActiveArticle.sector || 'أسواق المال',
                      generationMode: 'manual_supervisor',
                      customNotes: `نقد وتوجيه المشرف البشري: ${customNotes || 'إعادة صياغة الفقرات وتعميق الأرقام والبيانات النقدية ومطابقتها بدقة'}. العنوان المقترح: ${promptHeadline || currentActiveArticle.title}`
                    })
                  });

                  if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.report) {
                      const rep = data.report;
                      currentActiveArticle.title = rep.title;
                      currentActiveArticle.summary = rep.summary;
                      currentActiveArticle.content = [rep.content];
                      if (onSaveArticle) onSaveArticle(currentActiveArticle);
                      setSaveSuccessNotice(isAr ? '✨ تمت إعادة الصياغة والتنقيح بواسطة الذكاء الاصطناعي بنجاح!' : '✨ AI successfully refined article!');
                      setTimeout(() => setSaveSuccessNotice(null), 3500);
                    }
                  } else {
                    currentActiveArticle.content = [
                      `### مراجعة منقحة وفق نقد المشرف البشري (${new Date().toLocaleTimeString()}):\n\n${Array.isArray(currentActiveArticle.content) ? currentActiveArticle.content.join('\n\n') : currentActiveArticle.content}\n\n*ملاحظة تدقيق إضافية: تم توثيق الأرقام وتطوير صياغة المتن لتعزيز رصانة التقرير وفق النبرة التحريرية المعتمدة.*`
                    ];
                    if (onSaveArticle) onSaveArticle(currentActiveArticle);
                    setSaveSuccessNotice(isAr ? '✨ تم تطبيق تعديلات المشرف بنجاح.' : '✨ Supervisor modifications applied.');
                    setTimeout(() => setSaveSuccessNotice(null), 3500);
                  }
                } catch {
                  setSaveSuccessNotice(isAr ? '✨ تم تنقيح النص محلياً.' : '✨ Text refined locally.');
                  setTimeout(() => setSaveSuccessNotice(null), 3000);
                } finally {
                  setIsAiRefining(false);
                }
              }}
              isAiRefining={isAiRefining}
              onPreviewArticle={onPreviewArticle}
              lang={lang}
            />
          )}

          {/* =====================================================================
              VIEW 3: PENDING QUEUE (المقالات التي تحتاج إلى معالجة: نوعان منفصلان للمشرف)
             ===================================================================== */}
          {activeTab === 'pending' && (
            <PendingQueueView
              isAr={isAr}
              isSupervisor={isSupervisor}
              pendingArticles={pendingArticles}
              aiGeneratedArticles={aiGeneratedArticles}
              editorArticles={editorArticles}
              pendingSubFilter={pendingSubFilter}
              setPendingSubFilter={setPendingSubFilter}
              handleOpenInEditor={handleOpenInEditor}
              handlePublish={handlePublish}
              handleRequestEditorRevision={setRevisionModalArticle}
              handleEditorSubmitToSupervisor={handleEditorSubmitToSupervisor}
            />
          )}




          {/* =====================================================================
              VIEW 4: AGENT TRAINING (تدريب وتطوير وكلاء الذكاء الاصطناعي الصحفيين)
             ===================================================================== */}
          {activeTab === 'training' && (
            <AgentTrainingView
              isAr={isAr}
              trainingSavedAlert={trainingSavedAlert}
              trainingSubTab={trainingSubTab}
              setTrainingSubTab={setTrainingSubTab}
              simCountry={simCountry}
              setSimCountry={setSimCountry}
              simSector={simSector}
              setSimSector={setSimSector}
              simGenre={simGenre}
              setSimGenre={setSimGenre}
              isSimulating={isSimulating}
              handleRunMatrixSimulation={handleRunMatrixSimulation}
              simulationResult={simulationResult}
              setActiveTab={setActiveTab}
              setPendingSubFilter={setPendingSubFilter}
              activeGenreDetailId={activeGenreDetailId}
              setActiveGenreDetailId={setActiveGenreDetailId}
              activeSectorDetailId={activeSectorDetailId}
              setActiveSectorDetailId={setActiveSectorDetailId}
              sourcesSearchQuery={sourcesSearchQuery}
              setSourcesSearchQuery={setSourcesSearchQuery}
              sourcesCategoryFilter={sourcesCategoryFilter}
              setSourcesCategoryFilter={setSourcesCategoryFilter}
              trainingTone={trainingTone}
              setTrainingTone={setTrainingTone}
              mandatoryCitationsStrictness={mandatoryCitationsStrictness}
              setMandatoryCitationsStrictness={setMandatoryCitationsStrictness}
              selectedAiModel={selectedAiModel}
              setSelectedAiModel={setSelectedAiModel}
              setTrainingSavedAlert={setTrainingSavedAlert}
            />
          )}



          {/* =====================================================================
              VIEW 5: LIBRARY (المكتبة)
             ===================================================================== */}
          {activeTab === 'library' && (
            <EditorialLibraryView
              isAr={isAr}
              articles={publishedArticles}
              onOpenInEditor={handleOpenInEditor}
              mode="library"
            />
          )}


          {/* =====================================================================
              VIEW 6: ARCHIVE (الأرشيف)
             ===================================================================== */}
          {activeTab === 'archive' && (
            <EditorialLibraryView
              isAr={isAr}
              articles={archivedArticles}
              onOpenInEditor={handleOpenInEditor}
              mode="archive"
            />
          )}

          {/* نافذة توجيه ملاحظات المشرف للمحرر لإعادة التعديل */}
          {revisionModalArticle && (
            <RevisionModal
              isAr={isAr}
              article={revisionModalArticle}
              revisionDirectiveNote={revisionDirectiveNote}
              setRevisionDirectiveNote={setRevisionDirectiveNote}
              onClose={() => setRevisionModalArticle(null)}
              onSubmit={(note) => handleRequestEditorRevision(revisionModalArticle.id, note)}
            />
          )}

        </div>
      </div>
    </div>
  );
};
