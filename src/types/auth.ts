export type UserRole = 'ADMIN' | 'SUPERVISOR' | 'EDITOR' | 'READER';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  coverURL?: string;
  bio?: string;
  role: UserRole;
  favoriteCountry?: string;
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
