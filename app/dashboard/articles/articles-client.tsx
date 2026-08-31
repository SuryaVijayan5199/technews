"use client";

import { useState, useMemo, useTransition } from "react";
import Link from "next/link";
import {
  Edit,
  Eye,
  Trash2,
  FileText,
  Calendar,
  TrendingUp,
  Search,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
} from "lucide-react";
import { RoleGate } from "@/components/shared/role-gate";
import { deleteArticleAction } from "@/lib/actions/article.actions";

type Category = { id: number; name: string; slug: string };

type Article = {
  id: number;
  title: string;
  slug: string;
  status: string;
  viewCount: number;
  publishedAt: Date | null;
  createdAt: Date;
  author: {
    displayName: string;
    user?: { name?: string | null };
  };
  category: {
    name: string;
    slug: string;
  };
};

type Props = {
  initialArticles: Article[];
  categories: Category[];
  initialTab: string;
  initialSearch: string;
  initialCategory: string;
  initialPage: number;
  pageSize: number;
};

const STATUS_TABS = [
  { id: "all", label: "All" },
  { id: "published", label: "Published" },
  { id: "pending_review", label: "In Review" },
  { id: "draft", label: "Drafts" },
  { id: "seo_review", label: "SEO Audit" },
  { id: "scheduled", label: "Scheduled" },
  { id: "archived", label: "Archived" },
];

/** Get just the author display name — no role labels */
function getAuthorName(author?: Article["author"]): string {
  if (!author) return "Unknown Author";
  // Prefer user.name (real name from auth), fallback to displayName
  return author.user?.name?.trim() || author.displayName || "Unknown Author";
}

export function ArticlesClient({
  initialArticles,
  categories,
  initialTab,
  initialSearch,
  initialCategory,
  initialPage,
  pageSize,
}: Props) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [isPending, startTransition] = useTransition();
  const [notification, setNotification] = useState<string | null>(null);

  // Filter state — all client-side for instant UX
  const [activeTab, setActiveTab] = useState(initialTab);
  const [search, setSearch] = useState(initialSearch);
  const [categorySlug, setCategorySlug] = useState(initialCategory);
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Compute filtered + paginated articles
  const filtered = useMemo(() => {
    let list = articles;

    // Status tab
    if (activeTab !== "all") {
      list = list.filter((a) => a.status === activeTab);
    }

    // Category
    if (categorySlug) {
      list = list.filter((a) => a.category?.slug === categorySlug);
    }

    // Search
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.author?.displayName?.toLowerCase().includes(q) ||
          a.category?.name?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [articles, activeTab, categorySlug, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  // Reset page when filters change
  const resetPage = () => setCurrentPage(1);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    resetPage();
  };

  const handleCategoryChange = (slug: string) => {
    setCategorySlug(slug);
    resetPage();
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    resetPage();
  };

  const clearFilters = () => {
    setActiveTab("all");
    setCategorySlug("");
    setSearch("");
    resetPage();
  };

  const hasActiveFilters = activeTab !== "all" || categorySlug !== "" || search.trim() !== "";

  // Delete handler
  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    startTransition(async () => {
      setNotification(`Deleting article...`);
      const result = await deleteArticleAction(id);
      if (result.success) {
        setArticles((prev) => prev.filter((a) => a.id !== id));
        setNotification("Article deleted successfully.");
      } else {
        setNotification(`Error: ${result.error}`);
      }
      setTimeout(() => setNotification(null), 3000);
    });
  };

  return (
    <div className="da-wrapper">
      {/* ── Toast ── */}
      {notification && (
        <div className="dashboard-toast flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* ── Status Tabs ── */}
      <div className="da-tabs-row">
        <div className="da-tabs">
          {STATUS_TABS.map((tab) => {
            const count =
              tab.id === "all"
                ? articles.length
                : articles.filter((a) => a.status === tab.id).length;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`da-tab${activeTab === tab.id ? " da-tab--active" : ""}`}
              >
                {tab.label}
                {count > 0 && (
                  <span className={`da-tab__badge${activeTab === tab.id ? " da-tab__badge--active" : ""}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Filters Bar ── */}
      <div className="da-filters-bar">
        {/* Search */}
        <div className="da-search-wrap">
          <Search className="da-search-icon" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by title, author, category…"
            className="da-search-input"
          />
          {search && (
            <button onClick={() => handleSearchChange("")} className="da-clear-btn" aria-label="Clear search">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Dropdown */}
        <div className="da-filter-wrap">
          <Filter className="da-filter-icon" />
          <select
            value={categorySlug}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="da-select"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Clear all filters */}
        {hasActiveFilters && (
          <button onClick={clearFilters} className="da-clear-all-btn">
            <X className="w-3.5 h-3.5" /> Clear Filters
          </button>
        )}

        {/* Results count */}
        <span className="da-results-count">
          {filtered.length} article{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Article List ── */}
      <div className="dashboard-articles-list" style={{ opacity: isPending ? 0.65 : 1 }}>
        {paginated.length === 0 ? (
          <div className="dashboard-articles-empty">
            <FileText className="w-8 h-8 text-[var(--color-text-muted)] mb-3" />
            <h3 className="font-semibold text-[var(--color-text-primary)]">No articles found</h3>
            <p className="text-sm text-[var(--color-text-muted)]">
              {hasActiveFilters ? "Try adjusting your filters." : "Create your first article."}
            </p>
          </div>
        ) : (
          paginated.map((article) => (
            <div key={article.id} className="dashboard-article-card">
              <div className="dashboard-article-card__main">
                <div className="dashboard-article-card__icon-wrap">
                  <FileText className="dashboard-article-card__icon" />
                </div>
                <div className="dashboard-article-card__info">
                  <h3 className="dashboard-article-card__title">{article.title}</h3>
                  <div className="dashboard-article-card__meta">
                    {/* Author name only — no role label */}
                    <span className="dashboard-article-card__author">
                      {getAuthorName(article.author)}
                    </span>
                    <span className="dashboard-article-card__dot">•</span>
                    <span className="dashboard-article-card__category">
                      {article.category?.name || "Uncategorized"}
                    </span>
                    {article.publishedAt && (
                      <>
                        <span className="dashboard-article-card__dot">•</span>
                        <span className="dashboard-article-card__date">
                          <Calendar className="w-3 h-3" />
                          {new Date(article.publishedAt).toLocaleDateString("en-IN")}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="dashboard-article-card__side">
                <div className="dashboard-article-card__stats">
                  <span className={`status-badge status-badge--${article.status}`}>
                    {article.status.replace(/_/g, " ")}
                  </span>
                  {article.viewCount > 0 && (
                    <span className="dashboard-article-card__views">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {article.viewCount >= 1000
                        ? `${(article.viewCount / 1000).toFixed(1)}K`
                        : article.viewCount}
                    </span>
                  )}
                </div>

                <div className="dashboard-article-card__actions">
                  <Link
                    href={`/dashboard/articles/${article.id}/edit`}
                    className="dashboard-article-btn dashboard-article-btn--edit"
                    title="Edit Article"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/${article.category?.slug || "news"}/${article.slug}`}
                    className="dashboard-article-btn dashboard-article-btn--view"
                    title="Preview Article"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <RoleGate action="delete_article">
                    <button
                      onClick={() => handleDelete(article.id, article.title)}
                      className="dashboard-article-btn dashboard-article-btn--delete"
                      title="Delete Article"
                      disabled={isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </RoleGate>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="da-pagination">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={safePage <= 1}
            className="da-page-btn"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 2)
            .reduce<(number | "...")[]>((acc, p, idx, arr) => {
              if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...");
              acc.push(p);
              return acc;
            }, [])
            .map((item, i) =>
              item === "..." ? (
                <span key={`ellipsis-${i}`} className="da-page-ellipsis">…</span>
              ) : (
                <button
                  key={item}
                  onClick={() => setCurrentPage(item as number)}
                  className={`da-page-btn${safePage === item ? " da-page-btn--active" : ""}`}
                >
                  {item}
                </button>
              )
            )}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage >= totalPages}
            className="da-page-btn"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <span className="da-page-info">
            Page {safePage} of {totalPages} · {filtered.length} total
          </span>
        </div>
      )}
    </div>
  );
}
