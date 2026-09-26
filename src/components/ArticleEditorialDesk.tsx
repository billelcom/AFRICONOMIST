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
  Briefcase
} from 'lucide-react';
import { ALL_54_AFRICAN_COUNTRIES } from '../data/africanCountries';
import { JOURNALISTIC_GENRES, ECONOMIC_SECTORS } from '../data/reportOptions';

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
  { id: 'all', labelAr: 'الكل (54 دولة)', labelEn: 'All (54)' },
  { id: 'north', labelAr: 'شمال أفريقيا', labelEn: 'North', codes: ['EG', 'DZ', 'MA', 'TN', 'LY', 'SD', 'MR'] },
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
  onAiRefine,
  isAiRefining,
  onPreviewArticle,
  lang
}) => {
  const isAr = lang === 'ar';

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

  const classificationBoxRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (classificationBoxRef.current && !classificationBoxRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

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
      <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0A0F1D] to-slate-900 border border-slate-800 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-3 w-full max-w-full">
        {/* Navigation Group */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2.5 sm:gap-3 w-full lg:w-auto">
          {/* Top Row on Mobile: غرفة الأخبار على اليمين والسابق/التالي في الأعلى مقابلها على اليسار */}
          <div className="flex items-center justify-between w-full sm:w-auto gap-2">
            {/* 1. زر غرفة الأخبار والأقسام */}
            <button
              onClick={onBackToOverview}
              className="px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold cursor-pointer border border-slate-700 hover:border-slate-600 shadow-sm shrink-0"
            >
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 rtl:rotate-0 ltr:rotate-180 text-amber-400" />
              <span>{isAr ? 'غرفة الأخبار والأقسام' : 'Newsroom Desks'}</span>
            </button>

            {/* 2. السابق والتالي (أقل عرضاً وموجودة في الأعلى مقابل غرفة الأخبار على اليسار) */}
            <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-950 p-1 sm:p-1.5 rounded-xl border border-slate-800 shadow-inner shrink-0">
              <button
                type="button"
                disabled={!hasPrevArticle}
                onClick={onPrevArticle}
                className={`px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold flex items-center gap-1 transition-colors ${
                  hasPrevArticle 
                    ? 'text-slate-200 hover:bg-slate-800 hover:text-amber-400 cursor-pointer' 
                    : 'text-slate-600 cursor-not-allowed'
                }`}
              >
                <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 rtl:rotate-0 ltr:rotate-180" />
                <span>{isAr ? 'السابق' : 'Prev'}</span>
              </button>

              <span className="font-mono text-[11px] sm:text-xs font-bold text-amber-400 px-1.5 sm:px-2">
                {articleIndex + 1} / {totalArticlesCount}
              </span>

              <button
                type="button"
                disabled={!hasNextArticle}
                onClick={onNextArticle}
                className={`px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold flex items-center gap-1 transition-colors ${
                  hasNextArticle 
                    ? 'text-slate-200 hover:bg-slate-800 hover:text-amber-400 cursor-pointer' 
                    : 'text-slate-600 cursor-not-allowed'
                }`}
              >
                <span>{isAr ? 'التالي' : 'Next'}</span>
                <ArrowLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5 rtl:rotate-0 ltr:rotate-180" />
              </button>
            </div>
          </div>

          <div className="h-5 w-px bg-slate-800 hidden sm:block mx-0.5" />

          {/* Row 2 on Mobile / Inline on Desktop: Status Badge + Open Article View */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {/* 3. Status Badge (معتمد ومنشور) */}
            <span className={`text-[11px] sm:text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl font-bold font-mono border flex items-center gap-1.5 ${
              article.status === 'published'
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                : article.status === 'rejected'
                ? 'bg-slate-800 text-slate-300 border-slate-700'
                : 'bg-rose-500/15 text-rose-300 border-rose-500/30 animate-pulse'
            }`}>
              {article.status === 'published' ? (isAr ? '✅ معتمد ومنشور' : 'Published') :
               article.status === 'rejected' ? (isAr ? '📦 في الأرشيف' : 'Archived') :
               (isAr ? '⏳ قيد المراجعة البشرية' : 'Pending Review')}
            </span>

            {/* 4. فتح صفحة المقالات المستقلة - أمام يعني جنب معتمد ومنشور مباشرة */}
            {onPreviewArticle && (
              <button
                type="button"
                onClick={() => onPreviewArticle(buildCurrentUpdatedArticle())}
                className="px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-xl bg-gradient-to-r from-amber-500/15 to-amber-600/20 hover:from-amber-500/25 hover:to-amber-600/30 text-amber-300 border border-amber-500/40 text-[11px] sm:text-xs font-bold flex items-center gap-1.5 sm:gap-2 shadow-sm transition-all cursor-pointer hover:text-white"
              >
                <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
                <span>{isAr ? 'فتح صفحة المقال المستقلة' : 'Open in Article View'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Right: View Mode Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 shadow-inner">
            <button
              type="button"
              onClick={() => setViewMode('edit')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'edit'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileEdit className="w-3.5 h-3.5" />
              <span>{isAr ? 'المحرر الموسع' : 'Expansive Editor'}</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('paper_preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'paper_preview'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{isAr ? 'المعاينة الورقية الحية' : 'Live Paper Preview'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          VIEW MODE 1: EXPANSIVE EDITORIAL DESK (المحرر الموسع بدون سكرول بار)
         ========================================================================= */}
      {viewMode === 'edit' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 w-full max-w-full items-start">
          {/* -------------------------------------------------------------------
              MAIN COLUMN (8 COLS): HEADLINE, SUMMARY, EXPANDING CONTENT, GRAPHICS
             ------------------------------------------------------------------- */}
          <div className="xl:col-span-8 space-y-6 w-full max-w-full">
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
            <div className="p-5 sm:p-6 rounded-2xl bg-[#080C17] border border-slate-800 shadow-xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                      <span>{isAr ? 'صورة المقال الرئيسية' : 'Lead Article Image'}</span>
                    </h3>
                    <p className="text-[10.5px] text-slate-400 mt-0.5">
                      {isAr 
                        ? 'تظهر هذه الصورة في صدارة التقرير وبطاقات العرض المعتمدة.' 
                        : 'This image appears at the forefront of the verified editorial report.'}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {editableImageUrl ? (isAr ? 'صورة معتمدة' : 'Custom Image Set') : (isAr ? 'صورة افتراضية' : 'Default Placeholder')}
                </span>
              </div>

              {/* Main Image Grid: Live Homepage Card Preview + Upload / Presets Deck */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* Column A (5 cols): Live Exact Homepage Card Preview */}
                <div className="lg:col-span-5 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-bold flex items-center gap-1 text-amber-400">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{isAr ? 'المعاينة الحية في بطاقة الصفحة الرئيسية:' : 'Live Homepage Card Preview:'}</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">1:1 Square</span>
                  </div>

                  {/* The Simulated Card (Matches CreativeReportCard on HomeView) */}
                  <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-br from-[#0d1424] via-[#0a0f1c] to-[#070b14] border border-amber-500/30 shadow-lg relative overflow-hidden group">
                    {/* Top strip */}
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2 font-medium">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-slate-200 font-bold truncate">{editableCountry}</span>
                        <span className="text-slate-600">·</span>
                        <span className="text-amber-400/90 truncate font-sans">{editableSector}</span>
                      </div>
                      <div className="flex items-center gap-1 font-mono text-[9px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                        <ShieldCheck className="w-2.5 h-2.5" />
                        <span>97% {isAr ? 'دقة' : ''}</span>
                      </div>
                    </div>

                    {/* Headline + Small Square Image Box Side-by-Side */}
                    <div className="flex items-start justify-between gap-2.5 mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm sm:text-base font-bold text-white line-clamp-2 leading-snug">
                          {editableTitle || (isAr ? 'عنوان التقرير الصحفي...' : 'Article Headline...')}
                        </h4>
                        <div className="flex items-center gap-1 text-[9px] font-mono text-slate-400 mt-1">
                          <Clock className="w-2.5 h-2.5 text-slate-500" />
                          <span>{isAr ? 'اليوم · 16:30' : 'Today · 16:30'}</span>
                        </div>
                      </div>

                      {/* The Square Image Box */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border border-amber-500/40 shadow-md relative bg-slate-900 group-hover:scale-105 transition-transform duration-300">
                        <img
                          src={editableImageUrl || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=300&q=80'}
                          alt="Cover preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=200&q=80';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"></div>
                      </div>
                    </div>

                    {/* Divider line */}
                    <div className="my-2 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent"></div>

                    {/* Summary text */}
                    <p className="text-[11px] text-slate-300/85 line-clamp-2 leading-relaxed">
                      {editableSummary || (isAr ? 'الموجز التحريري المعروض أسفل الفاصل مباشرة بالصفحة الرئيسية...' : 'Summary text appearing below divider on frontpage...')}
                    </p>
                  </div>
                </div>

                {/* Column B (7 cols): URL input, Device Upload, and Curated Presets */}
                <div className="lg:col-span-7 space-y-3.5">
                  {/* Option 1: Direct Image URL */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <LinkIcon className="w-3.5 h-3.5 text-amber-400" />
                        <span>{isAr ? 'رابط الصورة المباشر (URL):' : 'Direct Image URL:'}</span>
                      </span>
                      {editableImageUrl && (
                        <button
                          type="button"
                          onClick={() => setEditableImageUrl('')}
                          className="text-[10px] text-rose-400 hover:text-rose-300 hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>{isAr ? 'إزالة / إعادة ضبط' : 'Clear'}</span>
                        </button>
                      )}
                    </label>

                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={editableImageUrl}
                          onChange={(e) => setEditableImageUrl(e.target.value)}
                          placeholder={isAr ? "الصق رابط صورة المقال هنا (https://...)" : "Paste image URL here (https://...)"}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 font-mono"
                        />
                        {editableImageUrl && (
                          <button
                            type="button"
                            onClick={() => setEditableImageUrl('')}
                            className="absolute ltr:right-2 rtl:left-2 top-2 text-slate-500 hover:text-white"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Device File Upload Button */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                        title={isAr ? 'رفع صورة من ملفات جهازك' : 'Upload from device'}
                      >
                        <Upload className="w-3.5 h-3.5 text-amber-400" />
                        <span>{isAr ? 'رفع من الجهاز' : 'Upload File'}</span>
                      </button>

                      {/* Hidden File Input */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Option 2: Curated African Economic Photography Presets */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isAr ? 'نماذج صور صحفية واقتصادية جاهزة عالية الدقة:' : 'High-Resolution Pan-African Photo Presets:'}</span>
                    </span>

                    <div className="flex flex-wrap gap-1.5">
                      {COVER_IMAGE_PRESETS.map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => setEditableImageUrl(preset.url)}
                          className={`px-2.5 py-1.5 rounded-lg text-[10.5px] font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                            editableImageUrl === preset.url
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                              : 'bg-slate-950/80 hover:bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <span>{isAr ? preset.nameAr : preset.nameEn}</span>
                          {editableImageUrl === preset.url && (
                            <Check className="w-3 h-3 text-amber-400" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

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
            <div className="p-5 sm:p-6 rounded-2xl bg-[#080C17] border border-slate-800 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-black text-white">
                      {isAr ? 'إدارة الرسوم البيانية والخرائط والإنفوجرافيك للمقال' : 'Article Visuals & Infographics Deck'}
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {isAr 
                      ? 'قاعدة العرض: الصور في وسط المقال تأخذ 50% مع التواء النص، وفي نهاية المقال تأخذ 100% كامل العرض.' 
                      : 'Display rules: Mid-article graphics take 50% with text wrapping; End graphic takes 100% full width.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleOpenNewGraphicModal}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer active:scale-95 transition-all self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAr ? 'إضافة تمثيل بياني جديد' : 'Add New Graphic'}</span>
                </button>
              </div>

              {/* Graphics List */}
              {graphics.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-slate-950 border border-dashed border-slate-800 space-y-2">
                  <ImageIcon className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400">{isAr ? 'لا توجد رسوم بيانية مرفقة بالمقال حالياً.' : 'No graphics attached to this report yet.'}</p>
                  <button
                    type="button"
                    onClick={handleOpenNewGraphicModal}
                    className="text-xs text-amber-400 hover:underline font-bold"
                  >
                    {isAr ? '+ أضف أول تمثيل بياني أو خريطة' : '+ Add first graphic or map'}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {graphics.map((g, idx) => (
                    <div
                      key={g.id || idx}
                      className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 space-y-3 transition-all relative group"
                    >
                      {/* Top Bar of Graphic Card */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`p-1.5 rounded-lg text-xs ${
                            g.type === 'chart' ? 'bg-amber-500/10 text-amber-400' :
                            g.type === 'map' ? 'bg-blue-500/10 text-blue-400' :
                            'bg-emerald-500/10 text-emerald-400'
                          }`}>
                            {g.type === 'chart' && <BarChart3 className="w-4 h-4" />}
                            {g.type === 'map' && <Globe2 className="w-4 h-4" />}
                            {g.type === 'infographic' && <TrendingUp className="w-4 h-4" />}
                          </span>
                          <span className="text-[11px] font-bold text-white">
                            {g.type === 'chart' ? (isAr ? 'رسم بياني' : 'Chart') :
                             g.type === 'map' ? (isAr ? 'خريطة تفاعلية' : 'Map') :
                             (isAr ? 'إنفوجرافيك' : 'Infographic')}
                          </span>
                        </div>

                        {/* Position Badge: Mid 50% vs End 100% */}
                        <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-md border ${
                          g.position === 'mid' 
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' 
                            : 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                        }`}>
                          {g.position === 'mid' 
                            ? (isAr ? `وسط المقال (50% ${g.align === 'left' ? 'يسار' : 'يمين'})` : `Mid-Article (50% ${g.align || 'right'})`) 
                            : (isAr ? 'خاتمة المقال (100% كامل العرض)' : 'End-Article (100% Full Width)')}
                        </span>
                      </div>

                      {/* Graphic Title & Caption */}
                      <div>
                        <h4 className="text-xs font-bold text-white line-clamp-1">{g.title}</h4>
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{g.caption}</p>
                      </div>

                      {/* Data Points Count */}
                      <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-900 pt-2 font-mono">
                        <span>{g.dataPoints?.length || 0} {isAr ? 'نقاط بيانات' : 'data points'}</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleEditGraphic(g)}
                            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold cursor-pointer"
                          >
                            {isAr ? 'تعديل' : 'Edit'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteGraphic(g.id)}
                            className="p-1 rounded bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 cursor-pointer"
                            title={isAr ? 'حذف' : 'Delete'}
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* -------------------------------------------------------------------
              SIDE COLUMN (4 COLS): EDITORIAL ACTIONS, METADATA, FACT-CHECK & AI
             ------------------------------------------------------------------- */}
          <div className="xl:col-span-4 space-y-6 w-full max-w-full">
            {/* Box A: Editorial Decision Deck (المبدأ الصحفي: ينشر، يعدل، يؤرشف) */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#080C17] border border-slate-800 shadow-xl space-y-4 w-full max-w-full">
              <div className="border-b border-slate-800/80 pb-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{isAr ? 'القرارات التحريرية للمشرف' : 'Editorial Decisions'}</span>
                </h3>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                {/* 1. نشر المقال للجمهور */}
                <button
                  type="button"
                  onClick={() => onPublish(buildCurrentUpdatedArticle(), humanReviewerNote)}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isAr ? 'نشر المقال للجمهور (Publish)' : 'Publish to Live Feed'}</span>
                </button>

                {/* 2. تعديل ومحاولة بالذكاء الاصطناعي */}
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
                  onClick={() => onSaveDraft(buildCurrentUpdatedArticle())}
                  className="w-full py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isAr ? 'حفظ التعديلات كمسودة' : 'Save Draft Edits'}</span>
                </button>

                {/* 4. أرشفة المقال */}
                <button
                  type="button"
                  onClick={() => onArchive(buildCurrentUpdatedArticle(), humanReviewerNote)}
                  className="w-full py-2 px-4 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-500/40 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Archive className="w-3.5 h-3.5" />
                  <span>{isAr ? 'أرشفة التقرير (Archive)' : 'Archive Report'}</span>
                </button>
              </div>

              {/* نقد المشرف البشري الموجه للوكيل */}
              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                <label className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5 text-rose-400" />
                  <span>{isAr ? 'ملاحظات ونقد المشرف البشري:' : 'Supervisor Critique Directive:'}</span>
                </label>
                <textarea
                  rows={2}
                  value={humanReviewerNote}
                  onChange={(e) => setHumanReviewerNote(e.target.value)}
                  placeholder={isAr ? "اكتب توجيهك النقدي للذكاء الاصطناعي (مثال: تعميق سياق السياسة النقدية والتدفقات)..." : "Enter critique for AI prompt rewrite..."}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-500/60 leading-relaxed resize-none"
                />
              </div>
            </div>

            {/* Box B: Editorial Classification & Metadata (التصنيف الثلاثي والكاتب) */}
            <div ref={classificationBoxRef} className="p-5 sm:p-6 rounded-2xl bg-[#080C17] border border-slate-800 shadow-xl space-y-4 w-full max-w-full">
              <div className="border-b border-slate-800/80 pb-3 flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>{isAr ? 'بيانات التصنيف الثلاثي والكاتب' : 'Journalistic Classification & Author'}</span>
                </h3>
                <span className="text-[10px] text-amber-400/90 font-mono bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                  {isAr ? '3 قوائم منسدلة معتمدة' : '3 Standard Dropdowns'}
                </span>
              </div>

              <div className="space-y-4 text-xs">
                {/* 1. وسوم التصنيف الثلاثي للمقال (المعاينة المركبة الحية) */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/90 shadow-inner space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase font-mono flex items-center gap-1.5">
                      <Layers className="w-3 h-3 text-amber-400" />
                      <span>{isAr ? 'وسم التصنيف الثلاثي للمقال:' : 'Breadcrumb Classification:'}</span>
                    </span>
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                      {isAr ? 'تحديث لحظي' : 'Live Sync'}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
                    {/* Country Badge */}
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-amber-500/30 text-amber-300 font-bold shadow-sm">
                      <span className="text-sm">{selectedCountryObj ? getCountryFlagEmoji(selectedCountryObj.code) : '🌍'}</span>
                      <span>{editableCountry}</span>
                      {selectedCountryObj && (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-400">
                          {selectedCountryObj.code}
                        </span>
                      )}
                    </span>
                    <span className="text-slate-600 font-bold">/</span>
                    {/* Sector Badge */}
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-blue-500/30 text-blue-300 font-bold shadow-sm">
                      <TrendingUp className="w-3 h-3 text-blue-400" />
                      <span>{editableSector}</span>
                    </span>
                    <span className="text-slate-600 font-bold">/</span>
                    {/* Genre Badge */}
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-purple-500/30 text-purple-300 font-bold shadow-sm">
                      <FileText className="w-3 h-3 text-purple-400" />
                      <span>{editableGenre}</span>
                    </span>
                  </div>
                </div>

                {/* 2. القائمة المنسدلة 1: قائمة الدول الإفريقية */}
                <div className="space-y-1.5 relative z-30">
                  <div className="flex items-center justify-between">
                    <label className="text-slate-300 text-[11px] font-bold flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isAr ? 'قائمة الدول الإفريقية (54 دولة معتمدة):' : 'African Countries List (54 Sovereign States):'}</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {selectedCountryObj?.code || 'DZ'} · {selectedCountryObj?.capital || ''}
                    </span>
                  </div>

                  {/* Trigger Button - خلفية بيضاء وكتابة بالأسود */}
                  <button
                    type="button"
                    onClick={() => {
                      setOpenDropdown(openDropdown === 'country' ? null : 'country');
                      setCountryRegionFilter('all');
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-right transition-all flex items-center justify-between cursor-pointer shadow-sm ${
                      openDropdown === 'country'
                        ? 'bg-white border-amber-500 ring-2 ring-amber-500/20 text-slate-900'
                        : 'bg-white border-slate-300 hover:border-slate-400 text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-base leading-none">
                        {selectedCountryObj ? getCountryFlagEmoji(selectedCountryObj.code) : '🌍'}
                      </span>
                      <div className="truncate">
                        <span className="text-slate-900 font-bold text-xs">
                          {editableCountry}
                        </span>
                        {selectedCountryObj && (
                          <span className="text-slate-500 text-[11px] font-mono mx-1.5">
                            ({selectedCountryObj.nameEn})
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {selectedCountryObj && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-mono font-bold">
                          {selectedCountryObj.code}
                        </span>
                      )}
                      <ChevronDown
                        className={`w-4 h-4 text-slate-600 transition-transform duration-200 ${
                          openDropdown === 'country' ? 'rotate-180 text-amber-600' : ''
                        }`}
                      />
                    </div>
                  </button>

                  {/* Dropdown Menu - خلفية بيضاء وكتابة بالأسود بدون بحث كتابي */}
                  {openDropdown === 'country' && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white border border-slate-300 rounded-2xl shadow-2xl p-3 space-y-2.5 animate-in fade-in zoom-in-95 duration-150">
                      {/* Regional Quick Filter Pills */}
                      <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar text-[10px]">
                        {AFRICAN_REGIONS.map((reg) => (
                          <button
                            key={reg.id}
                            type="button"
                            onClick={() => setCountryRegionFilter(reg.id)}
                            className={`px-2.5 py-1 rounded-lg whitespace-nowrap border transition-colors cursor-pointer text-[10px] font-medium ${
                              countryRegionFilter === reg.id
                                ? 'bg-amber-600 text-white border-amber-700 font-bold shadow-sm'
                                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                            }`}
                          >
                            {isAr ? reg.labelAr : reg.labelEn}
                          </button>
                        ))}
                      </div>

                      {/* Countries List */}
                      <div className="max-h-60 overflow-y-auto space-y-1 pr-0.5 no-scrollbar divide-y divide-slate-100">
                        {filteredCountries.length === 0 ? (
                          <div className="p-4 text-center text-slate-500 text-xs">
                            {isAr ? 'لم يتم العثور على دولة' : 'No country available'}
                          </div>
                        ) : (
                          filteredCountries.map((c) => {
                            const isSelected = editableCountry === c.nameAr || editableCountry === c.nameEn;
                            return (
                              <button
                                key={c.code}
                                type="button"
                                onClick={() => {
                                  setEditableCountry(c.nameAr);
                                  setOpenDropdown(null);
                                }}
                                className={`w-full p-2 rounded-xl text-right transition-all flex items-center justify-between cursor-pointer ${
                                  isSelected
                                    ? 'bg-amber-50 border border-amber-400 text-slate-900 font-bold shadow-sm'
                                    : 'hover:bg-slate-100 text-slate-800 border border-transparent'
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="text-lg leading-none">{getCountryFlagEmoji(c.code)}</span>
                                  <div className="truncate">
                                    <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                                      <span>{c.nameAr}</span>
                                      <span className="text-[10px] text-slate-500 font-mono font-normal">({c.nameEn})</span>
                                    </div>
                                    <div className="text-[10px] text-slate-500 font-mono">
                                      {isAr ? 'العاصمة:' : 'Capital:'} {c.capital} · {c.gdp}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="font-mono text-[10px] text-slate-700 px-1.5 py-0.5 rounded bg-slate-100 border border-slate-300">
                                    {c.code}
                                  </span>
                                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-600" />}
                                </div>
                              </button>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. القائمة المنسدلة 2: قائمة القطاعات الاقتصادية */}
                <div className="space-y-1.5 relative z-20">
                  <div className="flex items-center justify-between">
                    <label className="text-slate-300 text-[11px] font-bold flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                      <span>{isAr ? 'قائمة القطاعات الاقتصادية (28 قطاعاً معتمداً):' : 'Economic Sectors List (28 Approved Domains):'}</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {selectedSectorObj?.groupNameAr || ''}
                    </span>
                  </div>

                  {/* Trigger Button - خلفية بيضاء وكتابة بالأسود */}
                  <button
                    type="button"
                    onClick={() => {
                      setOpenDropdown(openDropdown === 'sector' ? null : 'sector');
                      setSectorGroupFilter('all');
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-right transition-all flex items-center justify-between cursor-pointer shadow-sm ${
                      openDropdown === 'sector'
                        ? 'bg-white border-blue-500 ring-2 ring-blue-500/20 text-slate-900'
                        : 'bg-white border-slate-300 hover:border-slate-400 text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0"></div>
                      <div className="truncate">
                        <span className="text-slate-900 font-bold text-xs">
                          {editableSector}
                        </span>
                        {selectedSectorObj && (
                          <span className="text-slate-500 text-[11px] font-mono mx-1.5">
                            ({selectedSectorObj.nameEn})
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {selectedSectorObj && (
                        <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-300 text-[10px] font-bold">
                          {selectedSectorObj.groupNameAr}
                        </span>
                      )}
                      <ChevronDown
                        className={`w-4 h-4 text-slate-600 transition-transform duration-200 ${
                          openDropdown === 'sector' ? 'rotate-180 text-blue-600' : ''
                        }`}
                      />
                    </div>
                  </button>

                  {/* Dropdown Menu - خلفية بيضاء وكتابة بالأسود بدون بحث كتابي */}
                  {openDropdown === 'sector' && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white border border-slate-300 rounded-2xl shadow-2xl p-3 space-y-2.5 animate-in fade-in zoom-in-95 duration-150">
                      {/* Group Quick Filter Pills */}
                      <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar text-[10px]">
                        {SECTOR_GROUPS.map((grp) => (
                          <button
                            key={grp.id}
                            type="button"
                            onClick={() => setSectorGroupFilter(grp.id)}
                            className={`px-2.5 py-1 rounded-lg whitespace-nowrap border transition-colors cursor-pointer text-[10px] font-medium ${
                              sectorGroupFilter === grp.id
                                ? 'bg-blue-600 text-white border-blue-700 font-bold shadow-sm'
                                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                            }`}
                          >
                            {isAr ? grp.labelAr : grp.labelEn}
                          </button>
                        ))}
                      </div>

                      {/* Sectors List */}
                      <div className="max-h-60 overflow-y-auto space-y-1 pr-0.5 no-scrollbar divide-y divide-slate-100">
                        {filteredSectors.length === 0 ? (
                          <div className="p-4 text-center text-slate-500 text-xs">
                            {isAr ? 'لم يتم العثور على قطاع' : 'No sector available'}
                          </div>
                        ) : (
                          filteredSectors.map((s) => {
                            const isSelected = editableSector === s.nameAr || editableSector === s.nameEn;
                            return (
                              <button
                                key={s.id}
                                type="button"
                                onClick={() => {
                                  setEditableSector(s.nameAr);
                                  setOpenDropdown(null);
                                }}
                                className={`w-full p-2 rounded-xl text-right transition-all flex items-center justify-between cursor-pointer ${
                                  isSelected
                                    ? 'bg-blue-50 border border-blue-400 text-slate-900 font-bold shadow-sm'
                                    : 'hover:bg-slate-100 text-slate-800 border border-transparent'
                                }`}
                              >
                                <div className="truncate">
                                  <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                                    <span>{s.nameAr}</span>
                                    <span className="text-[10px] text-slate-500 font-mono font-normal">({s.nameEn})</span>
                                  </div>
                                  <div className="text-[10px] text-slate-500">
                                    {s.groupNameAr}
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300 font-medium">
                                    {s.group}
                                  </span>
                                  {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                                </div>
                              </button>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. القائمة المنسدلة 3: قائمة الأنواع الصحفية */}
                <div className="space-y-1.5 relative z-10">
                  <div className="flex items-center justify-between">
                    <label className="text-slate-300 text-[11px] font-bold flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-purple-400" />
                      <span>{isAr ? 'قائمة الأنواع الصحفية (18 نوعاً وقالب صحفي):' : 'Journalistic Genres List (18 Formats):'}</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {selectedGenreObj?.category || ''}
                    </span>
                  </div>

                  {/* Trigger Button - خلفية بيضاء وكتابة بالأسود */}
                  <button
                    type="button"
                    onClick={() => {
                      setOpenDropdown(openDropdown === 'genre' ? null : 'genre');
                      setGenreCategoryFilter('all');
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-right transition-all flex items-center justify-between cursor-pointer shadow-sm ${
                      openDropdown === 'genre'
                        ? 'bg-white border-purple-500 ring-2 ring-purple-500/20 text-slate-900'
                        : 'bg-white border-slate-300 hover:border-slate-400 text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-2.5 h-2.5 rounded-full bg-purple-600 shrink-0"></div>
                      <div className="truncate">
                        <span className="text-slate-900 font-bold text-xs">
                          {editableGenre}
                        </span>
                        {selectedGenreObj && (
                          <span className="text-slate-500 text-[11px] font-mono mx-1.5">
                            ({selectedGenreObj.nameEn})
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {selectedGenreObj && (
                        <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-300 text-[10px] font-bold">
                          {selectedGenreObj.category}
                        </span>
                      )}
                      <ChevronDown
                        className={`w-4 h-4 text-slate-600 transition-transform duration-200 ${
                          openDropdown === 'genre' ? 'rotate-180 text-purple-600' : ''
                        }`}
                      />
                    </div>
                  </button>

                  {/* Dropdown Menu - خلفية بيضاء وكتابة بالأسود بدون بحث كتابي */}
                  {openDropdown === 'genre' && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white border border-slate-300 rounded-2xl shadow-2xl p-3 space-y-2.5 animate-in fade-in zoom-in-95 duration-150">
                      {/* Category Quick Filter Pills */}
                      <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar text-[10px]">
                        {GENRE_CATEGORIES.map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setGenreCategoryFilter(cat.id)}
                            className={`px-2.5 py-1 rounded-lg whitespace-nowrap border transition-colors cursor-pointer text-[10px] font-medium ${
                              genreCategoryFilter === cat.id
                                ? 'bg-purple-600 text-white border-purple-700 font-bold shadow-sm'
                                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                            }`}
                          >
                            {isAr ? cat.labelAr : cat.labelEn}
                          </button>
                        ))}
                      </div>

                      {/* Genres List with Editorial Descriptions */}
                      <div className="max-h-64 overflow-y-auto space-y-1.5 pr-0.5 no-scrollbar divide-y divide-slate-100">
                        {filteredGenres.length === 0 ? (
                          <div className="p-4 text-center text-slate-500 text-xs">
                            {isAr ? 'لم يتم العثور على نوع صحفي' : 'No genre available'}
                          </div>
                        ) : (
                          filteredGenres.map((g) => {
                            const isSelected = editableGenre === g.nameAr || editableGenre === g.nameEn;
                            return (
                              <button
                                key={g.id}
                                type="button"
                                onClick={() => {
                                  setEditableGenre(g.nameAr);
                                  setOpenDropdown(null);
                                }}
                                className={`w-full p-2.5 rounded-xl text-right transition-all flex flex-col gap-1 cursor-pointer border ${
                                  isSelected
                                    ? 'bg-purple-50 border-purple-400 text-purple-950 font-bold shadow-sm'
                                    : 'hover:bg-slate-100 text-slate-800 border-transparent bg-white'
                                }`}
                              >
                                <div className="flex items-center justify-between w-full">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-xs text-slate-900">{g.nameAr}</span>
                                    <span className="text-[10px] text-slate-500 font-mono">({g.nameEn})</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 font-bold border border-purple-300">
                                      {g.category}
                                    </span>
                                    {isSelected && <Check className="w-3.5 h-3.5 text-purple-600" />}
                                  </div>
                                </div>
                                <p className="text-[10.5px] text-slate-600 leading-relaxed text-right">
                                  {g.descriptionAr}
                                </p>
                              </button>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Author Name */}
                <div className="space-y-1">
                  <label className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400" />
                    <span>{isAr ? 'اسم الكاتب أو الهيئة:' : 'Author / Bureau:'}</span>
                  </label>
                  <input
                    type="text"
                    value={editableAuthor}
                    onChange={(e) => setEditableAuthor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Market Impact */}
                <div className="space-y-1">
                  <label className="text-slate-400 text-[11px] font-medium">{isAr ? 'تأثير السوق المتوقع:' : 'Market Impact:'}</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'positive', labelAr: 'إيجابي صاعد', color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' },
                      { id: 'neutral', labelAr: 'محايد مستقر', color: 'text-amber-400 border-amber-500/40 bg-amber-500/10' },
                      { id: 'negative', labelAr: 'سلبي هابط', color: 'text-rose-400 border-rose-500/40 bg-rose-500/10' }
                    ].map(item => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setEditableMarketImpact(item.id as any)}
                        className={`p-1.5 rounded-lg border text-[10px] font-bold transition-all ${
                          editableMarketImpact === item.id ? item.color : 'border-slate-800 bg-slate-950 text-slate-500'
                        }`}
                      >
                        {item.labelAr}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

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
          VIEW MODE 2: LIVE PAPER REPLICA PREVIEW (المعاينة الورقية الحية المدمجة)
         ========================================================================= */}
      {viewMode === 'paper_preview' && (
        <div className="w-full max-w-full bg-[#FAF7F0] text-stone-900 rounded-3xl p-6 sm:p-12 lg:p-16 border border-amber-900/10 shadow-2xl space-y-8 animate-in fade-in duration-200">
          {/* Header Metadata matching ArticleView */}
          <div className="border-b border-stone-300 pb-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-stone-600 font-sans">
              {/* Classification Tag: الجزائر / طاقة / تقرير */}
              <div className="flex items-center gap-1.5 font-bold text-amber-800 bg-amber-100/70 px-3 py-1 rounded-md border border-amber-200">
                <span>{editableCountry}</span>
                <span>/</span>
                <span>{editableSector}</span>
                <span>/</span>
                <span>{editableGenre}</span>
              </div>

              <div className="flex items-center gap-4 text-[11px] font-mono">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-stone-500" />
                  <span>{estimatedReadTime} {isAr ? 'دقائق قراءة' : 'min read'}</span>
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-stone-500" />
                  <span>{editableAuthor}</span>
                </span>
              </div>
            </div>

            {/* Big Headline */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-stone-900 leading-tight font-serif">
              {editableTitle}
            </h1>

            {/* Summary Lead & Featured Homepage Image */}
            <div className="space-y-4">
              {editableImageUrl && (
                <div className="rounded-2xl overflow-hidden border border-amber-900/15 bg-stone-100 shadow-md">
                  <img
                    src={editableImageUrl}
                    alt={editableTitle}
                    className="w-full max-h-[380px] object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="p-2.5 bg-stone-200/70 text-[11px] text-stone-600 font-sans flex items-center justify-between border-t border-stone-200">
                    <span className="font-medium">{isAr ? 'صورة المقال الرئيسية المعتمدة على الصفحة الرئيسية' : 'Lead report image published to frontpage'}</span>
                    <span className="font-mono text-[10px] text-stone-500">{editableCountry} · {editableSector}</span>
                  </div>
                </div>
              )}

              <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-sans italic border-r-2 border-amber-700 pe-4">
                {editableSummary}
              </p>
            </div>

            {/* Audio Narrator Preview Bar */}
            <div className="p-3.5 rounded-2xl bg-[#F0EBE1] border border-amber-900/10 flex items-center justify-between text-xs text-stone-700">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-amber-800 animate-pulse" />
                <span className="font-bold">{isAr ? 'القارئ الصوتي الذكي جاهز للاستماع' : 'Audio reader ready'}</span>
              </div>
              <span className="font-mono text-[11px] text-stone-500">~{estimatedReadTime}:00</span>
            </div>
          </div>

          {/* Article Body with 50% Mid-Graphics Wrapping + 100% End-Graphics */}
          <div className="space-y-6 text-stone-800 text-sm sm:text-base font-serif leading-loose">
            {/* Mid Graphic 1 (50% with text wrapping) */}
            {currentMidGraphics[0] && (
              <div
                onClick={() => setZoomGraphic(currentMidGraphics[0])}
                className="w-[50%] max-w-[50%] float-right ms-4 sm:ms-6 mb-4 p-3.5 rounded-2xl bg-white border border-stone-200 shadow-md cursor-pointer hover:border-amber-600 transition-all select-none"
              >
                <div className="flex items-center justify-between text-[11px] font-bold text-amber-900 pb-2 border-b border-stone-100">
                  <span className="flex items-center gap-1">
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>{currentMidGraphics[0].title}</span>
                  </span>
                  <span className="text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200 font-mono">
                    50% {isAr ? 'تكبير' : 'Zoom'}
                  </span>
                </div>

                {/* Bars representation */}
                <div className="py-3 space-y-2">
                  {(currentMidGraphics[0].dataPoints || []).map((dp, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-[10px] text-stone-600 font-sans">
                        <span>{dp.label}</span>
                        <span className="font-mono font-bold text-stone-800">{dp.desc || `${dp.value}%`}</span>
                      </div>
                      <div className="h-2 rounded-full bg-stone-100 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-600 to-amber-700 rounded-full"
                          style={{ width: `${Math.min(100, dp.value)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-[10px] text-stone-500 font-sans pt-1 border-t border-stone-100 italic">
                  {currentMidGraphics[0].caption}
                </p>
              </div>
            )}

            {/* Paragraphs 1 & 2 */}
            {editableContent.split('\n\n').slice(0, 2).map((p, idx) => (
              <p key={idx} className="text-justify leading-relaxed">
                {p}
              </p>
            ))}

            {/* Mid Graphic 2 (50% on left with text wrapping) */}
            {currentMidGraphics[1] && (
              <div
                onClick={() => setZoomGraphic(currentMidGraphics[1])}
                className="w-[50%] max-w-[50%] float-left me-4 sm:me-6 mb-4 p-3.5 rounded-2xl bg-white border border-stone-200 shadow-md cursor-pointer hover:border-amber-600 transition-all select-none"
              >
                <div className="flex items-center justify-between text-[11px] font-bold text-blue-900 pb-2 border-b border-stone-100">
                  <span className="flex items-center gap-1">
                    <Globe2 className="w-3.5 h-3.5" />
                    <span>{currentMidGraphics[1].title}</span>
                  </span>
                  <span className="text-[10px] bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200 font-mono">
                    50% {isAr ? 'تكبير' : 'Zoom'}
                  </span>
                </div>

                <div className="py-3 space-y-2">
                  {(currentMidGraphics[1].dataPoints || []).map((dp, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-[10px] text-stone-600 font-sans">
                        <span>{dp.label}</span>
                        <span className="font-mono font-bold text-stone-800">{dp.desc || `${dp.value}%`}</span>
                      </div>
                      <div className="h-2 rounded-full bg-stone-100 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 to-blue-700 rounded-full"
                          style={{ width: `${Math.min(100, dp.value)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-[10px] text-stone-500 font-sans pt-1 border-t border-stone-100 italic">
                  {currentMidGraphics[1].caption}
                </p>
              </div>
            )}

            {/* Pull Quote in paper style (دون علامات اقتباس وبخلفية مميزة) */}
            <div className="my-6 p-4 sm:p-5 rounded-2xl bg-[#F0EBE1] border-r-4 border-amber-600 text-stone-800 italic font-serif text-base sm:text-lg shadow-sm">
              {isAr 
                ? '«إن الاستثمار في البنية التحتية الصناعية والطاقوية السيادية يشكل الركيزة الأساسية لتحقيق التكامل القاري الإفريقي وتفكيك التبعية التاريخية لسلاسل التوريد الخارجية»'
                : 'Sovereign downstream industrial investments dismantle colonial extraction dynamics and anchor authentic continental value chain autonomy.'}
            </div>

            {/* Remaining Paragraphs */}
            {editableContent.split('\n\n').slice(2).map((p, idx) => (
              <p key={idx} className="text-justify leading-relaxed">
                {p}
              </p>
            ))}

            <div className="clear-both" />

            {/* End Graphic (100% Full Width at article conclusion) */}
            {currentEndGraphics[0] && (
              <div
                onClick={() => setZoomGraphic(currentEndGraphics[0])}
                className="w-full p-5 sm:p-6 rounded-2xl bg-white border border-stone-200 shadow-md cursor-pointer hover:border-purple-600 transition-all select-none space-y-4 my-8"
              >
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-700" />
                    <h4 className="text-sm sm:text-base font-bold text-stone-900">
                      {currentEndGraphics[0].title}
                    </h4>
                  </div>
                  <span className="text-xs bg-purple-50 text-purple-800 px-3 py-1 rounded-full border border-purple-200 font-bold font-mono">
                    100% {isAr ? 'عرض ختامي كامل' : 'Full End Graphic'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(currentEndGraphics[0].dataPoints || []).map((dp, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                      <div className="text-xs text-stone-500 font-sans">{dp.label}</div>
                      <div className="text-lg font-black text-purple-900 font-mono">{dp.desc || `${dp.value}%`}</div>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-stone-600 font-sans italic pt-2 border-t border-stone-100">
                  {currentEndGraphics[0].caption}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ADD / EDIT GRAPHIC (نافذة ضبط التمثيل البياني وإضافة الصور)
         ========================================================================= */}
      {isGraphicModalOpen && editingGraphic && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0A0F1D] border border-slate-700 rounded-3xl w-full max-w-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <ImageIcon className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-black text-white">
                  {isNewGraphic ? (isAr ? 'إضافة تمثيل بياني أو خريطة جديدة' : 'Add New Graphic') : (isAr ? 'تعديل التمثيل البياني' : 'Edit Graphic')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsGraphicModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                {isAr ? 'قوالب جاهزة سريعة ملائمة للاقتصاد الإفريقي:' : 'Quick Presets:'}
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => applyPresetGraphic('trade')}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-amber-300 hover:border-amber-500/50"
                >
                  📈 {isAr ? 'تدفقات تجارة AfCFTA' : 'AfCFTA Trade'}
                </button>
                <button
                  type="button"
                  onClick={() => applyPresetGraphic('energy')}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-orange-300 hover:border-orange-500/50"
                >
                  ⚡ {isAr ? 'طاقة وتكرير' : 'Energy'}
                </button>
                <button
                  type="button"
                  onClick={() => applyPresetGraphic('map')}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-blue-300 hover:border-blue-500/50"
                >
                  🗺️ {isAr ? 'خريطة ممرات شحن' : 'Maritime Corridors'}
                </button>
                <button
                  type="button"
                  onClick={() => applyPresetGraphic('macro')}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-purple-300 hover:border-purple-500/50"
                >
                  💎 {isAr ? 'احتياطيات ومؤشرات كلية' : 'Sovereign Macro'}
                </button>
              </div>
            </div>

            {/* Fields */}
            <div className="space-y-4 text-xs">
              {/* Title */}
              <div className="space-y-1">
                <label className="font-bold text-slate-300">{isAr ? 'عنوان التمثيل البياني / الخريطة:' : 'Graphic Title:'}</label>
                <input
                  type="text"
                  value={editingGraphic.title}
                  onChange={(e) => setEditingGraphic({ ...editingGraphic, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Type and Position Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Type */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">{isAr ? 'النوع:' : 'Type:'}</label>
                  <select
                    value={editingGraphic.type}
                    onChange={(e) => setEditingGraphic({ ...editingGraphic, type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="chart">{isAr ? 'رسم بياني إحصائي (Chart)' : 'Statistical Chart'}</option>
                    <option value="map">{isAr ? 'خريطة اقتصادية وممرات (Map)' : 'Economic Map'}</option>
                    <option value="infographic">{isAr ? 'إنفوجرافيك بيانات شامل (Infographic)' : 'Infographic'}</option>
                  </select>
                </div>

                {/* Position Rule: 50% vs 100% */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">
                    {isAr ? 'الموضع وقاعدة العرض:' : 'Position & Width Rule:'}
                  </label>
                  <select
                    value={editingGraphic.position}
                    onChange={(e) => setEditingGraphic({ ...editingGraphic, position: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 font-bold text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="mid">{isAr ? 'وسط المقال (50% عرض مع التواء النص)' : 'Mid-Article (50% Width + Text Wrap)'}</option>
                    <option value="end">{isAr ? 'نهاية المقال (100% كامل العرض)' : 'End of Article (100% Full Width)'}</option>
                  </select>
                </div>
              </div>

              {/* Alignment if mid */}
              {editingGraphic.position === 'mid' && (
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">{isAr ? 'محاذاة الطفو وسط النص:' : 'Mid Float Alignment:'}</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                      <input
                        type="radio"
                        name="align"
                        checked={editingGraphic.align === 'right' || !editingGraphic.align}
                        onChange={() => setEditingGraphic({ ...editingGraphic, align: 'right' })}
                        className="accent-amber-500"
                      />
                      <span>{isAr ? 'يمين (float-right)' : 'Right'}</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                      <input
                        type="radio"
                        name="align"
                        checked={editingGraphic.align === 'left'}
                        onChange={() => setEditingGraphic({ ...editingGraphic, align: 'left' })}
                        className="accent-amber-500"
                      />
                      <span>{isAr ? 'يسار (float-left)' : 'Left'}</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Caption */}
              <div className="space-y-1">
                <label className="font-bold text-slate-300">{isAr ? 'الشرح والتعليق الإيضاحي:' : 'Caption & Context:'}</label>
                <textarea
                  rows={2}
                  value={editingGraphic.caption}
                  onChange={(e) => setEditingGraphic({ ...editingGraphic, caption: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              {/* Data Points List */}
              <div className="space-y-2 border-t border-slate-800 pt-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-300">{isAr ? 'نقاط البيانات والمؤشرات:' : 'Data Points:'}</label>
                  <button
                    type="button"
                    onClick={() => {
                      const newPts = [...(editingGraphic.dataPoints || []), { label: isAr ? 'مؤشر جديد' : 'New Metric', value: 50, desc: '50%' }];
                      setEditingGraphic({ ...editingGraphic, dataPoints: newPts });
                    }}
                    className="text-[11px] text-amber-400 font-bold hover:underline"
                  >
                    + {isAr ? 'إضافة نقطة بيانية' : 'Add Point'}
                  </button>
                </div>

                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {(editingGraphic.dataPoints || []).map((dp, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                      <input
                        type="text"
                        placeholder={isAr ? "التسمية" : "Label"}
                        value={dp.label}
                        onChange={(e) => {
                          const pts = [...(editingGraphic.dataPoints || [])];
                          pts[idx].label = e.target.value;
                          setEditingGraphic({ ...editingGraphic, dataPoints: pts });
                        }}
                        className="flex-1 px-2 py-1 rounded bg-slate-900 border border-slate-800 text-white text-xs"
                      />
                      <input
                        type="number"
                        placeholder="%"
                        value={dp.value}
                        onChange={(e) => {
                          const pts = [...(editingGraphic.dataPoints || [])];
                          pts[idx].value = Number(e.target.value);
                          setEditingGraphic({ ...editingGraphic, dataPoints: pts });
                        }}
                        className="w-16 px-2 py-1 rounded bg-slate-900 border border-slate-800 text-amber-400 text-xs font-mono"
                      />
                      <input
                        type="text"
                        placeholder={isAr ? "الوصف" : "Desc"}
                        value={dp.desc || ''}
                        onChange={(e) => {
                          const pts = [...(editingGraphic.dataPoints || [])];
                          pts[idx].desc = e.target.value;
                          setEditingGraphic({ ...editingGraphic, dataPoints: pts });
                        }}
                        className="w-24 px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const pts = (editingGraphic.dataPoints || []).filter((_, i) => i !== idx);
                          setEditingGraphic({ ...editingGraphic, dataPoints: pts });
                        }}
                        className="p-1 text-rose-400 hover:bg-rose-950/40 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsGraphicModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleSaveGraphicModal}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs shadow-lg cursor-pointer"
              >
                {isAr ? 'حفظ التمثيل البياني' : 'Save Graphic'}
              </button>
            </div>
          </div>
        </div>
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
