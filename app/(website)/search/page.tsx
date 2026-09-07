import type { Metadata } from "next";
import { Search, ChevronRight } from "lucide-react";
import Link from "next/link";
import { ArticleCard } from "@/components/article/article-card";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q ?? "";
  return {
    title: query ? `Search results for "${query}" — TechCrest` : "Search Articles — TechCrest",
  };
}

import { searchPublicArticles } from "@/lib/actions/article.actions";

export default async function SearchResultsPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q ?? "";
  const results = query ? await searchPublicArticles(query, 20) : [];

  return (
    <div className="search-page">
      <div className="container">
        <nav aria-label="Breadcrumb" className="breadcrumb">
          <Link href="/" className="breadcrumb__link">Home</Link>
          <ChevronRight className="breadcrumb__separator" />
          <span className="breadcrumb__current">Search</span>
        </nav>

        {/* Search Header */}
        <div className="search-page__header">
          <h1 className="search-page__title">
            {query ? `Search Results for "${query}"` : "Search TechCrest"}
          </h1>
          <form action="/search" method="GET" className="search-page__form">
            <Search className="search-page__icon" />
            <input
              id="main-search-input"
              name="q"
              defaultValue={query}
              placeholder="Search articles, reviews, guides..."
              className="input search-page__input"
            />
          </form>
        </div>

        {/* Results */}
        {query ? (
          <div>
            <p className="search-page__meta">
              Found {results.length} results
            </p>
            <div className="search-page__grid">
              {results.map((result: any) => {
                const article = {
                  id: result.id,
                  title: result.title,
                  slug: result.slug,
                  excerpt: result.excerpt,
                  heroImage: result.heroImage,
                  publishedAt: result.publishedAt ? new Date(result.publishedAt).toISOString() : new Date().toISOString(),
                  readingTimeMinutes: result.readingTimeMinutes,
                  categorySlug: result.category?.slug,
                  categoryName: result.category?.name,
                  authorName: result.author?.displayName,
                };
                return <ArticleCard key={article.id} article={article as any} />;
              })}
            </div>
          </div>
        ) : (
          <div className="search-page__empty">
            Type a keyword above to start searching.
          </div>
        )}
      </div>
    </div>
  );
}
