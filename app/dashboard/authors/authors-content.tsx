"use client";

import { useState, useEffect, useTransition } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import {
  Users,
  UserPlus,
  Edit,
  Trash2,
  Search,
  CheckCircle,
  AlertCircle,
  X,
  ExternalLink,
  Loader2,
  Globe,
  Share2,
  ShieldCheck,
  FileText,
  UserCheck,
  Sparkles,
  Award,
} from "lucide-react";
import {
  getAuthorsWithStats,
  createAuthorProfile,
  updateAuthorProfile,
  deleteAuthorProfile,
} from "@/lib/actions/author.actions";
import { EnhancedImageUploader } from "@/components/dashboard/enhanced-image-uploader";

type ToastType = "success" | "error" | "info";

interface Toast {
  type: ToastType;
  message: string;
}

export default function AuthorsManagementContent() {
  const [mounted, setMounted] = useState(false);
  const [authorsList, setAuthorsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "verified" | "with_articles">("all");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<any | null>(null);

  // Form State
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isVerified, setIsVerified] = useState(true);

  // Delete State
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Toast
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (type: ToastType, message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const loadAuthors = async () => {
    setLoading(true);
    try {
      const data = await getAuthorsWithStats();
      setAuthorsList(data);
    } catch {
      showToast("error", "Failed to load authors list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuthors();
  }, []);

  const openCreateModal = () => {
    setEditingAuthor(null);
    setDisplayName("");
    setBio("");
    setAvatar("");
    setCustomSlug("");
    setTwitterUrl("");
    setLinkedinUrl("");
    setWebsiteUrl("");
    setIsVerified(true);
    setShowModal(true);
  };

  const openEditModal = (author: any) => {
    setEditingAuthor(author);
    setDisplayName(author.displayName || "");
    setBio(author.bio || "");
    setAvatar(author.avatar || "");
    setCustomSlug(author.slug || "");
    setTwitterUrl(author.twitterUrl || "");
    setLinkedinUrl(author.linkedinUrl || "");
    setWebsiteUrl(author.websiteUrl || "");
    setIsVerified(author.isVerified ?? true);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      showToast("error", "Display name is required.");
      return;
    }

    startTransition(async () => {
      if (editingAuthor) {
        // Update existing author
        const res = await updateAuthorProfile(editingAuthor.id, {
          displayName,
          bio,
          avatar,
          customSlug,
          twitterUrl,
          linkedinUrl,
          websiteUrl,
          isVerified,
        });

        if (res.success) {
          showToast("success", `Updated author "${displayName}" successfully!`);
          setShowModal(false);
          loadAuthors();
        } else {
          showToast("error", res.error || "Failed to update author.");
        }
      } else {
        // Create new author
        const res = await createAuthorProfile({
          displayName,
          bio,
          avatar,
          customSlug,
          twitterUrl,
          linkedinUrl,
          websiteUrl,
          isVerified,
        });

        if (res.success) {
          showToast("success", `Created new author "${displayName}"!`);
          setShowModal(false);
          loadAuthors();
        } else {
          showToast("error", res.error || "Failed to create author.");
        }
      }
    });
  };

  const handleDelete = (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete author "${name}"?`)) return;

    setDeletingId(id);
    startTransition(async () => {
      const res = await deleteAuthorProfile(id);
      if (res.success) {
        showToast("success", `Deleted author "${name}".`);
        loadAuthors();
      } else {
        showToast("error", res.error || "Failed to delete author.");
      }
      setDeletingId(null);
    });
  };

  // Stats Counters
  const totalAuthorsCount = authorsList.length;
  const verifiedCount = authorsList.filter((a) => a.isVerified).length;
  const totalPublishedArticles = authorsList.reduce((acc, curr) => acc + (curr.articleCount || 0), 0);

  // Filtered List
  const filteredAuthors = authorsList.filter((a) => {
    const matchesSearch =
      a.displayName.toLowerCase().includes(search.toLowerCase()) ||
      (a.bio && a.bio.toLowerCase().includes(search.toLowerCase())) ||
      a.slug.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === "verified") return a.isVerified;
    if (activeFilter === "with_articles") return (a.articleCount || 0) > 0;
    return true;
  });

  return (
    <div className="dashboard-page-container space-y-6">
      {/* Toast */}
      {toast && toast.message && (
        <div
          className={`dashboard-toast dashboard-toast--${toast.type}`}
          role="alert"
        >
          {toast.type === "success" ? (
            <CheckCircle className="w-4 h-4" />
          ) : toast.type === "error" ? (
            <AlertCircle className="w-4 h-4" />
          ) : (
            <Users className="w-4 h-4" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[var(--color-text-primary)] flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-[#2D7FF9]" /> Author Directory
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Create, manage, and verify official TechCrest editorial author profiles.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="btn btn-primary inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold shadow-md hover:scale-[1.02] transition-all"
        >
          <UserPlus className="w-4 h-4" /> Create New Author
        </button>
      </div>

      {/* Stat Summary Bar */}
      <div className="tc-authors-stats-grid">
        <div className="tc-authors-stat-card">
          <div className="tc-authors-stat-icon">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="tc-authors-stat-number">{totalAuthorsCount}</div>
            <div className="tc-authors-stat-label">Total Authors</div>
          </div>
        </div>

        <div className="tc-authors-stat-card">
          <div className="tc-authors-stat-icon" style={{ backgroundColor: "rgba(16, 185, 129, 0.12)", color: "#10b981" }}>
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="tc-authors-stat-number">{verifiedCount}</div>
            <div className="tc-authors-stat-label">Verified Staff</div>
          </div>
        </div>

        <div className="tc-authors-stat-card">
          <div className="tc-authors-stat-icon" style={{ backgroundColor: "rgba(168, 85, 247, 0.12)", color: "#a855f7" }}>
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="tc-authors-stat-number">{totalPublishedArticles}</div>
            <div className="tc-authors-stat-label">Articles Written</div>
          </div>
        </div>
      </div>

      {/* Toolbar & Filter Pills */}
      <div className="tc-authors-toolbar">
        <div className="tc-authors-search-wrap">
          <Search className="tc-authors-search-icon" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by author name, handle, or bio..."
            className="tc-authors-search-input"
          />
        </div>

        <div className="tc-authors-filter-pills">
          <button
            onClick={() => setActiveFilter("all")}
            className={`tc-authors-filter-pill ${activeFilter === "all" ? "tc-authors-filter-pill--active" : ""}`}
          >
            All ({totalAuthorsCount})
          </button>
          <button
            onClick={() => setActiveFilter("verified")}
            className={`tc-authors-filter-pill ${activeFilter === "verified" ? "tc-authors-filter-pill--active" : ""}`}
          >
            Verified ({verifiedCount})
          </button>
          <button
            onClick={() => setActiveFilter("with_articles")}
            className={`tc-authors-filter-pill ${activeFilter === "with_articles" ? "tc-authors-filter-pill--active" : ""}`}
          >
            With Articles
          </button>
        </div>
      </div>

      {/* Creative Author Card Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading editorial directory...
        </div>
      ) : filteredAuthors.length === 0 ? (
        <div className="text-center py-16 card p-8 bg-[var(--color-surface-1)] rounded-xl border border-[var(--color-surface-border)]">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
          <h3 className="text-base font-bold">No Authors Found</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            {search
              ? `No author profile matching "${search}".`
              : "Create your first editorial author profile to get started."}
          </p>
          {!search && (
            <button
              onClick={openCreateModal}
              className="btn btn-primary mt-4 text-xs inline-flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" /> Create Author
            </button>
          )}
        </div>
      ) : (
        <div className="tc-authors-grid">
          {filteredAuthors.map((author) => {
            const avatarUrl =
              author.avatar ||
              `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(author.displayName)}`;

            return (
              <div key={author.id} className="tc-author-profile-card">
                <div>
                  {/* Decorative Banner Header */}
                  <div className="tc-author-profile-card__banner" />

                  {/* Profile Body */}
                  <div className="tc-author-profile-card__content">
                    <div className="tc-author-profile-card__avatar-row">
                      <div className="tc-author-profile-card__avatar-wrap">
                        <Image
                          src={avatarUrl}
                          alt={author.displayName}
                          fill
                          className="tc-author-profile-card__avatar-img"
                        />
                        {author.isVerified && (
                          <div className="tc-author-profile-card__verified-badge" title="Verified TechCrest Author">
                            <ShieldCheck className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>

                      <span className="tc-author-profile-card__articles-count inline-flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" />
                        {author.articleCount} {author.articleCount === 1 ? "Article" : "Articles"}
                      </span>
                    </div>

                    <h3 className="tc-author-profile-card__name">
                      {author.displayName}
                    </h3>

                    {author.bio ? (
                      <p className="tc-author-profile-card__bio">
                        {author.bio}
                      </p>
                    ) : (
                      <p className="tc-author-profile-card__bio italic text-muted-foreground">
                        Official TechCrest editorial contributor.
                      </p>
                    )}

                    {/* Social Quick Links */}
                    <div className="tc-author-profile-card__socials">
                      {author.twitterUrl && (
                        <a
                          href={author.twitterUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="tc-author-profile-card__social-link"
                          title="Twitter / X Profile"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {author.linkedinUrl && (
                        <a
                          href={author.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="tc-author-profile-card__social-link"
                          title="LinkedIn Profile"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {author.websiteUrl && (
                        <a
                          href={author.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="tc-author-profile-card__social-link"
                          title="Personal Website"
                        >
                          <Globe className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="tc-author-profile-card__footer">
                  <Link
                    href={`/authors/${author.slug}`}
                    target="_blank"
                    className="text-[11px] font-bold text-muted-foreground hover:text-[#2D7FF9] inline-flex items-center gap-1 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Public Profile
                  </Link>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(author)}
                      className="tc-author-btn tc-author-btn--edit"
                      title="Modify Author Profile"
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(author.id, author.displayName)}
                      disabled={deletingId === author.id}
                      className="tc-author-btn tc-author-btn--delete"
                      title="Delete Author Profile"
                    >
                      {deletingId === author.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Dialog with Direct Image Uploader */}
      {mounted && showModal && createPortal(
        <div className="author-modal-overlay">
          <div className="author-modal-card">
            <div className="author-modal-header">
              <div>
                <h2 className="author-modal-title">
                  {editingAuthor ? "Modify Author Profile" : "Create New Author Profile"}
                </h2>
                <p className="author-modal-subtitle">
                  {editingAuthor
                    ? "Update author bio, profile photo, and social links."
                    : "Create an official TechCrest author profile available for article publishing."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="author-modal-close-btn"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="author-modal-form">
              <div className="author-modal-field">
                <label className="author-modal-label">
                  Display Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="author-modal-input"
                />
              </div>

              <div className="author-modal-field">
                <label className="author-modal-label">
                  Custom Handle / Slug
                </label>
                <input
                  type="text"
                  value={customSlug}
                  onChange={(e) => setCustomSlug(e.target.value)}
                  placeholder="e.g. sarah-jenkins"
                  className="author-modal-input"
                />
              </div>

              {/* Direct Image Uploader for Avatar */}
              <div className="author-modal-field">
                <label className="author-modal-label mb-1">
                  Author Profile Photo (Direct Upload or URL)
                </label>
                <EnhancedImageUploader
                  value={avatar}
                  onChange={(url) => setAvatar(url)}
                />
              </div>

              <div className="author-modal-field">
                <label className="author-modal-label">
                  Author Bio / Expertise
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="e.g. Senior AI Research Correspondent covering deep learning, LLMs, and enterprise transformation."
                  className="author-modal-textarea"
                />
              </div>

              {/* Social Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[var(--color-surface-border)]">
                <div className="author-modal-field">
                  <label className="author-modal-label">
                    Twitter / X Profile
                  </label>
                  <input
                    type="url"
                    value={twitterUrl}
                    onChange={(e) => setTwitterUrl(e.target.value)}
                    placeholder="https://twitter.com/..."
                    className="author-modal-input"
                  />
                </div>
                <div className="author-modal-field">
                  <label className="author-modal-label">
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                    className="author-modal-input"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={isVerified}
                    onChange={(e) => setIsVerified(e.target.checked)}
                    className="rounded border-gray-300 text-[#2D7FF9] focus:ring-[#2D7FF9]"
                  />
                  <span>Show Verified Staff Badge</span>
                </label>
              </div>

              <div className="author-modal-actions">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary text-xs px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn btn-primary text-xs px-4 py-2 inline-flex items-center gap-1.5 font-bold"
                >
                  {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editingAuthor ? "Save Changes" : "Create Author Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
