/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { LiveTicker } from './components/LiveTicker';
import { HomeView } from './components/views/HomeView';
import { CountryView } from './components/views/CountryView';
import { ArticleView } from './components/views/ArticleView';
import { EditorialView } from './components/views/EditorialView';
import { ArchitectureView } from './components/views/ArchitectureView';
import { INITIAL_ARTICLES, AFRICAN_COUNTRIES, MARKET_TICKERS } from './data/mockData';
import { Article, AfricanCountryProfile } from './types';
import { ShieldCheck, Globe, Database, Terminal, FileCode2, Activity } from 'lucide-react';
import { HealthCheckModal } from './components/HealthCheckModal';

export default function App() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [currentTab, setCurrentTab] = useState<'home' | 'country' | 'article' | 'editorial' | 'architecture'>('home');
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [selectedCountrySlug, setSelectedCountrySlug] = useState<string>('egypt');
  const [selectedArticle, setSelectedArticle] = useState<Article>(INITIAL_ARTICLES[0]);
  const [isHealthCheckOpen, setIsHealthCheckOpen] = useState<boolean>(false);

  const isAr = lang === 'ar';

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

  const handleUpdateArticleStatus = (
    articleId: string, 
    status: Article['status'], 
    reviewer: string, 
    note?: string
  ) => {
    setArticles(prev => prev.map(art => {
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
    }));
  };

  const handleAddNewDraft = (newArticle: Article) => {
    setArticles(prev => [newArticle, ...prev]);
  };

  const currentCountry = AFRICAN_COUNTRIES.find(c => c.slug === selectedCountrySlug) || AFRICAN_COUNTRIES[0];

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
        onOpenHealthCheck={() => setIsHealthCheckOpen(true)}
      />

      {/* Cloud & GitHub Diagnostic Health-Check Modal */}
      <HealthCheckModal
        isOpen={isHealthCheckOpen}
        onClose={() => setIsHealthCheckOpen(false)}
        lang={lang}
      />

      {/* Continuous Live Market Ticker */}
      <LiveTicker items={MARKET_TICKERS} lang={lang} />

      {/* Main View Container */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {currentTab === 'home' && (
          <HomeView
            articles={articles}
            countries={AFRICAN_COUNTRIES}
            tickers={MARKET_TICKERS}
            lang={lang}
            onSelectArticle={handleSelectArticle}
            onSelectCountry={handleSelectCountry}
          />
        )}

        {currentTab === 'country' && (
          <CountryView
            country={currentCountry}
            allCountries={AFRICAN_COUNTRIES}
            onSelectCountry={handleSelectCountry}
            articles={articles}
            onSelectArticle={handleSelectArticle}
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
          />
        )}

        {currentTab === 'architecture' && (
          <ArchitectureView lang={lang} />
        )}
      </main>

      {/* Standard Financial Portal Footer */}
      <footer className="border-t border-slate-800 bg-[#060910] text-slate-400 text-xs py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white font-mono text-base tracking-tight">
                {isAr ? 'آفريكونوميست' : 'AFRICONOMIST'}
              </span>
              <span className="text-amber-500 font-bold">·</span>
              <span className="text-slate-400 font-mono text-xs">
                {isAr ? 'منصة الصحافة الاقتصادية الأفريقية' : 'African Economic Intelligence'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <button 
                onClick={() => setCurrentTab('architecture')}
                className="hover:text-amber-400 transition-colors flex items-center gap-1"
              >
                <Terminal className="w-3.5 h-3.5 text-amber-500" />
                <span>{isAr ? 'أوامر التثبيت و Scaffolding' : 'Terminal Scaffolding'}</span>
              </button>
              <button 
                onClick={() => setCurrentTab('editorial')}
                className="hover:text-rose-400 transition-colors flex items-center gap-1"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
                <span>{isAr ? 'بوابة المحررين (RBAC)' : 'Editorial Portal'}</span>
              </button>
              <span className="text-slate-700">|</span>
              <span className="font-mono text-[11px] text-slate-500">
                Next.js 15 App Router · TypeScript · Tailwind CSS · MongoDB Atlas
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
            <p>
              {isAr
                ? '© 2026 منصة آفريكونوميست (Africonomist). جميع المؤشرات الاقتصادية وأسعار الصرف مستخلصة وفق بروتوكول فحص الحقائق الصارم.'
                : '© 2026 Africonomist Platform. All macroeconomic feeds and indices verified under Zero-Trust human-in-the-loop protocols.'}
            </p>
            <p className="font-mono text-slate-400">
              Zero-Trust AI Financial Architecture v2.4 · GitHub Ready
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
