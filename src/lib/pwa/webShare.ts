// src/lib/pwa/webShare.ts

export interface ShareDataPayload {
  title?: string;
  text?: string;
  url?: string;
}

export async function shareContent(payload: ShareDataPayload): Promise<{ shared: boolean; method: 'native' | 'clipboard' | 'none'; error?: string }> {
  const shareTitle = payload.title || 'لافريكونوميست | صحيفة الاقتصاد الإفريقي';
  const shareText = payload.text || 'رصد وتدقيق أسواق المال والسياسات النقدية واستثمارات 54 دولة أفريقية.';
  const shareUrl = payload.url || (typeof window !== 'undefined' ? window.location.href : 'https://africonomist.com');

  // 1. Try Native Web Share API
  if (typeof navigator !== 'undefined' && 'share' in navigator && navigator.canShare && navigator.canShare({ title: shareTitle, text: shareText, url: shareUrl })) {
    try {
      await navigator.share({
        title: shareTitle,
        text: shareText,
        url: shareUrl
      });
      return { shared: true, method: 'native' };
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return { shared: false, method: 'native' };
      }
      console.warn('[WebShare] Native share failed, falling back to clipboard:', err);
    }
  }

  // 2. Clipboard fallback
  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(`${shareTitle}\n${shareText}\n${shareUrl}`);
      return { shared: true, method: 'clipboard' };
    } catch (err: any) {
      return { shared: false, method: 'none', error: err?.message };
    }
  }

  return { shared: false, method: 'none' };
}
