'use client';

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Article } from '../../types';
import { 
  Bell, 
  CheckCheck, 
  ShieldCheck, 
  Bookmark, 
  Sparkles, 
  FileText, 
  ChevronRight, 
  ChevronLeft, 
  Clock, 
  Trash2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface NotificationsViewProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  onNavigateToNewsroom?: () => void;
  onBackToHome: () => void;
  lang: 'ar' | 'en';
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  articles,
  onSelectArticle,
  onNavigateToNewsroom,
  onBackToHome,
  lang
}) => {
  const isAr = lang === 'ar';
  const { user, profile, role, notifications, markNotificationAsRead, markAllNotificationsAsRead, unreadCount } = useAuth();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  // ميثاق أمني صارم: غرفة الأخبار تظهر فقط بعد تسجيل الدخول للادمن، المشرفين، والمحررين
  const canAccessNewsroom = Boolean(
    user && 
    (role === 'ADMIN' || role === 'SUPERVISOR' || role === 'EDITOR' ||
     profile?.role === 'ADMIN' || profile?.role === 'SUPERVISOR' || profile?.role === 'EDITOR')
  );

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'editorial_review':
        return <ShieldCheck className="w-4 h-4 text-purple-400" />;
      case 'revision_requested':
        return <AlertCircle className="w-4 h-4 text-amber-400" />;
      case 'article_published':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'saved':
        return <Bookmark className="w-4 h-4 text-amber-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-sky-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-in fade-in-50 duration-200">
      {/* 1. الشريط العلوي */}
      <div className="flex items-center justify-between text-xs bg-slate-900/60 border border-slate-800/80 px-4 py-2.5 rounded-2xl">
        <div className="flex items-center gap-2 text-slate-400">
          <button
            onClick={onBackToHome}
            className="text-slate-300 hover:text-amber-400 transition-colors flex items-center gap-1 font-semibold"
          >
            {isAr ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
            <span>{isAr ? 'الرئيسية' : 'Home'}</span>
          </button>
          <span>/</span>
          <span className="text-amber-400 font-bold">{isAr ? 'مركز الإشعارات والتنبيهات' : 'Notifications Center'}</span>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsAsRead}
            className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700/60"
          >
            <CheckCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>{isAr ? 'تحديد الكل كمقروء' : 'Mark all as read'}</span>
          </button>
        )}
      </div>

      {/* 2. بطاقة الرأس الكبيرة */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#10172a] via-[#0d1424] to-[#070b14] border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                {isAr ? 'مركز الإشعارات والتنبيهات التحريرية' : 'Editorial Notifications'}
              </h1>
              <span className="text-xs text-slate-400">
                {isAr ? 'تنبيهات مراجعة المسودات، ملاحظات المشرفين، والنشر الفوري' : 'Live notices for editorial drafts, supervisor notes, and breaking articles'}
              </span>
            </div>
          </div>
        </div>

        {/* فلاتر العرض */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              filter === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isAr ? 'كافة الإشعارات' : 'All'} ({notifications.length})
          </button>

          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              filter === 'unread'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isAr ? 'غير المقروءة' : 'Unread'} ({unreadCount})
          </button>
        </div>
      </div>

      {/* 3. قائمة الإشعارات */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-[#0c1322] border border-slate-800 text-slate-400 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 flex items-center justify-center mx-auto">
              <Bell className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">
              {filter === 'unread' 
                ? (isAr ? 'لا توجد إشعارات غير مقروءة حالياً' : 'No unread notifications') 
                : (isAr ? 'صندوق الإشعارات فارغ' : 'Notification center is empty')}
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {isAr 
                ? 'ستصلك هنا كافة التنبيهات المتعلقة بمراجعات المقالات، وتوجيهات المشرفين، وحفظ المقالات.' 
                : 'You will receive editorial notifications, supervisor feedback notes, and published bulletins here.'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((n) => {
            const linkedArticle = n.articleId ? articles.find(a => a.id === n.articleId) : null;
            return (
              <div
                key={n.id}
                onClick={() => {
                  markNotificationAsRead(n.id);
                  if (linkedArticle) {
                    onSelectArticle(linkedArticle);
                  }
                }}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 group ${
                  !n.read 
                    ? 'bg-[#0f172a] border-amber-500/40 shadow-md shadow-amber-500/5' 
                    : 'bg-[#0b101d] border-slate-800/80 hover:border-slate-700 opacity-90'
                }`}
              >
                {/* الأيقونة بحسب النوع */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                  !n.read ? 'bg-amber-500/20 border-amber-500/40' : 'bg-slate-900 border-slate-800'
                }`}>
                  {getNotificationIcon(n.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className={`text-sm font-bold truncate ${!n.read ? 'text-white' : 'text-slate-300'}`}>
                      {n.title}
                    </h4>
                    <div className="flex items-center gap-1.5 shrink-0 text-slate-500 text-[10px] font-mono">
                      <Clock className="w-3 h-3" />
                      <span>{n.createdAt.substring(0, 16).replace('T', ' ')}</span>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-amber-400 inline-block mr-1" />
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300/90 leading-relaxed mb-2">
                    {n.message}
                  </p>

                  {/* إجراء سريع إذا كان مرتبطاً بمقال */}
                  <div className="flex items-center gap-3 text-[11px]">
                    {linkedArticle && (
                      <span className="text-amber-400 group-hover:text-amber-300 font-bold flex items-center gap-1">
                        <span>{isAr ? 'عرض المقال المعني' : 'View Article'}</span>
                        {isAr ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
                      </span>
                    )}

                    {canAccessNewsroom && onNavigateToNewsroom && (n.type === 'editorial_review' || n.type === 'revision_requested') && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigateToNewsroom();
                        }}
                        className="text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <ShieldCheck className="w-3 h-3" />
                        <span>{isAr ? 'الانتقال لغرفة الأخبار' : 'Go to Newsroom'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
