import { ArticleCard, type ArticleCardData } from "@/components/article/article-card";
import { cleanAuthorName } from "@/lib/utils";

type Article = {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  heroImage?: string | null;
  publishedAt?: Date | null;
  readingTimeMinutes?: number | null;
  viewCount?: number;
  commentCount?: number;
  category?: { name: string; slug: string } | null;
  author?: { displayName: string } | null;
};

function toCardData(a: Article): ArticleCardData {
  return {
    id: a.id,
    title: a.title,
    slug: a.slug,
    excerpt: a.excerpt ?? undefined,
    heroImage: a.heroImage ?? undefined,
    publishedAt: a.publishedAt ?? undefined,
    readingTimeMinutes: a.readingTimeMinutes ?? undefined,
    viewCount: a.viewCount ?? 0,
    commentCount: a.commentCount ?? 0,
    categorySlug: a.category?.slug ?? "news",
    categoryName: a.category?.name ?? "News",
    authorName: cleanAuthorName(a.author?.displayName),
  };
}

export function LatestArticles({ articles }: { articles: Article[] }) {
  if (!articles || articles.length === 0) {
    return (
      <div className="latest-articles-grid">
        <p className="col-span-full text-center text-[var(--color-text-muted)] py-12">
          No articles published yet. Publish your first article from the{" "}
          <a href="/dashboard/articles/new" className="text-[var(--color-brand-400)] underline">
            dashboard
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="latest-articles-grid">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={toCardData(article)} />
      ))}
    </div>
  );
}
