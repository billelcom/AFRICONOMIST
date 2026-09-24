// src/lib/pwa/backgroundSync.ts

export interface OfflineAction {
  id: string;
  type: 'submit_report' | 'save_review' | 'bookmark';
  data: any;
  createdAt: number;
}

const DB_NAME = 'africonomist_pwa_db';
const DB_VERSION = 1;
const STORE_NAME = 'offline_queue';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB غير متاح'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function queueOfflineAction(type: OfflineAction['type'], data: any): Promise<boolean> {
  try {
    const db = await openDB();
    const action: OfflineAction = {
      id: `action_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type,
      data,
      createdAt: Date.now()
    };

    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.add(action);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });

    console.log('[PWA Sync] Action queued in IndexedDB:', action.id);

    // Try to register Background Sync with Service Worker
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      const registration = await navigator.serviceWorker.ready;
      // @ts-ignore
      if (registration.sync) {
        // @ts-ignore
        await registration.sync.register('sync-offline-queue');
        console.log('[PWA Sync] Background Sync registered successfully');
      }
    }

    return true;
  } catch (err) {
    console.error('[PWA Sync] Failed to queue offline action:', err);
    return false;
  }
}

export async function flushOfflineQueue(): Promise<{ flushed: number; success: boolean }> {
  try {
    const db = await openDB();
    const actions: OfflineAction[] = await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });

    if (actions.length === 0) {
      return { flushed: 0, success: true };
    }

    console.log('[PWA Sync] Flushing offline actions:', actions.length);

    const response = await fetch('/api/sync/queue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: actions })
    });

    if (response.ok) {
      // Clear store
      const clearTx = db.transaction(STORE_NAME, 'readwrite');
      clearTx.objectStore(STORE_NAME).clear();
      return { flushed: actions.length, success: true };
    }

    return { flushed: 0, success: false };
  } catch (err) {
    console.warn('[PWA Sync] Flush error:', err);
    return { flushed: 0, success: false };
  }
}

// Auto setup window listener on reconnection
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('[PWA Sync] Online restored; triggering flushOfflineQueue()...');
    flushOfflineQueue();
  });
}
