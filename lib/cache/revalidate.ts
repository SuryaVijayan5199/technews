import { clearMemoryCache } from "./cached-queries";
import { revalidatePath } from "next/cache";

export interface ArticleInvalidationParams {
  articleId: number;
  articleSlug?: string | null;
  categorySlug?: string | null;
  oldCategorySlug?: string | null;
  authorId?: number | null;
  authorSlug?: string | null;
  secondaryCategorySlugs?: string[];
}

/**
 * Targeted cache invalidation when an article is created, updated, published, or deleted.
 * Clears Node.js RAM cache and triggers revalidatePath for instant UI updates — $0 ISR Write cost.
 */
export async function invalidateArticleCache(params: ArticleInvalidationParams) {
  clearMemoryCache();
  try {
    revalidatePath("/");
    revalidatePath("/(website)", "layout");
    if (params.categorySlug) {
      revalidatePath(`/${params.categorySlug}`);
    }
    if (params.articleSlug && params.categorySlug) {
      revalidatePath(`/${params.categorySlug}/${params.articleSlug}`);
    }
  } catch (err) {
    // Ignore outside server action context
  }
}


/**
 * Invalidate category cache when category metadata changes.
 */
export async function invalidateCategoryCache(categorySlug: string) {
  clearMemoryCache();
}

/**
 * Invalidate author cache when author bio or details update.
 */
export async function invalidateAuthorCache(authorId: number, authorSlug?: string | null) {
  clearMemoryCache();
}

/**
 * Invalidate comment cache for a specific article.
 */
export async function invalidateCommentCache(articleId: number) {
  clearMemoryCache(`article-comments-${articleId}`);
}

