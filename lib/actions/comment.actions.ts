"use server";

import { db } from "@/lib/db";
import { comments, articles, users } from "@/lib/db/schema";
import { eq, and, desc, asc, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { invalidateCommentCache } from "@/lib/cache/revalidate";
import { auth } from "@/lib/auth";

export interface CommentItem {
  id: number;
  articleId: number;
  authorId: string | null;
  parentId: number | null;
  content: string;
  status: string;
  guestName: string | null;
  guestEmail: string | null;
  likes: number;
  createdAt: Date;
  authorName: string;
  authorImage?: string | null;
  replies?: CommentItem[];
}

export async function getArticleComments(articleId: number): Promise<CommentItem[]> {
  try {
    const rawComments = await db
      .select({
        id: comments.id,
        articleId: comments.articleId,
        authorId: comments.authorId,
        parentId: comments.parentId,
        content: comments.content,
        status: comments.status,
        guestName: comments.guestName,
        guestEmail: comments.guestEmail,
        likes: comments.likes,
        createdAt: comments.createdAt,
        userName: users.name,
        userImage: users.image,
      })
      .from(comments)
      .leftJoin(users, eq(comments.authorId, users.id))
      .where(
        and(
          eq(comments.articleId, articleId),
          eq(comments.status, "approved")
        )
      )
      .orderBy(asc(comments.createdAt));

    const commentMap = new Map<number, CommentItem>();
    const rootComments: CommentItem[] = [];

    for (const c of rawComments) {
      const item: CommentItem = {
        id: c.id,
        articleId: c.articleId,
        authorId: c.authorId,
        parentId: c.parentId,
        content: c.content,
        status: c.status,
        guestName: c.guestName,
        guestEmail: c.guestEmail,
        likes: c.likes,
        createdAt: c.createdAt,
        authorName: c.userName || c.guestName || "Anonymous Reader",
        authorImage: c.userImage,
        replies: [],
      };
      commentMap.set(c.id, item);
    }

    for (const c of commentMap.values()) {
      if (c.parentId && commentMap.has(c.parentId)) {
        const parent = commentMap.get(c.parentId)!;
        parent.replies = parent.replies || [];
        parent.replies.push(c);
      } else {
        rootComments.push(c);
      }
    }

    return rootComments.reverse(); // Newest root comments first
  } catch (error) {
    console.error("Error fetching article comments:", error);
    return [];
  }
}

export async function postCommentAction(data: {
  articleId: number;
  content: string;
  parentId?: number | null;
  guestName?: string;
  guestEmail?: string;
  path?: string;
}) {
  try {
    if (!data.content || !data.content.trim()) {
      return { success: false, error: "Comment content cannot be empty." };
    }

    const session = await auth();
    const userId = session?.user?.id ?? null;

    let authorName = session?.user?.name ?? data.guestName ?? "Guest";
    if (!userId && (!data.guestName || !data.guestName.trim())) {
      authorName = "TechCrest Reader";
    }

    const status = userId ? "approved" : "pending";

    const [newComment] = await db
      .insert(comments)
      .values({
        articleId: data.articleId,
        authorId: userId,
        parentId: data.parentId ?? null,
        content: data.content.trim(),
        status,
        guestName: userId ? null : authorName,
        guestEmail: userId ? null : data.guestEmail ?? null,
        likes: 0,
      })
      .returning();

    // Increment article commentCount for approved comments
    if (status === "approved") {
      await db
        .update(articles)
        .set({
          commentCount: sql`${articles.commentCount} + 1`,
        })
        .where(eq(articles.id, data.articleId));
    }

    await invalidateCommentCache(data.articleId);

    return {
      success: true,
      comment: {
        ...newComment,
        authorName,
        authorImage: session?.user?.image ?? null,
        replies: [],
      },
    };
  } catch (error) {
    console.error("Error posting comment:", error);
    return { success: false, error: "Failed to post comment. Please try again." };
  }
}

export async function likeCommentAction(commentId: number) {
  try {
    await db
      .update(comments)
      .set({
        likes: sql`${comments.likes} + 1`,
      })
      .where(eq(comments.id, commentId));

    return { success: true };
  } catch (error) {
    console.error("Error liking comment:", error);
    return { success: false, error: "Failed to like comment" };
  }
}

export async function deleteCommentAction(commentId: number, path?: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "You must be logged in to delete comments." };
    }
    const comment = await db.query.comments.findFirst({
      where: eq(comments.id, commentId),
    });

    if (!comment) {
      return { success: false, error: "Comment not found" };
    }

    // First delete child replies to avoid FK constraint
    const childReplies = await db.select({ id: comments.id }).from(comments).where(eq(comments.parentId, commentId));
    const totalDeleted = 1 + childReplies.length;
    await db.delete(comments).where(eq(comments.parentId, commentId));
    await db.delete(comments).where(eq(comments.id, commentId));

    await db
      .update(articles)
      .set({
        commentCount: sql`GREATEST(0, ${articles.commentCount} - ${totalDeleted})`,
      })
      .where(eq(articles.id, comment.articleId));

    await invalidateCommentCache(comment.articleId);

    return { success: true };
  } catch (error) {
    console.error("Error deleting comment:", error);
    return { success: false, error: "Failed to delete comment" };
  }
}
