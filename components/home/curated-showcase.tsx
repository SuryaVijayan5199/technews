import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  TrendingUp,
  Coins,
  ShieldCheck,
  ArrowRight,
  BookmarkCheck,
  Cpu,
  Layers,
} from "lucide-react";

interface ShowcaseArticle {
  id: number | string;
  title: string;
  slug: string;
  excerpt?: string | null;
  heroImage?: string | null;
  publishedAt?: Date | string | null;
  readingTimeMinutes?: number | null;
  category?: {
    slug?: string | null;
    name?: string | null;
  } | null;
  author?: {
    displayName?: string | null;
  } | null;
}

interface CuratedShowcaseProps {
  editorsPicks: ShowcaseArticle[];
  inFocus: ShowcaseArticle[];
  cryptoWatch: ShowcaseArticle[];
  exclusive: ShowcaseArticle[];
}

function timeAgo(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

interface BoxItemProps {
  title: string;
  accentColor: string;
  viewAllHref: string;
  articles: ShowcaseArticle[];
}

function ShowcaseBox({
  title,
  accentColor,
  viewAllHref,
  articles,
}: BoxItemProps) {
  const lead = articles[0] ?? null;
  const list = articles.slice(1, 4);
  const leadCategorySlug = lead?.category?.slug || "ai";
  const leadHref = lead ? `/${leadCategorySlug}/${lead.slug}` : "#";

  return (
    <div className="tc-curated-box">
      {/* Box Header (Formal Editorial Standard) */}
      <div className="tc-curated-box__head">
        <div className="tc-curated-box__title-wrap">
          <span
            className="tc-curated-box__accent-bar"
            style={{ backgroundColor: accentColor }}
          />
          <h3 className="tc-curated-box__title">{title}</h3>
        </div>
        <Link href={viewAllHref} className="tc-curated-box__more-link">
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Lead Story (Hero of Box) */}
      {lead && (
        <article className="tc-curated-box__lead">
          <Link href={leadHref} className="tc-curated-box__lead-art">
            {lead.heroImage ? (
              <Image
                src={lead.heroImage}
                alt={lead.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                className="tc-curated-box__lead-img"
              />
            ) : (
              <div className="tc-curated-box__lead-placeholder" />
            )}
          </Link>
          <div className="tc-curated-box__lead-body">
            <div className="tc-curated-box__lead-kicker" style={{ color: accentColor }}>
              {lead.category?.name ?? "Special Coverage"}
            </div>
            <h4 className="tc-curated-box__lead-title">
              <Link href={leadHref}>
                {lead.title}
              </Link>
            </h4>
            {lead.excerpt && (
              <p className="tc-curated-box__lead-excerpt">
                {lead.excerpt}
              </p>
            )}
            <div className="tc-curated-box__lead-meta">
              <span>{timeAgo(lead.publishedAt)}</span>
              {lead.readingTimeMinutes ? (
                <>
                  <span>&bull;</span>
                  <span>{lead.readingTimeMinutes} min read</span>
                </>
              ) : null}
            </div>
          </div>
        </article>
      )}

      {/* Additional List Stories to Fully Cover Card Space */}
      {list.length > 0 && (
        <div className="tc-curated-box__list">
          {list.map((art) => {
            const artCatSlug = art.category?.slug || "ai";
            const artHref = `/${artCatSlug}/${art.slug}`;
            return (
              <article key={art.id} className="tc-curated-box__list-item">
                <Link
                  href={artHref}
                  className="tc-curated-box__list-thumb"
                >
                  {art.heroImage ? (
                    <Image
                      src={art.heroImage}
                      alt={art.title}
                      fill
                      sizes="54px"
                      className="object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-800 rounded-md" />
                  )}
                </Link>
                <div className="tc-curated-box__list-content">
                  <h5 className="tc-curated-box__list-title">
                    <Link href={artHref}>
                      {art.title}
                    </Link>
                  </h5>
                  <span className="tc-curated-box__list-meta">
                    {timeAgo(art.publishedAt)}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function CuratedShowcase({
  editorsPicks,
  inFocus,
  cryptoWatch,
  exclusive,
}: CuratedShowcaseProps) {
  return (
    <section className="tc-section tc-curated-showcase-section">
      <div className="tc-wrap">
        <div className="tc-curated-layout-3col">
          {/* ──────────────────────────────────────────────
              LEFT 2 COLUMNS: 4 Boxes in a 2x2 Grid
             ────────────────────────────────────────────── */}
          <div className="tc-curated-boxes-grid">
            {/* Box 1: Editor's Picks */}
            <ShowcaseBox
              title="Editor’s Picks"
              accentColor="#2D7FF9"
              viewAllHref="/authors/bibhu"
              articles={editorsPicks}
            />

            {/* Box 2: In Focus */}
            <ShowcaseBox
              title="In Focus"
              accentColor="#a855f7"
              viewAllHref="/phone"
              articles={inFocus}
            />

            {/* Box 3: Crypto Watch */}
            <ShowcaseBox
              title="Crypto Watch"
              accentColor="#f97316"
              viewAllHref="/crypto"
              articles={cryptoWatch}
            />

            {/* Box 4: Exclusive */}
            <ShowcaseBox
              title="Exclusive"
              accentColor="#10b981"
              viewAllHref="/ai"
              articles={exclusive}
            />
          </div>

          {/* ──────────────────────────────────────────────
              THIRD RIGHT COLUMN: 2 Banners (without CTA)
             ────────────────────────────────────────────── */}
          <div className="tc-curated-banners-col">
            {/* Banner 1: TechCrest Discovery */}
            <aside className="tc-curated-banner-card tc-curated-banner-card--blue">
              <div className="tc-curated-banner-card__tech-bg" />
              <div className="tc-curated-banner-card__glow tc-curated-banner-card__glow--blue" />
              <div className="tc-curated-banner-card__watermark">
                <Cpu className="w-48 h-48" />
              </div>

              <div className="tc-curated-banner-card__content">
                <div className="tc-curated-banner-card__badge">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>TECHCREST DISCOVERY</span>
                </div>

                <h3 className="tc-curated-banner-card__headline">
                  STAY AHEAD.
                  <br />
                  STAY INFORMED.
                </h3>

                <p className="tc-curated-banner-card__desc">
                  Your world of technology, AI, innovation and digital breakthroughs.
                </p>

                <div className="tc-curated-banner-card__quote">
                  Discover the stories shaping tomorrow, today.
                </div>
              </div>
            </aside>

            {/* Banner 2: Daily Intelligence */}
            <aside className="tc-curated-banner-card tc-curated-banner-card--purple">
              <div className="tc-curated-banner-card__tech-bg" />
              <div className="tc-curated-banner-card__glow tc-curated-banner-card__glow--purple" />
              <div className="tc-curated-banner-card__watermark">
                <Layers className="w-48 h-48" />
              </div>

              <div className="tc-curated-banner-card__content">
                <div className="tc-curated-banner-card__badge">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>DAILY INTELLIGENCE</span>
                </div>

                <h3 className="tc-curated-banner-card__headline">
                  THE FUTURE IS HAPPENING.
                  <br />
                  WE COVER IT.
                </h3>

                <p className="tc-curated-banner-card__desc">
                  From next-generation gadgets and AI breakthroughs to crypto and
                  emerging technologies, stay connected to what matters.
                </p>

                <div className="tc-curated-banner-card__quote">
                  Real-time reporting on the tech decisions reshaping our world.
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
