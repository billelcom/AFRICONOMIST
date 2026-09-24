// src/lib/pwa/webPushServer.ts
import webpush from 'web-push';

export const VAPID_PUBLIC_KEY = 
  process.env.VAPID_PUBLIC_KEY || 
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 
  'BEeuC2MiztbdrliDUq6U1uyT1-U1w3LoAsgcp2tmkSNiE1IVoVzvJP-dfyl4DbJDfBqECEZ7pdUrOpcsl8em_ak';

export const VAPID_PRIVATE_KEY = 
  process.env.VAPID_PRIVATE_KEY || 
  'GCV01TXD5KEEiuxlyqCgz79y15c0f-qILGD44otw6Os';

export const VAPID_SUBJECT = 
  process.env.VAPID_SUBJECT || 
  'mailto:editorial@africonomist.com';

// Initialize web-push details
try {
  webpush.setVapidDetails(
    VAPID_SUBJECT,
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  );
} catch (err) {
  console.warn('[PWA] VAPID configuration warning:', err);
}

// In-memory subscription store for immediate demo/runtime delivery
// In production with MongoDB Atlas, these are persisted into user profiles
export interface StoredSubscription {
  id: string;
  subscription: webpush.PushSubscription;
  createdAt: string;
  userAgent?: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __pushSubscriptions: StoredSubscription[] | undefined;
}

if (!globalThis.__pushSubscriptions) {
  globalThis.__pushSubscriptions = [];
}

export const pushSubscriptionsStore = globalThis.__pushSubscriptions;

export async function sendNotificationToAll(payload: {
  title: string;
  body: string;
  url?: string;
  icon?: string;
}) {
  const message = JSON.stringify({
    title: payload.title,
    body: payload.body,
    icon: payload.icon || '/pwa-192x192.png',
    badge: '/icon.svg',
    url: payload.url || '/?tab=editorial',
    timestamp: Date.now()
  });

  const results = [];
  const deadSubscriptions: string[] = [];

  for (const item of pushSubscriptionsStore) {
    try {
      const res = await webpush.sendNotification(item.subscription, message);
      results.push({ id: item.id, status: 'success', statusCode: res.statusCode });
    } catch (err: any) {
      console.warn(`[PWA] Push send error for subscriber ${item.id}:`, err?.statusCode || err?.message);
      results.push({ id: item.id, status: 'failed', error: err?.message });
      // If 404 or 410, subscription has expired or unsubscribed
      if (err?.statusCode === 404 || err?.statusCode === 410) {
        deadSubscriptions.push(item.id);
      }
    }
  }

  // Remove dead subscriptions
  if (deadSubscriptions.length > 0) {
    globalThis.__pushSubscriptions = pushSubscriptionsStore.filter(
      (sub) => !deadSubscriptions.includes(sub.id)
    );
  }

  return {
    totalSubscribers: pushSubscriptionsStore.length,
    attempted: results.length,
    results
  };
}
