import Link from "next/link";

interface TrendingArticle {
  id: number;
  title: string;
  slug: string;
  viewCount?: number;
  category?: {
    name: string;
    slug: string;
  } | null;
}

export function TrendingSidebar({
  articles,
  currentArticleId,
}: {
  articles: TrendingArticle[];
  currentArticleId?: number;
}) {
  const filtered = currentArticleId
    ? articles.filter((a) => a.id !== currentArticleId)
    : articles;

  if (!filtered || filtered.length === 0) return null;

  return (
    <aside className="article-layout__sidebar" aria-label="Trending News">
      <div className="tc-most-read tc-sidebar-sticky">
        <div className="tc-trending-sidebar-header pb-3 mb-3 border-b border-white/10">
          <h3 className="m-0 text-base font-bold tracking-tight text-white">Trending Stories</h3>
        </div>

        {filtered.slice(0, 8).map((article, idx) => {
          const categorySlug = article.category?.slug ?? "news";
          const categoryName = article.category?.name ?? "Top Story";

          return (
            <div key={article.id} className="tc-rank">
              <span className="tc-rank__num">{String(idx + 1).padStart(2, "0")}</span>
              <div className="tc-rank__content">
                <Link href={`/${categorySlug}/${article.slug}`}>
                  <b>{article.title}</b>
                </Link>
                <div className="tc-rank__meta">
                  <small>{categoryName}</small>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
