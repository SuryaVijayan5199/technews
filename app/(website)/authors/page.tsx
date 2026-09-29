import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Award, BookOpen } from "lucide-react";
import { getAuthorsWithStats } from "@/lib/actions/author.actions";
import { cleanAuthorName, getAuthorInitials } from "@/lib/utils";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Meet the TechCrest Editorial Team — Authors & Journalists",
  description:
    "Meet the TechCrest editorial team. Explore our journalists and tech experts covering AI, smartphones, cybersecurity, EVs, crypto, gaming and more.",
  alternates: {
    canonical: `${siteConfig.url}/authors`,
  },
  openGraph: {
    title: "Meet the TechCrest Editorial Team — Authors & Journalists",
    description:
      "Meet the TechCrest editorial team. Explore our journalists and tech experts covering AI, smartphones, cybersecurity, EVs, crypto, gaming and more.",
    url: `${siteConfig.url}/authors`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meet the TechCrest Editorial Team — Authors & Journalists",
    description:
      "Meet the TechCrest editorial team. Explore our journalists and tech experts covering AI, smartphones, cybersecurity, EVs, crypto, gaming and more.",
  },
};

export default async function AuthorsIndexPage() {
  const authorsList = await getAuthorsWithStats();

  return (
    <div className="tc-policy-page">
      <div className="tc-policy-page__container">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="tc-policy-page__breadcrumb">
          <Link href="/" className="tc-policy-page__breadcrumb-link">
            Home
          </Link>
          <ChevronRight className="tc-icon-xs" />
          <span className="tc-policy-page__breadcrumb-current">Authors</span>
        </nav>

        {/* Page Header */}
        <div className="tc-policy-page__header">
          <div className="tc-policy-page__badge">
            <Award className="tc-icon-xs" />
            <span>EDITORIAL TEAM & JOURNALISTS</span>
          </div>
          <h1 className="tc-policy-page__title">Meet Our Writers & Editors</h1>
          <p className="tc-policy-page__meta">
            Meet the TechCrest editorial team. Explore our journalists and tech
            experts covering AI, smartphones, cybersecurity, EVs, crypto, gaming
            and more.
          </p>
        </div>

        {/* Authors Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.5rem",
            marginTop: "2rem",
          }}
        >
          {authorsList.map((author: any) => {
            const displayName = cleanAuthorName(author.displayName);
            const initials = getAuthorInitials(displayName);

            return (
              <Link
                key={author.id}
                href={`/authors/${author.slug}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  padding: "1.75rem 1.25rem",
                  borderRadius: "1rem",
                  background: "hsl(var(--color-surface-1))",
                  border: "1px solid hsl(var(--color-surface-border))",
                  textDecoration: "none",
                  color: "inherit",
                  transition: "all 0.2s ease",
                }}
                className="tc-author-card"
              >
                <div
                  style={{
                    position: "relative",
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    marginBottom: "1rem",
                    background: "hsl(var(--color-surface-2))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "1.5rem",
                    color: "hsl(var(--color-text-secondary))",
                  }}
                >
                  {author.avatar ? (
                    <Image
                      src={author.avatar}
                      alt={displayName}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  ) : (
                    <span>{initials}</span>
                  )}
                </div>

                <h2
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: 700,
                    margin: "0 0 0.25rem",
                    color: "hsl(var(--color-text-primary))",
                  }}
                >
                  {displayName}
                </h2>

                {author.title && (
                  <p
                    style={{
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      color: "#2D7FF9",
                      margin: "0 0 0.5rem",
                    }}
                  >
                    {author.title}
                  </p>
                )}

                {author.bio && (
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "hsl(var(--color-text-secondary))",
                      lineHeight: 1.5,
                      margin: "0 0 1rem",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {author.bio}
                  </p>
                )}

                <div
                  style={{
                    marginTop: "auto",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: "hsl(var(--color-text-muted))",
                  }}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{author.articleCount ?? 0} Articles</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
