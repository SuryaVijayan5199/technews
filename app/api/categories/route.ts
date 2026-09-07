import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";

export async function GET() {
  try {
    const activeCategories = await db.query.categories.findMany({
      where: eq(categories.isActive, true),
      orderBy: [asc(categories.sortOrder), asc(categories.name)],
    });

    const formatted = activeCategories.map((cat: any) => ({
      id: cat.id,
      label: cat.name,
      name: cat.name,
      slug: cat.slug,
      href: `/${cat.slug}`,
      icon: cat.icon || "Newspaper",
      color: cat.color || "#2D7FF9",
      description: cat.description || `${cat.name} news and updates`,
    }));

    return NextResponse.json(formatted, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("[GET /api/categories]", error);
    return NextResponse.json([], { status: 500 });
  }
}
