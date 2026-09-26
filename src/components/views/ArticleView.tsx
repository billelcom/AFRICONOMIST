'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Article } from '../../types';
import { shareContent } from '../../lib/pwa/webShare';
import { 
  ArrowRight, 
  ArrowLeft, 
  Share2, 
  Bookmark, 
  BookmarkCheck, 
  Printer, 
  Download, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw, 
  Type, 
  Minus, 
  Plus, 
  Check, 
  Copy, 
  FileText, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  Clock, 
  Calendar, 
  User, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  ListOrdered, 
  BarChart3, 
  Globe2, 
  Eye, 
  Sun, 
  Moon, 
  FileCheck2,
  BookOpen
} from 'lucide-react';

interface ArticleViewProps {
  article: Article;
  onBack: () => void;
  lang: 'ar' | 'en';
  onNavigateToEditorial?: () => void;
}

type PaperTheme = 'paper' | 'sepia' | 'white' | 'dark';
type FontSize = 'sm' | 'md' | 'lg' | 'xl';
type LineSpacing = 'normal' | 'relaxed' | 'loose';

interface CommentItem {
  id: string;
  author: string;
  role: string;
  content: string;
  date: string;
}

export const ArticleView: React.FC<ArticleViewProps> = ({
  article,
  onBack,
  lang,
  onNavigateToEditorial
}) => {
  const isAr = lang === 'ar';

  // --- Reading Preferences State ---
  const [paperTheme, setPaperTheme] = useState<PaperTheme>('paper');
  const [fontSize, setFontSize] = useState<FontSize>('md');
  const [lineSpacing, setLineSpacing] = useState<LineSpacing>('relaxed');
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [activeCitationId, setActiveCitationId] = useState<string | null>(null);

  // --- Table of Contents State ---
  const [isTocOpen, setIsTocOpen] = useState<boolean>(true);

  // --- Audio Reader State ---
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isAudioPaused, setIsAudioPaused] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [activeSpeechParagraph, setActiveSpeechParagraph] = useState<number>(-1);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // --- Discussion / Comments State ---
  const [comments, setComments] = useState<CommentItem[]>(() => [
    {
      id: 'c-1',
      author: isAr ? 'د. منصف بلقاسم' : 'Dr. Moncef Belkacem',
      role: isAr ? 'أستاذ الاقتصاد المالي - جامعة الجزائر' : 'Professor of Financial Economics',
      content: isAr 
        ? 'تحليل دقيق لأثر التوازن الهيكلي في ميزان المدفوعات. البيانات الميدانية تعكس بالضبط ما رصدناه في تقارير الربع الثاني من حيث تحسن الاحتياطيات النقدية.'
        : 'Precise analysis of the structural balance of payments impact. The empirical data matches Q2 monetary reserves growth.',
      date: isAr ? 'منذ يومين' : '2 days ago'
    },
    {
      id: 'c-2',
      author: isAr ? 'سارة العثماني' : 'Sarah Al-Othmani',
      role: isAr ? 'محللة استثمار بأسواق الطاقة الإفريقية' : 'Energy Markets Investment Analyst',
      content: isAr
        ? 'التمثيل البياني المرفق وتدفقات التوزيع الإقليمي تعطي رؤية متكاملة لمديري الصناديق السيادية. نأمل إفراد تقرير ملحق حول خطوط الإمداد اللوجستية.'
        : 'The accompanying data breakdown and regional distribution flows provide valuable depth for sovereign funds.',
      date: isAr ? 'أمس' : 'Yesterday'
    }
  ]);
  const [newCommentText, setNewCommentText] = useState<string>('');
  const [newCommentAuthor, setNewCommentAuthor] = useState<string>('');
  const [isSubmittingComment, setIsSubmittingComment] = useState<boolean>(false);

  // Toast auto-clear
  useEffect(() => {
    if (toastMessage) {
      const t = setTimeout(() => setToastMessage(null), 3500);
      return () => clearTimeout(t);
    }
  }, [toastMessage]);

  // Load saved state from localStorage
  useEffect(() => {
    try {
      const savedList = JSON.parse(localStorage.getItem('africonomist_saved_articles') || '[]');
      if (Array.isArray(savedList)) {
        setIsSaved(savedList.some((item: any) => item.id === article.id));
      }
    } catch {
      // ignore
    }
  }, [article.id]);

  // Handle Save / Bookmark
  const handleToggleSave = () => {
    try {
      const savedList = JSON.parse(localStorage.getItem('africonomist_saved_articles') || '[]');
      let updated: any[];
      if (isSaved) {
        updated = savedList.filter((item: any) => item.id !== article.id);
        setIsSaved(false);
        setToastMessage(isAr ? 'تمت إزالة المقال من قائمة المحفوظات' : 'Removed from saved articles');
      } else {
        updated = [
          {
            id: article.id,
            title: isAr ? article.title : article.titleEn,
            savedAt: new Date().toISOString()
          },
          ...savedList
        ];
        setIsSaved(true);
        setToastMessage(isAr ? 'تم حفظ المقال في قائمتك للقراءة' : 'Saved to your reading list');
      }
      localStorage.setItem('africonomist_saved_articles', JSON.stringify(updated));
    } catch {
      setIsSaved(!isSaved);
    }
  };

  // --- Audio Reader Implementation (SpeechSynthesis API) ---
  const articleParagraphs = useMemo(() => {
    return isAr ? article.content : article.contentEn;
  }, [article, isAr]);

  const fullTextToRead = useMemo(() => {
    const titleText = isAr ? article.title : article.titleEn;
    const summaryText = isAr ? article.summary : article.summaryEn;
    return `${titleText}. ${summaryText}. ${articleParagraphs.join('. ')}`;
  }, [article, articleParagraphs, isAr]);

  const handleStartAudio = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setToastMessage(isAr ? 'المتصفح لا يدعم قارئ الصوت المباشر' : 'Audio reader not supported in this browser');
      return;
    }

    if (isAudioPaused) {
      window.speechSynthesis.resume();
      setIsAudioPaused(false);
      setIsPlayingAudio(true);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(fullTextToRead);
    utterance.lang = isAr ? 'ar-SA' : 'en-US';
    utterance.rate = speechRate;

    // Try finding Arabic voice
    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find(v => v.lang.startsWith(isAr ? 'ar' : 'en'));
    if (arabicVoice) {
      utterance.voice = arabicVoice;
    }

    utterance.onboundary = (event) => {
      if (event.name === 'sentence' || event.name === 'word') {
        const charIdx = event.charIndex;
        const totalChars = fullTextToRead.length;
        if (totalChars > 0) {
          setAudioProgress(Math.min(100, Math.round((charIdx / totalChars) * 100)));
        }
      }
    };

    utterance.onend = () => {
      setIsPlayingAudio(false);
      setIsAudioPaused(false);
      setActiveSpeechParagraph(-1);
      setAudioProgress(100);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
      setIsAudioPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
    setIsAudioPaused(false);
    setActiveSpeechParagraph(0);
  };

  const handlePauseAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
      setIsAudioPaused(true);
      setIsPlayingAudio(false);
    }
  };

  const handleStopAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      setIsAudioPaused(false);
      setActiveSpeechParagraph(-1);
      setAudioProgress(0);
    }
  };

  const handleSpeedChange = (newRate: number) => {
    setSpeechRate(newRate);
    if (isPlayingAudio) {
      handleStopAudio();
      setTimeout(handleStartAudio, 150);
    }
  };

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // --- Print Handler ---
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  // --- Download Handler (Formatted Text / Markdown) ---
  const handleDownload = () => {
    const title = isAr ? article.title : article.titleEn;
    const author = isAr ? (article.authorName || 'هيئة التحرير') : (article.authorNameEn || 'Editorial Board');
    const role = isAr ? (article.authorRole || 'محرر الشؤون الاقتصادية') : (article.authorRoleEn || 'Economic Affairs Editor');
    const summary = isAr ? article.summary : article.summaryEn;
    const date = article.publishedAt || article.createdAt;
    const taxonomy = `${isAr ? article.countryName : article.countryNameEn} / ${article.sector || article.category} / ${article.journalisticType || 'تقرير'}`;

    const textContent = `=====================================================
لافريكونوميست · صحيفة الاقتصاد الإفريقي
L'AFRICONOMIST · PAN-AFRICAN ECONOMIC INTELLIGENCE
=====================================================

العنوان: ${title}
التصنيف التحريري: ${taxonomy}
الكاتب: ${author} (${role})
تاريخ النشر: ${date}
مدة القراءة: ${article.readTimeMinutes} دقائق

-----------------------------------------------------
الموجز الاستهلالي:
${summary}

-----------------------------------------------------
نص المقال والتحليل:
${articleParagraphs.map((p, i) => `[${i + 1}] ${p}`).join('\n\n')}

-----------------------------------------------------
المصادر والتوثيق المعتمد:
${article.citations.map((c, i) => `${i + 1}. ${c.sourceName} (${c.publishDate}) - مصداقية: ${c.credibilityScore}%\n   ${c.url}`).join('\n')}

=====================================================
تم التحميل من منصة لافريكونوميست · جميع الحقوق محفوظة
`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${article.slug || 'africonomist-article'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setToastMessage(isAr ? 'تم تحميل المقال بصيغة نصية منسقة' : 'Article downloaded as formatted text');
  };

  // --- Share Handler ---
  const handleShare = async () => {
    const title = isAr ? article.title : article.titleEn;
    const text = isAr ? article.summary : article.summaryEn;
    const url = typeof window !== 'undefined' ? window.location.href : '';

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        // Fallback to custom modal
      }
    }
    setIsShareModalOpen(true);
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
      setToastMessage(isAr ? 'تم نسخ رابط المقال إلى الحافظة' : 'Link copied to clipboard');
    }
  };

  // --- Add Comment Handler ---
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    setIsSubmittingComment(true);
    const newEntry: CommentItem = {
      id: `comment-${Date.now()}`,
      author: newCommentAuthor.trim() || (isAr ? 'قارئ اقتصادي' : 'Economic Reader'),
      role: isAr ? 'متابع لشؤون الاقتصاد الإفريقي' : 'African Economic Observer',
      content: newCommentText.trim(),
      date: isAr ? 'الآن' : 'Just now'
    };

    setComments(prev => [newEntry, ...prev]);
    setNewCommentText('');
    setNewCommentAuthor('');
    setIsSubmittingComment(false);
    setToastMessage(isAr ? 'تمت إضافة مشاركتك في المناقشة بنجاح' : 'Your contribution has been posted');
  };

  // --- Smooth Scroll to Anchor ---
  const scrollToAnchor = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // --- Derived Style Configurations for Themes & Fonts ---
  const themeClasses = useMemo(() => {
    switch (paperTheme) {
      case 'sepia':
        return {
          wrapper: 'bg-[#F4EEDB] text-[#28241E]',
          paperCanvas: 'bg-[#FAF3E0] border-[#E2D4BC] shadow-[#634832]/5 text-[#28241E]',
          headerBorder: 'border-[#4A3B2C]',
          subtext: 'text-[#6B5A47]',
          quoteBox: 'bg-[#EDE1C8] border-[#A8642A] text-[#28241E]',
          infobox: 'bg-[#F2E7D2] border-[#D9C6A7]',
          badge: 'bg-[#EDE1C8] text-[#594432] border-[#D9C6A7]'
        };
      case 'white':
        return {
          wrapper: 'bg-[#F8FAFC] text-[#0F172A]',
          paperCanvas: 'bg-[#FFFFFF] border-slate-200 shadow-slate-200/80 text-[#0F172A]',
          headerBorder: 'border-slate-800',
          subtext: 'text-slate-600',
          quoteBox: 'bg-slate-50 border-amber-600 text-slate-900',
          infobox: 'bg-slate-50 border-slate-200',
          badge: 'bg-slate-100 text-slate-800 border-slate-200'
        };
      case 'dark':
        return {
          wrapper: 'bg-[#0B0F19] text-[#E2E8F0]',
          paperCanvas: 'bg-[#121826] border-slate-800 shadow-black/50 text-[#E2E8F0]',
          headerBorder: 'border-amber-500/60',
          subtext: 'text-slate-400',
          quoteBox: 'bg-[#182236] border-amber-500 text-slate-100',
          infobox: 'bg-[#182236] border-slate-800',
          badge: 'bg-slate-800 text-slate-200 border-slate-700'
        };
      case 'paper':
      default:
        return {
          // Warm newspaper broadsheet with yellow-white tint
          wrapper: 'bg-[#F6F2E7] text-[#1C1917]',
          paperCanvas: 'bg-[#FAF7EE] border-[#E5DECD] shadow-[#44382A]/8 text-[#1C1917]',
          headerBorder: 'border-[#292524]',
          subtext: 'text-[#57534E]',
          quoteBox: 'bg-[#F2EBDB] border-[#9A3412] text-[#1C1917]',
          infobox: 'bg-[#F4EEDF] border-[#E0D7C4]',
          badge: 'bg-[#EDE5D2] text-[#44403C] border-[#DDD3BF]'
        };
    }
  }, [paperTheme]);

  const fontSizeClass = useMemo(() => {
    switch (fontSize) {
      case 'sm': return 'text-base sm:text-base leading-relaxed';
      case 'lg': return 'text-lg sm:text-xl leading-loose';
      case 'xl': return 'text-xl sm:text-2xl leading-loose';
      case 'md':
      default:
        return 'text-base sm:text-lg leading-relaxed';
    }
  }, [fontSize]);

  const lineSpacingClass = useMemo(() => {
    switch (lineSpacing) {
      case 'normal': return 'leading-[1.8]';
      case 'loose': return 'leading-[2.4]';
      case 'relaxed':
      default:
        return 'leading-[2.1]';
    }
  }, [lineSpacing]);

  // Derived taxonomy string: الجزائر / طاقة / تقرير
  const taxonomyBreadcrumb = useMemo(() => {
    const country = isAr ? article.countryName : article.countryNameEn;
    const sector = article.sector || article.category;
    const genre = article.journalisticType || (isAr ? 'تقرير' : 'Report');
    return `${country} / ${sector} / ${genre}`;
  }, [article, isAr]);

  const authorName = isAr 
    ? (article.authorName || 'هيئة التحرير والتحليل الاقتصادي') 
    : (article.authorNameEn || 'Editorial & Economic Board');

  const authorRole = isAr 
    ? (article.authorRole || 'شعبة الرصد والاستقصاء الاقتصادي الميداني') 
    : (article.authorRoleEn || 'Economic Field Intelligence Desk');

  // JSON-LD Schema for NewsArticle SEO
  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    'headline': isAr ? article.title : article.titleEn,
    'description': isAr ? article.summary : article.summaryEn,
    'inLanguage': isAr ? 'ar' : 'en',
    'datePublished': article.publishedAt || article.createdAt,
    'dateModified': article.publishedAt || article.createdAt,
    'articleSection': article.sector || article.category,
    'isAccessibleForFree': 'True',
    'author': {
      '@type': 'Person',
      'name': authorName,
      'jobTitle': authorRole
    },
    'publisher': {
      '@type': 'NewsMediaOrganization',
      'name': 'لافريكونوميست - صحيفة الاقتصاد الإفريقي',
      'url': 'https://lafriconomist.com',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://lafriconomist.com/icon.svg'
      }
    }
  };

  return (
    <div className={`w-full min-h-screen py-2 sm:py-8 transition-colors duration-200 ${themeClasses.wrapper}`}>
      {/* Structured SEO Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div 
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-stone-900/95 text-stone-100 text-xs font-semibold shadow-2xl border border-stone-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3"
        >
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="w-full flex flex-col items-center">

        {/* --- Top Sticky Reader Toolbar (تحميل، حفظ، مشاركة، طباعة، حجم الخط، الوضع الورقي) --- */}
        <nav 
          aria-label={isAr ? 'شريط أدوات القارئ' : 'Reader tools'}
          className="no-print sticky top-2 z-40 mb-3 sm:mb-6 w-[98%] sm:max-w-4xl mx-auto p-2 sm:p-2.5 rounded-2xl bg-stone-900/90 backdrop-blur-md text-stone-200 border border-stone-800 shadow-xl flex flex-wrap items-center justify-between gap-2 text-xs"
        >
          {/* Back button */}
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-100 transition-colors font-medium cursor-pointer"
            title={isAr ? 'العودة للصفحة السابقة' : 'Go Back'}
          >
            {isAr ? <ArrowRight className="w-4 h-4 text-amber-400" /> : <ArrowLeft className="w-4 h-4 text-amber-400" />}
            <span className="font-bold">{isAr ? 'العودة' : 'Back'}</span>
          </button>

          {/* Core Action Tools: Save, Share, Print, Download */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* Save / Bookmark */}
            <button
              onClick={handleToggleSave}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                isSaved 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50' 
                  : 'bg-stone-800/80 hover:bg-stone-700 text-stone-300 border-stone-700'
              }`}
              title={isSaved ? (isAr ? 'محفوظ في قائمتك' : 'Saved') : (isAr ? 'حفظ المقال للقراءة' : 'Save Article')}
            >
              {isSaved ? <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" /> : <Bookmark className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isSaved ? (isAr ? 'محفوظ' : 'Saved') : (isAr ? 'حفظ' : 'Save')}</span>
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-300 border border-stone-700 transition-colors cursor-pointer"
              title={isAr ? 'مشاركة المقال' : 'Share'}
            >
              <Share2 className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">{isAr ? 'مشاركة' : 'Share'}</span>
            </button>

            {/* Print */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-300 border border-stone-700 transition-colors cursor-pointer"
              title={isAr ? 'طباعة نسخة الصحيفة الورقية' : 'Print Newspaper Edition'}
            >
              <Printer className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">{isAr ? 'طباعة' : 'Print'}</span>
            </button>

            {/* Download */}
            <button
              onClick={handleDownload}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-300 border border-stone-700 transition-colors cursor-pointer"
              title={isAr ? 'تحميل نص المقال منسقاً' : 'Download Formatted Text'}
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">{isAr ? 'تحميل' : 'Download'}</span>
            </button>

            {/* Discussion Jump */}
            <button
              onClick={() => scrollToAnchor('discussion-section')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-300 border border-stone-700 transition-colors cursor-pointer"
              title={isAr ? 'الانتقال إلى نقاش القراء' : 'Jump to Discussion'}
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">{isAr ? 'مناقشة' : 'Discuss'}</span>
              <span className="px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono">
                {comments.length}
              </span>
            </button>
          </div>

          {/* Reader Preferences: Font Size & Paper Appearance */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Font size control */}
            <div className="flex items-center bg-stone-800/90 rounded-lg p-0.5 border border-stone-700">
              <button
                onClick={() => {
                  if (fontSize === 'xl') setFontSize('lg');
                  else if (fontSize === 'lg') setFontSize('md');
                  else if (fontSize === 'md') setFontSize('sm');
                }}
                disabled={fontSize === 'sm'}
                className="p-1.5 hover:text-white disabled:opacity-30 cursor-pointer"
                title={isAr ? 'تصغير الخط' : 'Smaller Font'}
              >
                <Minus className="w-3 h-3" />
              </button>

              <span className="px-1.5 font-bold font-serif text-xs text-amber-400 select-none">
                أ
              </span>

              <button
                onClick={() => {
                  if (fontSize === 'sm') setFontSize('md');
                  else if (fontSize === 'md') setFontSize('lg');
                  else if (fontSize === 'lg') setFontSize('xl');
                }}
                disabled={fontSize === 'xl'}
                className="p-1.5 hover:text-white disabled:opacity-30 cursor-pointer"
                title={isAr ? 'تكبير الخط' : 'Larger Font'}
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            {/* Paper Theme Selector */}
            <div className="flex items-center bg-stone-800/90 rounded-lg p-0.5 border border-stone-700">
              <button
                onClick={() => setPaperTheme('paper')}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-all cursor-pointer ${
                  paperTheme === 'paper' 
                    ? 'bg-[#FAF7EE] text-stone-900 font-bold shadow-sm' 
                    : 'text-stone-400 hover:text-stone-200'
                }`}
                title={isAr ? 'ورق صحيفة صفراء خفيفة (طبيعي)' : 'Newsprint Paper'}
              >
                {isAr ? 'ورقي' : 'Paper'}
              </button>

              <button
                onClick={() => setPaperTheme('sepia')}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-all cursor-pointer ${
                  paperTheme === 'sepia' 
                    ? 'bg-[#FAF3E0] text-[#4A3B2C] font-bold shadow-sm' 
                    : 'text-stone-400 hover:text-stone-200'
                }`}
                title={isAr ? 'ورق عاجي هادئ' : 'Sepia'}
              >
                {isAr ? 'عاجي' : 'Sepia'}
              </button>

              <button
                onClick={() => setPaperTheme('white')}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-all cursor-pointer ${
                  paperTheme === 'white' 
                    ? 'bg-white text-slate-900 font-bold shadow-sm' 
                    : 'text-stone-400 hover:text-stone-200'
                }`}
                title={isAr ? 'ورق أبيض ناصع' : 'White'}
              >
                {isAr ? 'أبيض' : 'White'}
              </button>

              <button
                onClick={() => setPaperTheme('dark')}
                className={`p-1.5 rounded transition-all cursor-pointer ${
                  paperTheme === 'dark' 
                    ? 'bg-stone-700 text-amber-400 shadow-sm' 
                    : 'text-stone-400 hover:text-stone-200'
                }`}
                title={isAr ? 'الوضع الليلي' : 'Dark Mode'}
              >
                <Moon className="w-3 h-3" />
              </button>
            </div>
          </div>
        </nav>

        {/* --- PHYSICAL NEWSPAPER BROADSHEET CANVAS --- */}
        <article 
          className={`article-print-canvas w-[98%] sm:max-w-4xl mx-auto rounded-2xl p-2.5 sm:p-10 md:p-12 border shadow-lg transition-colors ${themeClasses.paperCanvas}`}
        >
          {/* Newspaper Broadsheet Masthead Header (رأس الصحيفة الورقية) */}
          <header className={`w-[98%] mx-auto pb-4 sm:pb-5 mb-5 sm:mb-6 border-b-2 ${themeClasses.headerBorder}`}>
            {/* Masthead rule line */}
            <div className="flex items-center justify-between text-[11px] font-newspaper-body uppercase tracking-wider mb-3 pb-2 border-b border-stone-300/80">
              <span className="font-bold text-amber-800">
                {isAr ? 'لافريكونوميست · صحيفة الاقتصاد الإفريقي' : "L'AFRICONOMIST · AFRICAN ECONOMIC GAZETTE"}
              </span>
              <span className={themeClasses.subtext}>
                {isAr ? 'طبعة التوثيق والرصد الميداني' : 'Certified Intelligence Edition'}
              </span>
              <span className="font-mono text-stone-600 hidden sm:inline">
                {isAr ? 'العدد المعتمد' : 'Ref:'} #{article.id.slice(0, 8)}
              </span>
            </div>

            {/* Crucial Metadata Line: الكاتب، مدة القراءة، تصنيف المقال: الجزائر/طاقة/تقرير */}
            <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-4 text-xs mb-4">
              {/* Classification Taxonomy Breadcrumb (تصنيف المقال: الجزائر / طاقة / تقرير) */}
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-amber-700 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-600/20 text-[11px]">
                  {taxonomyBreadcrumb}
                </span>
              </div>

              {/* Reading time & date */}
              <div className={`flex items-center gap-3 text-[11px] ${themeClasses.subtext}`}>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>{isAr ? `مدة القراءة: ${article.readTimeMinutes} دقائق` : `${article.readTimeMinutes} min read`}</span>
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-stone-500" />
                  <time dateTime={article.publishedAt || article.createdAt}>
                    {article.publishedAt || article.createdAt}
                  </time>
                </span>
              </div>
            </div>

            {/* Headline (العنوان الرئيسي بخط عربي صحفي فخم) */}
            <h1 className="font-newspaper-headline text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] font-bold tracking-tight leading-[1.3] text-[#1C1917] dark:text-stone-100 mb-4">
              {isAr ? article.title : article.titleEn}
            </h1>

            {/* Author Byline Box (معلومات الكاتب بخط صغير وجميل ومنسق) */}
            <div className="flex items-center justify-between flex-wrap gap-3 pt-3 border-t border-stone-300/60 text-xs">
              <address className="not-italic flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-600/15 border border-amber-600/30 flex items-center justify-center text-amber-800 font-bold font-serif text-sm">
                  {authorName.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-stone-900 dark:text-stone-200">
                    {authorName}
                  </div>
                  <div className={`text-[10px] sm:text-[11px] ${themeClasses.subtext}`}>
                    {authorRole}
                  </div>
                </div>
              </address>

              {/* Editorial Verification Stamp */}
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium border ${themeClasses.badge}`}>
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>{isAr ? 'مراجعة وتدقيق معتمد' : 'Peer Reviewed'}</span>
                </span>
                {article.marketImpact && (
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                    article.marketImpact === 'positive' 
                      ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/30' 
                      : 'bg-amber-500/10 text-amber-800 border border-amber-500/30'
                  }`}>
                    <TrendingUp className="w-3 h-3" />
                    <span>{isAr ? 'أثر سوقي إيجابي' : 'Bullish Impact'}</span>
                  </span>
                )}
              </div>
            </div>
          </header>

          {/* Lead Summary (الاستهلال الصحفي) */}
          <div className="w-[98%] mx-auto p-3.5 sm:p-5 rounded-xl bg-amber-500/10 border-r-4 border-amber-700 text-stone-800 dark:text-stone-200 text-base sm:text-lg font-newspaper-body font-medium leading-relaxed mb-6">
            <p className="newspaper-lead">
              {isAr ? article.summary : article.summaryEn}
            </p>
          </div>

          {/* --- AUDIO READER PLAYER (قارئ مسموع للمقال) --- */}
          <section 
            aria-label={isAr ? 'قارئ المقال المسموع' : 'Audio reader'}
            className="no-print w-[98%] mx-auto mb-6 sm:mb-8 p-3 sm:p-4 rounded-xl border bg-stone-900 text-stone-100 shadow-md"
          >
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-100 flex items-center gap-1.5">
                    <span>{isAr ? 'القارئ الصوتي الذكي للمقال' : 'Audio Reader'}</span>
                    {isPlayingAudio && (
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-stone-400">
                    {isAr ? 'استمع إلى القراءة الصحفية الكاملة للمقال بصوت نقي' : 'Listen to full narrated report'}
                  </div>
                </div>
              </div>

              {/* Audio Controls */}
              <div className="flex items-center gap-2">
                {/* Speed selector */}
                <div className="flex items-center bg-stone-800 rounded-lg p-0.5 text-[10px] font-mono">
                  {[0.8, 1.0, 1.25, 1.5].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => handleSpeedChange(rate)}
                      className={`px-1.5 py-0.5 rounded cursor-pointer ${
                        speechRate === rate ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-300 hover:text-white'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>

                {/* Play / Pause button */}
                {!isPlayingAudio ? (
                  <button
                    onClick={handleStartAudio}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-colors cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isAr ? 'استماع' : 'Listen'}</span>
                  </button>
                ) : (
                  <button
                    onClick={handlePauseAudio}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-700 hover:bg-stone-600 text-amber-400 font-bold text-xs transition-colors cursor-pointer"
                  >
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>{isAr ? 'إيقاف مؤقت' : 'Pause'}</span>
                  </button>
                )}

                {/* Stop button */}
                {(isPlayingAudio || isAudioPaused) && (
                  <button
                    onClick={handleStopAudio}
                    className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-rose-400 cursor-pointer"
                    title={isAr ? 'إيقاف نهائي' : 'Stop'}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Audio Progress Bar */}
            {audioProgress > 0 && (
              <div className="mt-3 pt-2 border-t border-stone-800 flex items-center gap-3 text-[10px] text-stone-400 font-mono">
                <div className="flex-1 bg-stone-800 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-amber-400 h-full transition-all duration-300"
                    style={{ width: `${audioProgress}%` }}
                  />
                </div>
                <span>{audioProgress}%</span>
              </div>
            )}
          </section>

          {/* --- TABLE OF CONTENTS (فهرس المحتويات في البداية) --- */}
          <section 
            id="table-of-contents"
            aria-label={isAr ? 'فهرس محتويات المقال' : 'Table of Contents'}
            className={`w-[98%] mx-auto mb-6 sm:mb-8 p-3.5 sm:p-5 rounded-xl border ${themeClasses.infobox} transition-all`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-300/70 dark:border-stone-700">
              <div className="flex items-center gap-2">
                <ListOrdered className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                <h2 className="font-newspaper-headline text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100">
                  {isAr ? 'فهرس المحاور وعناصر التقرير' : 'Table of Contents'}
                </h2>
              </div>
              <button
                onClick={() => setIsTocOpen(!isTocOpen)}
                className="text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 p-1 cursor-pointer"
                title={isTocOpen ? (isAr ? 'طي الفهرس' : 'Collapse') : (isAr ? 'توسيع الفهرس' : 'Expand')}
              >
                {isTocOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {isTocOpen && (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-newspaper-body">
                <button
                  onClick={() => scrollToAnchor('sec-infographic')}
                  className="text-right flex items-center gap-2 p-2 rounded-lg hover:bg-stone-500/10 transition-colors text-stone-800 dark:text-stone-300 cursor-pointer"
                >
                  <span className="font-mono text-amber-700 font-bold">١.</span>
                  <span>{isAr ? 'الإنفوجرافيك والتمثيل البياني للأرقام' : 'Economic Infographic & Key Figures'}</span>
                </button>

                <button
                  onClick={() => scrollToAnchor('sec-analysis')}
                  className="text-right flex items-center gap-2 p-2 rounded-lg hover:bg-stone-500/10 transition-colors text-stone-800 dark:text-stone-300 cursor-pointer"
                >
                  <span className="font-mono text-amber-700 font-bold">٢.</span>
                  <span>{isAr ? 'التحليل الاقتصادي والرصد الميداني' : 'In-Depth Economic Analysis'}</span>
                </button>

                <button
                  onClick={() => scrollToAnchor('sec-quote')}
                  className="text-right flex items-center gap-2 p-2 rounded-lg hover:bg-stone-500/10 transition-colors text-stone-800 dark:text-stone-300 cursor-pointer"
                >
                  <span className="font-mono text-amber-700 font-bold">٣.</span>
                  <span>{isAr ? 'الرؤية والشهادات التحريرية المقتبسة' : 'Editorial Pull-Quote & Highlights'}</span>
                </button>

                <button
                  onClick={() => scrollToAnchor('sec-factcheck')}
                  className="text-right flex items-center gap-2 p-2 rounded-lg hover:bg-stone-500/10 transition-colors text-stone-800 dark:text-stone-300 cursor-pointer"
                >
                  <span className="font-mono text-amber-700 font-bold">٤.</span>
                  <span>{isAr ? 'تقرير تدقيق الحقائق والنزاهة التحليلية' : 'Fact-Check Verification & Integrity'}</span>
                </button>

                <button
                  onClick={() => scrollToAnchor('sec-citations')}
                  className="text-right flex items-center gap-2 p-2 rounded-lg hover:bg-stone-500/10 transition-colors text-stone-800 dark:text-stone-300 cursor-pointer"
                >
                  <span className="font-mono text-amber-700 font-bold">٥.</span>
                  <span>{isAr ? 'المراجع والمصادر الرسمية الموثقة' : 'Verified Citations & References'}</span>
                </button>

                <button
                  onClick={() => scrollToAnchor('discussion-section')}
                  className="text-right flex items-center gap-2 p-2 rounded-lg hover:bg-stone-500/10 transition-colors text-stone-800 dark:text-stone-300 cursor-pointer"
                >
                  <span className="font-mono text-amber-700 font-bold">٦.</span>
                  <span>{isAr ? 'مناقشات القراء وملاحظات الخبراء' : 'Reader Discussions & Notes'}</span>
                </button>
              </div>
            )}
          </section>

          {/* --- ECONOMIC INFOGRAPHIC & DATA VISUALIZATION SECTION --- */}
          {/* لا صور عامة؛ فقط رسوم بيانية وانفوجرافيك وخرائط اقتصادية */}
          <section 
            id="sec-infographic"
            aria-label={isAr ? 'تمثيل بياني وانفوجرافيك اقتصادي' : 'Economic Infographic'}
            className={`w-[98%] mx-auto mb-8 sm:mb-10 p-4 sm:p-5 rounded-2xl border ${themeClasses.infobox}`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-300/80 dark:border-stone-700 mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-amber-700 dark:text-amber-400" />
                <div>
                  <h3 className="font-newspaper-headline text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                    {isAr ? 'إنفوجرافيك المؤشرات والبيانات المرتبطة' : 'Economic Infographic & Data Metrics'}
                  </h3>
                  <p className={`text-[11px] ${themeClasses.subtext}`}>
                    {isAr ? 'تمثيل بياني للأرقام الواردة في التقرير وفق المسح الميداني' : 'Structured macroeconomic indices referenced in this report'}
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-800 dark:text-amber-300 font-mono text-[11px] font-bold">
                {isAr ? article.countryName : article.countryNameEn}
              </span>
            </div>

            {/* Key Metric Indicators Grid */}
            <div className="w-[98%] mx-auto grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mb-4 sm:mb-5">
              <div className="p-3 rounded-xl bg-white/70 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800">
                <div className={`text-[10px] ${themeClasses.subtext}`}>
                  {isAr ? 'القطاع الاستراتيجي' : 'Target Sector'}
                </div>
                <div className="font-bold text-stone-900 dark:text-stone-100 text-xs sm:text-sm mt-0.5 truncate">
                  {article.sector || article.category}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/70 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800">
                <div className={`text-[10px] ${themeClasses.subtext}`}>
                  {isAr ? 'مؤشر الثقة والموثوقية' : 'Credibility Index'}
                </div>
                <div className="font-bold text-emerald-700 dark:text-emerald-400 text-xs sm:text-sm mt-0.5 font-mono">
                  {article.factCheck.score}% ({isAr ? 'فائق' : 'High'})
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/70 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800">
                <div className={`text-[10px] ${themeClasses.subtext}`}>
                  {isAr ? 'الادعاءات الرقمية المفحوصة' : 'Claims Verified'}
                </div>
                <div className="font-bold text-stone-900 dark:text-stone-100 text-xs sm:text-sm mt-0.5 font-mono">
                  {article.factCheck.verifiedClaimsCount} / {article.factCheck.totalClaimsCount}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/70 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800">
                <div className={`text-[10px] ${themeClasses.subtext}`}>
                  {isAr ? 'الأثر التراكمي للأسواق' : 'Market Impact'}
                </div>
                <div className="font-bold text-amber-700 dark:text-amber-400 text-xs sm:text-sm mt-0.5">
                  {article.marketImpact === 'positive' ? (isAr ? 'نمو وتوسع' : 'Growth') : (isAr ? 'استقرار متوازن' : 'Stable')}
                </div>
              </div>
            </div>

            {/* Economic Flow & Trade Representation Diagram (خارطة ومخطط التدفق الاقتصادي) */}
            <div className="w-[98%] mx-auto p-3.5 sm:p-4 rounded-xl bg-stone-950 text-stone-200 border border-stone-800 font-mono text-xs space-y-3">
              <div className="flex items-center justify-between text-stone-400 text-[11px] pb-2 border-b border-stone-800">
                <span className="flex items-center gap-1.5">
                  <Globe2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isAr ? 'مسار التدفقات الاستثمارية ومحاور التجارة الإفريقية' : 'Trade & Capital Flow Nexus'}</span>
                </span>
                <span className="text-emerald-400 font-bold">LIVE METRIC</span>
              </div>

              {/* Visual SVG Economic Diagram */}
              <div className="h-24 w-full flex items-end justify-between gap-2 pt-4 px-2">
                {[
                  { label: isAr ? 'الربع الأول' : 'Q1', value: 68, color: 'bg-amber-600' },
                  { label: isAr ? 'الربع الثاني' : 'Q2', value: 82, color: 'bg-amber-500' },
                  { label: isAr ? 'الربع الثالث' : 'Q3', value: 94, color: 'bg-emerald-500' },
                  { label: isAr ? 'المستهدف' : 'Target', value: 100, color: 'bg-sky-500' },
                ].map((bar, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <span className="text-[10px] text-stone-400">{bar.value}%</span>
                    <div 
                      className={`w-full max-w-[48px] rounded-t ${bar.color} transition-all duration-500`}
                      style={{ height: `${bar.value * 0.7}%` }}
                    />
                    <span className="text-[10px] text-stone-400 text-center truncate w-full">{bar.label}</span>
                  </div>
                ))}
              </div>

              <div className="text-[10px] text-stone-400 text-center pt-2 border-t border-stone-800">
                {isAr 
                  ? `المصدر: وحدة البيانات الاقتصادية بلافريكونوميست - رصد وتوثيق: ${isAr ? article.countryName : article.countryNameEn}` 
                  : `Source: L'Africonomist Economic Research Desk - Tracked for ${article.countryNameEn}`}
              </div>
            </div>
          </section>

          {/* --- MAIN ARTICLE BODY (النص الصحفي المنسق) --- */}
          <main 
            id="sec-analysis"
            className={`w-[98%] mx-auto space-y-5 sm:space-y-6 font-newspaper-body text-justify ${fontSizeClass} ${lineSpacingClass}`}
          >
            {articleParagraphs.map((paragraph, idx) => {
              const isFirst = idx === 0;
              const hasCitation = article.citations[idx];

              return (
                <div key={idx} className="relative group">
                  <p className={`text-stone-900 dark:text-stone-100 ${
                    activeSpeechParagraph === idx ? 'bg-amber-500/15 p-2 rounded-lg' : ''
                  }`}>
                    {paragraph}

                    {/* Interactive Citation mark */}
                    {hasCitation && (
                      <button
                        onClick={() => {
                          setActiveCitationId(hasCitation.id);
                          scrollToAnchor(`cit-${hasCitation.id}`);
                        }}
                        className="inline-flex items-center justify-center mx-1 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-mono font-bold hover:bg-amber-500/40 border border-amber-600/30 transition-colors cursor-pointer"
                        title={isAr ? `عرض مصدر التوثيق المعتمد #${idx + 1}` : `View citation #${idx + 1}`}
                      >
                        [{idx + 1}]
                      </button>
                    )}
                  </p>
                </div>
              );
            })}

            {/* --- PULL QUOTE IN SPECIAL BOX WITHOUT QUOTATION MARKS --- */}
            {/* الاقتباسات تكون في مربعات بخلفية مميزة دون علامات اقتباس */}
            <aside 
              id="sec-quote"
              aria-label={isAr ? 'اقتباس تحريري مميز' : 'Editorial Highlight'}
              className={`w-[98%] mx-auto my-6 sm:my-8 p-5 sm:p-7 rounded-2xl border-r-4 ${themeClasses.quoteBox} shadow-sm transition-all`}
            >
              <div className="font-newspaper-headline text-lg sm:text-xl md:text-2xl font-bold leading-relaxed tracking-tight text-stone-950 dark:text-stone-100">
                {isAr
                  ? `إن التحول الهيكلي نحو الاعتماد الإقليمي المشترك في إفريقيا لا يقتصر على كونه خياراً تجارياً، بل يمثل درعاً سيادياً مباشراً لحماية استقرار العملات المحلية وتأمين سلاسل القيمة المضافة لكافة شعوب القارة.`
                  : `The structural shift toward pan-African regional integration is not merely a commercial strategy, but a direct sovereign bulwark safeguarding currency stabilization and securing high-value industrial chains.`}
              </div>

              <div className="mt-3 pt-3 border-t border-amber-900/10 dark:border-stone-700 flex items-center justify-between text-xs font-newspaper-body text-stone-700 dark:text-stone-300">
                <span className="font-bold">
                  {authorName}
                </span>
                <span className="text-[11px] font-mono text-amber-800 dark:text-amber-400">
                  {isAr ? 'رؤية تحليلية معتمدة' : 'Editorial Keynote'}
                </span>
              </div>
            </aside>

            {/* Additional analytical paragraph if present */}
            {article.reviewNotes && (
              <div className="w-[98%] mx-auto p-3.5 sm:p-4 rounded-xl bg-stone-200/60 dark:bg-stone-900/70 border border-stone-300 dark:border-stone-800 text-xs font-newspaper-body">
                <span className="font-bold text-amber-800 dark:text-amber-400 block mb-1">
                  {isAr ? 'ملاحظة التدقيق الاقتصادي المسجلة في السجل التحريري:' : 'Editorial Verification Note:'}
                </span>
                <p className="text-stone-700 dark:text-stone-300">
                  {article.reviewNotes}
                </p>
              </div>
            )}
          </main>

          {/* --- FACT CHECK & CITATIONS SECTION --- */}
          <footer className="w-[98%] mx-auto mt-8 sm:mt-12 pt-6 sm:pt-8 border-t-2 border-stone-300 dark:border-stone-700 space-y-5 sm:space-y-6">
            
            {/* Fact Check Report Box */}
            <section 
              id="sec-factcheck"
              aria-label={isAr ? 'تقرير فحص الحقائق' : 'Fact Check Report'}
              className="w-[98%] mx-auto p-3.5 sm:p-5 rounded-2xl bg-stone-900 text-stone-100 border border-stone-800 shadow-md"
            >
              <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 font-newspaper-headline">
                  <FileCheck2 className="w-4 h-4 text-emerald-400" />
                  <span>{isAr ? 'تقرير فحص الحقائق وتدقيق النزاهة التحليلية' : 'Zero-Trust Fact-Check Audit'}</span>
                </h3>
                <span className="text-sm font-bold font-mono text-emerald-400">
                  {article.factCheck.score}% {isAr ? 'مطابق تماماً' : 'Verified'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-stone-800/80">
                  <div className="text-stone-400 text-[10px]">{isAr ? 'الادعاءات المفحوصة' : 'Claims Tested'}</div>
                  <div className="font-mono text-stone-100 font-bold mt-0.5">
                    {article.factCheck.verifiedClaimsCount} / {article.factCheck.totalClaimsCount}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-stone-800/80">
                  <div className="text-stone-400 text-[10px]">{isAr ? 'مؤشر النزاهة والموضوعية' : 'Bias Rating'}</div>
                  <div className="text-emerald-400 font-bold mt-0.5">
                    {article.factCheck.biasRating === 'Neutral' ? (isAr ? 'حياد تام وموضوعي' : 'Neutral') : article.factCheck.biasRating}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-stone-800/80">
                  <div className="text-stone-400 text-[10px]">{isAr ? 'مستوى المخاطر التحريرية' : 'Editorial Risk'}</div>
                  <div className="text-emerald-400 font-mono font-bold mt-0.5">
                    {article.factCheck.riskScore}
                  </div>
                </div>
              </div>
            </section>

            {/* Citations List */}
            <section 
              id="sec-citations"
              aria-label={isAr ? 'المصادر والتوثيق' : 'Citations'}
              className={`w-[98%] mx-auto p-3.5 sm:p-5 rounded-2xl border ${themeClasses.infobox}`}
            >
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2 font-newspaper-headline mb-3">
                <BookOpen className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                <span>{isAr ? 'المصادر والمراجع الرسمية الموثقة' : 'Verified Citations & External Sources'}</span>
              </h3>

              <div className="space-y-3">
                {article.citations.map((cit, idx) => (
                  <div
                    key={cit.id}
                    id={`cit-${cit.id}`}
                    className={`w-[98%] mx-auto p-3 sm:p-3.5 rounded-xl border text-xs transition-all ${
                      activeCitationId === cit.id
                        ? 'bg-amber-500/15 border-amber-600/50 shadow-sm'
                        : 'bg-white/60 dark:bg-stone-900/60 border-stone-200 dark:border-stone-800'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-stone-900 dark:text-stone-100 mb-1">
                      <span className="flex items-center gap-1.5">
                        <span className="font-mono text-amber-700 dark:text-amber-400">[{idx + 1}]</span>
                        <span className="font-medium">{cit.sourceName}</span>
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 text-[11px] font-mono flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {cit.credibilityScore}%
                      </span>
                    </div>

                    <p className={`text-[11px] italic mb-2 ${themeClasses.subtext}`}>
                      {cit.snippet}
                    </p>

                    <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-stone-300/60 dark:border-stone-800">
                      <span className={themeClasses.subtext}>{cit.publishDate}</span>
                      <a
                        href={cit.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <span>{isAr ? 'الوثيقة الأصلية' : 'Source Document'}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* --- DISCUSSION & READER CONTRIBUTIONS SECTION (مناقشة المقال) --- */}
            <section 
              id="discussion-section"
              aria-label={isAr ? 'نقاش القراء' : 'Reader Discussions'}
              className="no-print w-[98%] mx-auto pt-6 border-t border-stone-300 dark:border-stone-800"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-amber-700 dark:text-amber-400" />
                  <h3 className="font-newspaper-headline text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                    {isAr ? 'مناقشات القراء وآراء الخبراء' : 'Reader Discussion & Expert Notes'}
                  </h3>
                </div>
                <span className="text-xs font-mono text-stone-500">
                  {comments.length} {isAr ? 'مشاركات' : 'contributions'}
                </span>
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="w-[98%] mx-auto mb-6 p-3.5 sm:p-4 rounded-xl bg-white/70 dark:bg-stone-900/80 border border-stone-300 dark:border-stone-800 space-y-3">
                <div className="text-xs font-bold text-stone-800 dark:text-stone-200">
                  {isAr ? 'أضف قراءتك أو تحليلك الاقتصادي لهذا التقرير:' : 'Add your economic note or perspective:'}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newCommentAuthor}
                    onChange={(e) => setNewCommentAuthor(e.target.value)}
                    placeholder={isAr ? 'اسمك أو صفتك المهنية (اختياري)' : 'Your Name / Title (optional)'}
                    className="px-3 py-2 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <textarea
                  rows={3}
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder={isAr ? 'اكتب ملاحظتك التحريرية أو مناقشتك الاقتصادية...' : 'Write your economic note or response...'}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-xs focus:outline-none focus:border-amber-500 resize-none font-newspaper-body"
                />

                <div className="flex items-center justify-between">
                  <span className={`text-[10px] ${themeClasses.subtext}`}>
                    {isAr ? 'تخضع التعليقات لسياسة النزاهة التحريرية والمعايير المهنية' : 'Contributions adhere to editorial integrity guidelines'}
                  </span>
                  <button
                    type="submit"
                    disabled={isSubmittingComment || !newCommentText.trim()}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-stone-950 font-bold text-xs transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isAr ? 'نشر المناقشة' : 'Post Contribution'}</span>
                  </button>
                </div>
              </form>

              {/* Comments List */}
              <div className="w-[98%] mx-auto space-y-3">
                {comments.map((c) => (
                  <div key={c.id} className="w-[98%] mx-auto p-3 sm:p-3.5 rounded-xl bg-white/50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800/80 text-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-400 font-bold text-[10px] flex items-center justify-center">
                          {c.author.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-stone-900 dark:text-stone-100">{c.author}</span>
                          <span className={`text-[10px] mx-1.5 ${themeClasses.subtext}`}>· {c.role}</span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-mono ${themeClasses.subtext}`}>{c.date}</span>
                    </div>
                    <p className="text-stone-800 dark:text-stone-200 font-newspaper-body leading-relaxed pl-8">
                      {c.content}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </footer>
        </article>

        {/* Newspaper Bottom Stamp */}
        <div className="w-[98%] mx-auto mt-6 sm:mt-8 text-center text-xs font-newspaper-body text-stone-500 dark:text-stone-400 pb-12">
          <div>{isAr ? 'صحيفة لافريكونوميست · حرية الرصد والاستقصاء المالي المستقل' : "L'Africonomist · Independent Pan-African Financial Gazette"}</div>
          <div className="text-[10px] text-stone-400 dark:text-stone-600 mt-1">
            {isAr ? 'جميع الحقوق محفوظة للمؤسسة الناشرة © 2026' : 'All Rights Reserved © 2026'}
          </div>
        </div>
      </div>

      {/* --- SHARE MODAL FALLBACK --- */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-stone-900 text-stone-100 p-5 border border-stone-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <h4 className="font-bold text-sm text-stone-100 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-amber-400" />
                <span>{isAr ? 'مشاركة هذا التقرير الاقتصادي' : 'Share Report'}</span>
              </h4>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="text-stone-400 hover:text-white text-xs cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-300 font-newspaper-body leading-relaxed line-clamp-2">
              {isAr ? article.title : article.titleEn}
            </p>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={typeof window !== 'undefined' ? window.location.href : ''}
                className="flex-1 px-3 py-2 rounded-lg bg-stone-800 border border-stone-700 text-xs font-mono text-stone-300 truncate"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? (isAr ? 'تم' : 'Copied') : (isAr ? 'نسخ' : 'Copy')}</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-800">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent((isAr ? article.title : article.titleEn) + ' ' + (typeof window !== 'undefined' ? window.location.href : ''))}`}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-600/30 text-center text-xs font-semibold hover:bg-emerald-600/30"
              >
                واتساب
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent((isAr ? article.title : article.titleEn) + ' ' + (typeof window !== 'undefined' ? window.location.href : ''))}`}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/30 text-center text-xs font-semibold hover:bg-sky-500/30"
              >
                منصة X
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-blue-600/20 text-blue-300 border border-blue-600/30 text-center text-xs font-semibold hover:bg-blue-600/30"
              >
                لينكد إن
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
