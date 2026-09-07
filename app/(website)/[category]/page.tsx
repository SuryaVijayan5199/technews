import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getArticlesByCategory } from "@/lib/actions/article.actions";
import { cleanAuthorName } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const { category: cat } = await getArticlesByCategory(category, 1);
  if (!cat) return { title: "Category Not Found" };
  return {
    title: `${cat.name} — TechCrest`,
    description: cat.description ?? `Latest ${cat.name} news, reviews and insights on TechCrest.`,
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
  const { category, articles } = await getArticlesByCategory(slug);

  if (!category) notFound();

  const lead = articles[0] ?? null;
  const rest = articles.slice(1);

  return (
    <div className="cat-page">
      <div className="cat-header" style={{ borderColor: category.color ?? "#2D7FF9" }}>
        <div className="tc-wrap">
          <div className="cat-header__inner">
            <span className="tc-eyebrow" style={{ color: category.color ?? "#2D7FF9" }}>
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
                  <Image src={lead.heroImage} alt={lead.title} fill className="cat-lead__img" />
                )}
              </div>
            </Link>
            <div className="cat-lead__body">
              <span className="tc-tag" style={{ color: category.color ?? "#2D7FF9" }}>
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
                {(lead.viewCount ?? 0) > 0 && <span>{(lead.viewCount ?? 0).toLocaleString()} views</span>}
              </div>
            </div>
          </article>
        )}

        {rest.length > 0 && (
          <div className="cat-grid">
            {rest.map((article: any) => (
              <article key={article.id} className="cat-card">
                <Link href={`/${article.category?.slug ?? slug}/${article.slug}`} className="cat-card__art-wrap">
                  <div className="cat-card__art">
                    {article.heroImage ? (
                      <Image src={article.heroImage} alt={article.title} fill className="cat-card__img" />
                    ) : null}
                  </div>
                </Link>
                <div className="cat-card__body">
                  <span className="tc-tag" style={{ color: category.color ?? "#2D7FF9" }}>
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