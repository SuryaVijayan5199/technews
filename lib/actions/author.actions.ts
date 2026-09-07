"use server";

import { db } from "@/lib/db";
import { authors, users, articles } from "@/lib/db/schema";
import { eq, desc, sql as drizzleSql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { isSuperAdminEmail } from "@/config/site";

// Helper to check Super Admin permission for Author creation/modification
async function checkSuperAdminPermission() {
  const session = await auth();
  const role = (session?.user as any)?.role;
  const isSuperAdmin = role === "super_admin" || isSuperAdminEmail(session?.user?.email);

  if (!session?.user || !isSuperAdmin) {
    return { isAuthorized: false, error: "Unauthorized: Only Super Admin can manage author profiles." };
  }
  return { isAuthorized: true, session };
}

// ─────────────────────────────────────────────
// GET ALL AUTHORS WITH STATS
// ─────────────────────────────────────────────
export async function getAuthorsWithStats() {
  try {
    const list = await db.query.authors.findMany({
      with: {
        user: {
          columns: { id: true, email: true, role: true },
        },
      },
      orderBy: [authors.displayName],
    });

    // Calculate actual published article counts per author
    const articleCounts = await db
      .select({
        authorId: articles.authorId,
        count: drizzleSql<number>`count(${articles.id})::int`,
      })
      .from(articles)
      .groupBy(articles.authorId);

    const countMap = new Map<number, number>();
    articleCounts.forEach((row: any) => {
      if (row.authorId) countMap.set(row.authorId, row.count);
    });

    return list.map((a: any) => ({
      ...a,
      articleCount: countMap.get(a.id) ?? a.articleCount ?? 0,
    }));
  } catch (error) {
    console.error("Error fetching authors with stats:", error);
    return [];
  }
}

// ─────────────────────────────────────────────
// GET AUTHOR BY SLUG WITH ARTICLES (Public Page)
// ─────────────────────────────────────────────
export async function getAuthorBySlugWithArticles(slug: string) {
  try {
    const author = await db.query.authors.findFirst({
      where: eq(authors.slug, slug),
      with: {
        user: {
          columns: { id: true, email: true, role: true },
        },
      },
    });

    if (!author) return null;

    const authorArticles = await db.query.articles.findMany({
      where: (table: any, { and, eq }: any) => and(eq(table.authorId, author.id), eq(table.status, "published")),
      with: {
        category: true,
      },
      orderBy: [desc(articles.publishedAt)],
    });

    return {
      ...author,
      articles: authorArticles,
      articleCount: authorArticles.length,
    };
  } catch (error) {
    console.error("Error fetching author by slug:", error);
    return null;
  }
}

// ─────────────────────────────────────────────
// CREATE AUTHOR PROFILE (Super Admin only)
// ─────────────────────────────────────────────
export async function createAuthorProfile(data: {
  displayName: string;
  bio?: string;
  avatar?: string;
  customSlug?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  isVerified?: boolean;
}) {
  const check = await checkSuperAdminPermission();
  if (!check.isAuthorized) {
    return { success: false, error: check.error };
  }

  if (!data.displayName || !data.displayName.trim()) {
    return { success: false, error: "Display Name is required." };
  }

  try {
    const baseSlug = (data.customSlug || data.displayName)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .substring(0, 80);

    let slug = baseSlug;
    const existingSlug = await db.query.authors.findFirst({
      where: eq(authors.slug, slug),
    });
    if (existingSlug) {
      slug = `${baseSlug}-${Date.now()}`;
    }

    const userId = check.session!.user.id;

    const [newAuthor] = await db
      .insert(authors)
      .values({
        userId: null,
        displayName: data.displayName.trim(),
        slug,
        bio: data.bio?.trim() || null,
        avatar: data.avatar?.trim() || `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(data.displayName)}`,
        twitterUrl: data.twitterUrl?.trim() || null,
        linkedinUrl: data.linkedinUrl?.trim() || null,
        websiteUrl: data.websiteUrl?.trim() || null,
        isVerified: data.isVerified ?? true,
      })
      .returning();

    revalidatePath("/dashboard/authors");
    revalidatePath("/dashboard/articles/new");
    revalidatePath("/dashboard/articles/[id]/edit");
    return { success: true, author: newAuthor };
  } catch (error) {
    console.error("Error creating author profile:", error);
    return { success: false, error: "Failed to create author profile." };
  }
}

// ─────────────────────────────────────────────
// UPDATE AUTHOR PROFILE (Super Admin only)
// ─────────────────────────────────────────────
export async function updateAuthorProfile(
  authorId: number,
  data: {
    displayName: string;
    bio?: string;
    avatar?: string;
    customSlug?: string;
    twitterUrl?: string;
    linkedinUrl?: string;
    websiteUrl?: string;
    isVerified?: boolean;
  }
) {
  const check = await checkSuperAdminPermission();
  if (!check.isAuthorized) {
    return { success: false, error: check.error };
  }

  if (!data.displayName || !data.displayName.trim()) {
    return { success: false, error: "Display Name is required." };
  }

  try {
    const existingAuthor = await db.query.authors.findFirst({
      where: eq(authors.id, authorId),
    });

    if (!existingAuthor) {
      return { success: false, error: "Author profile not found." };
    }

    let slug = existingAuthor.slug;
    if (data.customSlug && data.customSlug !== existingAuthor.slug) {
      const formattedSlug = data.customSlug
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .substring(0, 80);

      const existingSlug = await db.query.authors.findFirst({
        where: eq(authors.slug, formattedSlug),
      });

      if (existingSlug && existingSlug.id !== authorId) {
        slug = `${formattedSlug}-${Date.now()}`;
      } else {
        slug = formattedSlug;
      }
    }

    const [updated] = await db
      .update(authors)
      .set({
        displayName: data.displayName.trim(),
        slug,
        bio: data.bio?.trim() || null,
        avatar: data.avatar?.trim() || existingAuthor.avatar,
        twitterUrl: data.twitterUrl?.trim() || null,
        linkedinUrl: data.linkedinUrl?.trim() || null,
        websiteUrl: data.websiteUrl?.trim() || null,
        isVerified: data.isVerified ?? existingAuthor.isVerified,
        updatedAt: new Date(),
      })
      .where(eq(authors.id, authorId))
      .returning();

    revalidatePath("/dashboard/authors");
    revalidatePath("/dashboard/articles/new");
    revalidatePath("/dashboard/articles/[id]/edit");
    revalidatePath(`/authors/${slug}`);
    return { success: true, author: updated };
  } catch (error) {
    console.error("Error updating author profile:", error);
    return { success: false, error: "Failed to update author profile." };
  }
}

// ─────────────────────────────────────────────
// DELETE AUTHOR PROFILE (Super Admin only)
// ─────────────────────────────────────────────
export async function deleteAuthorProfile(authorId: number) {
  const check = await checkSuperAdminPermission();
  if (!check.isAuthorized) {
    return { success: false, error: check.error };
  }

  try {
    await db.delete(authors).where(eq(authors.id, authorId));
    revalidatePath("/dashboard/authors");
    revalidatePath("/dashboard/articles/new");
    return { success: true };
  } catch (error) {
    console.error("Error deleting author profile:", error);
    return { success: false, error: "Failed to delete author profile." };
  }
}
