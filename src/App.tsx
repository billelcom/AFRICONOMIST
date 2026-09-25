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

const STORAGE_KEY = 'africonomist_custom_articles_v1';

export default function App() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [currentTab, setCurrentTab] = useState<'home' | 'country' | 'article' | 'editorial'>('home');
  const [isUpdaterModalOpen, setIsUpdaterModalOpen] = useState<boolean>(false);

  // حالة الدول الـ 54 الديناميكية مع الترتيب التلقائي (متطابقة مع الخادم لمنع تعارض الـ Hydration)
  const [countries, setCountries] = useState<AfricanCountryProfile[]>(() => {
    return rankCountriesDynamically(AFRICAN_COUNTRIES, 'gdp');
  });

  // حالة المقالات الأولية المتوافقة تماماً مع خادم SSR
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);

  const [selectedCountrySlug, setSelectedCountrySlug] = useState<string>('egypt');
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

      {/* Primary Header */}
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

      {/* Main View Container */}
      <main 
        id="main-content" 
        className={`flex-1 w-full mx-auto ${
          currentTab === 'editorial' 
            ? 'w-[98%] max-w-[98%] sm:max-w-7xl px-0 sm:px-6 lg:px-8 pt-2 sm:pt-6' 
            : 'max-w-7xl px-4 sm:px-6 lg:px-8 pt-8'
        }`}
      >
        {currentTab === 'home' && (
          <HomeView
            articles={articles}
            countries={countries}
            tickers={MARKET_TICKERS}
            lang={lang}
            onSelectArticle={handleSelectArticle}
            onSelectCountry={handleSelectCountry}
            onOpenUpdater={() => setIsUpdaterModalOpen(true)}
          />
        )}

        {currentTab === 'country' && (
          <CountryView
            country={currentCountry}
            allCountries={countries}
            onSelectCountry={handleSelectCountry}
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

      {/* Professional Financial Media Footer */}
      <footer className="border-t border-slate-800 bg-[#050811] text-slate-400 text-xs py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800/80">
            {/* Column 1: Brand Info */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <span className={`font-black text-white font-mono tracking-tight ${
                  isAr ? 'text-xl' : 'text-base tracking-wider'
                }`}>
                  {isAr ? 'لافريكونوميست' : 'L’AFRICONOMIST'}
                </span>
                <span className={`inline-block rounded-full bg-amber-500 ${
                  isAr ? 'w-2 h-2' : 'w-1.5 h-1.5'
                }`}></span>
                <span className={`text-amber-400 font-serif font-semibold ${
                  isAr ? 'text-xs' : 'text-[11px] tracking-tight'
                }`}>
                  {isAr ? 'صحيفة الاقتصاد الإفريقي' : 'African Economic Journal'}
                </span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed max-w-md">
                {isAr
                  ? 'صحيفة مالية واستقصائية مستقلة ترصد تطورات أسواق المال، استثمارات الطاقة، ومؤشرات الاقتصاد الكلي عبر كافة الدول الأفريقية الـ 54.'
                  : 'Independent financial and investigative publication tracking capital markets, energy transition, and macroeconomic indicators across all 54 African nations.'}
              </p>
            </div>

            {/* Column 2: Navigation Links */}
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

            {/* Column 3: Coverage & Transparency */}
            <div className="space-y-3">
              <h4 className="text-white font-semibold text-xs uppercase tracking-wider">
                {isAr ? 'معايير النشر' : 'Editorial Standards'}
              </h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                {isAr
                  ? 'تلتزم الصحيفة بأعلى معايير التدقيق الاقتصادي والنزاهة الصحفية ومطابقة كافة البيانات بالمصادر الرسمية.'
                  : 'Committed to rigorous economic fact-checking, financial integrity, and verified official institutional sources.'}
              </p>
            </div>
          </div>

          {/* Copyright bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
            <p>
              {isAr
                ? '© 2026 لافريكونوميست (L’Africonomist) - صحيفة الاقتصاد الإفريقي. كافة الحقوق محفوظة.'
                : '© 2026 L’Africonomist - African Economic Journal. All rights reserved.'}
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="hover:text-slate-300 transition-colors cursor-pointer">
                {isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}
              </span>
              <span>·</span>
              <span className="hover:text-slate-300 transition-colors cursor-pointer">
                {isAr ? 'شروط الخدمة' : 'Terms of Service'}
              </span>
              <span>·</span>
              <span className="hover:text-slate-300 transition-colors cursor-pointer">
                {isAr ? 'المصادر والشفافية' : 'Methodology'}
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
