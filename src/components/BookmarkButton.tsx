'use client';

import React, { useState } from 'react';
import { Bookmark, Check, X, Sparkles, ShieldCheck, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Article } from '../types';

interface BookmarkButtonProps {
  article: Article;
  variant?: 'icon' | 'badge' | 'full';
  lang?: 'ar' | 'en';
  className?: string;
}

export interface AuthSaveRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: 'ar' | 'en';
}

export const AuthSaveRequiredModal: React.FC<AuthSaveRequiredModalProps> = ({
  isOpen,
  onClose,
  lang = 'ar'
}) => {
  const isAr = lang === 'ar';

  if (!isOpen) return null;

  const handleOpenAuth = (mode: 'signin' | 'signup') => {
    onClose();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode } }));
    }
  };

  return (
    <div 
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-b from-[#0E1526] via-[#090D18] to-[#060810] border border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-center space-y-5 text-white overflow-hidden"
      >
        {/* إشعاع خلفي جمالي */}
        <div className="absolute -top-12 -right-12 w-44 h-44 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* زر الإغلاق */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          title={isAr ? 'إغلاق' : 'Close'}
        >
          <X className="w-4 h-4" />
        </button>

        {/* أيقونة ذهبية متوهجة */}
        <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500/20 via-amber-400/10 to-amber-500/30 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-xl shadow-amber-500/20">
          <Bookmark className="w-7 h-7 fill-amber-400/40 text-amber-400" />
        </div>

        {/* العنوان الرئيسي */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-bold">
            <Sparkles className="w-3 h-3" />
            <span>{isAr ? 'خاصية حصرية للمشتركين' : 'Exclusive to Members'}</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white">
            {isAr ? 'حفظ المقالات مخصص للمسجلين' : 'Save Articles is for Registered Users'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm mx-auto">
            {isAr
              ? 'خاصية الحفظ تتيح لك الاحتفاظ بالتقارير والمؤشرات الاقتصادية المفضلة والعودة إليها في أي وقت. يمكنك إنشاء حسابك بكل سهولة في ثوانٍ معدودة.'
              : 'Bookmarking allows you to organize your favorite economic reports and indicators. You can easily create an account in a few seconds.'}
          </p>
        </div>

        {/* بطاقات الميزات المصغرة */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-right rtl:text-right ltr:text-left pt-1">
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] space-y-1">
            <div className="font-bold text-amber-400 flex items-center gap-1">
              <span>⚡</span>
              <span>{isAr ? 'تسجيل فوري' : 'Instant Setup'}</span>
            </div>
            <div className="text-slate-400 text-[10px]">
              {isAr ? 'مجاني بالكامل خلال ثوانٍ' : '100% Free in seconds'}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] space-y-1">
            <div className="font-bold text-blue-400 flex items-center gap-1">
              <span>📁</span>
              <span>{isAr ? 'مكتبة خاصة' : 'Personal Library'}</span>
            </div>
            <div className="text-slate-400 text-[10px]">
              {isAr ? 'حفظ التقارير والبيانات' : 'Curate your articles'}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] space-y-1">
            <div className="font-bold text-emerald-400 flex items-center gap-1">
              <span>🔄</span>
              <span>{isAr ? 'مزامنة سحابية' : 'Cloud Sync'}</span>
            </div>
            <div className="text-slate-400 text-[10px]">
              {isAr ? 'مطالعة عبر كافة أجهزتك' : 'Read across devices'}
            </div>
          </div>
        </div>

        {/* أزرار الإجراءات السريعة */}
        <div className="pt-2 space-y-2">
          <button
            type="button"
            onClick={() => handleOpenAuth('signup')}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>{isAr ? 'إنشاء حساب جديد بسهولة (مجاناً)' : 'Create New Account (Free)'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenAuth('signin')}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5 text-amber-400" />
            <span>{isAr ? 'لدي حساب بالفعل · تسجيل الدخول' : 'Already have an account? Sign In'}</span>
          </button>
        </div>

        <p className="text-[10px] text-slate-500">
          {isAr ? 'لافريكونوميست · حرية الوصول للبيانات الاقتصادية الإفريقية' : 'Africonomist · Continental Economic Intelligence'}
        </p>
      </div>
    </div>
  );
};

export const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  article,
  variant = 'icon',
  lang = 'ar',
  className = ''
}) => {
  const isAr = lang === 'ar';
  const { user, isArticleSaved, saveArticle, unsaveArticle } = useAuth();
  const saved = user ? isArticleSaved(article.id) : false;
  const [justToggled, setJustToggled] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    // خاصية الحفظ خاصة بمن لديهم حساب فقط
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (saved) {
      await unsaveArticle(article.id);
    } else {
      await saveArticle(article);
      setJustToggled(true);
      setTimeout(() => setJustToggled(false), 2000);
    }
  };

  return (
    <>
      {variant === 'full' ? (
        <button
          onClick={handleToggle}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
            saved
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-700/80 hover:text-white'
          } ${className}`}
          title={saved ? (isAr ? 'المقال محفوظ في حسابك - انقر للإلغاء' : 'Saved - click to remove') : (isAr ? 'حفظ المقال في حسابك' : 'Save article')}
        >
          <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
          <span>
            {justToggled 
              ? (isAr ? 'تم الحفظ!' : 'Saved!') 
              : saved 
              ? (isAr ? 'محفوظ في حسابك' : 'Saved') 
              : (isAr ? 'حفظ المقال' : 'Save')}
          </span>
        </button>
      ) : variant === 'badge' ? (
        <button
          onClick={handleToggle}
          className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1 cursor-pointer ${
            saved
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'bg-slate-950/60 hover:bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
          } ${className}`}
          title={saved ? (isAr ? 'محفوظ في حسابك' : 'Saved') : (isAr ? 'حفظ المقال' : 'Save')}
        >
          <Bookmark className={`w-3 h-3 ${saved ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
          <span>{saved ? (isAr ? 'محفوظ' : 'Saved') : (isAr ? 'حفظ' : 'Save')}</span>
        </button>
      ) : (
        <button
          onClick={handleToggle}
          className={`p-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center ${
            saved
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 scale-105'
              : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-amber-400 border border-slate-800 hover:border-slate-700'
          } ${className}`}
          title={saved ? (isAr ? 'المقال محفوظ في حسابك - انقر للإزالة' : 'Saved - click to unsave') : (isAr ? 'حفظ المقال في حسابك' : 'Save to profile')}
          aria-label="Bookmark article"
        >
          <Bookmark className={`w-3.5 h-3.5 transition-transform ${saved ? 'fill-amber-400 text-amber-400' : ''}`} />
        </button>
      )}

      {/* نافذة التنبيه الأنيقة عند عدم تسجيل الدخول */}
      <AuthSaveRequiredModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        lang={lang}
      />
    </>
  );
};

