import Link from "next/link";
import Image from "next/image";
import {
  TrendingUp,
  Sparkles,
  Layers,
  ArrowRight,
  Newspaper,
  Star,
  Camera,
} from "lucide-react";
import { INewsHero } from "./inews-hero";
import { EditorsPicks } from "@/components/homepage/editors-picks";
import { CategoryTabs } from "@/components/homepage/category-tabs";
import { LatestArticles } from "@/components/homepage/latest-articles";
import { TrendingSection } from "./trending-section";
import { ExpertsSection } from "./experts-section";
import { NewsletterCta } from "@/components/shared/newsletter-cta";
import {
  getFeaturedArticles,
  getEditorsPicks,
  getLatestArticles,
  getTrendingArticles,
} from "@/lib/actions/article.actions";

// Server Component — fetches all homepage data in parallel
export async function INewsLayout() {
  const [featured, editorsPicks, latest, trending] = await Promise.all([
    getFeaturedArticles(5),
    getEditorsPicks(4),
    getLatestArticles(6),
    getTrendingArticles(4),
  ]);

  return (
    <div
      className="bg-[var(--color-surface-0)] text-[var(--color-text-primary)] transition-colors duration-300"
      style={{ isolation: "isolate" }}
    >
      {/* 1. iNews Hero Section */}
      <INewsHero articles={featured} />

      {/* 2. Main Newspaper Body (8 cols content + 4 cols sidebar) */}
      <section className="home-body">
        <div className="container">
          <div className="home-grid">
            {/* ── Left Content Area (8 cols) ── */}
            <main className="home-main">
              {/* Editor's Picks Grid */}
              <div>
                <SectionHeader
                  title="Editor's Picks"
                  badge="Curated"
                  href="/editors-picks"
                  icon={<Sparkles className="w-5 h-5 text-brand" />}
                />
                <EditorsPicks articles={editorsPicks} />
              </div>

              {/* Browse By Topic */}
              <div className="home-section-divider">
                <SectionHeader
                  title="Browse By Topic"
                  badge="Categories"
                  icon={<Layers className="w-5 h-5 text-teal" />}
                />
                <CategoryTabs />
              </div>

              {/* Trending Now */}
              <div className="home-section-divider">
                <TrendingSection articles={trending} />
              </div>

              {/* Latest News Feed */}
              <div className="home-section-divider">
                <SectionHeader
                  title="Latest News Stream"
                  href="/news"
                  icon={<Newspaper className="w-5 h-5 text-brand" />}
                />
                <LatestArticles articles={latest} />
              </div>
            </main>

            {/* ── Right Sidebar (4 cols) ── */}
            <aside className="home-sidebar">
              {/* Most Popular Widget — uses latest sorted by viewCount */}
              <div className="sidebar-widget">
                <div className="sidebar-widget__header">
                  <TrendingUp className="w-5 h-5 text-brand" />
                  <h3 className="sidebar-widget__title">Most Popular</h3>
                </div>
                <div className="popular-list">
                  {latest
                    .sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0))
                    .slice(0, 4)
                    .map((post, idx) => (
                      <Link
                        key={post.id}
                        href={`/${post.category?.slug ?? "news"}/${post.slug}`}
                        className="popular-item group"
                      >
                        <span className="popular-item__rank">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <div className="popular-item__content">
                          <span className="popular-item__category">
                            {post.category?.name ?? "News"}
                          </span>
                          <h4 className="popular-item__title">{post.title}</h4>
                          <span className="popular-item__views">
                            {post.viewCount >= 1000
                              ? `${(post.viewCount / 1000).toFixed(1)}k reads`
                              : `${post.viewCount} reads`}
                          </span>
                        </div>
                      </Link>
                    ))}
                  {latest.length === 0 && (
                    <p className="text-sm text-[var(--color-text-muted)] py-4 text-center">
                      No articles yet.
                    </p>
                  )}
                </div>
              </div>

              {/* Sidebar Ad Placement */}
              <div className="sidebar-ad">Advertisement</div>

              {/* Latest Reviews Widget — uses articles from reviews category */}
              <div className="sidebar-widget">
                <div className="sidebar-widget__header sidebar-widget__header--with-link">
                  <div className="sidebar-widget__header-left">
                    <Star className="w-5 h-5 text-yellow" />
                    <h3 className="sidebar-widget__title">Latest Reviews</h3>
                  </div>
                  <Link href="/reviews" className="sidebar-widget__link">
                    VIEW ALL <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="review-list">
                  {editorsPicks.slice(0, 3).map((review) => (
                    <Link
                      key={review.id}
                      href={`/${review.category?.slug ?? "reviews"}/${review.slug}`}
                      className="review-item group"
                    >
                      <div className="review-item__image-wrap">
                        {review.heroImage ? (
                          <Image
                            src={review.heroImage}
                            width={64}
                            height={64}
                            alt={review.title}
                            className="review-item__image"
                          />
                        ) : (
                          <div className="review-item__image bg-[var(--color-surface-3)] flex items-center justify-center">
                            <Star className="w-5 h-5 text-[var(--color-text-muted)]" />
                          </div>
                        )}
                      </div>
                      <div className="review-item__content">
                        <h4 className="review-item__title">{review.title}</h4>
                        <div className="review-item__rating">★★★★½</div>
                      </div>
                    </Link>
                  ))}
                  {editorsPicks.length === 0 && (
                    <p className="text-sm text-[var(--color-text-muted)] py-4 text-center">
                      No reviews yet.
                    </p>
                  )}
                </div>
              </div>

              {/* Photo Feature Widget */}
              {featured[0] && (
                <div>
                  <div className="sidebar-widget__header">
                    <Camera className="w-5 h-5 text-brand" />
                    <h3 className="sidebar-widget__title">Photo Feature</h3>
                  </div>
                  <Link
                    href={`/${featured[0].category?.slug ?? "news"}/${featured[0].slug}`}
                    className="photo-feature group"
                  >
                    <div className="photo-feature__image-wrap">
                      {featured[0].heroImage ? (
                        <Image
                          src={featured[0].heroImage}
                          width={600}
                          height={338}
                          alt={featured[0].title}
                          className="photo-feature__image"
                        />
                      ) : (
                        <div className="photo-feature__image bg-[var(--color-surface-3)]" />
                      )}
                      <div className="photo-feature__overlay" />
                      <div className="photo-feature__badge">
                        <Camera className="w-3 h-3 text-brand" />
                        Feature
                      </div>
                    </div>
                    <div className="photo-feature__content">
                      <h4 className="photo-feature__title">
                        {featured[0].title}
                      </h4>
                      <p className="photo-feature__meta">
                        {featured[0].readingTimeMinutes ?? 5} Min Read
                      </p>
                    </div>
                  </Link>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>

      {/* 3. Meet Our Experts (Full Width Grid) */}
      <ExpertsSection />

      {/* 4. Standalone Newsletter CTA */}
      <NewsletterCta />
    </div>
  );
}

/* ─────────────────────────────────────────
   Section Header utility component
   ───────────────────────────────────────── */
function SectionHeader({
  title,
  badge,
  href,
  icon,
}: {
  title: string;
  badge?: string;
  href?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="section-header">
      <div className="section-header__left">
        {icon}
        <h2 className="section-header__title">{title}</h2>
        {badge && <span className="badge badge-news">{badge}</span>}
      </div>
      {href && (
        <Link href={href} className="section-header__link">
          View All <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      )}
    </div>
  );
}
