import { clearMemoryCache } from "./cached-queries";
import { revalidatePath } from "next/cache";

export { clearMemoryCache };

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
 * Clears Node.js RAM cache and triggers targeted revalidatePath ONLY for the affected pages.
 * NOTE: Never call revalidatePath with "layout" on (website) — that purges all 150+ articles
 * and causes massive Vercel ISR write spikes.
 */
export async function invalidateArticleCache(params: ArticleInvalidationParams) {
  clearMemoryCache();
  try {
    // Revalidate homepage
    revalidatePath("/");

    // Revalidate current category page
    if (params.categorySlug) {
      revalidatePath(`/${params.categorySlug}`);
    }

    // Revalidate old category page if category was changed
    if (params.oldCategorySlug && params.oldCategorySlug !== params.categorySlug) {
      revalidatePath(`/${params.oldCategorySlug}`);
    }

    // Revalidate secondary categories if any
    if (params.secondaryCategorySlugs && params.secondaryCategorySlugs.length > 0) {
      for (const secSlug of params.secondaryCategorySlugs) {
        if (secSlug && secSlug !== params.categorySlug) {
          revalidatePath(`/${secSlug}`);
        }
      }
    }

    // Revalidate the specific article page
    if (params.articleSlug && params.categorySlug) {
      revalidatePath(`/${params.categorySlug}/${params.articleSlug}`);
    }
  } catch (err) {
    // Ignore outside server action context or during static generation
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

