import Link from "next/link";
import Image from "next/image";
import { Clock, Eye, MessageCircle } from "lucide-react";
import { formatRelativeTime, truncate, cn, getAuthorInitials } from "@/lib/utils";

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
      <article className={cn("article-card article-card--compact group", className)}>
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
      <article className={cn("article-card article-card--horizontal card group", className)}>
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
              <span className="badge badge-news mb-3 relative z-10">{article.categoryName}</span>
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
                <Clock className="w-3.5 h-3.5" />
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
      <article className={cn("article-card article-card--featured card group", className)}>
        <div className="article-card__featured-inner">
          {article.heroImage ? (
            <Image
              src={article.heroImage}
              alt={article.heroImageAlt ?? article.title}
              fill
              className="article-card__image"
              priority
            />
          ) : (
            <div className="article-card__featured-placeholder" />
          )}
          <div className="article-card__featured-overlay" />
          <div className="article-card__featured-content">
            {article.isBreaking && (
              <span className="badge badge-breaking mb-3 relative z-10">Breaking</span>
            )}
            {!article.isBreaking && article.categoryName && (
              <span className="badge badge-news mb-3 relative z-10">{article.categoryName}</span>
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
                <div className="article-card__author flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#2D7FF9] to-[#165bb8] text-white text-[9px] font-extrabold flex items-center justify-center border border-white/20 shrink-0">
                    {getAuthorInitials(article.authorName)}
                  </div>
                  <span className="article-card__author-name text-white">
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

  // Default card (Ncmaz Modern Magazine Card Style)
  return (
    <article 
      className={cn("article-card article-card--default card group", className)}
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
              <span className="badge badge-breaking shadow-md">Breaking</span>
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
          <div className="article-card__author flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#2D7FF9] to-[#165bb8] text-white text-[9px] font-extrabold flex items-center justify-center border border-white/20 shrink-0">
              {getAuthorInitials(article.authorName)}
            </div>
            {article.authorName && (
              <span className="article-card__author-name">
                {article.authorName}
              </span>
            )}
          </div>

          <div className="article-card__stats">
            {article.readingTimeMinutes && (
              <span className="article-card__meta-item text-brand">
                <Clock className="w-3 h-3" />
                {article.readingTimeMinutes} min
              </span>
            )}
            {article.commentCount !== undefined && (
              <span className="article-card__meta-item text-teal">
                <MessageCircle className="w-3 h-3" />
                {article.commentCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
