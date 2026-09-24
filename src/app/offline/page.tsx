"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { WifiOff, RefreshCw, BookOpen, ShieldAlert } from "lucide-react";

export default function OfflinePage() {
  const [isReconnected, setIsReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsReconnected(true);
      window.location.href = "/";
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, []);

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#0B101E] border border-slate-800 rounded-3xl p-6 sm:p-8 text-center shadow-2xl space-y-5">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <WifiOff className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold font-mono">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          <span>وضع العمل بدون إنترنت · PWA Offline</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-black text-white">
            انقطع الاتصال بالإنترنت
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            تم تفعيل وضع التخزين المؤقت المحلي الذكي لصحيفة لافريكونوميست. يمكنك
            متابعة قراءة التقارير والبيانات المحملة مسبقاً في جهازك بأمان وسرعة.
          </p>
        </div>

        <div className="pt-2 space-y-2">
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>إعادة محاولة الاتصال</span>
          </button>

          <Link
            href="/"
            className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-bold flex items-center justify-center gap-2 transition-all block"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>العودة للتقارير المخزنة مؤقتاً</span>
          </Link>
        </div>

        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          <span>يتم تفعيل المزامنة التلقائية عند عودة الشبكة</span>
        </div>
      </div>
    </div>
  );
}
