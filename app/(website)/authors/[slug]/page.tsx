import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle, Globe, ChevronRight } from "lucide-react";
import { ArticleCard } from "@/components/article/article-card";
import { getCachedAuthorBySlugWithArticles } from "@/lib/cache/cached-queries";
import { getAuthorsWithStats } from "@/lib/actions/author.actions";

export const dynamic = "force-dynamic";

interface AuthorPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = await getCachedAuthorBySlugWithArticles(slug);

  if (!author) {
    return {
      title: "Author Not Found | TechCrest",
    };
  }

  return {
    title: `${author.displayName} — Author Profile | TechCrest`,
    description: author.bio || `${author.displayName} is an official TechCrest staff writer & contributor.`,
  };
}

export default async function AuthorProfilePage({ params }: AuthorPageProps) {
  const { slug } = await params;
  const author = await getCachedAuthorBySlugWithArticles(slug);

  if (!author) {
    notFound();
  }

  const avatarUrl =
    author.avatar ||
    `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(author.displayName)}`;

  const roleTitle = author.user?.role
    ? author.user.role.replace(/_/g, " ").toUpperCase()
    : "AUTHOR";

  return (
    <div className="tc-author-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="tc-author-breadcrumb">
          <Link href="/">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span>Authors</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span>{author.displayName}</span>
        </nav>

        {/* Author Bio Card */}
        <div className="tc-author-card">
          <div className="tc-author-card__header">
            <div className="tc-author-card__avatar-wrap">
              <Image
                src={avatarUrl}
                alt={author.displayName}
                fill
                className="tc-author-card__avatar-img"
              />
              {author.isVerified && (
                <div className="tc-author-card__verified-badge" title="Verified Author">
                  <CheckCircle className="w-4 h-4 text-[#2D7FF9]" />
                </div>
              )}
            </div>
            <div className="tc-author-card__info">
              <div>
                <h1 className="tc-author-card__name">
                  {author.displayName}
                </h1>
                <p className="tc-author-card__role">
                  {roleTitle}
                </p>
              </div>

              {author.bio ? (
                <p className="tc-author-card__bio">
                  {author.bio}
                </p>
              ) : (
                <p className="tc-author-card__bio italic text-muted-foreground">
                  Official author profile at TechCrest.
                </p>
              )}

              <div className="tc-author-card__stats">
                <span className="tc-author-card__stat-item">
                  {author.articleCount} {author.articleCount === 1 ? "Article Published" : "Articles Published"}
                </span>
                {author.websiteUrl && (
                  <>
                    <span>•</span>
                    <a
                      href={author.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#2D7FF9] inline-flex items-center gap-1"
                    >
                      <Globe className="w-3.5 h-3.5" /> Website
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Author's Articles Feed */}
        <div>
          <h2 className="tc-author-articles__heading">
            Articles by {author.displayName}
          </h2>

          {author.articles.length === 0 ? (
            <div className="tc-author-empty-card">
              <p>No articles published by {author.displayName} yet.</p>
            </div>
          ) : (
            <div className="tc-author-articles__grid">
              {author.articles.map((article: any) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
