"use client";

import { useState, useTransition } from "react";
import { Mail, Search, Trash2, Download, CheckCircle, Calendar, ShieldCheck, Users } from "lucide-react";
import { deleteSubscriberAction } from "@/lib/actions/newsletter.actions";

type Subscriber = {
  id: number;
  email: string;
  name: string | null;
  isConfirmed: boolean;
  createdAt: string | Date;
};

export function SubscribersClient({ initialSubscribers }: { initialSubscribers: Subscriber[] }) {
  const [subscribers, setSubscribers] = useState<Subscriber[]>(initialSubscribers);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const [notification, setNotification] = useState<string | null>(null);

  const filtered = subscribers.filter((s) =>
    s.email.toLowerCase().includes(search.trim().toLowerCase())
  );

  const handleDelete = (id: number, email: string) => {
    if (!confirm(`Remove "${email}" from subscribers?`)) return;
    startTransition(async () => {
      const res = await deleteSubscriberAction(id);
      if (res.success) {
        setSubscribers((prev) => prev.filter((s) => s.id !== id));
        setNotification(`Subscriber ${email} removed.`);
        setTimeout(() => setNotification(null), 3000);
      }
    });
  };

  const handleExportCSV = () => {
    const headers = "ID,Email,Confirmed,SubscribedDate\n";
    const rows = filtered
      .map((s) => `${s.id},"${s.email}",${s.isConfirmed},"${new Date(s.createdAt).toISOString()}"`)
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `techcrest-newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Toast */}
      {notification && (
        <div className="dashboard-toast">
          <CheckCircle size={16} color="#34d399" />
          <span>{notification}</span>
        </div>
      )}

      {/* Overview Stats Row */}
      <div className="dashboard-stats-grid">
        <div className="card dashboard-stat-card">
          <div className="dashboard-stat-icon-wrapper" style={{ backgroundColor: "rgba(45, 127, 249, 0.15)", color: "#2D7FF9" }}>
            <Users size={20} />
          </div>
          <div>
            <p className="dashboard-stat-label">Total Subscribers</p>
            <h3 className="dashboard-stat-value">{subscribers.length}</h3>
          </div>
        </div>

        <div className="card dashboard-stat-card">
          <div className="dashboard-stat-icon-wrapper" style={{ backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#34d399" }}>
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="dashboard-stat-label">Confirmed Emails</p>
            <h3 className="dashboard-stat-value">
              {subscribers.filter((s) => s.isConfirmed).length}
            </h3>
          </div>
        </div>

        <div className="card dashboard-stat-card" style={{ justifyContent: "space-between" }}>
          <div>
            <p className="dashboard-stat-label">Export List</p>
            <p style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>Download CSV for campaign tools</p>
          </div>
          <button
            onClick={handleExportCSV}
            disabled={filtered.length === 0}
            className="dashboard-btn-primary"
          >
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="card dashboard-filter-bar">
        <div style={{ position: "relative", flex: 1, minWidth: "240px" }}>
          <Search size={16} style={{ position: "absolute", left: "0.75rem", top: "0.75rem", color: "var(--color-text-muted)", pointerEvents: "none", zIndex: 10 }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search email or domain..."
            className="dashboard-search-input"
            style={{ 
              width: "100%", 
              fontSize: "0.75rem", 
              borderRadius: "0.75rem", 
              border: "1px solid var(--color-surface-border)", 
              backgroundColor: "var(--color-surface-1)", 
              color: "var(--color-text-primary)",
              padding: "0.625rem 1rem",
              paddingLeft: "2.5rem",
              outline: "none"
            }}
          />
        </div>
        <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", fontWeight: 600 }}>
          {filtered.length} subscriber{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Subscribers Table */}
      <div className="card" style={{ overflow: "hidden" }}>
        {filtered.length === 0 ? (
          <div className="dashboard-table-empty">
            <Mail size={32} style={{ margin: "0 auto 0.5rem auto", opacity: 0.5 }} />
            <p style={{ fontWeight: 600 }}>No subscribers found</p>
          </div>
        ) : (
          <div className="dashboard-table-container">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Subscriber Email</th>
                  <th>Status</th>
                  <th>Subscribed Date</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 600, color: "var(--color-text-primary)" }}>
                        <Mail size={14} color="#2D7FF9" />
                        <span>{s.email}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ 
                        display: "inline-flex", 
                        alignItems: "center", 
                        gap: "0.25rem", 
                        padding: "0.125rem 0.625rem", 
                        borderRadius: "9999px", 
                        fontSize: "10px", 
                        fontWeight: 800, 
                        backgroundColor: "rgba(16, 185, 129, 0.15)", 
                        color: "#34d399", 
                        border: "1px solid rgba(16, 185, 129, 0.3)" 
                      }}>
                        CONFIRMED
                      </span>
                    </td>
                    <td style={{ color: "var(--color-text-muted)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                        <Calendar size={12} />
                        <span>{new Date(s.createdAt).toLocaleDateString("en-IN")}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        onClick={() => handleDelete(s.id, s.email)}
                        title="Delete subscriber"
                        disabled={isPending}
                        style={{
                          padding: "0.375rem",
                          borderRadius: "0.5rem",
                          color: "#ef4444",
                          backgroundColor: "rgba(239, 68, 68, 0.1)",
                          border: "1px solid rgba(239, 68, 68, 0.2)",
                          cursor: "pointer",
                          transition: "all 0.2s ease"
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#ef4444"; e.currentTarget.style.color = "white"; }}
                        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.1)"; e.currentTarget.style.color = "#ef4444"; }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
