import Link from "next/link";
import Image from "next/image";
import {
  Volume2,
  Play,
  Headphones,
  Sparkles,
  TrendingUp,
  Shield,
  Zap,
  ArrowRight,
  Smartphone,
  Bot,
  Activity,
  Brain,
  Home as HomeIcon,
  Bitcoin,
  Gamepad2,
} from "lucide-react";
import {
  getFeaturedArticles,
  getLatestArticles,
  getTrendingArticles,
  getEditorsPicks,
  getBriefingArticles,
  getGlobalBriefingArticles,
  getBreakingArticle,
  getArticlesGroupedByTopics,
} from "@/lib/actions/article.actions";
import { HeroSectionCarousel } from "@/components/shared/hero-carousel";
import { NewsletterCta } from "@/components/shared/newsletter-cta";
import { AudioBriefingPlayer } from "@/components/shared/audio-briefing-player";

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

const TOPICS = [
  { label: "Phone", sub: "Smartphones • iOS • Android", href: "/phone", icon: Smartphone, color: "#0ea5e9" },
  { label: "Audio", sub: "Headphones • Speakers • Hi-Fi", href: "/audio", icon: Headphones, color: "#8b5cf6" },
  { label: "Robotic", sub: "Humanoids • Drones • Automation", href: "/robotics", icon: Bot, color: "#6366f1" },
  { label: "Fitness", sub: "Wearables • Biosensors • Trackers", href: "/fitness", icon: Activity, color: "#10b981" },
  { label: "Security", sub: "Zero-Trust • Privacy • Defense", href: "/security", icon: Shield, color: "#f59e0b" },
  { label: "AI", sub: "LLMs • Autonomous Agents • Research", href: "/ai", icon: Brain, color: "#a855f7" },
  { label: "Home", sub: "Matter • Hubs • Automation", href: "/smart-home", icon: HomeIcon, color: "#14b8a6" },
  { label: "EVs", sub: "Electric Vehicles • Charging", href: "/evs", icon: Zap, color: "#22c55e" },
  { label: "Crypto", sub: "Tokenization • Zero-Knowledge", href: "/crypto", icon: Bitcoin, color: "#f97316" },
  { label: "Gaming", sub: "Consoles • PC Gaming • Hardware", href: "/gaming", icon: Gamepad2, color: "#ef4444" },
];

const PRINCIPLES = [
  { title: "NEWS", desc: "Fast, accurate coverage of important developments." },
  { title: "INSIGHTS", desc: "Context, analysis and meaningful interpretation." },
  { title: "IMPACT", desc: "The real-world consequences behind technology." },
];

const GLOBAL_FALLBACK = [
  { label: "01 / SIGNAL", title: "AI adoption is moving toward measurable outcomes", desc: "The next phase is about useful systems integrated directly into real enterprise workflows, moving beyond trial chatbots." },
  { label: "02 / SECURITY", title: "Identity is becoming an operating security layer", desc: "Security architecture is increasingly built around context, continuous verification, and zero-trust credentials." },
  { label: "03 / FUTURE", title: "Compute & energy are strategic growth resources", desc: "Hardware efficiency, next-gen silicon, and localized clean power are central to the next technology infrastructure cycle." },
];

const BRIEF_LABELS = ["01 / SIGNAL", "02 / SECURITY", "03 / FUTURE"];

const DEFAULT_BRIEF_ITEMS = [
  { title: "Autonomous AI agents transition to core product infrastructure", category: "Artificial Intelligence", meta: "Updated 10m ago • 4 min read" },
  { title: "Enterprise security leaders prioritize zero-trust identity controls", category: "Cybersecurity", meta: "Updated 35m ago • 5 min read" },
  { title: "Venture capital shifts focus toward compute efficiency & silicon innovation", category: "Startups & VC", meta: "Updated 1h ago • 6 min read" },
  { title: "Next-gen battery chemistry accelerates commercial EV adoption", category: "Mobility & EVs", meta: "Updated 2h ago • 5 min read" },
  { title: "Consumer hardware makers double down on local neural processing units", category: "Hardware & Devices", meta: "Updated 3h ago • 4 min read" },
];

function getCategoryIcon(iconName?: string | null, categoryName?: string | null) {
  const key = (iconName || categoryName || "").toLowerCase();
  if (key.includes("phone") || key.includes("smartphone") || key.includes("mobile")) return Smartphone;
  if (key.includes("audio") || key.includes("headphone") || key.includes("sound")) return Headphones;
  if (key.includes("robot") || key.includes("bot") || key.includes("automation")) return Bot;
  if (key.includes("fit") || key.includes("health") || key.includes("wearable")) return Activity;
  if (key.includes("sec") || key.includes("shield") || key.includes("cyber")) return Shield;
  if (key.includes("ai") || key.includes("brain") || key.includes("intelligence")) return Brain;
  if (key.includes("home") || key.includes("house") || key.includes("smart")) return HomeIcon;
  if (key.includes("ev") || key.includes("zap") || key.includes("electric")) return Zap;
  if (key.includes("crypto") || key.includes("coin") || key.includes("web3")) return Bitcoin;
  if (key.includes("game") || key.includes("gaming") || key.includes("console")) return Gamepad2;
  return Sparkles;
}

export async function TechCrestHomepage() {
  const [
    featuredArticles,
    latestArticles,
    trendingArticles,
    editorsPicks,
    briefingArticles,
    globalBriefings,
    breakingArticle,
    groupedTopics,
  ] = await Promise.all([
    getFeaturedArticles(5),
    getLatestArticles(8),
    getTrendingArticles(10),
    getEditorsPicks(6),
    getBriefingArticles(5),
    getGlobalBriefingArticles(3),
    getBreakingArticle(),
    getArticlesGroupedByTopics(),
  ]);

  const activeExploreTopics = groupedTopics.length > 0
    ? groupedTopics.map((gt: any) => {
        const cat = gt.category;
        return {
          label: cat.name,
          sub: cat.description || `${cat.name} news & updates`,
          href: `/${cat.slug}`,
          icon: getCategoryIcon(cat.icon, cat.name),
          color: cat.color || "#2D7FF9",
        };
      })
    : TOPICS;

  // Deduplicate topStories by unique article ID so story 1 and story 5 are guaranteed unique
  const rawTopStories = [...editorsPicks, ...latestArticles];
  const seenTopStoryIds = new Set<number>();
  const topStories: typeof editorsPicks = [];
  for (const art of rawTopStories) {
    if (art && art.id && !seenTopStoryIds.has(art.id)) {
      seenTopStoryIds.add(art.id);
      topStories.push(art);
      if (topStories.length === 5) break;
    }
  }
  const latestStories = latestArticles.slice(0, 5);
  const mostRead = trendingArticles.slice(0, 10);
  const briefItems = briefingArticles.slice(0, 5);

  const filteredTopicShowcase = groupedTopics.filter(
    ({ category }: any) => category.slug !== "news" && category.name.toLowerCase() !== "news"
  );

  return (
    <div className="tc-page">
      {/* HERO SECTION CAROUSEL */}
      <HeroSectionCarousel articles={featuredArticles} />

      {/* TOP STORIES (5 Articles) */}
      <section className="tc-section">
        <div className="tc-wrap">
          <div className="tc-section-head">
            <h2>Top Stories</h2>
            <Link href="/news">VIEW ALL &rarr;</Link>
          </div>
          <div className="tc-top-grid">
            {topStories[0] ? (
              <article className="tc-story tc-story--lead">
                <Link href={`/${topStories[0].category?.slug ?? "news"}/${topStories[0].slug}`} className="tc-story__art tc-story__art--dark block">
                  {topStories[0].heroImage && <Image src={topStories[0].heroImage} alt={topStories[0].title} fill className="tc-story__art-img" priority />}
                </Link>
                <div className="tc-story__body">
                  <div>
                    <span className="tc-tag">{topStories[0].category?.name ?? "Technology"} &bull; COVER STORY</span>
                    <h3>
                      <Link href={`/${topStories[0].category?.slug ?? "news"}/${topStories[0].slug}`}>
                        {topStories[0].title}
                      </Link>
                    </h3>
                    <p>{topStories[0].excerpt ?? "Deep-dive investigation on technology breakthroughs, market shifts, and real-world consequences."}</p>
                  </div>
                  <div className="tc-meta-row">
                    <div className="tc-meta">
                      TechCrest Editorial &bull; {topStories[0].readingTimeMinutes ?? 5} min read &bull; {kViews(topStories[0].viewCount ?? 0)}
                    </div>
                    <Link href={`/${topStories[0].category?.slug ?? "news"}/${topStories[0].slug}`} className="tc-read-btn">
                      Read Story <ArrowRight className="tc-inline-icon inline ml-1" />
                    </Link>
                  </div>
                </div>
              </article>
            ) : (
              <article className="tc-story tc-story--lead">
                <div className="tc-story__art tc-story__art--dark" />
                <div className="tc-story__body">
                  <div>
                    <span className="tc-tag">AI &bull; COVER STORY</span>
                    <h3>The Next Computing Shift Is Already Underway</h3>
                    <p>AI is moving from a feature inside products to a new foundational computing layer redefining software architecture globally.</p>
                  </div>
                  <div className="tc-meta-row">
                    <div className="tc-meta">TechCrest Editorial &bull; 10 min read</div>
                    <Link href="/news" className="tc-read-btn">Read Story &rarr;</Link>
                  </div>
                </div>
              </article>
            )}
            {[topStories[1], topStories[2], topStories[3], topStories[4]].map((story, i) =>
              story ? (
                <article key={story.id} className="tc-story">
                  <Link href={`/${story.category?.slug ?? "news"}/${story.slug}`} className="tc-story__art tc-story__art--small block">
                    {story.heroImage && <Image src={story.heroImage} alt={story.title} fill className="tc-story__art-img" />}
                  </Link>
                  <div className="tc-story__body">
                    <div>
                      <span className="tc-tag">{story.category?.name ?? "Technology"}</span>
                      <h3><Link href={`/${story.category?.slug ?? "news"}/${story.slug}`}>{story.title}</Link></h3>
                      <p>{story.excerpt ?? "Key developments, industry context, and strategic analysis."}</p>
                    </div>
                    <div className="tc-meta">{story.readingTimeMinutes ?? 5} min read &bull; {timeAgo(story.publishedAt)}</div>
                  </div>
                </article>
              ) : (
                <article key={`fb-${i}`} className="tc-story">
                  <div className="tc-story__art tc-story__art--small" />
                  <div className="tc-story__body">
                    <div>
                      <span className="tc-tag">{["Cybersecurity", "Startups", "Hardware", "Mobility"][i] ?? "Tech"}</span>
                      <h3>{["Security teams are redesigning around identity controls", "Inside the infrastructure startups scaling globally", "Next-gen processors push power efficiency boundaries", "EV infrastructure transitions to unified standards"][i]}</h3>
                      <p>{["Access, context and continuous verification are becoming central.", "New platforms are reducing complexity for engineering teams.", "Silicon innovation is driving higher performance per watt.", "Charging networks are aligning on interoperable protocols."][i]}</p>
                    </div>
                    <div className="tc-meta">{5 + i} min read</div>
                  </div>
                </article>
              )
            )}
          </div>
        </div>
      </section>

      {/* LATEST STORIES + MOST READ */}
      <section className="tc-section">
        <div className="tc-wrap">
          <div className="tc-section-head">
            <h2>Latest News</h2>
            <Link href="/news">VIEW ALL &rarr;</Link>
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
                    <small>{(article.viewCount ?? 0) > 0 ? kViews(article.viewCount ?? 0) : (article.category?.name ?? "Top Story")}</small>
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
              <AudioBriefingPlayer items={briefItems.length > 0 ? briefItems : DEFAULT_BRIEF_ITEMS} />

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
                  : DEFAULT_BRIEF_ITEMS.map((item, i) => (
                      <div key={i} className="tc-brief-item">
                        <b>{item.title}</b>
                        <div className="tc-brief-item-meta">
                          <span className="tc-brief-tag">{item.category}</span>
                          <span className="tc-brief-time">{item.meta}</span>
                        </div>
                      </div>
                    ))}
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
                {globalBriefings.length === 0 && GLOBAL_FALLBACK.map((item) => (
                  <article key={item.label} className="tc-dark-card">
                    <i>{item.label}</i>
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </article>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* TECHCREST DAILY NEWSLETTER (Above Topic Coverage) */}
      <NewsletterCta />

      {/* TOPIC COVERAGE (3 Articles Per Topic - Excluding News) */}
      {filteredTopicShowcase.length > 0 && (
        <section className="tc-section tc-topic-showcase-section">
          <div className="tc-wrap">
            <div className="tc-section-head">
              <h2>Topic Coverage</h2>
              <span className="tc-section-head__label">ALL TOPICS</span>
            </div>
            <div className="tc-topic-showcase-grid">
              {filteredTopicShowcase.map(({ category, articles }: any) => (
                <div key={category.id} className="tc-topic-block">
                  <div className="tc-topic-block__header">
                    <div className="tc-topic-block__title-group">
                      <span className="tc-topic-block__dot" style={{ backgroundColor: category.color || "#2D7FF9" }} />
                      <h3 className="tc-topic-block__title">{category.name}</h3>
                    </div>
                    <Link href={`/${category.slug}`} className="tc-topic-block__link">
                      View All &rarr;
                    </Link>
                  </div>
                  {category.description && (
                    <p className="tc-topic-block__desc">{category.description}</p>
                  )}
                  <div className="tc-topic-block__articles">
                    {articles.map((art: any) => (
                      <article key={art.id} className="tc-topic-art-card">
                        <Link href={`/${category.slug}/${art.slug}`} className="tc-topic-art-card__thumb">
                          {art.heroImage && (
                            <Image
                              src={art.heroImage}
                              alt={art.title}
                              fill
                              className="object-cover"
                              style={{ borderRadius: "6px" }}
                            />
                          )}
                        </Link>
                        <div className="tc-topic-art-card__body">
                          <h4 className="tc-topic-art-card__title">
                            <Link href={`/${category.slug}/${art.slug}`}>{art.title}</Link>
                          </h4>
                          <p className="tc-topic-art-card__excerpt">{art.excerpt}</p>
                          <div className="tc-meta tc-meta--small mt-1">
                            {timeAgo(art.publishedAt)} &bull; {art.readingTimeMinutes ?? 5} min read
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* EXPLORE TOPICS (2 Rows - 5 Columns Layout) */}
      <section className="tc-section tc-explore-topics-section">
        <div className="tc-wrap">
          <div className="tc-section-head">
            <h2>Explore Topics</h2>
            <Link href="/news" className="tc-section-head__link">DISCOVER ALL &rarr;</Link>
          </div>
          <div className="tc-topics-grid">
            {activeExploreTopics.map((topic: any) => {
              const Icon = topic.icon;
              return (
                <Link
                  key={topic.label}
                  href={topic.href}
                  className="tc-topic-card group"
                  style={{ "--topic-accent": topic.color } as React.CSSProperties}
                >
                  <div className="tc-topic-card__top">
                    <div
                      className="tc-topic-card__icon"
                      style={{ backgroundColor: `${topic.color}15`, color: topic.color }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <ArrowRight className="tc-topic-card__arrow" />
                  </div>
                  <div className="tc-topic-card__content">
                    <h3 className="tc-topic-card__title">{topic.label}</h3>
                    <p className="tc-topic-card__sub">{topic.sub}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

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
