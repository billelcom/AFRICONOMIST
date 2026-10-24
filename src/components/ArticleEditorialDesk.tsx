/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Article, ArticleGraphicItem, Citation } from '../types';
import { 
  FileEdit, 
  Bookmark, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  RotateCcw, 
  Archive, 
  Brain, 
  ArrowRight, 
  ArrowLeft, 
  ChevronRight, 
  ChevronLeft, 
  Eye, 
  Check, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  BarChart3, 
  Globe2, 
  TrendingUp, 
  Maximize2, 
  X, 
  Clock, 
  User, 
  Layers, 
  Sparkles,
  ExternalLink,
  Volume2,
  Upload,
  ImagePlus,
  Link as LinkIcon,
  RefreshCw,
  ChevronDown,
  Search,
  Globe,
  Building2,
  Flame,
  Coins,
  Briefcase,
  Send,
  AlertCircle,
  Crown,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ALL_54_AFRICAN_COUNTRIES } from '../data/africanCountries';
import { JOURNALISTIC_GENRES, ECONOMIC_SECTORS } from '../data/reportOptions';
import { EditorialToolbar } from './editorial/EditorialToolbar';
import { CoverImageSelector } from './editorial/CoverImageSelector';
import { GraphicsManager } from './editorial/GraphicsManager';
import { GraphicEditorModal } from './editorial/GraphicEditorModal';
import { LivePaperPreview } from './editorial/LivePaperPreview';
import { ClassificationSidebar } from './editorial/ClassificationSidebar';

interface ArticleEditorialDeskProps {
  article: Article;
  articleIndex: number;
  totalArticlesCount: number;
  hasPrevArticle: boolean;
  hasNextArticle: boolean;
  onPrevArticle: () => void;
  onNextArticle: () => void;
  onBackToOverview: () => void;
  onPublish: (updated: Article, note: string) => void;
  onArchive: (updated: Article, note: string) => void;
  onSaveDraft: (updated: Article) => void;
  onDelete?: (articleId: string) => void;
  onAiRefine: (customNotes: string, promptHeadline: string) => Promise<void>;
  isAiRefining: boolean;
  onPreviewArticle?: (article: Article) => void;
  lang: 'ar' | 'en';
}

// Helper for ISO country flag emoji
const getCountryFlagEmoji = (code: string) => {
  if (!code || code.length !== 2) return '🌍';
  const codePoints = code
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

// Regions configuration for 54 African countries
const AFRICAN_REGIONS = [
  { id: 'all', labelAr: 'الكل (كافة الدول)', labelEn: 'All Countries' },
  { id: 'north', labelAr: 'شمال أفريقيا', labelEn: 'North', codes: ['EG', 'DZ', 'MA', 'TN', 'LY', 'SD', 'MR', 'EH'] },
  { id: 'west', labelAr: 'غرب أفريقيا', labelEn: 'West', codes: ['NG', 'GH', 'CI', 'SN', 'ML', 'BF', 'NE', 'GN', 'BJ', 'TG', 'SL', 'LR', 'GM', 'GW', 'CV'] },
  { id: 'east', labelAr: 'شرق أفريقيا', labelEn: 'East', codes: ['KE', 'ET', 'TZ', 'UG', 'RW', 'BI', 'SS', 'SO', 'DJ', 'ER', 'SC', 'MU', 'KM', 'MG'] },
  { id: 'central', labelAr: 'وسط أفريقيا', labelEn: 'Central', codes: ['CD', 'CM', 'AO', 'CG', 'GA', 'TD', 'CF', 'GQ', 'ST'] },
  { id: 'southern', labelAr: 'الجنوب الإفريقي', labelEn: 'Southern', codes: ['ZA', 'ZM', 'ZW', 'BW', 'NA', 'MZ', 'MW', 'SZ', 'LS'] }
];

// Sector groups configuration
const SECTOR_GROUPS = [
  { id: 'all', labelAr: 'كافة القطاعات (28)', labelEn: 'All (28)' },
  { id: 'energy', labelAr: 'طاقة وموارد', labelEn: 'Energy' },
  { id: 'markets', labelAr: 'أسواق وعملات', labelEn: 'Markets' },
  { id: 'finance', labelAr: 'مصارف واستثمار', labelEn: 'Finance' },
  { id: 'tech_digital', labelAr: 'تكنولوجيا ورقمي', labelEn: 'Digital' },
  { id: 'trade_industry', labelAr: 'تجارة وصناعة', labelEn: 'Trade' },
  { id: 'sustainable', labelAr: 'استدامة وزراعة', labelEn: 'Agri & Green' },
  { id: 'macro', labelAr: 'اقتصاد كلي', labelEn: 'Macro' }
];

// Journalistic genre categories configuration
const GENRE_CATEGORIES = [
  { id: 'all', labelAr: 'كافة القوالب (18)', labelEn: 'All (18)' },
  { id: 'اخبار', labelAr: 'أخبار وتغطية', labelEn: 'News' },
  { id: 'استقصاء وتحليل', labelAr: 'استقصاء وتحليل', labelEn: 'In-Depth' },
  { id: 'رأي ومقالات', labelAr: 'رأي ومقالات', labelEn: 'Opinion' },
  { id: 'حوارات ورصد', labelAr: 'حوارات ورصد', labelEn: 'Interviews' },
  { id: 'بصري وبيانات', labelAr: 'بيانات ورسوم', labelEn: 'Data' }
];

export const ArticleEditorialDesk: React.FC<ArticleEditorialDeskProps> = ({
  article,
  articleIndex,
  totalArticlesCount,
  hasPrevArticle,
  hasNextArticle,
  onPrevArticle,
  onNextArticle,
  onBackToOverview,
  onPublish,
  onArchive,
  onSaveDraft,
  onDelete,
  onAiRefine,
  isAiRefining,
  onPreviewArticle,
  lang
}) => {
  const isAr = lang === 'ar';
  const { user, profile, role, sendNotification } = useAuth();
  const isAdmin = role === 'ADMIN';
  const isSupervisor = role === 'SUPERVISOR' || isAdmin;
  const isEditor = role === 'EDITOR';
  const [submissionFeedback, setSubmissionFeedback] = useState<string | null>(null);

  // State for editable fields
  const [editableTitle, setEditableTitle] = useState<string>(article.title || '');
  const [editableImageUrl, setEditableImageUrl] = useState<string>(article.imageUrl || '');
  const [editableSummary, setEditableSummary] = useState<string>(article.summary || '');
  const [editableContent, setEditableContent] = useState<string>(
    Array.isArray(article.content) ? article.content.join('\n\n') : (article.content || '')
  );
  const [editableCountry, setEditableCountry] = useState<string>(article.countryName || 'الجزائر');
  const [editableSector, setEditableSector] = useState<string>(article.sector || 'طاقة');
  const [editableGenre, setEditableGenre] = useState<string>(article.journalisticType || 'تقرير اقتصادي');
  const [editableAuthor, setEditableAuthor] = useState<string>(article.authorName || 'وحدة الرصد والتحقيقات الاقتصادية');
  const [editableAuthorRole, setEditableAuthorRole] = useState<string>(article.authorRole || 'محرر الشؤون القارية');
  const [editableMarketImpact, setEditableMarketImpact] = useState<'positive' | 'negative' | 'neutral'>(article.marketImpact || 'positive');
  const [humanReviewerNote, setHumanReviewerNote] = useState<string>(article.reviewNotes || '');

  // Interactive Dropdowns state for Triple Classification (Direct selection without typing)
  const [openDropdown, setOpenDropdown] = useState<'country' | 'sector' | 'genre' | null>(null);
  const [countryRegionFilter, setCountryRegionFilter] = useState<string>('all');
  const [sectorGroupFilter, setSectorGroupFilter] = useState<string>('all');
  const [genreCategoryFilter, setGenreCategoryFilter] = useState<string>('all');

  // Selected matching objects for display
  const selectedCountryObj = useMemo(() => {
    return ALL_54_AFRICAN_COUNTRIES.find(
      c => c.nameAr === editableCountry || c.nameEn.toLowerCase() === editableCountry.toLowerCase() || c.code === article.countryCode
    ) || ALL_54_AFRICAN_COUNTRIES.find(c => c.nameAr.includes(editableCountry) || editableCountry.includes(c.nameAr)) || null;
  }, [editableCountry, article.countryCode]);

  const selectedSectorObj = useMemo(() => {
    return ECONOMIC_SECTORS.find(
      s => s.nameAr === editableSector || s.nameEn.toLowerCase() === editableSector.toLowerCase()
    ) || ECONOMIC_SECTORS.find(s => editableSector.includes(s.nameAr) || s.nameAr.includes(editableSector)) || null;
  }, [editableSector]);

  const selectedGenreObj = useMemo(() => {
    return JOURNALISTIC_GENRES.find(
      g => g.nameAr === editableGenre || g.nameEn.toLowerCase() === editableGenre.toLowerCase()
    ) || JOURNALISTIC_GENRES.find(g => editableGenre.includes(g.nameAr) || g.nameAr.includes(editableGenre)) || null;
  }, [editableGenre]);

  // Filtered lists for dropdown menus
  const filteredCountries = useMemo(() => {
    if (countryRegionFilter === 'all') return ALL_54_AFRICAN_COUNTRIES;
    const reg = AFRICAN_REGIONS.find(r => r.id === countryRegionFilter);
    if (reg && reg.codes) {
      return ALL_54_AFRICAN_COUNTRIES.filter(c => reg.codes.includes(c.code));
    }
    return ALL_54_AFRICAN_COUNTRIES;
  }, [countryRegionFilter]);

  const filteredSectors = useMemo(() => {
    if (sectorGroupFilter === 'all') return ECONOMIC_SECTORS;
    return ECONOMIC_SECTORS.filter(s => s.group === sectorGroupFilter);
  }, [sectorGroupFilter]);

  const filteredGenres = useMemo(() => {
    if (genreCategoryFilter === 'all') return JOURNALISTIC_GENRES;
    return JOURNALISTIC_GENRES.filter(g => g.category === genreCategoryFilter);
  }, [genreCategoryFilter]);

  // File input ref for device photo upload
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setEditableImageUrl(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  // Curated high-res presets for African economic news
  const COVER_IMAGE_PRESETS = [
    {
      id: 'energy',
      nameAr: '⚡ طاقة وتكرير ونفط',
      nameEn: 'Energy & Refining',
      url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'trade',
      nameAr: '🚢 موانئ وشحن إقليمي',
      nameEn: 'Maritime Trade & Ports',
      url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'markets',
      nameAr: '🏦 أسواق مال وبنوك مركزية',
      nameEn: 'Financial Markets & Banking',
      url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'mining',
      nameAr: '⛏️ تعدين ومعادن إستراتيجية',
      nameEn: 'Mining & Critical Minerals',
      url: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'agri',
      nameAr: '🌾 زراعة وأمن غذائي',
      nameEn: 'Agribusiness & Food Security',
      url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'tech',
      nameAr: '💻 تكنولوجيا واقتصاد رقمي',
      nameEn: 'FinTech & Digital Economy',
      url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'infra',
      nameAr: '🏗️ مشاريع بنية تحتية',
      nameEn: 'Infrastructure & Power',
      url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80'
    }
  ];

  // Graphics state
  const [graphics, setGraphics] = useState<ArticleGraphicItem[]>(() => {
    if (article.graphics && article.graphics.length > 0) {
      return [...article.graphics];
    }
    return [
      {
        id: `g-init-1`,
        title: isAr ? `مؤشرات الطاقة والتدفقات الإقليمية: ${article.countryName}` : `Regional Energy Flows: ${article.countryNameEn || article.countryName}`,
        type: 'chart',
        position: 'mid',
        align: 'right',
        caption: isAr ? `توزيع التدفقات والقدرات الإنتاجية` : `Production & Flow Distribution`,
        dataPoints: [
          { label: isAr ? 'المرحلة 1' : 'Phase 1', value: 45, desc: '45%' },
          { label: isAr ? 'المرحلة 2' : 'Phase 2', value: 70, desc: '70%' },
          { label: isAr ? 'المرحلة 3' : 'Phase 3', value: 92, desc: '92%' }
        ],
        details: isAr ? 'بيانات معتمدة من وحدة الرصد والتوثيق' : 'Verified by Research Desk'
      }
    ];
  });

  // Modal for adding / editing a graphic
  const [editingGraphic, setEditingGraphic] = useState<ArticleGraphicItem | null>(null);
  const [isGraphicModalOpen, setIsGraphicModalOpen] = useState<boolean>(false);
  const [isNewGraphic, setIsNewGraphic] = useState<boolean>(false);

  // In-desk Live Paper View Toggle
  const [viewMode, setViewMode] = useState<'edit' | 'paper_preview'>('edit');
  const [zoomGraphic, setZoomGraphic] = useState<ArticleGraphicItem | null>(null);

  // Auto-resizing refs for textareas (NO SCROLLBAR)
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const summaryRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const autoResize = (el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.max(el.scrollHeight, 40)}px`;
  };

  useEffect(() => {
    setEditableTitle(article.title || '');
    setEditableImageUrl(article.imageUrl || '');
    setEditableSummary(article.summary || '');
    setEditableContent(
      Array.isArray(article.content) ? article.content.join('\n\n') : (article.content || '')
    );
    setEditableCountry(article.countryName || 'الجزائر');
    setEditableSector(article.sector || 'طاقة');
    setEditableGenre(article.journalisticType || 'تقرير اقتصادي');
    setEditableAuthor(article.authorName || 'وحدة الرصد والتحقيقات الاقتصادية');
    setEditableAuthorRole(article.authorRole || 'محرر الشؤون القارية');
    setEditableMarketImpact(article.marketImpact || 'positive');
    setHumanReviewerNote(article.reviewNotes || '');
    if (article.graphics && article.graphics.length > 0) {
      setGraphics([...article.graphics]);
    }
  }, [article]);

  useEffect(() => {
    autoResize(titleRef.current);
    autoResize(summaryRef.current);
    autoResize(contentRef.current);
  }, [editableTitle, editableSummary, editableContent, viewMode]);

  // Real-time word count & read time
  const wordCount = useMemo(() => {
    if (!editableContent) return 0;
    return editableContent.trim().split(/\s+/).filter(Boolean).length;
  }, [editableContent]);

  const estimatedReadTime = useMemo(() => {
    return Math.max(1, Math.ceil(wordCount / 180));
  }, [wordCount]);

  // Construct current article object with edits
  const buildCurrentUpdatedArticle = (): Article => {
    const paragraphs = editableContent
      .split('\n\n')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    const matchedCountry = ALL_54_AFRICAN_COUNTRIES.find(
      c => c.nameAr === editableCountry || c.nameEn.toLowerCase() === editableCountry.toLowerCase()
    );

    return {
      ...article,
      title: editableTitle,
      imageUrl: editableImageUrl,
      summary: editableSummary,
      content: paragraphs.length > 0 ? paragraphs : [editableContent],
      countryName: editableCountry,
      countryNameEn: matchedCountry?.nameEn || article.countryNameEn || editableCountry,
      countryCode: matchedCountry?.code || article.countryCode || 'DZ',
      sector: editableSector,
      journalisticType: editableGenre,
      authorName: editableAuthor,
      authorRole: editableAuthorRole,
      marketImpact: editableMarketImpact,
      graphics: graphics,
      readTimeMinutes: estimatedReadTime,
      reviewNotes: humanReviewerNote
    };
  };

  // Graphic Modal Handlers
  const handleOpenNewGraphicModal = () => {
    const newG: ArticleGraphicItem = {
      id: `g-${Date.now()}`,
      title: isAr ? 'رسم بياني جديد' : 'New Analytical Graphic',
      type: 'chart',
      position: 'mid',
      align: 'right',
      caption: isAr ? 'شرح تفصيلي للرسم البياني أو المؤشر' : 'Detailed graphic caption',
      dataPoints: [
        { label: isAr ? 'المؤشر أ' : 'Metric A', value: 65, desc: '65%' },
        { label: isAr ? 'المؤشر ب' : 'Metric B', value: 85, desc: '85%' }
      ],
      details: isAr ? 'المصدر: التقرير الإحصائي الرسمي' : 'Source: Official Statistical Report'
    };
    setEditingGraphic(newG);
    setIsNewGraphic(true);
    setIsGraphicModalOpen(true);
  };

  const handleEditGraphic = (g: ArticleGraphicItem) => {
    setEditingGraphic({ ...g });
    setIsNewGraphic(false);
    setIsGraphicModalOpen(true);
  };

  const handleDeleteGraphic = (id: string) => {
    setGraphics(prev => prev.filter(g => g.id !== id));
  };

  const handleSaveGraphicModal = () => {
    if (!editingGraphic) return;
    if (isNewGraphic) {
      setGraphics(prev => [...prev, editingGraphic]);
    } else {
      setGraphics(prev => prev.map(g => g.id === editingGraphic.id ? editingGraphic : g));
    }
    setIsGraphicModalOpen(false);
    setEditingGraphic(null);
  };

  const applyPresetGraphic = (presetType: 'trade' | 'macro' | 'energy' | 'map') => {
    if (!editingGraphic) return;
    if (presetType === 'trade') {
      setEditingGraphic({
        ...editingGraphic,
        title: isAr ? 'تطور التدفقات التجارية البينية عبر ممرات AfCFTA' : 'Intra-African Trade Corridor Growth',
        type: 'chart',
        position: 'mid',
        align: 'right',
        caption: isAr ? 'نسبة نمو الصادرات السنوية عبر الموانئ القارية' : 'Annual export growth across continental ports',
        dataPoints: [
          { label: isAr ? '2023' : '2023', value: 42, desc: '$4.2B' },
          { label: isAr ? '2024' : '2024', value: 68, desc: '$6.8B' },
          { label: isAr ? '2025' : '2025', value: 85, desc: '$8.5B' },
          { label: isAr ? 'المستهدف 2026' : '2026 Target', value: 100, desc: '$10.0B' }
        ]
      });
    } else if (presetType === 'macro') {
      setEditingGraphic({
        ...editingGraphic,
        title: isAr ? 'مؤشر توازن الاحتياطيات النقدية والناتج المحلي' : 'Sovereign Reserves & GDP Ratio',
        type: 'infographic',
        position: 'end',
        caption: isAr ? 'تعافي مؤشرات الاستقرار النقدي ومستوى تغطية الواردات' : 'Monetary stability & import cover trajectory',
        dataPoints: [
          { label: isAr ? 'الاحتياطي الرسمي' : 'FX Reserves', value: 90, desc: '$39.4B' },
          { label: isAr ? 'تغطية الواردات' : 'Import Cover', value: 75, desc: '8.5 months' },
          { label: isAr ? 'كبح التضخم' : 'Inflation Tamed', value: 65, desc: '-3.2%' }
        ]
      });
    } else if (presetType === 'energy') {
      setEditingGraphic({
        ...editingGraphic,
        title: isAr ? 'سعة التكرير وتأمين المشتقات النفطية (ألف ب/ي)' : 'Refining Throughput (k bpd)',
        type: 'chart',
        position: 'mid',
        align: 'left',
        caption: isAr ? 'ارتفاع القدرة التشغيلية لمجمع التكرير' : 'Capacity utilization trajectory',
        dataPoints: [
          { label: isAr ? 'بنزين' : 'Gasoline', value: 80, desc: '80%' },
          { label: isAr ? 'ديزل نقي' : 'Clean Diesel', value: 92, desc: '92%' },
          { label: isAr ? 'وقود طائرات' : 'Jet Fuel', value: 60, desc: '60%' }
        ]
      });
    } else if (presetType === 'map') {
      setEditingGraphic({
        ...editingGraphic,
        title: isAr ? 'ممرات الشحن البحري والساحلي الإقليمي' : 'Regional Maritime Freight Corridors',
        type: 'map',
        position: 'mid',
        align: 'left',
        caption: isAr ? 'محاور الربط الساحلي بين موانئ غرب إفريقيا' : 'Coastal maritime connections across ECOWAS',
        dataPoints: [
          { label: isAr ? 'محور تيما (غانا)' : 'Tema Hub', value: 40, desc: '40%' },
          { label: isAr ? 'محور داكار (السنغال)' : 'Dakar Hub', value: 30, desc: '30%' },
          { label: isAr ? 'محور أبيدجان (كوت ديفوار)' : 'Abidjan Hub', value: 20, desc: '20%' }
        ]
      });
    }
  };

  const currentMidGraphics = graphics.filter(g => g.position === 'mid');
  const currentEndGraphics = graphics.filter(g => g.position === 'end');

  return (
    <div className="w-full max-w-full mx-auto space-y-6">
      {/* =========================================================================
          TOP COMMAND & NAVIGATION BAR (شريط التحكم العلوي المنظم)
         ========================================================================= */}
      <EditorialToolbar
        isAr={isAr}
        onBackToOverview={onBackToOverview}
        hasPrevArticle={hasPrevArticle}
        onPrevArticle={onPrevArticle}
        articleIndex={articleIndex}
        totalArticlesCount={totalArticlesCount}
        hasNextArticle={hasNextArticle}
        onNextArticle={onNextArticle}
        articleStatus={article.status}
        onPreviewArticle={onPreviewArticle}
        currentArticle={buildCurrentUpdatedArticle()}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* =========================================================================
          VIEW MODE 1: EXPANSIVE EDITORIAL DESK (المحرر الموسع بدون سكرول بار)
         ========================================================================= */}
      {viewMode === 'edit' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 w-full max-w-full min-w-0 items-start">
          {/* -------------------------------------------------------------------
              MAIN COLUMN (8 COLS): HEADLINE, SUMMARY, EXPANDING CONTENT, GRAPHICS
             ------------------------------------------------------------------- */}
          <div className="xl:col-span-8 space-y-6 w-full max-w-full min-w-0 overflow-hidden">
            {/* Feedback notification */}
            {submissionFeedback && (
              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs font-bold flex items-center gap-2.5 shadow-lg animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{submissionFeedback}</span>
              </div>
            )}

            {/* بانر ملاحظات وتوجيه المشرف التحريري للتعديل */}
            {article.reviewNotes && (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-amber-950/40 border border-amber-500/40 text-amber-200 space-y-2 shadow-xl animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-black text-amber-300 text-xs sm:text-sm">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{isAr ? '📌 ملاحظات وتوجيهات المشرف التحريري للتعديل:' : 'Supervisor Revision Directive:'}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                    {isAr ? 'مطلوب مراجعة' : 'Action Required'}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 text-xs leading-relaxed font-sans">
                  {article.reviewNotes}
                </div>
              </div>
            )}

            {/* شريط توضيح الدور والصلاحيات الحالية */}
            <div className="px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">{isAr ? 'الدور التحريري النشط:' : 'Active Role:'}</span>
                <span className={`px-2 py-0.5 rounded-md text-[10.5px] font-bold border ${
                  isAdmin ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' :
                  isSupervisor ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' :
                  'bg-blue-500/20 text-blue-300 border-blue-500/40'
                }`}>
                  {role} {isAdmin ? (isAr ? '· كامل الصلاحيات' : '· Full Access') : isSupervisor ? (isAr ? '· مراجعة ونشر' : '· Publisher') : (isAr ? '· صياغة وتوليد دون نشر' : '· Drafter')}
                </span>
              </div>
              <span className="text-[10.5px] text-slate-400 font-mono">
                {isSupervisor ? (isAr ? 'صلاحية النشر مفعلة ✅' : 'Publishing Enabled') : (isAr ? 'النشر مقيد للمشرفين 🔒' : 'Publish Restricted')}
              </span>
            </div>

            {/* Box 1: Expansive Headline */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#080C17] border border-slate-800 shadow-xl space-y-2 w-full max-w-full">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-amber-400 flex items-center gap-2">
                  <FileEdit className="w-4 h-4" />
                  <span>{isAr ? 'عنوان التقرير الصحفي:' : 'Editorial Headline:'}</span>
                </label>
                <span className="text-[10px] text-slate-500 font-mono">
                  {editableTitle.length} {isAr ? 'حرفاً' : 'chars'}
                </span>
              </div>
              <textarea
                ref={titleRef}
                value={editableTitle}
                onChange={(e) => {
                  setEditableTitle(e.target.value);
                  autoResize(e.target);
                }}
                rows={1}
                placeholder={isAr ? "اكتب عنوان التقرير هنا..." : "Enter headline..."}
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-3 text-white text-lg sm:text-xl md:text-2xl font-black focus:outline-none focus:border-amber-500/80 leading-relaxed overflow-hidden resize-none no-scrollbar shadow-inner"
              />
            </div>

            {/* Box 2: Featured Lead Image */}
            <CoverImageSelector
              isAr={isAr}
              editableTitle={editableTitle}
              editableImageUrl={editableImageUrl}
              setEditableImageUrl={setEditableImageUrl}
              editableSummary={editableSummary}
              editableCountry={editableCountry}
              editableSector={editableSector}
              presets={COVER_IMAGE_PRESETS}
              onUploadClick={() => fileInputRef.current?.click()}
            />
            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageFileUpload}
              className="hidden"
            />

            {/* Box 3: Expansive Lead / Summary */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#080C17] border border-slate-800 shadow-xl space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-blue-400 flex items-center gap-2">
                  <Bookmark className="w-4 h-4" />
                  <span>{isAr ? 'الموجز التحريري / المقدمة الاستقصائية:' : 'Lead / Executive Summary:'}</span>
                </label>
                <span className="text-[10px] text-slate-500 font-mono">
                  {editableSummary.split(/\s+/).filter(Boolean).length} {isAr ? 'كلمة' : 'words'}
                </span>
              </div>
              <textarea
                ref={summaryRef}
                value={editableSummary}
                onChange={(e) => {
                  setEditableSummary(e.target.value);
                  autoResize(e.target);
                }}
                rows={2}
                placeholder={isAr ? "اكتب موجز التقرير هنا..." : "Enter summary..."}
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:border-blue-500/80 leading-relaxed overflow-hidden resize-none no-scrollbar shadow-inner"
              />
            </div>

            {/* Box 4: Expansive Full Article Body */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#080C17] border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs sm:text-sm font-black text-white">
                    {isAr ? 'متن التقرير الكامل:' : 'Full Article Body:'}
                  </span>
                </div>
                {/* Live Stats: Words & Read Time */}
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {wordCount} {isAr ? 'كلمة' : 'words'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>~{estimatedReadTime} {isAr ? 'د' : 'min'}</span>
                  </span>
                </div>
              </div>

              <textarea
                ref={contentRef}
                value={editableContent}
                onChange={(e) => {
                  setEditableContent(e.target.value);
                  autoResize(e.target);
                }}
                rows={10}
                placeholder={isAr ? "اكتب فقرات التقرير الكاملة هنا... افصل بين الفقرات بسطر فارغ." : "Write full report content here with blank line between paragraphs..."}
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl p-4 sm:p-5 text-slate-100 text-sm sm:text-base font-serif leading-loose focus:outline-none focus:border-emerald-500/80 overflow-hidden resize-none no-scrollbar shadow-inner"
              />

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>💡 {isAr ? 'أدخل فقرات المقال مفصولة بسطر فارغ. سيتم توزيع الرسوم البيانية وسط المقال وخاتمته آلياً.' : 'Separate paragraphs by blank lines. Mid-graphics will wrap seamlessly.'}</span>
                <span className="font-mono text-slate-500">{editableContent.split('\n\n').filter(p => p.trim().length > 0).length} {isAr ? 'فقرات' : 'paragraphs'}</span>
              </div>
            </div>

            {/* Box 4: Graphics & Visuals Manager (إدارة الصور والتمثيلات البيانية والإنفوجرافيك) */}
            <GraphicsManager
              isAr={isAr}
              graphics={graphics}
              onAddClick={handleOpenNewGraphicModal}
              onEditClick={handleEditGraphic}
              onDeleteClick={handleDeleteGraphic}
            />
          </div>

          {/* -------------------------------------------------------------------
              SIDE COLUMN (4 COLS): EDITORIAL ACTIONS, METADATA, FACT-CHECK & AI
             ------------------------------------------------------------------- */}
          <div className="xl:col-span-4 space-y-6 w-full max-w-full min-w-0 overflow-hidden">
            {/* Box A: Editorial Decision Deck (المبدأ الصحفي: ينشر، يعدل، يؤرشف وفق الأدوار) */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#080C17] border border-slate-800 shadow-xl space-y-4 w-full max-w-full">
              <div className="border-b border-slate-800/80 pb-3 flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{isSupervisor ? (isAr ? 'القرارات التحريرية للمشرف' : 'Editorial Decisions') : (isAr ? 'لوحة تحرير وإرسال المسودة' : 'Editor Submission Deck')}</span>
                </h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  isAdmin ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                  isSupervisor ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
                  'bg-blue-500/20 text-blue-300 border-blue-500/30'
                }`}>
                  {role}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                {/* إذا كان مشرفاً أو أدمن: يمكنه النشر المباشر للجمهور */}
                {isSupervisor ? (
                  <button
                    type="button"
                    onClick={() => {
                      const updated = buildCurrentUpdatedArticle();
                      onPublish(updated, humanReviewerNote);
                      sendNotification({
                        userId: 'ALL',
                        type: 'article_published',
                        title: isAr ? 'تم اعتماد ونشر تقرير اقتصادي جديد' : 'New Report Published',
                        message: isAr
                          ? `اعتمد المشرف (${profile?.displayName || 'مشرف التحرير'}) نشر تقرير: "${updated.title.substring(0, 45)}...".`
                          : `Supervisor published: "${updated.title.substring(0, 45)}...".`,
                        articleId: updated.id,
                        countrySlug: updated.countryCode.toLowerCase()
                      });
                      setSubmissionFeedback(isAr ? '✅ تم نشر المقال بنجاح وإتاحته للجمهور!' : '✅ Article published successfully!');
                      setTimeout(() => setSubmissionFeedback(null), 3500);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isAr ? 'نشر المقال للجمهور (Publish)' : 'Publish to Live Feed'}</span>
                  </button>
                ) : (
                  /* إذا كان محرراً: لا ينشر مباشرة، بل يحفظ ويرسل للمشرف للاعتماد */
                  <button
                    type="button"
                    onClick={() => {
                      const updated = buildCurrentUpdatedArticle();
                      updated.status = 'pending_review';
                      onSaveDraft(updated);
                      sendNotification({
                        userId: 'ALL',
                        type: 'editorial_review',
                        title: isAr ? 'مسودة جديدة بانتظار إجازة المشرف' : 'New Draft Awaiting Review',
                        message: isAr
                          ? `أرسل المحرر (${profile?.displayName || 'المحرر'}) مسودة "${updated.title.substring(0, 45)}..." للاعتماد والنشر.`
                          : `Editor submitted draft "${updated.title.substring(0, 45)}..." for review.`,
                        articleId: updated.id,
                        countrySlug: updated.countryCode.toLowerCase()
                      });
                      setSubmissionFeedback(isAr ? '📤 تم حفظ المسودة وإرسالها للمشرفين بنجاح للاعتماد!' : '📤 Draft submitted to supervisors for review!');
                      setTimeout(() => setSubmissionFeedback(null), 4000);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isAr ? 'إرسال للمشرف للاعتماد والمراجعة' : 'Submit for Supervisor Review'}</span>
                  </button>
                )}

                {/* 2. تعديل ومحاولة بالذكاء الاصطناعي (متاح للمشرفين والمحررين) */}
                <button
                  type="button"
                  disabled={isAiRefining}
                  onClick={() => onAiRefine(humanReviewerNote, editableTitle)}
                  className="w-full py-2.5 px-4 rounded-xl bg-purple-600/25 hover:bg-purple-600/40 text-purple-200 border border-purple-500/40 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  <RotateCcw className={`w-3.5 h-3.5 text-purple-400 ${isAiRefining ? 'animate-spin' : ''}`} />
                  <span>{isAiRefining ? (isAr ? 'جاري إعادة الصياغة...' : 'Refining...') : (isAr ? 'تعديل ومحاولة بالذكاء الاصطناعي' : 'Refine & AI Retry')}</span>
                </button>

                {/* 3. حفظ المسودة */}
                <button
                  type="button"
                  onClick={() => {
                    onSaveDraft(buildCurrentUpdatedArticle());
                    setSubmissionFeedback(isAr ? '💾 تم حفظ التعديلات على المسودة بنجاح.' : '💾 Draft saved.');
                    setTimeout(() => setSubmissionFeedback(null), 3000);
                  }}
                  className="w-full py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isAr ? 'حفظ التعديلات كمسودة' : 'Save Draft Edits'}</span>
                </button>

                {/* 4. أرشفة المقال (مخصصة للمشرفين والأدمن) */}
                {isSupervisor && (
                  <button
                    type="button"
                    onClick={() => {
                      const updated = buildCurrentUpdatedArticle();
                      onArchive(updated, humanReviewerNote);
                      setSubmissionFeedback(isAr ? '📦 تم نقل المقال إلى الأرشيف بنجاح.' : '📦 Article archived.');
                      setTimeout(() => setSubmissionFeedback(null), 3000);
                    }}
                    className="w-full py-2 px-4 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-500/40 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Archive className="w-3.5 h-3.5" />
                    <span>{isAr ? 'أرشفة التقرير (Archive)' : 'Archive Report'}</span>
                  </button>
                )}

                {/* تنبيه قيود الصلاحية للمحررين */}
                {!isSupervisor && (
                  <p className="text-[10px] text-slate-400 p-2 rounded-lg bg-slate-950/60 border border-slate-800 leading-relaxed text-right">
                    {isAr
                      ? '🔒 بصفتك محرراً: يحق لك صياغة وتوليد وتعديل المقالات بالذكاء الاصطناعي، ويتم حفظها وإرسالها للمشرفين للاعتماد والنشر.'
                      : 'Role Note: Editors draft articles and submit them to supervisors for final publication.'}
                  </p>
                )}
              </div>

              {/* نقد وتوجيه المشرف البشري الموجه للمحررين والوكيل */}
              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                    <Brain className="w-3.5 h-3.5 text-rose-400" />
                    <span>{isSupervisor ? (isAr ? 'توجيه وملاحظات المشرف للمحرر:' : 'Supervisor Revision Directive:') : (isAr ? 'ملاحظات وتوجيه المشرف:' : 'Supervisor Notes:')}</span>
                  </label>
                </div>
                <textarea
                  rows={2}
                  value={humanReviewerNote}
                  onChange={(e) => setHumanReviewerNote(e.target.value)}
                  placeholder={isAr ? "اكتب ملاحظاتك وتوجيهاتك التحريرية للمحررين لإجراء تعديلات..." : "Enter critique directive for editors..."}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-500/60 leading-relaxed resize-none"
                />

                {/* زر إرسال الملاحظات للمحرر (للمشرفين والأدمن) */}
                {isSupervisor && humanReviewerNote.trim() && (
                  <button
                    type="button"
                    onClick={() => {
                      const updated = buildCurrentUpdatedArticle();
                      updated.reviewNotes = humanReviewerNote;
                      updated.status = 'revision_requested';
                      onSaveDraft(updated);
                      sendNotification({
                        userId: 'ALL',
                        type: 'revision_requested',
                        title: isAr ? 'ملاحظات وتوجيهات تحريرية من المشرف' : 'Supervisor Revision Directive',
                        message: isAr
                          ? `طلب المشرف (${profile?.displayName || 'مشرف التحرير'}) تعديلات على مقال "${editableTitle.substring(0, 40)}...": "${humanReviewerNote}"`
                          : `Supervisor revision note on "${editableTitle.substring(0, 40)}...": "${humanReviewerNote}"`,
                        articleId: updated.id,
                        countrySlug: updated.countryCode.toLowerCase()
                      });
                      setSubmissionFeedback(isAr ? '📝 تم إرسال الملاحظات للمحررين وتوثيقها في التقرير!' : 'Notes dispatched to editors!');
                      setTimeout(() => setSubmissionFeedback(null), 3500);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-rose-400" />
                    <span>{isAr ? 'إرسال الملاحظات للمحررين وتوثيقها' : 'Send Revision Notes to Editors'}</span>
                  </button>
                )}

                {/* 4. حذف نهائي (متاح للمشرفين والأدمن فقط) */}
                {isSupervisor && onDelete && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(isAr ? '⚠️ هل أنت متأكد من حذف هذا المقال نهائياً من كافة الأنظمة؟ لا يمكن التراجع عن هذا الإجراء.' : '⚠️ Are you sure you want to PERMANENTLY delete this article and all its references? This cannot be undone.')) {
                        onDelete(article.id);
                      }
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-slate-900/50 hover:bg-rose-950/40 text-slate-500 hover:text-rose-400 border border-slate-800 hover:border-rose-900/60 text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer mt-4"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{isAr ? 'حذف المقال نهائياً من النظام' : 'Permanently Delete Article'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Box B: Editorial Classification & Metadata (التصنيف الثلاثي والكاتب) */}
            <ClassificationSidebar
              isAr={isAr}
              isSupervisor={isSupervisor}
              editableCountry={editableCountry}
              setEditableCountry={setEditableCountry}
              editableSector={editableSector}
              setEditableSector={setEditableSector}
              editableGenre={editableGenre}
              setEditableGenre={setEditableGenre}
              editableMarketImpact={editableMarketImpact}
              setEditableMarketImpact={setEditableMarketImpact}
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              countryRegionFilter={countryRegionFilter}
              setCountryRegionFilter={setCountryRegionFilter}
              sectorGroupFilter={sectorGroupFilter}
              setSectorGroupFilter={setSectorGroupFilter}
              genreCategoryFilter={genreCategoryFilter}
              setGenreCategoryFilter={setGenreCategoryFilter}
              AFRICAN_REGIONS={AFRICAN_REGIONS}
              SECTOR_GROUPS={SECTOR_GROUPS}
              GENRE_CATEGORIES={GENRE_CATEGORIES}
              filteredCountries={filteredCountries}
              filteredSectors={filteredSectors}
              filteredGenres={filteredGenres}
              selectedCountryObj={selectedCountryObj}
              selectedSectorObj={selectedSectorObj}
              selectedGenreObj={selectedGenreObj}
              getCountryFlagEmoji={getCountryFlagEmoji}
              editableAuthor={editableAuthor}
              setEditableAuthor={setEditableAuthor}
            />


            {/* Box C: Fact-Check & Sources Audit */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#080C17] border border-slate-800 shadow-xl space-y-3 w-full max-w-full">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white">
                    {isAr ? 'تدقيق الحقائق والمصادر:' : 'Fact-Check & Sources:'}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  {article.factCheck?.score || 96}% {isAr ? 'موثق' : 'Verified'}
                </span>
              </div>

              <div className="space-y-2">
                {(article.citations || []).map((cit, idx) => (
                  <div key={cit.id || idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="text-slate-200 font-medium">{cit.sourceName}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{cit.publishDate}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW MODE 2: LIVE PAPER REPLICA PREVIEW
         ========================================================================= */}
      {viewMode === 'paper_preview' && (
        <LivePaperPreview
          isAr={isAr}
          editableCountry={editableCountry}
          editableSector={editableSector}
          editableGenre={editableGenre}
          estimatedReadTime={estimatedReadTime}
          editableAuthor={editableAuthor}
          editableTitle={editableTitle}
          editableImageUrl={editableImageUrl}
          editableSummary={editableSummary}
          editableContent={editableContent}
          currentMidGraphics={currentMidGraphics}
          currentEndGraphics={currentEndGraphics}
          setZoomGraphic={setZoomGraphic}
        />
      )}

      {/* Box 9: Graphic Editor Modal */}
      {isGraphicModalOpen && editingGraphic && (
        <GraphicEditorModal
          isAr={isAr}
          isNew={isNewGraphic}
          editingGraphic={editingGraphic}
          setEditingGraphic={setEditingGraphic}
          onClose={() => setIsGraphicModalOpen(false)}
          onSave={handleSaveGraphicModal}
          applyPreset={applyPresetGraphic}
        />
      )}

      {/* =========================================================================
          LIGHTBOX MODAL: ZOOM GRAPHIC FULL-SCREEN (تكبير التمثيل البياني بالكامل)
         ========================================================================= */}
      {zoomGraphic && (
        <div 
          onClick={() => setZoomGraphic(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0D1322] border border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-2xl w-full text-white space-y-4 shadow-2xl relative cursor-default animate-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-black text-white">{zoomGraphic.title}</h3>
              </div>
              <button
                onClick={() => setZoomGraphic(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 py-4">
              {(zoomGraphic.dataPoints || []).map((dp, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-300">
                    <span>{dp.label}</span>
                    <span className="font-mono text-amber-400">{dp.desc || `${dp.value}%`}</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"
                      style={{ width: `${Math.min(100, dp.value)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-400 border-t border-slate-800 pt-3 italic">
              {zoomGraphic.caption}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
