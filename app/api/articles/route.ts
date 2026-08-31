import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const limit = parseInt(searchParams.get("limit") ?? "10", 10);

  // In production: fetch from Drizzle DB using `db.select().from(articles)`
  const articles = [
    {
      id: 1,
      title: "OpenAI's GPT-5 Changes Everything",
      slug: "openai-gpt5-deep-dive-next-frontier-ai",
      categorySlug: category ?? "ai",
      publishedAt: new Date(),
    },
  ];

  return NextResponse.json({
    success: true,
    data: articles.slice(0, limit),
  });
}
