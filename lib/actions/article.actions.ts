"use server";

import { cache } from "react";
import { db } from "@/lib/db";
import { articles, authors, categories } from "@/lib/db/schema";
import { eq, or, ilike, and, desc, isNotNull, inArray, ne, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { invalidateArticleCache } from "@/lib/cache/revalidate";
import { auth } from "@/lib/auth";
import { cleanAuthorName } from "@/lib/utils";
import { ARTICLE_CARD_COLUMNS } from "@/lib/constants";

// ─────────────────────────────────────────────
// GET ALL CATEGORIES (for editor dropdown)
// ─────────────────────────────────────────────
export async function getAllCategories() {
  try {
    const all = await db.query.categories.findMany({
      where: eq(categories.isActive, true),
      with: { children: true },
      orderBy: [categories.sortOrder],
    });
    // Return parent categories only (children embedded)
    return all.filter((c: any) => c.parentId === null);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

// ─────────────────────────────────────────────
// GET ARTICLES BY CATEGORY SLUG
// Includes subcategories automatically
// ─────────────────────────────────────────────
export async function getArticlesByCategory(categorySlug: string, limit = 30) {
  try {
    const categoryObj = await db.query.categories.findFirst({
      where: eq(categories.slug, categorySlug),
    });

    if (!categoryObj) return { category: null, articles: [] };

    const result = await db.query.articles.findMany({
      where: and(
        eq(articles.status, "published"),
        isNotNull(articles.publishedAt),
        or(
          eq(articles.categoryId, categoryObj.id),
          sql`${categoryObj.id} = ANY(${articles.secondaryCategoryIds})`
        )
      ),
      columns: ARTICLE_CARD_COLUMNS,
      with: { author: true, category: true },
      orderBy: [desc(articles.publishedAt)],
      limit,
    });

    return { category: categoryObj, articles: result as any };
  } catch (error) {
    console.error("Error fetching articles by category:", error);
    return { category: null, articles: [] };
  }
}

export async function getArticlesByCategoryPaginated(
  categorySlug: string,
  page = 1,
  pageSize = 7
) {
  try {
    const categoryObj = await db.query.categories.findFirst({
      where: eq(categories.slug, categorySlug),
    });

    if (!categoryObj) {
      return { category: null, articles: [], totalArticles: 0, totalPages: 0, currentPage: 1 };
    }

    const whereClause = and(
      eq(articles.status, "published"),
      isNotNull(articles.publishedAt),
      or(
        eq(articles.categoryId, categoryObj.id),
        sql`${categoryObj.id} = ANY(${articles.secondaryCategoryIds})`
      )
    );

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(articles)
      .where(whereClause);

    const totalArticles = Number(count || 0);
    const totalPages = Math.max(1, Math.ceil(totalArticles / pageSize));
    const currentPage = Math.min(Math.max(1, page), totalPages);
    const offset = (currentPage - 1) * pageSize;

    const result = await db.query.articles.findMany({
      where: whereClause,
      columns: ARTICLE_CARD_COLUMNS,
      with: { author: true, category: true },
      orderBy: [desc(articles.publishedAt)],
      limit: pageSize,
      offset,
    });

    return {
      category: categoryObj,
      articles: result as any[],
      totalArticles,
      totalPages,
      currentPage,
    };
  } catch (error) {
    console.error("Error fetching paginated articles by category:", error);
    return { category: null, articles: [], totalArticles: 0, totalPages: 0, currentPage: 1 };
  }
}

// ─────────────────────────────────────────────
// GET LATEST 3 ARTICLES FOR ALL ACTIVE TOPICS (DYNAMIC)
// ─────────────────────────────────────────────
export async function getArticlesGroupedByTopics() {
  try {
    const activeCategories = await db.query.categories.findMany({
      where: eq(categories.isActive, true),
      orderBy: [categories.sortOrder],
    });

    const categoryTopicResults = await Promise.all(
      activeCategories.map(async (catObj: any) => {
        const catArticles = await db.query.articles.findMany({
          where: and(
            eq(articles.status, "published"),
            isNotNull(articles.publishedAt),
            eq(articles.categoryId, catObj.id)
          ),
          columns: ARTICLE_CARD_COLUMNS,
          with: { author: true, category: true },
          orderBy: [desc(articles.publishedAt)],
          limit: 3,
        });

        return {
          category: catObj,
          articles: catArticles,
        };
      })
    );

    return categoryTopicResults.filter((item: any) => item.articles.length > 0);
  } catch (error) {
    console.error("Error fetching articles grouped by topics:", error);
    return [];
  }
}


// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
    .substring(0, 200);
}

function estimateReadingTime(html: string): number {
  const words = html.replace(/<[^>]*>/g, "").split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

async function sanitizeHeroImage(image?: string | null): Promise<string | null> {
  if (!image) return null;
  if (image.startsWith("data:image/")) {
    // If image is an optimized WebP data URL under 400 KB, preserve it directly!
    if (image.length < 400000) {
      return image;
    }
    try {
      const { v2: cloudinary } = await import("cloudinary");
      const cloudName = (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "").trim();
      if (cloudName) {
        cloudinary.config({
          cloud_name: cloudName,
          api_key: (process.env.CLOUDINARY_API_KEY || "").trim(),
          api_secret: (process.env.CLOUDINARY_API_SECRET || "").trim(),
        });
        const res = await cloudinary.uploader.upload(image, {
          folder: "technews_articles",
          resource_type: "image",
          transformation: [{ quality: "auto", fetch_format: "auto" }],
        });
        return res.secure_url;
      }
    } catch (err) {
      console.error("Failed to auto-upload base64 hero image to Cloudinary:", err);
    }
    return image;
  }
  return image;
}

export async function getAuthorsList() {
  try {
    return await db.query.authors.findMany({
      orderBy: [authors.displayName],
    });
  } catch (error) {
    console.error("Error fetching authors list:", error);
    return [];
  }
}

// ─────────────────────────────────────────────
// CREATE ARTICLE
// ─────────────────────────────────────────────
export async function createArticle(data: {
  title: string;
  excerpt: string;
  contentHtml: string;
  heroImage?: string;
  heroImageAlt?: string;
  heroImageCaption?: string;
  seoTitle?: string;
  seoDescription?: string;
  customSlug?: string;
  canonicalUrl?: string;
  sources?: string;
  categorySlug: string;
  secondaryCategoryIds?: number[];
  status: string;
  authorId?: number;
  isFeatured?: boolean;
  isEditorsPick?: boolean;
  isBreaking?: boolean;
  isTrending?: boolean;
  isLatest?: boolean;
  isBriefing?: boolean;
  isGlobalBriefing?: boolean;
  publishedAt?: Date | string | null;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  // Prevent subscribers from publishing directly
  const { isStaff, canPerformAction } = await import("@/lib/permissions");
  if (!isStaff(session.user.role)) {
    return { success: false, error: "Staff access required to create articles." };
  }
  if (data.status === "published" && !canPerformAction(session.user.role, "publish_article")) {
    // Downgrade to pending_review for non-publishers
    data = { ...data, status: "pending_review" };
  }

  try {
    let authorIdToAssign: number | null = null;

    if (data.authorId) {
      const explicitAuthor = await db.query.authors.findFirst({
        where: eq(authors.id, data.authorId),
      });
      if (explicitAuthor) {
        authorIdToAssign = explicitAuthor.id;
      }
    }

    if (!authorIdToAssign) {
      // Get or create author record for this user
      let author = await db.query.authors.findFirst({
        where: eq(authors.userId, session.user.id),
      });

      if (!author) {
        const baseSlug = (
          session.user.email
            ?.split("@")[0]
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "-") || `author`
        ).substring(0, 80);

        let authorSlug = baseSlug;
        const existingAuthorSlug = await db.query.authors.findFirst({
          where: eq(authors.slug, authorSlug),
        });
        if (existingAuthorSlug) {
          authorSlug = `${baseSlug}-${Date.now()}`;
        }

        const [newAuthor] = await db
          .insert(authors)
          .values({
            userId: session.user.id,
            displayName: cleanAuthorName(session.user.name ?? session.user.email?.split("@")[0] ?? "Editor"),
            slug: authorSlug,
            avatar: session.user.image ?? `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(session.user.email || "author")}`,
          })
          .returning();
        author = newAuthor;
      }
      authorIdToAssign = author.id;
    }

    // Look up category
    const category = await db.query.categories.findFirst({
      where: eq(categories.slug, data.categorySlug),
    });

    // Generate a unique slug or use custom
    let slug = data.customSlug ? generateSlug(data.customSlug) : generateSlug(data.title);
    const existing = await db.query.articles.findFirst({
      where: eq(articles.slug, slug),
    });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const publishedAt = data.publishedAt
      ? new Date(data.publishedAt)
      : data.status === "published"
      ? new Date()
      : null;

    const [article] = await db
      .insert(articles)
      .values({
        title: data.title,
        slug,
        excerpt: data.excerpt || null,
        contentHtml: data.contentHtml || null,
        heroImage: await sanitizeHeroImage(data.heroImage),
        heroImageAlt: data.heroImageAlt || null,
        heroImageCaption: data.heroImageCaption || null,
        seoTitle: data.seoTitle || null,
        seoDescription: data.seoDescription || null,
        canonicalUrl: data.canonicalUrl || null,
        authorId: authorIdToAssign,
        categoryId: category?.id ?? null,
        secondaryCategoryIds: data.secondaryCategoryIds && data.secondaryCategoryIds.length > 0 ? data.secondaryCategoryIds : null,
        status: data.status as any,
        isFeatured: data.isFeatured ?? false,
        isEditorsPick: data.isEditorsPick ?? false,
        isBreaking: data.isBreaking ?? false,
        isTrending: data.isTrending ?? false,
        isLatest: data.isLatest ?? true,
        isBriefing: data.isBriefing ?? false,
        isGlobalBriefing: data.isGlobalBriefing ?? false,
        publishedAt: publishedAt ?? null,
        readingTimeMinutes: estimateReadingTime(data.contentHtml ?? ""),
      })
      .returning();

    let parentCatSlug: string | undefined = undefined;
    if (category?.parentId) {
      const parentCat = await db.query.categories.findFirst({
        where: eq(categories.id, category.parentId),
      });
      if (parentCat) parentCatSlug = parentCat.slug;
    }

    let secSlugs: string[] = [];
    if (data.secondaryCategoryIds && data.secondaryCategoryIds.length > 0) {
      const secCats = await db.query.categories.findMany({
        where: inArray(categories.id, data.secondaryCategoryIds),
      });
      secSlugs = secCats.map((sc) => sc.slug);
    }

    await invalidateArticleCache({
      articleId: article.id,
      articleSlug: article.slug,
      categorySlug: data.categorySlug,
      oldCategorySlug: parentCatSlug,
      authorId: authorIdToAssign,
      secondaryCategorySlugs: secSlugs,
    });

    return { success: true, article };
  } catch (error) {
    console.error("Error creating article:", error);
    return { success: false, error: "Failed to create article" };
  }
}

// ─────────────────────────────────────────────
// GET ARTICLES (Dashboard)
// ─────────────────────────────────────────────
export async function deleteArticleAction(id: number) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Not authenticated" };
  const { canPerformAction } = await import("@/lib/permissions");
  if (!canPerformAction(session.user.role, "delete_article")) {
    return { success: false, error: "Insufficient permissions to delete articles." };
  }

  try {
    const existing = await db.query.articles.findFirst({ where: eq(articles.id, id), with: { category: true } });
    await db.delete(articles).where(eq(articles.id, id));
    if (existing) {
      await invalidateArticleCache({
        articleId: id,
        articleSlug: existing.slug,
        categorySlug: existing.category?.slug,
        authorId: existing.authorId ?? undefined,
      });
    }
    return { success: true };
  } catch (error) {
    console.error("Error deleting article:", error);
    return { success: false, error: "Failed to delete article" };
  }
}

export async function searchPublicArticles(query: string, limit = 5) {
  if (!query || query.trim().length === 0) return [];
  try {
    const q = `%${query.trim()}%`;
    const results = await db.query.articles.findMany({
      where: and(
        eq(articles.status, "published"),
        isNotNull(articles.publishedAt),
        or(ilike(articles.title, q), ilike(articles.excerpt, q))
      ),
      columns: ARTICLE_CARD_COLUMNS,
      with: { author: true, category: true },
      orderBy: [desc(articles.publishedAt)],
      limit,
    });
    return results;
  } catch (error) {
    console.error("Error searching articles:", error);
    return [];
  }
}

export async function getArticles(search: string = "", tab: string = "all") {
  try {
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          ilike(articles.title, `%${search}%`),
          ilike(articles.excerpt, `%${search}%`)
        )
      );
    }

    if (tab !== "all") {
      if (tab === "featured") {
        conditions.push(eq(articles.isFeatured, true));
      } else {
        conditions.push(eq(articles.status, tab as any));
      }
    }

    const whereClause =
      conditions.length > 0 ? and(...conditions) : undefined;

    const results = await db.query.articles.findMany({
      where: whereClause,
      columns: ARTICLE_CARD_COLUMNS,
      with: {
        author: { with: { user: true } },
        category: true,
      },
      orderBy: [desc(articles.createdAt)],
    });

    return results;
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}

export async function toggleFeaturedArticleAction(id: number, isFeatured: boolean) {
  const session = await auth();
  const { isStaff } = await import("@/lib/permissions");
  if (!session?.user || !isStaff(session.user.role)) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await db
      .update(articles)
      .set({ isFeatured, updatedAt: new Date() })
      .where(eq(articles.id, id));

    await invalidateArticleCache({
      articleId: id,
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error toggling featured article:", error);
    return { success: false, error: error.message || "Failed to update featured status" };
  }
}

// ─────────────────────────────────────────────
// PUBLIC HOMEPAGE QUERIES
// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
// PUBLIC HOMEPAGE QUERIES
// ─────────────────────────────────────────────
export async function getBreakingArticle() {
  try {
    const result = await db.query.articles.findFirst({
      where: and(
        eq(articles.status, "published"),
        eq(articles.isBreaking, true),
        isNotNull(articles.publishedAt)
      ),
      columns: ARTICLE_CARD_COLUMNS,
      with: { author: true, category: true },
      orderBy: [desc(articles.publishedAt)],
    });
    return result ?? null;
  } catch (error) {
    console.error("Error fetching breaking article:", error);
    return null;
  }
}

export async function getBreakingArticles(limit = 10): Promise<any[]> {
  try {
    const flagged = await db.query.articles.findMany({
      where: and(
        eq(articles.status, "published"),
        eq(articles.isBreaking, true),
        isNotNull(articles.publishedAt)
      ),
      columns: ARTICLE_CARD_COLUMNS,
      with: { author: true, category: true },
      orderBy: [desc(articles.publishedAt)],
      limit,
    });

    if (flagged.length >= 3) return flagged;

    const latest = await db.query.articles.findMany({
      where: and(
        eq(articles.status, "published"),
        isNotNull(articles.publishedAt)
      ),
      columns: ARTICLE_CARD_COLUMNS,
      with: { author: true, category: true },
      orderBy: [desc(articles.publishedAt)],
      limit,
    });

    const existingIds = new Set((flagged as any[]).map((a: any) => a.id));
    const fallback = (latest as any[]).filter((a: any) => !existingIds.has(a.id));
    return [...flagged, ...fallback].slice(0, limit) as any;
  } catch (error) {
    console.error("Error fetching breaking articles:", error);
    return [];
  }
}

export async function getFeaturedArticles(limit = 5): Promise<any[]> {
  try {
    // First, fetch articles explicitly flagged as featured
    const flagged = await db.query.articles.findMany({
      where: and(
        eq(articles.status, "published"),
        eq(articles.isFeatured, true),
        isNotNull(articles.publishedAt)
      ),
      columns: ARTICLE_CARD_COLUMNS,
      with: { author: true, category: true },
      orderBy: [desc(articles.publishedAt)],
      limit,
    });

    if (flagged.length >= limit) return flagged as any;

    // Fill remaining slots with latest published articles
    const existingIds = new Set((flagged as any[]).map((a: any) => a.id));
    const latest = await db.query.articles.findMany({
      where: and(
        eq(articles.status, "published"),
        isNotNull(articles.publishedAt)
      ),
      columns: ARTICLE_CARD_COLUMNS,
      with: { author: true, category: true },
      orderBy: [desc(articles.publishedAt)],
      limit: limit * 2,
    });

    const fallback = (latest as any[]).filter((a: any) => !existingIds.has(a.id));
    return [...flagged, ...fallback].slice(0, limit) as any;
  } catch (error) {
    console.error("Error fetching featured articles:", error);
    return [];
  }
}

export async function getEditorsPicks(limit = 4): Promise<any[]> {
  try {
    const flagged = await db.query.articles.findMany({
      where: and(
        eq(articles.status, "published"),
        eq(articles.isEditorsPick, true),
        isNotNull(articles.publishedAt)
      ),
      columns: ARTICLE_CARD_COLUMNS,
      with: { author: true, category: true },
      orderBy: [desc(articles.publishedAt)],
      limit,
    });

    if (flagged.length >= limit) return flagged as any;

    // Fallback if not enough flagged
    const latest = await db.query.articles.findMany({
      where: and(
        eq(articles.status, "published"),
        isNotNull(articles.publishedAt)
      ),
      columns: ARTICLE_CARD_COLUMNS,
      with: { author: true, category: true },
      orderBy: [desc(articles.publishedAt)],
      limit: limit * 2,
    });

    const existingIds = new Set((flagged as any[]).map((a: any) => a.id));
    const fallback = (latest as any[]).filter((a: any) => !existingIds.has(a.id));
    return [...flagged, ...fallback].slice(0, limit) as any;
  } catch (error) {
    console.error("Error fetching editor's picks:", error);
    return [];
  }
}

export async function getRelatedArticles(
  currentArticleId: number,
  categorySlug?: string,
  limit = 3
): Promise<any[]> {
  try {
    let categoryId: number | undefined;
    if (categorySlug) {
      const cat = await db.query.categories.findFirst({
        where: eq(categories.slug, categorySlug),
      });
      categoryId = cat?.id;
    }

    const conditions: any[] = [
      eq(articles.status, "published"),
      isNotNull(articles.publishedAt),
      ne(articles.id, currentArticleId),
    ];

    if (categoryId) {
      conditions.push(eq(articles.categoryId, categoryId));
    }

    let results = await db.query.articles.findMany({
      where: and(...conditions),
      columns: ARTICLE_CARD_COLUMNS,
      with: { author: true, category: true },
      orderBy: [desc(articles.publishedAt)],
      limit,
    });

    if (results.length < limit) {
      const fallback = await db.query.articles.findMany({
        where: and(
          eq(articles.status, "published"),
          isNotNull(articles.publishedAt),
          ne(articles.id, currentArticleId)
        ),
        columns: ARTICLE_CARD_COLUMNS,
        with: { author: true, category: true },
        orderBy: [desc(articles.publishedAt)],
        limit: limit * 2,
      });
      const existingIds = new Set((results as any[]).map((a: any) => a.id));
      const needed = (fallback as any[]).filter((a: any) => !existingIds.has(a.id));
      results = [...results, ...needed].slice(0, limit);
    }

    return results as any;
  } catch (error) {
    console.error("Error fetching related articles:", error);
    return [];
  }
}

export async function getLatestArticles(limit = 6, categorySlug?: string): Promise<any[]> {
  try {
    const conditions: any[] = [
      eq(articles.status, "published"),
      isNotNull(articles.publishedAt),
    ];

    const results = await db.query.articles.findMany({
      where: and(...conditions),
      columns: ARTICLE_CARD_COLUMNS,
      with: { author: true, category: true },
      orderBy: [desc(articles.publishedAt)],
      limit,
    });

    if (categorySlug) {
      return (results as any[]).filter((a: any) => a.category?.slug === categorySlug) as any;
    }

    return results as any;
  } catch (error) {
    console.error("Error fetching latest articles:", error);
    return [];
  }
}

export async function getTrendingArticles(limit = 4): Promise<any[]> {
  try {
    const flagged = await db.query.articles.findMany({
      where: and(
        eq(articles.status, "published"),
        eq(articles.isTrending, true),
        isNotNull(articles.publishedAt)
      ),
      columns: ARTICLE_CARD_COLUMNS,
      with: { author: true, category: true },
      orderBy: [desc(articles.viewCount)],
      limit,
    });

    if (flagged.length >= limit) return flagged as any;

    // Fallback sorted by view count
    const latest = await db.query.articles.findMany({
      where: and(
        eq(articles.status, "published"),
        isNotNull(articles.publishedAt)
      ),
      columns: ARTICLE_CARD_COLUMNS,
      with: { author: true, category: true },
      orderBy: [desc(articles.viewCount)],
      limit: limit * 2,
    });

    const existingIds = new Set((flagged as any[]).map((a: any) => a.id));
    const fallback = (latest as any[]).filter((a: any) => !existingIds.has(a.id));
    return [...flagged, ...fallback].slice(0, limit) as any;
  } catch (error) {
    console.error("Error fetching trending articles:", error);
    return [];
  }
}

export async function getBriefingArticles(limit = 5): Promise<any[]> {
  try {
    const flagged = await db.query.articles.findMany({
      where: and(
        eq(articles.status, "published"),
        eq(articles.isBriefing, true),
        isNotNull(articles.publishedAt)
      ),
      columns: ARTICLE_CARD_COLUMNS,
      with: { author: true, category: true },
      orderBy: [desc(articles.publishedAt)],
      limit,
    });

    if (flagged.length >= limit) return flagged as any;

    const latest = await db.query.articles.findMany({
      where: and(
        eq(articles.status, "published"),
        isNotNull(articles.publishedAt)
      ),
      columns: ARTICLE_CARD_COLUMNS,
      with: { author: true, category: true },
      orderBy: [desc(articles.publishedAt)],
      limit: limit * 2,
    });

    const existingIds = new Set((flagged as any[]).map((a: any) => a.id));
    const fallback = (latest as any[]).filter((a: any) => !existingIds.has(a.id));
    return [...flagged, ...fallback].slice(0, limit) as any;
  } catch (error) {
    console.error("Error fetching briefing articles:", error);
    return [];
  }
}

export async function getGlobalBriefingArticles(limit = 3): Promise<any[]> {
  try {
    const flagged = await db.query.articles.findMany({
      where: and(
        eq(articles.status, "published"),
        eq(articles.isGlobalBriefing, true),
        isNotNull(articles.publishedAt)
      ),
      columns: ARTICLE_CARD_COLUMNS,
      with: { author: true, category: true },
      orderBy: [desc(articles.publishedAt)],
      limit,
    });

    if (flagged.length >= limit) return flagged as any;

    const latest = await db.query.articles.findMany({
      where: and(
        eq(articles.status, "published"),
        isNotNull(articles.publishedAt)
      ),
      columns: ARTICLE_CARD_COLUMNS,
      with: { author: true, category: true },
      orderBy: [desc(articles.publishedAt)],
      limit: limit * 2,
    });

    const existingIds = new Set((flagged as any[]).map((a: any) => a.id));
    const fallback = (latest as any[]).filter((a: any) => !existingIds.has(a.id));
    return [...flagged, ...fallback].slice(0, limit) as any;
  } catch (error) {
    console.error("Error fetching global briefing articles:", error);
    return [];
  }
}

export const getArticleBySlug = cache(async (slug: string) => {
  if (!slug) return null;
  try {
    const article = await db.query.articles.findFirst({
      where: eq(articles.slug, slug),
      with: {
        author: {
          with: {
            user: true,
          },
        },
        category: true,
      },
    });

    return article;
  } catch (error) {
    console.error("Error fetching article by slug:", error);
    return null;
  }
});

// ─────────────────────────────────────────────
// GET ARTICLE BY ID (for editing)
// ─────────────────────────────────────────────
export async function getArticleById(id: number) {
  try {
    const article = await db.query.articles.findFirst({
      where: eq(articles.id, id),
      with: {
        author: true,
        category: true,
      },
    });
    return article ?? null;
  } catch (error) {
    console.error("Error fetching article by id:", error);
    return null;
  }
}

// ─────────────────────────────────────────────
// UPDATE ARTICLE (Edit action)
// ─────────────────────────────────────────────
export async function updateArticleAction(
  id: number,
  data: {
    title: string;
    excerpt: string;
    contentHtml: string;
    heroImage?: string;
    heroImageAlt?: string;
    heroImageCaption?: string;
    seoTitle?: string;
    seoDescription?: string;
    customSlug?: string;
    canonicalUrl?: string;
    sources?: string;
    categorySlug: string;
    secondaryCategoryIds?: number[];
    status: string;
    authorId?: number;
    isFeatured?: boolean;
    isEditorsPick?: boolean;
    isBreaking?: boolean;
    isTrending?: boolean;
    isLatest?: boolean;
    isBriefing?: boolean;
    isGlobalBriefing?: boolean;
    publishedAt?: Date | string | null;
  }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  const { isStaff, canPerformAction } = await import("@/lib/permissions");
  if (!isStaff(session.user.role)) {
    return { success: false, error: "Staff access required." };
  }
  if (data.status === "published" && !canPerformAction(session.user.role, "publish_article")) {
    data = { ...data, status: "pending_review" };
  }

  try {
    const category = await db.query.categories.findFirst({
      where: eq(categories.slug, data.categorySlug),
    });

    const existingArticle = await db.query.articles.findFirst({
      where: eq(articles.id, id),
    });

    if (!existingArticle) {
      return { success: false, error: "Article not found" };
    }

    const wasPublished = existingArticle.status === "published";
    const isNowPublished = data.status === "published";
    const publishedAt = data.publishedAt
      ? new Date(data.publishedAt)
      : isNowPublished && !wasPublished
      ? new Date()
      : isNowPublished
      ? existingArticle.publishedAt ?? new Date()
      : existingArticle.publishedAt; // PRESERVE existing publishedAt when archiving/drafting

    let newSlug = data.customSlug ? generateSlug(data.customSlug) : existingArticle.slug;
    if (data.customSlug) {
      const slugConflict = await db.query.articles.findFirst({
        where: and(eq(articles.slug, newSlug), ne(articles.id, id)),
      });
      if (slugConflict) {
        newSlug = `${newSlug}-${Date.now()}`;
      }
    }

    const updatePayload: any = {
      title: data.title,
      slug: newSlug,
      excerpt: data.excerpt || null,
      contentHtml: data.contentHtml || null,
      heroImage: await sanitizeHeroImage(data.heroImage),
      heroImageAlt: data.heroImageAlt || null,
      heroImageCaption: data.heroImageCaption || null,
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
      canonicalUrl: data.canonicalUrl || null,
      categoryId: category?.id ?? null,
      secondaryCategoryIds: data.secondaryCategoryIds && data.secondaryCategoryIds.length > 0 ? data.secondaryCategoryIds : null,
      status: data.status as any,
      isFeatured: data.isFeatured ?? false,
      isEditorsPick: data.isEditorsPick ?? false,
      isBreaking: data.isBreaking ?? false,
      isTrending: data.isTrending ?? false,
      isLatest: data.isLatest ?? true,
      isBriefing: data.isBriefing ?? false,
      isGlobalBriefing: data.isGlobalBriefing ?? false,
      publishedAt,
      readingTimeMinutes: estimateReadingTime(data.contentHtml ?? ""),
      updatedAt: new Date(),
    };

    if (data.authorId) {
      updatePayload.authorId = data.authorId;
    }

    const [updated] = await db
      .update(articles)
      .set(updatePayload)
      .where(eq(articles.id, id))
      .returning();

    const oldCategory = await db.query.categories.findFirst({ where: eq(categories.id, existingArticle.categoryId ?? 0) });
    let secSlugs: string[] = [];
    if (data.secondaryCategoryIds && data.secondaryCategoryIds.length > 0) {
      const secCats = await db.query.categories.findMany({
        where: inArray(categories.id, data.secondaryCategoryIds),
      });
      secSlugs = secCats.map((sc) => sc.slug);
    }

    await invalidateArticleCache({
      articleId: updated.id,
      articleSlug: updated.slug,
      categorySlug: data.categorySlug,
      oldCategorySlug: oldCategory?.slug,
      authorId: updated.authorId ?? undefined,
      secondaryCategorySlugs: secSlugs,
    });

    return { success: true, article: updated };
  } catch (error) {
    console.error("Error updating article:", error);
    return { success: false, error: "Failed to update article" };
  }
}

export async function bumpArticlePublishDateAction(id: number) {
  const session = await auth();
  const { isStaff } = await import("@/lib/permissions");
  if (!session?.user || !isStaff(session.user.role)) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const existing = await db.query.articles.findFirst({
      where: eq(articles.id, id),
      with: { category: true },
    });
    if (!existing) return { success: false, error: "Article not found" };

    const now = new Date();
    await db
      .update(articles)
      .set({ publishedAt: now, updatedAt: now, status: "published" })
      .where(eq(articles.id, id));

    await invalidateArticleCache({
      articleId: id,
      articleSlug: existing.slug,
      categorySlug: existing.category?.slug,
      authorId: existing.authorId ?? undefined,
    });

    return { success: true, publishedAt: now };
  } catch (error: any) {
    console.error("Error bumping article publish date:", error);
    return { success: false, error: error.message || "Failed to bump publish date" };
  }
}


