import Link from "next/link";
import Image from "next/image";
import { TrendingUp, Flame } from "lucide-react";

type Article = {
  id: number;
  title: string;
  slug: string;
  heroImage?: string | null;
  viewCount?: number;
  category?: { name: string; slug: string } | null;
};

export function TrendingSection({ articles }: { articles: Article[] }) {
  return (
    <section>
      {/* Section Header */}
      <div className="section-header mb-6">
        <div className="section-header__left">
          <TrendingUp className="tc-section-icon" />
          <h2 className="section-header__title">Trending Now</h2>
          <span className="badge badge-breaking tc-badge-flex">
            <Flame className="tc-icon-sm" /> Hot
          </span>
        </div>
      </div>

      {articles.length === 0 ? (
        <p className="text-center py-8 tc-empty-state">
          No trending articles yet.
        </p>
      ) : (
        <div className="tc-trending-grid">
          {articles.map((article, idx) => (
            <Link
              key={article.id}
              href={`/${article.category?.slug ?? "news"}/${article.slug}`}
              className="card relative overflow-hidden tc-trending-card"
            >
              <div className="tc-trending-card__media">
                {article.heroImage ? (
                  <Image
                    src={article.heroImage}
                    alt={article.title}
                    fill
                    className="tc-trending-card__img"
                  />
                ) : (
                  <div className="tc-trending-card__placeholder" />
                )}
                <div className="tc-trending-card__overlay" />
                <span className="tc-trending-card__rank">
                  {String(idx + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="p-4">
                {article.category && (
                  <span className="tc-trending-card__cat">
                    {article.category.name}
                  </span>
                )}
                <h3 className="tc-trending-card__title">
                  {article.title}
                </h3>
                {(article.viewCount ?? 0) > 0 && (
                  <p className="tc-trending-card__meta">
                    {article.viewCount! >= 1000
                      ? `${(article.viewCount! / 1000).toFixed(1)}k reads`
                      : `${article.viewCount} reads`}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
