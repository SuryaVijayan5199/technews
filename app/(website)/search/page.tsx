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

const MOCK_SEARCH_RESULTS = [
  {
    id: 1,
    title: "OpenAI GPT-5 Deep Dive Review",
    slug: "openai-gpt5-deep-dive-next-frontier-ai",
    excerpt: "We tested GPT-5 for two weeks. Here's our complete analysis.",
    heroImage: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&h=375&fit=crop&q=80",
    publishedAt: "2026-07-30T10:00:00Z",
    readingTimeMinutes: 12,
    categorySlug: "ai",
    categoryName: "AI",
    authorName: "Dr. Sarah Chen",
  },
  {
    id: 2,
    title: "The Rise of Agentic AI: How Autonomous Models Are Changing Software",
    slug: "rise-agentic-ai-autonomous-models-software-development",
    excerpt: "Agentic AI systems that can plan, execute, and self-correct.",
    heroImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=375&fit=crop&q=80",
    publishedAt: "2026-07-30T09:00:00Z",
    readingTimeMinutes: 9,
    categorySlug: "ai",
    categoryName: "AI",
    authorName: "Dr. Kenji Nakamura",
  },
];

export default async function SearchResultsPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q ?? "";

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
              Found {MOCK_SEARCH_RESULTS.length} results
            </p>
            <div className="search-page__grid">
              {MOCK_SEARCH_RESULTS.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
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
