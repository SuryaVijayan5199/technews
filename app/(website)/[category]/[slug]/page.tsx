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
import { getArticleBySlug, getRelatedArticles } from "@/lib/actions/article.actions";

interface ArticlePageProps {
  params: Promise<{ category: string; slug: string }>;
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
    const text = rawText.replace(/<[^>]+>/g, "").trim();
    if (text) {
      headings.push({ id, text, level: 2 });
    }
  }
  return headings;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const dbArticle = await getArticleBySlug(slug);
  if (!dbArticle) return {};

  const seoTitle = dbArticle.seoTitle || dbArticle.title;
  const metaDescription = dbArticle.seoDescription || dbArticle.excerpt || "";
  const canonicalUrl = dbArticle.canonicalUrl || `https://technews-lyart.vercel.app/${category}/${dbArticle.slug}`;

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
  const relatedDbArticles = await getRelatedArticles(articleId, categorySlug, 3);
  if (relatedDbArticles.length === 0) return null;

  const relatedArticles = relatedDbArticles.map((a) => ({
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
    <section className="article-related mt-12 pt-8 border-t border-[var(--color-surface-border)]" aria-label="Related articles">
      <h2 className="article-related__title text-lg sm:text-xl font-bold mb-6">
        Related Articles
      </h2>
      <div className="article-related__grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {relatedArticles.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>
    </section>
  );
}

function RelatedArticlesSkeleton() {
  return (
    <div className="mt-12 pt-8 border-t border-[var(--color-surface-border)] animate-pulse">
      <div className="h-6 w-40 bg-[var(--color-surface-2)] rounded mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-44 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-surface-border)]" />
        ))}
      </div>
    </div>
  );
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { category, slug } = await params;
  const dbArticle = await getArticleBySlug(slug);

  if (!dbArticle || dbArticle.status !== "published") {
    notFound();
  }

  const authorUser = dbArticle.author?.user;
  const authorBio =
    dbArticle.author?.bio ||
    authorUser?.bio ||
    `Editor & Staff Writer at TechCrest covering ${dbArticle.category?.name || "technology"}.`;

  const categoryName = dbArticle.category?.name || category.toUpperCase();
  const categorySlug = dbArticle.category?.slug || category;
  const canonicalUrl = dbArticle.canonicalUrl || `https://technews-lyart.vercel.app/${categorySlug}/${dbArticle.slug}`;

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

      <article className="article-page py-6 md:py-10">
        <div className="container">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="breadcrumb mb-6">
            <Link href="/" className="breadcrumb__link">
              Home
            </Link>
            <ChevronRight className="breadcrumb__separator w-3.5 h-3.5" />
            <Link href={`/${categorySlug}`} className="breadcrumb__link capitalize">
              {categoryName}
            </Link>
            <ChevronRight className="breadcrumb__separator w-3.5 h-3.5" />
            <span className="breadcrumb__current breadcrumb__current--truncate max-w-[200px] sm:max-w-xs md:max-w-md">
              {dbArticle.title}
            </span>
          </nav>

          <div className="article-layout">
            {/* Main Article Container */}
            <div className="article-layout__main">
              <header className="article-header mb-6">
                {/* 1. Headline */}
                <h1 className="article-header__title text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-4 leading-tight">
                  {dbArticle.title}
                </h1>

                {/* 2. Category Badge */}
                <div className="article-header__badge-wrap mb-4 flex items-center gap-2">
                  <Link href={`/${categorySlug}`}>
                    <span className="badge badge-news uppercase text-xs font-bold px-2.5 py-1 rounded bg-[#2D7FF9]/15 text-[#2D7FF9] border border-[#2D7FF9]/30 hover:bg-[#2D7FF9] hover:text-white transition-all">
                      {categoryName}
                    </span>
                  </Link>

                  {/* Editorial Status */}
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    STATUS: {dbArticle.status.toUpperCase()}
                  </span>
                </div>

                {dbArticle.excerpt && (
                  <p className="article-header__excerpt text-base sm:text-lg text-muted-foreground leading-relaxed mb-6">
                    {dbArticle.excerpt}
                  </p>
                )}

                {/* 3. Author & 4. Publish Date */}
                <div className="article-meta flex flex-wrap items-center justify-between gap-4 py-4 border-y border-[var(--color-surface-border)]">
                  <div className="article-meta__author flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2D7FF9] to-[#165bb8] text-white font-extrabold flex items-center justify-center border border-white/20 shadow-sm text-sm shrink-0">
                      {getAuthorInitials(dbArticle.author?.displayName)}
                    </div>
                    <div>
                      <p className="article-meta__author-name font-semibold text-sm">
                        {cleanAuthorName(dbArticle.author?.displayName)}
                      </p>
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
                  </div>

                  <div className="article-meta__stats flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="article-meta__stat-item flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#2D7FF9]" />
                      {dbArticle.readingTimeMinutes || 5} min read
                    </span>
                    <span className="article-meta__stat-item flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-[#2D7FF9]" />
                      {(dbArticle.viewCount || 0).toLocaleString()} views
                    </span>
                  </div>

                  <ShareButtons title={dbArticle.title} />
                </div>
              </header>

              {/* Cover Image Positioned Immediately Below Heading & Header */}
              {dbArticle.heroImage && (
                <figure className="article-hero-figure my-6 p-3 rounded-xl bg-[var(--color-surface-1)] border border-[var(--color-surface-border)] shadow-sm">
                  <div className="article-hero-figure__image-wrap overflow-hidden rounded-lg">
                    <img
                      src={dbArticle.heroImage}
                      alt={dbArticle.heroImageAlt || dbArticle.title}
                      className="article-hero-figure__image w-full h-auto max-h-[500px] object-cover"
                    />
                  </div>
                  {(dbArticle.heroImageAlt || dbArticle.heroImageCaption) && (
                    <figcaption className="article-hero-figure__caption text-xs text-muted-foreground mt-2.5 px-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      {dbArticle.heroImageAlt && (
                        <span><strong>Alt:</strong> {dbArticle.heroImageAlt}</span>
                      )}
                      {dbArticle.heroImageCaption && (
                        <span className="text-right italic"><strong>Credit:</strong> {dbArticle.heroImageCaption}</span>
                      )}
                    </figcaption>
                  )}
                </figure>
              )}

              {/* 5. Article Content */}
              <div
                className="prose dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed mb-8"
                dangerouslySetInnerHTML={{ __html: dbArticle.contentHtml || "" }}
              />

              {/* Sources & Citations */}
              <div className="article-sources p-4 rounded-xl bg-[var(--color-surface-1)] border border-[var(--color-surface-border)] my-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Sources &amp; References
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Information sourced directly from primary technical filings, official corporate press briefings, independent benchmarks, and Verified TechCrest Research.
                </p>
                <div className="mt-2 text-[11px] text-[#2D7FF9] truncate font-mono">
                  Canonical Reference: {canonicalUrl}
                </div>
              </div>

              {/* Author Bio Box */}
              <div className="article-author-bio card p-4 sm:p-6 mt-8 rounded-xl bg-[var(--color-surface-1)] border border-[var(--color-surface-border)]">
                <div className="article-author-bio__inner flex items-center gap-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#2D7FF9] to-[#165bb8] text-white font-extrabold flex items-center justify-center border border-white/20 shadow-md text-xl shrink-0">
                    {getAuthorInitials(dbArticle.author?.displayName)}
                  </div>
                  <div>
                    <span className="article-author-bio__name block font-bold text-sm sm:text-base">
                      {cleanAuthorName(dbArticle.author?.displayName)}
                    </span>
                    <p className="article-author-bio__text text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
                      {authorBio}
                    </p>
                  </div>
                </div>
              </div>

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
              <aside className="article-layout__sidebar hidden lg:block">
                <TableOfContents headings={headings} />
              </aside>
            )}
          </div>
        </div>
      </article>
    </>
  );
}