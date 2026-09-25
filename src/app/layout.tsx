import type { Metadata, Viewport } from "next";
import "../index.css";
import { PWAInitializer } from "../components/pwa/PWAInitializer";

export const viewport: Viewport = {
  themeColor: "#070A12",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "لافريكونوميست | صحيفة الاقتصاد الإفريقي",
  description: "لافريكونوميست - صحيفة الاقتصاد الإفريقي، رصد وتدقيق أسواق المال والسياسات النقدية واستثمارات 54 دولة أفريقية",
  manifest: "/manifest.webmanifest",
  applicationName: "لافريكونوميست",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "لافريكونوميست",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/pwa-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/pwa-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className="dark" suppressHydrationWarning>
      <body className="bg-[#080C14] text-slate-100 min-h-screen" suppressHydrationWarning>
        <PWAInitializer />
        {children}
      </body>
    </html>
  );
}
