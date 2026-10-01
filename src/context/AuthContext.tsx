'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  signInWithPopup, 
  GoogleAuthProvider,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  updateProfile as updateFirebaseProfile
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  getDocs,
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  orderBy,
  limit,
  onSnapshot, 
  deleteDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';
import { UserProfile, UserRole, SavedArticle, PublishedArticle, AccountActivity, AppNotification } from '../types/auth';
import { Article } from '../types';

export interface SignUpExtraData {
  firstName?: string;
  lastName?: string;
  whatsapp?: string;
  country?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  role: UserRole;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string, extra?: SignUpExtraData | UserRole) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  loginAsDemoRole: (role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  
  // حفظ المقالات
  savedArticles: SavedArticle[];
  saveArticle: (article: Article) => Promise<void>;
  unsaveArticle: (articleId: string) => Promise<void>;
  isArticleSaved: (articleId: string) => boolean;

  // المقالات المنشورة (للمحررين والمشرفين)
  publishedArticles: PublishedArticle[];
  publishUserArticle: (article: Article) => Promise<void>;

  // سجل عمليات الحساب
  activities: AccountActivity[];
  logAccountActivity: (type: AccountActivity['type'], title: string, description: string, metadata?: any) => Promise<void>;

  // إدارة المشرف للأدوار والمستخدمين
  updateUserRoleBySupervisor: (targetUserId: string, newRole: UserRole) => Promise<void>;
  fetchAllUsers: () => Promise<UserProfile[]>;
  
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
  const [publishedArticles, setPublishedArticles] = useState<PublishedArticle[]>([]);
  const [activities, setActivities] = useState<AccountActivity[]>([]);
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
            // إنشاء بروفايل جديد تلقائي كـ READER أو ADMIN
            const isDefaultAdmin = currentUser.email ? ADMIN_EMAILS.includes(currentUser.email.toLowerCase()) : false;
            const newProfile: UserProfile = {
              uid: currentUser.uid,
              email: currentUser.email || '',
              displayName: currentUser.displayName || currentUser.email?.split('@')[0] || 'مستخدم المنصة',
              role: isDefaultAdmin ? 'ADMIN' : 'READER',
              photoURL: currentUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser.displayName || currentUser.email || 'AF')}`,
              coverURL: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80',
              bio: isDefaultAdmin 
                ? 'المدير العام ورئيس التحرير التنفيذي لمنصة لافريكونوميست.' 
                : 'متابع ومحلل للشؤون الاقتصادية وأسواق المال الإفريقية.',
              favoriteCountry: 'DZ',
              savedArticlesCount: 0,
              publishedArticlesCount: 0,
              createdAt: new Date().toISOString()
            };

            await setDoc(userDocRef, {
              ...newProfile,
              createdAt: new Date(),
              updatedAt: new Date()
            });
            setProfile(newProfile);

            // حفظ نشاط إنشاء الحساب في تفرع الأنشطة
            try {
              const actRef = doc(collection(db, 'users', currentUser.uid, 'activities'));
              await setDoc(actRef, {
                id: actRef.id,
                userId: currentUser.uid,
                type: 'account_created',
                title: 'إنشاء وتفعيل الحساب',
                description: `تم إنشاء مستند الحساب بنجاح باسم (${newProfile.displayName}) بدور [${newProfile.role}].`,
                timestamp: serverTimestamp(),
                metadata: {
                  email: currentUser.email
                }
              });
            } catch {}
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

  // الاستماع للمقالات المحفوظة في Firestore تحت users/{uid}/savedArticles وبشكل متوافق
  useEffect(() => {
    if (!user) {
      if (typeof window !== 'undefined') {
        const localSaved = localStorage.getItem('africonomist_saved_articles');
        if (localSaved) {
          try { setSavedArticles(JSON.parse(localSaved)); } catch {}
        }
      }
      return;
    }

    try {
      // 1. الاستماع للمجموعة الفرعية الخاصة بالمستخدم: users/{userId}/savedArticles
      const userSavedRef = collection(db, 'users', user.uid, 'savedArticles');
      const unsubUserSub = onSnapshot(userSavedRef, (snapshot) => {
        const subList: SavedArticle[] = [];
        snapshot.forEach((d) => {
          subList.push({ id: d.id, ...(d.data() as Omit<SavedArticle, 'id'>) });
        });
        
        if (subList.length > 0) {
          setSavedArticles(subList);
          if (typeof window !== 'undefined') {
            localStorage.setItem('africonomist_saved_articles', JSON.stringify(subList));
          }
        } else {
          // وإلا نقرأ من المجموعة العامة المتوافقة savedArticles
          const legacyQuery = query(collection(db, 'savedArticles'), where('userId', '==', user.uid));
          getDocs(legacyQuery).then((snap) => {
            const legList: SavedArticle[] = [];
            snap.forEach(d => legList.push({ id: d.id, ...(d.data() as Omit<SavedArticle, 'id'>) }));
            if (legList.length > 0) {
              setSavedArticles(legList);
              // مزامنتها تلقائياً إلى المجموعة الفرعية الجديدة
              legList.forEach(item => {
                setDoc(doc(db, 'users', user.uid, 'savedArticles', item.articleId || item.id), item, { merge: true }).catch(() => {});
              });
            }
          }).catch(() => {});
        }
      }, (err) => {
        console.warn('Saved articles subcollection snapshot error:', err);
      });

      return () => unsubUserSub();
    } catch (e) {
      console.warn('Saved articles init error:', e);
    }
  }, [user]);

  // الاستماع للمقالات المنشورة الخاصة بالمحرر تحت users/{uid}/publishedArticles
  useEffect(() => {
    if (!user) {
      setPublishedArticles([]);
      return;
    }

    try {
      const pubRef = collection(db, 'users', user.uid, 'publishedArticles');
      const unsubPub = onSnapshot(pubRef, (snapshot) => {
        const list: PublishedArticle[] = [];
        snapshot.forEach((d) => {
          list.push({ id: d.id, ...(d.data() as Omit<PublishedArticle, 'id'>) });
        });
        setPublishedArticles(list);
      }, (err) => {
        console.warn('Published articles listener error:', err);
      });
      return () => unsubPub();
    } catch (e) {
      console.warn('Published articles listener error:', e);
    }
  }, [user]);

  // الاستماع لعمليات ونشاطات الحساب تحت users/{uid}/activities
  useEffect(() => {
    if (!user) {
      setActivities([]);
      return;
    }

    try {
      const actRef = collection(db, 'users', user.uid, 'activities');
      const unsubAct = onSnapshot(actRef, (snapshot) => {
        const list: AccountActivity[] = [];
        snapshot.forEach((d) => {
          list.push({ id: d.id, ...(d.data() as Omit<AccountActivity, 'id'>) });
        });
        list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setActivities(list);
      }, (err) => {
        console.warn('Activities listener error:', err);
      });
      return () => unsubAct();
    } catch (e) {
      console.warn('Activities listener error:', e);
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

  // تسجيل الدخول بواسطة Google - إنشاء مستند المستخدم في قاعدة البيانات وحفظ كافة نشاطاته وفق الكود المرجعي
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // التحقق مما إذا كان ملف المستخدم موجوداً مسبقاً في Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      const isDefaultAdmin = user.email ? ADMIN_EMAILS.includes(user.email.toLowerCase()) : false;
      const assignedRole: UserRole = isDefaultAdmin ? "ADMIN" : "READER";

      if (!userDocSnap.exists()) {
        // إذا كان حساباً جديداً، يتم حفظ بياناته
        const newUserData = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || user.email?.split('@')[0] || 'مستخدم المنصة',
          role: assignedRole,
          createdAt: new Date(),
          updatedAt: new Date(),
          photoURL: user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.displayName || user.email || 'AF')}`,
          coverURL: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80',
          bio: assignedRole === 'ADMIN'
            ? 'المدير العام ورئيس التحرير التنفيذي لمنصة لافريكونوميست.'
            : 'متابع ومحلل للشؤون الاقتصادية وأسواق المال الإفريقية.',
          favoriteCountry: 'DZ',
          savedArticlesCount: 0,
          publishedArticlesCount: 0,
          status: 'active'
        };

        await setDoc(userDocRef, newUserData);

        // يتم حفظ فيه جميع نشاطات المستخدم
        try {
          const actRef = doc(collection(db, 'users', user.uid, 'activities'));
          await setDoc(actRef, {
            id: actRef.id,
            userId: user.uid,
            type: 'account_created',
            title: 'إنشاء الحساب عبر جوجل',
            description: `تم إنشاء حساب جديد بنجاح عبر جوجل باسم (${user.displayName || 'مستخدم جديد'}).`,
            timestamp: serverTimestamp(),
            metadata: {
              provider: 'google.com',
              email: user.email
            }
          });
        } catch (actErr) {
          console.warn('Initial activity log error:', actErr);
        }

        setProfile({
          ...newUserData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } as unknown as UserProfile);
      } else {
        const existingData = userDocSnap.data() as UserProfile;
        if (isDefaultAdmin && existingData.role !== 'ADMIN') {
          await updateDoc(userDocRef, { role: 'ADMIN', updatedAt: serverTimestamp() });
          existingData.role = 'ADMIN';
        }
        setProfile(existingData);

        // حفظ نشاط تسجيل الدخول للمستخدم
        try {
          const loginActRef = doc(collection(db, 'users', user.uid, 'activities'));
          await setDoc(loginActRef, {
            id: loginActRef.id,
            userId: user.uid,
            type: 'login',
            title: 'تسجيل دخول عبر جوجل',
            description: 'تم تسجيل الدخول إلى المنصة بنجاح عبر جوجل.',
            timestamp: serverTimestamp()
          });
        } catch {}
      }
    } catch (error: any) {
      console.error("خطأ في تسجيل الدخول عبر جوجل: ", error.message || error);
      throw error;
    }
  };

  // تسجيل الدخول بالبريد وكلمة المرور
  const signInWithEmail = async (email: string, pass: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    try {
      const res = await signInWithEmailAndPassword(auth, trimmedEmail, pass);
      // التحقق من وجود مستند المستخدم في Firestore وتحديثه أو إنشاؤه
      try {
        const userDocRef = doc(db, 'users', res.user.uid);
        const snap = await getDoc(userDocRef);
        if (snap.exists()) {
          const data = snap.data() as UserProfile;
          if (ADMIN_EMAILS.includes(trimmedEmail)) {
            data.role = 'ADMIN';
          }
          setProfile(data);
        } else {
          const isDefaultAdmin = ADMIN_EMAILS.includes(trimmedEmail);
          const newProfile: UserProfile = {
            uid: res.user.uid,
            email: trimmedEmail,
            displayName: res.user.displayName || trimmedEmail.split('@')[0],
            role: isDefaultAdmin ? 'ADMIN' : 'READER',
            photoURL: res.user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(trimmedEmail)}`,
            coverURL: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80',
            bio: isDefaultAdmin 
              ? 'المدير العام ورئيس التحرير التنفيذي لمنصة لافريكونوميست.' 
              : 'متابع ومحلل للشؤون الاقتصادية وأسواق المال الإفريقية.',
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
        // تسجيل نشاط تسجيل الدخول
        try {
          const loginActRef = doc(collection(db, 'users', res.user.uid, 'activities'));
          await setDoc(loginActRef, {
            id: loginActRef.id,
            userId: res.user.uid,
            type: 'login',
            title: 'تسجيل دخول ناجح',
            description: 'تم تسجيل الدخول إلى المنصة بنجاح.',
            timestamp: serverTimestamp()
          });
        } catch {}
      } catch (docErr) {
        console.warn('Doc check on signin warning:', docErr);
      }
    } catch (error: any) {
      console.warn('Firebase signInWithEmailAndPassword error:', error);
      throw error;
    }
  };

  // إنشاء حساب جديد - إلغاء تحديد الأدوار من بطاقة التسجيل وإسناد الدور تلقائياً كـ READER (أو ADMIN لحساب المدير الرئيسي)
  const signUpWithEmail = async (
    email: string, 
    pass: string, 
    name: string, 
    extra?: SignUpExtraData | UserRole
  ) => {
    const trimmedEmail = email.trim().toLowerCase();
    const isDefaultAdmin = ADMIN_EMAILS.includes(trimmedEmail);
    // الدور دائماً قارئ عند إنشاء الحساب، وتحديد الأدوار يكون عن طريق المشرف لاحقاً
    const assignedRole: UserRole = isDefaultAdmin ? 'ADMIN' : 'READER';

    let firstName = '';
    let lastName = '';
    let whatsapp = '';
    let country = 'DZ';

    if (extra && typeof extra === 'object') {
      firstName = extra.firstName?.trim() || '';
      lastName = extra.lastName?.trim() || '';
      whatsapp = extra.whatsapp?.trim() || '';
      country = extra.country?.trim() || 'DZ';
    }

    if (!firstName && name) {
      const parts = name.trim().split(/\s+/);
      firstName = parts[0] || '';
      lastName = parts.slice(1).join(' ') || '';
    }

    const finalDisplayName = (name && name.trim()) || `${firstName} ${lastName}`.trim() || 'مستخدم المنصة';

    try {
      // 1. إنشاء الحساب الفعلي في Firebase Authentication
      let targetUid = '';
      let targetDisplayName = finalDisplayName;
      let targetPhotoURL = '';

      try {
        const res = await createUserWithEmailAndPassword(auth, trimmedEmail, pass);
        targetUid = res.user.uid;
        targetPhotoURL = res.user.photoURL || '';
        await updateFirebaseProfile(res.user, { displayName: finalDisplayName });
      } catch (createErr: any) {
        // إذا كان البريد مسجلاً مسبقاً، نحاول تسجيل الدخول بكلمة المرور المدخلة مباشرة وتأكيد الحساب
        if (createErr.code === 'auth/email-already-in-use') {
          try {
            const loginRes = await signInWithEmailAndPassword(auth, trimmedEmail, pass);
            targetUid = loginRes.user.uid;
            targetDisplayName = loginRes.user.displayName || finalDisplayName;
            targetPhotoURL = loginRes.user.photoURL || '';
          } catch {
            throw createErr;
          }
        } else {
          throw createErr;
        }
      }
      
      const newProfile: UserProfile = {
        uid: targetUid,
        email: trimmedEmail,
        displayName: targetDisplayName,
        firstName,
        lastName,
        whatsapp,
        country,
        role: assignedRole,
        status: 'active',
        photoURL: targetPhotoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(targetDisplayName)}`,
        coverURL: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80',
        bio: assignedRole === 'ADMIN'
          ? 'المدير العام ورئيس التحرير التنفيذي لمنصة لافريكونوميست.'
          : 'متابع ومحلل للشؤون الاقتصادية وأسواق المال الإفريقية.',
        favoriteCountry: country || 'DZ',
        savedArticlesCount: 0,
        publishedArticlesCount: 0,
        createdAt: new Date().toISOString()
      };

      // 2. كتابة مستند المستخدم الرئيسي: users/{targetUid}
      const userDocRef = doc(db, 'users', targetUid);
      await setDoc(userDocRef, {
        ...newProfile,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true });

      // 3. كتابة أول عملية في تفرع عمليات ونشاطات الحساب: users/{targetUid}/activities
      try {
        const initialActivityRef = doc(collection(db, 'users', targetUid, 'activities'));
        await setDoc(initialActivityRef, {
          id: initialActivityRef.id,
          userId: targetUid,
          type: 'account_created',
          title: 'إنشاء الحساب وتفعيله',
          description: `تم إنشاء حساب جديد بنجاح باسم (${targetDisplayName}) بصلاحية قارئ ومستثمر.`,
          timestamp: serverTimestamp(),
          metadata: {
            country,
            whatsapp,
            email: trimmedEmail
          }
        });
      } catch (e) {
        console.warn('Initial activity log error:', e);
      }

      setProfile(newProfile);
    } catch (error: any) {
      console.error('Firebase createUserWithEmailAndPassword error:', error);
      throw error;
    }
  };

  // إرسال رابط إعادة تعيين كلمة المرور عبر البريد
  const sendPasswordReset = async (email: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) throw new Error('يرجى كتابة البريد الإلكتروني');
    await sendPasswordResetEmail(auth, trimmedEmail);
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

  // حفظ المقال (خاص بمن لديهم حساب فقط)
  const saveArticle = async (article: Article) => {
    const activeAuthUser = auth.currentUser || user;
    if (!activeAuthUser) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode: 'signup' } }));
      }
      return;
    }

    const currentUserId = activeAuthUser.uid;
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

    if (activeAuthUser) {
      try {
        // 1. التفرع الخاص بالمستخدم في Firestore: users/{userId}/savedArticles/{articleId}
        const userSaveDocRef = doc(db, 'users', currentUserId, 'savedArticles', article.id);
        await setDoc(userSaveDocRef, {
          ...newSave,
          savedAt: serverTimestamp()
        });

        // 2. المجموعة المتوافقة العامة savedArticles
        await setDoc(doc(db, 'savedArticles', saveId), {
          ...newSave,
          savedAt: serverTimestamp()
        });

        // 3. تحديث عداد المقالات المحفوظة في مستند المستخدم الرئيسي
        const userRef = doc(db, 'users', currentUserId);
        await updateDoc(userRef, {
          savedArticlesCount: (profile?.savedArticlesCount || 0) + 1,
          updatedAt: serverTimestamp()
        }).catch(() => {});

        // 4. تسجيل العملية في تفرع عمليات ونشاطات الحساب: users/{userId}/activities
        const actRef = doc(collection(db, 'users', currentUserId, 'activities'));
        await setDoc(actRef, {
          id: actRef.id,
          userId: currentUserId,
          type: 'article_saved',
          title: 'حفظ مقال للقراءة',
          description: `تم حفظ مقال: "${article.title.substring(0, 45)}..." في قائمة المقالات المحفوظة لحسابك.`,
          timestamp: serverTimestamp(),
          metadata: { articleId: article.id }
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
    const activeAuthUser = auth.currentUser || user;
    const currentUserId = activeAuthUser?.uid || profile?.uid || 'guest';
    const saveId = `save-${currentUserId}-${articleId}`;

    setSavedArticles(prev => {
      const updated = prev.filter(s => s.articleId !== articleId);
      if (typeof window !== 'undefined') {
        localStorage.setItem('africonomist_saved_articles', JSON.stringify(updated));
      }
      return updated;
    });

    if (activeAuthUser) {
      try {
        await deleteDoc(doc(db, 'users', currentUserId, 'savedArticles', articleId));
        await deleteDoc(doc(db, 'savedArticles', saveId));

        // تسجيل العملية في سجل أنشطة الحساب
        const actRef = doc(collection(db, 'users', currentUserId, 'activities'));
        await setDoc(actRef, {
          id: actRef.id,
          userId: currentUserId,
          type: 'article_unsaved',
          title: 'إلغاء حفظ مقال',
          description: `تم حذف المقال من المقالات المحفوظة في حسابك.`,
          timestamp: serverTimestamp(),
          metadata: { articleId }
        });
      } catch (e) {
        console.warn('Firestore delete saved article error:', e);
      }
    }
  };

  // نشر مقال خاص بالمحرر أو المشرف في تفرع: users/{userId}/publishedArticles
  const publishUserArticle = async (article: Article) => {
    const activeAuthUser = auth.currentUser || user;
    const currentUserId = activeAuthUser?.uid || profile?.uid || 'guest';

    const pubItem: PublishedArticle = {
      id: article.id,
      articleId: article.id,
      authorId: currentUserId,
      authorName: profile?.displayName || article.authorName || 'محرر اقتصادي',
      title: article.title,
      titleEn: article.titleEn,
      slug: article.slug,
      summary: article.summary,
      category: article.category,
      countryCode: article.countryCode,
      countryName: article.countryName,
      status: article.status,
      publishedAt: new Date().toISOString(),
      imageUrl: article.imageUrl,
      viewsCount: 1
    };

    setPublishedArticles(prev => [pubItem, ...prev.filter(p => p.articleId !== article.id)]);

    if (activeAuthUser) {
      try {
        await setDoc(doc(db, 'users', currentUserId, 'publishedArticles', article.id), {
          ...pubItem,
          publishedAt: serverTimestamp()
        });

        // تحديث عداد المنشورات
        const userRef = doc(db, 'users', currentUserId);
        await updateDoc(userRef, {
          publishedArticlesCount: (profile?.publishedArticlesCount || 0) + 1,
          updatedAt: serverTimestamp()
        }).catch(() => {});

        // تسجيل العملية في تفرع الأنشطة
        const actRef = doc(collection(db, 'users', currentUserId, 'activities'));
        await setDoc(actRef, {
          id: actRef.id,
          userId: currentUserId,
          type: 'article_published',
          title: 'نشر مقال في المنصة',
          description: `تم إيداع مقال "${article.title.substring(0, 45)}..." في رصيد منشوراتك كمحرر.`,
          timestamp: serverTimestamp(),
          metadata: { articleId: article.id }
        });
      } catch (e) {
        console.warn('Publish user article error:', e);
      }
    }
  };

  // تسجيل عملية مخصصة في سجل الحساب
  const logAccountActivity = async (type: AccountActivity['type'], title: string, description: string, metadata?: any) => {
    const activeAuthUser = auth.currentUser || user;
    const currentUserId = activeAuthUser?.uid || profile?.uid;
    if (!currentUserId) return;

    const newAct: AccountActivity = {
      id: `act-${Date.now()}`,
      userId: currentUserId,
      type,
      title,
      description,
      timestamp: new Date().toISOString(),
      metadata
    };

    setActivities(prev => [newAct, ...prev]);

    if (activeAuthUser) {
      try {
        const actRef = doc(collection(db, 'users', currentUserId, 'activities'));
        await setDoc(actRef, {
          id: actRef.id,
          userId: currentUserId,
          type,
          title,
          description,
          timestamp: serverTimestamp(),
          metadata: metadata || null
        });
      } catch (e) {
        console.warn('logAccountActivity error:', e);
      }
    }
  };

  // تعديل وتحديد أدوار المستخدمين بواسطة المشرف (تحديد الأدوار يكون عن طريق المشرف فيما بعد)
  const updateUserRoleBySupervisor = async (targetUserId: string, newRole: UserRole) => {
    const activeRole = profile?.role || (user?.email && ADMIN_EMAILS.includes(user.email) ? 'ADMIN' : 'READER');
    if (activeRole !== 'ADMIN' && activeRole !== 'SUPERVISOR') {
      throw new Error('فقط المشرف أو مدير النظام يملك صلاحية تعديل وتحديد أدوار المستخدمين.');
    }

    const userDocRef = doc(db, 'users', targetUserId);
    await updateDoc(userDocRef, {
      role: newRole,
      roleAssignedBy: profile?.displayName || 'المشرف',
      roleAssignedAt: new Date().toISOString(),
      updatedAt: serverTimestamp()
    });

    // تسجيل العملية في تفرع نشاطات المستخدم
    try {
      const actRef = doc(collection(db, 'users', targetUserId, 'activities'));
      await setDoc(actRef, {
        id: actRef.id,
        userId: targetUserId,
        type: 'role_changed',
        title: 'تحديد وتعديل الصلاحيات',
        description: `قام المشرف (${profile?.displayName || 'المشرف'}) باعتماد وتحديد دور الحساب إلى [${newRole}].`,
        timestamp: serverTimestamp(),
        metadata: { newRole, assignedBy: profile?.displayName }
      });
    } catch {}

    // إرسال إشعار للمستخدم
    await sendNotification({
      userId: targetUserId,
      type: 'system',
      title: `اعتماد الصلاحيات: تم تحديد دورك كـ [${newRole}]`,
      message: `تم اعتماد وتحديد صلاحيات حسابك كـ [${newRole}] بواسطة المشرف ${profile?.displayName || ''}. يمكنك استخدام كافة الميزات المتاحة لهذا الدور.`
    });
  };

  // جلب كافة المستخدمين المسجلين في Firebase (للمشرفين)
  const fetchAllUsers = async (): Promise<UserProfile[]> => {
    try {
      const snap = await getDocs(collection(db, 'users'));
      const list: UserProfile[] = [];
      snap.forEach((d) => {
        list.push(d.data() as UserProfile);
      });
      return list;
    } catch (err) {
      console.warn('fetchAllUsers error:', err);
      return [];
    }
  };

  // فحص هل المقال محفوظ (خاص بمن لديهم حساب فقط)
  const isArticleSaved = (articleId: string): boolean => {
    if (!user && !auth.currentUser) return false;
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
        sendPasswordReset,
        loginAsDemoRole,
        signOut,
        updateUserProfile,
        savedArticles,
        saveArticle,
        unsaveArticle,
        isArticleSaved,
        publishedArticles,
        publishUserArticle,
        activities,
        logAccountActivity,
        updateUserRoleBySupervisor,
        fetchAllUsers,
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
