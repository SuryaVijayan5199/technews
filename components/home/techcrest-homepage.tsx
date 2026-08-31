import Link from "next/link";
import Image from "next/image";
import {
  getFeaturedArticles,
  getLatestArticles,
  getTrendingArticles,
  getEditorsPicks,
  getBreakingArticle,
  getArticlesGroupedByTopics,
} from "@/lib/actions/article.actions";
import { HeroSectionCarousel } from "@/components/shared/hero-carousel";
import { NewsletterCta } from "@/components/shared/newsletter-cta";

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
  { label: "Phone", sub: "Smartphones • iOS • Android", href: "/phone" },
  { label: "Audio", sub: "Headphones • Speakers • Hi-Fi", href: "/audio" },
  { label: "Robotic", sub: "Humanoids • Drones • Automation", href: "/robotics" },
  { label: "Fitness", sub: "Wearables • Biosensors • Trackers", href: "/fitness" },
  { label: "Security", sub: "Zero-Trust • Privacy • Defense", href: "/security" },
  { label: "AI", sub: "LLMs • Autonomous Agents • Research", href: "/ai" },
  { label: "Home", sub: "Matter • Hubs • Energy Automation", href: "/smart-home" },
  { label: "EVs", sub: "Electric Vehicles • Charging • Battery", href: "/evs" },
  { label: "Crypto", sub: "Tokenization • Zero-Knowledge • DePIN", href: "/crypto" },
];

const PRINCIPLES = [
  { title: "NEWS", desc: "Fast, accurate coverage of important developments." },
  { title: "INSIGHTS", desc: "Context, analysis and meaningful interpretation." },
  { title: "IMPACT", desc: "The real-world consequences behind technology." },
];

const GLOBAL_FALLBACK = [
  { label: "01 / SIGNAL", title: "AI adoption is moving toward measurable outcomes", desc: "The next phase is about useful systems integrated into real workflows." },
  { label: "02 / SECURITY", title: "Identity is becoming an operating layer", desc: "Security architecture is increasingly built around context and verification." },
  { label: "03 / FUTURE", title: "Compute is becoming a strategic resource", desc: "Hardware, energy and efficiency are central to the next technology cycle." },
];

const BRIEF_LABELS = ["01 / SIGNAL", "02 / SECURITY", "03 / FUTURE"];

export async function TechCrestHomePage() {
  const [featured, latest, trending, editorsPicks, breakingArticle, topicShowcase] = await Promise.all([
    getFeaturedArticles(5),
    getLatestArticles(10),
    getTrendingArticles(5),
    getEditorsPicks(4),
    getBreakingArticle(),
    getArticlesGroupedByTopics(),
  ]);

  const heroArticle = featured[0] ?? null;
  const topStories = featured.slice(0, 5);
  const latestStories = latest.slice(0, 4);
  const mostRead = [...latest].sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0)).slice(0, 5);
  const briefItems = editorsPicks.slice(0, 3);
  const globalBriefing = trending.slice(0, 3);

  const filteredTopicShowcase = topicShowcase.filter(
    ({ category }) => category.slug !== "news" && category.name.toLowerCase() !== "news"
  );

  return (
    <div className="tc-page">
      {/* HERO SECTION CAROUSEL */}
      <HeroSectionCarousel articles={featured} />

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
                  {topStories[0].heroImage && <Image src={topStories[0].heroImage} alt={topStories[0].title} fill className="tc-story__art-img" />}
                </Link>
                <div className="tc-story__body">
                  <span className="tc-tag">{topStories[0].category?.name ?? "Technology"} &bull; COVER STORY</span>
                  <h3>
                    <Link href={`/${topStories[0].category?.slug ?? "news"}/${topStories[0].slug}`}>
                      {topStories[0].title}
                    </Link>
                  </h3>
                  <p>{topStories[0].excerpt ?? ""}</p>
                  <div className="tc-meta">
                    TechCrest Editorial &bull; {topStories[0].readingTimeMinutes ?? 5} min read &bull; {kViews(topStories[0].viewCount ?? 0)}
                    <Link href={`/${topStories[0].category?.slug ?? "news"}/${topStories[0].slug}`} className="tc-read-link">Read &rarr;</Link>
                  </div>
                </div>
              </article>
            ) : (
              <article className="tc-story tc-story--lead">
                <div className="tc-story__art tc-story__art--dark" />
                <div className="tc-story__body">
                  <span className="tc-tag">AI &bull; COVER STORY</span>
                  <h3>The Next Computing Shift Is Already Underway</h3>
                  <p>AI is moving from a feature inside products to a new computing layer.</p>
                  <div className="tc-meta">TechCrest Editorial &bull; 10 min read</div>
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
                    <span className="tc-tag">{story.category?.name ?? "Technology"}</span>
                    <h3><Link href={`/${story.category?.slug ?? "news"}/${story.slug}`}>{story.title}</Link></h3>
                    <p>{story.excerpt ?? ""}</p>
                    <div className="tc-meta">{story.readingTimeMinutes ?? 5} min read &bull; {timeAgo(story.publishedAt)}</div>
                  </div>
                </article>
              ) : (
                <article key={`fb-${i}`} className="tc-story">
                  <div className="tc-story__art tc-story__art--small" />
                  <div className="tc-story__body">
                    <span className="tc-tag">{["Cybersecurity", "Startups", "Hardware", "Mobility"][i] ?? "Tech"}</span>
                    <h3>{["Security teams are redesigning around identity", "Inside the infrastructure startups scaling globally", "Next-gen processors push power efficiency boundaries", "EV infrastructure transitions to unified standards"][i]}</h3>
                    <p>{["Access, context and continuous verification are becoming central.", "New platforms are reducing complexity for engineering teams.", "Silicon innovation is driving higher performance per watt.", "Charging networks are aligning on interoperable protocols."][i]}</p>
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
              {(latestStories.length > 0 ? latestStories : []).map((article, i) => (
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
              {latestStories.length === 0 && [
                { tag: "Artificial Intelligence", title: "Enterprise AI is shifting from pilots to production workflows", desc: "What changes when organizations begin measuring AI by business outcomes.", meta: "3 hours ago \u2022 7 min" },
                { tag: "Gadgets", title: "The hardware trends likely to define the next device cycle", desc: "On-device intelligence, efficient processors and new interfaces are converging.", meta: "4 hours ago \u2022 5 min" },
                { tag: "Business", title: "Why technology resilience is becoming a board-level priority", desc: "Cloud, data and security are now increasingly planned as one connected strategy.", meta: "6 hours ago \u2022 6 min" },
                { tag: "Science", title: "Researchers explore new paths toward efficient computing", desc: "New approaches could change the economics of compute-intensive workloads.", meta: "8 hours ago \u2022 4 min" },
              ].map((item, i) => (
                <article key={i} className="tc-latest-row">
                  <div className="tc-thumb" />
                  <div>
                    <span className="tc-tag">{item.tag}</span>
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                    <div className="tc-meta">{item.meta}</div>
                  </div>
                </article>
              ))}
            </div>
            <aside className="tc-most-read">
              <h3>Trending Stories</h3>
              {(mostRead.length > 0 ? mostRead : []).map((article, idx) => (
                <div key={article.id} className="tc-rank">
                  <span className="tc-rank__num">{String(idx + 1).padStart(2, "0")}</span>
                  <div>
                    <Link href={`/${article.category?.slug ?? "news"}/${article.slug}`}><b>{article.title}</b></Link>
                    <small>{(article.viewCount ?? 0) > 0 ? kViews(article.viewCount ?? 0) : (article.category?.name ?? "Top Story")}</small>
                  </div>
                </div>
              ))}
              {mostRead.length === 0 && [
                { title: "What the AI model race means for developers", tag: "AI" },
                { title: "The cybersecurity mistakes growing companies repeat", tag: "Security" },
                { title: "Inside the next generation of AI-first startups", tag: "News" },
                { title: "Cloud computing is entering another transition", tag: "Tech" },
                { title: "How new devices are changing everyday computing", tag: "Phone" },
              ].map((item, i) => (
                <div key={i} className="tc-rank">
                  <span className="tc-rank__num">{String(i + 1).padStart(2, "0")}</span>
                  <div><b>{item.title}</b><small>{item.tag}</small></div>
                </div>
              ))}
            </aside>
          </div>
        </div>
      </section>

      {/* TECHCREST BRIEFING */}
      <section className="tc-section">
        <div className="tc-wrap">
          <div className="tc-section-head">
            <h2>TechCrest Briefing</h2>
            <span className="tc-section-head__label">DAILY</span>
          </div>
          <div className="tc-brief-grid">
            <div className="tc-brief-panel">
              <div className="tc-brief-items">
                {(briefItems.length > 0 ? briefItems : []).map((item) => (
                  <div key={item.id} className="tc-brief-item">
                    <Link href={`/${item.category?.slug ?? "news"}/${item.slug}`}><b>{item.title}</b></Link>
                    <span>{item.category?.name ?? "Technology"}</span>
                  </div>
                ))}
                {briefItems.length === 0 && [
                  { b: "AI agents are becoming product infrastructure", s: "What to watch today" },
                  { b: "Security leaders are prioritizing identity-first controls", s: "Enterprise security" },
                  { b: "Investors are looking beyond headline AI valuations", s: "Markets & startups" },
                ].map((item, i) => (
                  <div key={i} className="tc-brief-item"><b>{item.b}</b><span>{item.s}</span></div>
                ))}
                <div className="tc-quote">
                  &ldquo;The strongest technology stories connect the launch, the business model and the real-world impact.&rdquo;
                  <small>&mdash; TechCrest Editorial Principle</small>
                </div>
              </div>
            </div>
            <div className="tc-dark-brief">
              <div className="tc-dark-brief__head">
                <h2>Global Briefing</h2>
                <span>SIGNAL &bull; SECURITY &bull; FUTURE</span>
              </div>
              <div className="tc-dark-brief__grid">
                {(globalBriefing.length > 0 ? globalBriefing : []).map((item, idx) => (
                  <article key={item.id} className="tc-dark-card">
                    <i>{BRIEF_LABELS[idx] ?? `0${idx + 1} / INSIGHT`}</i>
                    <h3><Link href={`/${item.category?.slug ?? "news"}/${item.slug}`}>{item.title}</Link></h3>
                    <p>{item.excerpt ?? ""}</p>
                  </article>
                ))}
                {globalBriefing.length === 0 && GLOBAL_FALLBACK.map((item) => (
                  <article key={item.label} className="tc-dark-card">
                    <i>{item.label}</i><h3>{item.title}</h3><p>{item.desc}</p>
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
              {filteredTopicShowcase.map(({ category, articles }) => (
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
                    {articles.map((art) => (
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
                          <div className="tc-meta text-[11px] mt-1">
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

      {/* EXPLORE TOPICS (Positioned Below Topic Coverage) */}
      <section className="tc-section">
        <div className="tc-wrap">
          <div className="tc-section-head">
            <h2>Explore Topics</h2>
            <Link href="/news">DISCOVER &rarr;</Link>
          </div>
          <div className="tc-topics-grid">
            {TOPICS.map((topic) => (
              <Link key={topic.label} href={topic.href} className="tc-topic">
                {topic.label}<span>{topic.sub}</span>
              </Link>
            ))}
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
