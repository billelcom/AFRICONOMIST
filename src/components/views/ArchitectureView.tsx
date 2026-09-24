import React, { useState } from 'react';
import { 
  Terminal, 
  FolderTree, 
  FileCode, 
  Copy, 
  Check, 
  Layers, 
  ShieldCheck, 
  Database, 
  Cpu, 
  HelpCircle,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Sparkles,
  BookOpen
} from 'lucide-react';

interface ArchitectureViewProps {
  lang: 'ar' | 'en';
}

export const ArchitectureView: React.FC<ArchitectureViewProps> = ({ lang }) => {
  const isAr = lang === 'ar';
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<'layout' | 'page' | 'country' | 'article' | 'editorial' | 'mongodb' | 'firebase' | 'healthCheck' | 'types'>('layout');
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'src': true,
    'app': true,
    'components': true,
    'lib': true,
    'types': true
  });

  const toggleFolder = (folder: string) => {
    setExpandedFolders(prev => ({ ...prev, [folder]: !prev[folder] }));
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Commands
  const createNextAppCmd = `npx create-next-app@latest africonomist \\
  --typescript \\
  --tailwind \\
  --eslint \\
  --app \\
  --src-dir \\
  --import-alias "@/*" \\
  --use-npm`;

  const installDepsCmd = `npm install lucide-react mongodb zod dompurify motion clsx tailwind-merge
npm install -D @types/dompurify`;

  const shadcnInitCmd = `npx shadcn@latest init -d
# إضافة مكونات shadcn/ui الأساسية التي تحتاجها المنصة:
npx shadcn@latest add button card badge tabs dialog table dropdown-menu input textarea`;

  const gitPushCmd = `# ربط المشروع بـ GitHub ودفع الأكواد
git init
git add .
git commit -m "feat: Africonomist African financial journalism platform initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/africonomist.git
git push -u origin main`;

  // Code snippets
  const codeLayout = `// ============================================================================
// ملف: src/app/layout.tsx
// المنصة: آفريكونوميست | Africonomist
// الدور: الهيكل الجذري الموحد (Root Layout) لجميع صفحات المنصة
// الميزات: يدعم النفاذية (a11y)، تعدد اللغات (RTL/LTR)، وخطوط Google الرسمية
// ============================================================================

import type { Metadata, Viewport } from "next";
import { Cairo, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// 1. استيراد خطوط الويب المحسنة تلقائياً من Next.js
const cairoFont = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const jakartaFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// 2. إعدادات Meta والـ SEO وفق معايير آفريكونوميست
export const metadata: Metadata = {
  title: {
    default: "آفريكونوميست | منصة الصحافة الاقتصادية الأفريقية",
    template: "%s | Africonomist",
  },
  description: "المنصة الرائدة للتحليلات والبيانات الاقتصادية والمالية الأفريقية المدعومة بوكلاء الذكاء الاصطناعي وبإشراف تحريري بشري موثوق.",
  keywords: ["آفريكونوميست", "Africonomist", "اقتصاد أفريقيا", "أسواق المال", "صندوق النقد", "نيجيريا", "مصر", "جنوب أفريقيا", "تكنولوجيا مالية"],
  authors: [{ name: "فريق تحرير آفريكونوميست" }],
  openGraph: {
    title: "آفريكونوميست | Africonomist",
    description: "صحافة اقتصادية ذكية وموثوقة تغطي 54 دولة أفريقية.",
    url: "https://africonomist.com",
    siteName: "Africonomist",
    locale: "ar_AR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#080C14",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // يمكن قراءة اللغة ديناميكياً من cookies أو headers أو مسار i18n
  const currentLang = "ar"; 
  const isRtl = currentLang === "ar";

  return (
    <html 
      lang={currentLang} 
      dir={isRtl ? "rtl" : "ltr"} 
      className={\`\${cairoFont.variable} \${jakartaFont.variable} dark\`}
    >
      <body className="min-h-screen bg-[#080C14] text-slate-100 font-sans antialiased selection:bg-amber-500/30 selection:text-amber-200">
        {/* رابط تخطي المحتوى لتعزيز النفاذية والوصول لذوي الاحتياجات الخاصة (WCAG 2.1) */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-amber-500 focus:text-slate-950 focus:font-bold focus:rounded-md focus:shadow-xl focus:outline-none"
        >
          {isRtl ? "تخطي إلى المحتوى الرئيسي" : "Skip to main content"}
        </a>

        {/* حاوية التطبيق الرئيسية بمعالم ARIA قياسية */}
        <div className="flex flex-col min-h-screen">
          <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}`;

  const codeHome = `// ============================================================================
// ملف: src/app/page.tsx
// الدور: الصفحة الرئيسية (لوحة تحكم الأخبار ومؤشرات الأسواق المالية الأفريقية)
// الميزات: Server Component يجلب المقالات المعتمدة والبيانات اللحظية
// ============================================================================

import { getPublishedArticles } from "@/lib/services/mongodb";
import { getMarketTickers } from "@/lib/services/market-feed";
import { MarketTickerBar } from "@/components/market/ticker-bar";
import { HeroBreakingStory } from "@/components/news/hero-breaking";
import { CountryQuickGrid } from "@/components/market/country-quick-grid";
import { ArticlesGrid } from "@/components/news/articles-grid";

// إعادة توليد الصفحة في الخلفية كل 60 ثانية (Incremental Static Regeneration - ISR)
export const revalidate = 60;

export default async function HomePage() {
  // جلب البيانات بشكل متوازي على الخادم
  const [articles, tickers] = await Promise.all([
    getPublishedArticles({ limit: 12 }),
    getMarketTickers(),
  ]);

  const heroArticle = articles[0];
  const remainingArticles = articles.slice(1);

  return (
    <div className="space-y-8 pb-16">
      {/* شريط مؤشرات الأسواق اللحظي */}
      <MarketTickerBar tickers={tickers} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* الخبر الاستقصائي الرئيسي ومصفوفة الدول */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8">
            <HeroBreakingStory article={heroArticle} />
          </div>
          <div className="lg:col-span-4">
            <CountryQuickGrid />
          </div>
        </div>

        {/* شبكة المقالات والتحليلات الاقتصادية المصنفة */}
        <ArticlesGrid articles={remainingArticles} />
      </div>
    </div>
  );
}`;

  const codeCountry = `// ============================================================================
// ملف: src/app/countries/[countryCode]/page.tsx
// الدور: الصفحة المخصصة لكل دولة أفريقية (مسار ديناميكي: مثل /countries/egypt)
// الميزات: SSG مع generateStaticParams لأعلى أداء و SEO فائق
// ============================================================================

import { notFound } from "next/navigation";
import { getCountryProfile, getAllCountryCodes } from "@/lib/services/countries";
import { getArticlesByCountry } from "@/lib/services/mongodb";
import { MacroIndicatorCard } from "@/components/financial/macro-card";
import { ArticleCard } from "@/components/news/article-card";
import type { Metadata } from "next";

interface CountryPageProps {
  params: Promise<{ countryCode: string }>;
}

// 1. توليد المسارات الثابتة مسبقاً أثناء البناء لجميع الدول الأفريقية الـ 54
export async function generateStaticParams() {
  const codes = await getAllCountryCodes();
  return codes.map((code) => ({ countryCode: code }));
}

// 2. تخصيص الـ Metadata لكل دولة تلقائياً
export async function generateMetadata({ params }: CountryPageProps): Promise<Metadata> {
  const { countryCode } = await params;
  const profile = await getCountryProfile(countryCode);
  if (!profile) return { title: "الدولة غير موجودة" };

  return {
    title: \`اقتصاد \${profile.nameAr} | المؤشرات والأسواق\`,
    description: profile.descriptionAr,
  };
}

export default async function CountryPage({ params }: CountryPageProps) {
  const { countryCode } = await params;
  const profile = await getCountryProfile(countryCode);

  if (!profile) {
    notFound();
  }

  const countryArticles = await getArticlesByCountry(profile.code);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* ترويسة الدولة والوصف الاقتصادي */}
      <div className="p-8 rounded-2xl bg-gradient-to-br from-[#0f172a] to-[#090d16] border border-slate-800">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          اقتصاد {profile.nameAr} ({profile.nameEn})
        </h1>
        <p className="mt-3 text-slate-300 leading-relaxed max-w-4xl">
          {profile.descriptionAr}
        </p>
      </div>

      {/* بطاقات المؤشرات الاقتصادية الكلية (Macro Indicators) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MacroIndicatorCard title="الناتج المحلي" value={profile.gdp} note="IMF" />
        <MacroIndicatorCard title="معدل النمو" value={profile.gdpGrowth} note="World Bank" isPositive />
        <MacroIndicatorCard title="التضخم السنوي" value={profile.inflation} note="CPI YoY" />
        <MacroIndicatorCard title="سعر الفائدة" value={profile.centralBankRate} note="Central Bank" />
      </div>

      {/* المقالات المعتمدة والتحليلات الخاصة بهذه الدولة */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">التقارير الاقتصادية المعتمدة</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {countryArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </div>
  );
}`;

  const codeArticle = `// ============================================================================
// ملف: src/app/articles/[slug]/page.tsx
// الدور: صفحة قراءة المقال الفردي مع تتبع مصادر الذكاء الاصطناعي (Citations)
// الميزات: تطبيق معيار Zero-Trust وعرض نتائج فحص الحقائق وشهادة المحرر البشري
// ============================================================================

import { notFound } from "next/navigation";
import { getArticleBySlug } from "@/lib/services/mongodb";
import { CitationsSidebar } from "@/components/editorial/citations-sidebar";
import { FactCheckReportBox } from "@/components/editorial/fact-check-box";
import { ShieldCheck, Clock, Sparkles } from "lucide-react";
import type { Metadata } from "next";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "المقال غير موجود" };

  return {
    title: article.title,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      type: "article",
      publishedTime: article.publishedAt,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  // حماية صارمة: منع عرض أي مقال إلا إذا كانت حالته "published"
  if (!article || article.status !== "published") {
    notFound();
  }

  return (
    <article className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* ترويسة المقال وعلامات التحقق الخالية من الأقراص الصورية */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
          <span className="text-amber-400 font-bold">{article.category}</span>
          <span>·</span>
          <span>{article.countryName}</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {article.readTimeMinutes} دقائق قراءة
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
          {article.title}
        </h1>

        <p className="text-lg text-slate-300 p-5 rounded-xl bg-slate-900 border-r-4 border-amber-500 leading-relaxed">
          {article.summary}
        </p>

        {/* شارة التحرير المشترك: الذكاء الاصطناعي + المحرر البشري */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between text-xs gap-3">
          <div className="flex items-center gap-2 text-slate-300">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>النموذج: <strong className="font-mono text-slate-200">{article.aiModel}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>اعتماد المدقق البشري: <strong>{article.reviewedBy}</strong></span>
          </div>
        </div>
      </div>

      {/* محتوى المقال + عمود المصادر الموثقة (Citations) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6 text-slate-200 text-lg leading-relaxed">
          {article.content.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>

        <div className="lg:col-span-4 space-y-6">
          <FactCheckReportBox report={article.factCheck} />
          <CitationsSidebar citations={article.citations} />
        </div>
      </div>
    </article>
  );
}`;

  const codeEditorial = `// ============================================================================
// ملف: src/app/(dashboard)/editorial/page.tsx
// الدور: لوحة تحكم المحررين البشريين لمراجعة واعتماد مسودات الذكاء الاصطناعي
// الأمان: محمية عبر Firebase Custom Claims و RBAC (دور HUMAN_EDITOR أو ADMIN فقط)
// ============================================================================

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getDraftsPendingReview } from "@/lib/services/mongodb";
import { ReviewWorkspace } from "@/components/editorial/review-workspace";

export const metadata = {
  title: "بوابة المراجعة التحريرية | Human-in-the-Loop",
  robots: { index: false, follow: false }, // منع محركات البحث من فهرسة اللوحة الداخلية
};

export default async function EditorialDashboardPage() {
  // 1. التحقق الصارم من دور المستخدم (RBAC Zero-Trust)
  const user = await getCurrentUser();
  if (!user || (user.role !== "HUMAN_EDITOR" && user.role !== "ADMIN")) {
    redirect("/login?unauthorized=true");
  }

  // 2. جلب جميع المسودات التي حالتها 'pending_review' فقط
  const pendingDrafts = await getDraftsPendingReview();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white">غرفة الأخبار - اعتماد مسودات الذكاء الاصطناعي</h1>
          <p className="text-xs text-slate-400 mt-1">
            مرحباً بك: {user.name} ({user.role}) · لا يتم نشر أي مقال للعامة دون موافقة صريحة وملاحظة تدقيق.
          </p>
        </div>
        <div className="text-xs font-mono px-3 py-1 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400">
          {pendingDrafts.length} مسودة بانتظار قرارك
        </div>
      </div>

      {/* مساحة عمل الفحص والاعتماد التفاعلية */}
      <ReviewWorkspace initialDrafts={pendingDrafts} reviewerEmail={user.email} />
    </div>
  );
}`;

  const codeMongo = `// ============================================================================
// ملف: src/lib/services/mongodb.ts
// الدور: اتصال آمن بـ MongoDB Atlas مع دعم البحث الدلالي (Vector Search)
// الأمان: عزل أسرار الاتصال في البيئة الخادمة واستخدام Zod لتعقيم البيانات
// ============================================================================

import { MongoClient, Db, Collection } from "mongodb";
import { Article, ArticleSchema } from "@/types";

const uri = process.env.MONGODB_URI!;
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<{ db: Db }> {
  if (cachedDb && cachedClient) {
    return { db: cachedDb };
  }

  if (!uri) {
    throw new Error("يرجى تعريف متغير MONGODB_URI في متغيرات البيئة");
  }

  const client = new MongoClient(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
  });

  await client.connect();
  const db = client.db(process.env.MONGODB_DB_NAME || "africonomist");

  cachedClient = client;
  cachedDb = db;
  return { db };
}

// جلب المقالات المعتمدة والمنشورة فقط للعامة
export async function getPublishedArticles({ limit = 10 }: { limit?: number } = {}) {
  const { db } = await connectToDatabase();
  const collection: Collection<Article> = db.collection("articles");

  return await collection
    .find({ status: "published" })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .toArray();
}

// حفظ مسودة جديدة مولدة من وكيل الذكاء الاصطناعي (حالتها الإلزامية: pending_review)
export async function insertAiDraft(draftData: unknown) {
  // فحص صارم للمخطط (Zod Schema Validation)
  const validated = ArticleSchema.parse({
    ...draftData,
    status: "pending_review", // حظر النشر المباشر برمجياً
    createdAt: new Date().toISOString(),
  });

  const { db } = await connectToDatabase();
  return await db.collection("articles").insertOne(validated);
}

// اعتماد المقال بواسطة المحرر البشري
export async function approveArticleByEditor(articleId: string, editorName: string, note: string) {
  const { db } = await connectToDatabase();
  return await db.collection("articles").updateOne(
    { id: articleId },
    {
      $set: {
        status: "published",
        reviewedBy: editorName,
        reviewNotes: note,
        publishedAt: new Date().toISOString(),
      },
    }
  );
}`;

  const codeFirebase = `// ============================================================================
// ملف: src/lib/services/firebase.ts
// الدور: مصادقة المحررين البشريين (RBAC) وبث أسعار العملات والأسواق لحظياً
// ============================================================================

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// منع إعادة التهيئة عند التحديث السريع (Hot Reload)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// خدمة الهوية والمحررين البشريين (RBAC)
export const auth = getAuth(app);

// خدمة البث الفوري للأسواق ومؤشرات العملات (Realtime Firestore)
export const dbRealtime = getFirestore(app);

export default app;`;

  const codeHealthCheck = `// ============================================================================
// ملف: src/app/api/health-check/route.ts
// الدور: مسار الفحص الذاتي التلقائي (Health-Check API) لـ MongoDB و Firebase
// الاستخدام: ادخل على http://localhost:3000/api/health-check للتأكد من الاتصال
// ============================================================================

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/services/mongodb";
import { auth, dbRealtime } from "@/lib/services/firebase";

export async function GET() {
  const diagnostics: Record<string, any> = {
    timestamp: new Date().toISOString(),
    envVariables: {
      MONGODB_URI: Boolean(process.env.MONGODB_URI),
      MONGODB_DB_NAME: Boolean(process.env.MONGODB_DB_NAME),
      FIREBASE_API_KEY: Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
      FIREBASE_PROJECT_ID: Boolean(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
      GEMINI_API_KEY: Boolean(process.env.GEMINI_API_KEY),
    },
    mongodb: { status: "pending" },
    firebase: { status: "pending" },
  };

  // 1. اختبار الاتصال الحقيقي بقاعدة بيانات MongoDB Atlas
  try {
    const { db } = await connectToDatabase();
    await db.command({ ping: 1 });
    diagnostics.mongodb = {
      status: "SUCCESS ✅",
      message: "تم الاتصال بـ MongoDB Atlas بنجاح فائق!",
      databaseName: db.databaseName,
    };
  } catch (error: any) {
    diagnostics.mongodb = {
      status: "FAILED ❌",
      error: error.message,
      tip: "تأكد من صحة اسم المستخدم وكلمة السر، وتأكد من تفعيل IP Access: 0.0.0.0/0 في MongoDB Atlas.",
    };
  }

  // 2. اختبار تهيئة Firebase
  try {
    if (auth && dbRealtime) {
      diagnostics.firebase = {
        status: "SUCCESS ✅",
        message: "تمت تهيئة Firebase Authentication و Firestore بنجاح!",
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      };
    }
  } catch (error: any) {
    diagnostics.firebase = {
      status: "FAILED ❌",
      error: error.message,
      tip: "تأكد من نسخ قيم firebaseConfig بدقة في ملف .env.local.",
    };
  }

  const allPassed =
    diagnostics.mongodb.status.includes("SUCCESS") &&
    diagnostics.firebase.status.includes("SUCCESS");

  return NextResponse.json(
    {
      overallStatus: allPassed ? "ALL_SYSTEMS_OPERATIONAL 🚀" : "ATTENTION_REQUIRED ⚠️",
      diagnostics,
    },
    { status: allPassed ? 200 : 500 }
  );
}`;

  const codeTypes = `// ============================================================================
// ملف: src/types/index.ts
// الدور: تعريف الأنواع الصارمة للمقالات والوكلاء والأسواق ومصادر التوثيق
// ============================================================================

import { z } from "zod";

export type ArticleStatus = 'draft' | 'pending_review' | 'published' | 'rejected' | 'revision_requested';

export type UserRole = 'HUMAN_EDITOR' | 'ADMIN' | 'AI_AGENT_INGEST' | 'AI_AGENT_WRITER' | 'GUEST';

export const CitationSchema = z.object({
  id: z.string(),
  sourceName: z.string(),
  url: z.string().url(),
  publishDate: z.string(),
  verified: z.boolean(),
  credibilityScore: z.number().min(0).max(100),
  snippet: z.string(),
});

export const FactCheckSchema = z.object({
  score: z.number().min(0).max(100),
  verifiedClaimsCount: z.number(),
  totalClaimsCount: z.number(),
  biasRating: z.enum(['Neutral', 'Slight Bias', 'High Bias']),
  riskScore: z.enum(['Low', 'Medium', 'High']),
  checkedAt: z.string(),
});

export const ArticleSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string().min(5),
  summary: z.string().min(10),
  content: z.array(z.string()),
  category: z.enum(['Energy', 'FinTech', 'Agribusiness', 'Mining', 'Macroeconomics', 'Markets']),
  countryCode: z.string(),
  countryName: z.string(),
  status: z.enum(['draft', 'pending_review', 'published', 'rejected', 'revision_requested']),
  authorType: z.enum(['AI_AGENT', 'HUMAN_JOURNALIST', 'HYBRID']),
  aiModel: z.string().optional(),
  reviewedBy: z.string().optional(),
  reviewNotes: z.string().optional(),
  citations: z.array(CitationSchema).min(1, "يجب توفير مصدر موثق واحد على الأقل"),
  factCheck: FactCheckSchema,
  publishedAt: z.string().optional(),
  createdAt: z.string(),
  readTimeMinutes: z.number(),
  featured: z.boolean().default(false),
});

export type Article = z.infer<typeof ArticleSchema>;
export type Citation = z.infer<typeof CitationSchema>;
export type FactCheckReport = z.infer<typeof FactCheckSchema>;`;

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-24">
      {/* Title & Introductory Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-[#0c1220] border border-amber-500/30 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400 font-mono">
          <Layers className="w-4 h-4" />
          <span>SENIOR FRONTEND ARCHITECT SPECIFICATION</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          {isAr ? 'الأساس البرمجي والمعمارية الكاملة لمنصة آفريكونوميست (Africonomist)' : 'Africonomist Full Scaffolding Blueprint'}
        </h1>
        <p className="text-sm text-slate-300 max-w-4xl leading-relaxed">
          {isAr
            ? 'دليل مهندس البرمجيات خطوة بخطوة: الأوامر الطرفية المباشرة، أوامر الربط بـ GitHub، هيكلية المجلدات المفصلة مع الشرح للمبتدئين، ونماذج الأكواد الحية لـ Next.js App Router مع تطبيق بروتوكول Zero-Trust و Human-in-the-Loop.'
            : 'Production-ready architecture for Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, MongoDB Atlas, and Human-in-the-Loop editorial control.'}
        </p>
      </div>

      {/* ========================================================================= */}
      {/* القسم الأول: الأوامر الدقيقة في موجه الأوامر (Terminal Commands) */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <Terminal className="w-5 h-5 text-amber-400" />
          <h2 className="text-xl font-bold text-white">
            {isAr ? 'أولاً: الأمر (Command) الدقيق لإنشاء المشروع في موجه الأوامر' : 'Part 1: Exact Terminal Creation Commands'}
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {isAr
            ? 'افتح موجه الأوامر (Terminal / PowerShell) في جهازك واكتب هذا الأمر الدقيق دفعة واحدة. سيقوم الأمر بإنشاء مشروع Next.js حديث مع تفعيل TypeScript، Tailwind CSS، App Router، ودليل src تلقائياً دون الحاجة للإجابة على الأسئلة التفاعلية:'
            : 'Run this exact command in your terminal to bootstrap a pristine Next.js project with App Router, TypeScript, Tailwind CSS, and src directory:'}
        </p>

        {/* Command 1: create-next-app */}
        <div className="rounded-xl bg-[#070b12] border border-slate-800 overflow-hidden shadow-lg">
          <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
              1. أمر إنشاء المشروع (Create Next.js Project)
            </span>
            <button
              onClick={() => handleCopy('cmd1', createNextAppCmd)}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors font-mono"
            >
              {copiedId === 'cmd1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedId === 'cmd1' ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ الأمر' : 'Copy')}</span>
            </button>
          </div>
          <pre className="p-4 text-xs sm:text-sm font-mono text-emerald-300 overflow-x-auto leading-relaxed" dir="ltr">
            {createNextAppCmd}
          </pre>
        </div>

        {/* Beginner Flag Breakdown */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
          <h4 className="font-bold text-amber-400 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4" />
            {isAr ? 'شرح للمبتدئين: ماذا تعني كل راية (Flag) في هذا الأمر؟' : 'Beginner Guide: What each flag does:'}
          </h4>
          <ul className="space-y-1.5 text-slate-300 list-disc list-inside leading-relaxed">
            <li><code className="text-amber-300 font-mono">--typescript</code>: يُلزم المشروع باستخدام TypeScript الصارم لتقليل الأخطاء عند تداول البيانات المالية.</li>
            <li><code className="text-amber-300 font-mono">--tailwind</code>: يقوم بتهيئة Tailwind CSS تلقائياً داخل المشروع لكتابة التصاميم بسرعة.</li>
            <li><code className="text-amber-300 font-mono">--app</code>: يفعّل نظام التوجيه الحديث (App Router) بدلاً من Pages القديم.</li>
            <li><code className="text-amber-300 font-mono">--src-dir</code>: يضع كود التطبيق بالكامل داخل مجلد <code className="text-amber-300 font-mono">src/</code> للحفاظ على نظافة جذر المشروع.</li>
            <li><code className="text-amber-300 font-mono">--import-alias "@/*"</code>: يتيح لك استيراد الملفات بسهولة مثل <code className="text-amber-300 font-mono">@/components</code> بدلاً من <code className="text-amber-300 font-mono">../../../components</code>.</li>
          </ul>
        </div>

        {/* Command 2 & 3 & GitHub: Additional packages, shadcn & GitHub */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="rounded-xl bg-[#070b12] border border-slate-800 overflow-hidden shadow-lg">
            <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-300">2. تثبيت الحزم (Security & DB)</span>
              <button
                onClick={() => handleCopy('cmd2', installDepsCmd)}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-mono"
              >
                {copiedId === 'cmd2' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>نسخ</span>
              </button>
            </div>
            <pre className="p-3 text-xs font-mono text-emerald-300 overflow-x-auto" dir="ltr">
              {installDepsCmd}
            </pre>
          </div>

          <div className="rounded-xl bg-[#070b12] border border-slate-800 overflow-hidden shadow-lg">
            <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-300">3. تهيئة وتثبيت shadcn/ui</span>
              <button
                onClick={() => handleCopy('cmd3', shadcnInitCmd)}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-mono"
              >
                {copiedId === 'cmd3' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>نسخ</span>
              </button>
            </div>
            <pre className="p-3 text-xs font-mono text-emerald-300 overflow-x-auto" dir="ltr">
              {shadcnInitCmd}
            </pre>
          </div>

          <div className="rounded-xl bg-[#070b12] border border-slate-800 overflow-hidden shadow-lg">
            <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-400">4. الربط والدفع لـ GitHub</span>
              <button
                onClick={() => handleCopy('cmd4', gitPushCmd)}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-mono"
              >
                {copiedId === 'cmd4' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>نسخ</span>
              </button>
            </div>
            <pre className="p-3 text-xs font-mono text-amber-300 overflow-x-auto" dir="ltr">
              {gitPushCmd}
            </pre>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* القسم الثاني: هيكل المجلدات المقترح وشرحه بالتفصيل للمبتدئين */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <FolderTree className="w-5 h-5 text-amber-400" />
          <h2 className="text-xl font-bold text-white">
            {isAr ? 'ثانياً: هيكل المجلدات المقترح (Component-Driven Architecture)' : 'Part 2: Proposed Component-Driven Folder Structure'}
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {isAr
            ? 'تم تصميم هذا الهيكل ليفصل فصلاً تاماً بين واجهات المستخدم (UI)، منطق الاتصال بالخادم وقاعدة البيانات (lib/services)، وأنواع البيانات الصارمة (types)، مع توفير كافة المسارات المطلوبة بدقة:'
            : 'Designed to strictly separate presentation (UI), data services (lib/services), and strict types, fully supporting dynamic routes and hidden editorial RBAC:'}
        </p>

        {/* Visual Interactive Directory Tree */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Tree Explorer (5 Cols) */}
          <div className="lg:col-span-5 p-4 rounded-xl bg-[#070b12] border border-slate-800 font-mono text-xs text-slate-300 space-y-1" dir="ltr">
            <div className="text-amber-400 font-bold mb-2 pb-1 border-b border-slate-800 flex items-center gap-1.5">
              <FolderTree className="w-4 h-4" />
              <span>africonomist/</span>
            </div>

            {/* src */}
            <div className="pl-2">
              <span className="text-amber-300 font-semibold cursor-pointer" onClick={() => toggleFolder('src')}>
                📁 src/
              </span>
              
              {/* app */}
              <div className="pl-4 space-y-0.5 border-l border-slate-800/80 my-1">
                <span className="text-indigo-300 font-semibold cursor-pointer" onClick={() => toggleFolder('app')}>
                  📁 app/ <span className="text-[10px] text-slate-500 font-sans">(مسارات Next.js App Router)</span>
                </span>
                <div className="pl-4 space-y-0.5 border-l border-slate-800/80">
                  <div className="text-emerald-400 font-medium">📄 layout.tsx <span className="text-[10px] text-slate-500 font-sans">(الهيكل الموحد و a11y)</span></div>
                  <div className="text-emerald-400 font-medium">📄 page.tsx <span className="text-[10px] text-slate-500 font-sans">(1. الرئيسية والأسواق)</span></div>
                  <div className="text-slate-400">📄 globals.css</div>
                  
                  {/* Dynamic Countries */}
                  <div className="pt-1">
                    <span className="text-amber-200">📁 countries/</span>
                    <div className="pl-3 border-l border-slate-800">
                      <span className="text-amber-400 font-bold">📁 [countryCode]/</span>
                      <div className="pl-3 border-l border-slate-800 text-emerald-400">
                        📄 page.tsx <span className="text-[10px] text-slate-500 font-sans">(2. صفحة الدولة)</span>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Articles */}
                  <div className="pt-1">
                    <span className="text-amber-200">📁 articles/</span>
                    <div className="pl-3 border-l border-slate-800">
                      <span className="text-amber-400 font-bold">📁 [slug]/</span>
                      <div className="pl-3 border-l border-slate-800 text-emerald-400">
                        📄 page.tsx <span className="text-[10px] text-slate-500 font-sans">(3. المقال الفردي)</span>
                      </div>
                    </div>
                  </div>

                  {/* Hidden Editorial Dashboard */}
                  <div className="pt-1">
                    <span className="text-rose-300 font-bold">📁 (dashboard)/</span>
                    <div className="pl-3 border-l border-slate-800">
                      <span className="text-rose-400">📁 editorial/</span>
                      <div className="pl-3 border-l border-slate-800 text-emerald-400">
                        📄 page.tsx <span className="text-[10px] text-slate-500 font-sans">(4. لوحة التحرير المخفية)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* components */}
                <div className="pt-2">
                  <span className="text-indigo-300 font-semibold cursor-pointer" onClick={() => toggleFolder('components')}>
                    📁 components/ <span className="text-[10px] text-slate-500 font-sans">(مكتبة المكونات)</span>
                  </span>
                  <div className="pl-4 space-y-0.5 border-l border-slate-800/80">
                    <div>📁 ui/ <span className="text-[10px] text-slate-500 font-sans">(مكونات shadcn/ui)</span></div>
                    <div>📁 news/ <span className="text-[10px] text-slate-500 font-sans">(بطاقات الأخبار وشبكات العرض)</span></div>
                    <div>📁 financial/ <span className="text-[10px] text-slate-500 font-sans">(المؤشرات ومخططات السوق)</span></div>
                    <div>📁 editorial/ <span className="text-[10px] text-slate-500 font-sans">(لوحة المراجعة والتوثيق)</span></div>
                  </div>
                </div>

                {/* lib / services */}
                <div className="pt-2">
                  <span className="text-indigo-300 font-semibold cursor-pointer" onClick={() => toggleFolder('lib')}>
                    📁 lib/ <span className="text-[10px] text-slate-500 font-sans">(المنطق وقواعد البيانات)</span>
                  </span>
                  <div className="pl-4 space-y-0.5 border-l border-slate-800/80">
                    <div>📁 services/</div>
                    <div className="pl-3 border-l border-slate-800 text-slate-300">
                      <div>📄 mongodb.ts <span className="text-[10px] text-slate-500 font-sans">(MongoDB Atlas)</span></div>
                      <div>📄 ai-agent.ts <span className="text-[10px] text-slate-500 font-sans">(وكيل الذكاء الاصطناعي)</span></div>
                      <div>📄 market-feed.ts <span className="text-[10px] text-slate-500 font-sans">(أسعار العملات والسلع)</span></div>
                    </div>
                    <div>📄 auth.ts <span className="text-[10px] text-slate-500 font-sans">(التحقق و RBAC)</span></div>
                    <div>📄 utils.ts <span className="text-[10px] text-slate-500 font-sans">(مساعدات Tailwind)</span></div>
                  </div>
                </div>

                {/* types */}
                <div className="pt-2">
                  <span className="text-indigo-300 font-semibold cursor-pointer" onClick={() => toggleFolder('types')}>
                    📁 types/ <span className="text-[10px] text-slate-500 font-sans">(مخططات TypeScript الصارمة)</span>
                  </span>
                  <div className="pl-4 space-y-0.5 border-l border-slate-800/80 text-slate-300">
                    <div>📄 index.ts <span className="text-[10px] text-slate-500 font-sans">(Article, Citation, FactCheck)</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Beginner Directory Breakdown (7 Cols) */}
          <div className="lg:col-span-7 space-y-3">
            <h3 className="text-sm font-bold text-amber-400">
              {isAr ? 'شرح مبسط لكل مجلد وسبب اختياره في هذا المكان:' : 'Directory explanations and design intent:'}
            </h3>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
              <span className="font-bold text-emerald-400 block font-mono">1. مجلد src/app/ (المسارات والتوجيه)</span>
              <p className="text-slate-300 leading-relaxed">
                في Next.js App Router، كل مجلد داخل <code className="text-amber-300">app</code> يمثل رابطاً (URL) في المتصفح. مثلاً مجلد <code className="text-amber-300">countries</code> يؤدي للرابط <code className="text-amber-300">/countries</code>.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
              <span className="font-bold text-amber-400 block font-mono">2. المسارات الديناميكية [countryCode] و [slug]</span>
              <p className="text-slate-300 leading-relaxed">
                الأقواس المربعة تعني أن هذا الجزء متغير ديناميكياً! فبدلاً من إنشاء 54 مجلداً يدوياً لكل دولة أفريقية، ننشئ مجلداً واحداً باسم <code className="text-amber-300">[countryCode]</code> ليتعامل برمجياً مع <code className="text-amber-300">/countries/egypt</code> أو <code className="text-amber-300">/countries/nigeria</code>.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
              <span className="font-bold text-rose-400 block font-mono">3. مجموعة المسار المخفية (dashboard)/</span>
              <p className="text-slate-300 leading-relaxed">
                وضع المجلد بين قوسين دائريين <code className="text-amber-300">(dashboard)</code> يُعرف في Next.js باسم "Route Group". فائدته أنه ينظم ملفات لوحة التحكم التحريرية دون أن يظهر اسم المجلد في رابط المتصفح، فيكون الرابط نظيفاً ومختصراً: <code className="text-amber-300">/editorial</code>.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
              <span className="font-bold text-indigo-400 block font-mono">4. فصل المكونات (Component-Driven) داخل src/components/</span>
              <p className="text-slate-300 leading-relaxed">
                فصلنا واجهات المستخدم إلى ذرات مستقلة: <code className="text-slate-300">components/ui</code> لمكونات shadcn مثل الأزرار والقوائم، و <code className="text-slate-300">components/financial</code> للرسوم البيانية ومؤشرات السوق، و <code className="text-slate-300">components/editorial</code> لأدوات المراجعة والتوثيق. هذا يمنع تضخم ملفات الصفحات ويسهل اختبار كل مكون منفرداً.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
              <span className="font-bold text-cyan-400 block font-mono">5. مجلد src/lib/services/ و src/types/</span>
              <p className="text-slate-300 leading-relaxed">
                هنا يكمن منطق العمل (Business Logic) واتصال MongoDB Atlas وعزل مفاتيح الذكاء الاصطناعي وتطبيق التحقق الصارم بمكتبة Zod. لا يتم وضع منطق قواعد البيانات إطلاقاً داخل ملفات الواجهة لتفادي الثغرات الأمنية.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* القسم الثالث: الأكواد النموذجية الجاهزة للاستخدام الفوري */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <FileCode className="w-5 h-5 text-amber-400" />
          <h2 className="text-xl font-bold text-white">
            {isAr ? 'ثالثاً: الأكواد البرمجية النموذجية (Ready-to-use Code)' : 'Part 3: Ready-to-use Next.js Production Code'}
          </h2>
        </div>

        {/* Code Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-900 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveCodeTab('layout')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
              activeCodeTab === 'layout'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            app/layout.tsx (المطلوب)
          </button>

          <button
            onClick={() => setActiveCodeTab('page')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
              activeCodeTab === 'page'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            app/page.tsx (الرئيسية)
          </button>

          <button
            onClick={() => setActiveCodeTab('country')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
              activeCodeTab === 'country'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            app/countries/[slug]/page.tsx
          </button>

          <button
            onClick={() => setActiveCodeTab('article')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
              activeCodeTab === 'article'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            app/articles/[slug]/page.tsx
          </button>

          <button
            onClick={() => setActiveCodeTab('editorial')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
              activeCodeTab === 'editorial'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            app/editorial/page.tsx (اللوحة المخفية)
          </button>

          <button
            onClick={() => setActiveCodeTab('mongodb')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
              activeCodeTab === 'mongodb'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            lib/services/mongodb.ts
          </button>

          <button
            onClick={() => setActiveCodeTab('firebase')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
              activeCodeTab === 'firebase'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            lib/services/firebase.ts
          </button>

          <button
            onClick={() => setActiveCodeTab('healthCheck')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
              activeCodeTab === 'healthCheck'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-emerald-400 hover:text-white hover:bg-emerald-950/40 border border-emerald-500/30'
            }`}
          >
            api/health-check/route.ts (الفحص)
          </button>

          <button
            onClick={() => setActiveCodeTab('types')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
              activeCodeTab === 'types'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            types/index.ts
          </button>
        </div>

        {/* Active Code Box */}
        <div className="rounded-xl bg-[#070b12] border border-slate-800 overflow-hidden shadow-2xl">
          <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-slate-200">
              {activeCodeTab === 'layout' && 'src/app/layout.tsx'}
              {activeCodeTab === 'page' && 'src/app/page.tsx'}
              {activeCodeTab === 'country' && 'src/app/countries/[countryCode]/page.tsx'}
              {activeCodeTab === 'article' && 'src/app/articles/[slug]/page.tsx'}
              {activeCodeTab === 'editorial' && 'src/app/(dashboard)/editorial/page.tsx'}
              {activeCodeTab === 'mongodb' && 'src/lib/services/mongodb.ts'}
              {activeCodeTab === 'firebase' && 'src/lib/services/firebase.ts'}
              {activeCodeTab === 'healthCheck' && 'src/app/api/health-check/route.ts'}
              {activeCodeTab === 'types' && 'src/types/index.ts'}
            </span>

            <button
              onClick={() => {
                const map = {
                  layout: codeLayout,
                  page: codeHome,
                  country: codeCountry,
                  article: codeArticle,
                  editorial: codeEditorial,
                  mongodb: codeMongo,
                  firebase: codeFirebase,
                  healthCheck: codeHealthCheck,
                  types: codeTypes,
                };
                handleCopy('active-code', map[activeCodeTab]);
              }}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors font-mono"
            >
              {copiedId === 'active-code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedId === 'active-code' ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ الكود' : 'Copy Code')}</span>
            </button>
          </div>

          <pre className="p-5 text-xs sm:text-sm font-mono text-slate-200 overflow-x-auto max-h-[550px] leading-relaxed" dir="ltr">
            {activeCodeTab === 'layout' && codeLayout}
            {activeCodeTab === 'page' && codeHome}
            {activeCodeTab === 'country' && codeCountry}
            {activeCodeTab === 'article' && codeArticle}
            {activeCodeTab === 'editorial' && codeEditorial}
            {activeCodeTab === 'mongodb' && codeMongo}
            {activeCodeTab === 'firebase' && codeFirebase}
            {activeCodeTab === 'healthCheck' && codeHealthCheck}
            {activeCodeTab === 'types' && codeTypes}
          </pre>
        </div>
      </section>
    </div>
  );
};
