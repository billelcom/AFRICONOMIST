/* eslint-disable @next/next/no-img-element */
// src/components/NavigationModals.tsx
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  ShieldCheck, 
  Mic, 
  Video, 
  Lock, 
  Mail, 
  UserCheck, 
  Play, 
  Sparkles, 
  CheckCircle2, 
  FileText,
  Volume2,
  Crown,
  Edit3,
  User,
  LogOut,
  AlertCircle,
  ExternalLink,
  LogIn,
  UserPlus,
  Phone,
  Globe,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/auth';
import { ALL_54_AFRICAN_COUNTRIES } from '../data/africanCountries';

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
  onBackToHome,
  initialAuthMode = 'signin'
}) => {
  const isAr = lang === 'ar';
  const { 
    user, 
    profile, 
    role, 
    signInWithGoogle, 
    signInWithEmail, 
    signUpWithEmail, 
    sendPasswordReset,
    loginAsDemoRole, 
    signOut 
  } = useAuth();

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>(initialAuthMode);
  const [authEmail, setAuthEmail] = useState('');
  const [authConfirmEmail, setAuthConfirmEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authConfirmPassword, setAuthConfirmPassword] = useState('');
  const [authFirstName, setAuthFirstName] = useState('');
  const [authLastName, setAuthLastName] = useState('');
  const [authWhatsapp, setAuthWhatsapp] = useState('');
  const [authCountry, setAuthCountry] = useState('DZ');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [showDemoRoles, setShowDemoRoles] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // المزامنة التلقائية مع الوضع المختار (تسجيل دخول أو إنشاء حساب) عند فتح النافذة
  useEffect(() => {
    if (activeModal === 'auth') {
      setAuthMode(initialAuthMode);
      setAuthError(null);
      setAuthSuccess(null);
      setIsResetMode(false);
    }
  }, [activeModal, initialAuthMode]);

  if (!activeModal || !mounted) return null;

  const handleGoogleSignIn = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await signInWithGoogle();
      setAuthSuccess(isAr ? 'تم تسجيل الدخول بنجاح بحساب Google' : 'Signed in with Google successfully');
      setTimeout(() => {
        setAuthSuccess(null);
        onClose();
        if (onNavigateToProfile) onNavigateToProfile();
      }, 1200);
    } catch (err: any) {
      console.error("خطأ في تسجيل الدخول عبر جوجل: ", err.message || err);
      setAuthError(isAr ? 'تعذر تسجيل الدخول عبر Google. يمكنك استخدام البريد الإلكتروني أو الدخول السريع.' : 'Google sign-in was canceled or failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    try {
      if (authMode === 'signup') {
        const cleanFirst = authFirstName.trim();
        const cleanLast = authLastName.trim();
        const cleanEmail = authEmail.trim().toLowerCase();
        const cleanConfirmEmail = authConfirmEmail.trim().toLowerCase();
        const cleanWhatsapp = authWhatsapp.trim();

        if (!cleanFirst) {
          setAuthError(isAr ? 'يرجى كتابة الاسم' : 'Please enter your first name');
          setAuthLoading(false);
          return;
        }

        if (!cleanLast) {
          setAuthError(isAr ? 'يرجى كتابة اللقب' : 'Please enter your last name');
          setAuthLoading(false);
          return;
        }

        if (!cleanEmail) {
          setAuthError(isAr ? 'يرجى كتابة البريد الإلكتروني' : 'Please enter your email');
          setAuthLoading(false);
          return;
        }

        if (cleanEmail !== cleanConfirmEmail) {
          setAuthError(isAr ? 'البريد الإلكتروني وتأكيد البريد غير متطابقين! يرجى التأكد من تطابق العنوانين.' : 'Email and confirmation email do not match!');
          setAuthLoading(false);
          return;
        }

        if (!cleanWhatsapp) {
          setAuthError(isAr ? 'يرجى إدخال رقم الواتساب للتواصل وتفعيل التنبيهات' : 'Please enter your WhatsApp number');
          setAuthLoading(false);
          return;
        }

        if (authPassword.length < 6) {
          setAuthError(isAr ? 'كلمة المرور يجب أن لا تقل عن 6 أحرف أو أرقام' : 'Password must be at least 6 characters');
          setAuthLoading(false);
          return;
        }

        if (authPassword !== authConfirmPassword) {
          setAuthError(isAr ? 'كلمة المرور وتأكيد كلمة المرور غير متطابقين' : 'Passwords do not match');
          setAuthLoading(false);
          return;
        }

        const fullName = `${cleanFirst} ${cleanLast}`;
        await signUpWithEmail(cleanEmail, authPassword, fullName, {
          firstName: cleanFirst,
          lastName: cleanLast,
          whatsapp: cleanWhatsapp,
          country: authCountry
        });
        setAuthSuccess(isAr ? 'تم إنشاء الحساب بنجاح وتفعيله بصفة قارئ ومستثمر' : 'Account created successfully as Reader & Investor');
      } else {
        await signInWithEmail(authEmail, authPassword);
        setAuthSuccess(isAr ? 'تم تسجيل الدخول بنجاح' : 'Signed in successfully');
      }
      setTimeout(() => {
        setAuthSuccess(null);
        onClose();
        if (onNavigateToProfile) onNavigateToProfile();
      }, 1200);
    } catch (err: any) {
      console.warn('Email auth error:', err);
      const msg = err.message || '';
      if (msg.includes('email-already-in-use')) {
        setAuthError(isAr ? 'هذا البريد الإلكتروني مسجل مسبقاً! يرجى التبديل إلى خيار [تسجيل الدخول] في الأعلى.' : 'Email is already registered. Please switch to Sign In.');
      } else if (msg.includes('weak-password')) {
        setAuthError(isAr ? 'كلمة المرور قصيرة. يرجى إدخال 6 أحرف أو أرقام على الأقل.' : 'Password should be at least 6 characters.');
      } else if (msg.includes('invalid-email')) {
        setAuthError(isAr ? 'صيغة البريد الإلكتروني غير صالحة. يرجى التأكد من كتابة البريد بشكل سليم (مثال: user@domain.com).' : 'Invalid email format.');
      } else if (msg.includes('invalid-credential') || msg.includes('wrong-password')) {
        setAuthError(isAr ? 'كلمة المرور غير صحيحة. يرجى التأكد من كلمة المرور والمحاولة مجدداً.' : 'Invalid credentials. Please verify your email and password.');
      } else if (msg.includes('user-not-found')) {
        setAuthError(isAr ? 'لا يوجد حساب مسجل بهذا البريد. يمكنك إنشاء حساب جديد عبر خيار [إنشاء حساب جديد] أعلاه.' : 'No account found with this email. Please register.');
      } else {
        setAuthError(isAr ? 'تعذر إتمام العملية. يرجى مراجعة البيانات المدخلة والمحاولة مرة أخرى.' : 'Authentication error. Please check your details and try again.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetEmail = authEmail.trim();
    if (!targetEmail) {
      setAuthError(isAr ? 'يرجى كتابة عنوان البريد الإلكتروني لإرسال رابط الاستعادة' : 'Please enter your email address');
      return;
    }
    setAuthLoading(true);
    setAuthError(null);
    try {
      await sendPasswordReset(targetEmail);
      setAuthSuccess(isAr 
        ? `تم إرسال رابط إعادة تعيين كلمة المرور إلى [${targetEmail}] بنجاح! تفقد صندوق الوارد في بريدك الإلكتروني.` 
        : `Password reset link sent to [${targetEmail}]! Please check your inbox.`);
    } catch (err: any) {
      console.warn('Password reset error:', err);
      setAuthError(isAr ? 'تعذر إرسال رابط الاستعادة. تأكد من صحة البريد الإلكتروني والمحاولة مجدداً.' : 'Failed to send password reset link.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleDemoLogin = async (selectedRole: UserRole) => {
    setAuthLoading(true);
    await loginAsDemoRole(selectedRole);
    setAuthSuccess(isAr ? `تم تفعيل حسابك كـ [${selectedRole}] بنجاح` : `Logged in as [${selectedRole}]`);
    setTimeout(() => {
      setAuthSuccess(null);
      onClose();
      if (onNavigateToProfile) onNavigateToProfile();
    }, 1000);
    setAuthLoading(false);
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className={`relative my-auto w-full ${activeModal === 'auth' ? 'max-w-md sm:max-w-lg' : 'max-w-xl'} bg-[#0A0E17] border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-5 shadow-2xl ring-1 ring-amber-500/25 max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 rtl:left-4 rtl:right-auto ltr:right-4 ltr:left-auto text-slate-400 hover:text-white p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer z-10"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 1. من نحن (About Us) */}
        {activeModal === 'about' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">
                  {isAr ? 'لافريكونوميست | من نحن' : 'L’Africonomist | About Us'}
                </h3>
                <p className="text-xs text-amber-400 font-serif">
                  {isAr ? 'صحيفة الاقتصاد الإفريقي المستقلة' : 'The Independent African Economic Journal'}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                {isAr 
                  ? '«لافريكونوميست» هي صحيفة ومؤسسة صحفية مالية متخصصة في رصد التحولات الاستثمارية، السياسات النقدية، وثروات القارة الأفريقية عبر الـ 55 دولة.'
                  : 'L’Africonomist is a premier independent financial publication dedicated to tracking macroeconomic shifts, monetary policy, and capital markets across all 55 African sovereign states.'}
              </p>
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <span className="font-bold text-amber-400 block">
                  {isAr ? 'رسالتنا التحريرية الصارمة:' : 'Our Editorial Mission:'}
                </span>
                <ul className="space-y-1.5 text-slate-400 list-disc list-inside">
                  <li>{isAr ? 'صحافة بيانات استقصائية مدعومة بالوثائق الرسمية والأرقام المقارنة.' : 'Data-backed investigative journalism grounded in official primary records.'}</li>
                  <li>{isAr ? 'مبدأ الرقابة البشرية المشددة (Human-in-the-Loop) قبل إجازة أي تقرير.' : 'Strict Human-in-the-Loop oversight before any editorial publishing.'}</li>
                  <li>{isAr ? 'استقلالية كاملة وتغطية شاملة لكافة أقاليم القارة من القاهرة إلى جوهانسبرغ.' : 'Uncompromising independence covering all continental regions from Cairo to Johannesburg.'}</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 2. الشروط والخصوصية (Terms & Privacy) */}
        {activeModal === 'privacy' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">
                  {isAr ? 'ميثاق النزاهة التحريرية والخصوصية' : 'Editorial Integrity & Privacy Charter'}
                </h3>
                <p className="text-xs text-slate-400">
                  {isAr ? 'صحيفة الاقتصاد الإفريقي' : 'African Economic Journal Standard'}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                {isAr
                  ? 'تلتزم لافريكونوميست بأعلى معايير الشفافية وحماية بيانات القراء وعدم مشاركتها مع أي أطراف تجارية.'
                  : 'L’Africonomist adheres to the highest standards of data security, zero-trust RBAC, and editorial integrity.'}
              </p>
            </div>
          </div>
        )}

        {/* 3. البودكاست (Podcasts) */}
        {activeModal === 'podcast' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">
                  {isAr ? 'بودكاست لافريكونوميست الصوتي' : 'L’Africonomist Podcast Series'}
                </h3>
                <p className="text-xs text-amber-400">
                  {isAr ? 'حوارات معمقة مع صناع القرار والخبراء' : 'In-depth Economic Dialogues'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 4. التقارير المرئية (Video Reports) */}
        {activeModal === 'video' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">
                  {isAr ? 'التقارير المصورة والوثائقيات الاقتصادية' : 'Video Reports & Economic Documentaries'}
                </h3>
                <p className="text-xs text-rose-400">
                  {isAr ? 'صحيفة الاقتصاد الإفريقي المرئية' : 'Visual African Financial Journalism'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 5. التسجيل وعضوية القراء والمحررين (Authentication Modal) */}
        {activeModal === 'auth' && (
          <div className="space-y-5">
            {/* رأس النافذة */}
            <div className="flex items-center gap-3 border-b border-slate-800/80 pb-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-white">
                  {isAr ? 'لافريكونوميست · بوابة الدخول والاشتراك' : 'L’Africonomist · Access Gateway'}
                </h3>
                <p className="text-xs text-amber-400 font-serif">
                  {isAr ? 'احفظ مقالاتك المفضلة واستقبل التنبيهات الاقتصادية الحصرية' : 'Save your favorite articles and receive live economic insights'}
                </p>
              </div>
            </div>

            {/* إذا كان المستخدم مسجلاً دخوله بالفعل: نعرض بطاقة حسابه وزر الانتقال الفوري للملف والمقالات المحفوظة */}
            {profile && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-[#0d1424] to-slate-900 border border-amber-500/40 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {profile.photoURL ? (
                      <img 
                        src={profile.photoURL} 
                        alt={profile.displayName} 
                        className="w-11 h-11 rounded-xl object-cover border border-amber-500/50 shadow-md"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
                        {profile.displayName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-emerald-400 font-bold">● {isAr ? 'مسجل الدخول حالياً:' : 'Active User:'}</span>
                      </div>
                      <h4 className="text-sm sm:text-base font-black text-white">{profile.displayName}</h4>
                      <p className="text-[11px] text-slate-400 font-mono">{profile.email}</p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                    role === 'ADMIN' ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' :
                    role === 'SUPERVISOR' ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' :
                    role === 'EDITOR' ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' :
                    'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}>
                    {role}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2.5">
                  <button
                    onClick={() => {
                      onClose();
                      if (onNavigateToProfile) onNavigateToProfile();
                    }}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer active:scale-95"
                  >
                    <User className="w-4 h-4" />
                    <span>{isAr ? 'الانتقال إلى صفحة حسابي والمقالات المحفوظة' : 'Go to My Account & Saved Articles'}</span>
                  </button>

                  <button
                    onClick={async () => {
                      await signOut();
                      onClose();
                      if (onBackToHome) onBackToHome();
                    }}
                    className="py-2.5 px-3.5 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-300 hover:text-rose-400 text-xs font-semibold border border-slate-700/60 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{isAr ? 'خروج' : 'Sign Out'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* رسائل التنبيه أو النجاح أو الخطأ */}
            {authSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{authSuccess}</span>
              </div>
            )}

            {authError && (
              <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs font-medium space-y-2 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{authError}</span>
                </div>
                {/* اقتراح إجراء مباشر لحل المشكلة فوراً */}
                {authMode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signup');
                      setAuthError(null);
                    }}
                    className="mt-1 text-[11px] font-bold text-amber-300 hover:text-amber-200 underline block cursor-pointer"
                  >
                    {isAr ? '👈 هل هذا بريد جديد؟ اضغط هنا لإنشاء حساب وتفعيله مباشرة بهذا البريد' : 'New user? Click here to register with this email'}
                  </button>
                )}
                {authMode === 'signup' && (
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signin');
                      setAuthError(null);
                    }}
                    className="mt-1 text-[11px] font-bold text-amber-300 hover:text-amber-200 underline block cursor-pointer"
                  >
                    {isAr ? '👈 البريد مسجل مسبقاً؟ اضغط هنا للتبديل إلى تسجيل الدخول' : 'Already registered? Click to switch to Sign In'}
                  </button>
                )}
              </div>
            )}

            {/* ===================================================================
                الخياران الأساسيان الإلزاميان عند الضغط على تسجيل:
                1. تسجيل الدخول (Sign In)
                2. إنشاء حساب جديد (Create Account)
               =================================================================== */}
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-inner">
              {/* خيار 1: تسجيل الدخول */}
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin');
                  setAuthError(null);
                }}
                className={`py-3 px-3 sm:px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  authMode === 'signin'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20 scale-[1.01]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>{isAr ? 'تسجيل الدخول' : 'Sign In'}</span>
              </button>

              {/* خيار 2: إنشاء حساب جديد */}
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setAuthError(null);
                }}
                className={`py-3 px-3 sm:px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  authMode === 'signup'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20 scale-[1.01]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>{isAr ? 'إنشاء حساب جديد' : 'Create Account'}</span>
              </button>
            </div>

            {isResetMode ? (
              <form onSubmit={handleResetPassword} className="space-y-4 text-xs animate-in fade-in">
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs leading-relaxed">
                  {isAr 
                    ? 'أدخل عنوان بريدك الإلكتروني، وسنرسل إليك رابطاً آمناً لإعادة تعيين كلمة المرور فوراً لتتمكن من تسجيل الدخول.' 
                    : 'Enter your email address to receive a secure password reset link.'}
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{isAr ? 'البريد الإلكتروني' : 'Email Address'}</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="analyst@africonomist.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/80 shadow-inner"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {authLoading ? (isAr ? 'جاري الإرسال...' : 'Sending...') : (isAr ? 'إرسال رابط استعادة كلمة المرور' : 'Send Password Reset Link')}
                </button>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsResetMode(false);
                      setAuthError(null);
                    }}
                    className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {isAr ? '← العودة لتسجيل الدخول' : '← Back to Sign In'}
                  </button>
                </div>
              </form>
            ) : (
              <>
                {/* زر الدخول الموحد بـ Google بنقرة واحدة */}
                <div className="space-y-3">
                  <button
                    type="button"
                    disabled={authLoading}
                    onClick={handleGoogleSignIn}
                    className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center gap-2.5 shadow-md transition-all cursor-pointer active:scale-[0.99] disabled:opacity-50"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>
                      {authMode === 'signup' 
                        ? (isAr ? 'إنشاء حساب فوري بواسطة Google' : 'Sign up instantly with Google') 
                        : (isAr ? 'تسجيل الدخول السريع بواسطة Google' : 'Continue with Google')}
                    </span>
                  </button>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <div className="flex-1 h-px bg-slate-800"></div>
                    <span>{isAr ? 'أو عبر البريد الإلكتروني وكلمة المرور' : 'Or via email & password'}</span>
                    <div className="flex-1 h-px bg-slate-800"></div>
                  </div>
                </div>

                {/* النموذج الديناميكي وفق التبويب المختار */}
                <form onSubmit={handleEmailAuth} className="space-y-3.5 text-xs">
                  {/* 1. حقول الاسم واللقب (تظهر في حالة إنشاء حساب جديد) */}
                  {authMode === 'signup' && (
                    <div className="grid grid-cols-2 gap-2.5 animate-in fade-in duration-150">
                      <div className="space-y-1">
                        <label className="text-slate-300 font-bold flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-amber-400" />
                          <span>{isAr ? 'الاسم' : 'First Name'}</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={authFirstName}
                          onChange={(e) => setAuthFirstName(e.target.value)}
                          placeholder={isAr ? 'مثال: طارق' : 'e.g. Tarek'}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/80 shadow-inner"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-300 font-bold flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-amber-400" />
                          <span>{isAr ? 'اللقب' : 'Last Name'}</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={authLastName}
                          onChange={(e) => setAuthLastName(e.target.value)}
                          placeholder={isAr ? 'مثال: المنصوري' : 'e.g. Mansouri'}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/80 shadow-inner"
                        />
                      </div>
                    </div>
                  )}

                  {/* 2. رقم الواتساب والدولة (تظهر في حالة إنشاء حساب جديد) */}
                  {authMode === 'signup' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 animate-in fade-in duration-150">
                      <div className="space-y-1">
                        <label className="text-slate-300 font-bold flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{isAr ? 'رقم الواتساب' : 'WhatsApp Number'}</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={authWhatsapp}
                          onChange={(e) => setAuthWhatsapp(e.target.value)}
                          placeholder="+213 555 123 456"
                          dir="ltr"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/80 shadow-inner font-mono text-left"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-300 font-bold flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-sky-400" />
                          <span>{isAr ? 'الدولة' : 'Country'}</span>
                        </label>
                        <select
                          value={authCountry}
                          onChange={(e) => setAuthCountry(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500/80 shadow-inner text-xs cursor-pointer"
                        >
                          {ALL_54_AFRICAN_COUNTRIES.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.nameAr} ({c.code})
                            </option>
                          ))}
                          <option value="OTHER">{isAr ? 'دولة أخرى / دولي' : 'Other / International'}</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* 3. البريد الإلكتروني وتأكيد البريد الإلكتروني */}
                  <div className={`space-y-2.5 ${authMode === 'signup' ? 'space-y-2.5' : ''}`}>
                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{isAr ? 'البريد الإلكتروني' : 'Email Address'}</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        placeholder="analyst@africonomist.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/80 shadow-inner"
                      />
                    </div>

                    {authMode === 'signup' && (
                      <div className="space-y-1 animate-in fade-in duration-150">
                        <div className="flex items-center justify-between">
                          <label className="text-slate-300 font-bold flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-amber-400" />
                            <span>{isAr ? 'تأكيد البريد الإلكتروني' : 'Confirm Email'}</span>
                          </label>
                          {authConfirmEmail && (
                            <span className={`text-[10px] font-bold flex items-center gap-1 ${
                              authEmail.trim().toLowerCase() === authConfirmEmail.trim().toLowerCase()
                                ? 'text-emerald-400'
                                : 'text-rose-400'
                            }`}>
                              {authEmail.trim().toLowerCase() === authConfirmEmail.trim().toLowerCase()
                                ? (isAr ? '✓ متطابق' : '✓ Matches')
                                : (isAr ? '✗ غير متطابق' : '✗ Mismatch')}
                            </span>
                          )}
                        </div>
                        <input
                          type="email"
                          required
                          value={authConfirmEmail}
                          onChange={(e) => setAuthConfirmEmail(e.target.value)}
                          placeholder="analyst@africonomist.com"
                          className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border text-white placeholder:text-slate-600 focus:outline-none shadow-inner ${
                            authConfirmEmail && authEmail.trim().toLowerCase() !== authConfirmEmail.trim().toLowerCase()
                              ? 'border-rose-500/80 focus:border-rose-500'
                              : 'border-slate-800 focus:border-amber-500/80'
                          }`}
                        />
                      </div>
                    )}
                  </div>

                  {/* 4. كلمة المرور وتأكيد كلمة المرور */}
                  <div className={`space-y-2.5 ${authMode === 'signup' ? 'grid grid-cols-1 sm:grid-cols-2 gap-2.5 space-y-0' : ''}`}>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-slate-300 font-bold flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{isAr ? 'كلمة المرور' : 'Password'}</span>
                        </label>
                        {authMode === 'signin' && (
                          <button
                            type="button"
                            onClick={() => {
                              setIsResetMode(true);
                              setAuthError(null);
                              setAuthSuccess(null);
                            }}
                            className="text-[11px] text-amber-400 hover:text-amber-300 underline transition-colors cursor-pointer"
                          >
                            {isAr ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
                          </button>
                        )}
                      </div>
                      <input
                        type="password"
                        required
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/80 shadow-inner"
                      />
                    </div>

                    {authMode === 'signup' && (
                      <div className="space-y-1 animate-in fade-in duration-150">
                        <div className="flex items-center justify-between">
                          <label className="text-slate-300 font-bold flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5 text-amber-400" />
                            <span>{isAr ? 'تأكيد كلمة المرور' : 'Confirm Password'}</span>
                          </label>
                          {authConfirmPassword && (
                            <span className={`text-[10px] font-bold ${
                              authPassword === authConfirmPassword ? 'text-emerald-400' : 'text-rose-400'
                            }`}>
                              {authPassword === authConfirmPassword ? (isAr ? '✓ متطابقة' : '✓ Matches') : (isAr ? '✗ غير متطابقة' : '✗ Mismatch')}
                            </span>
                          )}
                        </div>
                        <input
                          type="password"
                          required
                          value={authConfirmPassword}
                          onChange={(e) => setAuthConfirmPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border text-white placeholder:text-slate-600 focus:outline-none shadow-inner ${
                            authConfirmPassword && authPassword !== authConfirmPassword
                              ? 'border-rose-500/80 focus:border-rose-500'
                              : 'border-slate-800 focus:border-amber-500/80'
                          }`}
                        />
                      </div>
                    )}
                  </div>

                  {/* 5. إلغاء تحديد الأدوار من صفحة إنشاء حساب - تحديد الأدوار يكون عن طريق المشرف فيما بعد */}
                  {authMode === 'signup' && (
                    <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-amber-500/30 text-[11px] leading-relaxed flex items-start gap-2.5 animate-in fade-in duration-150">
                      <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400 mt-0.5">
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="font-bold text-amber-300 block">
                          {isAr ? 'تفعيل الحساب وتحديد الصلاحيات (RBAC):' : 'Role & Access Control Policy:'}
                        </span>
                        <p className="text-slate-300">
                          {isAr 
                            ? 'يتم تفعيل الحساب فورياً بصفة [قارئ ومستثمر]. يُسند ويُحدد دور المحرر أو المشرف لاحقاً من قِبل المشرفين وهيئة التحرير عبر لوحة التحكم.'
                            : 'All new accounts are activated as Readers. Editorial roles (Editor/Supervisor) are assigned post-registration by Supervisors.'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* زر الإرسال الأساسي */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={authLoading}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>
                        {authLoading 
                          ? (isAr ? 'جاري التحقق والاتصال...' : 'Processing...') 
                          : authMode === 'signup' 
                          ? (isAr ? 'إنشاء وتفعيل الحساب الآن' : 'Create Account Now') 
                          : (isAr ? 'تسجيل الدخول إلى حسابي' : 'Sign In to My Account')}
                      </span>
                    </button>
                  </div>

                  {/* رابط التبديل المباشر بين الخيارين */}
                  <div className="pt-1 text-center">
                    {authMode === 'signup' ? (
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('signin');
                          setAuthError(null);
                        }}
                        className="text-xs text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
                      >
                        {isAr ? 'لديك حساب بالفعل؟ ' : 'Already have an account? '}
                        <span className="text-amber-400 font-bold underline">{isAr ? 'سجل دخولك هنا' : 'Sign In here'}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('signup');
                          setAuthError(null);
                        }}
                        className="text-xs text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
                      >
                        {isAr ? 'ليس لديك حساب بعد؟ ' : 'Don’t have an account? '}
                        <span className="text-amber-400 font-bold underline">{isAr ? 'أنشئ حساباً جديداً مجاناً' : 'Create an account for free'}</span>
                      </button>
                    )}
                  </div>
                </form>
              </>
            )}

            {/* قسم تجربة الأدوار السريعة (للمراجعة والتدقيق والاختبار) */}
            <div className="pt-3 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => setShowDemoRoles(prev => !prev)}
                className="w-full text-center text-[11px] text-purple-400/90 hover:text-purple-300 font-bold flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>⚡ {isAr ? 'تجربة سريعة للأدوار التحريرية (Admin / Supervisor / Editor / Reader)' : 'Instant Demo Role Switcher'}</span>
              </button>

              {showDemoRoles && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 animate-in fade-in duration-200">
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('ADMIN')}
                    className="p-2 rounded-xl bg-rose-950/30 hover:bg-rose-950/50 border border-rose-500/40 text-center transition-all cursor-pointer"
                  >
                    <div className="text-[11px] font-bold text-rose-300">الأدمن</div>
                    <div className="text-[9.5px] text-slate-400">كامل الصلاحيات</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDemoLogin('SUPERVISOR')}
                    className="p-2 rounded-xl bg-purple-950/30 hover:bg-purple-950/50 border border-purple-500/40 text-center transition-all cursor-pointer"
                  >
                    <div className="text-[11px] font-bold text-purple-300">المشرف</div>
                    <div className="text-[9.5px] text-slate-400">مراجعة ونشر</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDemoLogin('EDITOR')}
                    className="p-2 rounded-xl bg-blue-950/30 hover:bg-blue-950/50 border border-blue-500/40 text-center transition-all cursor-pointer"
                  >
                    <div className="text-[11px] font-bold text-blue-300">المحرر</div>
                    <div className="text-[9.5px] text-slate-400">صياغة دون نشر</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDemoLogin('READER')}
                    className="p-2 rounded-xl bg-emerald-950/30 hover:bg-emerald-950/50 border border-emerald-500/40 text-center transition-all cursor-pointer"
                  >
                    <div className="text-[11px] font-bold text-emerald-300">القارئ</div>
                    <div className="text-[9.5px] text-slate-400">حفظ المقالات</div>
                  </button>
                </div>
              )}
            </div>
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
              className="text-amber-400/80 hover:text-amber-300 underline cursor-pointer"
            >
              {isAr ? 'الانتقال إلى غرفة الأخبار' : 'Go to Newsroom'}
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
