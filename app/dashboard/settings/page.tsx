"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import {
  Settings,
  Save,
  ShieldCheck,
  Key,
  Globe,
  CheckCircle,
  Database,
  Download,
  FileSpreadsheet,
  HardDrive,
  CheckCircle2,
  Calendar,
} from "lucide-react";

export default function PlatformSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [saved, setSaved] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleDownloadBackup = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      setDownloading(true);
      const res = await fetch("/api/backup/export");
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `TechCrest_Articles_Backup_${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
      alert("Failed to download backup spreadsheet. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="dashboard-settings-container">
      {/* Header */}
      <div className="dashboard-settings-header">
        <h1 className="dashboard-settings-title">Platform Settings</h1>
        <p className="dashboard-settings-subtitle">
          Configure global publication metadata, SEO defaults, API keys, and database backups.
        </p>
      </div>

      {/* Save Toast */}
      {saved && (
        <div className="dashboard-toast dashboard-settings-toast">
          <CheckCircle className="dashboard-toast__icon" />
          <span>Platform configuration updated successfully.</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="dashboard-settings-tabs">
        {[
          { id: "general", label: "General", icon: Settings },
          { id: "seo", label: "SEO & Metadata", icon: Globe },
          { id: "security", label: "Security & Auth", icon: ShieldCheck },
          { id: "api", label: "API & Integrations", icon: Key },
          { id: "backup", label: "Data Backup & Export", icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`dashboard-settings-tab ${activeTab === tab.id ? "dashboard-settings-tab--active" : ""}`}
            >
              <Icon className="dashboard-settings-tab__icon" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Settings Card */}
      <form onSubmit={handleSave} className="card dashboard-settings-form">
        {activeTab === "general" && (
          <div className="dashboard-settings-section">
            <h2 className="dashboard-settings-section__title">General Configuration</h2>
            <div className="dashboard-settings-field">
              <label htmlFor="settings-site-name" className="dashboard-settings-label">
                Publication Name
              </label>
              <input id="settings-site-name" type="text" defaultValue="TechCrest" className="input dashboard-settings-input" />
            </div>
            <div className="dashboard-settings-field">
              <label htmlFor="settings-site-tagline" className="dashboard-settings-label">
                Tagline
              </label>
              <input id="settings-site-tagline" type="text" defaultValue="The Future of Technology Journalism" className="input dashboard-settings-input" />
            </div>
            <div className="dashboard-settings-field">
              <label htmlFor="settings-site-description" className="dashboard-settings-label">
                Site Description
              </label>
              <textarea id="settings-site-description" rows={3} defaultValue="TechCrest covers the latest technology news, in-depth reviews, buying guides, and analysis from industry experts." className="input dashboard-settings-textarea" />
            </div>
          </div>
        )}

        {activeTab === "seo" && (
          <div className="dashboard-settings-section">
            <h2 className="dashboard-settings-section__title">SEO &amp; OpenGraph Defaults</h2>
            <div className="dashboard-settings-field">
              <label htmlFor="settings-seo-title" className="dashboard-settings-label">
                Default Meta Title Template
              </label>
              <input id="settings-seo-title" type="text" defaultValue="%s — TechCrest" className="input dashboard-settings-input" />
            </div>
            <div className="dashboard-settings-field">
              <label htmlFor="settings-og-image" className="dashboard-settings-label">
                Default OpenGraph Banner URL
              </label>
              <input id="settings-og-image" type="text" defaultValue="https://tech.io/og-default.jpg" className="input dashboard-settings-input" />
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="dashboard-settings-section">
            <h2 className="dashboard-settings-section__title">Authentication &amp; Access</h2>
            <div className="dashboard-settings-toggle-row">
              <div className="dashboard-settings-toggle-content">
                <p className="dashboard-settings-toggle-title">Require 2FA for Editorial Desk</p>
                <p className="dashboard-settings-toggle-desc">Enforce two-factor authentication for editors and admins.</p>
              </div>
              <input type="checkbox" defaultChecked className="dashboard-settings-checkbox" />
            </div>
          </div>
        )}

        {activeTab === "api" && (
          <div className="dashboard-settings-section">
            <h2 className="dashboard-settings-section__title">API &amp; Integration Keys</h2>
            <div className="dashboard-settings-field">
              <label htmlFor="settings-resend-key" className="dashboard-settings-label">
                Resend Email API Key
              </label>
              <input id="settings-resend-key" type="password" defaultValue="re_123456789_abcdef" className="input dashboard-settings-input" />
            </div>
          </div>
        )}

        {activeTab === "backup" && (
          <div className="dashboard-settings-section" style={{ maxWidth: "48rem" }}>
            <h2 className="dashboard-settings-section__title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Database style={{ width: "1.25rem", height: "1.25rem", color: "hsl(var(--color-brand-500))" }} />
              Database &amp; Articles Backup
            </h2>
            <p style={{ fontSize: "0.875rem", color: "hsl(var(--color-text-muted))", margin: 0 }}>
              Export an immediate full-database backup of all published and draft articles, including category metadata, author details, view statistics, and SEO configurations in Microsoft Excel (.xlsx) format.
            </p>

            {/* Quick Download Card */}
            <div
              style={{
                marginTop: "0.75rem",
                padding: "1.25rem",
                borderRadius: "var(--radius-lg)",
                backgroundColor: "hsl(var(--color-surface-2))",
                border: "1px solid hsl(var(--color-surface-border))",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div
                    style={{
                      width: "2.5rem",
                      height: "2.5rem",
                      borderRadius: "var(--radius-md)",
                      backgroundColor: "rgba(16, 185, 129, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#10b981",
                    }}
                  >
                    <FileSpreadsheet style={{ width: "1.25rem", height: "1.25rem" }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "0.95rem", fontWeight: 700, margin: 0, color: "hsl(var(--color-text-primary))" }}>
                      Complete Articles Dataset (.xlsx)
                    </h3>
                    <p style={{ fontSize: "0.75rem", color: "hsl(var(--color-text-muted))", margin: 0 }}>
                      Formatted Excel file containing 100% of platform database records
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadBackup}
                  disabled={downloading}
                  className="btn btn-primary"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.625rem 1.25rem",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    cursor: downloading ? "wait" : "pointer",
                    opacity: downloading ? 0.7 : 1,
                  }}
                >
                  <Download style={{ width: "1rem", height: "1rem" }} />
                  {downloading ? "Preparing Backup..." : "Download Backup (.xlsx)"}
                </button>
              </div>

              {/* Data Specifications List */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "0.75rem",
                  paddingTop: "0.75rem",
                  borderTop: "1px solid hsl(var(--color-surface-border))",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "hsl(var(--color-text-muted))" }}>
                  <CheckCircle2 style={{ width: "0.875rem", height: "0.875rem", color: "#10b981" }} />
                  <span>Full Article Text &amp; Excerpts</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "hsl(var(--color-text-muted))" }}>
                  <CheckCircle2 style={{ width: "0.875rem", height: "0.875rem", color: "#10b981" }} />
                  <span>Categories &amp; Author Metadata</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "hsl(var(--color-text-muted))" }}>
                  <CheckCircle2 style={{ width: "0.875rem", height: "0.875rem", color: "#10b981" }} />
                  <span>SEO Titles, Descriptions &amp; Images</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "hsl(var(--color-text-muted))" }}>
                  <HardDrive style={{ width: "0.875rem", height: "0.875rem", color: "hsl(var(--color-brand-500))" }} />
                  <span>Neon PostgreSQL Direct Query</span>
                </div>
              </div>
            </div>

            {/* Retention & Frequency Policy */}
            <div
              style={{
                padding: "1rem",
                borderRadius: "var(--radius-lg)",
                backgroundColor: "rgba(59, 130, 246, 0.08)",
                border: "1px solid rgba(59, 130, 246, 0.2)",
                fontSize: "0.8rem",
                color: "hsl(var(--color-text-muted))",
                display: "flex",
                alignItems: "flex-start",
                gap: "0.75rem",
              }}
            >
              <Calendar style={{ width: "1.125rem", height: "1.125rem", color: "#3b82f6", flexShrink: 0, marginTop: "0.125rem" }} />
              <div>
                <strong style={{ color: "hsl(var(--color-text-primary))", display: "block", marginBottom: "0.25rem" }}>
                  Automatic On-Demand Availability
                </strong>
                You can download backups at any time. The dataset generated by this tool is dynamically fetched in real-time from the database, ensuring zero delay for newly published articles.
              </div>
            </div>
          </div>
        )}

        {activeTab !== "backup" && (
          <div className="dashboard-settings-footer">
            <button type="submit" className="btn btn-primary dashboard-settings-save-btn">
              <Save className="dashboard-settings-save-icon" /> Save Configuration
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

