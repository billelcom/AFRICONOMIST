// src/components/pwa/OfflineIndicator.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';
import { usePWA } from '../../lib/pwa/usePWA';

export const OfflineIndicator: React.FC = () => {
  const { isOnline } = usePWA();
  const [showRestoredNotice, setShowRestoredNotice] = useState<boolean>(false);
  const [wasOffline, setWasOffline] = useState<boolean>(false);

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
    } else if (wasOffline) {
      setShowRestoredNotice(true);
      const timer = setTimeout(() => {
        setShowRestoredNotice(false);
        setWasOffline(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  // Offline Notice Banner
  if (!isOnline) {
    return (
      <div 
        role="status"
        aria-live="polite"
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 p-3.5 rounded-2xl bg-[#0F172A]/95 border border-amber-500/40 shadow-2xl backdrop-blur-xl flex items-center justify-between gap-3 text-slate-200 text-xs animate-in slide-in-from-bottom-3 duration-300"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <WifiOff className="w-4 h-4" />
          </div>
          <div className="truncate">
            <div className="font-bold text-white flex items-center gap-1.5">
              <span>وضع عدم الاتصال بالإنترنت</span>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            </div>
            <div className="text-[11px] text-slate-400 truncate">
              تصفح التقارير المخزنة محلياً في الـ PWA
            </div>
          </div>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-[11px] flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" />
          <span>تحديث</span>
        </button>
      </div>
    );
  }

  // Restored Notice
  if (showRestoredNotice) {
    return (
      <div 
        role="status"
        aria-live="polite"
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 p-3.5 rounded-2xl bg-emerald-950/95 border border-emerald-500/50 shadow-2xl backdrop-blur-xl flex items-center gap-2.5 text-emerald-200 text-xs animate-in slide-in-from-bottom-3 duration-300"
      >
        <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
          <Wifi className="w-4 h-4" />
        </div>
        <div>
          <div className="font-bold text-white">تمت استعادة الاتصال بالإنترنت</div>
          <div className="text-[11px] text-emerald-300/80">جاري مزامنة أسواق المال والتقارير الحية...</div>
        </div>
      </div>
    );
  }

  return null;
};
