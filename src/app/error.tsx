'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Error boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-amber-500">حدث خطأ في النظام</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          {error?.message || 'حدث خطأ مؤقت أثناء معالجة البيانات، يرجى إعادة المحاولة.'}
        </p>
        <button
          onClick={() => reset()}
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-amber-500/20"
        >
          إعادة المحاولة | Retry
        </button>
      </div>
    </div>
  );
}
