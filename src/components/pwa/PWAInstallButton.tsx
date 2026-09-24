// src/components/pwa/PWAInstallButton.tsx
'use client';

import React, { useState } from 'react';
import { Download, Check, Share2, X, Smartphone, ArrowDown } from 'lucide-react';
import { usePWA } from '../../lib/pwa/usePWA';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'compact' | 'full' | 'banner';
  lang?: 'ar' | 'en';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'compact',
  lang = 'ar'
}) => {
  const isAr = lang === 'ar';
  const { isInstallable, isInstalled, isIOS, install } = usePWA();
  const [showIOSModal, setShowIOSModal] = useState<boolean>(false);
  const [justInstalled, setJustInstalled] = useState<boolean>(false);

  // If already installed as standalone PWA
  if (isInstalled) {
    if (variant === 'compact') return null;
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
        <Check className="w-3.5 h-3.5" />
        <span>{isAr ? 'التطبيق مثبت' : 'App Installed'}</span>
      </div>
    );
  }

  // Handle click
  const handleClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        setJustInstalled(true);
        setTimeout(() => setJustInstalled(false), 3000);
      }
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      // Browser doesn't trigger beforeinstallprompt yet; show helpful hint
      alert(isAr 
        ? 'لتثبيت التطبيق على جهازك: اضغط على خيارات المتصفح (⋮) ثم اختر "تثبيت التطبيق" أو "إضافة إلى الشاشة الرئيسية".' 
        : 'To install: Tap your browser menu (⋮) and select "Install App" or "Add to Home Screen".'
      );
    }
  };

  return (
    <>
      {variant === 'compact' ? (
        <button
          onClick={handleClick}
          type="button"
          className={`px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 via-amber-500/15 to-transparent hover:from-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer ${className}`}
          title={isAr ? 'تثبيت التطبيق على الهاتف أو الحاسوب' : 'Install PWA to Device'}
        >
          <Download className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
          <span>{isAr ? 'تثبيت التطبيق' : 'Install App'}</span>
        </button>
      ) : (
        <button
          onClick={handleClick}
          type="button"
          className={`w-full p-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center justify-between gap-3 shadow-xl shadow-amber-500/10 transition-all active:scale-98 cursor-pointer ${className}`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-950/20 flex items-center justify-center text-slate-950">
              <Download className="w-4 h-4" />
            </div>
            <div className="text-right">
              <div className="font-black text-xs">{isAr ? 'تثبيت تطبيق لافريكونوميست' : 'Install L’Africonomist App'}</div>
              <div className="text-[10px] text-slate-900/80 font-medium">
                {isAr ? 'تصفح أسرع، بدون إنترنت وتنبيهات فورية' : 'Standalone, Offline & Push Alerts'}
              </div>
            </div>
          </div>
          <span className="px-2 py-1 rounded-lg bg-slate-950 text-amber-400 text-[10px] font-bold">
            PWA
          </span>
        </button>
      )}

      {/* iOS Safari Guided Install Sheet */}
      {showIOSModal && (
        <div 
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setShowIOSModal(false)}
        >
          <div 
            className="w-full max-w-sm rounded-3xl bg-[#0B101E] border border-amber-500/40 p-6 shadow-2xl space-y-4 text-right animate-in slide-in-from-bottom-5 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">
                  {isAr ? 'تثبيت التطبيق على iPhone / iPad' : 'Install on iOS Safari'}
                </h3>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="p-1 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {isAr 
                ? 'يدعم تطبيق لافريكونوميست التثبيت المباشر على نظام iOS ليعمل كـ تطبيق أصلي دون شريط المتصفح:'
                : 'Install L’Africonomist on your iOS device for a full native app experience:'}
            </p>

            <ol className="space-y-3 text-xs text-slate-200 pr-1">
              <li className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  1
                </span>
                <span>
                  {isAr ? 'اضغط على زر المشاركة' : 'Tap the Share icon'}{' '}
                  <Share2 className="w-3.5 h-3.5 inline text-blue-400 mx-1" />{' '}
                  {isAr ? 'في أسفل شريط متصفح Safari.' : 'in Safari toolbar.'}
                </span>
              </li>

              <li className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  2
                </span>
                <span>
                  {isAr 
                    ? 'مرر للأسفل واختر "إضافة إلى الشاشة الرئيسية"' 
                    : 'Scroll and select "Add to Home Screen"'} 
                  <strong className="text-amber-400 mx-1">(Add to Home Screen)</strong>.
                </span>
              </li>

              <li className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  3
                </span>
                <span>
                  {isAr ? 'اضغط على "إضافة" (Add) في الزاوية العلوية.' : 'Tap "Add" in the top corner.'}
                </span>
              </li>
            </ol>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
            >
              {isAr ? 'فهمت ذلك' : 'Got it'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
