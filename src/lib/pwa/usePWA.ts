// src/lib/pwa/usePWA.ts
import { useState, useEffect, useCallback } from 'react';
import { subscribeUserToPush } from './registerServiceWorker';
import { shareContent } from './webShare';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function usePWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isPushSupported, setIsPushSupported] = useState<boolean>(false);
  const [isPushSubscribed, setIsPushSubscribed] = useState<boolean>(false);
  const [pushLoading, setPushLoading] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Detect Standalone / Installed mode
    const checkStandalone = () => {
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes('android-app://');
      setIsInstalled(isStandalone);
    };

    checkStandalone();
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleMediaChange = (e: MediaQueryListEvent) => setIsInstalled(e.matches);
    mediaQuery.addEventListener('change', handleMediaChange);

    // 2. Detect iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // 3. Online / Offline status
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 4. Capture beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // 5. Check Push Notification status
    if ('serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window) {
      setIsPushSupported(true);
      if (Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then((reg) => {
          reg.pushManager.getSubscription().then((sub) => {
            setIsPushSubscribed(!!sub);
          });
        });
      }
    }

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Install Action
  const install = useCallback(async (): Promise<boolean> => {
    if (!deferredPrompt) return false;
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setIsInstallable(false);
        setDeferredPrompt(null);
        return true;
      }
      return false;
    } catch (err) {
      console.error('[PWA] Prompt error:', err);
      return false;
    }
  }, [deferredPrompt]);

  // Subscribe to Web Push
  const enablePush = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    setPushLoading(true);
    try {
      const res = await subscribeUserToPush();
      if (res.success) {
        setIsPushSubscribed(true);
      }
      return res;
    } finally {
      setPushLoading(false);
    }
  }, []);

  // Send a test notification
  const sendTestNotification = useCallback(async (title?: string, body?: string) => {
    try {
      const res = await fetch('/api/push/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title || 'لافريكونوميست | عاجل أسواق المال 📈',
          body: body || 'ارتفاع مؤشرات بورصة الدار البيضاء ومصر مع إغلاق سندات السيادة الإفريقية على مكاسب.',
          url: '/?tab=home'
        })
      });
      return await res.json();
    } catch (err: any) {
      return { error: err.message };
    }
  }, []);

  // Share Application
  const shareApp = useCallback(async (customPayload?: { title?: string; text?: string; url?: string }) => {
    return shareContent(customPayload || {
      title: 'لافريكونوميست | L’Africonomist',
      text: 'الصحيفة الاقتصادية الإفريقية الرائدة - رصد وتدقيق أسواق المال والسياسات النقدية واستثمارات 54 دولة أفريقية.',
      url: typeof window !== 'undefined' ? window.location.origin : 'https://africonomist.com'
    });
  }, []);

  return {
    isInstallable,
    isInstalled,
    isIOS,
    install,
    isOnline,
    isPushSupported,
    isPushSubscribed,
    pushLoading,
    enablePush,
    sendTestNotification,
    shareApp
  };
}
