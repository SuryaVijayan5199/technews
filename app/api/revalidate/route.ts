import { NextResponse } from "next/server";
import {
  invalidateArticleCache,
  invalidateCategoryCache,
  invalidateAuthorCache,
} from "@/lib/cache/revalidate";

/**
 * Revalidation Webhook API Handler
 * 
 * Supports external triggers (e.g., CMS integrations, webhooks, deployment pipelines).
 * Authentication requires a valid `x-revalidation-secret` header or `secret` query parameter
 * matching `process.env.REVALIDATION_SECRET`.
 */
export async function POST(request: Request) {
  try {
    const secret = process.env.REVALIDATION_SECRET;
    const headerSecret = request.headers.get("x-revalidation-secret");
    const { searchParams } = new URL(request.url);
    const querySecret = searchParams.get("secret");

    if (!secret || (headerSecret !== secret && querySecret !== secret)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Invalid revalidation secret" },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { event, articleId, articleSlug, categorySlug, authorId, secondaryCategorySlugs } = body;

    if (!event) {
      return NextResponse.json(
        { success: false, error: "Bad Request: Missing event property" },
        { status: 400 }
      );
    }

    const revalidatedTags: string[] = [];

    switch (event) {
      case "article.published":
      case "article.updated":
      case "article.unpublished":
      case "article.deleted":
        if (articleId) {
          await invalidateArticleCache({
            articleId: Number(articleId),
            articleSlug,
            categorySlug,
            authorId: authorId ? Number(authorId) : undefined,
            secondaryCategorySlugs,
          });
          revalidatedTags.push(`article:${articleId}`);
          if (categorySlug) revalidatedTags.push(`category:${categorySlug}`);
          revalidatedTags.push("homepage", "latest-news");
        }
        break;

      case "category.updated":
        if (categorySlug) {
          await invalidateCategoryCache(categorySlug);
          revalidatedTags.push(`category:${categorySlug}`, "homepage");
        }
        break;

      case "author.updated":
        if (authorId) {
          await invalidateAuthorCache(Number(authorId));
          revalidatedTags.push(`author:${authorId}`);
        }
        break;

      default:
        return NextResponse.json(
          { success: false, error: `Unsupported event type: ${event}` },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      event,
      revalidated: revalidatedTags,
    });
  } catch (error) {
    console.error("Revalidation API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
