// src/components/ShareButton.tsx
'use client';

import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { shareContent } from '../lib/pwa/webShare';

interface ShareButtonProps {
  lang: 'ar' | 'en';
  variant?: 'drawer-item' | 'footer' | 'icon';
  className?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  lang,
  variant = 'drawer-item',
  className = ''
}) => {
  const isAr = lang === 'ar';
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const res = await shareContent({
      title: isAr ? 'لافريكونوميست | صحيفة الاقتصاد الإفريقي' : 'L’Africonomist | African Economic Journal',
      text: isAr 
        ? 'رصد وتدقيق أسواق المال والسياسات النقدية واستثمارات 54 دولة أفريقية.' 
        : 'Comprehensive macroeconomic coverage of 54 African economies.',
      url: typeof window !== 'undefined' ? window.location.origin : 'https://africonomist.com'
    });

    if (res.method === 'clipboard') {
      setToastMessage(isAr ? 'تم نسخ رابط المنصة إلى الحافظة بنجاح!' : 'Platform link copied to clipboard!');
      setTimeout(() => setToastMessage(null), 3000);
    } else if (res.shared) {
      setToastMessage(isAr ? 'شكراً لمشاركتك المنصة!' : 'Thanks for sharing!');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <>
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-2xl flex items-center gap-2 animate-in fade-in duration-200">
          <Check className="w-3.5 h-3.5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {variant === 'drawer-item' ? (
        <button
          type="button"
          onClick={handleShare}
          className={`w-full p-2.5 rounded-xl text-right rtl:text-right ltr:text-left flex items-center justify-between border border-slate-800/80 bg-slate-900/60 hover:bg-slate-800/70 text-slate-300 hover:text-white transition-all cursor-pointer ${className}`}
          title={isAr ? 'مشاركة رابط المنصة' : 'Share Platform'}
        >
          <div className="flex items-center gap-2 truncate">
            <Share2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="truncate">{isAr ? 'مشاركة المنصة' : 'Share Platform'}</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            {isAr ? 'نشر' : 'Share'}
          </span>
        </button>
      ) : variant === 'footer' ? (
        <button
          type="button"
          onClick={handleShare}
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-800 hover:border-amber-500/40 text-xs font-bold transition-all shadow-sm cursor-pointer ${className}`}
          title={isAr ? 'مشاركة رابط المنصة' : 'Share Africonomist'}
        >
          <Share2 className="w-3.5 h-3.5 text-amber-400" />
          <span>{isAr ? 'مشاركة المنصة' : 'Share Platform'}</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={handleShare}
          className={`p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-800 transition-colors text-xs flex items-center justify-center cursor-pointer ${className}`}
          title={isAr ? 'مشاركة المنصة' : 'Share Platform'}
          aria-label="Share"
        >
          <Share2 className="w-3.5 h-3.5 text-blue-400" />
        </button>
      )}
    </>
  );
};
