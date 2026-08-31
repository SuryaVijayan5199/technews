"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Globe,
  Shield,
  Bookmark,
  Clock,
  Key,
  CheckCircle2,
  AlertCircle,
  Save,
  LogOut,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  AtSign,
  Camera,
  Loader2,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { updateUserProfile } from "@/lib/actions/user.actions";

// ─── Types ──────────────────────────────────────────────────────
interface ProfileUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
  bio?: string | null;
  website?: string | null;
  twitterHandle?: string | null;
}

interface BookmarkItem {
  articleId: number;
  title: string | null;
  slug: string | null;
  heroImage: string | null;
  readingTimeMinutes: number | null;
  publishedAt: Date | null;
  createdAt: Date;
}

interface HistoryItem {
  id: number;
  readAt: Date;
  readingProgress: number | null;
  title: string | null;
  slug: string | null;
  heroImage: string | null;
}

interface ProfileViewProps {
  user: ProfileUser;
  bookmarks: BookmarkItem[];
  readingHistory: HistoryItem[];
}

// ─── Role badge helper ──────────────────────────────────────────
function getRoleBadge(role?: string | null) {
  switch (role) {
    case "super_admin":
      return { label: "Super Admin", icon: <ShieldCheck style={{ width: 14, height: 14 }} />, bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.28)", color: "#ef4444" };
    case "editor":
    case "author":
    case "managing_editor":
    case "publisher":
      return { label: "Editor", icon: <Sparkles style={{ width: 14, height: 14 }} />, bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.28)", color: "#10b981" };
    default:
      return { label: "Member", icon: <Sparkles style={{ width: 14, height: 14 }} />, bg: "rgba(99,102,241,0.12)", border: "rgba(99,102,241,0.28)", color: "hsl(var(--color-brand-500))" };
  }
}

// ─── Relative time helper ─────────────────────────────────────
function relativeTime(date: Date): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ─── Main Component ───────────────────────────────────────────
export function ProfileView({ user, bookmarks, readingHistory }: ProfileViewProps) {
  const roleBadge = getRoleBadge(user.role);
  const isSuperAdmin = user.role === "super_admin";
  const isStaff = ["super_admin", "editor", "author", "managing_editor", "publisher"].includes(user.role ?? "");

  const [name, setName] = useState(user.name || "");
  const [bio, setBio] = useState(user.bio || "");
  const [website, setWebsite] = useState(user.website || "");
  const [twitter, setTwitter] = useState(user.twitterHandle ? `@${user.twitterHandle}` : "");
  const [avatar, setAvatar] = useState(
    user.image || `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(user.email || "user")}`
  );

  const [activeTab, setActiveTab] = useState<"profile" | "bookmarks" | "history" | "security">("profile");
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [saveError, setSaveError] = useState("");
  const [isPending, startTransition] = useTransition();

  // ─── Handle Save Profile ────────────────────────────────────
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus("idle");
    setSaveError("");

    startTransition(async () => {
      const result = await updateUserProfile({
        userId: user.id,
        name,
        bio,
        website,
        twitterHandle: twitter,
        image: avatar,
      });

      if (result.success) {
        setSaveStatus("success");
        setTimeout(() => setSaveStatus("idle"), 3500);
      } else {
        setSaveStatus("error");
        setSaveError(result.error ?? "Failed to save profile.");
      }
    });
  };

  const tabBtnStyle = (isActive: boolean): React.CSSProperties => ({
    padding: "0.6rem 1.1rem",
    borderRadius: "10px",
    fontSize: "0.9rem",
    fontWeight: 600,
    border: "none",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
    whiteSpace: "nowrap",
    backgroundColor: isActive ? "hsl(var(--color-brand-500))" : "transparent",
    color: isActive ? "#fff" : "var(--color-text-secondary)",
    transition: "all 0.18s ease",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

      {/* ── Profile Header Card ─────────────────────────────── */}
      <div style={{
        background: "linear-gradient(135deg, rgba(99,102,241,0.13) 0%, rgba(168,85,247,0.09) 100%)",
        border: "1px solid var(--color-surface-border)",
        borderRadius: "20px",
        padding: "2rem",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1.5rem",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", flexWrap: "wrap" }}>
          {/* Avatar */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <img
              src={avatar}
              alt={name || "User"}
              width={84}
              height={84}
              style={{
                width: 84, height: 84,
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid hsl(var(--color-brand-500))",
                backgroundColor: "var(--color-surface-2)",
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(user.email || "user")}`;
              }}
            />
            <div style={{
              position: "absolute", bottom: 2, right: 2,
              width: 22, height: 22,
              borderRadius: "50%",
              backgroundColor: "var(--color-surface-1)",
              border: "2px solid var(--color-surface-border)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Camera style={{ width: 12, height: 12, color: "var(--color-text-muted)" }} />
            </div>
          </div>

          {/* Name & role */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
              <h1 style={{ fontSize: "1.6rem", fontWeight: 700, margin: 0, color: "var(--color-text-primary)" }}>
                {name || user.email?.split("@")[0] || "User"}
              </h1>
              <span style={{
                backgroundColor: roleBadge.bg,
                border: `1px solid ${roleBadge.border}`,
                color: roleBadge.color,
                fontSize: "0.72rem",
                fontWeight: 700,
                padding: "0.22rem 0.625rem",
                borderRadius: "9999px",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}>
                {roleBadge.icon} {roleBadge.label}
              </span>
            </div>
            <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.9rem", color: "var(--color-text-muted)" }}>
              <Mail style={{ width: 14, height: 14, display: "inline", marginRight: "0.3rem" }} />
              {user.email}
            </p>
            {bio && (
              <p style={{ margin: "0.4rem 0 0 0", fontSize: "0.875rem", color: "var(--color-text-secondary)", maxWidth: 480 }}>
                {bio}
              </p>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          {isStaff && (
            <Link
              href="/dashboard"
              className="btn-primary-v2"
              style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
            >
              <Shield style={{ width: 16, height: 16 }} />
              {isSuperAdmin ? "CMS Dashboard" : "Editor Dashboard"}
            </Link>
          )}
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="oauth-btn-v2"
            style={{ minWidth: "auto", padding: "0.6rem 1rem", borderColor: "rgba(239,68,68,0.3)", color: "#ef4444" }}
          >
            <LogOut style={{ width: 16, height: 16 }} /> Sign Out
          </button>
        </div>
      </div>

      {/* ── Tabs ────────────────────────────────────────────── */}
      <div style={{
        display: "flex",
        gap: "0.375rem",
        borderBottom: "1px solid var(--color-surface-border)",
        paddingBottom: "0.5rem",
        overflowX: "auto",
      }}>
        <button type="button" onClick={() => setActiveTab("profile")} style={tabBtnStyle(activeTab === "profile")}>
          <User style={{ width: 15, height: 15 }} /> Profile
        </button>
        <button type="button" onClick={() => setActiveTab("bookmarks")} style={tabBtnStyle(activeTab === "bookmarks")}>
          <Bookmark style={{ width: 15, height: 15 }} /> Saved ({bookmarks.length})
        </button>
        <button type="button" onClick={() => setActiveTab("history")} style={tabBtnStyle(activeTab === "history")}>
          <Clock style={{ width: 15, height: 15 }} /> History
        </button>
        <button type="button" onClick={() => setActiveTab("security")} style={tabBtnStyle(activeTab === "security")}>
          <Key style={{ width: 15, height: 15 }} /> Security
        </button>
      </div>

      {/* ── TAB: PROFILE DETAILS ──────────────────────────── */}
      {activeTab === "profile" && (
        <form
          onSubmit={handleSaveProfile}
          style={{
            backgroundColor: "var(--color-surface-1)",
            border: "1px solid var(--color-surface-border)",
            borderRadius: "16px",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0, color: "var(--color-text-primary)" }}>
              Profile Details
            </h2>

            {saveStatus === "success" && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#10b981", fontSize: "0.875rem", fontWeight: 600 }}>
                <CheckCircle2 style={{ width: 16, height: 16 }} /> Profile saved successfully!
              </div>
            )}
            {saveStatus === "error" && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#ef4444", fontSize: "0.875rem", fontWeight: 600 }}>
                <AlertCircle style={{ width: 16, height: 16 }} /> {saveError}
              </div>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem" }}>
            <div>
              <label style={labelStyle}>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                required
                className="input-field-v2"
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label style={labelStyle}>Email Address <span style={{ color: "var(--color-text-muted)", fontWeight: 400, fontSize: "0.8rem" }}>(read-only)</span></label>
              <input
                type="email"
                value={user.email ?? ""}
                disabled
                className="input-field-v2"
                style={{ width: "100%", opacity: 0.65, cursor: "not-allowed" }}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Short Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Tell readers a little about yourself..."
              className="input-field-v2"
              style={{ width: "100%", resize: "vertical", fontFamily: "inherit" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem" }}>
            <div>
              <label style={labelStyle}><Globe style={{ width: 14, height: 14, display: "inline", marginRight: 4 }} />Website / Portfolio</label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://yoursite.com"
                className="input-field-v2"
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label style={labelStyle}><AtSign style={{ width: 14, height: 14, display: "inline", marginRight: 4 }} />Twitter / X Handle</label>
              <input
                type="text"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="@username"
                className="input-field-v2"
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}><Camera style={{ width: 14, height: 14, display: "inline", marginRight: 4 }} />Avatar Image URL</label>
            <input
              type="text"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
              className="input-field-v2"
              style={{ width: "100%" }}
            />
            <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginTop: "0.4rem" }}>
              Enter a public image URL. Preview updates in the header above.
            </p>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="submit"
              disabled={isPending}
              className="btn-primary-v2"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
            >
              {isPending ? (
                <><Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} /> Saving...</>
              ) : (
                <><Save style={{ width: 16, height: 16 }} /> Save Profile</>
              )}
            </button>
          </div>
        </form>
      )}

      {/* ── TAB: BOOKMARKS ───────────────────────────────── */}
      {activeTab === "bookmarks" && (
        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>Saved Articles</h2>
          {bookmarks.length === 0 ? (
            <EmptyState
              icon={<Bookmark style={{ width: 36, height: 36 }} />}
              title="No saved articles yet"
              desc="Browse stories and click the bookmark icon to save them here."
            />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              {bookmarks.map((b) => (
                <div
                  key={b.articleId}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "1rem 1.1rem",
                    borderRadius: "12px",
                    backgroundColor: "var(--color-surface-2)",
                    border: "1px solid var(--color-surface-border)",
                    gap: "1rem",
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontSize: "0.95rem", fontWeight: 600, margin: 0, color: "var(--color-text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {b.title ?? "Untitled"}
                    </h3>
                    <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                      {b.readingTimeMinutes ? `${b.readingTimeMinutes} min read · ` : ""}
                      Saved {relativeTime(b.createdAt)}
                    </span>
                  </div>
                  <Link
                    href={`/${b.slug ?? ""}`}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: "0.35rem",
                      fontSize: "0.82rem", fontWeight: 600,
                      color: "hsl(var(--color-brand-500))",
                      textDecoration: "none",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Read <ExternalLink style={{ width: 13, height: 13 }} />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TAB: READING HISTORY ──────────────────────────── */}
      {activeTab === "history" && (
        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>Recently Read</h2>
          {readingHistory.length === 0 ? (
            <EmptyState
              icon={<Clock style={{ width: 36, height: 36 }} />}
              title="No reading history yet"
              desc="Start reading articles and your history will appear here."
            />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              {readingHistory.map((h) => (
                <div
                  key={h.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "1rem 1.1rem",
                    borderRadius: "12px",
                    backgroundColor: "var(--color-surface-2)",
                    border: "1px solid var(--color-surface-border)",
                    gap: "1rem",
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontSize: "0.95rem", fontWeight: 600, margin: 0, color: "var(--color-text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {h.title ?? "Untitled"}
                    </h3>
                    <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                      {relativeTime(h.readAt)}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    {h.readingProgress !== null && (
                      <span style={{
                        fontSize: "0.75rem", fontWeight: 600,
                        color: h.readingProgress === 100 ? "#10b981" : "hsl(var(--color-brand-500))",
                        backgroundColor: h.readingProgress === 100 ? "rgba(16,185,129,0.1)" : "rgba(99,102,241,0.1)",
                        padding: "0.2rem 0.5rem",
                        borderRadius: "6px",
                      }}>
                        {h.readingProgress}%
                      </span>
                    )}
                    <Link
                      href={`/${h.slug ?? ""}`}
                      style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", fontSize: "0.82rem", fontWeight: 600, color: "hsl(var(--color-brand-500))", textDecoration: "none" }}
                    >
                      Continue <ExternalLink style={{ width: 13, height: 13 }} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TAB: SECURITY ────────────────────────────────── */}
      {activeTab === "security" && (
        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>Account Security</h2>

          {/* Linked providers info */}
          <div style={{
            padding: "1rem 1.25rem",
            borderRadius: "12px",
            backgroundColor: "rgba(99,102,241,0.06)",
            border: "1px solid rgba(99,102,241,0.15)",
            marginBottom: "0.5rem",
          }}>
            <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
              <ShieldCheck style={{ width: 16, height: 16, display: "inline", marginRight: "0.4rem", color: "hsl(var(--color-brand-500))" }} />
              Your account is secured. If you signed in with <strong>Google</strong>, your password is managed by Google and cannot be changed here.
              To add a password-based login, sign out and use the email/magic-link option on the sign-in page.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={labelStyle}>Current Password</label>
              <input type="password" placeholder="••••••••" className="input-field-v2" style={{ width: "100%" }} />
            </div>
            <div>
              <label style={labelStyle}>New Password</label>
              <input type="password" placeholder="••••••••" className="input-field-v2" style={{ width: "100%" }} />
            </div>
            <div>
              <label style={labelStyle}>Confirm New Password</label>
              <input type="password" placeholder="••••••••" className="input-field-v2" style={{ width: "100%" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.25rem" }}>
              <button type="button" className="btn-primary-v2">
                <Key style={{ width: 15, height: 15 }} /> Update Password
              </button>
            </div>
          </div>

          {/* Danger zone */}
          <div style={{
            marginTop: "1rem",
            padding: "1.25rem",
            borderRadius: "12px",
            border: "1px solid rgba(239,68,68,0.2)",
            backgroundColor: "rgba(239,68,68,0.04)",
          }}>
            <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "0.95rem", fontWeight: 700, color: "#ef4444" }}>Danger Zone</h3>
            <p style={{ margin: "0 0 1rem 0", fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <button
              type="button"
              style={{
                backgroundColor: "rgba(239,68,68,0.1)",
                color: "#ef4444",
                border: "1px solid rgba(239,68,68,0.3)",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "0.875rem",
                cursor: "pointer",
              }}
            >
              Delete My Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────
const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.875rem",
  fontWeight: 600,
  marginBottom: "0.45rem",
  color: "var(--color-text-primary)",
};

const cardStyle: React.CSSProperties = {
  backgroundColor: "var(--color-surface-1)",
  border: "1px solid var(--color-surface-border)",
  borderRadius: "16px",
  padding: "2rem",
  display: "flex",
  flexDirection: "column",
  gap: "1.25rem",
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: "1.1rem",
  fontWeight: 700,
  margin: 0,
  color: "var(--color-text-primary)",
};

function EmptyState({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--color-text-muted)" }}>
      <div style={{ marginBottom: "0.875rem", opacity: 0.35 }}>{icon}</div>
      <p style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "0.35rem", color: "var(--color-text-secondary)" }}>{title}</p>
      <p style={{ fontSize: "0.875rem", maxWidth: 360, margin: "0 auto" }}>{desc}</p>
    </div>
  );
}
