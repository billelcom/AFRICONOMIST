'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  updateProfile as updateFirebaseProfile
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  onSnapshot, 
  deleteDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';
import { UserProfile, UserRole, SavedArticle, AppNotification } from '../types/auth';
import { Article } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  role: UserRole;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string, preferredRole?: UserRole) => Promise<void>;
  loginAsDemoRole: (role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  
  // حفظ المقالات
  savedArticles: SavedArticle[];
  saveArticle: (article: Article) => Promise<void>;
  unsaveArticle: (articleId: string) => Promise<void>;
  isArticleSaved: (articleId: string) => boolean;
  
  // الإشعارات
  notifications: AppNotification[];
  unreadCount: number;
  markNotificationAsRead: (id: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  sendNotification: (notif: { userId: string; type: AppNotification['type']; title: string; message: string; articleId?: string; countrySlug?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAILS = ['bbillel87@gmail.com'];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [savedArticles, setSavedArticles] = useState<SavedArticle[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // تحميل واستماع حالة تسجيل الدخول
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const data = userDocSnap.data() as UserProfile;
            // التحقق من حساب الأدمن الرئيسي
            if (currentUser.email && ADMIN_EMAILS.includes(currentUser.email.toLowerCase()) && data.role !== 'ADMIN') {
              await updateDoc(userDocRef, { role: 'ADMIN' });
              data.role = 'ADMIN';
            }
            setProfile(data);
          } else {
            // إنشاء بروفايل جديد
            const isDefaultAdmin = currentUser.email ? ADMIN_EMAILS.includes(currentUser.email.toLowerCase()) : false;
            const newProfile: UserProfile = {
              uid: currentUser.uid,
              email: currentUser.email || '',
              displayName: currentUser.displayName || currentUser.email?.split('@')[0] || 'محرر اقتصادي',
              photoURL: currentUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser.displayName || currentUser.email || 'AF')}`,
              coverURL: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80',
              bio: isDefaultAdmin 
                ? 'المدير العام ورئيس التحرير التنفيذي لمنصة لافريكونوميست.' 
                : 'متابع ومحلل للشؤون الاقتصادية وأسواق المال الإفريقية.',
              role: isDefaultAdmin ? 'ADMIN' : 'READER',
              favoriteCountry: 'DZ',
              createdAt: new Date().toISOString()
            };

            await setDoc(userDocRef, {
              ...newProfile,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            });
            setProfile(newProfile);
          }
        } catch (err) {
          console.warn('Firestore user fetch error (fallback to local profile):', err);
          // Fallback profile
          setProfile({
            uid: currentUser.uid,
            email: currentUser.email || 'user@africonomist.com',
            displayName: currentUser.displayName || 'مستخدم المنصة',
            role: currentUser.email && ADMIN_EMAILS.includes(currentUser.email) ? 'ADMIN' : 'READER',
            photoURL: currentUser.photoURL || undefined,
            createdAt: new Date().toISOString()
          });
        }
      } else {
        // حالة الزائر غير المسجل: توفير بروفايل افتراضي للقراءة
        const savedGuest = typeof window !== 'undefined' ? localStorage.getItem('africonomist_guest_profile') : null;
        if (savedGuest) {
          try {
            setProfile(JSON.parse(savedGuest));
          } catch {
            setProfile(null);
          }
        } else {
          setProfile(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // الاستماع للمقالات المحفوظة في Firestore
  useEffect(() => {
    if (!user) {
      // قراءة من localStorage عند عدم تسجيل الدخول
      if (typeof window !== 'undefined') {
        const localSaved = localStorage.getItem('africonomist_saved_articles');
        if (localSaved) {
          try { setSavedArticles(JSON.parse(localSaved)); } catch {}
        }
      }
      return;
    }

    try {
      const q = query(collection(db, 'savedArticles'), where('userId', '==', user.uid));
      const unsub = onSnapshot(q, (snapshot) => {
        const list: SavedArticle[] = [];
        snapshot.forEach((d) => {
          list.push({ id: d.id, ...(d.data() as Omit<SavedArticle, 'id'>) });
        });
        setSavedArticles(list);
        if (typeof window !== 'undefined') {
          localStorage.setItem('africonomist_saved_articles', JSON.stringify(list));
        }
      }, (err) => {
        console.warn('Saved articles snapshot error:', err);
      });
      return () => unsub();
    } catch (e) {
      console.warn('Saved articles init error:', e);
    }
  }, [user]);

  // الاستماع للإشعارات في Firestore
  useEffect(() => {
    if (!user) {
      // إشعارات افتراضية للترحيب
      setNotifications([
        {
          id: 'welcome-notif',
          userId: 'guest',
          type: 'system',
          title: 'مرحباً بك في لافريكونوميست',
          message: 'تم إطلاق صفحة ملفات الدول الـ 55 وإضافة الصحراء الغربية رسمياً.',
          read: false,
          createdAt: new Date().toISOString()
        }
      ]);
      return;
    }

    try {
      const q = query(collection(db, 'notifications'), where('userId', 'in', [user.uid, 'ALL']));
      const unsub = onSnapshot(q, (snapshot) => {
        const list: AppNotification[] = [];
        snapshot.forEach((d) => {
          list.push({ id: d.id, ...(d.data() as Omit<AppNotification, 'id'>) });
        });
        // فرز تنازلي حسب التاريخ
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setNotifications(list);
      }, (err) => {
        console.warn('Notifications snapshot error:', err);
      });
      return () => unsub();
    } catch (e) {
      console.warn('Notifications init error:', e);
    }
  }, [user]);

  // تسجيل الدخول بواسطة Google
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  };

  // تسجيل الدخول بالبريد وكلمة المرور
  const signInWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error: any) {
      console.error('Email sign-in error:', error);
      throw error;
    }
  };

  // إنشاء حساب جديد
  const signUpWithEmail = async (email: string, pass: string, name: string, preferredRole: UserRole = 'READER') => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      await updateFirebaseProfile(res.user, { displayName: name });
      
      const isDefaultAdmin = ADMIN_EMAILS.includes(email.toLowerCase());
      const role: UserRole = isDefaultAdmin ? 'ADMIN' : preferredRole;

      const userDocRef = doc(db, 'users', res.user.uid);
      const newProfile: UserProfile = {
        uid: res.user.uid,
        email: email,
        displayName: name,
        role: role,
        photoURL: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
        coverURL: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80',
        bio: 'محلل ومحرر مهتم باقتصادات وأسواق المال الإفريقية.',
        favoriteCountry: 'DZ',
        createdAt: new Date().toISOString()
      };

      await setDoc(userDocRef, {
        ...newProfile,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      setProfile(newProfile);
    } catch (error: any) {
      console.error('Email sign-up error:', error);
      throw error;
    }
  };

  // تسجيل الدخول التجريبي السريع لاختبار مختلف الأدوار (Admin, Supervisor, Editor, Reader)
  const loginAsDemoRole = async (demoRole: UserRole) => {
    const demoId = `demo-${demoRole.toLowerCase()}-${Date.now()}`;
    const titles: Record<UserRole, { name: string; email: string; bio: string }> = {
      ADMIN: {
        name: 'بلال - مدير النظام والتحرير (Admin)',
        email: 'bbillel87@gmail.com',
        bio: 'المسؤول الأعلى عن إدارة المنصة وتوزيع المهام والتحقق من الأنظمة والسياسات.'
      },
      SUPERVISOR: {
        name: 'د. طارق المنصوري - مشرف التحرير (Supervisor)',
        email: 'supervisor@africonomist.com',
        bio: 'مشرف على التدقيق الاستقصائي واعتماد ونشر التقارير المولدة بالذكاء الاصطناعي وتوجيه المحررين.'
      },
      EDITOR: {
        name: 'سارة أوسمان - محررة اقتصادية (Editor)',
        email: 'editor@africonomist.com',
        bio: 'محررة ميدانية مسؤولة عن إعداد التقارير ومسودات الذكاء الاصطناعي وإرسالها للمراجعة.'
      },
      READER: {
        name: 'أمين بن سالم - قارئ ومستثمر (Reader)',
        email: 'reader@africonomist.com',
        bio: 'متابع للشؤون المالية والفرص الاستثمارية في السوق الإفريقية المشتركة.'
      }
    };

    const info = titles[demoRole];
    const demoProfile: UserProfile = {
      uid: demoId,
      email: info.email,
      displayName: info.name,
      role: demoRole,
      photoURL: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(info.name)}`,
      coverURL: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80',
      bio: info.bio,
      favoriteCountry: 'DZ',
      createdAt: new Date().toISOString()
    };

    setProfile(demoProfile);
    if (typeof window !== 'undefined') {
      localStorage.setItem('africonomist_guest_profile', JSON.stringify(demoProfile));
    }

    // إضافة إشعار ترحيبي بهذا الدور
    const roleNotice: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: demoId,
      type: 'system',
      title: `تم تفعيل حسابك كـ [${demoRole}]`,
      message: demoRole === 'ADMIN' 
        ? 'تمتلك كامل الصلاحيات لإدارة المنصة، ونشر المسودات، وتعديل الأدوار.'
        : demoRole === 'SUPERVISOR'
        ? 'يمكنك الآن مراجعة مسودات المحررين واعتماد نشرها أو طلب تعديلات مع كتابة ملاحظات.'
        : demoRole === 'EDITOR'
        ? 'يمكنك توليد مسودات بالذكاء الاصطناعي وإرسالها للمشرفين للاعتماد والنشر.'
        : 'يمكنك قراءة وحفظ المقالات في حسابك وتلقي الإشعارات الفورية.',
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [roleNotice, ...prev]);
  };

  // تسجيل الخروج
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch {}
    setUser(null);
    setProfile(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('africonomist_guest_profile');
    }
  };

  // تعديل الملف الشخصي
  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!profile) return;
    const updated = { ...profile, ...data, updatedAt: new Date().toISOString() };
    setProfile(updated);

    if (user) {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, {
          ...data,
          updatedAt: serverTimestamp()
        });
      } catch (e) {
        console.warn('Update user profile error:', e);
      }
    } else {
      if (typeof window !== 'undefined') {
        localStorage.setItem('africonomist_guest_profile', JSON.stringify(updated));
      }
    }
  };

  // حفظ المقال
  const saveArticle = async (article: Article) => {
    const currentUserId = user?.uid || profile?.uid || 'guest';
    const saveId = `save-${currentUserId}-${article.id}`;
    
    const newSave: SavedArticle = {
      id: saveId,
      userId: currentUserId,
      articleId: article.id,
      articleTitle: article.title,
      articleTitleEn: article.titleEn,
      category: article.category,
      countryCode: article.countryCode,
      countryName: article.countryName,
      imageUrl: article.imageUrl,
      summary: article.summary,
      savedAt: new Date().toISOString()
    };

    setSavedArticles(prev => {
      if (prev.some(s => s.articleId === article.id)) return prev;
      const updated = [newSave, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem('africonomist_saved_articles', JSON.stringify(updated));
      }
      return updated;
    });

    if (user) {
      try {
        await setDoc(doc(db, 'savedArticles', saveId), {
          ...newSave,
          savedAt: serverTimestamp()
        });
      } catch (e) {
        console.warn('Firestore save article error:', e);
      }
    }

    // إشعار تأكيد الحفظ
    const notif: AppNotification = {
      id: `save-notif-${Date.now()}`,
      userId: currentUserId,
      type: 'saved',
      title: 'تم حفظ المقال في حسابك',
      message: `تم حفظ مقال: "${article.title.substring(0, 45)}..." للرجوع إليه لاحقاً.`,
      articleId: article.id,
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [notif, ...prev]);
  };

  // إلغاء حفظ المقال
  const unsaveArticle = async (articleId: string) => {
    const currentUserId = user?.uid || profile?.uid || 'guest';
    const saveId = `save-${currentUserId}-${articleId}`;

    setSavedArticles(prev => {
      const updated = prev.filter(s => s.articleId !== articleId);
      if (typeof window !== 'undefined') {
        localStorage.setItem('africonomist_saved_articles', JSON.stringify(updated));
      }
      return updated;
    });

    if (user) {
      try {
        await deleteDoc(doc(db, 'savedArticles', saveId));
      } catch (e) {
        console.warn('Firestore delete saved article error:', e);
      }
    }
  };

  // فحص هل المقال محفوظ
  const isArticleSaved = (articleId: string): boolean => {
    return savedArticles.some(s => s.articleId === articleId);
  };

  // تعليم الإشعار كمقروء
  const markNotificationAsRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    if (user) {
      try {
        await updateDoc(doc(db, 'notifications', id), { read: true });
      } catch {}
    }
  };

  // تعليم كافة الإشعارات كمقروءة
  const markAllNotificationsAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    if (user) {
      try {
        notifications.filter(n => !n.read).forEach(async (n) => {
          await updateDoc(doc(db, 'notifications', n.id), { read: true });
        });
      } catch {}
    }
  };

  // إرسال إشعار
  const sendNotification = async (notifData: { userId: string; type: AppNotification['type']; title: string; message: string; articleId?: string; countrySlug?: string }) => {
    const notifId = `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newNotif: AppNotification = {
      id: notifId,
      ...notifData,
      read: false,
      createdAt: new Date().toISOString()
    };

    setNotifications(prev => [newNotif, ...prev]);

    if (user) {
      try {
        await setDoc(doc(db, 'notifications', notifId), {
          ...newNotif,
          createdAt: serverTimestamp()
        });
      } catch (e) {
        console.warn('Firestore notification send error:', e);
      }
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const currentRole: UserRole = profile?.role || (user?.email && ADMIN_EMAILS.includes(user.email) ? 'ADMIN' : 'READER');

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role: currentRole,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        loginAsDemoRole,
        signOut,
        updateUserProfile,
        savedArticles,
        saveArticle,
        unsaveArticle,
        isArticleSaved,
        notifications,
        unreadCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        sendNotification
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
