'use client';

import dynamic from "next/dynamic";

const PWAInitializer = dynamic(
  () => import("./PWAInitializer").then((mod) => mod.PWAInitializer),
  { ssr: false }
);

const IOSInstallPrompt = dynamic(
  () => import("./IOSInstallPrompt").then((mod) => mod.IOSInstallPrompt),
  { ssr: false }
);

export function PWAClientWrapper() {
  return (
    <>
      <PWAInitializer />
      <IOSInstallPrompt />
    </>
  );
}
