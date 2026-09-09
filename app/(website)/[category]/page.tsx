import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getCachedArticlesByCategoryPaginated } from "@/lib/cache/cached-queries";
import { getAllCategories } from "@/lib/actions/article.actions";
import { cleanAuthorName } from "@/lib/utils";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateStaticParams() {
  try {
    const cats = await getAllCategories();
    return cats.map((c) => ({ category: c.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params, searchParams }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const { page: pageStr } = await searchParams;
  const rawPage = parseInt(pageStr || "1", 10);
  const page = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;

  const { category: cat } = await getCachedArticlesByCategoryPaginated(category, page, 7);
  if (!cat) return { title: "Category Not Found" };

  const pageSuffix = page > 1 ? ` (Page ${page})` : "";
  return {
    title: `${cat.name}${pageSuffix} — TechCrest`,
    description: cat.description ?? `Latest ${cat.name} news, reviews and insights on TechCrest.`,
  };
}

function timeAgo(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category: slug } = await params;
  const { page: pageStr } = await searchParams;
  const rawPage = parseInt(pageStr || "1", 10);
  const page = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;

  const PAGE_SIZE = 7;
  const { category, articles, totalArticles, totalPages, currentPage } =
    await getCachedArticlesByCategoryPaginated(slug, page, PAGE_SIZE);

  if (!category) notFound();

  const isFirstPage = currentPage === 1;
  const lead = isFirstPage && articles.length > 0 ? articles[0] : null;
  const gridArticles = isFirstPage ? articles.slice(1) : articles;
  const themeColor = category.color ?? "#2D7FF9";

  return (
    <div className="cat-page">
      <div className="cat-header" style={{ borderColor: themeColor }}>
        <div className="tc-wrap">
          <div className="cat-header__inner">
            <span className="tc-eyebrow" style={{ color: themeColor }}>
              TechCrest / {category.name}
            </span>
            <h1 className="cat-header__title">{category.name}</h1>
            {category.description && (
              <p className="cat-header__desc">{category.description}</p>
            )}
          </div>
        </div>
      </div>

      <div className="tc-wrap cat-body">
        {articles.length === 0 && (
          <div className="cat-empty">
            <div className="cat-empty__icon">&#128240;</div>
            <h2>No articles yet in {category.name}</h2>
            <p>Our editors are working on it. Check back soon.</p>
            <Link href="/" className="cat-empty__link">Back to Homepage</Link>
          </div>
        )}

        {lead && (
          <article className="cat-lead">
            <Link href={`/${lead.category?.slug ?? slug}/${lead.slug}`} className="cat-lead__art-wrap">
              <div className="cat-lead__art">
                {lead.heroImage && (
                  <Image src={lead.heroImage} alt={lead.title} fill className="cat-lead__img" priority />
                )}
              </div>
            </Link>
            <div className="cat-lead__body">
              <span className="tc-tag" style={{ color: themeColor }}>
                {lead.category?.name ?? category.name} &bull; FEATURED
              </span>
              <h2>
                <Link href={`/${lead.category?.slug ?? slug}/${lead.slug}`}>{lead.title}</Link>
              </h2>
              {lead.excerpt && <p className="cat-lead__excerpt">{lead.excerpt}</p>}
              <div className="cat-lead__meta">
                {lead.author?.displayName && <span>{cleanAuthorName(lead.author.displayName)}</span>}
                <span>{timeAgo(lead.publishedAt)}</span>
                <span>{lead.readingTimeMinutes ?? 5} min read</span>
                {(lead.viewCount ?? 0) > 0 && <span>{(lead.viewCount ?? 0).toLocaleString()} views</span>}
              </div>
            </div>
          </article>
        )}

        {gridArticles.length > 0 && (
          <div className="cat-grid">
            {gridArticles.map((article: any) => (
              <article key={article.id} className="cat-card">
                <Link href={`/${article.category?.slug ?? slug}/${article.slug}`} className="cat-card__art-wrap">
                  <div className="cat-card__art">
                    {article.heroImage ? (
                      <Image src={article.heroImage} alt={article.title} fill className="cat-card__img" />
                    ) : null}
                  </div>
                </Link>
                <div className="cat-card__body">
                  <span className="tc-tag" style={{ color: themeColor }}>
                    {article.category?.name ?? category.name}
                  </span>
                  <h3>
                    <Link href={`/${article.category?.slug ?? slug}/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h3>
                  {article.excerpt && <p className="cat-card__excerpt">{article.excerpt}</p>}
                  <div className="cat-card__meta">
                    <span>{timeAgo(article.publishedAt)}</span>
                    <span>{article.readingTimeMinutes ?? 5} min read</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* PAGINATION CONTROL BAR */}
        {totalPages > 1 && (
          <div className="cat-pagination">
            <div className="cat-pagination__info">
              Page {currentPage} of {totalPages} &bull; {totalArticles} Articles in {category.name}
            </div>
            <div className="cat-pagination__controls">
              {/* Previous Button */}
              {currentPage > 1 ? (
                <Link
                  href={`/${slug}?page=${currentPage - 1}`}
                  className="cat-pagination__btn"
                >
                  &larr; Previous
                </Link>
              ) : (
                <span className="cat-pagination__btn is-disabled">&larr; Previous</span>
              )}

              {/* Page Number Pills */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) =>
                p === currentPage ? (
                  <span
                    key={p}
                    className="cat-pagination__num is-active"
                    style={{ backgroundColor: themeColor, borderColor: themeColor }}
                  >
                    {p}
                  </span>
                ) : (
                  <Link
                    key={p}
                    href={`/${slug}?page=${p}`}
                    className="cat-pagination__num"
                  >
                    {p}
                  </Link>
                )
              )}

              {/* Next Button */}
              {currentPage < totalPages ? (
                <Link
                  href={`/${slug}?page=${currentPage + 1}`}
                  className="cat-pagination__btn"
                >
                  Next &rarr;
                </Link>
              ) : (
                <span className="cat-pagination__btn is-disabled">Next &rarr;</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}