import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Clock, Eye, MessageCircle, ChevronRight } from "lucide-react";
import { formatDate, cleanAuthorName, getAuthorInitials } from "@/lib/utils";
import { ArticleCard } from "@/components/article/article-card";
import { ReadingProgress } from "@/components/article/reading-progress";
import { TrendingSidebar } from "@/components/article/trending-sidebar";
import { ShareButtons } from "@/components/article/share-buttons";
import { BookmarkButton } from "@/components/shared/bookmark-button";
import {
  getCachedArticleBySlug,
  getCachedRelatedArticles,
  getCachedArticleComments,
  getCachedTrendingArticles,
} from "@/lib/cache/cached-queries";
import { incrementArticleViewCount } from "@/lib/actions/article.actions";
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


function processArticleHtmlContent(rawHtml: string): { contentHtml: string } {
  if (!rawHtml || !rawHtml.trim()) {
    return { contentHtml: "" };
  }
  return { contentHtml: rawHtml };
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
  categoryName,
}: {
  articleId: number;
  categorySlug: string;
  categoryName: string;
}) {
  const relatedDbArticles = await getCachedRelatedArticles(articleId, categorySlug, 6);
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
    viewCount: a.viewCount || 0,
    categorySlug: a.category?.slug || categorySlug,
    categoryName: a.category?.name || categoryName,
    authorName: a.author?.displayName || "TechCrest Editorial",
  }));

  return (
    <section className="article-related tc-article-related mt-14 pt-10 border-t border-[var(--color-surface-border)]" aria-label="Related articles">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-3 h-7 rounded-full bg-gradient-to-b from-[#2D7FF9] to-[#8b5cf6]" />
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--color-text-primary)] tracking-tight m-0">
              More Stories in {categoryName}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5 m-0">
              Handpicked recommendations to keep you informed & ahead
            </p>
          </div>
        </div>
      </div>
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

  let session = null;
  try {
    session = await auth();
  } catch (err) {
    // ISR / Static rendering context — default to guest
  }
  const userIsStaff = isStaff(session?.user?.role);

  if (!dbArticle) notFound();
  if (dbArticle.status !== "published" && !userIsStaff) notFound();

  // Dynamically increment article view count in DB
  incrementArticleViewCount(dbArticle.id).catch(() => {});

  const initialComments = await getCachedArticleComments(dbArticle.id);
  const trendingArticles = await getCachedTrendingArticles(8, dbArticle.id);

  const authorUser = dbArticle.author?.user;
  const authorBio =
    dbArticle.author?.bio ||
    authorUser?.bio ||
    `Editor & Staff Writer at TechCrest covering ${dbArticle.category?.name || "technology"}.`;

  const categoryName = dbArticle.category?.name || category.toUpperCase();
  const categorySlug = dbArticle.category?.slug || category;
  const canonicalUrl = dbArticle.canonicalUrl || `${siteConfig.url}/${categorySlug}/${dbArticle.slug}`;
  const { contentHtml: processedContentHtml } = processArticleHtmlContent(dbArticle.contentHtml || "");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    headline: dbArticle.seoTitle || dbArticle.title,
    description: dbArticle.seoDescription || dbArticle.excerpt,
    image: dbArticle.heroImage ? [dbArticle.heroImage] : [`${siteConfig.url}/icons/techcrest-app-icon-gradient-512.png`],
    url: canonicalUrl,
    datePublished: dbArticle.publishedAt
      ? new Date(dbArticle.publishedAt).toISOString()
      : new Date().toISOString(),
    dateModified: new Date(dbArticle.updatedAt).toISOString(),
    articleSection: categoryName,
    wordCount: dbArticle.contentHtml ? dbArticle.contentHtml.replace(/<[^>]*>/g, "").split(/\s+/).length : undefined,
    author: {
      "@type": "Person",
      name: cleanAuthorName(dbArticle.author?.displayName),
      url: dbArticle.author?.slug ? `${siteConfig.url}/authors/${dbArticle.author.slug}` : siteConfig.url,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/icons/techcrest-app-icon-gradient-512.png`,
      },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteConfig.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: categoryName,
        item: `${siteConfig.url}/${categorySlug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: dbArticle.title,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
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

              {/* Cover Image Positioned Immediately Below Heading & Header (Half Size) */}
              {dbArticle.heroImage && (
                <figure className="article-hero-figure tc-article-figure mb-8 w-full max-w-full">
                  <div className="article-hero-figure__image-wrap overflow-hidden rounded-xl">
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
              <div
                className="prose dark:prose-invert tc-article-body"
                dangerouslySetInnerHTML={{ __html: processedContentHtml }}
              />

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
                  categoryName={categoryName}
                />
              </Suspense>
            </div>

            {/* Desktop Right Sidebar Trending News */}
            <TrendingSidebar articles={trendingArticles} currentArticleId={dbArticle.id} />
          </div>
        </div>
      </article>
    </>
  );
}