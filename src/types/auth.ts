export type UserRole = 'ADMIN' | 'SUPERVISOR' | 'EDITOR' | 'READER';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  whatsapp?: string;
  country?: string;
  photoURL?: string;
  coverURL?: string;
  bio?: string;
  role: UserRole;
  status?: 'active' | 'suspended' | 'pending';
  favoriteCountry?: string;
  savedArticlesCount?: number;
  publishedArticlesCount?: number;
  roleAssignedBy?: string;
  roleAssignedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SavedArticle {
  id: string;
  userId: string;
  articleId: string;
  articleTitle: string;
  articleTitleEn?: string;
  category: string;
  countryCode: string;
  countryName: string;
  imageUrl?: string;
  summary: string;
  savedAt: string;
}

export interface PublishedArticle {
  id: string;
  articleId: string;
  authorId: string;
  authorName: string;
  title: string;
  titleEn?: string;
  slug?: string;
  summary: string;
  category: string;
  countryCode: string;
  countryName: string;
  status: 'draft' | 'pending_review' | 'published' | 'rejected' | 'revision_requested';
  publishedAt: string;
  imageUrl?: string;
  viewsCount?: number;
}

export interface AccountActivity {
  id: string;
  userId: string;
  type: 'account_created' | 'login' | 'profile_update' | 'article_saved' | 'article_unsaved' | 'article_published' | 'role_changed';
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface AppNotification {
  id: string;
  userId: string;
  type: 'editorial_review' | 'revision_requested' | 'article_published' | 'system' | 'mention' | 'saved';
  title: string;
  message: string;
  read: boolean;
  articleId?: string;
  countrySlug?: string;
  createdAt: string;
}

