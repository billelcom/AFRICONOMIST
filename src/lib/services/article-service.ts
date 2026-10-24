import { getArticlesCollection } from "./mongodb";
import { pruneArticleReferencesAcrossUsers } from "../integrity-service";

/**
 * Article Service
 * Centralizes operations on articles to ensure data integrity across MongoDB and Firebase.
 */

export async function deleteArticle(articleId: string, isAr: boolean = true) {
  try {
    const collection = await getArticlesCollection();
    if (!collection) {
      throw new Error("MongoDB collection not available");
    }

    // 1. Delete from MongoDB
    const deleteResult = await collection.deleteOne({ id: articleId });
    
    if (deleteResult.deletedCount === 0) {
      return { success: false, error: "Article not found in MongoDB" };
    }

    console.log(`[ArticleService] Deleted article ${articleId} from MongoDB. Triggering Firebase cleanup...`);

    // 2. Proactive Cleanup in Firebase (Firestore)
    // This removes orphaned bookmarks and marks notifications as dead
    const cleanupResult = await pruneArticleReferencesAcrossUsers(articleId, isAr);

    return { 
      success: true, 
      mongoDeleted: true, 
      firebasePruned: cleanupResult.success,
      prunedCount: cleanupResult.prunedCount 
    };
  } catch (error: any) {
    console.error("[ArticleService] Failed to delete article cleanly:", error);
    throw error;
  }
}

/**
 * Batch Cleanup Utility
 * Scans for articles marked as 'rejected' and ensures they are pruned from Firebase.
 */
export async function runRejectedArticlesCleanup(isAr: boolean = true) {
  try {
    const collection = await getArticlesCollection();
    if (!collection) return { success: false, error: "Database unavailable" };

    const rejectedArticles = await collection.find({ status: "rejected" }).toArray();
    let totalPruned = 0;

    for (const article of rejectedArticles) {
      const result = await pruneArticleReferencesAcrossUsers(article.id, isAr);
      if (result.success) totalPruned += (result.prunedCount || 0);
    }

    return { success: true, articlesProcessed: rejectedArticles.length, totalReferencesPruned: totalPruned };
  } catch (error) {
    console.error("[ArticleService] Batch cleanup failed:", error);
    return { success: false, error };
  }
}
