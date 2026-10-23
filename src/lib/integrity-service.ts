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
    
    // 1. Get all users who have this article saved
    // Note: In a large system, you might use a more efficient query or a message queue.
    // For this applet, we search the subcollections.
    
    const usersSnapshot = await adminDb.collection("users").get();
    const batch = adminDb.batch();
    let opsCount = 0;

    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      
      // 1. Prune savedArticles subcollection
      const savedDocRef = adminDb.collection("users").doc(userId).collection("savedArticles").doc(articleId);
      const savedDoc = await savedDocRef.get();
      
      if (savedDoc.exists) {
        batch.delete(savedDocRef);
        opsCount++;
      }

      // 2. Mark related notifications as orphaned/dead
      const notificationsSnapshot = await adminDb.collection("users").doc(userId).collection("notifications")
        .where("articleId", "==", articleId)
        .get();
      
      notificationsSnapshot.docs.forEach(notifDoc => {
        batch.update(notifDoc.ref, { 
          articleDeleted: true,
          message: isAr ? `${notifDoc.data().message} (هذا المقال لم يعد متاحاً)` : `${notifDoc.data().message} (This article is no longer available)`
        });
        opsCount++;
      });
    }

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
