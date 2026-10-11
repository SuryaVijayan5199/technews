import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Tag } from "lucide-react";
import { ArticleCard } from "@/components/article/article-card";
import { db } from "@/lib/db";
import { tags, articleTags, articles, authors, categories } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";

import { getMemoryCache, setMemoryCache } from "@/lib/cache/cached-queries";

export const revalidate = 86400; // 24 hours ISR — statically cached at Vercel Edge CDN
export const dynamicParams = true;

export function generateStaticParams() {
  return [
    { slug: "gpt-5" },
    { slug: "iphone-17" },
    { slug: "rtx-5090" },
    { slug: "pixel-10" },
    { slug: "eu-ai-act" },
    { slug: "kubernetes" },
    { slug: "matter-2" },
    { slug: "dlss-5" },
    { slug: "claude-4" },
    { slug: "steam-deck-2" },
    { slug: "windows-12" },
    { slug: "starlink-gen4" },
  ];
}

interface TagPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tagName = slug.toUpperCase().replace(/-/g, " ");
  return {
    title: `${tagName} News & Stories — TechCrest`,
    description: `Browse all news, reviews, and analysis tagged with ${tagName} on TechCrest.`,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params;
  const tagName = slug.replace(/-/g, " ").toUpperCase();

  const cacheKey = `tag-articles-${slug}`;
  let taggedArticles = getMemoryCache<any[]>(cacheKey) || [];

  if (taggedArticles.length === 0) {
    let tag = null;
    try {
      tag = await db.query.tags.findFirst({ where: eq(tags.slug, slug) });
    } catch (error) {
      console.warn("Tags query error:", error);
    }

    if (!tag) {
      notFound();
    }

    try {
      taggedArticles = await db
        .select({
          id: articles.id,
          title: articles.title,
          slug: articles.slug,
          excerpt: articles.excerpt,
          heroImage: articles.heroImage,
          publishedAt: articles.publishedAt,
          readingTimeMinutes: articles.readingTimeMinutes,
          viewCount: articles.viewCount,
          categoryName: categories.name,
          categorySlug: categories.slug,
          authorName: authors.displayName,
        })
        .from(articles)
        .innerJoin(articleTags, eq(articles.id, articleTags.articleId))
        .leftJoin(categories, eq(articles.categoryId, categories.id))
        .leftJoin(authors, eq(articles.authorId, authors.id))
        .where(and(eq(articleTags.tagId, tag.id), eq(articles.status, "published")))
        .orderBy(desc(articles.publishedAt))
        .limit(30);

      setMemoryCache(cacheKey, taggedArticles, 2 * 60 * 60 * 1000);
    } catch (error) {
      console.error("Tag articles query error:", error);
    }
  }

  return (
    <div className="container py-10">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mb-6">
        <Link href="/" className="hover:text-[var(--color-text-secondary)]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[var(--color-text-secondary)]">Tags</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[var(--color-text-secondary)]">#{slug}</span>
      </nav>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-[var(--color-brand-500)]/15 border border-[var(--color-brand-500)]/30 text-[var(--color-brand-400)] flex items-center justify-center">
          <Tag className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
            #{tagName}
          </h1>
          <p className="text-xs text-[var(--color-text-muted)]">Showing articles tagged with #{slug}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {taggedArticles.length > 0 ? (
          taggedArticles.map((article) => (
            <ArticleCard key={article.id} article={article as any} />
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-[var(--color-text-muted)]">
            No articles found for this tag.
          </div>
        )}
      </div>
    </div>
  );
}
