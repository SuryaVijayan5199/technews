import Link from "next/link";
import Image from "next/image";
import { Clock, Eye, MessageCircle } from "lucide-react";
import { formatRelativeTime, truncate, cn, getAuthorInitials } from "@/lib/utils";
import { BookmarkButton } from "@/components/shared/bookmark-button";

export interface ArticleCardData {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  heroImage?: string | null;
  heroImageAlt?: string | null;
  publishedAt?: Date | string | null;
  readingTimeMinutes?: number | null;
  viewCount?: number;
  commentCount?: number;
  categorySlug?: string;
  categoryName?: string;
  categoryColor?: string;
  authorName?: string;
  authorAvatar?: string | null;
  authorSlug?: string;
  isBreaking?: boolean;
  isFeatured?: boolean;
}

interface ArticleCardProps {
  article: ArticleCardData;
  variant?: "default" | "featured" | "compact" | "horizontal";
  className?: string;
}

export function ArticleCard({
  article,
  variant = "default",
  className,
}: ArticleCardProps) {
  const href = `/${article.categorySlug ?? "news"}/${article.slug}`;

  if (variant === "compact") {
    return (
      <article className={cn("article-card article-card--compact", className)}>
        {article.heroImage && (
          <div className="article-card__image-wrap">
            <Image
              src={article.heroImage}
              alt={article.heroImageAlt ?? article.title}
              width={80}
              height={64}
              className="article-card__image"
            />
          </div>
        )}
        <div className="article-card__content">
          {article.categoryName && (
            <span className="article-card__category">
              {article.categoryName}
            </span>
          )}
          <h3 className="article-card__title">
            <Link href={href} className="article-card__link">
              {article.title}
            </Link>
          </h3>
          {article.publishedAt && (
            <p className="article-card__date">
              {formatRelativeTime(article.publishedAt)}
            </p>
          )}
        </div>
      </article>
    );
  }

  if (variant === "horizontal") {
    return (
      <article className={cn("article-card article-card--horizontal card", className)}>
        {article.heroImage && (
          <div className="article-card__image-wrap">
            <Image
              src={article.heroImage}
              alt={article.heroImageAlt ?? article.title}
              width={192}
              height={128}
              className="article-card__image"
            />
          </div>
        )}
        <div className="article-card__content">
          <div>
            {article.categoryName && (
              <span className="badge badge-news mb-3 relative tc-card-badge">{article.categoryName}</span>
            )}
            <h3 className="article-card__title">
              <Link href={href} className="article-card__link">
                {article.title}
              </Link>
            </h3>
            {article.excerpt && (
              <p className="article-card__excerpt">
                {truncate(article.excerpt, 120)}
              </p>
            )}
          </div>
          <div className="article-card__meta">
            {article.publishedAt && (
              <span>{formatRelativeTime(article.publishedAt)}</span>
            )}
            {article.readingTimeMinutes && (
              <span className="article-card__meta-item">
                <Clock className="tc-icon-xs" />
                {article.readingTimeMinutes} min read
              </span>
            )}
          </div>
        </div>
      </article>
    );
  }

  if (variant === "featured") {
    return (
      <article className={cn("article-card article-card--featured card", className)}>
        <div className="article-card__featured-inner">
          {article.heroImage ? (
            <Image
              src={article.heroImage}
              alt={article.heroImageAlt ?? article.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="article-card__image"
              priority
            />
          ) : (
            <div className="article-card__featured-placeholder" />
          )}
          <div className="article-card__featured-overlay" />
          <div className="article-card__featured-content">
            {article.isBreaking && (
              <span className="badge badge-breaking mb-3 relative tc-card-badge">Breaking</span>
            )}
            {!article.isBreaking && article.categoryName && (
              <span className="badge badge-news mb-3 relative tc-card-badge">{article.categoryName}</span>
            )}
            <h2 className="article-card__featured-title">
              <Link href={href} className="article-card__link">
                {article.title}
              </Link>
            </h2>
            {article.excerpt && (
              <p className="article-card__featured-excerpt">
                {truncate(article.excerpt, 120)}
              </p>
            )}
            <div className="article-card__featured-meta">
              {article.authorName && (
                <div className="article-card__author">
                  <span className="article-card__author-name">
                    {article.authorName}
                  </span>
                </div>
              )}
              {article.publishedAt && (
                <span className="article-card__featured-date">
                  {formatRelativeTime(article.publishedAt)}
                </span>
              )}
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Default card (TechCrest Modern Magazine Card Style)
  return (
    <article 
      className={cn("article-card article-card--default card", className)}
    >
      {article.heroImage && (
        <div className="article-card__image-wrap">
          <Image
            src={article.heroImage}
            alt={article.heroImageAlt ?? article.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="article-card__image"
          />
          {article.isBreaking && (
            <div className="article-card__badge-wrap">
              <span className="badge badge-breaking tc-shadow-md">Breaking</span>
            </div>
          )}
          {article.categoryName && !article.isBreaking && (
            <div className="article-card__badge-wrap">
              <span className="article-card__category-badge">
                {article.categoryName}
              </span>
            </div>
          )}
          <div className="article-card__image-overlay" />
        </div>
      )}
      <div className="article-card__content">
        <h3 className="article-card__title">
          <Link href={href} className="article-card__link">
            {article.title}
          </Link>
        </h3>
        {article.excerpt && (
          <p className="article-card__excerpt">
            {truncate(article.excerpt, 100)}
          </p>
        )}
        
        {/* Refactored Accessible Metadata Row */}
        <div className="article-card__meta-footer">
          <div className="article-card__author">
            {article.authorName && (
              <span className="article-card__author-name">
                {article.authorName}
              </span>
            )}
          </div>

          <div className="article-card__stats">
            {article.readingTimeMinutes && (
              <span className="article-card__meta-item tc-text-brand">
                <Clock className="tc-icon-xs" />
                {article.readingTimeMinutes} min
              </span>
            )}
            {article.commentCount !== undefined && (
              <span className="article-card__meta-item tc-text-teal">
                <MessageCircle className="tc-icon-xs" />
                {article.commentCount}
              </span>
            )}
            <BookmarkButton
              article={{
                id: article.id,
                title: article.title,
                slug: article.slug,
                categorySlug: article.categorySlug,
                categoryName: article.categoryName,
                heroImage: article.heroImage ?? undefined,
                readingTimeMinutes: article.readingTimeMinutes ?? undefined,
              }}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
