"use client";

import { useState, useTransition, useEffect } from "react";
import {
  Users, UserPlus, ShieldCheck, Search, CheckCircle,
  AlertCircle, X, Crown, Trash2, Loader2, RefreshCw,
} from "lucide-react";
import {
  getStaffMembers,
  assignStaffRole,
  revokeStaffAccess,
  updateStaffRole,
} from "@/lib/actions/user.actions";

const SUPER_ADMIN_EMAIL = "suryashc5199@gmail.com";

type StaffMember = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  image: string | null;
  isActive: boolean;
  createdAt: Date;
};

const ROLE_OPTIONS = [
  { value: "super_admin", label: "Super Admin", desc: "Full platform authority & team role allocation" },
  { value: "publisher", label: "Publisher", desc: "Final approval, publishing & story placement" },
  { value: "managing_editor", label: "Managing Editor", desc: "Editorial operations, categories & assignments" },
  { value: "editor", label: "Editor", desc: "Write, edit & submit articles for publication" },
  { value: "reviewer", label: "Sub-Editor / Reviewer", desc: "Fact-checking, review drafts & comment moderation" },
  { value: "author", label: "Staff Writer", desc: "Original tech reporting & draft creation" },
  { value: "contributor", label: "Contributor", desc: "External guest columnist (drafts only)" },
];

const ROLE_BADGE: Record<string, { label: string; color: string; bg: string; border: string }> = {
  super_admin: { label: "Super Admin", color: "#f59e0b", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)" },
  publisher: { label: "Publisher", color: "#ec4899", bg: "rgba(236,72,153,0.12)", border: "rgba(236,72,153,0.3)" },
  managing_editor: { label: "Managing Editor", color: "#8b5cf6", bg: "rgba(139,92,246,0.12)", border: "rgba(139,92,246,0.3)" },
  editor: { label: "Editor", color: "#10b981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.3)" },
  author: { label: "Staff Writer", color: "#3b82f6", bg: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.3)" },
  reviewer: { label: "Sub-Editor", color: "#06b6d4", bg: "rgba(6,182,212,0.12)", border: "rgba(6,182,212,0.3)" },
  contributor: { label: "Contributor", color: "#6b7280", bg: "rgba(107,114,128,0.12)", border: "rgba(107,114,128,0.3)" },
};

function RoleBadge({ role }: { role: string }) {
  const b = ROLE_BADGE[role] ?? { label: role, color: "#6b7280", bg: "rgba(107,114,128,0.1)", border: "rgba(107,114,128,0.2)" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "0.3rem",
      padding: "0.2rem 0.6rem", borderRadius: "9999px", fontSize: "0.72rem",
      fontWeight: 700, letterSpacing: "0.03em", textTransform: "uppercase",
      color: b.color, backgroundColor: b.bg, border: `1px solid ${b.border}`,
    }}>
      {b.label}
    </span>
  );
}

export default function TeamManagementPage() {
  const [team, setTeam] = useState<StaffMember[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] = useState("editor");
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch real staff from DB
  const loadTeam = () => {
    startTransition(async () => {
      const data = await getStaffMembers();
      setTeam(data as StaffMember[]);
    });
  };

  useEffect(() => { loadTeam(); }, []);

  // Add staff member
  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await assignStaffRole(inviteEmail, inviteRole as any, inviteName);
      if (result.success) {
        showToast("success", `Access granted to ${inviteEmail} as ${inviteRole.replace("_", " ")}.`);
        setInviteEmail(""); setInviteName(""); setShowModal(false);
        loadTeam();
      } else {
        showToast("error", result.error ?? "Failed to add staff member.");
      }
    });
  };

  // Change role
  const handleRoleChange = (userId: string, newRole: string, email: string) => {
    if (email.toLowerCase() === SUPER_ADMIN_EMAIL) return;
    startTransition(async () => {
      const result = await updateStaffRole(userId, newRole as any);
      if (result.success) {
        showToast("success", "Role updated successfully.");
        setTeam(prev => prev.map(m => m.id === userId ? { ...m, role: newRole } : m));
      } else {
        showToast("error", result.error ?? "Failed to update role.");
      }
    });
  };

  // Revoke access
  const handleRevoke = (userId: string, name: string, email: string) => {
    if (email.toLowerCase() === SUPER_ADMIN_EMAIL) return;
    startTransition(async () => {
      const result = await revokeStaffAccess(userId);
      if (result.success) {
        showToast("success", `Access revoked for ${name}.`);
        setTeam(prev => prev.filter(m => m.id !== userId));
      } else {
        showToast("error", result.error ?? "Failed to revoke access.");
      }
    });
  };

  const filtered = team.filter(m =>
    (m.name?.toLowerCase() ?? "").includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    m.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-page-container space-y-6">

      {/* Toast */}
      {toast && (
        <div className={`dashboard-toast flex items-center gap-2 ${toast.type === "error" ? "border-red-500/30 text-red-400 bg-red-500/10" : ""}`}>
          {toast.type === "success"
            ? <CheckCircle className="w-4 h-4 text-green-400" />
            : <AlertCircle className="w-4 h-4 text-red-400" />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Header */}
      <div className="dashboard-page-header flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="dashboard-page-title flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[var(--color-brand-400)]" />
            Editorial Team Management
          </h1>
          <p className="dashboard-page-subtitle">
            Add editors, authors, and sub-editors. They log in with Google using their assigned email.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadTeam}
            disabled={isPending}
            className="btn btn-ghost"
            title="Refresh team list"
          >
            <RefreshCw className={`w-4 h-4 ${isPending ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary dashboard-primary-btn shrink-0"
          >
            <UserPlus className="w-4 h-4" /> Add Staff Member
          </button>
        </div>
      </div>

      {/* Role Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
        {[
          { label: "Total Staff", count: team.length, icon: <Users className="w-5 h-5" /> },
          { label: "Editors", count: team.filter(m => ["editor", "managing_editor"].includes(m.role)).length, icon: <ShieldCheck className="w-5 h-5" /> },
          { label: "Writers", count: team.filter(m => ["author", "contributor"].includes(m.role)).length, icon: <UserPlus className="w-5 h-5" /> },
        ].map(c => (
          <div key={c.label} className="card" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <div style={{ color: "var(--color-text-muted)" }}>{c.icon}</div>
            <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--color-text-primary)" }}>{c.count}</div>
            <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="dashboard-toolbar">
        <div className="dashboard-search-wrap max-w-sm w-full">
          <Search className="dashboard-search-icon" />
          <input
            id="team-search-input"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or role…"
            className="input dashboard-search-input"
          />
        </div>
      </div>

      {/* Table */}
      <div className="dashboard-card card">
        <div className="dashboard-table-container">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th className="th-title">Staff Member</th>
                <th className="th-cat">Email</th>
                <th className="th-status">Access Role</th>
                <th className="th-actions text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isPending && team.length === 0 ? (
                <tr><td colSpan={4} className="td-empty"><Loader2 className="w-5 h-5 animate-spin inline mr-2" />Loading team...</td></tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="td-empty">
                    {team.length === 0
                      ? "No staff members yet. Add your first editor using the button above."
                      : "No results found for your search."}
                  </td>
                </tr>
              ) : (
                filtered.map((m) => {
                  const isSuperAdminRow = m.email.toLowerCase() === SUPER_ADMIN_EMAIL;
                  return (
                    <tr key={m.id} className="dashboard-table-row">
                      <td className="td-title font-semibold">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={m.image || `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(m.email)}`}
                            alt={m.name || m.email}
                            width={32} height={32}
                            style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                            onError={(e) => { (e.target as HTMLImageElement).src = `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(m.email)}`; }}
                          />
                          <div>
                            <span className="flex items-center gap-1.5">
                              {m.name || m.email.split("@")[0]}
                              {isSuperAdminRow && <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                            </span>
                            <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                              {m.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="td-cat font-mono text-xs text-brand">{m.email}</td>
                      <td className="td-status">
                        {isSuperAdminRow ? (
                          <RoleBadge role="super_admin" />
                        ) : (
                          <select
                            value={m.role}
                            onChange={(e) => handleRoleChange(m.id, e.target.value, m.email)}
                            disabled={isPending}
                            className="input text-xs py-1 px-2 rounded-md bg-[var(--color-surface-2)] border-[var(--color-surface-border)] font-semibold"
                            aria-label="Change role"
                          >
                            {ROLE_OPTIONS.map(r => (
                              <option key={r.value} value={r.value}>{r.label}</option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td className="td-actions text-right">
                        {!isSuperAdminRow && (
                          <button
                            onClick={() => handleRevoke(m.id, m.name || m.email, m.email)}
                            disabled={isPending}
                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Revoke Staff Access"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-card card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-brand" /> Add Staff Member
              </h3>
              <button onClick={() => setShowModal(false)} className="modal-close-btn">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">
                  Google Email Address <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="editor@gmail.com"
                  required
                  className="input text-sm w-full"
                />
                <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "0.3rem" }}>
                  They must sign in with this exact Google account.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Sarah Chen"
                  className="input text-sm w-full"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">
                  Access Role <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="input text-sm w-full"
                  aria-label="Select role"
                >
                  {ROLE_OPTIONS.map(r => (
                    <option key={r.value} value={r.value}>{r.label} — {r.desc}</option>
                  ))}
                </select>
              </div>

              <div style={{
                padding: "0.75rem", borderRadius: "8px",
                backgroundColor: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)",
                fontSize: "0.8rem", color: "var(--color-text-muted)", lineHeight: 1.6,
              }}>
                ℹ️ The person must sign in with Google using the email address you enter above. Their role will activate automatically on first login.
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost text-sm">Cancel</button>
                <button type="submit" disabled={isPending} className="btn btn-primary text-sm">
                  {isPending ? <><Loader2 className="w-3 h-3 animate-spin" /> Adding...</> : "Add Staff Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
