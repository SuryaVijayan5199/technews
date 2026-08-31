import React from "react";
import Link from "next/link";
import { CloudSun, Calendar } from "lucide-react";
import { getTrendingArticles } from "@/lib/actions/article.actions";

export async function TopBar() {
  const trending = await getTrendingArticles(1);
  const hotArticle = trending.length > 0 ? trending[0] : null;

  const currentDateStr = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="topbar">
      <div className="container topbar-container">
        {/* Left: Date & Weather */}
        <div className="topbar-left">
          <div className="topbar-item topbar-date">
            <Calendar className="topbar-icon" />
            <span>{currentDateStr}</span>
          </div>

          <div className="topbar-item topbar-weather">
            <CloudSun className="topbar-icon topbar-icon--sun" />
            <span>Bengaluru, IN &bull; 26&deg;C Partly Cloudy</span>
          </div>
        </div>

        {/* Center: Dynamic Trending Headline Quick Link */}
        {hotArticle && (
          <div className="topbar-center">
            <span className="badge badge-breaking">HOT</span>
            <Link
              href={`/${hotArticle.category?.slug ?? "news"}/${hotArticle.slug}`}
              className="topbar-link link-underline"
            >
              {hotArticle.title}
            </Link>
          </div>
        )}

        {/* Right: Subscribe CTA */}
        <div className="topbar-right">
          <Link
            href="/newsletters"
            className="topbar-cta"
          >
            Newsletter &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}