import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-4">
        <h1 className="text-6xl font-black text-amber-500 font-mono">404</h1>
        <h2 className="text-xl font-bold text-slate-200">الصفحة غير موجودة | Page Not Found</h2>
        <p className="text-sm text-slate-400">
          لم يتم العثور على الصفحة المطلوبة في منصة أفريكونوميست.
        </p>
        <Link
          href="/"
          className="inline-block px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-colors shadow-lg shadow-amber-500/20"
        >
          العودة للرئيسية | Back to Home
        </Link>
      </div>
    </div>
  );
}
