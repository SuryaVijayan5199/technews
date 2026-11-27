"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

export interface FeedArticle {
  id: number | string;
  title: string;
  slug: string;
  excerpt?: string | null;
  heroImage?: string | null;
  publishedAt?: Date | string | null;
  category?: {
    slug?: string | null;
    name?: string | null;
  } | null;
}

export interface FeedListProps {
  articles: FeedArticle[];
  fallbackCategorySlug?: string;
  initialCount?: number;
  step?: number;
}

function formatFeedDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  const datePart = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timePart = d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${datePart}, ${timePart}`;
}

export function FeedList({
  articles,
  fallbackCategorySlug = "news",
  initialCount = 10,
  step = 10,
}: FeedListProps) {
  const [visibleCount, setVisibleCount] = useState(initialCount);

  if (!articles || articles.length === 0) return null;

  const visibleArticles = articles.slice(0, visibleCount);
  const hasMore = visibleCount < articles.length;

  const handleReadMore = () => {
    setVisibleCount((prev) => prev + step);
  };

  return (
    <div className="cat-feed">
      {visibleArticles.map((article) => {
        const catSlug = article.category?.slug || fallbackCategorySlug;
        const href = `/${catSlug}/${article.slug}`;

        return (
          <article key={article.id} className="cat-feed-item">
            <Link href={href} className="cat-feed-thumb-wrap">
              <div className="cat-feed-thumb">
                {article.heroImage ? (
                  <Image
                    src={article.heroImage}
                    alt={article.title}
                    fill
                    sizes="(max-width: 640px) 100px, 165px"
                    className="cat-feed-img"
                  />
                ) : (
                  <div className="cat-feed-placeholder" />
                )}
              </div>
            </Link>
            <div className="cat-feed-content">
              <h3 className="cat-feed-title">
                <Link href={href}>{article.title}</Link>
              </h3>
              {article.excerpt && (
                <p className="cat-feed-excerpt">{article.excerpt}</p>
              )}
              <div className="cat-feed-meta">
                <time
                  className="cat-feed-time"
                  dateTime={
                    article.publishedAt
                      ? new Date(article.publishedAt).toISOString()
                      : undefined
                  }
                >
                  {formatFeedDate(article.publishedAt)}
                </time>
              </div>
            </div>
          </article>
        );
      })}

      {hasMore && (
        <div className="cat-feed-more-wrap">
          <button
            type="button"
            onClick={handleReadMore}
            className="cat-feed-more-btn"
          >
            <span>Read More</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
