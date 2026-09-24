'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-[#080C14] text-slate-100 flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <div className="space-y-4 max-w-md">
          <h2 className="text-2xl font-bold text-amber-500">حدث خطأ عام في التطبيق</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            {error?.message || 'واجه النظام خطأ غير متوقع. يرجى إعادة تحميل الصفحة.'}
          </p>
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-amber-500/20"
          >
            إعادة المحاولة | Reload
          </button>
        </div>
      </body>
    </html>
  );
}
