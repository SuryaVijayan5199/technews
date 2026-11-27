import Link from "next/link";
import Image from "next/image";
import {
  Volume2,
  Play,
  Sparkles,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import {
  getCachedFeaturedArticles,
  getCachedLatestArticles,
  getCachedTrendingArticles,
  getCachedEditorsPicks,
  getCachedBriefingArticles,
  getCachedGlobalBriefingArticles,
  getCachedBreakingArticle,
  getCachedAuthorStories,
  getCachedInFocusStories,
  getCachedCryptoStories,
  getCachedExclusiveArticles,
} from "@/lib/cache/cached-queries";
import { checkAndPublishScheduledArticles } from "@/lib/actions/article.actions";
import { HeroSectionCarousel } from "@/components/shared/hero-carousel";
import { NewsletterCta } from "@/components/shared/newsletter-cta";
import { AudioBriefingPlayer } from "@/components/shared/audio-briefing-player";
import { CuratedShowcase } from "@/components/home/curated-showcase";

function timeAgo(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function kViews(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K views`;
  return `${n} views`;
}

const PRINCIPLES = [
  { title: "NEWS", desc: "Fast, accurate coverage of important developments." },
  { title: "INSIGHTS", desc: "Context, analysis and meaningful interpretation." },
  { title: "IMPACT", desc: "The real-world consequences behind technology." },
];

const BRIEF_LABELS = ["01 / SIGNAL", "02 / SECURITY", "03 / FUTURE"];

export async function TechCrestHomepage() {
  await checkAndPublishScheduledArticles();

  const [
    featuredArticles,
    latestArticles,
    trendingArticles,
    editorsPicks,
    briefingArticles,
    globalBriefings,
    breakingArticle,
    authorStories,
    inFocusStories,
    cryptoStories,
    exclusiveStories,
  ] = await Promise.all([
    getCachedFeaturedArticles(5),
    getCachedLatestArticles(12),
    getCachedTrendingArticles(10),
    getCachedEditorsPicks(6),
    getCachedBriefingArticles(8),
    getCachedGlobalBriefingArticles(3),
    getCachedBreakingArticle(),
    getCachedAuthorStories("bibhu", 4),
    getCachedInFocusStories(4),
    getCachedCryptoStories(4),
    getCachedExclusiveArticles(4),
  ]);

  // Curated 4-Box Datasets with Explicit Deduplication & Fallback Protection
  const displayAuthorStories = (authorStories && authorStories.length > 0
    ? authorStories
    : (editorsPicks || [])
  ).slice(0, 4);

  const authorStoryIds = new Set((displayAuthorStories || []).map((a: any) => a.id));

  // In Focus: Trending stories from all categories (excluding author stories)
  const displayInFocus = (inFocusStories && inFocusStories.length > 0
    ? inFocusStories
    : (trendingArticles || [])
  )
    .filter((a: any) => !authorStoryIds.has(a.id))
    .slice(0, 4);

  const inFocusIds = new Set(displayInFocus.map((a: any) => a.id));

  // Crypto Watch: Crypto category stories
  const displayCrypto = (cryptoStories && cryptoStories.length > 0
    ? cryptoStories
    : (latestArticles || [])
  ).slice(0, 4);

  // Exclusive: Dedicated exclusive stories (strictly deduplicated from In Focus)
  const displayExclusive = (exclusiveStories && exclusiveStories.length > 0
    ? exclusiveStories
    : (featuredArticles || [])
  )
    .filter((a: any) => !inFocusIds.has(a.id))
    .slice(0, 4);

  // Top Stories (Primary Cover Story & Top Stories Grid): 6 Articles total
  const topStories: typeof editorsPicks = [];
  const topStoryIds = new Set<number>();

  for (const art of (editorsPicks || [])) {
    if (art && art.id && !topStoryIds.has(art.id)) {
      topStoryIds.add(art.id);
      topStories.push(art);
      if (topStories.length === 6) break;
    }
  }

  // If topStories has fewer than 6, fill with fallback from latestArticles
  if (topStories.length < 6) {
    for (const art of (latestArticles || [])) {
      if (art && art.id && !topStoryIds.has(art.id)) {
        topStoryIds.add(art.id);
        topStories.push(art);
        if (topStories.length === 6) break;
      }
    }
  }

  // Latest Stories: standard latest news feed flow (6 Articles total)
  const latestStories: typeof latestArticles = [];
  for (const art of (latestArticles || [])) {
    if (art && art.id) {
      if (!latestStories.some((a: any) => a.id === art.id)) {
        latestStories.push(art);
        if (latestStories.length === 6) break;
      }
    }
  }
  // Fallback: fill remaining slots from trending articles if latest < 6
  if (latestStories.length < 6) {
    for (const art of (trendingArticles || [])) {
      if (art && art.id) {
        if (!latestStories.some((a: any) => a.id === art.id)) {
          latestStories.push(art);
          if (latestStories.length === 6) break;
        }
      }
    }
  }
  const mostRead = trendingArticles.slice(0, 10);
  const briefItems = briefingArticles.slice(0, 8);

  return (
    <div className="tc-page">
      {/* HERO SECTION CAROUSEL */}
      <HeroSectionCarousel articles={featuredArticles} />

      {/* TOP STORIES (6 Articles Total) */}
      <section className="tc-section">
        <div className="tc-wrap">
          <div className="tc-section-head">
            <h2>Top Stories</h2>
            <Link href="/ai">VIEW ALL &rarr;</Link>
          </div>
          <div className="tc-top-grid">
            {(topStories.length > 0 ? topStories.slice(0, 6) : []).map((story, i) => (
              <article key={story.id ?? i} className="tc-story">
                <Link href={`/${story.category?.slug ?? "news"}/${story.slug}`} className="tc-story__art block">
                  {story.heroImage ? (
                    <Image
                      src={story.heroImage}
                      alt={story.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                      className="tc-story__art-img"
                      priority={i < 3}
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-[#2D7FF9] opacity-40" />
                    </div>
                  )}
                </Link>
                <div className="tc-story__body">
                  <div className="tc-story__content-top">
                    <span className="tc-tag">
                      {story.category?.name ?? "Technology"}
                      {i === 0 ? " • COVER STORY" : ""}
                    </span>
                    <h3>
                      <Link href={`/${story.category?.slug ?? "news"}/${story.slug}`}>
                        {story.title}
                      </Link>
                    </h3>
                    <p>
                      {story.excerpt ?? "Key developments, industry context, and strategic analysis."}
                    </p>
                  </div>
                  <div className="tc-meta-row">
                    <div className="tc-meta">
                      {story.readingTimeMinutes ?? 5} min read &bull; {timeAgo(story.publishedAt)}
                    </div>
                    <Link href={`/${story.category?.slug ?? "news"}/${story.slug}`} className="tc-read-btn">
                      Read Story <ArrowRight className="tc-inline-icon inline ml-1" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* LATEST STORIES + MOST READ */}
      <section className="tc-section">
        <div className="tc-wrap">
          <div className="tc-section-head">
            <h2>Latest News</h2>
            <Link href="/phone">VIEW ALL &rarr;</Link>
          </div>
          <div className="tc-latest-grid">
            <div className="tc-latest-list">
              {(latestStories.length > 0 ? latestStories : []).map((article: any, i: number) => (
                <article key={article.id ?? i} className="tc-latest-row">
                  <div className="tc-thumb">
                    {article.heroImage ? <Image src={article.heroImage} alt={article.title} fill className="object-cover" style={{ borderRadius: "8px" }} /> : null}
                  </div>
                  <div>
                    <span className="tc-tag">{article.category?.name ?? "Technology"}</span>
                    <h3><Link href={`/${article.category?.slug ?? "news"}/${article.slug}`}>{article.title}</Link></h3>
                    <p>{article.excerpt ?? ""}</p>
                    <div className="tc-meta">{timeAgo(article.publishedAt)} &bull; {article.readingTimeMinutes ?? 5} min</div>
                  </div>
                </article>
              ))}
            </div>
            <aside className="tc-most-read">
              <h3>Trending Stories</h3>
              {(mostRead.length > 0 ? mostRead : []).map((article: any, idx: number) => (
                <div key={article.id} className="tc-rank">
                  <span className="tc-rank__num">{String(idx + 1).padStart(2, "0")}</span>
                  <div>
                    <Link href={`/${article.category?.slug ?? "news"}/${article.slug}`}><b>{article.title}</b></Link>
                    <small>{article.category?.name ?? "Top Story"}</small>
                  </div>
                </div>
              ))}
            </aside>
          </div>
        </div>
      </section>

      {/* TECHCREST BRIEFING (100% Height Equalized Desktop Grid) */}
      <section className="tc-section">
        <div className="tc-wrap">
          <div className="tc-section-head">
            <h2>TechCrest Briefing</h2>
            <span className="tc-section-head__label">DAILY EXECUTIVE BRIEF</span>
          </div>
          <div className="tc-brief-grid">

            {/* Left Panel: Executive Audio & 5 Daily Briefing Signals */}
            <div className="tc-brief-panel">
              {/* Audio Briefing Bar (Interactive Web Speech Audio Player) */}
              <AudioBriefingPlayer items={briefItems} />

              {/* Briefing Items (5 Items) */}
              <div className="tc-brief-items">
                {briefItems.length > 0
                  ? briefItems.map((item: any) => (
                      <div key={item.id} className="tc-brief-item">
                        <Link href={`/${item.category?.slug ?? "news"}/${item.slug}`}>
                          <b>{item.title}</b>
                        </Link>
                        <div className="tc-brief-item-meta">
                          <span className="tc-brief-tag">{item.category?.name ?? "Technology"}</span>
                          <span className="tc-brief-time">{item.readingTimeMinutes ?? 4} min read</span>
                        </div>
                      </div>
                    ))
                  : (
                      <div className="tc-brief-item">
                        <b>Executive briefing will update dynamically with your latest published stories.</b>
                        <div className="tc-brief-item-meta">
                          <span className="tc-brief-tag">TechCrest Briefing</span>
                          <span className="tc-brief-time">Awaiting published content</span>
                        </div>
                      </div>
                    )}
              </div>

              {/* Editorial Quote Footer */}
              <div className="tc-quote">
                &ldquo;The strongest technology stories connect the product launch, the business model and the real-world human impact.&rdquo;
                <small>&mdash; TechCrest Editorial Principle</small>
              </div>
            </div>

            {/* Right Panel: Global Strategic Signals (Dark Executive Card Grid) */}
            <div className="tc-dark-brief">
              <div className="tc-dark-brief__head">
                <h2>Global Briefing</h2>
                <span>SIGNAL &bull; SECURITY &bull; FUTURE</span>
              </div>
              <div className="tc-dark-brief__grid">
                {(globalBriefings.length > 0 ? globalBriefings : []).map((item: any, idx: number) => (
                  <article key={item.id} className="tc-dark-card">
                    <i>{BRIEF_LABELS[idx] ?? `0${idx + 1} / INSIGHT`}</i>
                    <h3><Link href={`/${item.category?.slug ?? "news"}/${item.slug}`}>{item.title}</Link></h3>
                    <p>{item.excerpt ?? "Strategic evaluation of technological capability, enterprise readiness, and systemic market shifts."}</p>
                  </article>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* TECHCREST DAILY NEWSLETTER (Above Topic Coverage) */}
      <NewsletterCta />

      {/* CURATED SHOWCASE (4 Small Boxes: Editor's Picks, In Focus, Crypto Watch, Exclusive + 2 Vertical Banners) */}
      <CuratedShowcase
        editorsPicks={displayAuthorStories}
        inFocus={displayInFocus}
        cryptoWatch={displayCrypto}
        exclusive={displayExclusive}
      />

      {/* MANIFESTO */}
      <section className="tc-manifesto">
        <div className="tc-wrap tc-manifesto__inner">
          <div className="tc-manifesto__left">
            <div className="tc-eyebrow">The TechCrest Standard</div>
            <h2>News should create <span className="tc-accent">clarity.</span></h2>
          </div>
          <div className="tc-manifesto__right">
            <p className="tc-manifesto__desc">
              TechCrest is built around a simple editorial idea: technology coverage should help readers understand what happened, why it matters and what could happen next.
            </p>
            <div className="tc-principles">
              {PRINCIPLES.map((p) => (
                <div key={p.title} className="tc-principle">
                  <b>{p.title}</b>
                  <span>{p.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
