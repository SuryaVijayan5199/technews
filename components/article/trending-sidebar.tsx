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
  className,
  title = "Trending Stories",
  limit = 8,
}: {
  articles: TrendingArticle[];
  currentArticleId?: number;
  className?: string;
  title?: string;
  limit?: number;
}) {
  const filtered = currentArticleId
    ? articles.filter((a) => a.id !== currentArticleId)
    : articles;

  if (!filtered || filtered.length === 0) return null;

  return (
    <aside className={className || "article-layout__sidebar"} aria-label="Trending News">
      <div className="tc-most-read tc-sidebar-sticky">
        <div className="tc-trending-sidebar-header pb-3 mb-3 border-b border-white/10 flex items-center justify-between">
          <h3 className="m-0 text-base font-bold tracking-tight text-white flex items-center gap-2">
            <span className="w-1 h-4 bg-[#2D7FF9] rounded-sm inline-block" />
            {title}
          </h3>
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#60a5fa] px-2 py-0.5 rounded-full bg-[#2D7FF9]/15 border border-[#2D7FF9]/30">
            Top {Math.min(limit, filtered.length)}
          </span>
        </div>

        {filtered.slice(0, limit).map((article, idx) => {
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
