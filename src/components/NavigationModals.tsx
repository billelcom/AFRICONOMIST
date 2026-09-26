// src/components/NavigationModals.tsx
import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  UserCheck, 
  Sparkles, 
  CheckCircle2, 
} from 'lucide-react';

export type NavModalType = 'auth' | null;

interface NavigationModalsProps {
  activeModal: NavModalType;
  onClose: () => void;
  lang: 'ar' | 'en';
  onNavigateToNewsroom?: () => void;
}

export const NavigationModals: React.FC<NavigationModalsProps> = ({
  activeModal,
  onClose,
  lang,
  onNavigateToNewsroom
}) => {
  const isAr = lang === 'ar';
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [isAuthSuccess, setIsAuthSuccess] = useState(false);

  if (!activeModal) return null;

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthSuccess(true);
    setTimeout(() => {
      setIsAuthSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#0A0E17] border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative max-h-[85vh] overflow-y-auto ring-1 ring-amber-500/20">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 sm:left-auto sm:right-4 text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-900 border border-slate-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 5. التسجيل (Authentication / Membership) */}
        {activeModal === 'auth' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">
                  {isAr ? 'تسجيل الدخول وعضوية القراء' : 'Reader Membership & Sign In'}
                </h3>
                <p className="text-xs text-amber-400 font-serif">
                  {isAr ? 'لافريكونوميست · صحيفة الاقتصاد الإفريقي' : 'L’Africonomist · African Economic Journal'}
                </p>
              </div>
            </div>

            {isAuthSuccess ? (
              <div className="p-6 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">
                  {isAr ? 'تم تسجيل الدخول بنجاح!' : 'Welcome back! Signed in successfully.'}
                </h4>
                <p className="text-xs text-slate-400">
                  {isAr ? 'مرحباً بك في دائرة قراء لافريكونوميست الاقتصادية الموثوقة.' : 'Enjoy full access to premium African economic intelligence.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleAuthSubmit} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{isAr ? 'البريد الإلكتروني المهني' : 'Work Email'}</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="analyst@bloomberg-africa.com"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/60"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{isAr ? 'كلمة المرور' : 'Password'}</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/60"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-medium text-xs transition-colors"
                  >
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>{isAr ? 'دخول / تسجيل فوري' : 'Sign In / Register'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Modal Footer */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <span>{isAr ? 'لافريكونوميست © 2026' : 'L’Africonomist © 2026'}</span>
          {onNavigateToNewsroom && (
            <button
              onClick={() => {
                onClose();
                onNavigateToNewsroom();
              }}
              className="text-amber-400/80 hover:text-amber-300 underline"
            >
              {isAr ? 'الانتقال إلى غرفة الأخبار' : 'Go to Newsroom'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
