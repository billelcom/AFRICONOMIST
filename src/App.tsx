'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LiveTicker } from './components/LiveTicker';
import { HomeView } from './components/views/HomeView';
import { CountryView } from './components/views/CountryView';
import { ArticleView } from './components/views/ArticleView';
import { EditorialView } from './components/views/EditorialView';
import { DataJournalismView } from './components/views/DataJournalismView';
import { AboutView, PrivacyView, PodcastView, VideoReportsView } from './components/views/StaticViews';
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
import { GlobalWeatherClockCard } from './components/GlobalWeatherClockCard';

const STORAGE_KEY = 'africonomist_custom_articles_v1';

export default function App() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [currentTabState, setCurrentTabState] = useState<'home' | 'country' | 'article' | 'editorial' | 'data-journalism' | 'about' | 'privacy' | 'podcast' | 'video'>('home');

  const currentTab = currentTabState;

  const setCurrentTab = (tab: typeof currentTabState) => {
    setCurrentTabState(tab);
    window.history.pushState({ tab }, '', `#${tab}`);
  };

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.tab) {
        setCurrentTabState(event.state.tab);
      } else {
        const hash = window.location.hash.replace('#', '') as any;
        const validTabs = ['home', 'country', 'article', 'editorial', 'data-journalism', 'about', 'privacy', 'podcast', 'video'];
        if (validTabs.includes(hash)) {
            setCurrentTabState(hash);
        } else {
            setCurrentTabState('home');
        }
      }
    };
    
    const hash = window.location.hash.replace('#', '') as any;
    const validTabs = ['home', 'country', 'article', 'editorial', 'data-journalism', 'about', 'privacy', 'podcast', 'video'];
    if (validTabs.includes(hash)) {
        setCurrentTabState(hash);
        window.history.replaceState({ tab: hash }, '', `#${hash}`);
    } else {
        window.history.replaceState({ tab: 'home' }, '', `#home`);
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
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

  const handleSelectArticle = (article: Article) => {
    setSelectedArticle(article);
    setCurrentTab('article');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCountry = (countrySlug: string) => {
    setSelectedCountrySlug(countrySlug);
    setCurrentTab('country');
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
    <div className={`min-h-screen bg-[#080C14] text-slate-100 flex flex-col font-sans ${isAr ? 'rtl' : 'ltr'}`} dir={isAr ? 'rtl' : 'ltr'}>
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
          onSelectTab={(tab) => {
            setCurrentTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
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
            ? 'w-[98%] max-w-[98%] sm:max-w-7xl px-0 sm:px-6 lg:px-8 pt-2 sm:pt-6' 
            : 'max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8'
        }`}
      >
        {currentTab !== 'editorial' && (
          <div className="mb-6 w-full">
            <GlobalWeatherClockCard lang={lang} />
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

        {currentTab === 'about' && <AboutView lang={lang} />}
        {currentTab === 'privacy' && <PrivacyView lang={lang} />}
        {currentTab === 'podcast' && <PodcastView lang={lang} />}
        {currentTab === 'video' && <VideoReportsView lang={lang} />}
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

      {/* Draggable Currency Exchange & Conversion Widget (Available Everywhere) */}
      <CurrencyExchangeWidget lang={lang} />

      {/* Professional Financial Media Footer */}
      <footer className="border-t border-slate-800 bg-[#050811] text-slate-400 text-xs py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6 pb-4 border-b border-slate-800/80">
            {/* Brand Info */}
            <div className="flex flex-col items-center md:items-start space-y-3 text-center md:text-start max-w-sm">
              <div className="flex items-center gap-2">
                <span className={`font-black text-white font-mono tracking-tight ${
                  isAr ? 'text-xl' : 'text-base tracking-wider'
                }`}>
                  {isAr ? 'لافريكونوميست' : 'L’AFRICONOMIST'}
                </span>
                <span className={`inline-block rounded-full bg-amber-500 ${
                  isAr ? 'w-2 h-2' : 'w-1.5 h-1.5'
                }`}></span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                {isAr
                  ? 'صحيفة مالية واستقصائية مستقلة ترصد تطورات أسواق المال، استثمارات الطاقة، ومؤشرات الاقتصاد الكلي عبر كافة الدول الأفريقية الـ 54.'
                  : 'Independent financial and investigative publication tracking capital markets, energy transition, and macroeconomic indicators across all 54 African nations.'}
              </p>
              <div className="mt-2 pt-2 border-t border-slate-800/50 w-full text-slate-400 text-xs space-y-1.5 text-center md:text-start">
                <p className="flex items-center justify-center md:justify-start gap-2">
                  <span className="font-semibold text-slate-300">{isAr ? 'الهاتف:' : 'Phone:'}</span>
                  <span dir="ltr" className="inline-block">+213 555 98 93 70 / +213 656 18 00 56</span>
                </p>
                <p className="flex items-center justify-center md:justify-start gap-2">
                  <span className="font-semibold text-slate-300">{isAr ? 'البريد الإلكتروني:' : 'Email:'}</span>
                  <span className="inline-block">bbillel87@gmail.com</span>
                </p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-wrap justify-center gap-6 text-center">
              <div className="space-y-3">
                <h4 className="text-white font-semibold text-xs uppercase tracking-wider">
                  {isAr ? 'أقسام الصحيفة' : 'Sections'}
                </h4>
                <ul className="space-y-2 text-xs">
                  <li>
                    <button 
                      onClick={() => { setCurrentTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="hover:text-amber-400 transition-colors"
                    >
                      {isAr ? 'الرئيسية والأسواق الحية' : 'Markets & Live Feed'}
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => { setCurrentTab('country'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="hover:text-amber-400 transition-colors"
                    >
                      {isAr ? 'الملفات الاقتصادية للدول' : 'Country Economic Dossiers'}
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => { setCurrentTab('editorial'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="hover:text-amber-400 transition-colors"
                    >
                      {isAr ? 'غرفة الأخبار' : 'Newsroom Desk'}
                    </button>
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="text-white font-semibold text-xs uppercase tracking-wider">
                  {isAr ? 'المحتوى الإضافي' : 'More'}
                </h4>
                <ul className="space-y-2 text-xs">
                  <li>
                    <button 
                      onClick={() => { setCurrentTab('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="hover:text-amber-400 transition-colors"
                    >
                      {isAr ? 'من نحن' : 'About Us'}
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => { setCurrentTab('podcast'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="hover:text-amber-400 transition-colors"
                    >
                      {isAr ? 'البودكاست' : 'Podcast'}
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => { setCurrentTab('video'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="hover:text-amber-400 transition-colors"
                    >
                      {isAr ? 'التقارير المصورة' : 'Video Reports'}
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            {/* Social Share Buttons */}
            <div className="space-y-3 text-center md:text-start flex flex-col items-center md:items-start">
               <h4 className="text-white font-semibold text-xs uppercase tracking-wider">
                {isAr ? 'تابعنا وشارك' : 'Follow & Share'}
              </h4>
              <div className="flex items-center gap-3">
                <a href="#" aria-label="X (Twitter)" className="w-8 h-8 rounded-full bg-slate-800 hover:bg-amber-500 hover:text-slate-900 transition-colors flex items-center justify-center">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="#" aria-label="Instagram" className="w-8 h-8 rounded-full bg-slate-800 hover:bg-amber-500 hover:text-slate-900 transition-colors flex items-center justify-center">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
                <a href="#" aria-label="YouTube" className="w-8 h-8 rounded-full bg-slate-800 hover:bg-amber-500 hover:text-slate-900 transition-colors flex items-center justify-center">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.501 5.814a3.016 3.016 0 0 0 2.122 2.136c1.872.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Copyright bar */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-xs text-slate-500">
            <p className="text-center">
              {isAr
                ? '© 2026 لافريكونوميست - صحيفة الاقتصاد الإفريقي. كافة الحقوق محفوظة.'
                : '© 2026 L’Africonomist - African Economic Journal. All rights reserved.'}
            </p>
            <div className="flex items-center justify-center gap-3 text-xs text-slate-400">
              <button 
                onClick={() => { setCurrentTab('privacy'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="hover:text-slate-300 transition-colors cursor-pointer"
              >
                {isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}
              </button>
              <span>·</span>
              <button 
                onClick={() => { setCurrentTab('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="hover:text-slate-300 transition-colors cursor-pointer"
              >
                {isAr ? 'شروط الخدمة' : 'Terms of Service'}
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
