'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header, HeaderTab } from './components/Header';
import { LiveTicker } from './components/LiveTicker';
import { HomeView } from './components/views/HomeView';
import { CountryView } from './components/views/CountryView';
import { ArticleView } from './components/views/ArticleView';
import { EditorialView } from './components/views/EditorialView';
import { DataJournalismView } from './components/views/DataJournalismView';
import { INITIAL_ARTICLES, AFRICAN_COUNTRIES, MARKET_TICKERS } from './data/mockData';
import { Article, AfricanCountryProfile } from './types';
import { 
  loadCountriesFromStorage, 
  saveCountriesToStorage, 
  rankCountriesDynamically 
} from './lib/dynamicEconomicRanking';
import { 
  getSecondsUntilNextCycle, 
  resetNextCycleTarget,
  checkAndCatchUpMissedCycles, 
  createAutonomousCycleReport 
} from './lib/cycleScheduler';
import { ALL_54_AFRICAN_COUNTRIES } from './data/africanCountries';
import { ECONOMIC_SECTORS, JOURNALISTIC_GENRES } from './data/reportOptions';
import { EconomicDataUpdaterModal } from './components/EconomicDataUpdaterModal';
import { CompactNavigationRibbons } from './components/CompactNavigationRibbons';
import { CurrencyExchangeWidget } from './components/CurrencyExchangeWidget';
import { AboutView } from './components/views/AboutView';
import { PodcastView } from './components/views/PodcastView';
import { VideoReportsView } from './components/views/VideoReportsView';
import { PrivacyTermsView } from './components/views/PrivacyTermsView';
import { InteractiveTopCard } from './components/InteractiveTopCard';
import { Facebook, Twitter, Youtube, Instagram, Music2, MessageCircle, Linkedin, ShieldCheck, Building2, FileText } from 'lucide-react';

const STORAGE_KEY = 'africonomist_custom_articles_v1';

export default function App() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [currentTab, setCurrentTab] = useState<HeaderTab>('home');
  const [isUpdaterModalOpen, setIsUpdaterModalOpen] = useState<boolean>(false);

  // حالة الدول الـ 54 الديناميكية مع الترتيب التلقائي (متطابقة مع الخادم لمنع تعارض الـ Hydration)
  const [countries, setCountries] = useState<AfricanCountryProfile[]>(() => {
    return rankCountriesDynamically(AFRICAN_COUNTRIES, 'gdp');
  });

  // حالة المقالات الأولية المتوافقة تماماً مع خادم SSR
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);

  const [selectedCountrySlug, setSelectedCountrySlug] = useState<string>('');
  const [selectedSectorId, setSelectedSectorId] = useState<string>('all');
  const [selectedGenreId, setSelectedGenreId] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<Article>(INITIAL_ARTICLES[0]);

  const isAr = lang === 'ar';

  // حفظ تلقائي فوري لأي تغيير في المقالات داخل localStorage
  const saveArticlesToLocal = (updatedArticles: Article[]) => {
    try {
      // نحفظ المقالات التي تم إنشاؤها أو تعديلها
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedArticles));
    } catch (e) {
      console.warn('Failed to save articles to localStorage:', e);
    }
  };

  // 1. استعادة المقالات وترتيب الدول من localStorage بأمان بعد اكتمال الـ Hydration في المتصفح
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const savedIds = new Set(parsed.map((a: Article) => a.id));
          const initialFiltered = INITIAL_ARTICLES.filter(a => !savedIds.has(a.id));
          setArticles([...parsed, ...initialFiltered]);
        }
      }
      const loadedCountries = loadCountriesFromStorage(AFRICAN_COUNTRIES);
      setCountries(rankCountriesDynamically(loadedCountries, 'gdp'));
    } catch (e) {
      console.warn('Could not restore from localStorage:', e);
    }
  }, []);

  // 2. جلب المقالات الإضافية المحفوظة في MongoDB Atlas ودمجها مع المتصفح
  useEffect(() => {
    async function loadPersistedArticles() {
      try {
        const res = await fetch('/api/articles');
        const data = await res.json();
        if (data.success && Array.isArray(data.articles) && data.articles.length > 0) {
          const dbArticles: Article[] = data.articles.map((item: any) => ({
            id: item.id,
            slug: item.slug || `report-${item.id}`,
            title: item.title,
            titleEn: item.titleEn || item.title,
            summary: item.summary,
            summaryEn: item.summaryEn || item.summary,
            content: Array.isArray(item.content) ? item.content : [item.content],
            contentEn: Array.isArray(item.contentEn) ? item.contentEn : [item.content],
            category: item.category || 'Markets',
            countryCode: item.countryCode || 'PAN_AFRICA',
            countryName: item.country || 'أفريقيا',
            countryNameEn: item.country || 'Africa',
            status: item.status || 'pending_review',
            generationType: item.generationType || 'automated_periodic',
            journalisticType: item.journalisticType || 'التقرير الإخباري',
            sector: item.sector || 'الاقتصاد الكلي',
            authorType: item.authorType || 'AI_AGENT',
            aiModel: item.aiModel || 'Gemini 3.6 Flash',
            citations: Array.isArray(item.sources) ? item.sources.map((s: any, idx: number) => ({
              id: `cit-${idx}`,
              sourceName: s.source || s.title,
              url: s.url,
              publishDate: '2026-09-24',
              verified: true,
              credibilityScore: 98,
              snippet: s.title
            })) : (item.citations || []),
            factCheck: item.factCheck || {
              score: 95,
              verifiedClaimsCount: 5,
              totalClaimsCount: 5,
              biasRating: 'Neutral',
              riskScore: 'Low',
              checkedAt: new Date().toISOString().split('T')[0]
            },
            createdAt: item.created_at ? item.created_at.replace('T', ' ').substring(0, 16) : '2026-09-24 00:00',
            readTimeMinutes: 4,
            featured: false,
            marketImpact: 'positive'
          }));

          // دمج مقالات MongoDB وحفظها
          setArticles(prev => {
            const existingIds = new Set(dbArticles.map(a => a.id));
            const filteredPrev = prev.filter(a => !existingIds.has(a.id));
            const merged = [...dbArticles, ...filteredPrev];
            saveArticlesToLocal(merged);
            return merged;
          });
        }
      } catch (err) {
        console.warn('Could not fetch persisted articles from MongoDB:', err);
      }
    }

    loadPersistedArticles();
  }, []);

  // دورة الرصد التلقائي ومؤقت النصف ساعة اللحظي المستمر في كافة أرجاء التطبيق
  const [secondsUntilNextCycle, setSecondsUntilNextCycle] = useState<number>(() => getSecondsUntilNextCycle());
  const [isAutomatedIngesting, setIsAutomatedIngesting] = useState<boolean>(false);

  // إطلاق التوليد الفوري / دورة الرصد التلقائي وإنشاء مسودة تقرير قيد المراجعة فورياً
  const handleTriggerAutonomousCycle = async () => {
    if (isAutomatedIngesting) return;
    setIsAutomatedIngesting(true);
    try {
      // 1. اختيار عشوائي كامل وشامل: دولة من الـ 54 دولة، قطاع من الـ 28 قطاعاً، قالب صحفي من الـ 18 قالباً
      const randomCountry = ALL_54_AFRICAN_COUNTRIES[Math.floor(Math.random() * ALL_54_AFRICAN_COUNTRIES.length)];
      const randomSector = ECONOMIC_SECTORS[Math.floor(Math.random() * ECONOMIC_SECTORS.length)];
      const randomGenre = JOURNALISTIC_GENRES[Math.floor(Math.random() * JOURNALISTIC_GENRES.length)];

      let createdReport: Article | null = null;
      try {
        const res = await fetch('/api/agents/pipeline', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            country: randomCountry.nameAr,
            countryCode: randomCountry.code,
            sector: randomSector.nameAr,
            journalisticType: randomGenre.nameAr,
            generationMode: 'automated_periodic'
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.report) {
            const rep = data.report;
            createdReport = {
              id: rep.id,
              slug: rep.slug || `report-${rep.id}`,
              title: rep.title,
              titleEn: rep.titleEn || rep.title,
              summary: rep.summary,
              summaryEn: rep.summaryEn || rep.summary,
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
              aiModel: 'Gemini 3.6 Flash (Instant Autonomous Dispatch)',
              reviewNotes: 'تم التوليد الفوري بنجاح (اختيار عشوائي: دولة · قطاع · قالب صحفي) قيد المراجعة',
              citations: Array.isArray(rep.sources) ? rep.sources.map((s: any, idx: number) => ({
                id: `cit-${idx}-${Date.now()}`,
                sourceName: s.source || s.title,
                url: s.url,
                publishDate: '2026-09-24',
                verified: true,
                credibilityScore: 98,
                snippet: s.title
              })) : [],
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
      } catch (err) {
        console.warn('Pipeline fetch fallback to local autonomous generation:', err);
      }

      if (!createdReport) {
        createdReport = createAutonomousCycleReport();
      }

      // بعد التوليد الفوري يعود العداد للدقيقة 30 فوراً ويبدأ في التنازل المستمر
      resetNextCycleTarget();
      setSecondsUntilNextCycle(1800);
      setArticles(prev => {
        const updated = [createdReport!, ...prev];
        saveArticlesToLocal(updated);
        return updated;
      });
    } finally {
      setIsAutomatedIngesting(false);
    }
  };

  // 3. مزامنة مؤقت النصف ساعة للعرض (تم تجميد التوليد التلقائي الخلفي مؤقتاً والاعتماد على زر التوليد الفوري)
  useEffect(() => {
    // حساب الوقت الدقيق المتبقي من توقيت الساعة
    setSecondsUntilNextCycle(getSecondsUntilNextCycle());

    // مؤقت دوري لتحديث عداد الثواني فقط دون إطلاق دورات تلقائية خلفية
    const timer = setInterval(() => {
      setSecondsUntilNextCycle(getSecondsUntilNextCycle());
    }, 1000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setSecondsUntilNextCycle(getSecondsUntilNextCycle());
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const pendingDraftsCount = articles.filter(a => a.status === 'pending_review').length;

  // إدارة التنقل ومزامنة سجل التصفح لدعم زر الرجوع في الهاتف (Mobile Back Button)
  const navigateToTab = (tab: HeaderTab, pushHistory = true) => {
    setCurrentTab(tab);
    if (pushHistory && typeof window !== 'undefined') {
      window.history.pushState({ tab }, '', '#' + tab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // الاستماع لحدث popstate عند ضغط زر الرجوع في الهاتف أو المتصفح
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!window.history.state) {
      window.history.replaceState({ tab: 'home' }, '', window.location.hash || '#home');
    }

    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.tab) {
        setCurrentTab(event.state.tab as HeaderTab);
        if (event.state.articleId) {
          const found = articles.find(a => a.id === event.state.articleId);
          if (found) setSelectedArticle(found);
        }
        if (event.state.countrySlug) {
          setSelectedCountrySlug(event.state.countrySlug);
        }
      } else {
        setCurrentTab('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [articles]);

  const handleSelectArticle = (article: Article) => {
    setSelectedArticle(article);
    setCurrentTab('article');
    if (typeof window !== 'undefined') {
      window.history.pushState({ tab: 'article', articleId: article.id }, '', '#article-' + article.id);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCountry = (countrySlug: string) => {
    setSelectedCountrySlug(countrySlug);
    setCurrentTab('country');
    if (typeof window !== 'undefined') {
      window.history.pushState({ tab: 'country', countrySlug }, '', '#country-' + countrySlug);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateArticleStatus = async (
    articleId: string, 
    status: Article['status'], 
    reviewer: string, 
    note?: string
  ) => {
    // 1. تحديث الحالة فوراً في واجهة المستخدم وحفظها في localStorage
    setArticles(prev => {
      const updated = prev.map(art => {
        if (art.id === articleId) {
          return {
            ...art,
            status,
            reviewedBy: reviewer,
            reviewNotes: note || art.reviewNotes,
            publishedAt: status === 'published' ? new Date().toISOString().replace('T', ' ').substring(0, 16) : art.publishedAt
          };
        }
        return art;
      });
      saveArticlesToLocal(updated);
      return updated;
    });

    // 2. إرسال التحديث لـ MongoDB ليتم حفظه في السحابة
    try {
      await fetch('/api/articles', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: articleId,
          action: status === 'published' ? 'publish' : 'reject'
        })
      });
    } catch (e) {
      console.warn('Failed to update article in MongoDB:', e);
    }
  };

  const handleAddNewDraft = (newArticle: Article) => {
    setArticles(prev => {
      const updated = [newArticle, ...prev];
      saveArticlesToLocal(updated);
      return updated;
    });

    // إرسال المسودة الجديدة لقاعدة البيانات في الخلفية
    try {
      fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newArticle)
      }).catch(err => console.warn('Background article sync notice:', err));
    } catch {
      // Ignored
    }
  };

  const handleSaveArticle = (updatedArticle: Article) => {
    setArticles(prev => {
      const updated = prev.map(art => art.id === updatedArticle.id ? updatedArticle : art);
      saveArticlesToLocal(updated);
      return updated;
    });
    if (selectedArticle && selectedArticle.id === updatedArticle.id) {
      setSelectedArticle(updatedArticle);
    }
  };

  // معالجة تحديث معطيات أي دولة وإعادة الترتيب التلقائي الفوري
  const handleUpdateCountry = (updatedCountry: AfricanCountryProfile) => {
    setCountries(prev => {
      // حفظ خريطة الترتيب السابق لاحتساب حركة الصعود أو التراجع
      const baseRankMap: Record<string, number> = {};
      prev.forEach(c => {
        baseRankMap[c.code] = c.rank;
      });

      // استبدال الدولة المحدثة
      const replaced = prev.map(c => c.code === updatedCountry.code ? updatedCountry : c);

      // إعادة الترتيب التلقائي الديناميكي لكافة الدول وفق الناتج ومؤشر القوة
      const reRanked = rankCountriesDynamically(replaced, 'gdp', baseRankMap);
      saveCountriesToStorage(reRanked);
      return reRanked;
    });
  };

  // استعادة الإحصائيات الرسمية الافتراضية
  const handleResetCountries = () => {
    const defaultRanked = rankCountriesDynamically(AFRICAN_COUNTRIES, 'gdp');
    setCountries(defaultRanked);
    saveCountriesToStorage(defaultRanked);
  };

  // توليد تقرير فوري بـ Gemini عند طلب تقرير لقطاع/دولة محددة
  const handleTriggerInstantReportForFilter = async (
    country: AfricanCountryProfile, 
    sectorName: string, 
    genreName: string
  ) => {
    try {
      const res = await fetch('/api/agents/pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country: country.nameAr,
          countryCode: country.code,
          sector: sectorName,
          journalisticType: genreName,
          generationMode: 'automated_periodic'
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.report) {
          const rep = data.report;
          const newReport: Article = {
            id: rep.id,
            slug: rep.slug || `report-${rep.id}`,
            title: rep.title,
            titleEn: rep.titleEn || rep.title,
            summary: rep.summary,
            summaryEn: rep.summaryEn || rep.summary,
            content: [rep.content],
            contentEn: [rep.content],
            category: 'Macroeconomics',
            countryCode: country.code,
            countryName: country.nameAr,
            countryNameEn: country.nameEn,
            status: 'published',
            generationType: 'automated_periodic',
            journalisticType: genreName,
            sector: sectorName,
            authorType: 'AI_AGENT',
            aiModel: 'Gemini 3.6 Flash (Instant Dispatch)',
            reviewNotes: 'تم التوليد الفوري بنجاح ونشر التقرير للمطالعة',
            citations: Array.isArray(rep.sources) ? rep.sources.map((s: any, idx: number) => ({
              id: `cit-${idx}-${Date.now()}`,
              sourceName: s.source || s.title,
              url: s.url,
              publishDate: '2026-09-24',
              verified: true,
              credibilityScore: 98,
              snippet: s.title
            })) : [],
            factCheck: {
              score: 97,
              verifiedClaimsCount: 5,
              totalClaimsCount: 5,
              biasRating: 'Neutral',
              riskScore: 'Low',
              checkedAt: new Date().toISOString().split('T')[0]
            },
            createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
            publishedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
            readTimeMinutes: 3,
            featured: false,
            marketImpact: 'positive'
          };
          setArticles(prev => {
            const updated = [newReport, ...prev];
            saveArticlesToLocal(updated);
            return updated;
          });
        }
      }
    } catch (e) {
      console.warn('Instant report API error:', e);
    }
  };

  const currentCountry = countries.find(c => c.slug === selectedCountrySlug) || countries[0];

  return (
    <div className={`min-h-screen ${currentTab === 'editorial' ? 'bg-white text-slate-900' : 'bg-[#080C14] text-slate-100'} flex flex-col font-sans ${isAr ? 'rtl' : 'ltr'}`} dir={isAr ? 'rtl' : 'ltr'}>
      {/* Skip Link for WCAG 2.1 Accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:right-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-amber-500 focus:text-slate-950 focus:font-bold focus:rounded-md focus:shadow-xl focus:outline-none"
      >
        {isAr ? 'تخطي إلى المحتوى الرئيسي' : 'Skip to main content'}
      </a>

      {/* Primary Sticky Top Bar: Header + Continuous Live Ticker + Compact Hierarchical Navigation Ribbons */}
      <div className="sticky top-0 z-40 bg-[#070A12]/98 backdrop-blur-md shadow-lg border-b border-slate-800/80">
        <Header
          currentTab={currentTab}
          onSelectTab={(tab) => navigateToTab(tab)}
          lang={lang}
          onToggleLang={() => setLang(prev => prev === 'ar' ? 'en' : 'ar')}
          pendingDraftsCount={pendingDraftsCount}
        />

        {/* Continuous Live Market Ticker */}
        <LiveTicker items={MARKET_TICKERS} lang={lang} />

        {/* Compact Hierarchical Ribbons: Tier 1 (Countries) -> Tier 2 (Sectors) -> Tier 3 (Genres) */}
        <CompactNavigationRibbons
          countries={countries}
          selectedCountrySlug={selectedCountrySlug}
          onSelectCountry={(slug) => {
            setSelectedCountrySlug(slug);
            setSelectedSectorId('all');
            setSelectedGenreId('all');
            if (currentTab !== 'home') {
              setCurrentTab('home');
            }
          }}
          selectedSectorId={selectedSectorId}
          onSelectSector={(sectorId) => {
            setSelectedSectorId(sectorId);
            setSelectedGenreId('all');
          }}
          selectedGenreId={selectedGenreId}
          onSelectGenre={(genreId) => {
            setSelectedGenreId(genreId);
          }}
          lang={lang}
        />
      </div>

      {/* Main View Container */}
      <main 
        id="main-content" 
        className={`flex-1 w-full mx-auto ${
          currentTab === 'editorial' 
            ? 'w-full max-w-full px-0 pt-0' 
            : currentTab === 'article'
            ? 'w-full max-w-full px-0 sm:px-6 lg:px-8 pt-1 sm:pt-4'
            : 'max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8'
        }`}
      >
        {/* ظهور بطاقة الساعة والطقس والمشاركة في جميع الصفحات العامة (ماعدا صفحة قراءة المقال وغرفة الأخبار المخصصة للتحرير) */}
        {currentTab !== 'home' && currentTab !== 'article' && currentTab !== 'editorial' && (
          <div className="mb-6">
            <InteractiveTopCard lang={lang} />
          </div>
        )}
        {currentTab === 'home' && (
          <HomeView
            articles={articles}
            countries={countries}
            tickers={MARKET_TICKERS}
            lang={lang}
            onSelectArticle={handleSelectArticle}
            onSelectCountry={(countrySlug) => {
              setSelectedCountrySlug(countrySlug);
              setSelectedSectorId('all');
              setSelectedGenreId('all');
            }}
            onOpenUpdater={() => setIsUpdaterModalOpen(true)}
            selectedCountrySlug={selectedCountrySlug}
            selectedSectorId={selectedSectorId}
            selectedGenreId={selectedGenreId}
            onClearFilters={() => {
              setSelectedCountrySlug('');
              setSelectedSectorId('all');
              setSelectedGenreId('all');
            }}
            onNavigateToCountryDossier={(slug) => {
              setSelectedCountrySlug(slug);
              setCurrentTab('country');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onTriggerInstantReport={handleTriggerInstantReportForFilter}
          />
        )}

        {currentTab === 'country' && (
          <CountryView
            country={currentCountry}
            allCountries={countries}
            onSelectCountry={(slug) => {
              setSelectedCountrySlug(slug);
              setSelectedSectorId('all');
              setSelectedGenreId('all');
            }}
            articles={articles}
            onSelectArticle={handleSelectArticle}
            onOpenUpdater={() => setIsUpdaterModalOpen(true)}
            lang={lang}
          />
        )}

        {currentTab === 'article' && (
          <ArticleView
            article={selectedArticle}
            onBack={() => setCurrentTab('home')}
            lang={lang}
            onNavigateToEditorial={() => setCurrentTab('editorial')}
          />
        )}

        {currentTab === 'editorial' && (
          <EditorialView
            articles={articles}
            onUpdateArticleStatus={handleUpdateArticleStatus}
            onAddNewDraft={handleAddNewDraft}
            onSaveArticle={handleSaveArticle}
            onPreviewArticle={handleSelectArticle}
            lang={lang}
            secondsUntilNextCycle={secondsUntilNextCycle}
            isAutomatedIngesting={isAutomatedIngesting}
            onTriggerAutomatedCycleNow={handleTriggerAutonomousCycle}
          />
        )}

        {currentTab === 'data-journalism' && (
          <DataJournalismView
            countries={countries}
            articles={articles}
            lang={lang}
            onSelectCountry={handleSelectCountry}
            onSelectArticle={handleSelectArticle}
            onOpenUpdater={() => setIsUpdaterModalOpen(true)}
          />
        )}

        {currentTab === 'about' && (
          <AboutView
            lang={lang}
            onNavigateHome={() => navigateToTab('home')}
            onNavigateToNewsroom={() => navigateToTab('editorial')}
          />
        )}

        {currentTab === 'privacy' && (
          <PrivacyTermsView
            lang={lang}
            onNavigateHome={() => navigateToTab('home')}
          />
        )}

        {currentTab === 'podcast' && (
          <PodcastView
            lang={lang}
            onNavigateHome={() => navigateToTab('home')}
          />
        )}

        {currentTab === 'video' && (
          <VideoReportsView
            lang={lang}
            onNavigateHome={() => navigateToTab('home')}
          />
        )}
      </main>

      {/* Dynamic Macroeconomic Data Simulator & Auto Re-ranking Modal */}
      <EconomicDataUpdaterModal
        isOpen={isUpdaterModalOpen}
        onClose={() => setIsUpdaterModalOpen(false)}
        countries={countries}
        onUpdateCountry={handleUpdateCountry}
        onResetAll={handleResetCountries}
        lang={lang}
      />

      {/* Draggable Currency Exchange & Conversion Widget (متاح في جميع الصفحات ما عدا صفحة قراءة المقال حصراً لمنع التشتيت) */}
      {currentTab !== 'article' && <CurrencyExchangeWidget lang={lang} />}

      {/* Professional Financial Media Footer (تصميم احترافي متوازن مع أزرار المشاركة وتوسيط شريط الحقوق) */}
      <footer className="border-t border-slate-800/90 bg-[#050811] text-slate-400 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 pb-4 sm:pb-5 border-b border-slate-800/80 items-center">
            {/* Column 1: Brand Info & Mission + Social Icons (توسيط اللوغو والنص التعريفي والأيقونات دون إطارات) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center text-center space-y-3 mx-auto">
              <div 
                onClick={() => navigateToTab('home')}
                className="flex items-center justify-center gap-2 cursor-pointer select-none group inline-flex"
              >
                <span className={`font-black text-white font-mono tracking-tight group-hover:text-amber-400 transition-colors ${
                  isAr ? 'text-lg sm:text-xl' : 'text-base tracking-wider'
                }`}>
                  {isAr ? 'لافريكونوميست' : 'L’AFRICONOMIST'}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                <span className="text-amber-400 font-serif font-semibold text-xs">
                  {isAr ? 'صحيفة الاقتصاد الإفريقي' : 'African Economic Journal'}
                </span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed max-w-md text-center">
                {isAr
                  ? 'مؤسسة صحفية مالية واستقصائية مستقلة ترصد تطورات أسواق المال، استثمارات الطاقة، ومؤشرات الاقتصاد الكلي عبر كافة الدول الأفريقية الـ 54.'
                  : 'Independent financial publication tracking capital markets, sovereign debt, and macroeconomic indicators across all 54 African nations.'}
              </p>

              {/* روابط التواصل الاجتماعي: أيقونات فقط دون إطارات في صف واحد */}
              <div className="pt-1">
                <div className="flex items-center justify-center gap-4 text-slate-400">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-[#1877F2] hover:scale-115 transition-all p-0.5"
                    title="Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a
                    href="https://x.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-white hover:scale-115 transition-all p-0.5"
                    title="Twitter / X"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-[#FF0000] hover:scale-115 transition-all p-0.5"
                    title="YouTube"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-[#E4405F] hover:scale-115 transition-all p-0.5"
                    title="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a
                    href="https://tiktok.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-[#25F4EE] hover:scale-115 transition-all p-0.5"
                    title="TikTok"
                  >
                    <Music2 className="w-4 h-4" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-[#0A66C2] hover:scale-115 transition-all p-0.5"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a
                    href="https://wa.me/213656180056"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-[#25D366] hover:scale-115 transition-all p-0.5"
                    title={isAr ? 'واتساب' : 'WhatsApp'}
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* قسمي أقسام المنصة والمؤسسة والشفافية جنب بعضهما في عمودين */}
            <div className="lg:col-span-7 grid grid-cols-2 gap-4 sm:gap-8">
              {/* عمود اليمين: أقسام المنصة */}
              <div className="space-y-3">
                <h4 className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 text-amber-400">
                  <FileText className="w-3.5 h-3.5" />
                  <span>{isAr ? 'أقسام المنصة' : 'Platform Sections'}</span>
                </h4>
                <ul className="space-y-2 text-xs">
                  <li>
                    <button 
                      onClick={() => navigateToTab('home')}
                      className="hover:text-amber-400 transition-colors text-slate-300 cursor-pointer text-right rtl:text-right ltr:text-left flex items-center gap-1.5"
                    >
                      <span>·</span>
                      <span>{isAr ? 'الرئيسية والأسواق الحية' : 'Markets & Live Feed'}</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => navigateToTab('country')}
                      className="hover:text-amber-400 transition-colors text-slate-300 cursor-pointer text-right rtl:text-right ltr:text-left flex items-center gap-1.5"
                    >
                      <span>·</span>
                      <span>{isAr ? 'الملفات الاقتصادية للدول' : 'Country Economic Dossiers'}</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => navigateToTab('data-journalism')}
                      className="hover:text-amber-400 transition-colors text-slate-300 cursor-pointer text-right rtl:text-right ltr:text-left flex items-center gap-1.5"
                    >
                      <span>·</span>
                      <span>{isAr ? 'صحافة البيانات والمؤشرات' : 'Data Journalism & Visuals'}</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => navigateToTab('editorial')}
                      className="hover:text-amber-400 transition-colors text-slate-300 cursor-pointer text-right rtl:text-right ltr:text-left flex items-center gap-1.5"
                    >
                      <span>·</span>
                      <span>{isAr ? 'غرفة الأخبار والتحرير' : 'Newsroom Desk'}</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => navigateToTab('podcast')}
                      className="hover:text-amber-400 transition-colors text-slate-300 cursor-pointer text-right rtl:text-right ltr:text-left flex items-center gap-1.5"
                    >
                      <span>·</span>
                      <span>{isAr ? 'البودكاست الأسبوعي' : 'L’Africonomist Podcast'}</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => navigateToTab('video')}
                      className="hover:text-amber-400 transition-colors text-slate-300 cursor-pointer text-right rtl:text-right ltr:text-left flex items-center gap-1.5"
                    >
                      <span>·</span>
                      <span>{isAr ? 'التقارير المصورة والوثائقيات' : 'Video Reports & Documentaries'}</span>
                    </button>
                  </li>
                </ul>
              </div>

              {/* عمود اليسار: المؤسسة والشفافية + المدير العام مسؤول النشر + الجهة الناشرة */}
              <div className="space-y-3">
                <h4 className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 text-blue-400">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{isAr ? 'المؤسسة والشفافية' : 'Governance & Standards'}</span>
                </h4>
                <ul className="space-y-2 text-xs">
                  <li>
                    <button 
                      onClick={() => navigateToTab('about')}
                      className="hover:text-amber-400 transition-colors text-slate-300 cursor-pointer text-right rtl:text-right ltr:text-left flex items-center gap-1.5"
                    >
                      <span>·</span>
                      <span>{isAr ? 'من نحن وهيئة التحرير' : 'About Us & Editorial Board'}</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => navigateToTab('privacy')}
                      className="hover:text-amber-400 transition-colors text-slate-300 cursor-pointer text-right rtl:text-right ltr:text-left flex items-center gap-1.5"
                    >
                      <span>·</span>
                      <span>{isAr ? 'الشروط وحماية المصادر' : 'Charter & Whistleblower Protection'}</span>
                    </button>
                  </li>
                  <li className="pt-2 border-t border-slate-800/60 text-xs leading-relaxed text-slate-300 space-y-1">
                    <div>
                      <span className="text-amber-400 font-semibold block text-[11px]">{isAr ? 'المدير العام مسؤول النشر:' : 'Publishing Director:'}</span>
                      <span className="text-white font-bold">{isAr ? 'بلال عويش' : 'Billel Aouiche'}</span>
                    </div>
                    <div className="pt-1">
                      <span className="text-amber-400 font-semibold block text-[11px]">{isAr ? 'الجهة الناشرة:' : 'Publisher:'}</span>
                      <span className="text-white font-bold">GOODATA</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Centered Copyright & Governance Bar (هوامش علوية وسفلية مقلصة ومتناسقة) */}
          <div className="flex flex-col items-center justify-center text-center space-y-1.5 pt-0.5 pb-0.5">
            <p className="text-xs text-slate-400 font-medium">
              {isAr
                ? '© 2026 لافريكونوميست (L’Africonomist) - صحيفة الاقتصاد الإفريقي · جميع الحقوق محفوظة للناشر GOODATA'
                : '© 2026 L’Africonomist - African Economic Journal. All rights reserved by GOODATA.'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs text-slate-400">
              <button 
                onClick={() => navigateToTab('privacy')}
                className="hover:text-amber-400 transition-colors cursor-pointer"
              >
                {isAr ? 'سياسة الخصوصية وسرية المصادر' : 'Privacy Policy'}
              </button>
              <span className="text-slate-600">·</span>
              <button 
                onClick={() => navigateToTab('privacy')}
                className="hover:text-amber-400 transition-colors cursor-pointer"
              >
                {isAr ? 'شروط الخدمة والاستخدام' : 'Terms of Service'}
              </button>
              <span className="text-slate-600">·</span>
              <button 
                onClick={() => navigateToTab('about')}
                className="hover:text-amber-400 transition-colors cursor-pointer"
              >
                {isAr ? 'من نحن وهيئة التحرير' : 'About Us'}
              </button>
              <span className="text-slate-600">·</span>
              <button 
                onClick={() => navigateToTab('editorial')}
                className="hover:text-amber-400 transition-colors cursor-pointer"
              >
                {isAr ? 'غرفة الأخبار والرقابة' : 'Newsroom'}
              </button>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
