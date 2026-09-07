import { db } from "@/lib/db";
import { categories, articles, authors } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://technews-lyart.vercel.app";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "hourly", priority: 1.0 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  try {
    // Dynamic category routes
    const activeCats = await db.query.categories.findMany({ where: eq(categories.isActive, true) });
    const categoryRoutes: MetadataRoute.Sitemap = activeCats.map((cat: any) => ({
      url: `${BASE_URL}/${cat.slug}`,
      lastModified: cat.updatedAt || new Date(),
      changeFrequency: "hourly" as const,
      priority: 0.8,
    }));

    // Dynamic article routes
    const publishedArticles = await db.query.articles.findMany({
      where: eq(articles.status, "published"),
      with: { category: true },
      columns: { slug: true, publishedAt: true, updatedAt: true, categoryId: true },
    });
    const articleRoutes: MetadataRoute.Sitemap = publishedArticles
      .filter((a: any) => a.category?.slug)
      .map((a: any) => ({
        url: `${BASE_URL}/${a.category!.slug}/${a.slug}`,
        lastModified: a.updatedAt || a.publishedAt || new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));

    // Author routes
    const allAuthors = await db.query.authors.findMany({
      columns: { slug: true, updatedAt: true },
    });
    const authorRoutes: MetadataRoute.Sitemap = allAuthors.map((a: any) => ({
      url: `${BASE_URL}/authors/${a.slug}`,
      lastModified: a.updatedAt || new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }));

    return [...staticRoutes, ...categoryRoutes, ...articleRoutes, ...authorRoutes];
  } catch (error) {
    console.error("Error generating dynamic sitemap:", error);
    return staticRoutes;
  }
}
