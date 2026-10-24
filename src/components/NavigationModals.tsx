/* eslint-disable @next/next/no-img-element */
// src/components/NavigationModals.tsx
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  ShieldCheck, 
  Mic, 
  Video, 
  FileText,
  User,
  LogOut,
  ExternalLink,
  Sparkles,
  Loader2,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export type NavModalType = 'about' | 'privacy' | 'podcast' | 'video' | 'auth' | null;

interface NavigationModalsProps {
  activeModal: NavModalType;
  onClose: () => void;
  lang: 'ar' | 'en';
  onNavigateToNewsroom?: () => void;
  onNavigateToProfile?: () => void;
  onBackToHome?: () => void;
  initialAuthMode?: 'signin' | 'signup';
}

export const NavigationModals: React.FC<NavigationModalsProps> = ({
  activeModal,
  onClose,
  lang,
  onNavigateToNewsroom,
  onNavigateToProfile,
  onBackToHome
}) => {
  const isAr = lang === 'ar';
  const { 
    user, 
    profile, 
    role, 
    signIn,
    logout 
  } = useAuth();

  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const canAccessNewsroom = Boolean(
    user && (role === 'ADMIN' || role === 'EDITOR' || role === 'SUPERVISOR')
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!activeModal || !mounted) return null;

  const handleGoogleSignIn = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await signIn();
      setAuthSuccess(isAr ? 'تم تسجيل الدخول بنجاح بحساب Google' : 'Signed in with Google successfully');
      setTimeout(() => {
        setAuthSuccess(null);
        onClose();
        if (onNavigateToProfile) onNavigateToProfile();
      }, 1200);
    } catch (err: any) {
      console.error("Auth error:", err);
      setAuthError(isAr ? 'تعذر تسجيل الدخول عبر Google.' : 'Google sign-in failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className={`relative my-auto w-full ${activeModal === 'auth' ? 'max-w-md' : 'max-w-xl'} bg-[#0A0E17] border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-5 shadow-2xl ring-1 ring-amber-500/25 max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 left-4 rtl:left-4 rtl:right-auto ltr:right-4 ltr:left-auto text-slate-400 hover:text-white p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {activeModal === 'about' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">{isAr ? 'من نحن' : 'About Us'}</h3>
                <p className="text-xs text-amber-400">{isAr ? 'صحيفة الاقتصاد الإفريقي' : 'African Economic Journal'}</p>
              </div>
            </div>
            <div className="text-xs text-slate-300 leading-relaxed space-y-2">
              <p>{isAr ? 'لافريكونوميست هي منصة رائدة للصحافة الاقتصادية الإفريقية.' : 'L’Africonomist is a leading platform for African economic journalism.'}</p>
            </div>
          </div>
        )}

        {activeModal === 'privacy' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-white">{isAr ? 'الخصوصية' : 'Privacy'}</h3>
            </div>
            <p className="text-xs text-slate-300">{isAr ? 'نحن نلتزم بحماية بياناتك.' : 'We are committed to protecting your data.'}</p>
          </div>
        )}

        {activeModal === 'auth' && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-800/80 pb-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-black text-white">{isAr ? 'بوابة الدخول' : 'Access Gateway'}</h3>
            </div>

            {profile ? (
              <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {profile.photoURL ? (
                      <img src={profile.photoURL} alt="" className="w-10 h-10 rounded-lg" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">{profile.displayName?.charAt(0)}</div>
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-white">{profile.displayName}</h4>
                      <p className="text-[10px] text-slate-400">{profile.email}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold border bg-amber-500/10 text-amber-300 border-amber-500/30">{role}</span>
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => { onClose(); if (onNavigateToProfile) onNavigateToProfile(); }} className="flex-1 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold">
                    {isAr ? 'حسابي' : 'My Account'}
                  </button>
                  <button onClick={async () => { await logout(); onClose(); if (onBackToHome) onBackToHome(); }} className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center space-y-1">
                  <h4 className="text-lg font-bold text-white">{isAr ? 'مرحباً بك' : 'Welcome'}</h4>
                  <p className="text-xs text-slate-400">{isAr ? 'سجل دخولك لحفظ المقالات' : 'Sign in to save articles'}</p>
                </div>
                <button
                  onClick={handleGoogleSignIn}
                  disabled={authLoading}
                  className="w-full py-3 rounded-2xl bg-white text-slate-950 font-bold text-sm flex items-center justify-center gap-2"
                >
                  {authLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                      </svg>
                      <span>{isAr ? 'الدخول بواسطة Google' : 'Continue with Google'}</span>
                    </>
                  )}
                </button>
                
                {/* Mobile Troubleshooting Hint */}
                {isAr && (
                  <p className="text-[9px] text-slate-500 leading-relaxed text-center px-4">
                    💡 لمستخدمي الهاتف: إذا واجهت مشكلة، يرجى التأكد من تفعيل &quot;النوافذ المنبثقة&quot; والسماح بـ &quot;ملفات تعريف الارتباط للجهات الخارجية&quot; في إعدادات المتصفح.
                  </p>
                )}
                {!isAr && (
                  <p className="text-[9px] text-slate-500 leading-relaxed text-center px-4">
                    💡 Mobile Users: If login fails, ensure &quot;Popups&quot; are enabled and &quot;Third-party cookies&quot; are allowed in your browser settings.
                  </p>
                )}

                {authError && <p className="text-[10px] text-rose-400 text-center">{authError}</p>}
                {authSuccess && <p className="text-[10px] text-emerald-400 text-center">{authSuccess}</p>}
              </div>
            )}
          </div>
        )}

        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
          <span>{isAr ? '© 2026 لافريكونوميست' : '© 2026 L’Africonomist'}</span>
          {canAccessNewsroom && onNavigateToNewsroom && (
            <button onClick={() => { onClose(); onNavigateToNewsroom(); }} className="text-amber-400 underline">{isAr ? 'غرفة الأخبار' : 'Newsroom'}</button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
