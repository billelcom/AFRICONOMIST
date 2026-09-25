"use client";

import dynamic from "next/dynamic";

const App = dynamic(() => import("../App"), { 
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#080C14] flex flex-col items-center justify-center gap-3 text-amber-400">
      <div className="flex items-center gap-2">
        <span className="font-brand-artistic font-bold text-xl sm:text-2xl text-white">
          لافريكونوميست
        </span>
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
      </div>
      <p className="text-xs font-serif text-amber-400/80">صحيفة الاقتصاد الإفريقي</p>
    </div>
  )
});

export default function HomePage() {
  return <App />;
}
