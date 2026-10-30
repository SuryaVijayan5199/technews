import { NextResponse } from "next/server";
import { incrementArticleViewCount } from "@/lib/actions/article.actions";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const articleId = Number(body?.id);
    if (!articleId || isNaN(articleId)) {
      return NextResponse.json({ ok: false, error: "Invalid article ID" }, { status: 400 });
    }

    // Increment view count asynchronously (handles bot filtering and 60-second rate limiting)
    await incrementArticleViewCount(articleId);

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Failed to record view" },
      { status: 500 }
    );
  }
}
