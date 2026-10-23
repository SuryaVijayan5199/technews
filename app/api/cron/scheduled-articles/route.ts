import { NextResponse } from "next/server";
import { checkAndPublishScheduledArticles } from "@/lib/actions/article.actions";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret) {
      const authHeader = request.headers.get("authorization");
      const { searchParams } = new URL(request.url);
      const querySecret = searchParams.get("secret");

      if (authHeader !== `Bearer ${cronSecret}` && querySecret !== cronSecret) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
      }
    }

    const result = await checkAndPublishScheduledArticles();

    return NextResponse.json({
      success: result.success,
      publishedCount: result.count ?? 0,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Scheduled articles cron error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process scheduled articles" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  return GET(request);
}
