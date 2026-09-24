import type { Metadata } from "next";
import "../index.css"; // أو "./globals.css" حسب اسم الملف الموجود لديك

export const metadata: Metadata = {
    title: "لافريكونوميست | صحيفة الاقتصاد الإفريقي",
    description: "لافريكونوميست - صحيفة الاقتصاد الإفريقي، رصد وتدقيق أسواق المال والسياسات النقدية واستثمارات 54 دولة أفريقية",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ar" dir="rtl" className="dark">
            <body className="bg-[#080C14] text-slate-100 min-h-screen">
                {children}
            </body>
        </html>
    );
}