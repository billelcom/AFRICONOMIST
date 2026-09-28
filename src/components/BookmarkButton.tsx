'use client';

import React, { useState } from 'react';
import { Bookmark, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Article } from '../types';

interface BookmarkButtonProps {
  article: Article;
  variant?: 'icon' | 'badge' | 'full';
  lang?: 'ar' | 'en';
  className?: string;
}

export const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  article,
  variant = 'icon',
  lang = 'ar',
  className = ''
}) => {
  const isAr = lang === 'ar';
  const { isArticleSaved, saveArticle, unsaveArticle } = useAuth();
  const saved = isArticleSaved(article.id);
  const [justToggled, setJustToggled] = useState<boolean>(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (saved) {
      await unsaveArticle(article.id);
    } else {
      await saveArticle(article);
      setJustToggled(true);
      setTimeout(() => setJustToggled(false), 2000);
    }
  };

  if (variant === 'full') {
    return (
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
    );
  }

  if (variant === 'badge') {
    return (
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
    );
  }

  // الافتراضي: أيقونة فقط
  return (
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
  );
};
