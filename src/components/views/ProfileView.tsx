/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Article, AfricanCountryProfile } from '../../types';
import { UserRole } from '../../types/auth';
import { 
  ShieldCheck, 
  Bookmark, 
  Bell, 
  User, 
  Settings, 
  Check, 
  Trash2, 
  ExternalLink, 
  LogOut, 
  Sparkles, 
  Award, 
  Crown, 
  Edit3, 
  FileText, 
  Globe2, 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  Camera,
  Layers,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { getCountryFlag } from '../../lib/africanGeoProximity';

interface ProfileViewProps {
  articles: Article[];
  allCountries: AfricanCountryProfile[];
  onSelectArticle: (article: Article) => void;
  onNavigateToNewsroom: () => void;
  onNavigateToNotifications: () => void;
  onBackToHome: () => void;
  lang: 'ar' | 'en';
}

const COVER_PRESETS = [
  { id: 'financial_gold', nameAr: 'أفق مالي ذهبي', url: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80' },
  { id: 'johannesburg', nameAr: 'أضواء جوهانسبرغ', url: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&w=1200&q=80' },
  { id: 'markets_trading', nameAr: 'أسواق المال والتحليل', url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80' },
  { id: 'atlantic_coast', nameAr: 'الساحل الأطلسي الإفريقي', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80' },
];

export const ProfileView: React.FC<ProfileViewProps> = ({
  articles,
  allCountries,
  onSelectArticle,
  onNavigateToNewsroom,
  onNavigateToNotifications,
  onBackToHome,
  lang
}) => {
  const isAr = lang === 'ar';
  const { 
    user, 
    profile, 
    role, 
    updateUserProfile, 
    savedArticles, 
    unsaveArticle, 
    signOut, 
    loginAsDemoRole,
    unreadCount 
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'saved' | 'roles' | 'settings'>('saved');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [displayName, setDisplayName] = useState<string>(profile?.displayName || '');
  const [bio, setBio] = useState<string>(profile?.bio || '');
  const [favCountry, setFavCountry] = useState<string>(profile?.favoriteCountry || 'DZ');
  const [selectedCover, setSelectedCover] = useState<string>(profile?.coverURL || COVER_PRESETS[0].url);
  const [isCoverPickerOpen, setIsCoverPickerOpen] = useState<boolean>(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  const handleSaveProfile = async () => {
    await updateUserProfile({
      displayName: displayName.trim() || profile?.displayName || 'مستخدم المنصة',
      bio: bio.trim(),
      favoriteCountry: favCountry,
      coverURL: selectedCover
    });
    setIsEditing(false);
    setSaveSuccessMessage(isAr ? 'تم حفظ التعديلات بنجاح' : 'Profile updated successfully');
    setTimeout(() => setSaveSuccessMessage(null), 3000);
  };

  const handleRoleChange = async (newRole: UserRole) => {
    await updateUserProfile({ role: newRole });
    setSaveSuccessMessage(isAr ? `تم تحديث دورك إلى [${newRole}]` : `Role updated to [${newRole}]`);
    setTimeout(() => setSaveSuccessMessage(null), 3000);
  };

  const getRoleBadge = (userRole: UserRole) => {
    switch (userRole) {
      case 'ADMIN':
        return {
          labelAr: 'الأدمن - مدير النظام والتحرير',
          labelEn: 'Administrator (Full Access)',
          color: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          icon: Crown
        };
      case 'SUPERVISOR':
        return {
          labelAr: 'مشرف تحرير - اعتماد ونشر ومراجعة',
          labelEn: 'Editorial Supervisor (Publisher)',
          color: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
          icon: ShieldCheck
        };
      case 'EDITOR':
        return {
          labelAr: 'محرر اقتصادي - صياغة وتوليد المسودات',
          labelEn: 'Economic Editor (Drafting)',
          color: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
          icon: Edit3
        };
      default:
        return {
          labelAr: 'قارئ ومستثمر - متابعة وحفظ',
          labelEn: 'Reader & Investor',
          color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          icon: Bookmark
        };
    }
  };

  const roleInfo = getRoleBadge(role);
  const RoleIcon = roleInfo.icon;

  return (
    <div className="space-y-6 pb-20 animate-in fade-in-50 duration-200">
      {/* 1. شريط التنقل الفرعي */}
      <div className="flex items-center justify-between text-xs bg-slate-900/60 border border-slate-800/80 px-4 py-2.5 rounded-2xl">
        <div className="flex items-center gap-2 text-slate-400">
          <button
            onClick={onBackToHome}
            className="text-slate-300 hover:text-amber-400 transition-colors flex items-center gap-1 font-semibold"
          >
            {isAr ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
            <span>{isAr ? 'الرئيسية' : 'Home'}</span>
          </button>
          <span>/</span>
          <span className="text-amber-400 font-bold">{isAr ? 'حسابي والملف الشخصي' : 'My Account'}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToNotifications}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors relative"
          >
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span>{isAr ? 'الإشعارات' : 'Notifications'}</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white font-mono">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={signOut}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/40 hover:text-rose-300 text-slate-400 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700/60"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{isAr ? 'خروج' : 'Sign Out'}</span>
          </button>
        </div>
      </div>

      {saveSuccessMessage && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in-50">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{saveSuccessMessage}</span>
        </div>
      )}

      {/* 2. بطاقة البروفايل الرئيسية: الكوفر بالأعلى مع صورة البروفايل في الوسط */}
      <div className="rounded-3xl bg-[#0c1322] border border-slate-800 shadow-2xl overflow-hidden relative">
        {/* أ) صورة الكوفر في الأعلى (Cover Image) */}
        <div className="w-full h-48 sm:h-64 relative bg-slate-900 overflow-hidden group">
          <img
            src={selectedCover}
            alt="Cover"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c1322] via-[#0c1322]/40 to-transparent"></div>

          {/* زر تغيير الكوفر */}
          <button
            onClick={() => setIsCoverPickerOpen(prev => !prev)}
            className="absolute top-4 left-4 rtl:left-auto rtl:right-4 px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 text-white text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md border border-slate-700/80 shadow-lg transition-all"
          >
            <Camera className="w-3.5 h-3.5 text-amber-400" />
            <span>{isAr ? 'تغيير الغلاف' : 'Change Cover'}</span>
          </button>

          {/* قائمة اختيار كوفر معد مسبقاً */}
          {isCoverPickerOpen && (
            <div className="absolute top-14 left-4 rtl:left-auto rtl:right-4 p-3 rounded-2xl bg-slate-950/95 border border-slate-800 shadow-2xl backdrop-blur-lg z-20 space-y-2">
              <span className="text-[11px] text-slate-400 font-bold block mb-1">
                {isAr ? 'اختر صورة الغلاف:' : 'Select Cover:'}
              </span>
              <div className="grid grid-cols-2 gap-2">
                {COVER_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedCover(p.url);
                      setIsCoverPickerOpen(false);
                      updateUserProfile({ coverURL: p.url });
                    }}
                    className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-right rtl:text-right ltr:text-left text-xs text-slate-200 border border-slate-800 hover:border-amber-500/50 transition-all flex items-center gap-2"
                  >
                    <img src={p.url} alt={p.nameAr} className="w-10 h-8 rounded-lg object-cover" />
                    <span className="text-[11px] font-medium truncate">{p.nameAr}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ب) صورة البروفايل في الوسط بشكل جميل وبارز (Centered Avatar) */}
        <div className="relative px-6 pb-6 pt-0 flex flex-col items-center text-center -mt-20 sm:-mt-24 z-10">
          <div className="relative group">
            <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full p-1.5 bg-gradient-to-br from-amber-400 via-amber-600 to-amber-800 shadow-2xl shadow-amber-500/20">
              <img
                src={profile?.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(profile?.displayName || 'AF')}`}
                alt={profile?.displayName || 'User'}
                className="w-full h-full rounded-full object-cover bg-slate-900 border-2 border-slate-950"
              />
            </div>
            {/* مؤشر الحالة نشط */}
            <span className="w-5 h-5 rounded-full bg-emerald-500 border-4 border-[#0c1322] absolute bottom-1 right-2" title={isAr ? 'نشط الآن' : 'Active'} />
          </div>

          {/* الاسم والبريد */}
          <div className="mt-3 space-y-1">
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {profile?.displayName || (isAr ? 'مستخدم منصة لافريكونوميست' : 'Africonomist User')}
              </h1>
              <button
                onClick={() => setIsEditing(prev => !prev)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition-colors"
                title={isAr ? 'تعديل الملف' : 'Edit profile'}
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              {profile?.email || user?.email || 'authenticated-user@africonomist.com'}
            </p>
          </div>

          {/* شارة الدور (Badge) في الوسط */}
          <div className="mt-3 flex items-center gap-2">
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 shadow-md ${roleInfo.color}`}>
              <RoleIcon className="w-4 h-4 shrink-0" />
              <span>{isAr ? roleInfo.labelAr : roleInfo.labelEn}</span>
            </span>

            {profile?.favoriteCountry && (
              <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                <span>{getCountryFlag(profile.favoriteCountry)}</span>
                <span>{allCountries.find(c => c.code === profile.favoriteCountry)?.nameAr || profile.favoriteCountry}</span>
              </span>
            )}
          </div>

          {/* النبذة التعريفية (Bio) */}
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-3 leading-relaxed">
            {profile?.bio || (isAr ? 'متابع ومحلل للشؤون الاقتصادية وأسواق المال الإفريقية.' : 'Financial and economic analyst following African markets.')}
          </p>

          {/* إحصائيات سريعة للحساب */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 mt-6 pt-6 border-t border-slate-800/80 w-full max-w-lg">
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/60">
              <span className="text-[10px] text-slate-400 block mb-1">{isAr ? 'المقالات المحفوظة' : 'Saved'}</span>
              <span className="text-lg font-bold font-mono text-amber-400">{savedArticles.length}</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/60">
              <span className="text-[10px] text-slate-400 block mb-1">{isAr ? 'الإشعارات الجديدة' : 'Unread'}</span>
              <span className="text-lg font-bold font-mono text-sky-400">{unreadCount}</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/60">
              <span className="text-[10px] text-slate-400 block mb-1">{isAr ? 'مستوى الصلاحية' : 'Access Level'}</span>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">{role}</span>
            </div>
          </div>
        </div>
      </div>

      {/* نموذج التعديل السريع للملف الشخصي إن كان مفتوحاً */}
      {isEditing && (
        <div className="p-6 rounded-3xl bg-[#0d1424] border border-amber-500/40 shadow-xl space-y-4 animate-in fade-in-50">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-amber-400" />
              <span>{isAr ? 'تعديل بيانات الملف الشخصي' : 'Edit Profile Information'}</span>
            </h3>
            <button
              onClick={() => setIsEditing(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1.5">{isAr ? 'الاسم الظاهر' : 'Display Name'}</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1.5">{isAr ? 'الدولة المفضلة للمتابعة' : 'Favorite Country'}</label>
              <select
                value={favCountry}
                onChange={(e) => setFavCountry(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                {allCountries.map(c => (
                  <option key={c.code} value={c.code}>
                    {c.nameAr} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs text-slate-400 block mb-1.5">{isAr ? 'نبذة عنك' : 'Biography'}</label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              {isAr ? 'تراجع' : 'Discard'}
            </button>
            <button
              onClick={handleSaveProfile}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isAr ? 'حفظ التعديلات' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. تبويبات الحساب: المقالات المحفوظة + الصلاحيات وتحديد الأدوار + الإعدادات */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'saved'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{isAr ? 'المقالات المحفوظة' : 'Saved Articles'}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 font-mono">
              {savedArticles.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('roles')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'roles'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isAr ? 'الصلاحيات ومصفوفة الأدوار' : 'Roles & Permissions'}</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>{isAr ? 'إعدادات الحساب' : 'Account Settings'}</span>
          </button>
        </div>

        {/* =========================================================================
            التبويب 1: المقالات المحفوظة (Saved Articles)
           ========================================================================= */}
        {activeTab === 'saved' && (
          <div className="space-y-4 animate-in fade-in-50">
            {savedArticles.length === 0 ? (
              <div className="p-10 text-center rounded-3xl bg-[#0c1322] border border-slate-800 text-slate-400 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                  <Bookmark className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white">
                  {isAr ? 'لا توجد مقالات محفوظة في حسابك حتى الآن' : 'No saved articles yet'}
                </h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  {isAr 
                    ? 'يمكنك بنقرة واحدة على زر الحفظ (Bookmark) في أي مقال تخزينه مباشرة في حسابك للرجوع إليه في أي وقت.'
                    : 'Click the save button on any article to store it directly in your private profile for offline or future reading.'}
                </p>
                <button
                  onClick={onBackToHome}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs inline-flex items-center gap-1.5 transition-all shadow-md"
                >
                  <span>{isAr ? 'تصفح التقارير الاقتصادية الآن' : 'Browse Articles'}</span>
                  {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedArticles.map((saved) => {
                  const fullArticle = articles.find(a => a.id === saved.articleId);
                  return (
                    <div
                      key={saved.id}
                      className="p-5 rounded-2xl bg-[#0c1220] border border-slate-800/90 hover:border-amber-500/40 transition-all group flex flex-col justify-between shadow-sm relative overflow-hidden"
                    >
                      <div>
                        {/* الشريط العلوي للبطاقة المحفوظة */}
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-2.5">
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 font-mono text-[10px] border border-amber-500/20">
                            {saved.category}
                          </span>

                          <button
                            onClick={() => unsaveArticle(saved.articleId)}
                            className="p-1 rounded-md text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                            title={isAr ? 'إزالة من المحفوظات' : 'Remove from saved'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {saved.imageUrl && (
                          <div className="w-full h-32 rounded-xl overflow-hidden mb-3 border border-slate-800 relative bg-slate-900">
                            <img
                              src={saved.imageUrl}
                              alt={saved.articleTitle}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        )}

                        <h4 
                          onClick={() => fullArticle && onSelectArticle(fullArticle)}
                          className="text-sm sm:text-base font-bold text-white group-hover:text-amber-300 transition-colors mb-2 line-clamp-2 leading-snug cursor-pointer"
                        >
                          {saved.articleTitle}
                        </h4>

                        <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                          {saved.summary}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-800/70 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 font-mono text-[10px]">
                          {saved.savedAt.substring(0, 10)}
                        </span>

                        {fullArticle ? (
                          <button
                            onClick={() => onSelectArticle(fullArticle)}
                            className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                          >
                            <span>{isAr ? 'مطالعة المقال' : 'Read Article'}</span>
                            {isAr ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                          </button>
                        ) : (
                          <span className="text-slate-500 text-[10px]">{isAr ? 'محفوظ في حسابك' : 'Bookmarked'}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            التبويب 2: الصلاحيات ومصفوفة الأدوار (Roles & Permissions Matrix)
           ========================================================================= */}
        {activeTab === 'roles' && (
          <div className="space-y-6 animate-in fade-in-50">
            {/* بطاقة توضيح مصفوفة الصلاحيات الصارمة */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* الأدمن */}
              <div className={`p-5 rounded-2xl border transition-all ${
                role === 'ADMIN' ? 'bg-rose-950/20 border-rose-500/50 shadow-lg' : 'bg-slate-900/50 border-slate-800'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-rose-400" />
                    <h4 className="text-sm font-bold text-white">{isAr ? 'الأدمن (Admin)' : 'Administrator'}</h4>
                  </div>
                  {role === 'ADMIN' && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500 text-white font-mono">
                      {isAr ? 'دورك الحالي' : 'Active'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                  {isAr 
                    ? 'له صلاحية الوصول لكل شيء: اعتماد المقالات، النشر الفوري، تعديل وحذف أي مقال، تعيين صلاحيات المستخدمين، والوصول لكامل مفاصل المنصة.'
                    : 'Full sovereign access: publish, review, edit, delete, adjust user roles, and access the entire system.'}
                </p>
                <div className="space-y-1.5 text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5 text-rose-300">
                    <Check className="w-3.5 h-3.5 text-rose-400" />
                    <span>{isAr ? 'الوصول لغرفة الأخبار بكامل ميزاتها' : 'Full Newsroom Desk'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-rose-300">
                    <Check className="w-3.5 h-3.5 text-rose-400" />
                    <span>{isAr ? 'النشر والاعتماد والحذف المباشر' : 'Direct Publishing & Deletion'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-rose-300">
                    <Check className="w-3.5 h-3.5 text-rose-400" />
                    <span>{isAr ? 'إدارة الأدوار وصلاحيات الأعضاء' : 'Role & User Management'}</span>
                  </div>
                </div>
              </div>

              {/* المشرفون */}
              <div className={`p-5 rounded-2xl border transition-all ${
                role === 'SUPERVISOR' ? 'bg-purple-950/20 border-purple-500/50 shadow-lg' : 'bg-slate-900/50 border-slate-800'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-purple-400" />
                    <h4 className="text-sm font-bold text-white">{isAr ? 'المشرفين (Supervisors)' : 'Supervisors'}</h4>
                  </div>
                  {role === 'SUPERVISOR' && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500 text-white font-mono">
                      {isAr ? 'دورك الحالي' : 'Active'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                  {isAr 
                    ? 'يمكن لهم الاطلاع على المقالات المولدة بالذكاء الاصطناعي ومراجعتها ونشرها، أو تحرير مقال جديد، مع آلية رفض أو طلب تعديلات من المحررين وترك ملاحظات وتوجيهات.'
                    : 'Can inspect AI drafts, review, publish them, commission new ones, or return drafts with revision feedback notes to editors.'}
                </p>
                <div className="space-y-1.5 text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5 text-purple-300">
                    <Check className="w-3.5 h-3.5 text-purple-400" />
                    <span>{isAr ? 'اعتماد المسودات ونشرها رسمياً' : 'Approve & Publish Drafts'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-purple-300">
                    <Check className="w-3.5 h-3.5 text-purple-400" />
                    <span>{isAr ? 'كتابة ملاحظات توجيهية للمحررين' : 'Leave Feedback & Notes'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-purple-300">
                    <Check className="w-3.5 h-3.5 text-purple-400" />
                    <span>{isAr ? 'توليد ونشر مقالات فورية' : 'Create & Dispatch Articles'}</span>
                  </div>
                </div>
              </div>

              {/* المحررون */}
              <div className={`p-5 rounded-2xl border transition-all ${
                role === 'EDITOR' ? 'bg-blue-950/20 border-blue-500/50 shadow-lg' : 'bg-slate-900/50 border-slate-800'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Edit3 className="w-5 h-5 text-blue-400" />
                    <h4 className="text-sm font-bold text-white">{isAr ? 'المحررين (Editors)' : 'Editors'}</h4>
                  </div>
                  {role === 'EDITOR' && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500 text-white font-mono">
                      {isAr ? 'دورك الحالي' : 'Active'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                  {isAr 
                    ? 'يمكن لهم الاطلاع على المقالات المولدة بالذكاء الاصطناعي وتوليدها، لكن دون إمكانية نشرها مباشرة؛ يتم حفظها وإرسالها كمسودة للمشرفين لمراجعتها ونشرها مع الاطلاع على ملاحظات المشرفين.'
                    : 'Can generate and edit AI drafts, but cannot publish directly; drafts are submitted to supervisors with feedback loop.'}
                </p>
                <div className="space-y-1.5 text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5 text-blue-300">
                    <Check className="w-3.5 h-3.5 text-blue-400" />
                    <span>{isAr ? 'توليد وصياغة المسودات بـ Gemini' : 'Draft Articles with Gemini'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    <span>{isAr ? 'تقديم المسودات لاعتماد المشرف' : 'Submit for Supervisor Review'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-blue-300">
                    <Check className="w-3.5 h-3.5 text-blue-400" />
                    <span>{isAr ? 'استقبال ملاحظات المشرف وتعديل المسودة' : 'Receive Revision Notes'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* محول الأدوار التجريبي السريع */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>{isAr ? 'التبديل الفوري بين الأدوار لاختبار كافة الصلاحيات' : 'Instant Role Switcher (Simulation)'}</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {isAr 
                      ? 'يمكنك التبديل بين حسابات الأدمن والمشرف والمحرر لتجربة دورة العمل الكاملة والملاحظات.'
                      : 'Test the workflow across Admin, Supervisor, Editor, and Reader roles seamlessly.'}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {(['ADMIN', 'SUPERVISOR', 'EDITOR', 'READER'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => handleRoleChange(r)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      role === r
                        ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-400'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                    }`}
                  >
                    <span>{r === 'ADMIN' ? '👑 الأدمن' : r === 'SUPERVISOR' ? '🛡️ المشرف' : r === 'EDITOR' ? '✍️ المحرر' : '📖 القارئ'}</span>
                    {role === r && <Check className="w-3 h-3 text-slate-950" />}
                  </button>
                ))}
              </div>

              {(role === 'ADMIN' || role === 'SUPERVISOR') && (
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    {isAr ? 'لديك صلاحية دخول غرفة الأخبار وإدارة ونشر المقالات:' : 'You have access to the newsroom desk:'}
                  </span>
                  <button
                    onClick={onNavigateToNewsroom}
                    className="px-4 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold border border-rose-500/40 flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{isAr ? 'الدخول لغرفة الأخبار' : 'Enter Newsroom'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            التبويب 3: إعدادات الحساب (Account Settings)
           ========================================================================= */}
        {activeTab === 'settings' && (
          <div className="p-6 rounded-3xl bg-[#0c1322] border border-slate-800 space-y-5 animate-in fade-in-50">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Settings className="w-4 h-4 text-amber-400" />
              <span>{isAr ? 'إعدادات الحساب وتخصيص التجربة' : 'Preferences & Security'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 block">{isAr ? 'معرّف الحساب في Firebase (UID)' : 'Firebase UID'}</span>
                <span className="text-xs font-mono text-slate-300 truncate block">{profile?.uid || user?.uid || 'guest-session'}</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 block">{isAr ? 'تاريخ إنشاء الحساب' : 'Member Since'}</span>
                <span className="text-xs font-mono text-slate-300 block">{profile?.createdAt?.substring(0, 10) || new Date().toISOString().substring(0, 10)}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {isAr ? 'البيانات محمية بواسطة Firebase Authentication و قواعد Firestore' : 'Secured via Firebase Authentication and Firestore'}
              </span>
              <button
                onClick={signOut}
                className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold border border-rose-500/40 flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{isAr ? 'تسجيل الخروج من الحساب' : 'Sign Out'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
