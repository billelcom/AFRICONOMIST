// src/components/pwa/PWAInitializer.tsx
'use client';

import React, { useEffect } from 'react';
import { registerServiceWorker } from '../../lib/pwa/registerServiceWorker';
import { flushOfflineQueue } from '../../lib/pwa/backgroundSync';
import { OfflineIndicator } from './OfflineIndicator';

export const PWAInitializer: React.FC = () => {
  useEffect(() => {
    // Register Service Worker in production and dev environment
    registerServiceWorker();

    // Attempt to flush any offline items from previous session
    if (typeof window !== 'undefined' && navigator.onLine) {
      flushOfflineQueue();
    }

    // Listen to messages from Service Worker (e.g., SYNC_COMPLETED)
    if ('serviceWorker' in navigator) {
      const handleMessage = (event: MessageEvent) => {
        if (event.data && event.data.type === 'SYNC_COMPLETED') {
          console.log('[PWA] Service worker message received:', event.data.message);
        }
      };

      navigator.serviceWorker.addEventListener('message', handleMessage);
      return () => {
        navigator.serviceWorker.removeEventListener('message', handleMessage);
      };
    }
  }, []);

  return <OfflineIndicator />;
};
