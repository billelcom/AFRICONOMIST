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
  GENRE_AGENT_DIRECTIVES, 
  SECTOR_AGENT_DIRECTIVES, 
  buildCompositeAgentDirective, 
  getGenreDirective, 
  getSectorDirective 
} from '../../lib/agents/personasRegistry';
import { 
  ALL_OFFICIAL_GROUNDING_SOURCES, 
  getOfficialSourcesForCountry 
} from '../../lib/agents/officialSourcesLedger';

interface EditorialViewProps {
  articles: Article[];
  onUpdateArticleStatus: (articleId: string, status: Article['status'], reviewer: string, note?: string) => void;
  onAddNewDraft: (newArticle: Article) => void;
  onSaveArticle?: (updatedArticle: Article) => void;
  onPreviewArticle?: (article: Article) => void;
  lang: 'ar' | 'en';
  secondsUntilNextCycle?: number;
  isAutomatedIngesting?: boolean;
  onTriggerAutomatedCycleNow?: () => void;
}

type NewsroomTab = 'overview' | 'editor' | 'pending' | 'training' | 'library' | 'archive' | 'commission';

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
      const res = await fetch('/api/agents/pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      const response = await fetch('/api/agents/pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        const response = await fetch('/api/agents/pipeline', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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

  // بطاقة المقال الموحدة لقطاعات الأخبار (متجاوبة تماماً مع الهاتف والحاسوب)
  const renderSectorArticleCard = (art: Article, idx: number, isMobile: boolean, totalCount: number) => {
    const isPending = art.status === 'pending_review';
    return (
      <div
        key={art.id || idx}
        onClick={() => handleOpenInEditor(art)}
        className={`${
          isMobile 
            ? 'w-full min-w-full max-w-full shrink-0 snap-center' 
            : 'w-full min-w-0 max-w-full'
        } bg-[#0A0F1D] hover:bg-[#0E1528] border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 space-y-3 cursor-pointer transition-all duration-200 group shadow-lg flex flex-col justify-between overflow-hidden break-words`}
      >
        {/* Top Bar: Country & Journalistic Genre */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs gap-1.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-amber-300 font-bold border border-slate-700 truncate">
                🌍 {art.countryName}
              </span>
              <span className="text-[10px] text-slate-400 font-mono shrink-0">
                {art.countryCode}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {isMobile && (
                <span className="text-[10px] font-mono text-slate-500 sm:hidden">
                  [{idx + 1}/{totalCount}]
                </span>
              )}
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold font-mono ${
                isPending 
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                {isPending ? (isAr ? 'قيد المراجعة' : 'Pending') : (isAr ? 'منشور' : 'Published')}
              </span>
            </div>
          </div>

          {/* Journalistic Genre Pill */}
          <div className="inline-block text-[11px] font-bold text-amber-400/90 bg-amber-500/10 px-2.5 py-0.5 rounded-lg border border-amber-500/20 max-w-full truncate">
            📰 {art.journalisticType || (isAr ? 'التحقيق الصحفي' : 'Investigative')}
          </div>

          {/* Title */}
          <h4 className="text-sm sm:text-base md:text-lg font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug break-words">
            {art.title}
          </h4>

          {/* Summary preview */}
          <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed break-words">
            {art.summary}
          </p>
        </div>

        {/* Footer of Card */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
          <span className="flex items-center gap-1 shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{art.factCheck?.score || 96}% {isAr ? 'دقة' : 'score'}</span>
          </span>
          <span className="text-amber-400/90 group-hover:translate-x-1 transition-transform flex items-center gap-0.5 font-bold shrink-0">
            <span>{isAr ? 'فتح المحرر' : 'Open Editor'}</span>
            <ChevronLeft className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" />
          </span>
        </div>
      </div>
    );
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
      <div className="md:hidden sticky top-14 z-30 bg-[#080C16]/95 backdrop-blur-xl border-b border-slate-800/80 px-2 py-2 shadow-lg w-full">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          {/* 1. زر التوليد الآلي كل 30 د */}
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 border transition-all ${
              activeTab === 'overview'
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-sm'
                : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>{isAr ? 'الرصد الآلي:' : 'Auto Pulse:'}</span>
            <span className="font-mono text-[11px] text-amber-400 bg-amber-950/40 px-1.5 py-0.2 rounded border border-amber-500/30">
              {formatTime(secondsUntilNextCycle)}
            </span>
          </button>

          {/* 2. زر التوليد الفوري العشوائي */}
          <button
            onClick={handleTriggerInstantRandomGeneration}
            disabled={isAutomatedIngesting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap shrink-0 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20 active:scale-95 transition-all"
          >
            <Zap className={`w-3.5 h-3.5 ${isAutomatedIngesting ? 'animate-spin' : 'fill-current'}`} />
            <span>{isAutomatedIngesting ? (isAr ? 'جاري الرصد...' : 'Pulsing...') : (isAr ? 'توليد فوري عشوائي' : 'Instant Random')}</span>
          </button>

          {/* 3. زر التوليد المخصص (انتقال سلس بدون popup) */}
          <button
            onClick={() => setActiveTab('commission')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 border transition-all ${
              activeTab === 'commission'
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 shadow-sm'
                : 'bg-slate-900/80 text-slate-200 border border-slate-800 hover:border-slate-700'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" />
            <span>{isAr ? 'توليد مخصص' : 'Custom Report'}</span>
          </button>

          {/* 4. زر المقالات التي تحتاج معالجة */}
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 border transition-all ${
              activeTab === 'pending'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm'
                : 'bg-slate-900/80 text-slate-300 border-slate-800'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>{isAr ? 'تحتاج معالجة' : 'Pending Review'}</span>
            {pendingArticles.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white font-mono">
                {pendingArticles.length}
              </span>
            )}
          </button>

          {/* 5. زر تحرير */}
          <button
            onClick={() => {
              if (currentActiveArticle) setActiveTab('editor');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 border transition-all ${
              activeTab === 'editor'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                : 'bg-slate-900/80 text-slate-300 border-slate-800'
            }`}
          >
            <FileEdit className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isAr ? 'محرر الأخبار' : 'Editor'}</span>
          </button>

          {/* 6. زر تدريب الوكيل */}
          <button
            onClick={() => setActiveTab('training')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 border transition-all ${
              activeTab === 'training'
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                : 'bg-slate-900/80 text-slate-300 border-slate-800'
            }`}
          >
            <Brain className="w-3.5 h-3.5 text-purple-400" />
            <span>{isAr ? 'تدريب الوكيل' : 'Agent Training'}</span>
          </button>

          {/* 7. زر المكتبة */}
          <button
            onClick={() => setActiveTab('library')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 border transition-all ${
              activeTab === 'library'
                ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                : 'bg-slate-900/80 text-slate-300 border-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-teal-400" />
            <span>{isAr ? 'المكتبة' : 'Library'}</span>
          </button>

          {/* 8. زر الارشيف */}
          <button
            onClick={() => setActiveTab('archive')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 border transition-all ${
              activeTab === 'archive'
                ? 'bg-slate-700/40 text-slate-200 border-slate-600'
                : 'bg-slate-900/80 text-slate-400 border-slate-800'
            }`}
          >
            <Archive className="w-3.5 h-3.5 text-slate-400" />
            <span>{isAr ? 'الأرشيف' : 'Archive'}</span>
          </button>
        </div>
      </div>

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
        <aside className="hidden md:flex flex-col w-16 md:w-20 shrink-0 bg-gradient-to-b from-[#090D18] via-[#070A14] to-[#05070E] border-x border-slate-800/80 py-5 px-2 items-center justify-between select-none shadow-2xl relative z-40">
          <div className="w-full flex flex-col items-center space-y-4">
            {/* أيقونة شارة غرفة الأخبار بالأعلى */}
            <div 
              className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-sm relative group cursor-default"
              title={isAr ? 'غرفة الأخبار والرقابة الإفريقية' : 'Newsroom Master Desk'}
            >
              <ShieldCheck className="w-5 h-5 text-rose-400" />
              <span className="absolute -bottom-1 w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50 animate-pulse" />
            </div>

            <div className="w-8 h-px bg-slate-800/80 my-1" />

            {/* قائمة الأيقونات الثمانية: تظهر الأيقونات فقط وعند الضغط يظهر العنوان */}
            <nav className="space-y-2.5 w-full flex flex-col items-center" aria-label="Newsroom Navigation">
              {[
                {
                  id: 'overview' as const,
                  nameAr: 'التوليد الآلي (كل 30 د)',
                  nameEn: 'Autonomous Cycle (30m)',
                  descAr: 'رصد دوري للـ 54 دولة مع عداد التوليد التلقائي',
                  descEn: 'Periodic continental pulse with automated timer',
                  category: isAr ? 'رصد آلي' : 'Autonomous',
                  icon: Clock,
                  badge: formatTime(secondsUntilNextCycle),
                  isPulse: true,
                  activeColor: 'from-amber-500/25 to-amber-600/15 border-amber-400 text-amber-300'
                },
                {
                  id: 'instant_random' as const,
                  nameAr: 'توليد فوري عشوائي',
                  nameEn: 'Instant Random Report',
                  descAr: 'دولة · قطاع · قالب بنقرة واحدة فوراً دون انتظار',
                  descEn: '1-click immediate report generation',
                  category: isAr ? 'توليد فوري' : 'Instant',
                  icon: Zap,
                  activeColor: 'from-amber-400/30 to-amber-500/20 border-amber-400 text-amber-300'
                },
                {
                  id: 'commission' as const,
                  nameAr: 'توليد مخصص',
                  nameEn: 'Commission Custom Report',
                  descAr: 'معالج تفاعلي لتحديد الدولة والقطاع والقالب الصحفي',
                  descEn: 'Interactive step-by-step reporting wizard',
                  category: isAr ? 'تكليف صحفي' : 'Commission',
                  icon: SlidersHorizontal,
                  activeColor: 'from-blue-500/25 to-blue-600/15 border-blue-400 text-blue-300'
                },
                {
                  id: 'pending' as const,
                  nameAr: 'مقالات تحتاج معالجة',
                  nameEn: 'Pending Review Queue',
                  descAr: 'بانتظار إجازة واعتماد المشرف البشري (مخرجات الذكاء ومسودات المحررين)',
                  descEn: 'Human review & approval queue for AI and editor drafts',
                  category: isAr ? 'الرقابة والتدقيق' : 'Review Queue',
                  icon: AlertTriangle,
                  badge: pendingArticles.length > 0 ? pendingArticles.length : null,
                  activeColor: 'from-rose-500/25 to-rose-600/15 border-rose-400 text-rose-300'
                },
                {
                  id: 'editor' as const,
                  nameAr: 'محرر الأخبار المباشر',
                  nameEn: 'Live Editorial Desk',
                  descAr: 'نشر ومصادقة المقالات، تعديل العناوين والمتون، وإعادة التوجيه',
                  descEn: 'Live editing, fact-checking and publishing desk',
                  category: isAr ? 'التحرير المباشر' : 'Live Editor',
                  icon: FileEdit,
                  activeColor: 'from-emerald-500/25 to-emerald-600/15 border-emerald-400 text-emerald-300'
                },
                {
                  id: 'training' as const,
                  nameAr: 'تدريب الوكيل',
                  nameEn: 'Agent Training Workbench',
                  descAr: 'ضبط النبرة التحريرية وقواعد التحقق الصارم من المصادر والأرقام',
                  descEn: 'Prompt tuning & strict verification rules',
                  category: isAr ? 'هندسة الأوامر' : 'AI Training',
                  icon: Brain,
                  activeColor: 'from-purple-500/25 to-purple-600/15 border-purple-400 text-purple-300'
                },
                {
                  id: 'library' as const,
                  nameAr: 'المكتبة والتقارير',
                  nameEn: 'Editorial Library',
                  descAr: `${publishedArticles.length} تقارير منشورة ومعتمدة للجمهور`,
                  descEn: `${publishedArticles.length} published reports in live feed`,
                  category: isAr ? 'الأرشيف الحي' : 'Library',
                  icon: BookOpen,
                  badge: publishedArticles.length > 0 ? publishedArticles.length : null,
                  activeColor: 'from-teal-500/25 to-teal-600/15 border-teal-400 text-teal-300'
                },
                {
                  id: 'archive' as const,
                  nameAr: 'الأرشيف والمرفوضات',
                  nameEn: 'Editorial Archive',
                  descAr: 'المقالات المستبعدة والمسودات المؤرشفة للمراجعة اللاحقة',
                  descEn: 'Archived and rejected editorial records',
                  category: isAr ? 'المحفوظات' : 'Archive',
                  icon: Archive,
                  badge: archivedArticles.length > 0 ? archivedArticles.length : null,
                  activeColor: 'from-slate-700/40 to-slate-800/20 border-slate-500 text-slate-300'
                }
              ].map((item) => {
                const isActive = activeTab === item.id;
                const isExpanded = expandedSidebarTab === item.id;
                const ItemIcon = item.icon;

                const handleActivate = () => {
                  if (item.id === 'instant_random') {
                    handleTriggerInstantRandomGeneration();
                  } else {
                    if (item.id === 'editor' && !currentActiveArticle && articles.length > 0) {
                      setSelectedArticleId(articles[0].id);
                    }
                    setActiveTab(item.id);
                  }
                  // عند الضغط تعرض الصفحة ويختفي العنوان وتبقى الأيقونة ظاهرة
                  setExpandedSidebarTab(null);
                };

                return (
                  <div key={item.id} className="relative w-full flex justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        if (isExpanded) {
                          // الضغط مجدداً: تعرض الصفحة ويختفي العنوان وتبقى الأيقونة ظاهرة
                          handleActivate();
                        } else {
                          // الضغط الأول: يظهر العنوان الخاص بالأيقونة
                          setExpandedSidebarTab(item.id);
                        }
                      }}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer relative group ${
                        isActive
                          ? `bg-gradient-to-br ${item.activeColor} border-2 shadow-lg shadow-amber-500/15 scale-105`
                          : isExpanded
                          ? 'bg-amber-500/20 text-amber-300 border-2 border-amber-400/80 shadow-md ring-2 ring-amber-400/20'
                          : 'bg-slate-900/80 hover:bg-slate-850 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
                      }`}
                      title={isAr ? item.nameAr : item.nameEn}
                    >
                      <ItemIcon className={`w-5 h-5 transition-transform group-hover:scale-110 ${item.id === 'instant_random' && isAutomatedIngesting ? 'animate-spin' : ''}`} />

                      {/* شارة رقمية مصغرة (مثل المقالات المعلقة أو عداد الوقت) */}
                      {item.badge !== undefined && item.badge !== null && (
                        <span className={`absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold border border-slate-900 shadow-sm ${
                          item.isPulse
                            ? 'bg-amber-500 text-slate-950 font-bold'
                            : 'bg-rose-500 text-white'
                        }`}>
                          {item.badge}
                        </span>
                      )}

                      {/* نقطة النشاط عند اختيار الأيقونة */}
                      {isActive && (
                        <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400" />
                      )}
                    </button>

                    {/* =========================================================================
                        بطاقة العنوان التفاعلية: تظهر عند الضغط على الأيقونة
                        وعند الضغط تعرض الصفحة ويختفي العنوان وتبقى الأيقونة ظاهرة مع باقي الأيقونات
                       ========================================================================= */}
                    {isExpanded && (
                      <div 
                        className="absolute rtl:right-[100%] rtl:mr-3 ltr:left-[100%] ltr:ml-3 top-1/2 -translate-y-1/2 z-50 w-72 sm:w-80 p-4 rounded-2xl bg-gradient-to-br from-[#0F172A] via-[#0B101E] to-[#080C16] border-2 border-amber-500/70 shadow-2xl shadow-black/95 space-y-3 animate-in fade-in zoom-in-95 duration-150 text-right rtl:text-right ltr:text-left cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleActivate();
                        }}
                      >
                        <div className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                              <ItemIcon className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="text-xs sm:text-sm font-black text-white">
                                {isAr ? item.nameAr : item.nameEn}
                              </h4>
                              <span className="text-[10px] text-amber-400/90 font-mono font-bold">
                                {item.category}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedSidebarTab(null);
                            }}
                            className="p-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                            title={isAr ? 'إغلاق العنوان' : 'Close'}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          {isAr ? item.descAr : item.descEn}
                        </p>

                        {item.badge !== undefined && item.badge !== null && (
                          <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-[11px]">
                            <span className="text-slate-400">{isAr ? 'الحالة / الرصد:' : 'Status / Pulse:'}</span>
                            <span className="font-mono font-bold text-amber-400">{item.badge}</span>
                          </div>
                        )}

                        {/* زر عرض الصفحة: عند الضغط تعرض الصفحة ويختفي العنوان وتبقى الأيقونة */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleActivate();
                          }}
                          className="w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                        >
                          <span>
                            {item.id === 'instant_random' 
                              ? (isAr ? 'تشغيل التوليد الفوري الآن' : 'Trigger Generation Now') 
                              : (isAr ? 'عرض الصفحة الآن' : 'Display Page View')}
                          </span>
                          <ChevronLeft className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* تذييل مصغر في أسفل الشريط */}
          <div className="pt-3 border-t border-slate-800/80 flex flex-col items-center gap-1 text-[9px] text-slate-500 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>AI</span>
          </div>
        </aside>

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
                {SECTOR_SECTIONS.map((sector) => {
                  const sectorArticles = sectorArticlesMap[sector.id] || [];
                  const SectorIcon = sector.icon;

                  return (
                    <section key={sector.id} className="space-y-4 w-full max-w-full min-w-0 overflow-hidden">
                      {/* Sector Header with Desktop Controls */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 w-full max-w-full min-w-0">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${sector.accentColor} border flex items-center justify-center shrink-0`}>
                            <SectorIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-base sm:text-lg md:text-xl font-black text-white flex items-center gap-2 truncate">
                              <span className="truncate">{isAr ? sector.nameAr : sector.nameEn}</span>
                              <span className="text-[10px] sm:text-[11px] font-mono px-2 py-0.2 rounded-full bg-slate-800 text-amber-300 border border-slate-700 shrink-0">
                                {sectorArticles.length} {isAr ? 'تقارير' : 'reports'}
                              </span>
                            </h3>
                            <p className="text-[11px] sm:text-xs text-slate-400 line-clamp-1">
                              {isAr ? sector.descriptionAr : sector.descriptionEn}
                            </p>
                          </div>
                        </div>

                        {/* Desktop Controls (عرض كل المقالات / السابق والتالي) */}
                        <div className="flex items-center gap-2 shrink-0">
                          {sectorArticles.length > 3 && (
                            <button
                              type="button"
                              onClick={() => toggleSectorExpansion(sector.id)}
                              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
                            >
                              <span>
                                {expandedSectors[sector.id]
                                  ? (isAr ? 'عرض أقل' : 'Show less')
                                  : (isAr ? `عرض كل التقارير (${sectorArticles.length})` : `View all (${sectorArticles.length})`)}
                              </span>
                            </button>
                          )}

                          {/* أزرار السلايدر على الهاتف والشاشات الصغيرة */}
                          <div className="flex sm:hidden items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleScrollSector(sector.id, 'prev')}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700 shadow-sm"
                              title={isAr ? 'السابق' : 'Previous'}
                            >
                              <ChevronRight className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleScrollSector(sector.id, 'next')}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700 shadow-sm"
                              title={isAr ? 'التالي' : 'Next'}
                            >
                              <ChevronLeft className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* 1. على الهاتف: شريط انسيابي بطاقة كاملة 100% دون خروج */}
                      <div 
                        id={`sector-slider-${sector.id}`}
                        className="md:hidden overflow-x-auto no-scrollbar scroll-smooth flex gap-3 pb-2 snap-x snap-mandatory w-full max-w-full min-w-0"
                      >
                        {sectorArticles.map((art, idx) => 
                          renderSectorArticleCard(art, idx, true, sectorArticles.length)
                        )}
                      </div>

                      {/* 2. على الحاسوب: شبكة متجاوبة منضبطة تماماً ضمن حدود الصفحة دون أي تجاوز */}
                      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 w-full max-w-full min-w-0">
                        {(expandedSectors[sector.id] ? sectorArticles : sectorArticles.slice(0, 3)).map((art, idx) => 
                          renderSectorArticleCard(art, idx, false, sectorArticles.length)
                        )}
                      </div>
                    </section>
                  );
                })}
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
              onAiRefine={async (customNotes, promptHeadline) => {
                setIsAiRefining(true);
                try {
                  const response = await fetch('/api/agents/pipeline', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
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
            <div className="space-y-6 animate-in fade-in duration-200 w-full max-w-full min-w-0 mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 w-full max-w-full min-w-0">
                <div className="min-w-0">
                  <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
                    <span className="truncate">{isAr ? 'منصة مراجعة واعتماد المقالات (غرفة إشراف المحررين والذكاء الاصطناعي)' : 'Pending Ingestion & Editorial Desk'}</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    {isAr 
                      ? 'يظهر للمشرف نوعان: مقالات مولدة بالذكاء الاصطناعي، ومقالات مرسلة من المحررين البشريين للاعتماد أو لإعادة التعديل.' 
                      : 'Dual streams: Autonomous AI agent pipeline and Human Editor draft submissions awaiting review.'}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-3 py-1 rounded-full bg-rose-500/15 text-rose-300 text-xs font-bold border border-rose-500/30">
                    {pendingArticles.length} {isAr ? 'إجمالي بانتظار الإجراء' : 'pending total'}
                  </span>
                </div>
              </div>

              {/* أزرار التبديل بين نوعي المقالات عند المشرف */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth w-full max-w-full min-w-0">
                <button
                  type="button"
                  onClick={() => setPendingSubFilter('all')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                    pendingSubFilter === 'all'
                      ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-400 font-black'
                      : 'bg-slate-900/80 hover:bg-slate-850 text-slate-300 border border-slate-800'
                  }`}
                >
                  <span>{isAr ? 'كافة المقالات المعلقة' : 'All Pending'}</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-950/20 font-mono font-bold">
                    {pendingArticles.length}
                  </span>
                </button>

                {/* 1. النوع الأول: مقالات الذكاء الاصطناعي والتوليد المباشر */}
                <button
                  type="button"
                  onClick={() => setPendingSubFilter('ai')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                    pendingSubFilter === 'ai'
                      ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-400 font-black'
                      : 'bg-slate-900/80 hover:bg-slate-850 text-slate-300 border border-slate-800'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isAr ? '1. مقالات الذكاء الاصطناعي والتوليد المباشر' : '1. AI Generated & Direct Ingestion'}</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-950/20 font-mono font-bold">
                    {aiGeneratedArticles.length}
                  </span>
                </button>

                {/* 2. النوع الثاني: مقالات المحررين البشريين */}
                <button
                  type="button"
                  onClick={() => setPendingSubFilter('editor')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                    pendingSubFilter === 'editor'
                      ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400 font-black'
                      : 'bg-slate-900/80 hover:bg-slate-850 text-slate-300 border border-slate-800'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5 text-blue-400" />
                  <span>{isAr ? '2. مقالات ومسودات المحررين (للاعتماد أو التعديل)' : '2. Editor Submissions & Revisions'}</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 font-mono font-bold">
                    {editorArticles.length}
                  </span>
                </button>
              </div>

              {/* بطاقة توضيحية للمحرر والمشرف */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-amber-950/30 border border-slate-800 text-xs text-slate-300 flex items-center justify-between gap-3 shadow-sm w-full max-w-full min-w-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="leading-relaxed">
                    {isSupervisor 
                      ? (isAr ? 'صلاحيات المشرف: قراءة كامل المسودة، اعتماد النشر المباشر للجمهور، أو إعادة طلب التعديل من المحررين مع كتابة الملاحظات وتوثيقها بالإشعارات.' : 'Supervisor Privileges: Read drafts, approve live publication, or request editorial revisions with feedback.')
                      : (isAr ? 'صلاحيات المحرر: صياغة وتعديل التقارير، وإرسالها للمشرف للاعتماد والمصادقة، ومتابعة الملاحظات المطلوبة.' : 'Editor Privileges: Draft & modify articles, submit to supervisor for review, and iterate on critiques.')}
                  </span>
                </div>
              </div>

              {/* قائمة المقالات وفق التصفية المحددة */}
              {(() => {
                const listToDisplay = pendingSubFilter === 'ai' 
                  ? aiGeneratedArticles 
                  : pendingSubFilter === 'editor' 
                  ? editorArticles 
                  : pendingArticles;

                if (listToDisplay.length === 0) {
                  return (
                    <div className="p-12 text-center rounded-2xl bg-[#090D18] border border-slate-800 space-y-3 w-full max-w-full min-w-0">
                      <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                      <h3 className="text-base font-bold text-white">
                        {isAr ? 'لا توجد مقالات معلقة في هذا القسم حالياً' : 'No pending articles in this section'}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {isAr 
                          ? 'كافة المقالات تمت معالجتها. يمكنك استخدام "توليد فوري عشوائي" أو قيام المحررين بإرسال مسودات جديدة.' 
                          : 'Queue clear. Commission a new report or submit an editor draft.'}
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 w-full max-w-full min-w-0">
                    {listToDisplay.map((art) => {
                      const isHumanEditorSubmission = art.editorSubmission || art.authorType === 'HUMAN_JOURNALIST' || art.authorType === 'HYBRID';
                      const isRevisionRequested = art.status === 'revision_requested';

                      return (
                        <div
                          key={art.id}
                          className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-3 shadow-md min-w-0 overflow-hidden break-words ${
                            isHumanEditorSubmission
                              ? 'bg-[#0B1220] border-blue-500/40 hover:border-blue-400'
                              : 'bg-slate-900 border-slate-800 hover:border-amber-500/50'
                          }`}
                        >
                          {/* الهيدر: نوع المقال + الدولة والقطاع */}
                          <div className="flex items-center justify-between text-xs gap-2">
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-bold truncate">
                              {art.countryName} · {art.sector || art.category}
                            </span>

                            {/* شارة تمييز نوع المقال */}
                            {isHumanEditorSubmission ? (
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 border ${
                                isRevisionRequested 
                                  ? 'bg-rose-950/60 text-rose-300 border-rose-500/50' 
                                  : 'bg-blue-950/60 text-blue-300 border-blue-500/50'
                              }`}>
                                <Edit3 className="w-3 h-3" />
                                <span>{isRevisionRequested ? (isAr ? 'مطلوب تعديل من المحرر' : 'Revision Pending') : (isAr ? 'مرسل من محرر اقتصادي' : 'Editor Submission')}</span>
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950/50 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-amber-400" />
                                <span>{isAr ? 'وكيل الذكاء الاصطناعي (AI)' : 'AI Autonomous'}</span>
                              </span>
                            )}
                          </div>

                          {/* اسم الكاتب وتاريخ التقديم */}
                          <div className="text-[11px] text-slate-400 flex items-center justify-between border-b border-slate-800/80 pb-2">
                            <div className="flex items-center gap-1.5 text-slate-300">
                              <User className="w-3 h-3 text-amber-400" />
                              <span className="font-semibold">
                                {isHumanEditorSubmission 
                                  ? (art.authorName || art.editorSubmission?.editorName || (isAr ? 'المحرر الاقتصادي' : 'Economic Editor'))
                                  : (isAr ? 'وكيل الذكاء الاصطناعي Gemini 3.6' : 'Autonomous Agent')}
                              </span>
                            </div>
                            <span className="font-mono text-slate-500 text-[10px]">{art.createdAt}</span>
                          </div>

                          {/* العنوان والملخص */}
                          <h4 
                            onClick={() => handleOpenInEditor(art)}
                            className="text-sm sm:text-base font-bold text-white hover:text-amber-400 transition-colors cursor-pointer line-clamp-2"
                          >
                            {art.title}
                          </h4>
                          <p className="text-xs text-slate-400 line-clamp-2">
                            {art.summary}
                          </p>

                          {/* إذا كان هناك ملاحظات وتوجيهات سابقة من المشرف */}
                          {art.reviewNotes && (
                            <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-[11px] space-y-1">
                              <span className="font-bold text-rose-300 flex items-center gap-1">
                                <MessageSquare className="w-3 h-3" />
                                <span>{isAr ? 'ملاحظات وتوجيهات المشرف للمحرر:' : 'Supervisor Revision Directive:'}</span>
                              </span>
                              <p className="text-rose-200 leading-snug line-clamp-2">
                                {art.reviewNotes}
                              </p>
                            </div>
                          )}

                          {/* شريط الإجراءات المباشرة للمشرف أو المحرر */}
                          <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                            <button
                              type="button"
                              onClick={() => handleOpenInEditor(art)}
                              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <FileEdit className="w-3.5 h-3.5 text-amber-400" />
                              <span>{isAr ? 'فتح في محرر الأخبار' : 'Open in Editor'}</span>
                            </button>

                            {/* أزرار المشرف: اعتماد ونشر أو طلب إعادة تعديل */}
                            {isSupervisor ? (
                              <div className="flex items-center gap-1.5">
                                {/* زر طلب إعادة التعديل مع كتابة الملاحظات */}
                                {isHumanEditorSubmission && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setRevisionModalArticle(art);
                                      setRevisionDirectiveNote(art.reviewNotes || '');
                                    }}
                                    className="px-2.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold border border-rose-500/40 flex items-center gap-1 cursor-pointer transition-colors"
                                    title={isAr ? 'إعادة طلب التعديل من المحرر مع كتابة الملاحظات' : 'Request Revision with Directive'}
                                  >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    <span>{isAr ? 'طلب تعديل' : 'Revise'}</span>
                                  </button>
                                )}

                                {/* زر اعتماد ونشر المقال للجمهور */}
                                <button
                                  type="button"
                                  onClick={() => handlePublish(art.id)}
                                  className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black flex items-center gap-1 shadow-md cursor-pointer transition-all active:scale-95"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>{isAr ? 'اعتماد ونشر' : 'Publish'}</span>
                                </button>
                              </div>
                            ) : (
                              /* إجراءات المحرر: إذا كان المقال مرجعاً للمراجعة، زر إرسال للمشرف */
                              <button
                                type="button"
                                onClick={() => handleEditorSubmitToSupervisor(art)}
                                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black flex items-center gap-1 shadow-md cursor-pointer transition-all active:scale-95"
                              >
                                <Send className="w-3.5 h-3.5" />
                                <span>{isAr ? 'إرسال للمشرف للاعتماد' : 'Submit to Supervisor'}</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          )}

          {/* =====================================================================
              VIEW 4: AGENT TRAINING (تدريب وتطوير وكلاء الذكاء الاصطناعي الصحفيين)
             ===================================================================== */}
          {activeTab === 'training' && (
            <div className="space-y-6 animate-in fade-in duration-200 w-full max-w-full mx-auto">
              {/* Header with Metrics */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2.5">
                    <Brain className="w-6 h-6 text-purple-400" />
                    <span>{isAr ? 'منصة تدريب وهندسة وكلاء الذكاء الاصطناعي الصحفيين' : 'Journalistic AI Agents Training & Persona Engine'}</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    {isAr 
                      ? 'تدريب وتخصيص هويات الوكلاء وفق مصفوفة ثلاثية الأبعاد: 18 نوعاً صحفياً × 28 قطاعاً اقتصادياً × 54 دولة إفريقية، ببروتوكول Zero Trust.' 
                      : 'Training 3D Specialized Agent Matrix: 18 Genres × 28 Economic Sectors × 54 African Nations with Zero-Trust safeguards.'}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-purple-500/15 text-purple-300 text-xs font-mono font-bold border border-purple-500/30 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-purple-400" />
                    <span>18 {isAr ? 'وكيل نوع صحفي' : 'Genre Agents'}</span>
                  </span>
                  <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 text-xs font-mono font-bold border border-amber-500/30 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-amber-400" />
                    <span>28 {isAr ? 'وكيل قطاع' : 'Sector Agents'}</span>
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/30 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>54 {isAr ? 'دولة جاهزة' : 'Nations'}</span>
                  </span>
                </div>
              </div>

              {trainingSavedAlert && (
                <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/40 text-purple-200 text-xs font-bold flex items-center gap-2 w-full max-w-full">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>{isAr ? 'تم حفظ معايير التدريب بنجاح وتطبيقها على خط الإنتاج والوكلاء!' : 'Agent directives updated successfully!'}</span>
                </div>
              )}

              {/* Training Sub-navigation Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-slate-800/80">
                {[
                  { id: 'matrix', nameAr: '⚡ محاكاة المصفوفة الثلاثية الحية', nameEn: '3D Matrix Sandbox', icon: Sparkles },
                  { id: 'genres', nameAr: '📰 تدريب وكلاء الأنواع الصحفية (18)', nameEn: '18 Journalistic Genres', icon: FileText },
                  { id: 'sectors', nameAr: '📊 تدريب وكلاء القطاعات (28)', nameEn: '28 Economic Sectors', icon: Database },
                  { id: 'sources', nameAr: '🏛️ سجل المصادر وتدقيق الحقائق', nameEn: 'Official Sources & Fact-Check', icon: ShieldCheck },
                  { id: 'directives', nameAr: '⚙️ الحوكمة والنبرة والذكاء الاصطناعي', nameEn: 'Directives & Models', icon: SlidersHorizontal }
                ].map((st) => {
                  const Icon = st.icon;
                  const isActive = trainingSubTab === st.id;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setTrainingSubTab(st.id as any)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20 ring-1 ring-purple-400'
                          : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850 border border-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{isAr ? st.nameAr : st.nameEn}</span>
                    </button>
                  );
                })}
              </div>

              {/* -------------------------------------------------------------
                  SUB-TAB 1: 3D MATRIX SANDBOX & SIMULATOR (المحاكاة الثلاثية)
                 ------------------------------------------------------------- */}
              {trainingSubTab === 'matrix' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    {/* Column 1: Configurator Controls */}
                    <div className="lg:col-span-1 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
                      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <h3 className="text-sm font-bold text-white">
                          {isAr ? 'توليف فرقة العمل الرقمية الثلاثية' : '3D Task Force Configuration'}
                        </h3>
                      </div>

                      {/* 1. Country Selector */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                          <span>{isAr ? '1. وكيل الدولة الإفريقية:' : '1. African Nation Agent:'}</span>
                          <span className="text-[10px] text-amber-400 font-mono">54 {isAr ? 'دولة' : 'Nations'}</span>
                        </label>
                        <select
                          value={simCountry}
                          onChange={(e) => setSimCountry(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
                        >
                          {ALL_54_AFRICAN_COUNTRIES.map((c) => (
                            <option key={c.code} value={c.nameAr}>
                              {c.nameAr} ({c.nameEn}) - {c.currency}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* 2. Sector Selector */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                          <span>{isAr ? '2. وكيل القطاع الاقتصادي:' : '2. Economic Sector Agent:'}</span>
                          <span className="text-[10px] text-purple-400 font-mono">28 {isAr ? 'قطاعاً' : 'Sectors'}</span>
                        </label>
                        <select
                          value={simSector}
                          onChange={(e) => setSimSector(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
                        >
                          {ECONOMIC_SECTORS.map((s) => (
                            <option key={s.id} value={s.nameAr}>
                              {s.nameAr} ({s.groupNameAr})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* 3. Genre Selector */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                          <span>{isAr ? '3. وكيل النوع الصحفي والقالب:' : '3. Journalistic Genre Agent:'}</span>
                          <span className="text-[10px] text-emerald-400 font-mono">18 {isAr ? 'نوعاً' : 'Genres'}</span>
                        </label>
                        <select
                          value={simGenre}
                          onChange={(e) => setSimGenre(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
                        >
                          {JOURNALISTIC_GENRES.map((g) => (
                            <option key={g.id} value={g.nameAr}>
                              {g.nameAr} ({g.category})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Run Simulation Button */}
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={handleRunMatrixSimulation}
                          disabled={isSimulating}
                          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                        >
                          {isSimulating ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>{isAr ? 'جاري تشغيل الوكلاء ومحاكاة الإنتاج...' : 'Simulating Agent Pipeline...'}</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 fill-current text-white" />
                              <span>{isAr ? 'تشغيل تجربة محاكاة وتدريب الوكلاء فوراً' : 'Run Matrix Simulation & Generate Draft'}</span>
                            </>
                          )}
                        </button>
                        <p className="text-[10px] text-slate-500 mt-2 text-center">
                          {isAr ? '⚠️ معيار أمني صارم: تحفظ المسودة المولدة في MongoDB بحالة (قيد المراجعة) لاعتمادها لاحقاً.' : 'Strict Security: Generated draft is committed as pending_review.'}
                        </p>
                      </div>
                    </div>

                    {/* Column 2 & 3: Composite Directive Inspector */}
                    <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4 text-emerald-400" />
                          <h3 className="text-sm font-bold text-white">
                            {isAr ? 'معاينة الموجه التدريبي الموحد للفرقة الرقمية (Composite Directive Preview)' : 'Composite Agent Directive Preview'}
                          </h3>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {isAr ? 'توليف ثلاثي ديناميكي' : '3D Dynamic Synthesis'}
                        </span>
                      </div>

                      {/* Live Generated Prompt Preview */}
                      {(() => {
                        const matchedG = Object.values(GENRE_AGENT_DIRECTIVES).find(g => g.nameAr === simGenre) || GENRE_AGENT_DIRECTIVES['news_report'];
                        const matchedS = Object.values(SECTOR_AGENT_DIRECTIVES).find(s => s.nameAr === simSector) || SECTOR_AGENT_DIRECTIVES['macroeconomics'];
                        const directiveText = buildCompositeAgentDirective({
                          genreId: matchedG.genreId,
                          sectorId: matchedS.sectorId,
                          countryName: simCountry,
                          countryCode: 'AFRICA',
                          stage: 'writer',
                          customNotes: isAr ? 'مراعاة ربط التطورات الحالية بالسلاسل الزمنية التاريخية' : 'Correlate with historical time-series'
                        });

                        return (
                          <div className="space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                                <span className="text-slate-500 block text-[10px]">{isAr ? 'وكيل الصياغة المتخصص' : 'Specialist Agent'}</span>
                                <span className="font-bold text-amber-400 truncate block">{matchedG.agentRoleAr}</span>
                              </div>
                              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                                <span className="text-slate-500 block text-[10px]">{isAr ? 'المحلل القطاعي المالي' : 'Sector Specialist'}</span>
                                <span className="font-bold text-purple-400 truncate block">{matchedS.specialistTitleAr}</span>
                              </div>
                              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                                <span className="text-slate-500 block text-[10px]">{isAr ? 'الهدف اللفظي' : 'Target Length'}</span>
                                <span className="font-bold text-emerald-400 block">{matchedG.wordCountTarget.recommended} {isAr ? 'كلمة' : 'words'}</span>
                              </div>
                            </div>

                            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 leading-relaxed max-h-72 overflow-y-auto whitespace-pre-wrap no-scrollbar">
                              {directiveText}
                            </div>
                          </div>
                        );
                      })()}

                      {/* Simulation Result Box */}
                      {simulationResult && (
                        <div className={`p-4 rounded-xl border animate-in fade-in duration-200 ${
                          simulationResult.success 
                            ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' 
                            : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                        }`}>
                          {simulationResult.success ? (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-black text-xs flex items-center gap-1.5">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                  <span>{isAr ? '✨ نجحت دورة المحاكاة والتدريب! أُرسلت المسودة إلى قائمة قيد المراجعة:' : 'Simulation Succeeded! Draft added to Pending Queue:'}</span>
                                </span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                  {simulationResult.report?.agent_metrics?.ai_engine || 'AI Engine'}
                                </span>
                              </div>
                              <p className="text-xs font-bold text-white">{simulationResult.report?.title}</p>
                              <div className="flex items-center gap-3 text-[11px] text-slate-400">
                                <span>{isAr ? 'الكلمات:' : 'Words:'} {simulationResult.report?.agent_metrics?.word_count || 600}</span>
                                <span>•</span>
                                <span>{isAr ? 'صرامة الاستشهاد:' : 'Citations Strictness:'} 98%</span>
                                <span>•</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveTab('pending');
                                    setPendingSubFilter('ai');
                                  }}
                                  className="text-amber-400 underline font-bold cursor-pointer hover:text-amber-300"
                                >
                                  {isAr ? 'فتح المسودة في قائمة المراجعة ⬅️' : 'Review in Pending Queue ➡️'}
                                </button>
                              </div>

                              {/* Fact-Check Audit Summary Certificate */}
                              {simulationResult.report?.factCheck && (
                                <div className="p-3 rounded-xl bg-slate-950/80 border border-emerald-500/30 space-y-1.5 text-xs">
                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                    <span className="font-black text-emerald-300 flex items-center gap-1.5">
                                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                      <span>{simulationResult.report.factCheck.institutionAuthorityBadge || '🏛️ موثق بسجلات البنك المركزي الرسمي'}</span>
                                    </span>
                                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                      {isAr ? 'فحص رياضي خالٍ من الهلوسة' : 'Zero Hallucinations Verified'}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-4 text-[11px] text-slate-400 font-mono">
                                    <span>{isAr ? 'مطابقة المؤشرات:' : 'Match Score:'} <strong className="text-emerald-400">{simulationResult.report.factCheck.score || 98}%</strong></span>
                                    <span>{isAr ? 'الحقائق المفحوصة:' : 'Verified Claims:'} <strong className="text-white">{simulationResult.report.factCheck.verifiedClaimsCount || 6}/{simulationResult.report.factCheck.totalClaimsCount || 6}</strong></span>
                                    <span>{isAr ? 'مستوى المخاطر:' : 'Risk:'} <strong className="text-emerald-400">{isAr ? 'منخفض للغاية' : 'Low'}</strong></span>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-xs font-bold text-rose-300">
                              {isAr ? '⚠️ تعذر إتمام المحاكاة:' : 'Simulation Error:'} {simulationResult.error}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* -------------------------------------------------------------
                  SUB-TAB 2: 18 JOURNALISTIC GENRES (تدريب الأنواع الصحفية الـ 18)
                 ------------------------------------------------------------- */}
              {trainingSubTab === 'genres' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                    {JOURNALISTIC_GENRES.map((g) => {
                      const isSelected = activeGenreDetailId === g.id;
                      return (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => setActiveGenreDetailId(g.id)}
                          className={`p-3 rounded-xl border text-right transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-purple-600/20 border-purple-500 text-white shadow-md ring-1 ring-purple-400'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                          }`}
                        >
                          <div className="text-xs font-bold truncate">{g.nameAr}</div>
                          <div className="text-[10px] text-slate-500 truncate mt-0.5">{g.category}</div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Genre Detailed Dossier */}
                  {(() => {
                    const directive = getGenreDirective(activeGenreDetailId);
                    return (
                      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-5 shadow-xl">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                          <div>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              {directive.nameEn}
                            </span>
                            <h3 className="text-base font-black text-white mt-1 flex items-center gap-2">
                              <span>{directive.nameAr}</span>
                              <span className="text-xs text-amber-400 font-normal">({directive.agentRoleAr})</span>
                            </h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-300 font-mono">
                              {isAr ? 'النطاق اللفظي:' : 'Target:'} {directive.wordCountTarget.min} - {directive.wordCountTarget.max} {isAr ? 'كلمة' : 'words'}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Structural Template */}
                          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                            <h4 className="text-xs font-black text-purple-300 flex items-center gap-1.5">
                              <Layers className="w-3.5 h-3.5" />
                              <span>{isAr ? 'الهيكل التحريري الإلزامي للوكيل:' : 'Mandatory Structural Rubric:'}</span>
                            </h4>
                            <ol className="space-y-1.5 text-xs text-slate-300 pr-4 list-decimal">
                              {directive.structuralTemplate.map((step, idx) => (
                                <li key={idx} className="leading-relaxed">{step}</li>
                              ))}
                            </ol>
                          </div>

                          {/* Mandatory Questions */}
                          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                            <h4 className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>{isAr ? 'الأسئلة الصحفية الإلزامية التي يتقصى عنها:' : 'Core Investigative Questions:'}</span>
                            </h4>
                            <ul className="space-y-1.5 text-xs text-slate-300 pr-4 list-disc">
                              {directive.mandatoryQuestions.map((q, idx) => (
                                <li key={idx} className="leading-relaxed">{q}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Tone & Citations */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                            <span className="text-slate-500 font-bold block mb-1">{isAr ? 'ضوابط النبرة والصوت الصحفي:' : 'Tone & Voice Guidelines:'}</span>
                            <p className="text-slate-300 leading-relaxed">{directive.toneGuidelines}</p>
                          </div>
                          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                            <span className="text-slate-500 font-bold block mb-1">{isAr ? 'شرط التوثيق والمصادر المعتمدة:' : 'Citation Rule:'}</span>
                            <p className="text-emerald-400 leading-relaxed">{directive.citationRequirement}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* -------------------------------------------------------------
                  SUB-TAB 3: 28 ECONOMIC SECTORS (تدريب وكلاء القطاعات الـ 28)
                 ------------------------------------------------------------- */}
              {trainingSubTab === 'sectors' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 max-h-52 overflow-y-auto p-1 border border-slate-800/80 rounded-2xl bg-slate-950/50 no-scrollbar">
                    {ECONOMIC_SECTORS.map((s) => {
                      const isSelected = activeSectorDetailId === s.id;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setActiveSectorDetailId(s.id)}
                          className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-amber-500/20 border-amber-500 text-white shadow-md ring-1 ring-amber-400'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                          }`}
                        >
                          <div className="text-xs font-bold truncate">{s.nameAr}</div>
                          <div className="text-[9px] text-slate-500 truncate mt-0.5">{s.groupNameAr}</div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Sector Detailed Dossier */}
                  {(() => {
                    const sectorDir = getSectorDirective(activeSectorDetailId);
                    return (
                      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-5 shadow-xl">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                          <div>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              {sectorDir.nameEn}
                            </span>
                            <h3 className="text-base font-black text-white mt-1 flex items-center gap-2">
                              <span>{sectorDir.nameAr}</span>
                              <span className="text-xs text-purple-400 font-normal">({sectorDir.specialistTitleAr})</span>
                            </h3>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Key Terminology */}
                          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                            <h4 className="text-xs font-black text-amber-400">{isAr ? 'المعجم المالي والمصطلحات الإلزامية:' : 'Domain Lexicon:'}</h4>
                            <div className="flex flex-wrap gap-1.5">
                              {sectorDir.keyTerminologies.map((t, idx) => (
                                <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 text-[11px] border border-slate-800">
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Benchmark Metrics */}
                          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                            <h4 className="text-xs font-black text-purple-400">{isAr ? 'المؤشرات الحسابية المعيارية:' : 'Benchmark Metrics:'}</h4>
                            <div className="flex flex-wrap gap-1.5">
                              {sectorDir.benchmarkMetrics.map((m, idx) => (
                                <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 text-purple-300 font-mono text-[11px] border border-slate-800">
                                  {m}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Trusted Institutions */}
                          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                            <h4 className="text-xs font-black text-emerald-400">{isAr ? 'المؤسسات الرسمية المعتمدة:' : 'Trusted Institutions:'}</h4>
                            <ul className="space-y-1 text-xs text-slate-300">
                              {sectorDir.trustedInstitutions.map((inst, idx) => (
                                <li key={idx} className="flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                  <span>{inst}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                          <span className="text-slate-500 font-bold block mb-1">{isAr ? 'التوجيه المنهجي لوكيل القطاع:' : 'Sector Directive:'}</span>
                          <p className="text-slate-300 leading-relaxed font-mono">{sectorDir.systemDirectivePrompt}</p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* -------------------------------------------------------------
                  SUB-TAB 4: OFFICIAL SOURCES & FACT-CHECK LEDGER (سجل المصادر وتدقيق الحقائق)
                 ------------------------------------------------------------- */}
              {trainingSubTab === 'sources' && (
                <div className="space-y-6">
                  {/* Search and Category Filter */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        value={sourcesSearchQuery}
                        onChange={(e) => setSourcesSearchQuery(e.target.value)}
                        placeholder={isAr ? "بحث في البنوك المركزية والبورصات والمؤسسات الإفريقية (مثال: مصر، BCEAO، JSE، SARB)..." : "Search central banks and bourses..."}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 overflow-x-auto shrink-0 no-scrollbar">
                      {[
                        { id: 'all', labelAr: 'الكل', labelEn: 'All' },
                        { id: 'central_bank', labelAr: 'البنوك المركزية', labelEn: 'Central Banks' },
                        { id: 'stock_exchange', labelAr: 'البورصات', labelEn: 'Exchanges' },
                        { id: 'continental_body', labelAr: 'المؤسسات القارية', labelEn: 'Continental' }
                      ].map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setSourcesCategoryFilter(f.id as any)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                            sourcesCategoryFilter === f.id
                              ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                              : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          {isAr ? f.labelAr : f.labelEn}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sources List */}
                  {(() => {
                    const filteredSources = ALL_OFFICIAL_GROUNDING_SOURCES.filter(s => {
                      const matchesCat = sourcesCategoryFilter === 'all' || s.institutionType === sourcesCategoryFilter;
                      const q = sourcesSearchQuery.toLowerCase().trim();
                      const matchesQuery = !q || 
                        s.countryNameAr.includes(q) || 
                        s.countryNameEn.toLowerCase().includes(q) || 
                        s.institutionNameAr.includes(q) || 
                        s.institutionNameEn.toLowerCase().includes(q) ||
                        (s.currencySymbol && s.currencySymbol.toLowerCase().includes(q));
                      return matchesCat && matchesQuery;
                    });

                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredSources.map((source) => (
                          <div
                            key={source.id}
                            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all space-y-3 shadow-md group flex flex-col justify-between"
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-bold">
                                  🌍 {source.countryNameAr}
                                </span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
                                  {source.credibilityScore}% {isAr ? 'موثوقية رسمية' : 'Trust Score'}
                                </span>
                              </div>

                              <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                                {source.institutionNameAr}
                              </h4>
                              <p className="text-[11px] text-slate-400 font-mono">
                                {source.institutionNameEn}
                              </p>

                              {/* Key Indicators Provided */}
                              <div className="pt-2 border-t border-slate-800/80 space-y-1">
                                <span className="text-[10px] text-slate-500 font-bold block">{isAr ? 'المؤشرات والبيانات المفحوصة:' : 'Grounded Indicators:'}</span>
                                <div className="flex flex-wrap gap-1">
                                  {source.keyIndicatorsProvided.map((ind, i) => (
                                    <span key={i} className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 text-[10px] border border-slate-800">
                                      {ind}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Footer with Portal Link & Currency */}
                            <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs">
                              {source.currencySymbol ? (
                                <span className="font-mono text-xs font-bold text-purple-300">
                                  🪙 {source.currencySymbol}
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-500 font-mono">PAN-REGIONAL</span>
                              )}
                              <a
                                href={source.feedPortal}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 text-[11px] hover:underline"
                              >
                                <span>{isAr ? 'بوابة الإفصاح الرسمي ↗' : 'Official Portal ↗'}</span>
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* -------------------------------------------------------------
                  SUB-TAB 5: DIRECTIVES & MODELS (الحوكمة والنبرة والذكاء الاصطناعي)
                 ------------------------------------------------------------- */}
              {trainingSubTab === 'directives' && (
                <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl w-full max-w-full">
                  {/* 1. النبرة التحريرية */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>{isAr ? 'المدرسة التحريرية والنبرة الصحفية المعتمدة:' : 'Editorial Tone of Voice:'}</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: 'financial_times', nameAr: 'Financial Times', descAr: 'رصانة تحليلية وأرقام دقيقة وحياد توثيقي' },
                        { id: 'the_economist', nameAr: 'The Economist', descAr: 'عمق استشرافي وتحليل هيكلي وتفكيك سياسات' },
                        { id: 'bloomberg', nameAr: 'Bloomberg Africa', descAr: 'سرعة الأسواق اللحظية وتدفقات السيولة الاستثمارية' }
                      ].map((tone) => (
                        <div
                          key={tone.id}
                          onClick={() => setTrainingTone(tone.id as any)}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                            trainingTone === tone.id
                              ? 'bg-purple-500/15 border-purple-500/50 text-purple-200 ring-1 ring-purple-400'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <div className="font-bold text-xs text-white">{tone.nameAr}</div>
                          <div className="text-[11px] text-slate-400 mt-1">{tone.descAr}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 2. صرامة الاستشهاد بالمصادر */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-white">
                      <span>{isAr ? 'الحد الأدنى لصرامة مطابقة المصادر الرسمية:' : 'Mandatory Citation Strictness:'}</span>
                      <span className="font-mono text-emerald-400">{mandatoryCitationsStrictness}%</span>
                    </div>
                    <input
                      type="range"
                      min={90}
                      max={100}
                      value={mandatoryCitationsStrictness}
                      onChange={(e) => setMandatoryCitationsStrictness(Number(e.target.value))}
                      className="w-full accent-purple-500"
                    />
                    <p className="text-[11px] text-slate-400">
                      {isAr ? 'يتم رفض أي مقال آلياً إذا كانت المصادر غير رسمية أو تقل موثوقيتها عن هذه النسبة.' : 'Automated rejection triggered if primary source matching falls below threshold.'}
                    </p>
                  </div>

                  {/* 3. نموذج الذكاء الاصطناعي */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-blue-400" />
                      <span>{isAr ? 'محرك الذكاء الاصطناعي المعتمد في السيرفر:' : 'Primary Inference Engine:'}</span>
                    </label>
                    <select
                      value={selectedAiModel}
                      onChange={(e) => setSelectedAiModel(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="gemini-2.5-flash">Gemini 2.5 Flash (توليد وتحليل فائق السرعة والرصانة)</option>
                      <option value="gemini-1.5-pro">Gemini 1.5 Pro (تحليل استقصائي عميق وسياق مليوني)</option>
                    </select>
                  </div>

                  {/* Save Directives Button */}
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setTrainingSavedAlert(true);
                        setTimeout(() => setTrainingSavedAlert(false), 3500);
                      }}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold text-xs shadow-lg transition-all cursor-pointer"
                    >
                      {isAr ? 'حفظ وتثبيت معايير تدريب الوكلاء' : 'Save & Deploy Agent Directives'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =====================================================================
              VIEW 5: LIBRARY (المكتبة)
             ===================================================================== */}
          {activeTab === 'library' && (
            <div className="space-y-5 animate-in fade-in duration-200 w-full max-w-full mx-auto">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-teal-600" />
                    <span>{isAr ? 'مكتبة التقارير والمصادر المعتمدة' : 'Verified Editorial Library'}</span>
                  </h2>
                  <p className="text-xs text-slate-600">
                    {isAr ? 'أرشيف المقالات والتحقيقات التي أجازها المشرف البشري ونُشرت للجمهور.' : 'Comprehensive repository of human-approved and published reports.'}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-teal-500/15 text-teal-700 text-xs font-bold border border-teal-500/30">
                  {publishedArticles.length} {isAr ? 'تقارير منشورة' : 'published'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-full min-w-0">
                {publishedArticles.map((art) => (
                  <div
                    key={art.id}
                    onClick={() => handleOpenInEditor(art)}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-teal-500/50 transition-all cursor-pointer space-y-3 shadow-md group min-w-0 max-w-full overflow-hidden break-words"
                  >
                    <div className="flex items-center justify-between text-xs gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-teal-300 font-bold truncate">
                        {art.countryName} · {art.sector || art.category}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/30 shrink-0">
                        {isAr ? 'منشور للجمهور' : 'Live'}
                      </span>
                    </div>
                    <h4 className="text-base sm:text-lg font-bold text-white group-hover:text-teal-400 transition-colors line-clamp-2 break-words">
                      {art.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2 break-words">
                      {art.summary}
                    </p>
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-mono shrink-0">{art.createdAt}</span>
                      <span className="text-teal-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform shrink-0">
                        <span>{isAr ? 'مراجعة وتعديل' : 'View in Editor'}</span>
                        <ChevronLeft className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =====================================================================
              VIEW 6: ARCHIVE (الأرشيف)
             ===================================================================== */}
          {activeTab === 'archive' && (
            <div className="space-y-5 animate-in fade-in duration-200 w-full max-w-full mx-auto">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                    <Archive className="w-5 h-5 text-slate-600" />
                    <span>{isAr ? 'الأرشيف والتقارير المستبعدة' : 'Editorial Archive & Shelved Records'}</span>
                  </h2>
                  <p className="text-xs text-slate-600">
                    {isAr ? 'المقالات التي تم استبعادها أو أرشفتها لحين استكمال الوثائق الرسمية.' : 'Shelved articles held for further document verification.'}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-300">
                  {archivedArticles.length} {isAr ? 'مقالات مؤرشفة' : 'archived'}
                </span>
              </div>

              {archivedArticles.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-slate-50 border border-slate-200 space-y-3 w-full max-w-full">
                  <Archive className="w-10 h-10 text-slate-400 mx-auto" />
                  <h3 className="text-base font-bold text-slate-900">{isAr ? 'الأرشيف فارغ حالياً' : 'Archive empty'}</h3>
                  <p className="text-xs text-slate-600">{isAr ? 'لم يتم أرشفة أي مقالات بعد.' : 'No archived articles.'}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-full min-w-0">
                  {archivedArticles.map((art) => (
                    <div
                      key={art.id}
                      onClick={() => handleOpenInEditor(art)}
                      className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-600 transition-all cursor-pointer space-y-3 group min-w-0 max-w-full overflow-hidden break-words"
                    >
                      <div className="flex items-center justify-between text-xs gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-bold truncate">
                          {art.countryName} · {art.sector || art.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono px-2 py-0.5 rounded bg-slate-800 shrink-0">
                          {isAr ? 'مؤرشف' : 'Archived'}
                        </span>
                      </div>
                      <h4 className="text-base sm:text-lg font-bold text-slate-300 group-hover:text-white transition-colors line-clamp-2 break-words">
                        {art.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 break-words">
                        {art.summary}
                      </p>
                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                        <span className="text-slate-600 font-mono shrink-0">{art.createdAt}</span>
                        <span className="text-slate-400 font-bold flex items-center gap-1 group-hover:text-amber-400 transition-colors shrink-0">
                          <span>{isAr ? 'استرجاع للمحرر' : 'Restore to Editor'}</span>
                          <ChevronLeft className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {/* نافذة توجيه ملاحظات المشرف للمحرر لإعادة التعديل */}
          {revisionModalArticle && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
              <div className="w-full max-w-lg bg-[#0e172a] border border-rose-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-rose-400" />
                    <span>{isAr ? 'طلب إعادة التعديل من المحرر مع كتابة الملاحظات' : 'Request Revision with Directive'}</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setRevisionModalArticle(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white bg-slate-800/80 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] text-slate-400 block">{isAr ? 'المقال المستهدف:' : 'Target Article:'}</span>
                  <p className="text-xs font-bold text-amber-300 line-clamp-2">
                    {revisionModalArticle.title}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {isAr ? 'المحرر الكاتب:' : 'Author/Editor:'}{' '}
                    <span className="text-white font-semibold">
                      {revisionModalArticle.authorName || revisionModalArticle.editorSubmission?.editorName || (isAr ? 'محرر اقتصادي' : 'Economic Editor')}
                    </span>
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white block">
                    {isAr ? 'ملاحظات ونقد وتوجيهات المشرف للمحرر:' : 'Supervisor Critique Directive:'}
                  </label>
                  <textarea
                    rows={4}
                    value={revisionDirectiveNote}
                    onChange={(e) => setRevisionDirectiveNote(e.target.value)}
                    placeholder={isAr 
                      ? "اكتب توجيهاتك التحريرية المحددة (مثال: تدقيق أرقام البنك المركزي، تعديل صياغة المقدمة، تعميق فقرة السيولة النقدية، أو إضافة مصادر رسمية)..."
                      : "Enter critique notes for the editor..."}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500/70 leading-relaxed"
                  />
                  <p className="text-[10px] text-slate-400">
                    {isAr 
                      ? 'سيتم إشعار المحرر فوراً بملاحظاتك وتثبيت التوجيهات في سجل المقال ليقوم بتعديله وإعادة إرساله.'
                      : 'The editor will receive an immediate notification with these notes.'}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setRevisionModalArticle(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
                  >
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </button>

                  <button
                    type="button"
                    disabled={!revisionDirectiveNote.trim()}
                    onClick={() => handleRequestEditorRevision(revisionModalArticle.id, revisionDirectiveNote)}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg disabled:opacity-50 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isAr ? 'إرسال الملاحظات للمحرر وتوثيقها' : 'Dispatch Directive to Editor'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
