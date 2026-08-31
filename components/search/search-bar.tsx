"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, TrendingUp, Clock, ArrowRight, Loader2, FileText } from "lucide-react";
import Link from "next/link";
import { searchPublicArticles } from "@/lib/actions/article.actions";

const DYNAMIC_TOPICS = [
  "AI",
  "Security",
  "Phone",
  "EVs",
  "Robotic",
  "Fitness",
  "Audio",
  "Crypto",
  "News",
  "Smart Home",
];

interface SearchBarProps {
  onClose: () => void;
}

export function SearchBar({ onClose }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [liveResults, setLiveResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("techcrest_recent_searches");
      if (saved) {
        setRecentSearches(JSON.parse(saved).slice(0, 5));
      }
    } catch {
      // ignore
    }
  }, []);

  // Save recent search
  const saveRecentSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    try {
      const cleaned = searchTerm.trim();
      const updated = [cleaned, ...recentSearches.filter((s) => s.toLowerCase() !== cleaned.toLowerCase())].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem("techcrest_recent_searches", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleSearchSubmit = (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    saveRecentSearch(searchTerm);
    onClose();
    window.location.href = `/search?q=${encodeURIComponent(searchTerm.trim())}`;
  };

  useEffect(() => {
    inputRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  // Live search effect as user types
  useEffect(() => {
    if (!query.trim()) {
      setLiveResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const results = await searchPublicArticles(query, 5);
        setLiveResults(results || []);
      } catch (err) {
        console.error("Live search error:", err);
        setLiveResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div
      className="search-modal"
      onClick={onClose}
    >
      <div className="search-modal__backdrop" />
      <div
        className="search-modal__content glass"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Group */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearchSubmit(query);
          }}
          className="search-input-group"
        >
          {isLoading ? (
            <Loader2 className="search-input-group__icon animate-spin text-[var(--color-brand-400)]" />
          ) : (
            <Search className="search-input-group__icon" />
          )}
          <input
            ref={inputRef}
            id="search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search news, topics, articles…"
            className="search-input-group__field"
            aria-label="Search"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="search-input-group__clear"
              aria-label="Clear search"
            >
              <X className="search-input-group__icon" />
            </button>
          )}
          <button type="button" onClick={onClose} className="p-1 rounded text-muted-foreground hover:text-white">
            <X className="w-5 h-5 sm:hidden" />
            <kbd className="search-input-group__kbd hidden sm:inline-block">Esc</kbd>
          </button>
        </form>

        {/* Suggestions & Live Results */}
        <div className="search-suggestions">
          {!query && (
            <>
              {/* Real Local Storage Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="search-section">
                  <div className="flex items-center justify-between mb-2">
                    <p className="search-section__title">
                      <Clock className="search-section__icon" /> Recent Searches
                    </p>
                    <button
                      onClick={() => {
                        setRecentSearches([]);
                        localStorage.removeItem("techcrest_recent_searches");
                      }}
                      className="text-[10px] text-muted-foreground hover:text-red-400 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="search-list">
                    {recentSearches.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSearchSubmit(s)}
                        className="search-list__item"
                      >
                        <span>{s}</span>
                        <ArrowRight className="search-list__icon" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Dynamic Trending Category Topics */}
              <div className="search-section">
                <p className="search-section__title">
                  <TrendingUp className="search-section__icon" /> Popular Topics
                </p>
                <div className="search-tags flex flex-wrap gap-2 mt-2">
                  {DYNAMIC_TOPICS.map((topic) => (
                    <button
                      key={topic}
                      onClick={() => handleSearchSubmit(topic)}
                      className="search-tag px-3 py-1.5 rounded-full text-xs font-semibold bg-[var(--color-surface-2)] border border-[var(--color-surface-border)] hover:bg-[#2D7FF9] hover:text-white transition-all"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Live Search Result Cards */}
          {query && (
            <div className="search-results-preview mt-2">
              <div className="flex items-center justify-between mb-3 border-b border-[var(--color-surface-border)] pb-2">
                <p className="text-xs text-muted-foreground">
                  Live Results for <strong className="text-[var(--color-text-primary)]">&quot;{query}&quot;</strong>
                </p>
                {liveResults.length > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">
                    {liveResults.length} found
                  </span>
                )}
              </div>

              {liveResults.length > 0 ? (
                <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
                  {liveResults.map((article) => (
                    <Link
                      key={article.id}
                      href={`/${article.category?.slug ?? "news"}/${article.slug}`}
                      className="flex items-center gap-3 p-2 rounded-lg bg-[var(--color-surface-1)] hover:bg-[#2D7FF9]/20 transition-all border border-[var(--color-surface-border)] group"
                      onClick={() => {
                        saveRecentSearch(query);
                        onClose();
                      }}
                    >
                      {article.heroImage ? (
                        <img
                          src={article.heroImage}
                          alt={article.title}
                          className="w-12 h-12 rounded object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded bg-[var(--color-surface-2)] flex items-center justify-center text-muted-foreground flex-shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                      )}
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-400">
                            {article.category?.name ?? "NEWS"}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-[var(--color-text-primary)] group-hover:text-blue-400 transition-colors truncate">
                          {article.title}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-blue-400 flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              ) : !isLoading ? (
                <div className="py-6 text-center text-xs text-muted-foreground">
                  No published articles found matching &quot;{query}&quot;.
                </div>
              ) : null}

              <div className="mt-3 pt-2 border-t border-[var(--color-surface-border)] text-right">
                <Link
                  href={`/search?q=${encodeURIComponent(query)}`}
                  className="search-results-preview__link inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-brand-400)] hover:underline"
                  onClick={() => {
                    saveRecentSearch(query);
                    onClose();
                  }}
                >
                  View full search results <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}