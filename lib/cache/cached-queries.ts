import {
  getFeaturedArticles,
  getLatestArticles,
  getTrendingArticles,
  getEditorsPicks,
  getBriefingArticles,
  getGlobalBriefingArticles,
  getBreakingArticle,
  getArticlesGroupedByTopics,
  getArticleBySlug,
  getArticlesByCategory,
  getArticlesByCategoryPaginated,
  getRelatedArticles,
} from "@/lib/actions/article.actions";
import { getAuthorBySlugWithArticles } from "@/lib/actions/author.actions";
import { getArticleComments } from "@/lib/actions/comment.actions";

// Fast In-Memory RAM Cache (Node.js Process RAM)
// Completely eliminates Vercel Data Cache HTTP calls, ISR Writes, & Fast Origin Transfer charges ($0 Vercel Cost)
const memoryCache = new Map<string, { data: any; timestamp: number; ttl: number }>();

// Short TTL: 5 seconds for homepage/category listing data
// Ensures newly published articles appear on the homepage almost instantly for all visitors worldwide
const LISTING_TTL_MS = 5 * 1000;
// Short TTL for article content pages (1 min) to reflect edits quickly
const ARTICLE_TTL_MS = 60 * 1000;

export function getMemoryCache<T>(key: string): T | null {
  // Bypass memory cache to ensure dynamic data is immediately reflected
  return null;
}

export function setMemoryCache<T>(key: string, data: T, ttl = LISTING_TTL_MS): T {
  memoryCache.set(key, { data, timestamp: Date.now(), ttl });
  return data;
}

export function clearMemoryCache(pattern?: string) {
  if (!pattern) {
    memoryCache.clear();
    return;
  }
  for (const key of memoryCache.keys()) {
    if (key.includes(pattern)) {
      memoryCache.delete(key);
    }
  }
}

// Homepage Caches — 5-second TTL for instant live publishing updates
export const getCachedFeaturedArticles = async (limit = 5) => {
  const key = `featured-articles-${limit}`;
  const cached = getMemoryCache<any[]>(key);
  if (cached) return cached;
  const data = await getFeaturedArticles(limit);
  return setMemoryCache(key, data, LISTING_TTL_MS);
};

export const getCachedLatestArticles = async (limit = 8) => {
  const key = `latest-articles-${limit}`;
  const cached = getMemoryCache<any[]>(key);
  if (cached) return cached;
  const data = await getLatestArticles(limit);
  return setMemoryCache(key, data, LISTING_TTL_MS);
};

export const getCachedTrendingArticles = async (limit = 10) => {
  const key = `trending-articles-${limit}`;
  const cached = getMemoryCache<any[]>(key);
  if (cached) return cached;
  const data = await getTrendingArticles(limit);
  return setMemoryCache(key, data, LISTING_TTL_MS);
};

export const getCachedEditorsPicks = async (limit = 6) => {
  const key = `editors-picks-${limit}`;
  const cached = getMemoryCache<any[]>(key);
  if (cached) return cached;
  const data = await getEditorsPicks(limit);
  return setMemoryCache(key, data, LISTING_TTL_MS);
};

export const getCachedBriefingArticles = async (limit = 8) => {
  const key = `briefing-articles-${limit}`;
  const cached = getMemoryCache<any[]>(key);
  if (cached) return cached;
  const data = await getBriefingArticles(limit);
  return setMemoryCache(key, data, LISTING_TTL_MS);
};

export const getCachedGlobalBriefingArticles = async (limit = 3) => {
  const key = `global-briefing-articles-${limit}`;
  const cached = getMemoryCache<any[]>(key);
  if (cached) return cached;
  const data = await getGlobalBriefingArticles(limit);
  return setMemoryCache(key, data, LISTING_TTL_MS);
};

export const getCachedBreakingArticle = async () => {
  const key = "breaking-article";
  const cached = getMemoryCache<any>(key);
  if (cached) return cached;
  const data = await getBreakingArticle();
  return setMemoryCache(key, data, LISTING_TTL_MS);
};

export const getCachedArticlesGroupedByTopics = async () => {
  const key = "articles-grouped-by-topics";
  const cached = getMemoryCache<any[]>(key);
  if (cached) return cached;
  const data = await getArticlesGroupedByTopics();
  return setMemoryCache(key, data, LISTING_TTL_MS);
};

// Article Page Cache — 1-minute TTL so content edits reflect quickly
export const getCachedArticleBySlug = async (slug: string) => {
  const key = `article-slug-${slug}`;
  const cached = getMemoryCache<any>(key);
  if (cached) return cached;
  const data = await getArticleBySlug(slug);
  return setMemoryCache(key, data, ARTICLE_TTL_MS);
};

// Related Articles Cache — 1-minute TTL
export const getCachedRelatedArticles = async (articleId: number, categorySlug: string, limit = 3) => {
  const key = `related-articles-${articleId}-${categorySlug}-${limit}`;
  const cached = getMemoryCache<any[]>(key);
  if (cached) return cached;
  const data = await getRelatedArticles(articleId, categorySlug, limit);
  return setMemoryCache(key, data, ARTICLE_TTL_MS);
};

export const getCachedArticlesByCategory = async (categorySlug: string, limit = 30) => {
  const key = `articles-by-category-${categorySlug}-${limit}`;
  const cached = getMemoryCache<any>(key);
  if (cached) return cached;
  const data = await getArticlesByCategory(categorySlug, limit);
  return setMemoryCache(key, data);
};

export const getCachedArticlesByCategoryPaginated = async (
  categorySlug: string,
  page = 1,
  pageSize = 7
) => {
  const key = `cat-articles-page-${categorySlug}-${page}-${pageSize}`;
  const cached = getMemoryCache<any>(key);
  if (cached) return cached;
  const data = await getArticlesByCategoryPaginated(categorySlug, page, pageSize);
  return setMemoryCache(key, data);
};

export const getCachedAuthorBySlugWithArticles = async (slug: string) => {
  const key = `author-slug-articles-${slug}`;
  const cached = getMemoryCache<any>(key);
  if (cached) return cached;
  const data = await getAuthorBySlugWithArticles(slug);
  return setMemoryCache(key, data);
};

// Isolated Comments Cache
export const getCachedArticleComments = async (articleId: number) => {
  const key = `article-comments-${articleId}`;
  const cached = getMemoryCache<any[]>(key);
  if (cached) return cached;
  const data = await getArticleComments(articleId);
  return setMemoryCache(key, data);
};
