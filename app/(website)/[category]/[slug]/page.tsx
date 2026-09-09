import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Clock, Eye, MessageCircle, ChevronRight } from "lucide-react";
import { formatDate, cleanAuthorName, getAuthorInitials } from "@/lib/utils";
import { ArticleCard } from "@/components/article/article-card";
import { ReadingProgress } from "@/components/article/reading-progress";
import { TableOfContents } from "@/components/article/table-of-contents";
import { ShareButtons } from "@/components/article/share-buttons";
import { BookmarkButton } from "@/components/shared/bookmark-button";
import {
  getCachedArticleBySlug,
  getCachedRelatedArticles,
  getCachedArticleComments,
} from "@/lib/cache/cached-queries";
import { CommentsSection } from "@/components/article/comments-section";
import { auth } from "@/lib/auth";
import { isStaff } from "@/lib/permissions";
import { siteConfig } from "@/config/site";

// Force dynamic rendering: articles are served from in-memory RAM cache on-demand.
// This eliminates ISR Writes and Fast Origin Transfer from static page pre-generation.
export const dynamic = "force-dynamic";

interface ArticlePageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateStaticParams() {
  return [];
}

function extractHeadings(html: string) {
  const headingRegex = /<h2[^>]*id="([^"]+)"[^>]*>(.*?)<\/h2>|<h2[^>]*>(.*?)<\/h2>/gi;
  const headings: { id: string; text: string; level: number }[] = [];
  let match;
  let index = 0;
  while ((match = headingRegex.exec(html)) !== null) {
    index++;
    const id = match[1] || `heading-${index}`;
    const rawText = match[2] || match[3] || "";
    const text = rawText
      .replace(/<[^>]+>/g, "")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, " ")
      .trim();
    if (text) {
      headings.push({ id, text, level: 2 });
    }
  }

  // Fallback: If no h2 tags exist, generate structured content headings
  if (headings.length === 0 && html) {
    headings.push(
      { id: "overview-section", text: "Overview & Key Developments", level: 2 },
      { id: "analysis-section", text: "Technical Deep-Dive & Market Impact", level: 2 },
      { id: "outlook-section", text: "Strategic Summary & Next Steps", level: 2 }
    );
  }

  return headings;
}

function injectHeadingIds(html: string): string {
  let counter = 0;
  return html.replace(/<h2((?![^>]*\bid=)[^>]*)>/gi, () => {
    counter++;
    return `<h2 id="heading-${counter}">`;
  });
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const dbArticle = await getCachedArticleBySlug(slug);
  if (!dbArticle) return {};

  const seoTitle = dbArticle.seoTitle || dbArticle.title;
  const metaDescription = dbArticle.seoDescription || dbArticle.excerpt || "";
  const canonicalUrl = dbArticle.canonicalUrl || `${siteConfig.url}/${category}/${dbArticle.slug}`;

  return {
    title: `${seoTitle} — TechCrest`,
    description: metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: seoTitle,
      description: metaDescription,
      type: "article",
      url: canonicalUrl,
      publishedTime: dbArticle.publishedAt
        ? new Date(dbArticle.publishedAt).toISOString()
        : undefined,
      authors: [dbArticle.author?.displayName || "TechCrest Editor"],
      images: dbArticle.heroImage ? [{ url: dbArticle.heroImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: metaDescription,
      images: dbArticle.heroImage ? [dbArticle.heroImage] : [],
    },
  };
}

async function RelatedArticlesSection({
  articleId,
  categorySlug,
}: {
  articleId: number;
  categorySlug: string;
}) {
  const relatedDbArticles = await getCachedRelatedArticles(articleId, categorySlug, 3);
  if (relatedDbArticles.length === 0) return null;

  const relatedArticles = relatedDbArticles.map((a: any) => ({
    id: a.id,
    title: a.title,
    slug: a.slug,
    heroImage:
      a.heroImage ||
      "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=250&fit=crop&q=80",
    publishedAt: a.publishedAt
      ? new Date(a.publishedAt).toISOString()
      : new Date().toISOString(),
    readingTimeMinutes: a.readingTimeMinutes || 5,
    categorySlug: a.category?.slug || "news",
    categoryName: a.category?.name || "NEWS",
    authorName: a.author?.displayName || "Editor",
  }));

  return (
    <section className="article-related tc-article-related mt-12 pt-8" aria-label="Related articles">
      <h2 className="article-related__title tc-article-related__title mb-6">
        Related Articles
      </h2>
      <div className="article-related__grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {relatedArticles.map((a: any) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>
    </section>
  );
}

function RelatedArticlesSkeleton() {
  return (
    <div className="mt-12 pt-8 tc-article-related tc-skeleton-pulse">
      <div className="tc-skel-line mb-6" style={{ width: "160px" }} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="tc-skel-card-img" />
        ))}
      </div>
    </div>
  );
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { category, slug } = await params;
  const dbArticle = await getCachedArticleBySlug(slug);

  const session = await auth();
  const userIsStaff = isStaff(session?.user?.role);

  if (!dbArticle) notFound();
  if (dbArticle.status !== "published" && !userIsStaff) notFound();

  const initialComments = await getCachedArticleComments(dbArticle.id);

  const authorUser = dbArticle.author?.user;
  const authorBio =
    dbArticle.author?.bio ||
    authorUser?.bio ||
    `Editor & Staff Writer at TechCrest covering ${dbArticle.category?.name || "technology"}.`;

  const categoryName = dbArticle.category?.name || category.toUpperCase();
  const categorySlug = dbArticle.category?.slug || category;
  const canonicalUrl = dbArticle.canonicalUrl || `${siteConfig.url}/${categorySlug}/${dbArticle.slug}`;

  const headings = extractHeadings(dbArticle.contentHtml || "");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: dbArticle.title,
    description: dbArticle.seoDescription || dbArticle.excerpt,
    image: dbArticle.heroImage,
    url: canonicalUrl,
    datePublished: dbArticle.publishedAt
      ? new Date(dbArticle.publishedAt).toISOString()
      : undefined,
    dateModified: new Date(dbArticle.updatedAt).toISOString(),
    author: {
      "@type": "Person",
      name: dbArticle.author?.displayName || "TechCrest Editor",
    },
    publisher: {
      "@type": "Organization",
      name: "TechCrest",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <link rel="canonical" href={canonicalUrl} />
      <ReadingProgress />

      <article className="article-page tc-article-page-padding">
        <div className="container">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="breadcrumb mb-6">
            <Link href="/" className="breadcrumb__link">
              Home
            </Link>
            <ChevronRight className="breadcrumb__separator tc-icon-xs" />
            <Link href={`/${categorySlug}`} className="breadcrumb__link capitalize">
              {categoryName}
            </Link>
            <ChevronRight className="breadcrumb__separator tc-icon-xs" />
            <span className="breadcrumb__current breadcrumb__current--truncate tc-breadcrumb-current">
              {dbArticle.title}
            </span>
          </nav>

          <div className="article-layout">
            {/* Main Article Container */}
            <div className="article-layout__main">
              <header className="article-header mb-6">
                {/* 1. Headline */}
                <h1 className="article-header__title mb-4">
                  {dbArticle.title}
                </h1>

                {/* 2. Category Badge */}
                <div className="article-header__badge-wrap mb-4 flex items-center gap-2">
                  <Link href={`/${categorySlug}`}>
                    <span className="badge badge-news tc-badge-brand">
                      {categoryName}
                    </span>
                  </Link>

                  {/* Editorial Status */}
                  <span className="tc-badge-green">
                    STATUS: {dbArticle.status.toUpperCase()}
                  </span>
                </div>

                {dbArticle.excerpt && (
                  <p className="article-header__excerpt text-base sm:text-lg text-muted-foreground leading-relaxed mb-6">
                    {dbArticle.excerpt}
                  </p>
                )}

                {/* 3. Author & 4. Publish Date (Clean text only, no avatar icons) */}
                <div className="article-meta flex flex-wrap items-center justify-between gap-4 py-4 tc-article-meta-row">
                  <div className="article-meta__author">
                    <div className="article-meta__author-name font-semibold text-sm">
                      {dbArticle.author?.slug ? (
                        <Link href={`/authors/${dbArticle.author.slug}`} className="hover:underline">
                          {cleanAuthorName(dbArticle.author?.displayName)}
                        </Link>
                      ) : (
                        <span>{cleanAuthorName(dbArticle.author?.displayName)}</span>
                      )}
                    </div>
                    <p className="article-meta__author-date text-xs text-muted-foreground">
                      {dbArticle.publishedAt
                        ? formatDate(dbArticle.publishedAt, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Published recently"}
                    </p>
                  </div>

                  <div className="article-meta__stats flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="article-meta__stat-item flex items-center gap-1.5">
                      <Clock className="tc-icon-xs tc-icon-brand" />
                      {dbArticle.readingTimeMinutes || 5} min read
                    </span>
                    <span className="article-meta__stat-item flex items-center gap-1.5">
                      <Eye className="tc-icon-xs tc-icon-brand" />
                      {(dbArticle.viewCount || 0).toLocaleString()} views
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <BookmarkButton
                      variant="pill"
                      article={{
                        id: dbArticle.id,
                        title: dbArticle.title,
                        slug: dbArticle.slug,
                        categorySlug,
                        categoryName,
                        heroImage: dbArticle.heroImage ?? undefined,
                        readingTimeMinutes: dbArticle.readingTimeMinutes ?? undefined,
                      }}
                    />
                    <ShareButtons title={dbArticle.title} />
                  </div>
                </div>
              </header>

              {/* Cover Image Positioned Immediately Below Heading & Header */}
              {dbArticle.heroImage && (
                <figure className="article-hero-figure tc-article-figure">
                  <div className="article-hero-figure__image-wrap overflow-hidden rounded-lg">
                    <img
                      src={dbArticle.heroImage}
                      alt={dbArticle.heroImageAlt || dbArticle.title}
                      className="article-hero-figure__image tc-article-hero-img"
                    />
                  </div>
                  {(dbArticle.heroImageAlt || dbArticle.heroImageCaption) && (
                    <figcaption className="article-hero-figure__caption text-muted-foreground tc-article-caption block mt-2 text-xs">
                      <p className="m-0 p-0 leading-normal">
                        {dbArticle.heroImageAlt}
                        {dbArticle.heroImageAlt && dbArticle.heroImageCaption && " — "}
                        {dbArticle.heroImageCaption && (
                          <span className="tc-caption-source font-semibold">Credit: {dbArticle.heroImageCaption}</span>
                        )}
                      </p>
                    </figcaption>
                  )}
                </figure>
              )}
              {/* Mobile Table of Contents */}
              {headings.length > 0 && (
                <div className="article-layout__mobile-toc">
                  <TableOfContents headings={headings} />
                </div>
              )}

              <div
                className="prose dark:prose-invert tc-article-body"
                dangerouslySetInnerHTML={{ __html: injectHeadingIds(dbArticle.contentHtml || "") }}
              />

              {/* Author Bio Box (Clean text only, no avatar initials) */}
              <div className="article-author-bio card p-4 sm:p-6 mt-8 rounded-xl bg-[var(--color-surface-1)] border">
                <div>
                  <span className="article-author-bio__name block font-bold text-sm sm:text-base">
                    {cleanAuthorName(dbArticle.author?.displayName)}
                  </span>
                  <p className="article-author-bio__text text-muted-foreground tc-author-bio-text mt-1">
                    {authorBio}
                  </p>
                </div>
              </div>

              {/* Reader Discussion / Comments Section */}
              <CommentsSection
                articleId={dbArticle.id}
                articleSlug={dbArticle.slug}
                categorySlug={categorySlug}
                initialComments={initialComments}
              />

              {/* Related Articles — Streamed asynchronously with React Suspense */}
              <Suspense fallback={<RelatedArticlesSkeleton />}>
                <RelatedArticlesSection
                  articleId={dbArticle.id}
                  categorySlug={categorySlug}
                />
              </Suspense>
            </div>

            {/* Sidebar Table of Contents */}
            {headings.length > 0 && (
              <aside className="article-layout__sidebar">
                <TableOfContents headings={headings} />
              </aside>
            )}
          </div>
        </div>
      </article>
    </>
  );
}