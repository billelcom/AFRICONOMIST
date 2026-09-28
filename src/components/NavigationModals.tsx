/* eslint-disable @next/next/no-img-element */
// src/components/NavigationModals.tsx
import React, { useState } from 'react';
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
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/auth';

export type NavModalType = 'about' | 'privacy' | 'podcast' | 'video' | 'auth' | null;

interface NavigationModalsProps {
  activeModal: NavModalType;
  onClose: () => void;
  lang: 'ar' | 'en';
  onNavigateToNewsroom?: () => void;
  onNavigateToProfile?: () => void;
}

export const NavigationModals: React.FC<NavigationModalsProps> = ({
  activeModal,
  onClose,
  lang,
  onNavigateToNewsroom,
  onNavigateToProfile
}) => {
  const isAr = lang === 'ar';
  const { 
    user, 
    profile, 
    role, 
    signInWithGoogle, 
    signInWithEmail, 
    signUpWithEmail, 
    loginAsDemoRole, 
    signOut 
  } = useAuth();

  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'demo'>('signin');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authDisplayName, setAuthDisplayName] = useState('');
  const [authRole, setAuthRole] = useState<UserRole>('READER');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  if (!activeModal) return null;

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
      console.warn('Google sign-in error:', err);
      setAuthError(isAr ? 'تعذر تسجيل الدخول عبر Google. يمكنك استخدام الدخول السريع أو البريد.' : 'Google sign-in was canceled or failed.');
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
        if (!authDisplayName.trim()) {
          setAuthError(isAr ? 'يرجى كتابة الاسم الكامل' : 'Please enter your display name');
          setAuthLoading(false);
          return;
        }
        await signUpWithEmail(authEmail, authPassword, authDisplayName.trim(), authRole);
        setAuthSuccess(isAr ? 'تم إنشاء الحساب بنجاح وتفعيله' : 'Account created successfully');
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
      if (msg.includes('user-not-found') || msg.includes('wrong-password') || msg.includes('invalid-credential')) {
        setAuthError(isAr ? 'بيانات الدخول غير صحيحة. تحقق من البريد وكلمة المرور أو أنشئ حساباً جديداً.' : 'Invalid credentials. Please verify your email and password.');
      } else if (msg.includes('email-already-in-use')) {
        setAuthError(isAr ? 'هذا البريد مستخدم مسبقاً. قم بتسجيل الدخول مباشرة.' : 'Email is already registered. Please sign in.');
      } else if (msg.includes('weak-password')) {
        setAuthError(isAr ? 'كلمة المرور ضعيفة. يرجى إدخال 6 أحرف على الأقل.' : 'Password should be at least 6 characters.');
      } else {
        setAuthError(isAr ? 'حدث خطأ أثناء المصادقة. يمكنك استخدام تجربة الأدوار الفورية.' : 'Authentication error. You may try demo role login.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleDemoLogin = async (selectedRole: UserRole) => {
    setAuthLoading(true);
    await loginAsDemoRole(selectedRole);
    setAuthSuccess(isAr ? `تم الدخول كـ [${selectedRole}] بنجاح` : `Logged in as [${selectedRole}]`);
    setTimeout(() => {
      setAuthSuccess(null);
      onClose();
      if (onNavigateToProfile) onNavigateToProfile();
    }, 1000);
    setAuthLoading(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#0A0E17] border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-7 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto ring-1 ring-amber-500/20">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 sm:left-auto sm:right-4 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-900 border border-slate-800 transition-colors"
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

        {/* 5. التسجيل والعضوية والأدوار (Authentication / Membership / Roles) */}
        {activeModal === 'auth' && (
          <div className="space-y-4">
            {/* رأس النافذة */}
            <div className="flex items-center gap-3 border-b border-slate-800/80 pb-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-white">
                  {isAr ? 'تسجيل الدخول وإدارة الأدوار التحريرية' : 'Sign In & Editorial RBAC Access'}
                </h3>
                <p className="text-xs text-amber-400 font-serif">
                  {isAr ? 'منصة لافريكونوميست · مدعومة بقاعدة بيانات Firebase' : 'L’Africonomist · Powered by Firebase'}
                </p>
              </div>
            </div>

            {/* في حالة كان المستخدم مسجلاً بالفعل */}
            {profile && (
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {profile.photoURL ? (
                      <img 
                        src={profile.photoURL} 
                        alt={profile.displayName} 
                        className="w-10 h-10 rounded-xl object-cover border border-amber-500/40"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                        {profile.displayName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-white">{profile.displayName}</h4>
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

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      onClose();
                      if (onNavigateToProfile) onNavigateToProfile();
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>{isAr ? 'الانتقال إلى صفحتي الشخصية' : 'Go to Profile'}</span>
                  </button>

                  <button
                    onClick={async () => {
                      await signOut();
                    }}
                    className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-300 hover:text-rose-400 text-xs font-medium border border-slate-700/60 flex items-center gap-1 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{isAr ? 'خروج' : 'Sign Out'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* رسائل النجاح أو الخطأ */}
            {authSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{authSuccess}</span>
              </div>
            )}

            {authError && (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs font-medium flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {/* أزرار التبديل بين أوضاع الدخول */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-2xl border border-slate-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => setAuthMode('signin')}
                className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                  authMode === 'signin' ? 'bg-amber-500 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                {isAr ? 'تسجيل الدخول' : 'Sign In'}
              </button>

              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                  authMode === 'signup' ? 'bg-amber-500 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                {isAr ? 'إنشاء حساب جديد' : 'New Account'}
              </button>

              <button
                type="button"
                onClick={() => setAuthMode('demo')}
                className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                  authMode === 'demo' ? 'bg-purple-600 text-white shadow-md font-black' : 'text-purple-300 hover:text-white'
                }`}
              >
                ⚡ {isAr ? 'تجربة الأدوار' : 'Demo Roles'}
              </button>
            </div>

            {/* زر Google Sign In بنقرة واحدة */}
            {authMode !== 'demo' && (
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
                  <span>{isAr ? 'المتابعة والدخول السريع بواسطة Google' : 'Continue with Google'}</span>
                </button>

                <div className="flex items-center gap-3 text-[11px] text-slate-500">
                  <div className="flex-1 h-px bg-slate-800"></div>
                  <span>{isAr ? 'أو عبر البريد الإلكتروني' : 'Or via email credentials'}</span>
                  <div className="flex-1 h-px bg-slate-800"></div>
                </div>
              </div>
            )}

            {/* نموذج البريد وكلمة المرور */}
            {authMode !== 'demo' && (
              <form onSubmit={handleEmailAuth} className="space-y-3 text-xs">
                {authMode === 'signup' && (
                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isAr ? 'الاسم الكامل أو اسم الشهرة التحريري' : 'Full Name'}</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={authDisplayName}
                      onChange={(e) => setAuthDisplayName(e.target.value)}
                      placeholder={isAr ? 'طارق المنصوري' : 'Tarek Mansouri'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/60"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{isAr ? 'البريد الإلكتروني' : 'Email Address'}</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="editor@africonomist.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/60"
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/60"
                  />
                </div>

                {authMode === 'signup' && (
                  <div className="space-y-1 pt-1">
                    <label className="text-slate-300 font-medium flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                      <span>{isAr ? 'اختر الدور المرغوب (RBAC):' : 'Select Desired Role:'}</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {[
                        { id: 'ADMIN', labelAr: 'الأدمن (Admin)', descAr: 'صلاحيات كاملة للمنصة' },
                        { id: 'SUPERVISOR', labelAr: 'مشرف (Supervisor)', descAr: 'مراجعة واعتماد ونشر' },
                        { id: 'EDITOR', labelAr: 'محرر (Editor)', descAr: 'صياغة وتوليد دون نشر' },
                        { id: 'READER', labelAr: 'قارئ (Reader)', descAr: 'قراءة وحفظ المقالات' },
                      ].map((r) => (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => setAuthRole(r.id as UserRole)}
                          className={`p-2 rounded-xl text-right border transition-all cursor-pointer ${
                            authRole === r.id 
                              ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 font-bold' 
                              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <div className="text-xs font-bold text-white">{r.labelAr}</div>
                          <div className="text-[10px] text-slate-400">{r.descAr}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-3 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white font-medium text-xs transition-colors"
                  >
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </button>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>
                      {authLoading 
                        ? (isAr ? 'جاري التحقق...' : 'Verifying...') 
                        : authMode === 'signup' 
                        ? (isAr ? 'إنشاء وتفعيل الحساب' : 'Create Account') 
                        : (isAr ? 'دخول فوري' : 'Sign In')}
                    </span>
                  </button>
                </div>
              </form>
            )}

            {/* وضع تجربة الأدوار الفورية (للاختبار والمراجعة والتنقل بين الصلاحيات فورياً) */}
            {authMode === 'demo' && (
              <div className="space-y-3 animate-in fade-in">
                <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 text-xs text-purple-200 leading-relaxed">
                  {isAr 
                    ? 'اختر أي دور بنقرة واحدة لتجربة الصلاحيات التحريرية والتأكد من قيود النشر والمراجعة وملاحظات المشرفين:' 
                    : 'Switch instantly into any role to experience the editorial workflow and permissions:'}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* الأدمن */}
                  <button
                    onClick={() => handleDemoLogin('ADMIN')}
                    className="p-3 rounded-2xl bg-rose-950/20 hover:bg-rose-950/40 border border-rose-500/30 text-right transition-all group flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-rose-300 flex items-center gap-1.5">
                        <Crown className="w-3.5 h-3.5 text-rose-400" />
                        <span>الأدمن (Admin)</span>
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">كامل الصلاحيات</span>
                    </div>
                    <p className="text-[10.5px] text-slate-400 leading-relaxed">
                      له صلاحية الوصول لكل شيء: النشر المباشر، تعديل الأدوار، ومراجعة كافة الأقسام.
                    </p>
                  </button>

                  {/* المشرف */}
                  <button
                    onClick={() => handleDemoLogin('SUPERVISOR')}
                    className="p-3 rounded-2xl bg-purple-950/20 hover:bg-purple-950/40 border border-purple-500/30 text-right transition-all group flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-purple-300 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                        <span>المشرفين (Supervisor)</span>
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">نشر وملاحظات</span>
                    </div>
                    <p className="text-[10.5px] text-slate-400 leading-relaxed">
                      الاطلاع على تقارير الذكاء الاصطناعي ومراجعتها ونشرها وترك ملاحظات للمحررين.
                    </p>
                  </button>

                  {/* المحرر */}
                  <button
                    onClick={() => handleDemoLogin('EDITOR')}
                    className="p-3 rounded-2xl bg-blue-950/20 hover:bg-blue-950/40 border border-blue-500/30 text-right transition-all group flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-blue-300 flex items-center gap-1.5">
                        <Edit3 className="w-3.5 h-3.5 text-blue-400" />
                        <span>المحررين (Editor)</span>
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">توليد دون نشر</span>
                    </div>
                    <p className="text-[10.5px] text-slate-400 leading-relaxed">
                      توليد التقارير بالذكاء الاصطناعي وصياغتها وحفظها لطلب مراجعة المشرف، دون إمكانية النشر المباشر.
                    </p>
                  </button>

                  {/* القارئ */}
                  <button
                    onClick={() => handleDemoLogin('READER')}
                    className="p-3 rounded-2xl bg-emerald-950/20 hover:bg-emerald-950/40 border border-emerald-500/30 text-right transition-all group flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-emerald-300 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-emerald-400" />
                        <span>القارئ (Reader)</span>
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">حفظ وتنبيهات</span>
                    </div>
                    <p className="text-[10.5px] text-slate-400 leading-relaxed">
                      الاطلاع على الأخبار وملفات الدول وحفظ المقالات في الحساب وتلقي الإشعارات.
                    </p>
                  </button>
                </div>
              </div>
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
              className="text-amber-400/80 hover:text-amber-300 underline cursor-pointer"
            >
              {isAr ? 'الانتقال إلى غرفة الأخبار' : 'Go to Newsroom'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
