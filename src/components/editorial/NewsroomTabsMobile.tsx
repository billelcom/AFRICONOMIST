import React from 'react';
import { 
  Clock, 
  Zap, 
  SlidersHorizontal, 
  AlertTriangle, 
  FileEdit, 
  Brain, 
  BookOpen, 
  Archive 
} from 'lucide-react';
import { NewsroomTab } from './NewsroomSidebar';

interface NewsroomTabsMobileProps {
  activeTab: NewsroomTab;
  setActiveTab: (tab: NewsroomTab) => void;
  isAr: boolean;
  secondsUntilNextCycle: number;
  formatTime: (totalSec: number) => string;
  isAutomatedIngesting: boolean;
  handleTriggerInstantRandomGeneration: () => void;
  pendingArticlesCount: number;
  currentActiveArticle: any;
}

export const NewsroomTabsMobile: React.FC<NewsroomTabsMobileProps> = ({
  activeTab,
  setActiveTab,
  isAr,
  secondsUntilNextCycle,
  formatTime,
  isAutomatedIngesting,
  handleTriggerInstantRandomGeneration,
  pendingArticlesCount,
  currentActiveArticle
}) => {
  return (
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

        {/* 3. زر التوليد المخصص */}
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
          {pendingArticlesCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white font-mono">
              {pendingArticlesCount}
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
  );
};
