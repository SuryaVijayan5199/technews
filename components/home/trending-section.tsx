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
          <TrendingUp className="w-5 h-5 text-brand" />
          <h2 className="section-header__title">Trending Now</h2>
          <span className="badge badge-breaking flex items-center gap-1">
            <Flame className="w-3 h-3" /> Hot
          </span>
        </div>
      </div>

      {articles.length === 0 ? (
        <p className="text-center text-[var(--color-text-muted)] py-8">
          No trending articles yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {articles.map((article, idx) => (
            <Link
              key={article.id}
              href={`/${article.category?.slug ?? "news"}/${article.slug}`}
              className="card group relative overflow-hidden hover:-translate-y-1 transition-transform"
            >
              <div className="aspect-video relative overflow-hidden">
                {article.heroImage ? (
                  <Image
                    src={article.heroImage}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-[var(--color-surface-2)]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <span className="absolute top-2 left-2 text-white font-black text-2xl opacity-60 leading-none">
                  {String(idx + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="p-4">
                {article.category && (
                  <span className="text-xs font-bold text-[var(--color-brand-400)] uppercase tracking-wider">
                    {article.category.name}
                  </span>
                )}
                <h3 className="text-sm font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-brand-400)] transition-colors mt-1 line-clamp-2 leading-snug">
                  {article.title}
                </h3>
                {(article.viewCount ?? 0) > 0 && (
                  <p className="text-xs text-[var(--color-text-muted)] mt-2">
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
