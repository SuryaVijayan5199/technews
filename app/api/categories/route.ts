import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { getMemoryCache, setMemoryCache } from "@/lib/cache/cached-queries";

import { STATIC_FALLBACK_CATEGORIES } from "@/lib/constants";

export async function GET() {
  try {
    const cacheKey = "api-categories-list";
    const cached = getMemoryCache<any[]>(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    let activeCategories: any[] = [];
    try {
      activeCategories = await db.query.categories.findMany({
        where: eq(categories.isActive, true),
        orderBy: [asc(categories.sortOrder), asc(categories.name)],
      });
    } catch (dbErr) {
      console.warn("[GET /api/categories] DB query failed, using static fallback categories:", dbErr);
    }

    if (!activeCategories || activeCategories.length === 0) {
      activeCategories = Object.values(STATIC_FALLBACK_CATEGORIES);
    }

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

    setMemoryCache(cacheKey, formatted, 60 * 60 * 1000); // 1-hour server RAM cache

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("[GET /api/categories]", error);
    const fallbackList = Object.values(STATIC_FALLBACK_CATEGORIES).map((cat: any) => ({
      id: cat.id,
      label: cat.name,
      name: cat.name,
      slug: cat.slug,
      href: `/${cat.slug}`,
      icon: cat.icon || "Newspaper",
      color: cat.color || "#2D7FF9",
      description: cat.description || `${cat.name} news and updates`,
    }));
    return NextResponse.json(fallbackList);
  }
}

