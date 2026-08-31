"use server";

import { db } from "@/lib/db";
import { users, bookmarks, readingHistory, articles, authors } from "@/lib/db/schema";
import { eq, desc, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cleanAuthorName } from "@/lib/utils";
import { auth } from "@/lib/auth";

// Helper to enforce super_admin authorization
async function checkSuperAdmin() {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session?.user || role !== "super_admin") {
    return { isAuthorized: false, error: "Unauthorized: Only Super Admin can manage team members and allocate roles." };
  }
  return { isAuthorized: true };
}

// ─────────────────────────────────────────────
// GET USER PROFILE FROM DB
// ─────────────────────────────────────────────
export async function getUserProfile(userId: string) {
  if (!userId) return null;
  try {
    return await db.query.users.findFirst({ where: eq(users.id, userId) }) ?? null;
  } catch (err) {
    console.error("[getUserProfile]", err);
    return null;
  }
}

// ─────────────────────────────────────────────
// UPDATE USER PROFILE IN DB
// ─────────────────────────────────────────────
export interface UpdateProfileInput {
  userId: string;
  name: string;
  bio: string;
  website: string;
  twitterHandle: string;
  image: string;
}

export async function updateUserProfile(input: UpdateProfileInput) {
  const { userId, name, bio, website, twitterHandle, image } = input;
  if (!userId) return { success: false, error: "Not authenticated." };

  const sanitizedName = cleanAuthorName(name.trim());

  try {
    // 1. Update users table
    await db.update(users).set({
      name: sanitizedName || null,
      bio: bio.trim() || null,
      website: website.trim() || null,
      twitterHandle: twitterHandle.replace(/^@/, "").trim() || null,
      image: image.trim() || null,
      updatedAt: new Date(),
    }).where(eq(users.id, userId));

    // 2. Also update matching author record in authors table if present
    const existingAuthor = await db.query.authors.findFirst({
      where: eq(authors.userId, userId),
    });

    if (existingAuthor) {
      await db.update(authors).set({
        displayName: sanitizedName,
        bio: bio.trim() || null,
        avatar: image.trim() || null,
        updatedAt: new Date(),
      }).where(eq(authors.id, existingAuthor.id));
    }

    revalidatePath("/profile");
    revalidatePath("/dashboard/articles");
    return { success: true };
  } catch (err) {
    console.error("[updateUserProfile]", err);
    return { success: false, error: "Failed to update profile. Please try again." };
  }
}

// ─────────────────────────────────────────────
// GET USER BOOKMARKS FROM DB
// ─────────────────────────────────────────────
export async function getUserBookmarks(userId: string) {
  if (!userId) return [];
  try {
    return await db
      .select({
        articleId: bookmarks.articleId,
        createdAt: bookmarks.createdAt,
        title: articles.title,
        slug: articles.slug,
        heroImage: articles.heroImage,
        readingTimeMinutes: articles.readingTimeMinutes,
        publishedAt: articles.publishedAt,
      })
      .from(bookmarks)
      .innerJoin(articles, eq(bookmarks.articleId, articles.id))
      .where(eq(bookmarks.userId, userId))
      .orderBy(desc(bookmarks.createdAt))
      .limit(20);
  } catch (err) {
    console.error("[getUserBookmarks]", err);
    return [];
  }
}

// ─────────────────────────────────────────────
// GET USER READING HISTORY FROM DB
// ─────────────────────────────────────────────
export async function getUserReadingHistory(userId: string) {
  if (!userId) return [];
  try {
    return await db
      .select({
        id: readingHistory.id,
        readAt: readingHistory.readAt,
        readingProgress: readingHistory.readingProgress,
        title: articles.title,
        slug: articles.slug,
        heroImage: articles.heroImage,
      })
      .from(readingHistory)
      .innerJoin(articles, eq(readingHistory.articleId, articles.id))
      .where(eq(readingHistory.userId, userId))
      .orderBy(desc(readingHistory.readAt))
      .limit(20);
  } catch (err) {
    console.error("[getUserReadingHistory]", err);
    return [];
  }
}

// ─────────────────────────────────────────────
// TEAM MANAGEMENT — Super Admin only
// ─────────────────────────────────────────────

const STAFF_ROLES = [
  "super_admin", "publisher", "managing_editor",
  "editor", "author", "reviewer", "contributor",
] as const;
type StaffRole = typeof STAFF_ROLES[number];

/** Fetch all non-subscriber users (staff) */
export async function getStaffMembers() {
  const check = await checkSuperAdmin();
  if (!check.isAuthorized) {
    return [];
  }
  try {
    return await db.query.users.findMany({
      where: inArray(users.role, [...STAFF_ROLES]),
      columns: { id: true, name: true, email: true, role: true, image: true, createdAt: true, isActive: true },
      orderBy: [desc(users.createdAt)],
    });
  } catch (err) {
    console.error("[getStaffMembers]", err);
    return [];
  }
}

/**
 * Add a staff member by email + role.
 * Super Admin only.
 */
export async function assignStaffRole(email: string, role: StaffRole, displayName?: string) {
  const check = await checkSuperAdmin();
  if (!check.isAuthorized) {
    return { success: false, error: check.error };
  }
  if (!email) return { success: false, error: "Email is required." };
  const normalizedEmail = email.toLowerCase().trim();
  try {
    const existing = await db.query.users.findFirst({ where: eq(users.email, normalizedEmail) });
    if (existing) {
      await db.update(users).set({ role, updatedAt: new Date() }).where(eq(users.id, existing.id));
    } else {
      const name = displayName?.trim() ||
        normalizedEmail.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
      await db.insert(users).values({
        email: normalizedEmail,
        name,
        role,
        image: `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(normalizedEmail)}`,
      });
    }
    revalidatePath("/dashboard/team");
    return { success: true };
  } catch (err) {
    console.error("[assignStaffRole]", err);
    return { success: false, error: "Failed to assign role. Please try again." };
  }
}

/** Change role of an existing staff member (Super Admin only) */
export async function updateStaffRole(userId: string, role: StaffRole) {
  const check = await checkSuperAdmin();
  if (!check.isAuthorized) {
    return { success: false, error: check.error };
  }
  if (!userId) return { success: false, error: "User ID required." };
  try {
    await db.update(users).set({ role, updatedAt: new Date() }).where(eq(users.id, userId));
    revalidatePath("/dashboard/team");
    return { success: true };
  } catch (err) {
    console.error("[updateStaffRole]", err);
    return { success: false, error: "Failed to update role." };
  }
}

/** Revoke staff access — resets role back to subscriber (Super Admin only) */
export async function revokeStaffAccess(userId: string) {
  const check = await checkSuperAdmin();
  if (!check.isAuthorized) {
    return { success: false, error: check.error };
  }
  if (!userId) return { success: false, error: "User ID required." };
  try {
    await db.update(users).set({ role: "subscriber", updatedAt: new Date() }).where(eq(users.id, userId));
    revalidatePath("/dashboard/team");
    return { success: true };
  } catch (err) {
    console.error("[revokeStaffAccess]", err);
    return { success: false, error: "Failed to revoke access." };
  }
}
