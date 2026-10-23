import React from 'react';
import { 
  ShieldCheck, 
  Clock, 
  Zap, 
  SlidersHorizontal, 
  AlertTriangle, 
  FileEdit, 
  Brain, 
  BookOpen, 
  Archive,
  X
} from 'lucide-react';
import { Article } from '../../types';

export type NewsroomTab = 'overview' | 'editor' | 'pending' | 'training' | 'library' | 'archive' | 'commission';

interface NewsroomSidebarProps {
  activeTab: NewsroomTab;
  setActiveTab: (tab: NewsroomTab) => void;
  expandedSidebarTab: NewsroomTab | 'instant_random' | null;
  setExpandedSidebarTab: (tab: NewsroomTab | 'instant_random' | null) => void;
  isAr: boolean;
  secondsUntilNextCycle: number;
  isAutomatedIngesting: boolean;
  pendingArticlesCount: number;
  publishedArticlesCount: number;
  archivedArticlesCount: number;
  onTriggerInstantRandomGeneration: () => void;
  onOpenEditor: () => void;
  formatTime: (totalSec: number) => string;
}

export const NewsroomSidebar: React.FC<NewsroomSidebarProps> = ({
  activeTab,
  setActiveTab,
  expandedSidebarTab,
  setExpandedSidebarTab,
  isAr,
  secondsUntilNextCycle,
  isAutomatedIngesting,
  pendingArticlesCount,
  publishedArticlesCount,
  archivedArticlesCount,
  onTriggerInstantRandomGeneration,
  onOpenEditor,
  formatTime
}) => {
  const sidebarItems = [
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
      badge: pendingArticlesCount > 0 ? pendingArticlesCount : null,
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
      descAr: `${publishedArticlesCount} تقارير منشورة ومعتمدة للجمهور`,
      descEn: `${publishedArticlesCount} published reports in live feed`,
      category: isAr ? 'الأرشيف الحي' : 'Library',
      icon: BookOpen,
      badge: publishedArticlesCount > 0 ? publishedArticlesCount : null,
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
      badge: archivedArticlesCount > 0 ? archivedArticlesCount : null,
      activeColor: 'from-slate-700/40 to-slate-800/20 border-slate-500 text-slate-300'
    }
  ];

  const handleActivate = (itemId: string) => {
    if (itemId === 'instant_random') {
      onTriggerInstantRandomGeneration();
    } else {
      if (itemId === 'editor') {
        onOpenEditor();
      }
      setActiveTab(itemId as NewsroomTab);
    }
    setExpandedSidebarTab(null);
  };

  return (
    <aside className="hidden md:flex flex-col w-16 md:w-20 shrink-0 bg-gradient-to-b from-[#090D18] via-[#070A14] to-[#05070E] border-x border-slate-800/80 py-5 px-2 items-center justify-between select-none shadow-2xl relative z-40">
      <div className="w-full flex flex-col items-center space-y-4">
        <div 
          className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-sm relative group cursor-default"
          title={isAr ? 'غرفة الأخبار والرقابة الإفريقية' : 'Newsroom Master Desk'}
        >
          <ShieldCheck className="w-5 h-5 text-rose-400" />
          <span className="absolute -bottom-1 w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50 animate-pulse" />
        </div>

        <div className="w-8 h-px bg-slate-800/80 my-1" />

        <nav className="space-y-2.5 w-full flex flex-col items-center" aria-label="Newsroom Navigation">
          {sidebarItems.map((item) => {
            const isActive = activeTab === item.id;
            const isExpanded = expandedSidebarTab === item.id;
            const ItemIcon = item.icon;

            return (
              <div key={item.id} className="relative w-full flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    if (isExpanded) {
                      handleActivate(item.id);
                    } else {
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

                  {item.badge !== undefined && item.badge !== null && (
                    <span className={`absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold border border-slate-900 shadow-sm ${
                      item.isPulse
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-rose-500 text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}

                  {isActive && (
                    <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400" />
                  )}
                </button>

                {isExpanded && (
                  <div 
                    className="absolute rtl:right-[100%] rtl:mr-3 ltr:left-[100%] ltr:ml-3 top-1/2 -translate-y-1/2 z-50 w-72 sm:w-80 p-4 rounded-2xl bg-gradient-to-br from-[#0F172A] via-[#0B101E] to-[#080C16] border-2 border-amber-500/70 shadow-2xl shadow-black/95 space-y-3 animate-in fade-in zoom-in-95 duration-150 text-right rtl:text-right ltr:text-left cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleActivate(item.id);
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

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleActivate(item.id);
                      }}
                      className="w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                    >
                      <span>
                        {item.id === 'instant_random' 
                          ? (isAr ? 'تشغيل التوليد الفوري الآن' : 'Trigger Generation Now') 
                          : (isAr ? 'عرض الصفحة الآن' : 'Display Page View')}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      <div className="pt-3 border-t border-slate-800/80 flex flex-col items-center gap-1 text-[9px] text-slate-500 font-mono">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>AI</span>
      </div>
    </aside>
  );
};
