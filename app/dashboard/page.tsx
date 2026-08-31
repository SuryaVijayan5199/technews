import Link from "next/link";
import { Plus, FileText, Eye, MessageSquare, Clock, TrendingUp, CheckCircle, LayoutDashboard, Sparkles } from "lucide-react";
import { getDashboardStats } from "@/lib/actions/dashboard.actions";
import { getFeaturedArticles } from "@/lib/actions/article.actions";
import { HeroCarousel } from "@/components/shared/hero-carousel";

export const metadata = { title: "Dashboard — TechCrest CMS" };

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

const STATUS_COLORS: Record<string, string> = {
  published: "#10b981",
  draft: "#6b7280",
  pending_review: "#f59e0b",
  seo_review: "#8b5cf6",
  scheduled: "#3b82f6",
  archived: "#ef4444",
};

export default async function DashboardOverviewPage() {
  const [stats, featuredArticles] = await Promise.all([
    getDashboardStats(),
    getFeaturedArticles(5),
  ]);

  const statCards = [
    {
      label: "Total Views",
      value: formatNumber(stats?.totalViews ?? 0),
      sub: `${stats?.publishedArticles ?? 0} published articles`,
      icon: Eye,
      color: "#6366f1",
    },
    {
      label: "Published Articles",
      value: formatNumber(stats?.publishedArticles ?? 0),
      sub: `${stats?.draftArticles ?? 0} drafts · ${stats?.pendingArticles ?? 0} pending`,
      icon: FileText,
      color: "#10b981",
    },
    {
      label: "Total Comments",
      value: formatNumber(stats?.totalComments ?? 0),
      sub: `${stats?.pendingComments ?? 0} awaiting moderation`,
      icon: MessageSquare,
      color: "#f59e0b",
    },
    {
      label: "Registered Users",
      value: formatNumber(stats?.totalUsers ?? 0),
      sub: `${stats?.totalCategories ?? 0} active categories`,
      icon: TrendingUp,
      color: "#8b5cf6",
    },
  ];

  return (
    <div className="dashboard-overview">
      {/* Header */}
      <div className="dashboard-overview__header">
        <div>
          <h1 className="dashboard-overview__title flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-[var(--color-brand-400)]" />
            Editorial Dashboard
          </h1>
          <p className="dashboard-overview__subtitle">
            Live platform stats — articles, readers, comments, and pending workflows.
          </p>
        </div>
        <Link href="/dashboard/articles/new" className="btn btn-primary dashboard-overview__new-btn">
          <Plus className="dashboard-overview__new-icon" /> New Article
        </Link>
      </div>

      {/* Top 5 News Carousel Preview */}
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[var(--color-text-primary)] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#2D7FF9]" /> Top 5 News Carousel (Live Preview)
            </h2>
            <p className="text-xs text-[var(--color-text-muted)]">
              This interactive carousel displays the top 5 featured stories across the homepage and CMS.
            </p>
          </div>
          <Link href="/dashboard/articles" className="text-xs font-bold text-[#2D7FF9] hover:underline">
            Manage Featured Articles &rarr;
          </Link>
        </div>
        <div style={{ maxWidth: 540, width: "100%" }}>
          <HeroCarousel articles={featuredArticles} />
        </div>
      </div>

      {/* Live Stat Cards */}
      <div className="dashboard-overview__stats">
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card dashboard-stat">
              <div className="dashboard-stat__header">
                <span className="dashboard-stat__label">{s.label}</span>
                <div className="dashboard-stat__icon-wrap" style={{ backgroundColor: `${s.color}20` }}>
                  <Icon className="dashboard-stat__icon" style={{ color: s.color }} />
                </div>
              </div>
              <p className="dashboard-stat__value">{s.value}</p>
              <p className="dashboard-stat__change" style={{ color: "var(--color-text-muted)", fontSize: "0.8rem" }}>
                {s.sub}
              </p>
            </div>
          );
        })}
      </div>

      {/* Workflow Grid */}
      <div className="dashboard-overview__workflow">
        {/* Recent Articles */}
        <div className="dashboard-workflow-card card">
          <div className="dashboard-workflow-card__header">
            <h2 className="dashboard-workflow-card__title">Recent Articles</h2>
            <Link href="/dashboard/articles" className="dashboard-workflow-card__link">View all →</Link>
          </div>
          <div className="dashboard-workflow-card__list">
            {(stats?.recentArticles ?? []).length === 0 ? (
              <div style={{ textAlign: "center", padding: "2rem", color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
                No articles yet. <Link href="/dashboard/articles/new" style={{ color: "hsl(var(--color-brand-500))" }}>Write your first article →</Link>
              </div>
            ) : (
              stats!.recentArticles.map((a) => (
                <div key={a.id} className="dashboard-draft-item">
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 className="dashboard-draft-item__title" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {a.title}
                    </h3>
                    <p className="dashboard-draft-item__meta">
                      {a.viewCount} views · {a.publishedAt
                        ? new Date(a.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                        : new Date(a.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                  <span
                    className="status-badge"
                    style={{
                      backgroundColor: `${STATUS_COLORS[a.status] ?? "#6b7280"}18`,
                      color: STATUS_COLORS[a.status] ?? "#6b7280",
                      border: `1px solid ${STATUS_COLORS[a.status] ?? "#6b7280"}40`,
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {a.status.replace("_", " ")}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-quick-actions card">
          <h2 className="dashboard-quick-actions__title">Quick Actions</h2>
          <div className="dashboard-quick-actions__list">
            <Link href="/dashboard/articles/new" className="btn btn-ghost dashboard-quick-actions__btn">
              <Plus className="dashboard-quick-actions__icon dashboard-quick-actions__icon--brand" />
              Write New Article
            </Link>
            <Link href="/dashboard/comments" className="btn btn-ghost dashboard-quick-actions__btn">
              <MessageSquare className="dashboard-quick-actions__icon dashboard-quick-actions__icon--teal" />
              Moderate Comments
              {(stats?.pendingComments ?? 0) > 0 && (
                <span style={{
                  marginLeft: "auto", backgroundColor: "#ef4444",
                  color: "#fff", borderRadius: "9999px", fontSize: "0.7rem",
                  fontWeight: 700, padding: "0.1rem 0.45rem",
                }}>
                  {stats!.pendingComments}
                </span>
              )}
            </Link>
            <Link href="/dashboard/categories" className="btn btn-ghost dashboard-quick-actions__btn">
              <FileText className="dashboard-quick-actions__icon dashboard-quick-actions__icon--purple" />
              Manage Categories
            </Link>
            <Link href="/dashboard/analytics" className="btn btn-ghost dashboard-quick-actions__btn">
              <TrendingUp className="dashboard-quick-actions__icon" style={{ color: "#f59e0b" }} />
              View Analytics
            </Link>
            <Link href="/dashboard/team" className="btn btn-ghost dashboard-quick-actions__btn">
              <CheckCircle className="dashboard-quick-actions__icon" style={{ color: "#10b981" }} />
              Manage Editorial Team
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Comments */}
      {(stats?.recentComments ?? []).length > 0 && (
        <div className="dashboard-workflow-card card">
          <div className="dashboard-workflow-card__header">
            <h2 className="dashboard-workflow-card__title">Recent Comments</h2>
            <Link href="/dashboard/comments" className="dashboard-workflow-card__link">Moderate →</Link>
          </div>
          <div className="dashboard-workflow-card__list">
            {stats!.recentComments.map((c) => (
              <div key={c.id} className="dashboard-draft-item">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="dashboard-draft-item__title" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    <strong>{c.authorName ?? "Anonymous"}</strong>: {c.content?.slice(0, 80)}…
                  </p>
                  <p className="dashboard-draft-item__meta">
                    {new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <span className={`status-badge status-badge--${c.status}`}>{c.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
