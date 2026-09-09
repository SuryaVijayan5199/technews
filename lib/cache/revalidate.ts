import { clearMemoryCache } from "./cached-queries";

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
 * Uses only in-memory RAM cache invalidation — zero Vercel Data Cache writes → $0 ISR Write cost.
 */
export async function invalidateArticleCache(params: ArticleInvalidationParams) {
  // Full RAM cache clear — instant, free, and effective.
  // revalidateTag() has been intentionally removed: it writes to Vercel Data Cache
  // and costs ISR Write credits even without unstable_cache wrappers.
  clearMemoryCache();
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

