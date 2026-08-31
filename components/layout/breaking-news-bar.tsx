import React from "react";
import Link from "next/link";
import { getBreakingArticles } from "@/lib/actions/article.actions";

export async function BreakingNewsBar() {
  const dbArticles = await getBreakingArticles(15);

  if (!dbArticles || dbArticles.length === 0) {
    return null;
  }

  const items = dbArticles.map((a) => ({
    id: a.id,
    title: a.title,
    href: `/${a.category?.slug ?? "news"}/${a.slug}`,
    category: a.category?.name ?? "NEWS",
  }));

  return (
    <div
      className="breaking-bar"
      role="region"
      aria-label="Live News Ticker"
    >
      {/* Clean label badge — LIVE NEWS */}
      <div className="breaking-bar__label">
        <span className="breaking-bar__title">
          LIVE NEWS
        </span>
      </div>

      {/* Scrolling ticker — wraps both duplicate tracks */}
      <div className="breaking-bar__scroll-area">
        <div className="breaking-bar__marquee">
          {/* Primary track */}
          <div className="breaking-bar__track">
            {items.map((item, i) => (
              <span key={`primary-${item.id}-${i}`} className="breaking-bar__item">
                <Link href={item.href} className="breaking-bar__item-link">
                  <span className="breaking-bar__cat-badge">{item.category}</span>
                  {item.title}
                </Link>
                <span className="breaking-bar__separator" aria-hidden="true">&bull;</span>
              </span>
            ))}
          </div>

          {/* Cloned visual track for seamless infinite scroll */}
          <div className="breaking-bar__track" aria-hidden="true">
            {items.map((item, i) => (
              <span key={`clone-${item.id}-${i}`} className="breaking-bar__item">
                <Link href={item.href} className="breaking-bar__item-link">
                  <span className="breaking-bar__cat-badge">{item.category}</span>
                  {item.title}
                </Link>
                <span className="breaking-bar__separator">&bull;</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}