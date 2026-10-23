'use client';

import React, { useState, useEffect } from 'react';
import { Share, X, PlusSquare } from 'lucide-react';
import Image from 'next/image';

export const IOSInstallPrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // 1. Check if iOS
    const isIOS = /iPhone|iPad|iPod/.test(window.navigator.userAgent);
    
    // 2. Check if already installed (standalone mode)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        (window.navigator as any).standalone;

    // 3. Check if user already dismissed it in this session
    const isDismissed = sessionStorage.getItem('ios-pwa-prompt-dismissed');

    if (isIOS && !isStandalone && !isDismissed) {
      // Delay prompt slightly for better UX
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem('ios-pwa-prompt-dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div
      className="fixed bottom-6 left-4 right-6 z-[100] md:left-auto md:right-6 md:w-96 animate-in slide-in-from-bottom-5 duration-500"
    >
      <div className="relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-5 text-right rtl">
        {/* Close Button */}
        <button 
          onClick={handleDismiss}
          className="absolute top-3 left-3 p-1 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <Image src="/pwa-192x192.png" alt="App Icon" width={40} height={40} className="rounded-lg shadow-sm" referrerPolicy="no-referrer" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-white">تثبيت &quot;لافريكونوميست&quot;</h3>
              <p className="text-[11px] text-slate-400 line-clamp-1">ثبّت التطبيق على شاشة جهازك الرئيسية</p>
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-800/60">
            <p className="text-xs text-slate-300 leading-relaxed">
              للحصول على تجربة تطبيق متكاملة على جهاز الأيفون الخاص بك:
            </p>
            
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-3 text-xs text-slate-200">
                <div className="w-6 h-6 rounded-md bg-slate-800 flex items-center justify-center shrink-0">
                  <Share className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <span>1. اضغط على زر <strong>المشاركة</strong> في الأسفل</span>
              </div>
              
              <div className="flex items-center gap-3 text-xs text-slate-200">
                <div className="w-6 h-6 rounded-md bg-slate-800 flex items-center justify-center shrink-0">
                  <PlusSquare className="w-3.5 h-3.5 text-slate-300" />
                </div>
                <span>2. اختر <strong>&quot;إضافة إلى الشاشة الرئيسية&quot;</strong></span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleDismiss}
            className="mt-2 w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors"
          >
            حسناً، فهمت
          </button>
        </div>

        {/* Decorative arrow pointing down to Safari share button area */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900 border-r border-b border-slate-800 rotate-45 md:hidden"></div>
      </div>
    </div>
  );
};

