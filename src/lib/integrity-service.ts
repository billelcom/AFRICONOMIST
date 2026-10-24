import { adminDb } from "./firebase-admin";
import { connectToDatabase } from "./services/mongodb";

/**
 * Integrity Service
 * Handles cross-database consistency between MongoDB (Articles) and Firestore (User Data).
 */

/**
 * Prunes orphaned references to a specific article ID across all users in Firestore.
 * Call this when an article is deleted or rejected in MongoDB.
 */
export async function pruneArticleReferencesAcrossUsers(articleId: string, isAr: boolean = true) {
  try {
    console.log(`[IntegrityService] Starting global prune for article: ${articleId}`);
    
    const batch = adminDb.batch();
    let opsCount = 0;

    // 1. Prune savedArticles using collectionGroup
    // This finds all "savedArticles" subcollections across all users that have this articleId
    const savedSnapshot = await adminDb.collectionGroup("savedArticles")
      .where("articleId", "==", articleId)
      .get();
    
    savedSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
      opsCount++;
    });

    // 2. Mark related notifications using collectionGroup
    const notificationsSnapshot = await adminDb.collectionGroup("notifications")
      .where("articleId", "==", articleId)
      .get();
    
    notificationsSnapshot.docs.forEach(notifDoc => {
      if (!notifDoc.data().articleDeleted) {
        batch.update(notifDoc.ref, { 
          articleDeleted: true,
          message: isAr 
            ? `${notifDoc.data().message} (هذا المقال لم يعد متاحاً)` 
            : `${notifDoc.data().message} (This article is no longer available)`
        });
        opsCount++;
      }
    });

    if (opsCount > 0) {
      await batch.commit();
      console.log(`[IntegrityService] Successfully pruned ${opsCount} references for article ${articleId}`);
    } else {
      console.log(`[IntegrityService] No references found for article ${articleId}`);
    }

    return { success: true, prunedCount: opsCount };
  } catch (error) {
    console.error("[IntegrityService] Global prune failed:", error);
    return { success: false, error };
  }
}

/**
 * Verifies a list of article IDs against MongoDB and returns only the valid (published) ones.
 */
export async function filterValidArticles(articleIds: string[]): Promise<string[]> {
  if (!articleIds || articleIds.length === 0) return [];
  
  try {
    const { db } = await connectToDatabase();
    if (!db) return [];

    const existingArticles = await db.collection("articles")
      .find({ 
        id: { $in: articleIds },
        status: "published"
      })
      .project({ id: 1 })
      .toArray();

    return existingArticles.map(a => a.id);
  } catch (error) {
    console.error("[IntegrityService] Validation failed:", error);
    return [];
  }
}
