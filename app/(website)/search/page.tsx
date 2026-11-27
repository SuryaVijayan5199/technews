import type { Metadata } from "next";
import { Search, ChevronRight } from "lucide-react";
import Link from "next/link";
import { getCachedSearchResults } from "@/lib/cache/cached-queries";
import { FeedList } from "@/components/article/feed-list";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  return {
    title: query ? `Search results for "${query}" — TechCrest` : "Search Articles — TechCrest",
    description: query
      ? `Explore all TechCrest articles, reviews, and news matching "${query}".`
      : "Search technology news, hardware reviews, and industry analysis on TechCrest.",
  };
}

export default async function SearchResultsPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const results = query ? await getCachedSearchResults(query, 50) : [];

  return (
    <div className="tc-search-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="tc-author-breadcrumb">
          <Link href="/">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span>Search</span>
        </nav>

        {/* Search Header */}
        <div className="tc-search-header">
          <h1 className="tc-search-title">
            {query ? `Search Results for "${query}"` : "Search TechCrest"}
          </h1>

          <form action="/search" method="GET" className="tc-search-form">
            <div className="tc-search-input-wrap">
              <Search className="tc-search-icon" />
              <input
                id="main-search-input"
                name="q"
                type="search"
                defaultValue={query}
                placeholder="Search articles, topics, keywords..."
                className="tc-search-input"
                autoComplete="off"
              />
              <button type="submit" className="tc-search-submit-btn">
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        {query ? (
          <div>
            <div className="tc-search-meta">
              <span>
                Found <strong>{results.length}</strong> {results.length === 1 ? "result" : "results"} for &ldquo;{query}&rdquo;
              </span>
            </div>

            {results.length === 0 ? (
              <div className="tc-search-empty">
                <div className="tc-search-empty__icon">🔍</div>
                <h3>No articles found</h3>
                <p>
                  We couldn&apos;t find any stories matching &ldquo;{query}&rdquo;.
                  Try a different search term or explore our topic categories.
                </p>
                <Link href="/" className="tc-search-empty__btn">
                  Browse Latest News
                </Link>
              </div>
            ) : (
              <FeedList
                articles={results}
                fallbackCategorySlug="news"
                initialCount={10}
                step={10}
              />
            )}
          </div>
        ) : (
          <div className="tc-search-prompt">
            <div className="tc-search-empty__icon">📰</div>
            <h3>Discover TechCrest Stories</h3>
            <p>Type a keyword, company, or topic above to find articles and analysis.</p>
          </div>
        )}
      </div>
    </div>
  );
}
