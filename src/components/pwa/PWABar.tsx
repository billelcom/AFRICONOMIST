// src/components/pwa/PWABar.tsx
'use client';

import React, { useState } from 'react';
import { 
  Bell, 
  BellRing, 
  Share2, 
  Download, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Send,
  Loader2,
  X
} from 'lucide-react';
import { usePWA } from '../../lib/pwa/usePWA';
import { PWAInstallButton } from './PWAInstallButton';

interface PWABarProps {
  lang: 'ar' | 'en';
  iconOnly?: boolean;
  showPushToggle?: boolean;
  showShare?: boolean;
}

export const PWABar: React.FC<PWABarProps> = ({ 
  lang, 
  iconOnly = false,
  showPushToggle = false,
  showShare = false
}) => {
  const isAr = lang === 'ar';
  const { 
    isPushSupported, 
    isPushSubscribed, 
    pushLoading, 
    enablePush, 
    sendTestNotification, 
    shareApp,
    isInstalled
  } = usePWA();

  const [notificationNotice, setNotificationNotice] = useState<string | null>(null);
  const [isSendingTest, setIsSendingTest] = useState<boolean>(false);
  const [showPushModal, setShowPushModal] = useState<boolean>(false);

  const handleSubscribe = async () => {
    const res = await enablePush();
    if (res.success) {
      setNotificationNotice(isAr ? '🔔 تم تفعيل التنبيهات الفورية بنجاح!' : '🔔 Push alerts enabled!');
      setTimeout(() => setNotificationNotice(null), 4000);
    } else {
      setNotificationNotice(res.error || (isAr ? 'تعذر تفعيل التنبيهات' : 'Failed to enable push'));
      setTimeout(() => setNotificationNotice(null), 4000);
    }
  };

  const handleSendTest = async () => {
    setIsSendingTest(true);
    try {
      await sendTestNotification(
        isAr ? 'لافريكونوميست | تنبيه اختباري 🚀' : 'L’Africonomist | Test Alert 🚀',
        isAr ? 'نظام الإشعارات اللحظية يعمل بكفاءة عبر Web Push API و VAPID.' : 'Web Push API operational via VAPID service worker.'
      );
      setNotificationNotice(isAr ? '✅ تم إرسال إشعار اختباري لجهازك!' : '✅ Test notification sent!');
      setTimeout(() => setNotificationNotice(null), 4000);
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleShare = async () => {
    const res = await shareApp();
    if (res.method === 'clipboard') {
      setNotificationNotice(isAr ? '📋 تم نسخ رابط الصحيفة إلى الحافظة بنجاح!' : '📋 Link copied to clipboard!');
      setTimeout(() => setNotificationNotice(null), 3000);
    }
  };

  return (
    <>
      {/* Toast Notice */}
      {notificationNotice && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-2xl flex items-center gap-2 animate-in fade-in duration-200">
          <span>{notificationNotice}</span>
        </div>
      )}

      {/* Action triggers that integrate into headers / sidebars / footers */}
      <div className="flex items-center gap-1.5">
        {/* Install Button (Icon-only on mobile or when specified) */}
        {!isInstalled && (
          <PWAInstallButton 
            variant={iconOnly ? 'icon-only' : 'compact'} 
            iconOnly={iconOnly} 
            lang={lang} 
          />
        )}

        {/* Native Web Share Button (Only shown if explicitly requested) */}
        {showShare && (
          <button
            onClick={handleShare}
            type="button"
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/60 transition-colors text-xs flex items-center justify-center cursor-pointer"
            title={isAr ? 'مشاركة التطبيق عبر واجهة النظام (Web Share)' : 'Share via Native Web Share'}
            aria-label="Share App"
          >
            <Share2 className="w-3.5 h-3.5 text-blue-400" />
          </button>
        )}

        {/* Push Notification Toggle Button (Only displayed when showPushToggle is explicitly true) */}
        {showPushToggle && isPushSupported && (
          <button
            onClick={() => setShowPushModal(true)}
            type="button"
            className={`p-1.5 rounded-lg border transition-all text-xs flex items-center justify-center cursor-pointer ${
              isPushSubscribed 
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-400' 
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700/60'
            }`}
            title={isAr ? 'إدارة التنبيهات الفورية (Web Push)' : 'Manage Push Notifications'}
            aria-label="Push Notifications"
          >
            {isPushSubscribed ? (
              <BellRing className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            ) : (
              <Bell className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>
        )}
      </div>

      {/* Push Notification Modal */}
      {showPushModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setShowPushModal(false)}
        >
          <div 
            className="w-full max-w-sm rounded-3xl bg-[#0B101E] border border-amber-500/40 p-6 shadow-2xl space-y-4 text-right animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <BellRing className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">
                  {isAr ? 'خدمة الإشعارات اللحظية (Web Push)' : 'Web Push Notification Center'}
                </h3>
              </div>
              <button
                onClick={() => setShowPushModal(false)}
                className="p-1 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {isAr 
                ? 'استقبل عاجل أسواق المال الإفريقية، وتقارير استقصاء الذكاء الاصطناعي لحظة إجازتها من رئيس التحرير مباشرة على جهازك حتى عند إغلاق التطبيق.'
                : 'Receive breaking African macro intelligence directly on your device via standard W3C Web Push API.'}
            </p>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">{isAr ? 'حالة التنبيهات:' : 'Status:'}</span>
                {isPushSubscribed ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>{isAr ? 'مفعلة' : 'Subscribed'}</span>
                  </span>
                ) : (
                  <span className="text-amber-400 font-bold">
                    {isAr ? 'غير مفعلة' : 'Not Subscribed'}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>VAPID Protocol</span>
                <span>W3C Standard</span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              {!isPushSubscribed ? (
                <button
                  onClick={handleSubscribe}
                  disabled={pushLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 transition-all cursor-pointer"
                >
                  {pushLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <BellRing className="w-4 h-4 fill-current" />
                  )}
                  <span>{isAr ? 'تفعيل التنبيهات على هذا الجهاز' : 'Enable Push Notifications'}</span>
                </button>
              ) : (
                <button
                  onClick={handleSendTest}
                  disabled={isSendingTest}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-850 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {isSendingTest ? (
                    <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  ) : (
                    <Send className="w-4 h-4 text-amber-400" />
                  )}
                  <span>{isAr ? 'إرسال إشعار تجريبي فوري' : 'Send Test Notification'}</span>
                </button>
              )}

              <button
                onClick={() => setShowPushModal(false)}
                className="w-full py-2 rounded-xl bg-slate-950 text-slate-400 hover:text-slate-200 text-xs transition-colors"
              >
                {isAr ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export interface DevicePushNotificationBannerProps {
  lang: 'ar' | 'en';
}

/**
 * بنر مدمج لمركز الإشعارات: يتيح تفعيل إشعارات الويب اللحظية على الجهاز أو اختبارها مباشرة
 */
export const DevicePushNotificationBanner: React.FC<DevicePushNotificationBannerProps> = ({ lang }) => {
  const isAr = lang === 'ar';
  const { 
    isPushSupported, 
    isPushSubscribed, 
    pushLoading, 
    enablePush, 
    sendTestNotification 
  } = usePWA();

  const [notificationNotice, setNotificationNotice] = useState<string | null>(null);
  const [isSendingTest, setIsSendingTest] = useState<boolean>(false);
  const [dismissed, setDismissed] = useState<boolean>(false);

  if (!isPushSupported || dismissed) return null;

  const handleSubscribe = async () => {
    const res = await enablePush();
    if (res.success) {
      setNotificationNotice(isAr ? '🔔 تم تفعيل التنبيهات الفورية على جهازك بنجاح!' : '🔔 Push alerts enabled on this device!');
      setTimeout(() => setNotificationNotice(null), 4000);
    } else {
      setNotificationNotice(res.error || (isAr ? 'تعذر تفعيل التنبيهات على الجهاز' : 'Failed to enable push on device'));
      setTimeout(() => setNotificationNotice(null), 4000);
    }
  };

  const handleSendTest = async () => {
    setIsSendingTest(true);
    try {
      await sendTestNotification(
        isAr ? 'لافريكونوميست | تنبيه اختباري 🚀' : 'L’Africonomist | Test Alert 🚀',
        isAr ? 'نظام الإشعارات اللحظية يعمل بكفاءة على جهازك عبر W3C Web Push.' : 'Web Push API operational on this device.'
      );
      setNotificationNotice(isAr ? '✅ تم إرسال إشعار اختباري لجهازك!' : '✅ Test notification sent!');
      setTimeout(() => setNotificationNotice(null), 4000);
    } finally {
      setIsSendingTest(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-[#0F172A] via-[#0D1424] to-[#0A0E1A] p-4 sm:p-5 shadow-lg">
      {/* Toast Notice */}
      {notificationNotice && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-xl flex items-center gap-1.5 animate-in fade-in duration-200">
          <span>{notificationNotice}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
            <BellRing className={`w-5 h-5 ${isPushSubscribed ? 'text-emerald-400' : 'text-amber-400 animate-pulse'}`} />
          </div>

          <div className="space-y-1 text-right rtl:text-right ltr:text-left">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-white">
                {isAr ? 'تفعيل الإشعارات الفورية على هذا الجهاز' : 'Enable Device Push Notifications'}
              </h3>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                isPushSubscribed
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              }`}>
                {isPushSubscribed 
                  ? (isAr ? 'مفعلة على الجهاز ✅' : 'Subscribed ✅') 
                  : (isAr ? 'غير مفعلة بعد' : 'Not Enabled')}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
              {isAr
                ? 'استقبل عاجل أسواق المال وتقارير التحليل الاقتصادي فور نشرها مباشرة على هاتفك أو حاسوبك حتى عند إغلاق التطبيق.'
                : 'Receive breaking African macro intelligence directly on your device via standard Web Push API even when the app is closed.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          {!isPushSubscribed ? (
            <button
              type="button"
              onClick={handleSubscribe}
              disabled={pushLoading}
              className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md shadow-amber-500/15 active:scale-95 transition-all cursor-pointer"
            >
              {pushLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <BellRing className="w-3.5 h-3.5 fill-current" />
              )}
              <span>{isAr ? 'تفعيل على الجهاز الآن' : 'Enable Now'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSendTest}
              disabled={isSendingTest}
              className="py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {isSendingTest ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
              ) : (
                <Send className="w-3.5 h-3.5 text-amber-400" />
              )}
              <span>{isAr ? 'إرسال إشعار تجريبي' : 'Send Test Alert'}</span>
            </button>
          )}

          {!isPushSubscribed && (
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
              title={isAr ? 'إخفاء مؤقت' : 'Dismiss'}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

