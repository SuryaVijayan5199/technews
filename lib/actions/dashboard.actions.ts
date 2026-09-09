"use server";

import { db } from "@/lib/db";
import { categories, articles, comments, users, authors } from "@/lib/db/schema";
import { eq, desc, asc, sql, count, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { invalidateCategoryCache, invalidateCommentCache } from "@/lib/cache/revalidate";
import { auth } from "@/lib/auth";
import { isStaff, canPerformAction } from "@/lib/permissions";

// ─────────────────────────────────────────────
// DASHBOARD STATS (home)
// ─────────────────────────────────────────────
export async function getDashboardStats() {
  const session = await auth();
  if (!session?.user || !isStaff(session.user.role)) {
    throw new Error("Forbidden");
  }
  try {
    const [
      totalArticles,
      publishedArticles,
      draftArticles,
      pendingArticles,
      totalUsers,
      totalComments,
      pendingComments,
      totalCategories,
      totalViews,
    ] = await Promise.all([
      db.select({ count: count() }).from(articles),
      db.select({ count: count() }).from(articles).where(eq(articles.status, "published")),
      db.select({ count: count() }).from(articles).where(eq(articles.status, "draft")),
      db.select({ count: count() }).from(articles).where(eq(articles.status, "pending_review")),
      db.select({ count: count() }).from(users),
      db.select({ count: count() }).from(comments),
      db.select({ count: count() }).from(comments).where(eq(comments.status, "pending")),
      db.select({ count: count() }).from(categories).where(eq(categories.isActive, true)),
      db.select({ total: sql<number>`sum(${articles.viewCount})` }).from(articles),
    ]);

    // Recent articles
    const recentArticles = await db
      .select({
        id: articles.id,
        title: articles.title,
        slug: articles.slug,
        status: articles.status,
        viewCount: articles.viewCount,
        publishedAt: articles.publishedAt,
        createdAt: articles.createdAt,
      })
      .from(articles)
      .orderBy(desc(articles.createdAt))
      .limit(5);

    // Recent comments
    const recentComments = await db
      .select({
        id: comments.id,
        content: comments.content,
        status: comments.status,
        createdAt: comments.createdAt,
        authorName: sql<string>`coalesce(${users.name}, ${comments.guestName}, 'Anonymous')`,
        articleId: comments.articleId,
      })
      .from(comments)
      .leftJoin(users, eq(comments.authorId, users.id))
      .orderBy(desc(comments.createdAt))
      .limit(5);

    return {
      totalArticles: totalArticles[0]?.count ?? 0,
      publishedArticles: publishedArticles[0]?.count ?? 0,
      draftArticles: draftArticles[0]?.count ?? 0,
      pendingArticles: pendingArticles[0]?.count ?? 0,
      totalUsers: totalUsers[0]?.count ?? 0,
      totalComments: totalComments[0]?.count ?? 0,
      pendingComments: pendingComments[0]?.count ?? 0,
      totalCategories: totalCategories[0]?.count ?? 0,
      totalViews: totalViews[0]?.total ?? 0,
      recentArticles,
      recentComments,
    };
  } catch (err) {
    console.error("[getDashboardStats]", err);
    return null;
  }
}

// ─────────────────────────────────────────────
// CATEGORIES CRUD
// ─────────────────────────────────────────────
export async function getCategories() {
  try {
    const cats = await db.query.categories.findMany({
      orderBy: [asc(categories.sortOrder), asc(categories.name)],
    });

    // Compute live article counts per category from articles table
    const articleCounts = await db
      .select({
        categoryId: articles.categoryId,
        count: count(articles.id),
      })
      .from(articles)
      .groupBy(articles.categoryId);

    const countMap = new Map<number, number>();
    for (const item of articleCounts) {
      if (item.categoryId) {
        countMap.set(item.categoryId, item.count);
      }
    }

    return cats.map((cat: any) => ({
      ...cat,
      articleCount: countMap.get(cat.id) ?? cat.articleCount ?? 0,
    }));
  } catch (err) {
    console.error("[getCategories]", err);
    return [];
  }
}

export async function createCategory(data: {
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
}) {
  if (!data.name || !data.slug) return { success: false, error: "Name and slug are required." };
  const session = await auth();
  if (!session?.user || !isStaff(session.user.role)) {
    return { success: false, error: "Forbidden" };
  }
  try {
    const slug = data.slug.trim().toLowerCase().replace(/\s+/g, "-");
    await db.insert(categories).values({
      name: data.name.trim(),
      slug,
      description: data.description?.trim() || null,
      color: data.color || null,
      icon: data.icon || null,
    });
    await invalidateCategoryCache(slug);
    return { success: true };
  } catch (err: any) {
    if (err?.message?.includes("unique")) return { success: false, error: "A category with this slug already exists." };
    console.error("[createCategory]", err);
    return { success: false, error: "Failed to create category." };
  }
}

export async function updateCategory(id: number, data: {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  isActive: boolean;
}) {
  try {
    const session = await auth();
    if (!session?.user || !isStaff(session.user.role)) {
      return { success: false, error: "Forbidden" };
    }
    const [updated] = await db.update(categories).set({
      name: data.name.trim(),
      description: data.description?.trim() || null,
      color: data.color || null,
      icon: data.icon || null,
      isActive: data.isActive,
      updatedAt: new Date(),
    }).where(eq(categories.id, id)).returning();
    if (updated) {
      await invalidateCategoryCache(updated.slug);
    }
    return { success: true };
  } catch (err) {
    console.error("[updateCategory]", err);
    return { success: false, error: "Failed to update category." };
  }
}

export async function deleteCategory(id: number) {
  try {
    const session = await auth();
    if (!session?.user || !isStaff(session.user.role)) {
      return { success: false, error: "Forbidden" };
    }
    // Check if any articles use this category
    const articleCount = await db.select({ count: count() }).from(articles).where(eq(articles.categoryId, id));
    if ((articleCount[0]?.count ?? 0) > 0) {
      return { success: false, error: "Cannot delete: category has articles. Reassign them first." };
    }
    const cat = await db.query.categories.findFirst({ where: eq(categories.id, id) });
    await db.delete(categories).where(eq(categories.id, id));
    if (cat) {
      await invalidateCategoryCache(cat.slug);
    }
    return { success: true };
  } catch (err) {
    console.error("[deleteCategory]", err);
    return { success: false, error: "Failed to delete category." };
  }
}

// ─────────────────────────────────────────────
// COMMENTS MODERATION
// ─────────────────────────────────────────────
export async function getComments(filter: "all" | "pending" | "approved" | "spam" = "all") {
  try {
    const session = await auth();
    if (!session?.user || !isStaff(session.user.role)) {
      throw new Error("Forbidden");
    }
    const rows = await db
      .select({
        id: comments.id,
        content: comments.content,
        status: comments.status,
        createdAt: comments.createdAt,
        authorName: sql<string>`coalesce(${users.name}, ${comments.guestName}, 'Anonymous')`,
        authorEmail: sql<string>`coalesce(${users.email}, ${comments.guestEmail}, '')`,
        articleId: comments.articleId,
        parentId: comments.parentId,
        likeCount: comments.likes,
        articleTitle: articles.title,
        articleSlug: articles.slug,
        categorySlug: categories.slug,
      })
      .from(comments)
      .leftJoin(articles, eq(comments.articleId, articles.id))
      .leftJoin(users, eq(comments.authorId, users.id))
      .leftJoin(categories, eq(articles.categoryId, categories.id))
      .where(filter !== "all" ? eq(comments.status, filter as any) : undefined)
      .orderBy(desc(comments.createdAt))
      .limit(50);
    return rows;
  } catch (err) {
    console.error("[getComments]", err);
    return [];
  }
}


export async function moderateComment(id: number, status: "approved" | "rejected" | "spam") {
  try {
    const session = await auth();
    if (!session?.user || !canPerformAction(session.user.role, "moderate_comments")) {
      return { success: false, error: "Forbidden" };
    }
    const [updated] = await db.update(comments).set({ status, updatedAt: new Date() }).where(eq(comments.id, id)).returning();
    if (updated) {
      await invalidateCommentCache(updated.articleId);
    }
    return { success: true };
  } catch (err) {
    console.error("[moderateComment]", err);
    return { success: false, error: "Failed to update comment." };
  }
}

export async function deleteComment(id: number) {
  try {
    const session = await auth();
    if (!session?.user || !canPerformAction(session.user.role, "moderate_comments")) {
      return { success: false, error: "Forbidden" };
    }
    const cmt = await db.query.comments.findFirst({ where: eq(comments.id, id) });
    // Delete child replies first to avoid FK constraint
    await db.delete(comments).where(eq(comments.parentId, id));
    await db.delete(comments).where(eq(comments.id, id));
    if (cmt) {
      await invalidateCommentCache(cmt.articleId);
    }
    return { success: true };
  } catch (err) {
    console.error("[deleteComment]", err);
    return { success: false, error: "Failed to delete comment." };
  }
}

// ─────────────────────────────────────────────
// ANALYTICS DATA
// ─────────────────────────────────────────────
export async function getAnalyticsData() {
  try {
    const session = await auth();
    if (!session?.user || !isStaff(session.user.role)) {
      throw new Error("Forbidden");
    }
    // Top articles by views
    const topArticles = await db
      .select({
        id: articles.id,
        title: articles.title,
        slug: articles.slug,
        viewCount: articles.viewCount,
        commentCount: articles.commentCount,
        bookmarkCount: articles.bookmarkCount,
        publishedAt: articles.publishedAt,
        status: articles.status,
        categorySlug: categories.slug,
      })
      .from(articles)
      .leftJoin(categories, eq(articles.categoryId, categories.id))
      .where(eq(articles.status, "published"))
      .orderBy(desc(articles.viewCount))
      .limit(10);

    // Articles by category
    const byCategory = await db
      .select({
        categoryId: articles.categoryId,
        categoryName: categories.name,
        count: count(),
      })
      .from(articles)
      .leftJoin(categories, eq(articles.categoryId, categories.id))
      .groupBy(articles.categoryId, categories.name)
      .orderBy(desc(count()))
      .limit(8);

    // Article status breakdown
    const statusBreakdown = await db
      .select({
        status: articles.status,
        count: count(),
      })
      .from(articles)
      .groupBy(articles.status);

    // Total views
    const viewsResult = await db
      .select({ total: sql<number>`coalesce(sum(${articles.viewCount}), 0)` })
      .from(articles);

    return {
      topArticles,
      byCategory,
      statusBreakdown,
      totalViews: viewsResult[0]?.total ?? 0,
    };
  } catch (err) {
    console.error("[getAnalyticsData]", err);
    return null;
  }
}

// ─────────────────────────────────────────────
// EDITOR PROFILES (for Team page display)
// ─────────────────────────────────────────────
export async function getEditorProfiles() {
  try {
    const session = await auth();
    if (!session?.user || !isStaff(session.user.role)) {
      throw new Error("Forbidden");
    }
    const STAFF_ROLES = ["super_admin", "publisher", "managing_editor", "editor", "author", "reviewer", "contributor"] as const;
    const staffUsers = await db.query.users.findMany({
      where: sql`${users.role} = ANY(ARRAY[${sql.join(STAFF_ROLES.map((r: any) => sql`${r}`), sql`, `)}]::text[])`,
      columns: { id: true, name: true, email: true, role: true, image: true, bio: true, createdAt: true },
    });

    // Try to get author profile data too
    const authorProfiles = await db.query.authors.findMany({
      columns: { userId: true, displayName: true, avatar: true, bio: true, articleCount: true, totalViews: true },
    });

    const authorMap = new Map(authorProfiles.map((a: any) => [a.userId, a]));

    return staffUsers.map((u: any) => ({
      ...u,
      authorProfile: authorMap.get(u.id) ?? null,
    }));
  } catch (err) {
    console.error("[getEditorProfiles]", err);
    return [];
  }
}
