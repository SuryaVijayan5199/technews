import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound, permanentRedirect } from "next/navigation";
import { getCachedArticlesByCategory } from "@/lib/cache/cached-queries";
import { getAllCategories } from "@/lib/actions/article.actions";
import { cleanAuthorName } from "@/lib/utils";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

// ISR: revalidate category pages every 5 minutes (300 seconds). Instant purge on publish via invalidateArticleCache().
export const revalidate = 300;

export function generateStaticParams() {
  return [
    { category: "phone" },
    { category: "audio" },
    { category: "robotic" },
    { category: "fitness" },
    { category: "security" },
    { category: "ai" },
    { category: "home" },
    { category: "evs" },
    { category: "crypto" },
    { category: "gaming" },
  ];
}

import { siteConfig } from "@/config/site";

export const CATEGORY_META_DESCRIPTIONS: Record<string, string> = {
  phone: "Latest smartphone news, launches, reviews and updates from Apple, Samsung, Google and more. Stay ahead on iPhone, Android and mobile tech with TechCrest.",
  audio: "Headphone, earbud and speaker news, launches and reviews. Explore the latest audio gear from Sony, Bose, Apple and more on TechCrest.",
  robotics: "Robotics news covering humanoid robots, automation, AI hardware and industry funding. Track the machines shaping the future of work on TechCrest.",
  robotic: "Robotics news covering humanoid robots, automation, AI hardware and industry funding. Track the machines shaping the future of work on TechCrest.",
  fitness: "Fitness tech news on smartwatches, wearables, fitness trackers and health gadgets. Find the latest launches and trends to power your workouts on TechCrest.",
  security: "Cybersecurity news on data breaches, hacks, privacy threats and zero-day flaws. Stay informed and protect your data with TechCrest's security coverage.",
  ai: "Latest AI news on ChatGPT, LLMs, machine learning, AI startups and funding. Get fast updates and expert analysis on artificial intelligence at TechCrest.",
  "smart-home": "Smart home news on connected devices, hubs, appliances and home automation. Discover the latest gadgets and updates for a smarter home on TechCrest.",
  home: "Smart home news on connected devices, hubs, appliances and home automation. Discover the latest gadgets and updates for a smarter home on TechCrest.",
  evs: "Electric vehicle news on Tesla, EV launches, charging tech, self-driving and robotaxis. Follow the future of mobility with TechCrest's EV coverage.",
  crypto: "Crypto news on Bitcoin, stablecoins, exchanges, blockchain and Web3. Get the latest cryptocurrency updates and market-moving stories on TechCrest.",
  gaming: "Gaming news on consoles, PC games, Xbox, PlayStation, Nintendo and esports. Catch the latest game launches, industry updates and trends on TechCrest.",
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const rawSlug = category.toLowerCase().trim();
  const canonicalSlug = rawSlug === "robotics" ? "robotic" : rawSlug === "smart-home" ? "home" : rawSlug;

  const { category: cat } = await getCachedArticlesByCategory(canonicalSlug, 50);
  if (!cat) return { title: "Category Not Found" };

  const title = `${cat.name} — News, Reviews & Analysis`;
  const description = CATEGORY_META_DESCRIPTIONS[canonicalSlug] ?? cat.description ?? `Latest ${cat.name} news, in-depth reviews, and expert analysis on TechCrest.`;
  const canonicalUrl = `${siteConfig.url}/${cat.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: canonicalUrl,
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

function timeAgo(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: slug } = await params;
  const rawSlug = slug.toLowerCase().trim();

  // Redirect aliases: /robotics -> /robotic, /smart-home -> /home
  if (rawSlug === "robotics") {
    permanentRedirect("/robotic");
  }
  if (rawSlug === "smart-home") {
    permanentRedirect("/home");
  }

  const { category, articles } = await getCachedArticlesByCategory(rawSlug, 50);

  if (!category) notFound();

  const lead = articles.length > 0 ? articles[0] : null;
  const gridArticles = articles.length > 1 ? articles.slice(1) : [];
  const themeColor = category.color ?? "#2D7FF9";

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteConfig.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: category.name,
        item: `${siteConfig.url}/${category.slug}`,
      },
    ],
  };

  return (
    <div className="cat-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="cat-header" style={{ borderColor: themeColor }}>
        <div className="tc-wrap">
          <div className="cat-header__inner">
            <span className="tc-eyebrow" style={{ color: themeColor }}>
              TechCrest / {category.name}
            </span>
            <h1 className="cat-header__title">{category.name}</h1>
            {category.description && (
              <p className="cat-header__desc">{category.description}</p>
            )}
          </div>
        </div>
      </div>

      <div className="tc-wrap cat-body">
        {articles.length === 0 && (
          <div className="cat-empty">
            <div className="cat-empty__icon">&#128240;</div>
            <h2>No articles yet in {category.name}</h2>
            <p>Our editors are working on it. Check back soon.</p>
            <Link href="/" className="cat-empty__link">Back to Homepage</Link>
          </div>
        )}

        {lead && (
          <article className="cat-lead">
            <Link href={`/${lead.category?.slug ?? slug}/${lead.slug}`} className="cat-lead__art-wrap">
              <div className="cat-lead__art">
                {lead.heroImage && (
                  <Image src={lead.heroImage} alt={lead.title} fill className="cat-lead__img" priority />
                )}
              </div>
            </Link>
            <div className="cat-lead__body">
              <span className="tc-tag" style={{ color: themeColor }}>
                {lead.category?.name ?? category.name} &bull; FEATURED
              </span>
              <h2>
                <Link href={`/${lead.category?.slug ?? slug}/${lead.slug}`}>{lead.title}</Link>
              </h2>
              {lead.excerpt && <p className="cat-lead__excerpt">{lead.excerpt}</p>}
              <div className="cat-lead__meta">
                {lead.author?.displayName && <span>{cleanAuthorName(lead.author.displayName)}</span>}
                <span>{timeAgo(lead.publishedAt)}</span>
                <span>{lead.readingTimeMinutes ?? 5} min read</span>
              </div>
            </div>
          </article>
        )}

        {gridArticles.length > 0 && (
          <div className="cat-grid">
            {gridArticles.map((article: any) => (
              <article key={article.id} className="cat-card">
                <Link href={`/${article.category?.slug ?? slug}/${article.slug}`} className="cat-card__art-wrap">
                  <div className="cat-card__art">
                    {article.heroImage ? (
                      <Image src={article.heroImage} alt={article.title} fill className="cat-card__img" />
                    ) : null}
                  </div>
                </Link>
                <div className="cat-card__body">
                  <span className="tc-tag" style={{ color: themeColor }}>
                    {article.category?.name ?? category.name}
                  </span>
                  <h3>
                    <Link href={`/${article.category?.slug ?? slug}/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h3>
                  {article.excerpt && <p className="cat-card__excerpt">{article.excerpt}</p>}
                  <div className="cat-card__meta">
                    <span>{timeAgo(article.publishedAt)}</span>
                    <span>{article.readingTimeMinutes ?? 5} min read</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}