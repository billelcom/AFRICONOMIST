'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  User as FirebaseUser,
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  deleteDoc,
  serverTimestamp, 
  onSnapshot, 
  collection, 
  query, 
  where,
  addDoc
} from 'firebase/firestore';
import { auth, db, googleProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut } from '@/lib/firebase';
import { Article } from '@/types';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  role: 'reader' | 'editor' | 'admin' | 'supervisor';
  createdAt: any;
  updatedAt: any;
}

export interface ActivityLog {
  id?: string;
  userId: string;
  type: string;
  title: string;
  description: string;
  timestamp: any;
}

export interface AppNotification {
  id?: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  articleId?: string;
  countrySlug?: string;
  createdAt: string;
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  role: 'READER' | 'EDITOR' | 'ADMIN' | 'SUPERVISOR';
  unreadCount: number;
  savedArticles: any[];
  publishedArticles: any[];
  activities: ActivityLog[];
  notifications: AppNotification[];
  signIn: () => Promise<void>;
  logout: () => Promise<void>;
  isArticleSaved: (articleId: string) => boolean;
  saveArticle: (article: Article) => Promise<void>;
  unsaveArticle: (articleId: string) => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  updateUserRoleBySupervisor: (targetUid: string, newRole: string) => Promise<void>;
  fetchAllUsers: () => Promise<UserProfile[]>;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  sendNotification: (notification: Omit<AppNotification, 'id' | 'read' | 'createdAt'>) => Promise<void>;
  isMobile: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [savedArticles, setSavedArticles] = useState<any[]>([]);
  const [publishedArticles, setPublishedArticles] = useState<any[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    }
  }, []);

  useEffect(() => {
    // 0. Handle Redirect Result (Mobile Fallback)
    getRedirectResult(auth).catch(console.error);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // 1. Profile Sync
        const profileRef = doc(db, 'users', firebaseUser.uid);
        const unsubProfile = onSnapshot(profileRef, (docSnap) => {
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          } else {
            const newProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              role: 'reader',
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            };
            setDoc(profileRef, newProfile).catch(console.error);
          }
        });

        // 2. Real-time Saved Articles
        const savedRef = collection(db, 'users', firebaseUser.uid, 'savedArticles');
        const unsubSaved = onSnapshot(savedRef, (snapshot) => {
          setSavedArticles(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        // 3. Real-time Published Articles
        const pubRef = collection(db, 'users', firebaseUser.uid, 'publishedArticles');
        const unsubPub = onSnapshot(pubRef, (snapshot) => {
          setPublishedArticles(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        // 4. Real-time Activity Log
        const actRef = collection(db, 'users', firebaseUser.uid, 'activities');
        const unsubAct = onSnapshot(query(actRef, where('timestamp', '!=', null)), (snapshot) => {
          setActivities(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ActivityLog))
            .sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)));
        });

        // 5. Real-time Notifications
        const notificationsRef = collection(db, 'users', firebaseUser.uid, 'notifications');
        const unsubNotifications = onSnapshot(notificationsRef, (snapshot) => {
          const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AppNotification))
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setNotifications(list);
          setUnreadCount(list.filter(n => !n.read).length);
        });

        return () => {
          unsubProfile();
          unsubSaved();
          unsubPub();
          unsubAct();
          unsubNotifications();
        };
      } else {
        setProfile(null);
        setSavedArticles([]);
        setPublishedArticles([]);
        setActivities([]);
        setNotifications([]);
        setUnreadCount(0);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 6. Data Integrity: Verify Saved Articles exist in MongoDB
  useEffect(() => {
    if (!user || savedArticles.length === 0 || loading) return;

    const verifySavedArticles = async () => {
      try {
        const idToken = await user.getIdToken();
        const savedIds = savedArticles.map(a => a.articleId || a.id);
        const notificationIdsWithArticles = notifications
          .filter(n => n.articleId && !n.articleDeleted)
          .map(n => n.articleId as string);
          
        const articleIds = Array.from(new Set([...savedIds, ...notificationIdsWithArticles]));
        
        if (articleIds.length === 0) return;

        const res = await fetch('/api/sync/verify-saved', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
          },
          body: JSON.stringify({ articleIds })
        });

        if (res.ok) {
          const data = await res.json();
          const existingIds = data.existingIds || [];
          
          // 1. Prune Dead Bookmarks
          const deadSavedIds = savedIds.filter(id => !existingIds.includes(id));
          if (deadSavedIds.length > 0) {
            console.log(`[Data Integrity] Pruning ${deadSavedIds.length} dead bookmarks`);
            for (const deadId of deadSavedIds) {
              const docRef = doc(db, 'users', user.uid, 'savedArticles', deadId);
              deleteDoc(docRef).catch(console.error);
            }
          }

          // 2. Mark Dead Notifications
          const deadNotifIds = notificationIdsWithArticles.filter(id => !existingIds.includes(id));
          if (deadNotifIds.length > 0) {
             console.log(`[Data Integrity] Marking ${deadNotifIds.length} notifications as dead`);
             for (const deadId of deadNotifIds) {
               // Find notification docs that point to this dead ID
               const deadNotifications = notifications.filter(n => n.articleId === deadId && !n.articleDeleted);
               for (const notif of deadNotifications) {
                 if (notif.id) {
                    const docRef = doc(db, 'users', user.uid, 'notifications', notif.id);
                    setDoc(docRef, { articleDeleted: true }, { merge: true }).catch(console.error);
                 }
               }
             }
          }
        }
      } catch (err) {
        console.error('[Data Integrity] Verification failed:', err);
      }
    };

    // Run after a delay to ensure data is settled
    const timeout = setTimeout(verifySavedArticles, 8000);
    return () => clearTimeout(timeout);
  }, [user, savedArticles, notifications, loading]);

  const signIn = async () => {
    try {
      // Execute popup directly to minimize async delay which can trigger mobile popup blockers
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error("Auth Exception:", error);
      
      // Handle mobile-specific blocked popup errors
      if (error.code === 'auth/popup-blocked') {
        alert(isAr ? 
          '⚠️ تم حظر النافذة المنبثقة. يرجى السماح بالنوافذ المنبثقة من إعدادات المتصفح لإتمام تسجيل الدخول.' : 
          '⚠️ Popup blocked. Please enable popups in your browser settings to continue.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        // User closed the window before finishing, no action needed
      } else {
        alert(isAr ?
          `فشل الدخول: يرجى التأكد من استقرار الإنترنت والمحاولة مجدداً. (${error.code})` :
          `Login Failed: Please check your connection and try again. (${error.code})`);
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isArticleSaved = (articleId: string) => savedArticles.some(a => a.articleId === articleId);

  const logActivity = async (uid: string, log: Omit<ActivityLog, 'id' | 'timestamp'>) => {
    const ref = collection(db, 'users', uid, 'activities');
    await addDoc(ref, { ...log, userId: uid, timestamp: serverTimestamp() });
  };

  const saveArticle = async (article: Article) => {
    if (!user) return;
    const docRef = doc(db, 'users', user.uid, 'savedArticles', article.id);
    await setDoc(docRef, {
      userId: user.uid,
      articleId: article.id,
      articleTitle: article.title,
      summary: article.summary,
      imageUrl: article.imageUrl,
      category: article.category,
      savedAt: serverTimestamp()
    });
    await logActivity(user.uid, {
      userId: user.uid,
      type: 'article_saved',
      title: 'تم حفظ مقال',
      description: `قمت بحفظ المقال: ${article.title}`
    });
  };

  const unsaveArticle = async (articleId: string) => {
    if (!user) return;
    const docRef = doc(db, 'users', user.uid, 'savedArticles', articleId);
    await deleteDoc(docRef);
    await logActivity(user.uid, {
      userId: user.uid,
      type: 'article_unsaved',
      title: 'إزالة مقال محفوظ',
      description: 'قمت بإزالة مقال من قائمة المحفوظات'
    });
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const profileRef = doc(db, 'users', user.uid);
    await setDoc(profileRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
  };

  const updateUserRoleBySupervisor = async (targetUid: string, newRole: string) => {
    if (!user) return;
    const profileRef = doc(db, 'users', targetUid);
    await setDoc(profileRef, { role: newRole, updatedAt: serverTimestamp() }, { merge: true });
  };

  const fetchAllUsers = async () => {
    const { getDocs } = await import('firebase/firestore');
    const snap = await getDocs(collection(db, 'users'));
    return snap.docs.map(d => d.data() as UserProfile);
  };

  const markNotificationAsRead = async (notificationId: string) => {
    if (!user) return;
    const ref = doc(db, 'users', user.uid, 'notifications', notificationId);
    await setDoc(ref, { read: true }, { merge: true });
  };

  const markAllNotificationsAsRead = async () => {
    if (!user) return;
    const { writeBatch, getDocs } = await import('firebase/firestore');
    const batch = writeBatch(db);
    const notificationsRef = collection(db, 'users', user.uid, 'notifications');
    const unreadSnap = await getDocs(query(notificationsRef, where('read', '==', false)));
    unreadSnap.forEach(doc => {
      batch.update(doc.ref, { read: true });
    });
    await batch.commit();
  };

  const sendNotification = async (notification: Omit<AppNotification, 'id' | 'read' | 'createdAt'>) => {
    // If userId is 'ALL', we'd normally broadcast, but for now we'll just log or target current if relevant
    // Implementation for a real broadcast would involve a Cloud Function or multiple writes
    if (notification.userId === 'ALL') {
      // Logic for all users (stub)
      console.log("Broadcasting notification:", notification);
      return;
    }
    const ref = collection(db, 'users', notification.userId, 'notifications');
    await addDoc(ref, {
      ...notification,
      read: false,
      createdAt: new Date().toISOString()
    });
  };

  const role: 'READER' | 'EDITOR' | 'ADMIN' | 'SUPERVISOR' = 
    (profile?.role?.toUpperCase() as any) || 'READER';

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      loading, 
      role, 
      unreadCount, 
      savedArticles,
      publishedArticles,
      activities,
      notifications,
      signIn, 
      logout,
      isArticleSaved,
      saveArticle,
      unsaveArticle,
      updateUserProfile,
      updateUserRoleBySupervisor,
      fetchAllUsers,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      sendNotification,
      isMobile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

