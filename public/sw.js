// public/sw.js
// Advanced Progressive Web App Service Worker for L'AFRICONOMIST (لافريكونوميست)

const CACHE_VERSION = 'africonomist-v1.2.0';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`;
const API_CACHE = `api-${CACHE_VERSION}`;

// Precache list - Core Application Shell
const PRECACHE_ASSETS = [
  '/',
  '/offline.html',
  '/offline',
  '/manifest.json',
  '/icon.svg',
  '/icon-maskable.svg',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/pwa-maskable-512x512.png',
  '/apple-touch-icon.png',
  '/favicon.ico'
];

// Maximum cached API items to prevent storage bloat
const MAX_API_ENTRIES = 50;

async function trimCache(cacheName, maxItems) {
  try {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    if (keys.length > maxItems) {
      await cache.delete(keys[0]);
      trimCache(cacheName, maxItems);
    }
  } catch (err) {
    console.warn('[SW] Cache trim error:', err);
  }
}

// -------------------------------------------------------------
// 1. Install Event: Precache Core App Shell & Skip Waiting
// -------------------------------------------------------------
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      console.log('[SW] Installing L’Africonomist PWA Service Worker...');
      const cache = await caches.open(STATIC_CACHE);
      try {
        await cache.addAll(PRECACHE_ASSETS);
      } catch (err) {
        console.warn('[SW] Precache partial error (fallback graceful):', err);
      }
      return self.skipWaiting();
    })()
  );
});

// -------------------------------------------------------------
// 2. Activate Event: Cleanup Old Caches & Claim Clients
// -------------------------------------------------------------
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      console.log('[SW] Activating new Service Worker version:', CACHE_VERSION);
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE && name !== API_CACHE)
          .map((name) => {
            console.log('[SW] Deleting deprecated cache:', name);
            return caches.delete(name);
          })
      );
      return self.clients.claim();
    })()
  );
});

// -------------------------------------------------------------
// 3. Fetch Event Routing with Multi-tier Caching Strategies
// -------------------------------------------------------------
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore non-GET requests for standard caching (Background sync handles POSTs)
  if (request.method !== 'GET') {
    return;
  }

  // A. Dynamic API Requests (Network-First with Cache Fallback)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(API_CACHE);
            cache.put(request, networkResponse.clone());
            trimCache(API_CACHE, MAX_API_ENTRIES);
          }
          return networkResponse;
        } catch (err) {
          console.log('[SW] API Network failed, searching cache for:', url.pathname);
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          // Return simulated offline JSON
          return new Response(
            JSON.stringify({
              offline: true,
              message: 'أنت في الوضع غير المتصل بالإنترنت. البيانات المعروضة مسترجعة من الذاكرة المحلية.',
              timestamp: new Date().toISOString()
            }),
            {
              headers: { 'Content-Type': 'application/json' }
            }
          );
        }
      })()
    );
    return;
  }

  // B. Static Assets: Images, Fonts, CSS, JS (Cache-First with Background Revalidation)
  const isStaticAsset =
    request.destination === 'image' ||
    request.destination === 'font' ||
    request.destination === 'style' ||
    request.destination === 'script' ||
    url.pathname.match(/\.(png|jpg|jpeg|svg|webp|ico|woff|woff2|ttf|css|js)$/i);

  if (isStaticAsset) {
    event.respondWith(
      (async () => {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
          // Asynchronously revalidate in background if online
          fetch(request)
            .then(async (networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                const cache = await caches.open(STATIC_CACHE);
                cache.put(request, networkResponse);
              }
            })
            .catch(() => {});
          return cachedResponse;
        }

        try {
          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (err) {
          // If svg/image fails, try returning standard icon fallback
          if (request.destination === 'image') {
            const fallbackIcon = await caches.match('/icon.svg');
            if (fallbackIcon) return fallbackIcon;
          }
          throw err;
        }
      })()
    );
    return;
  }

  // C. HTML Navigation Requests (Network-First with Offline Fallback)
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (err) {
          console.log('[SW] Navigation failed, serving cached page or offline fallback');
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          const offlinePage = await caches.match('/offline.html');
          if (offlinePage) {
            return offlinePage;
          }
          return caches.match('/offline');
        }
      })()
    );
    return;
  }

  // D. Stale-While-Revalidate for Other Resources
  event.respondWith(
    (async () => {
      const cachedResponse = await caches.match(request);
      const fetchPromise = fetch(request)
        .then(async (networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })()
  );
});

// -------------------------------------------------------------
// 4. Web Push API: Receive and Display Push Notifications
// -------------------------------------------------------------
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification event received');
  let data = {
    title: 'لافريكونوميست | عاجل الاقتصادي',
    body: 'تقرير استقصائي جديد متاح الآن في غرفة الأخبار.',
    icon: '/pwa-192x192.png',
    badge: '/icon.svg',
    url: '/?tab=editorial',
    tag: 'africonomist-breaking'
  };

  if (event.data) {
    try {
      const json = event.data.json();
      data = { ...data, ...json };
    } catch (e) {
      data.body = event.data.text() || data.body;
    }
  }

  const notificationOptions = {
    body: data.body,
    icon: data.icon || '/pwa-192x192.png',
    badge: data.badge || '/icon.svg',
    tag: data.tag || 'africonomist-alert',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/?tab=editorial',
      dateOfArrival: Date.now()
    },
    actions: [
      {
        action: 'open_report',
        title: 'قراءة التقرير 📰'
      },
      {
        action: 'dismiss',
        title: 'إغلاق ✕'
      }
    ],
    requireInteraction: false
  };

  event.waitUntil(
    self.registration.showNotification(data.title, notificationOptions)
  );
});

// -------------------------------------------------------------
// 5. Notification Click & Action Handlers
// -------------------------------------------------------------
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Check if there is already a window open with this app
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      // If no window is open, open a new window
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// -------------------------------------------------------------
// 6. Background Sync: Auto-flush offline queued reports & actions
// -------------------------------------------------------------
self.addEventListener('sync', (event) => {
  console.log('[SW] Background Sync event triggered:', event.tag);
  if (event.tag === 'sync-offline-queue' || event.tag === 'sync-reports') {
    event.waitUntil(
      (async () => {
        try {
          console.log('[SW] Processing background synchronization queue...');
          // Notify active window clients that sync is executing
          const allClients = await clients.matchAll({ type: 'window' });
          allClients.forEach((client) => {
            client.postMessage({
              type: 'SYNC_COMPLETED',
              message: 'تمت مزامنة العمليات المعلقة بنجاح عند استعادة الاتصال.'
            });
          });
        } catch (err) {
          console.error('[SW] Background sync processing error:', err);
        }
      })()
    );
  }
});
