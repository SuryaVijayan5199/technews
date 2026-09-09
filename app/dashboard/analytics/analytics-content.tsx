"use client";

import { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { TrendingUp, Eye, FileText, MessageSquare, BarChart3, RefreshCw, ExternalLink, Loader2, FolderOpen } from "lucide-react";
import { getAnalyticsData, getDashboardStats } from "@/lib/actions/dashboard.actions";

type AnalyticsData = Awaited<ReturnType<typeof getAnalyticsData>>;

const STATUS_COLORS: Record<string, string> = {
  published: "#10b981",
  draft: "#6b7280",
  pending_review: "#f59e0b",
  seo_review: "#8b5cf6",
  scheduled: "#3b82f6",
  archived: "#ef4444",
};

function formatNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export default function AnalyticsDashboardContent() {
  const [data, setData] = useState<AnalyticsData>(null);
  const [stats, setStats] = useState<any>(null);
  const [isPending, startTransition] = useTransition();

  const load = () => {
    startTransition(async () => {
      const [result, statsResult] = await Promise.all([getAnalyticsData(), getDashboardStats()]);
      setData(result);
      setStats(statsResult);
    });
  };

  useEffect(() => { load(); }, []);

  const maxViews = Math.max(...(data?.topArticles ?? []).map((a: any) => a.viewCount ?? 0), 1);

  const statusBreakdown = data?.statusBreakdown ?? [];
  const totalArticles = statusBreakdown.reduce((sum: number, s: any) => sum + (s.count ?? 0), 0);

  return (
    <div className="dashboard-page-container">
      <div className="dashboard-page-header">
        <div>
          <h1 className="dashboard-page-title">
            <BarChart3 className="dashboard-page-icon" /> Publication Analytics
          </h1>
          <p className="dashboard-page-subtitle">
            Live platform stats pulled from your database — article performance, categories, and status breakdown.
          </p>
        </div>
        <button onClick={load} disabled={isPending} className="btn btn-ghost" title="Refresh data">
          <RefreshCw className={isPending ? "dashboard-spinner" : "dashboard-icon"} />
          <span className="dashboard-refresh-label">Refresh</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="analytics-metrics-grid">
        {[
          { label: "Total Views", value: formatNum(data?.totalViews ?? 0), icon: Eye, color: "#6366f1" },
          { label: "Published Articles", value: formatNum((data?.statusBreakdown ?? []).find((s: any) => s.status === "published")?.count ?? 0), icon: FileText, color: "#10b981" },
          { label: "Total Articles", value: formatNum(totalArticles), icon: TrendingUp, color: "#f59e0b" },
          { label: "Active Categories", value: formatNum(stats?.totalCategories ?? 0), icon: FolderOpen, color: "#8b5cf6" },
        ].map((s: any) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="dashboard-card analytics-stat-card">
              <div className="analytics-stat-card__top">
                <span className="analytics-stat-card__label">{s.label}</span>
                <div className="analytics-icon-wrap" style={{ backgroundColor: `${s.color}20` }}>
                  <Icon className="analytics-icon" style={{ color: s.color }} />
                </div>
              </div>
              <p className="analytics-stat-card__value">
                {isPending ? <Loader2 className="dashboard-spinner inline" /> : s.value}
              </p>
              <p className="analytics-stat-card__change">Live from database</p>
            </div>
          );
        })}
      </div>

      <div className="analytics-split-grid">
        {/* Top Articles by Views */}
        <div className="dashboard-card analytics-panel analytics-panel--stories">
          <div className="analytics-panel__header">
            <h2 className="analytics-panel__title">Top Articles by Views</h2>
            <span className="analytics-panel__subtitle">Published only</span>
          </div>
          <div className="analytics-stories-list">
            {isPending ? (
              <div style={{ textAlign: "center", padding: "2rem", color: "var(--color-text-muted)" }}>
                <Loader2 className="dashboard-spinner" />
              </div>
            ) : (data?.topArticles ?? []).length === 0 ? (
              <div style={{ textAlign: "center", padding: "2rem", color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
                No published articles yet.
              </div>
            ) : (
              (data?.topArticles ?? []).map((a: any, i: number) => (
                <div key={a.id} className="analytics-story-item">
                  <div className="analytics-story-item__top">
                    <div className="analytics-story-item__title-group">
                      <span className="analytics-story-item__rank">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="analytics-story-item__title" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 280 }}>
                        {a.title}
                      </span>
                    </div>
                    <div className="analytics-story-item__metrics">
                      <span>{formatNum(a.viewCount ?? 0)} views</span>
                      <Link href={`/${(a as any).categorySlug ? (a as any).categorySlug + '/' : ''}${a.slug}`} target="_blank" title="Open article">
                        <ExternalLink className="dashboard-icon-xs" style={{ color: "hsl(var(--color-brand-500))" }} />
                      </Link>
                    </div>
                  </div>
                  <div className="analytics-progress-bg">
                    <div className="analytics-progress-fill" style={{ width: `${((a.viewCount ?? 0) / maxViews) * 100}%` }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Article Status Breakdown */}
        <div className="dashboard-card analytics-panel analytics-panel--devices">
          <h2 className="analytics-panel__title">Article Status Breakdown</h2>
          <div className="analytics-devices-list">
            {isPending ? (
              <div style={{ textAlign: "center", padding: "2rem", color: "var(--color-text-muted)" }}>
                <Loader2 className="dashboard-spinner" />
              </div>
            ) : statusBreakdown.length === 0 ? (
              <div style={{ textAlign: "center", padding: "2rem", color: "var(--color-text-muted)", fontSize: "0.875rem" }}>No articles yet.</div>
            ) : statusBreakdown.map((s: any) => (
              <div key={s.status} className="analytics-device-item">
                <div className="analytics-device-item__top">
                  <span className="analytics-device-item__name" style={{ textTransform: "capitalize" }}>
                    <span style={{
                      display: "inline-block", width: 10, height: 10, borderRadius: "50%",
                      backgroundColor: STATUS_COLORS[s.status ?? "draft"] ?? "#6b7280",
                      marginRight: "0.5rem",
                    }} />
                    {(s.status ?? "Unknown").replace(/_/g, " ")}
                  </span>
                  <span className="analytics-device-item__share">
                    {s.count} ({totalArticles > 0 ? Math.round(((s.count ?? 0) / totalArticles) * 100) : 0}%)
                  </span>
                </div>
                <div className="analytics-progress-bg">
                  <div className="analytics-progress-fill" style={{
                    width: `${totalArticles > 0 ? ((s.count ?? 0) / totalArticles) * 100 : 0}%`,
                    backgroundColor: STATUS_COLORS[s.status ?? "draft"] ?? "#6b7280",
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* Articles by Category */}
          {(data?.byCategory ?? []).length > 0 && (
            <>
              <h3 style={{ fontSize: "0.875rem", fontWeight: 700, marginTop: "1.5rem", marginBottom: "0.75rem", color: "var(--color-text-primary)" }}>
                Articles by Category
              </h3>
              {(data?.byCategory ?? []).map((c: any) => (
                <div key={c.categoryId ?? "uncategorized"} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem", fontSize: "0.8rem" }}>
                  <span style={{ color: "var(--color-text-secondary)" }}>{c.categoryName ?? "Uncategorized"}</span>
                  <span style={{ fontWeight: 700, color: "var(--color-text-primary)" }}>{c.count}</span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
