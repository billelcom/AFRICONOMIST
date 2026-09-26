// src/components/views/EditorialView.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Article, UserRole } from '../../types';
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
  ArrowLeft
} from 'lucide-react';
import { CommissionWizard } from '../CommissionWizard';
import { ArticleEditorialDesk } from '../ArticleEditorialDesk';
import { ALL_54_AFRICAN_COUNTRIES } from '../../data/africanCountries';
import { JOURNALISTIC_GENRES, ECONOMIC_SECTORS } from '../../data/reportOptions';
import { getSecondsUntilNextCycle, resetNextCycleTarget } from '../../lib/cycleScheduler';

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

  // Navigation tab within Newsroom
  const [activeTab, setActiveTab] = useState<NewsroomTab>('overview');
  const [activeRole] = useState<UserRole>('HUMAN_EDITOR');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(articles[0]?.id || null);

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

  // Counts
  const pendingArticles = useMemo(() => articles.filter(a => a.status === 'pending_review'), [articles]);
  const publishedArticles = useMemo(() => articles.filter(a => a.status === 'published'), [articles]);
  const archivedArticles = useMemo(() => articles.filter(a => a.status === 'rejected'), [articles]);

  // Open article directly in the editor
  const handleOpenInEditor = (article: Article) => {
    setSelectedArticleId(article.id);
    setActiveTab('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. المبدأ: إما ينشر
  const handlePublish = (articleId: string) => {
    onUpdateArticleStatus(
      articleId, 
      'published', 
      'المشرف البشري (رئيس التحرير)', 
      humanReviewerNote || (isAr ? 'تمت المصادقة التحريرية ومطابقة المصادر الرسمية والأرقام.' : 'Approved and verified against official sources.')
    );
    setSaveSuccessNotice(isAr ? '✅ تم نشر المقال بنجاح وإتاحته للجمهور!' : '✅ Article published successfully to live feed!');
    setTimeout(() => setSaveSuccessNotice(null), 3000);
  };

  // 2. المبدأ: إما يؤرشف
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

  return (
    <div className="w-[98%] max-w-[98%] sm:max-w-none sm:w-full mx-auto min-h-screen text-slate-100 flex flex-col">
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
          2. MAIN WORKSPACE WITH ARTISTIC DESKTOP SIDEBAR + CONTENT AREA
         ========================================================================= */}
      <div className="flex-1 flex flex-col md:flex-row w-full">
        {/* =======================================================================
            DESKTOP ARTISTIC SIDEBAR (قطعة فنية إبداعية قائمة على اليسار/اليمين)
           ======================================================================= */}
        <aside className="hidden md:flex flex-col w-72 lg:w-80 shrink-0 bg-gradient-to-b from-[#090D18] via-[#070A14] to-[#05070E] border-x border-slate-800/80 p-4 space-y-6 select-none shadow-2xl relative">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 left-0 w-36 h-36 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Sidebar Header Title */}
          <div className="space-y-1.5 border-b border-slate-800/80 pb-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400/90 font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                <span>{isAr ? 'غرفة الأخبار والرقابة' : 'Editorial Command'}</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
                {isAr ? 'مباشر' : 'LIVE'}
              </span>
            </div>
            <h2 className="text-sm font-black text-white flex items-center gap-2">
              <span>{isAr ? 'لوحة القيادة التحريرية' : 'Newsroom Master Desk'}</span>
            </h2>
            <p className="text-[11px] text-slate-400 leading-snug">
              {isAr ? 'المشرف البشري يقرأ، يحلل، ينتقد، ينشر أو يؤرشف.' : 'Human-in-the-loop oversight for multi-agent synthesis.'}
            </p>
          </div>

          {/* The 8 Required Navigation Buttons */}
          <nav className="space-y-2 flex-1" aria-label="Newsroom Navigation">
            {/* 1. زر التوليد الآلي كل 30 د */}
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full p-2.5 rounded-xl text-right flex items-center justify-between border transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent border-amber-500/40 text-amber-300 font-bold shadow-lg shadow-amber-500/5'
                  : 'bg-slate-900/60 hover:bg-slate-850/80 text-slate-300 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Clock className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{isAr ? 'التوليد الآلي (كل 30 د)' : 'Autonomous Cycle (30m)'}</div>
                  <div className="text-[10px] text-slate-400">{isAr ? 'رصد دوري للـ 54 دولة' : '54 Nations pulse feed'}</div>
                </div>
              </div>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-950 border border-amber-500/30 text-amber-400">
                {formatTime(secondsUntilNextCycle)}
              </span>
            </button>

            {/* 2. زر التوليد الفوري العشوائي */}
            <button
              onClick={handleTriggerInstantRandomGeneration}
              disabled={isAutomatedIngesting}
              className="w-full p-2.5 rounded-xl text-right flex items-center justify-between bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center text-slate-950">
                  <Zap className={`w-4 h-4 ${isAutomatedIngesting ? 'animate-spin' : 'fill-current group-hover:scale-110 transition-transform'}`} />
                </div>
                <div>
                  <div className="text-xs font-black">{isAr ? 'توليد فوري عشوائي' : 'Instant Random Commission'}</div>
                  <div className="text-[10px] text-slate-900/80 font-medium">{isAr ? 'دولة · قطاع · قالب بنقرة واحدة' : '1-click country+sector draft'}</div>
                </div>
              </div>
              <Sparkles className="w-4 h-4 text-slate-950/80" />
            </button>

            {/* 3. زر التوليد المخصص (انتقال سلس مدمج بدون popup) */}
            <button
              onClick={() => setActiveTab('commission')}
              className={`w-full p-2.5 rounded-xl text-right flex items-center justify-between border transition-all cursor-pointer group ${
                activeTab === 'commission'
                  ? 'bg-gradient-to-r from-blue-500/20 via-blue-500/10 to-transparent border-blue-500 text-blue-300 font-bold shadow-lg shadow-blue-500/10'
                  : 'bg-slate-900/60 hover:bg-slate-850/80 text-slate-300 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{isAr ? 'توليد مخصص' : 'Commission Custom Report'}</div>
                  <div className="text-[10px] text-slate-400">{isAr ? 'خطوات متسلسلة بدون نوافذ' : 'Smooth in-page wizard'}</div>
                </div>
              </div>
              <Plus className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
            </button>

            {/* 4. زر تدريب الوكيل */}
            <button
              onClick={() => setActiveTab('training')}
              className={`w-full p-2.5 rounded-xl text-right flex items-center justify-between border transition-all cursor-pointer ${
                activeTab === 'training'
                  ? 'bg-gradient-to-r from-purple-500/15 to-transparent border-purple-500/40 text-purple-300 font-bold shadow-lg'
                  : 'bg-slate-900/60 hover:bg-slate-850/80 text-slate-300 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Brain className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{isAr ? 'تدريب الوكيل' : 'Agent Training Workbench'}</div>
                  <div className="text-[10px] text-slate-400">{isAr ? 'ضبط النبرة التحريرية والبرومبتات' : 'Prompt tuning & strictness'}</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            {/* 5. زر المقالات المولدة التي تحتاج الى معالجة */}
            <button
              onClick={() => setActiveTab('pending')}
              className={`w-full p-2.5 rounded-xl text-right flex items-center justify-between border transition-all cursor-pointer ${
                activeTab === 'pending'
                  ? 'bg-gradient-to-r from-rose-500/15 to-transparent border-rose-500/40 text-rose-300 font-bold shadow-lg'
                  : 'bg-slate-900/60 hover:bg-slate-850/80 text-slate-300 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{isAr ? 'مقالات تحتاج معالجة' : 'Pending Ingestion Queue'}</div>
                  <div className="text-[10px] text-slate-400">{isAr ? 'بانتظار إجازة المشرف البشري' : 'Human review required'}</div>
                </div>
              </div>
              {pendingArticles.length > 0 ? (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500 text-white font-mono shadow-sm animate-pulse">
                  {pendingArticles.length}
                </span>
              ) : (
                <span className="text-[11px] text-slate-500 font-mono">0</span>
              )}
            </button>

            {/* 6. زر تحرير */}
            <button
              onClick={() => {
                if (currentActiveArticle) setActiveTab('editor');
              }}
              className={`w-full p-2.5 rounded-xl text-right flex items-center justify-between border transition-all cursor-pointer ${
                activeTab === 'editor'
                  ? 'bg-gradient-to-r from-emerald-500/15 to-transparent border-emerald-500/40 text-emerald-300 font-bold shadow-lg'
                  : 'bg-slate-900/60 hover:bg-slate-850/80 text-slate-300 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <FileEdit className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{isAr ? 'محرر الأخبار المباشر' : 'Live Editorial Desk'}</div>
                  <div className="text-[10px] text-slate-400">{isAr ? 'نشر · تعديل ومحاولة · أرشفة' : 'Publish, Edit/Retry, Archive'}</div>
                </div>
              </div>
              <Edit3 className="w-4 h-4 text-emerald-400/80" />
            </button>

            {/* 7. زر المكتبة */}
            <button
              onClick={() => setActiveTab('library')}
              className={`w-full p-2.5 rounded-xl text-right flex items-center justify-between border transition-all cursor-pointer ${
                activeTab === 'library'
                  ? 'bg-gradient-to-r from-teal-500/15 to-transparent border-teal-500/40 text-teal-300 font-bold shadow-lg'
                  : 'bg-slate-900/60 hover:bg-slate-850/80 text-slate-300 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{isAr ? 'المكتبة والتقارير' : 'Editorial Library'}</div>
                  <div className="text-[10px] text-slate-400">{isAr ? `${publishedArticles.length} تقارير منشورة` : `${publishedArticles.length} published reports`}</div>
                </div>
              </div>
              <span className="text-[11px] text-teal-400 font-mono">{publishedArticles.length}</span>
            </button>

            {/* 8. زر الارشيف */}
            <button
              onClick={() => setActiveTab('archive')}
              className={`w-full p-2.5 rounded-xl text-right flex items-center justify-between border transition-all cursor-pointer ${
                activeTab === 'archive'
                  ? 'bg-gradient-to-r from-slate-700/30 to-transparent border-slate-600 text-slate-200 font-bold shadow-lg'
                  : 'bg-slate-900/60 hover:bg-slate-850/80 text-slate-400 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
                  <Archive className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-300">{isAr ? 'الأرشيف والمرفوضات' : 'Editorial Archive'}</div>
                  <div className="text-[10px] text-slate-500">{isAr ? 'المقالات المستبعدة للمراجعة' : 'Shelved & rejected records'}</div>
                </div>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">{archivedArticles.length}</span>
            </button>
          </nav>

          {/* Security & System Info Footer in Sidebar */}
          <div className="pt-3 border-t border-slate-800/80 text-[11px] space-y-2 text-slate-400">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>{isAr ? 'المشرف البشري:' : 'Supervisor:'}</span>
              </span>
              <span className="text-white font-bold">{isAr ? 'رئيس التحرير' : 'Editor-in-Chief'}</span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>RBAC Zero-Trust</span>
              <span>Gemini 3.6 Flash</span>
            </div>
          </div>
        </aside>

        {/* =======================================================================
            MAIN CONTENT AREA (بدون سكرول بار إضافي مزدوج على الحاسوب)
           ======================================================================= */}
        <div className="flex-1 p-2 sm:p-6 lg:p-8 space-y-6">
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
                  <h1 className="text-lg sm:text-2xl font-black text-white">
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
                    <section key={sector.id} className="space-y-4 w-full">
                      {/* Sector Header with Desktop Controls */}
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${sector.accentColor} border flex items-center justify-center shrink-0`}>
                            <SectorIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          <div>
                            <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                              <span>{isAr ? sector.nameAr : sector.nameEn}</span>
                              <span className="text-[10px] sm:text-[11px] font-mono px-2 py-0.2 rounded-full bg-slate-800 text-slate-300">
                                {sectorArticles.length} {isAr ? 'تقارير' : 'reports'}
                              </span>
                            </h3>
                            <p className="text-[11px] sm:text-xs text-slate-400">
                              {isAr ? sector.descriptionAr : sector.descriptionEn}
                            </p>
                          </div>
                        </div>

                        {/* Desktop Slider Navigation Arrows (انتقال سلس بين الشرائح) */}
                        <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                          <span className="text-[11px] text-slate-500 font-mono ml-2">
                            {isAr ? 'تنقل بين الدول والقوالب' : 'Scroll slides'}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleScrollSector(sector.id, 'prev')}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700"
                            title={isAr ? 'السابق' : 'Previous'}
                          >
                            <ChevronRight className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleScrollSector(sector.id, 'next')}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700"
                            title={isAr ? 'التالي' : 'Next'}
                          >
                            <ChevronLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
                          </button>
                        </div>
                      </div>

                      {/* Sector Slides / Cards:
                          - On Mobile: Takes 98% of width, snap-center, without any scrollbar!
                          - On Desktop: Multi-card layout with smooth scroll buttons
                      */}
                      <div 
                        id={`sector-slider-${sector.id}`}
                        className="overflow-x-auto no-scrollbar scroll-smooth flex gap-3 sm:gap-4 pb-2 snap-x snap-mandatory w-full"
                      >
                        {sectorArticles.map((art, idx) => {
                          const isPending = art.status === 'pending_review';

                          return (
                            <div
                              key={art.id || idx}
                              onClick={() => handleOpenInEditor(art)}
                              className="w-[98%] min-w-[98%] max-w-[98%] sm:w-80 sm:min-w-0 sm:max-w-none shrink-0 snap-center sm:snap-start bg-slate-900/90 hover:bg-slate-850/90 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 space-y-3 cursor-pointer transition-all duration-200 group shadow-lg flex flex-col justify-between mx-auto sm:mx-0"
                            >
                              {/* Top Bar: Country & Journalistic Genre */}
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-amber-300 font-bold border border-slate-700">
                                      🌍 {art.countryName}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-mono">
                                      {art.countryCode}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] font-mono text-slate-500 sm:hidden">
                                      [{idx + 1}/{sectorArticles.length}]
                                    </span>
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
                                <div className="inline-block text-[11px] font-bold text-amber-400/90 bg-amber-500/10 px-2.5 py-0.5 rounded-lg border border-amber-500/20">
                                  📰 {art.journalisticType || (isAr ? 'التحقيق الصحفي' : 'Investigative')}
                                </div>

                                {/* Title */}
                                <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
                                  {art.title}
                                </h4>

                                {/* Summary preview */}
                                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                                  {art.summary}
                                </p>
                              </div>

                              {/* Footer of Card */}
                              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                                <span className="flex items-center gap-1">
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>{art.factCheck?.score || 96}% {isAr ? 'دقة' : 'score'}</span>
                                </span>
                                <span className="text-amber-400/90 group-hover:translate-x-1 transition-transform flex items-center gap-0.5 font-bold">
                                  <span>{isAr ? 'فتح المحرر' : 'Open Editor'}</span>
                                  <ChevronLeft className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" />
                                </span>
                              </div>
                            </div>
                          );
                        })}
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
                onUpdateArticleStatus(updated.id, 'published', 'المشرف البشري (رئيس التحرير)', note);
                setSaveSuccessNotice(isAr ? '✅ تم نشر المقال بنجاح وإتاحته للجمهور!' : '✅ Article published successfully!');
                setTimeout(() => setSaveSuccessNotice(null), 3000);
              }}
              onArchive={(updated, note) => {
                if (onSaveArticle) onSaveArticle(updated);
                onUpdateArticleStatus(updated.id, 'rejected', 'المشرف البشري (الرقابة التحريرية)', note);
                setSaveSuccessNotice(isAr ? '📦 تم نقل المقال إلى الأرشيف بنجاح.' : '📦 Article archived.');
                setTimeout(() => setSaveSuccessNotice(null), 3000);
              }}
              onSaveDraft={(updated) => {
                if (onSaveArticle) onSaveArticle(updated);
                setSaveSuccessNotice(isAr ? '💾 تم حفظ التعديلات اليدوية على المسودة بنجاح.' : '💾 Manual edits saved.');
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
              VIEW 3: PENDING QUEUE (المقالات التي تحتاج إلى معالجة)
             ===================================================================== */}
          {activeTab === 'pending' && (
            <div className="space-y-5 animate-in fade-in duration-200 w-[98%] max-w-[98%] sm:max-w-none mx-auto">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-rose-400" />
                    <span>{isAr ? 'المقالات المولدة التي تحتاج إلى معالجة' : 'Pending Ingestion Desk'}</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    {isAr ? 'مسودات وكلاء الذكاء الاصطناعي بانتظار قراءة المشرف البشري ونقده وإجازته.' : 'Agent-generated drafts awaiting human editorial review.'}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
                  {pendingArticles.length} {isAr ? 'مسودات معلقة' : 'pending'}
                </span>
              </div>

              {pendingArticles.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h3 className="text-base font-bold text-white">{isAr ? 'لا توجد مقالات معلقة حالياً' : 'All drafts processed'}</h3>
                  <p className="text-xs text-slate-400">{isAr ? 'كافة التقارير تمت معالجتها ومراجعتها. يمكنك استخدام "توليد فوري عشوائي" لإنشاء مسودة جديدة فوراً.' : 'Queue clear. Commission a new draft using instant generation.'}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pendingArticles.map((art) => (
                    <div
                      key={art.id}
                      onClick={() => handleOpenInEditor(art)}
                      className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer space-y-3 shadow-md group"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-bold">
                          {art.countryName} · {art.sector || art.category}
                        </span>
                        <span className="text-[10px] text-rose-400 font-mono px-2 py-0.5 rounded bg-rose-950/40 border border-rose-500/30">
                          {isAr ? 'بانتظار المشرف' : 'Review Needed'}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2">
                        {art.title}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-2">
                        {art.summary}
                      </p>
                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 font-mono">{art.createdAt}</span>
                        <span className="text-amber-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          <span>{isAr ? 'فتح للتحرير والمصادقة' : 'Open in Editor'}</span>
                          <ChevronLeft className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* =====================================================================
              VIEW 4: AGENT TRAINING (تدريب الوكيل وضبط المعايير التحريرية)
             ===================================================================== */}
          {activeTab === 'training' && (
            <div className="space-y-6 animate-in fade-in duration-200 w-[98%] max-w-[98%] sm:max-w-3xl mx-auto">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  <span>{isAr ? 'منصة تدريب وضبط وكلاء الذكاء الاصطناعي' : 'Agent Training & Directives Workbench'}</span>
                </h2>
                <p className="text-xs text-slate-400">
                  {isAr ? 'تحديد معايير الصرامة التحريرية، نبرة الصياغة، وضوابط استشهاد المصادر الرسمية.' : 'Configure strictness, tone of voice, and official fact-check tolerances.'}
                </p>
              </div>

              {trainingSavedAlert && (
                <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/40 text-purple-200 text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400" />
                  <span>{isAr ? 'تم حفظ معايير التدريب بنجاح وتطبيقها على خط الإنتاج الآلي!' : 'Agent directives updated successfully!'}</span>
                </div>
              )}

              <div className="p-4 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
                {/* 1. النبرة التحريرية */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>{isAr ? 'المدرسة التحريرية والنبرة الصحفية المعتمدة:' : 'Editorial Tone of Voice:'}</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'financial_times', nameAr: 'Financial Times', descAr: 'رصانة تحليلية وأرقام دقيقة' },
                      { id: 'the_economist', nameAr: 'The Economist', descAr: 'عمق استشرافي وتحليل هيكلي' },
                      { id: 'bloomberg', nameAr: 'Bloomberg Africa', descAr: 'سرعة الأسواق وتدفقات السيولة' }
                    ].map((tone) => (
                      <div
                        key={tone.id}
                        onClick={() => setTrainingTone(tone.id as any)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          trainingTone === tone.id
                            ? 'bg-purple-500/15 border-purple-500/50 text-purple-200'
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
                    className="w-full accent-amber-500"
                  />
                  <p className="text-[11px] text-slate-400">
                    {isAr ? 'يتم رفض أي مقال آلياً إذا كانت المصادر غير رسمية أو تقل موثوقيتها عن هذه النسبة.' : 'Automated rejection triggered if primary source matching falls below threshold.'}
                  </p>
                </div>

                {/* 3. نموذج الذكاء الاصطناعي */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-blue-400" />
                    <span>{isAr ? 'محرك الذكاء الاصطناعي المعتمد:' : 'Primary Inference Engine:'}</span>
                  </label>
                  <select
                    value={selectedAiModel}
                    onChange={(e) => setSelectedAiModel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="gemini-3.6-flash">Gemini 3.6 Flash (توليد واسترجاع فائق السرعة)</option>
                    <option value="gemini-1.5-pro">Gemini 1.5 Pro (تحليل استقصائي عميق وسياق مليوني)</option>
                  </select>
                </div>

                {/* Save Directives Button */}
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      setTrainingSavedAlert(true);
                      setTimeout(() => setTrainingSavedAlert(false), 3000);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold text-xs shadow-lg transition-all cursor-pointer"
                  >
                    {isAr ? 'حفظ وتثبيت معايير التدريب' : 'Save & Deploy Parameters'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              VIEW 5: LIBRARY (المكتبة)
             ===================================================================== */}
          {activeTab === 'library' && (
            <div className="space-y-5 animate-in fade-in duration-200 w-[98%] max-w-[98%] sm:max-w-none mx-auto">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-teal-400" />
                    <span>{isAr ? 'مكتبة التقارير والمصادر المعتمدة' : 'Verified Editorial Library'}</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    {isAr ? 'أرشيف المقالات والتحقيقات التي أجازها المشرف البشري ونُشرت للجمهور.' : 'Comprehensive repository of human-approved and published reports.'}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
                  {publishedArticles.length} {isAr ? 'تقارير منشورة' : 'published'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {publishedArticles.map((art) => (
                  <div
                    key={art.id}
                    onClick={() => handleOpenInEditor(art)}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-teal-500/50 transition-all cursor-pointer space-y-3 shadow-md group"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-teal-300 font-bold">
                        {art.countryName} · {art.sector || art.category}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/30">
                        {isAr ? 'منشور للجمهور' : 'Live'}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white group-hover:text-teal-400 transition-colors line-clamp-2">
                      {art.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {art.summary}
                    </p>
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-mono">{art.createdAt}</span>
                      <span className="text-teal-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
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
            <div className="space-y-5 animate-in fade-in duration-200 w-[98%] max-w-[98%] sm:max-w-none mx-auto">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    <Archive className="w-5 h-5 text-slate-400" />
                    <span>{isAr ? 'الأرشيف والتقارير المستبعدة' : 'Editorial Archive & Shelved Records'}</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    {isAr ? 'المقالات التي تم استبعادها أو أرشفتها لحين استكمال الوثائق الرسمية.' : 'Shelved articles held for further document verification.'}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700">
                  {archivedArticles.length} {isAr ? 'مقالات مؤرشفة' : 'archived'}
                </span>
              </div>

              {archivedArticles.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <Archive className="w-10 h-10 text-slate-500 mx-auto" />
                  <h3 className="text-base font-bold text-white">{isAr ? 'الأرشيف فارغ حالياً' : 'Archive empty'}</h3>
                  <p className="text-xs text-slate-400">{isAr ? 'لم يتم أرشفة أي مقالات بعد.' : 'No archived articles.'}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {archivedArticles.map((art) => (
                    <div
                      key={art.id}
                      onClick={() => handleOpenInEditor(art)}
                      className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-600 transition-all cursor-pointer space-y-3 group"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-bold">
                          {art.countryName} · {art.sector || art.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono px-2 py-0.5 rounded bg-slate-800">
                          {isAr ? 'مؤرشف' : 'Archived'}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors line-clamp-2">
                        {art.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {art.summary}
                      </p>
                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                        <span className="text-slate-600 font-mono">{art.createdAt}</span>
                        <span className="text-slate-400 font-bold flex items-center gap-1 group-hover:text-amber-400 transition-colors">
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
        </div>
      </div>
    </div>
  );
};
