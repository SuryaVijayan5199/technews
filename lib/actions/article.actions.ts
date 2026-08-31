"use server";

import { cache } from "react";
import { db } from "@/lib/db";
import { articles, authors, categories } from "@/lib/db/schema";
import { eq, or, ilike, and, desc, isNotNull, inArray, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { cleanAuthorName } from "@/lib/utils";

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
    return all.filter((c) => c.parentId === null);
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
        eq(articles.categoryId, categoryObj.id)
      ),
      with: { author: true, category: true },
      orderBy: [desc(articles.publishedAt)],
      limit,
    });

    return { category: categoryObj, articles: result };
  } catch (error) {
    console.error("Error fetching articles by category:", error);
    return { category: null, articles: [] };
  }
}

// ─────────────────────────────────────────────
// GET LATEST 3 ARTICLES FOR ALL ACTIVE TOPICS (DYNAMIC)
// ─────────────────────────────────────────────
export async function getArticlesGroupedByTopics() {
  try {
    const allCategories = await db.query.categories.findMany({
      where: eq(categories.isActive, true),
      orderBy: [categories.sortOrder],
    });

    const result = await Promise.all(
      allCategories.map(async (catObj) => {
        let catArticles = await db.query.articles.findMany({
          where: and(
            eq(articles.status, "published"),
            isNotNull(articles.publishedAt),
            eq(articles.categoryId, catObj.id)
          ),
          with: { author: true, category: true },
          orderBy: [desc(articles.publishedAt)],
          limit: 3,
        });

        // If category has fewer than 3 articles, fallback to latest published articles
        if (catArticles.length < 3) {
          const fallback = await db.query.articles.findMany({
            where: and(
              eq(articles.status, "published"),
              isNotNull(articles.publishedAt)
            ),
            with: { author: true, category: true },
            orderBy: [desc(articles.publishedAt)],
            limit: 6,
          });

          const existingIds = new Set(catArticles.map((a) => a.id));
          const extra = fallback.filter((a) => !existingIds.has(a.id));
          catArticles = [...catArticles, ...extra].slice(0, 3);
        }

        return {
          category: catObj,
          articles: catArticles,
        };
      })
    );

    return result.filter((item): item is NonNullable<typeof item> => item !== null && item.articles.length > 0);
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
  status: string;
  isFeatured?: boolean;
  isEditorsPick?: boolean;
  isBreaking?: boolean;
  isTrending?: boolean;
  publishedAt?: Date | string | null;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  try {
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
        heroImage: data.heroImage || null,
        heroImageAlt: data.heroImageAlt || null,
        heroImageCaption: data.heroImageCaption || null,
        seoTitle: data.seoTitle || null,
        seoDescription: data.seoDescription || null,
        canonicalUrl: data.canonicalUrl || null,
        authorId: author.id,
        categoryId: category?.id ?? null,
        status: data.status as any,
        isFeatured: data.isFeatured ?? false,
        isEditorsPick: data.isEditorsPick ?? false,
        isBreaking: data.isBreaking ?? false,
        isTrending: data.isTrending ?? false,
        publishedAt: publishedAt ?? null,
        readingTimeMinutes: estimateReadingTime(data.contentHtml ?? ""),
      })
      .returning();

    revalidatePath("/dashboard/articles");
    revalidatePath("/");
    // Revalidate the category page so new article appears immediately
    revalidatePath(`/${data.categorySlug}`);
    if (category?.parentId) {
      const parentCat = await db.query.categories.findFirst({
        where: eq(categories.id, category.parentId),
      });
      if (parentCat) revalidatePath(`/${parentCat.slug}`);
    }

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
  if (!session?.user) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    await db.delete(articles).where(eq(articles.id, id));
    revalidatePath("/dashboard/articles");
    revalidatePath("/");
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
      conditions.push(eq(articles.status, tab as any));
    }

    const whereClause =
      conditions.length > 0 ? and(...conditions) : undefined;

    const results = await db.query.articles.findMany({
      where: whereClause,
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
      with: { author: true, category: true },
      orderBy: [desc(articles.publishedAt)],
    });
    return result ?? null;
  } catch (error) {
    console.error("Error fetching breaking article:", error);
    return null;
  }
}

export async function getBreakingArticles(limit = 10) {
  try {
    const flagged = await db.query.articles.findMany({
      where: and(
        eq(articles.status, "published"),
        eq(articles.isBreaking, true),
        isNotNull(articles.publishedAt)
      ),
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
      with: { author: true, category: true },
      orderBy: [desc(articles.publishedAt)],
      limit,
    });

    const existingIds = new Set(flagged.map((a) => a.id));
    const fallback = latest.filter((a) => !existingIds.has(a.id));
    return [...flagged, ...fallback].slice(0, limit);
  } catch (error) {
    console.error("Error fetching breaking articles:", error);
    return [];
  }
}

export async function getFeaturedArticles(limit = 5) {
  try {
    // First, fetch articles explicitly flagged as featured
    const flagged = await db.query.articles.findMany({
      where: and(
        eq(articles.status, "published"),
        eq(articles.isFeatured, true),
        isNotNull(articles.publishedAt)
      ),
      with: { author: true, category: true },
      orderBy: [desc(articles.publishedAt)],
      limit,
    });

    if (flagged.length >= limit) return flagged;

    // Fill remaining slots with latest published articles
    const existingIds = new Set(flagged.map((a) => a.id));
    const latest = await db.query.articles.findMany({
      where: and(
        eq(articles.status, "published"),
        isNotNull(articles.publishedAt)
      ),
      with: { author: true, category: true },
      orderBy: [desc(articles.publishedAt)],
      limit: limit * 2,
    });

    const fallback = latest.filter((a) => !existingIds.has(a.id));
    return [...flagged, ...fallback].slice(0, limit);
  } catch (error) {
    console.error("Error fetching featured articles:", error);
    return [];
  }
}

export async function getEditorsPicks(limit = 4) {
  try {
    const flagged = await db.query.articles.findMany({
      where: and(
        eq(articles.status, "published"),
        eq(articles.isEditorsPick, true),
        isNotNull(articles.publishedAt)
      ),
      with: { author: true, category: true },
      orderBy: [desc(articles.publishedAt)],
      limit,
    });

    if (flagged.length >= limit) return flagged;

    // Fallback if not enough flagged
    const latest = await db.query.articles.findMany({
      where: and(
        eq(articles.status, "published"),
        isNotNull(articles.publishedAt)
      ),
      with: { author: true, category: true },
      orderBy: [desc(articles.publishedAt)],
      limit: limit * 2,
    });

    const existingIds = new Set(flagged.map((a) => a.id));
    const fallback = latest.filter((a) => !existingIds.has(a.id));
    return [...flagged, ...fallback].slice(0, limit);
  } catch (error) {
    console.error("Error fetching editor's picks:", error);
    return [];
  }
}

export async function getRelatedArticles(
  currentArticleId: number,
  categorySlug?: string,
  limit = 3
) {
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
        with: { author: true, category: true },
        orderBy: [desc(articles.publishedAt)],
        limit: limit * 2,
      });
      const existingIds = new Set(results.map((a) => a.id));
      const needed = fallback.filter((a) => !existingIds.has(a.id));
      results = [...results, ...needed].slice(0, limit);
    }

    return results;
  } catch (error) {
    console.error("Error fetching related articles:", error);
    return [];
  }
}

export async function getLatestArticles(limit = 6, categorySlug?: string) {
  try {
    const conditions: any[] = [
      eq(articles.status, "published"),
      isNotNull(articles.publishedAt),
    ];

    const results = await db.query.articles.findMany({
      where: and(...conditions),
      with: { author: true, category: true },
      orderBy: [desc(articles.publishedAt)],
      limit,
    });

    if (categorySlug) {
      return results.filter((a) => a.category?.slug === categorySlug);
    }

    return results;
  } catch (error) {
    console.error("Error fetching latest articles:", error);
    return [];
  }
}

export async function getTrendingArticles(limit = 4) {
  try {
    const flagged = await db.query.articles.findMany({
      where: and(
        eq(articles.status, "published"),
        eq(articles.isTrending, true),
        isNotNull(articles.publishedAt)
      ),
      with: { author: true, category: true },
      orderBy: [desc(articles.viewCount)],
      limit,
    });

    if (flagged.length >= limit) return flagged;

    // Fallback sorted by view count
    const latest = await db.query.articles.findMany({
      where: and(
        eq(articles.status, "published"),
        isNotNull(articles.publishedAt)
      ),
      with: { author: true, category: true },
      orderBy: [desc(articles.viewCount)],
      limit: limit * 2,
    });

    const existingIds = new Set(flagged.map((a) => a.id));
    const fallback = latest.filter((a) => !existingIds.has(a.id));
    return [...flagged, ...fallback].slice(0, limit);
  } catch (error) {
    console.error("Error fetching trending articles:", error);
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

    if (article) {
      // Increment view count asynchronously
      db.update(articles)
        .set({ viewCount: article.viewCount + 1 })
        .where(eq(articles.id, article.id))
        .catch(() => {});
    }

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
    status: string;
    isFeatured?: boolean;
    isEditorsPick?: boolean;
    isBreaking?: boolean;
    isTrending?: boolean;
    publishedAt?: Date | string | null;
  }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
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

    const isNowPublished = data.status === "published";
    const publishedAt = data.publishedAt
      ? new Date(data.publishedAt)
      : isNowPublished
      ? existingArticle.publishedAt ?? new Date()
      : null;

    const [updated] = await db
      .update(articles)
      .set({
        title: data.title,
        slug: data.customSlug ? generateSlug(data.customSlug) : existingArticle.slug,
        excerpt: data.excerpt || null,
        contentHtml: data.contentHtml || null,
        heroImage: data.heroImage || null,
        heroImageAlt: data.heroImageAlt || null,
        heroImageCaption: data.heroImageCaption || null,
        seoTitle: data.seoTitle || null,
        seoDescription: data.seoDescription || null,
        canonicalUrl: data.canonicalUrl || null,
        categoryId: category?.id ?? null,
        status: data.status as any,
        isFeatured: data.isFeatured ?? false,
        isEditorsPick: data.isEditorsPick ?? false,
        isBreaking: data.isBreaking ?? false,
        isTrending: data.isTrending ?? false,
        publishedAt,
        readingTimeMinutes: estimateReadingTime(data.contentHtml ?? ""),
        updatedAt: new Date(),
      })
      .where(eq(articles.id, id))
      .returning();

    revalidatePath("/dashboard/articles");
    revalidatePath("/");
    revalidatePath(`/${data.categorySlug}`);
    if (existingArticle.slug) {
      revalidatePath(`/${data.categorySlug}/${existingArticle.slug}`);
    }

    return { success: true, article: updated };
  } catch (error) {
    console.error("Error updating article:", error);
    return { success: false, error: "Failed to update article" };
  }
}


