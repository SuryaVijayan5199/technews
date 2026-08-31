"use client";

import { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { MessageSquare, Check, ShieldAlert, Trash2, Search, CheckCircle, AlertCircle, Loader2, RefreshCw, X } from "lucide-react";
import {
  getComments,
  moderateComment,
  deleteComment,
} from "@/lib/actions/dashboard.actions";

type Comment = {
  id: number;
  content: string | null;
  status: string;
  createdAt: Date;
  authorName: string | null;
  authorEmail: string | null;
  articleId: number | null;
  parentId: number | null;
  likeCount: number | null;
  articleTitle: string | null;
  articleSlug: string | null;
};

const STATUS_STYLE: Record<string, { color: string; bg: string; border: string }> = {
  pending: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)" },
  approved: { color: "#10b981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.25)" },
  rejected: { color: "#ef4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.25)" },
  spam: { color: "#6b7280", bg: "rgba(107,114,128,0.1)", border: "rgba(107,114,128,0.25)" },
};

function relativeTime(d: Date): string {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function CommentModerationPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "approved" | "spam">("all");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const load = () => {
    startTransition(async () => {
      const data = await getComments(activeTab);
      setComments(data as Comment[]);
    });
  };

  useEffect(() => { load(); }, [activeTab]);

  const handleModerate = (id: number, status: "approved" | "rejected" | "spam") => {
    startTransition(async () => {
      const result = await moderateComment(id, status);
      if (result.success) {
        showToast("success", `Comment marked as ${status}.`);
        setComments(prev => prev.map(c => c.id === id ? { ...c, status } : c));
      } else {
        showToast("error", result.error ?? "Failed.");
      }
    });
  };

  const handleDelete = (id: number) => {
    startTransition(async () => {
      const result = await deleteComment(id);
      if (result.success) {
        showToast("success", "Comment deleted.");
        setComments(prev => prev.filter(c => c.id !== id));
      } else {
        showToast("error", result.error ?? "Failed.");
      }
    });
  };

  const filtered = comments.filter(c =>
    (c.authorName ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (c.content ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (c.articleTitle ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const tabs = [
    { id: "all" as const, label: "All" },
    { id: "pending" as const, label: "Pending" },
    { id: "approved" as const, label: "Approved" },
    { id: "spam" as const, label: "Spam" },
  ];

  return (
    <div className="dashboard-page-container">
      {toast && (
        <div className={`dashboard-toast flex items-center gap-2 ${toast.type === "error" ? "text-red-400" : ""}`}>
          {toast.type === "success" ? <CheckCircle className="w-4 h-4 text-green-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
          <span>{toast.msg}</span>
        </div>
      )}

      <div className="dashboard-page-header">
        <div>
          <h1 className="dashboard-page-title flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-[var(--color-brand-400)]" /> Comment Moderation
          </h1>
          <p className="dashboard-page-subtitle">
            Review, approve, flag spam, and delete reader comments across all articles.
          </p>
        </div>
        <button onClick={load} disabled={isPending} className="btn btn-ghost" title="Refresh">
          <RefreshCw className={`w-4 h-4 ${isPending ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="dashboard-toolbar">
        <div className="dashboard-filter-tabs">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`dashboard-filter-btn ${activeTab === t.id ? "dashboard-filter-btn--active" : ""}`}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="dashboard-search-wrap">
          <Search className="dashboard-search-icon" />
          <input id="comment-search-input" type="text" value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search author, article, content…"
            className="input dashboard-search-input" />
        </div>
      </div>

      <div className="dashboard-card card">
        <div className="dashboard-table-container">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th className="th-title">Author</th>
                <th className="th-cat">Article</th>
                <th className="th-cat">Comment</th>
                <th className="th-status">Status</th>
                <th className="th-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isPending && comments.length === 0 ? (
                <tr><td colSpan={5} className="td-empty"><Loader2 className="w-4 h-4 animate-spin inline mr-2" />Loading…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="td-empty">
                  {comments.length === 0 ? "No comments yet." : "No comments match your search."}
                </td></tr>
              ) : filtered.map(c => {
                const s = STATUS_STYLE[c.status] ?? STATUS_STYLE.pending;
                return (
                  <tr key={c.id} className="dashboard-table-row">
                    <td className="td-title">
                      <div className="dashboard-comment-user">
                        <div className="dashboard-comment-avatar">
                          {(c.authorName?.[0] ?? "?").toUpperCase()}
                        </div>
                        <div>
                          <span className="dashboard-comment-author">{c.authorName ?? "Anonymous"}</span>
                          <p style={{ fontSize: "0.72rem", color: "var(--color-text-muted)" }}>{relativeTime(c.createdAt)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="td-cat">
                      {c.articleSlug ? (
                        <Link href={`/${c.articleSlug}`} target="_blank"
                          className="dashboard-comment-article hover:underline" style={{ color: "hsl(var(--color-brand-500))" }}>
                          {c.articleTitle?.slice(0, 40) ?? "Article"}…
                        </Link>
                      ) : (
                        <span className="dashboard-comment-article text-muted">—</span>
                      )}
                    </td>
                    <td className="td-cat">
                      <span className="dashboard-comment-excerpt">
                        {(c.content ?? "").slice(0, 100)}{(c.content?.length ?? 0) > 100 ? "…" : ""}
                      </span>
                    </td>
                    <td className="td-status">
                      <span style={{
                        display: "inline-flex", alignItems: "center",
                        padding: "0.2rem 0.55rem", borderRadius: "9999px",
                        fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase",
                        letterSpacing: "0.03em",
                        color: s.color, backgroundColor: s.bg, border: `1px solid ${s.border}`,
                      }}>
                        {c.status}
                      </span>
                    </td>
                    <td className="td-actions">
                      <div className="dashboard-action-group">
                        {c.status !== "approved" && (
                          <button onClick={() => handleModerate(c.id, "approved")} disabled={isPending}
                            className="dashboard-action-btn dashboard-action-btn--edit" title="Approve">
                            <Check className="w-4 h-4 text-green-400" />
                          </button>
                        )}
                        {c.status !== "spam" && (
                          <button onClick={() => handleModerate(c.id, "spam")} disabled={isPending}
                            className="dashboard-action-btn" title="Mark as Spam">
                            <ShieldAlert className="w-4 h-4 text-amber-400" />
                          </button>
                        )}
                        <button onClick={() => handleDelete(c.id)} disabled={isPending}
                          className="dashboard-action-btn dashboard-action-btn--delete" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
