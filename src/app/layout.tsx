import type { Metadata, Viewport } from "next";
import "../index.css";
import { PWAClientWrapper } from "../components/pwa/PWAClientWrapper";

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
  manifest: "/manifest.json", // This will match the generated manifest from manifest.ts
  applicationName: "لافريكونوميست",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "لافريكونوميست",
    startupImage: [
      {
        url: "/pwa-512x512.png",
        media: "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)",
      },
    ],
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

import { AuthProvider } from "../context/AuthContext";
import { ThemeProvider } from "../context/ThemeContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className="dark" data-theme="standard" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
              try {
                var t = localStorage.getItem('africonomist_theme_preference_v1');
                if (t === 'light' || t === 'night' || t === 'standard') {
                  document.documentElement.setAttribute('data-theme', t);
                  document.documentElement.classList.remove('theme-standard','theme-light','theme-night');
                  document.documentElement.classList.add('theme-' + t);
                  if (t === 'light') {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                  }
                }
              } catch(e) {}
            })();`,
          }}
        />
      </head>
      <body className="bg-[#080C14] text-slate-100 min-h-screen" suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>
            <PWAClientWrapper />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
