import Image from "next/image";
import Link from "next/link";
import { Clock, ArrowUpRight, Flame } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cleanAuthorName } from "@/lib/utils";

type Article = {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  heroImage?: string | null;
  publishedAt?: Date | null;
  readingTimeMinutes?: number | null;
  category?: { name: string; slug: string } | null;
  author?: { displayName: string; avatar?: string | null } | null;
};

function EmptyHero() {
  return (
    <section
      className="hero-section"
      style={{ isolation: "isolate" }}
    >
      <div className="container">
        <div className="flex items-center justify-center min-h-[400px] flex-col gap-4 text-center">
          <Flame className="w-12 h-12 text-[var(--color-text-muted)]" />
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
            No Articles Published Yet
          </h2>
          <p className="text-[var(--color-text-secondary)] max-w-md">
            Use the{" "}
            <Link href="/dashboard/articles/new" className="text-[var(--color-brand-400)] underline">
              dashboard
            </Link>{" "}
            to write and publish your first article.
          </p>
        </div>
      </div>
    </section>
  );
}

export function INewsHero({ articles }: { articles: Article[] }) {
  if (!articles || articles.length === 0) return <EmptyHero />;

  const main = articles[0];
  const grid = articles.slice(1, 5);

  const formatDate = (d?: Date | null) => {
    if (!d) return "";
    try {
      return formatDistanceToNow(new Date(d), { addSuffix: true });
    } catch {
      return "";
    }
  };

  return (
    <section
      className="hero-section"
      style={{ isolation: "isolate" }}
    >
      <div className="container">
        <div className="hero-layout">
          {/* Main Featured Hero Story */}
          <div className="hero-main-wrapper">
            <article className="hero-main group">
              <div className="hero-main__image-wrap">
                {main.heroImage ? (
                  <Image
                    src={main.heroImage}
                    alt={main.title}
                    width={1200}
                    height={675}
                    priority
                    className="hero-main__image"
                  />
                ) : (
                  <div className="hero-main__image bg-[var(--color-surface-2)]" />
                )}
                <div className="hero-main__image-overlay" />

                {/* Category & Badge */}
                <div className="hero-main__badges">
                  <span className="badge badge-breaking hero-main__badge-featured">
                    <Flame className="w-3 h-3 text-amber-300 fill-amber-300" />{" "}
                    FEATURED
                  </span>
                  {main.category && (
                    <span className="badge badge-ai hero-main__badge-category">
                      {main.category.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Text overlay content */}
              <div className="hero-main__content">
                <h1 className="hero-main__title">
                  <Link
                    href={`/${main.category?.slug ?? "news"}/${main.slug}`}
                    className="hero-main__link"
                  >
                    {main.title}
                  </Link>
                </h1>
                {main.excerpt && (
                  <p className="hero-main__excerpt">{main.excerpt}</p>
                )}

                {/* Author & Meta */}
                <div className="hero-main__meta">
                  {main.author && (
                    <div className="hero-main__author">
                      <div className="hero-main__author-avatar">
                        {main.author.avatar ? (
                          <Image
                            src={main.author.avatar}
                            alt={cleanAuthorName(main.author.displayName)}
                            width={32}
                            height={32}
                            className="hero-main__author-image"
                          />
                        ) : (
                          <div className="hero-main__author-image w-8 h-8 bg-[var(--color-brand-500)] rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {cleanAuthorName(main.author.displayName).charAt(0)}
                          </div>
                        )}
                      </div>
                      <span className="hero-main__author-name">
                        {cleanAuthorName(main.author.displayName)}
                      </span>
                    </div>
                  )}

                  <div className="hero-main__stats">
                    <span>{formatDate(main.publishedAt)}</span>
                    {main.readingTimeMinutes && (
                      <>
                        <span>•</span>
                        <span className="hero-main__read-time">
                          <Clock className="w-3.5 h-3.5 text-brand" />{" "}
                          {main.readingTimeMinutes} min read
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Secondary Stacked Grid */}
          {grid.length > 0 && (
            <div className="hero-grid-wrapper">
              {grid.map((story) => (
                <article key={story.id} className="hero-grid-item group">
                  <div className="hero-grid-item__image-wrap">
                    {story.heroImage ? (
                      <Image
                        src={story.heroImage}
                        alt={story.title}
                        width={600}
                        height={400}
                        className="hero-grid-item__image"
                      />
                    ) : (
                      <div className="hero-grid-item__image bg-[var(--color-surface-2)]" />
                    )}
                    {story.category && (
                      <div className="hero-grid-item__badge-wrap">
                        <span className="badge badge-news hero-grid-item__badge">
                          {story.category.name}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="hero-grid-item__content">
                    <h3 className="hero-grid-item__title">
                      <Link
                        href={`/${story.category?.slug ?? "news"}/${story.slug}`}
                        className="hero-grid-item__link"
                      >
                        {story.title}
                      </Link>
                    </h3>

                    <div className="hero-grid-item__meta">
                      <span>{formatDate(story.publishedAt)}</span>
                      <ArrowUpRight className="hero-grid-item__icon" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
