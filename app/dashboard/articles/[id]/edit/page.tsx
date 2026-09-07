"use client";

import { useState, useCallback, useEffect, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Send,
  Image as ImageIcon,
  Sparkles,
  Loader2,
  X,
  AlertCircle,
  CheckCircle,
  Calendar,
  Check,
} from "lucide-react";
import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { AiAssistantPanel } from "@/components/editor/ai-assistant-panel";
import { EnhancedImageUploader } from "@/components/dashboard/enhanced-image-uploader";
import { getArticleById, updateArticleAction, getAuthorsList } from "@/lib/actions/article.actions";
import { getCategories } from "@/lib/actions/dashboard.actions";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const MAX_SIZE = 2 * 1024 * 1024; // 2 MB

type ToastType = "success" | "error" | "info";

interface Toast {
  type: ToastType;
  message: string;
}

export default function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const articleId = parseInt(resolvedParams.id, 10);

  const router = useRouter();
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role ?? "subscriber";
  const canDirectPublish = ["super_admin", "publisher", "managing_editor", "editor"].includes(userRole);

  const [loading, setLoading] = useState(true);

  // Form state
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("news");
  const [selectedSubcategoryIds, setSelectedSubcategoryIds] = useState<number[]>([]);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [authorsList, setAuthorsList] = useState<any[]>([]);
  const [selectedAuthorId, setSelectedAuthorId] = useState<number | undefined>(undefined);
  const [status, setStatus] = useState("draft");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isEditorsPick, setIsEditorsPick] = useState(false);
  const [isLatest, setIsLatest] = useState(true);
  const [isTrending, setIsTrending] = useState(false);
  const [isBriefing, setIsBriefing] = useState(false);
  const [isGlobalBriefing, setIsGlobalBriefing] = useState(false);
  const [isBreaking, setIsBreaking] = useState(false);
  const [publishedAtStr, setPublishedAtStr] = useState<string>("");

  // Extended Article Attributes
  const [heroImageAlt, setHeroImageAlt] = useState("");
  const [heroImageCaption, setHeroImageCaption] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [sources, setSources] = useState("");

  // Image state
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [heroPreview, setHeroPreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageError, setImageError] = useState("");

  // Submission state
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // AI panel
  const [aiOpen, setAiOpen] = useState(false);

  // Toast
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (type: ToastType, message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    async function loadData() {
      try {
        const [cats, article, authorsData] = await Promise.all([
          getCategories(),
          getArticleById(articleId),
          getAuthorsList(),
        ]);

        if (cats) setCategoriesList(cats);
        if (authorsData) setAuthorsList(authorsData);

        if (article) {
          setTitle(article.title ?? "");
          setExcerpt(article.excerpt ?? "");
          setContent(article.contentHtml ?? "");
          setHeroImage(article.heroImage ?? null);
          setHeroImageAlt(article.heroImageAlt ?? "");
          setHeroImageCaption(article.heroImageCaption ?? "");
          setSeoTitle(article.seoTitle ?? "");
          setSeoDescription(article.seoDescription ?? "");
          setCustomSlug(article.slug ?? "");
          setCanonicalUrl(article.canonicalUrl ?? "");
          setStatus(article.status ?? "draft");
          setIsFeatured(article.isFeatured ?? false);
          setIsEditorsPick(article.isEditorsPick ?? false);
          setIsLatest(article.isLatest ?? true);
          setIsBreaking(article.isBreaking ?? false);
          setIsTrending(article.isTrending ?? false);
          setIsBriefing(article.isBriefing ?? false);
          if (article.secondaryCategoryIds && Array.isArray(article.secondaryCategoryIds)) {
            setSelectedSubcategoryIds(article.secondaryCategoryIds);
          }
          if (article.authorId) {
            setSelectedAuthorId(article.authorId);
          }
          if (article.publishedAt) {
            try {
              const d = new Date(article.publishedAt);
              const year = d.getFullYear();
              const month = String(d.getMonth() + 1).padStart(2, "0");
              const day = String(d.getDate()).padStart(2, "0");
              const hours = String(d.getHours()).padStart(2, "0");
              const minutes = String(d.getMinutes()).padStart(2, "0");
              setPublishedAtStr(`${year}-${month}-${day}T${hours}:${minutes}`);
            } catch (e) {
              setPublishedAtStr("");
            }
          }
          if (article.category?.slug) {
            setCategory(article.category.slug);
          } else if (cats && cats.length > 0) {
            setCategory(cats[0].slug);
          }
        } else {
          showToast("error", "Article not found.");
        }
      } catch {
        showToast("error", "Failed to load article data.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [articleId]);

  // ─── Image Upload ───────────────────────────────────────────
  const handleHeroImageUpload = useCallback(async (file: File) => {
    setImageError("");

    if (!file.type.startsWith("image/")) {
      setImageError("Only image files are allowed.");
      return;
    }

    if (file.size > MAX_SIZE) {
      setImageError(
        `Image too large (${(file.size / 1024 / 1024).toFixed(2)} MB). Maximum size is 2 MB.`
      );
      return;
    }

    const localUrl = URL.createObjectURL(file);
    setHeroPreview(localUrl);
    setHeroImage(null);
    setIsUploadingImage(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        setImageError(data.error || "Upload failed. Please try again.");
        setHeroPreview(null);
        return;
      }

      setHeroImage(data.url);
      URL.revokeObjectURL(localUrl);
    } catch {
      setImageError("Network error. Please try again.");
      setHeroPreview(null);
    } finally {
      setIsUploadingImage(false);
    }
  }, []);

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleHeroImageUpload(file);
    e.target.value = "";
  };

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleHeroImageUpload(file);
    },
    [handleHeroImageUpload]
  );

  const clearImage = () => {
    setHeroImage(null);
    setHeroPreview(null);
    setImageError("");
  };

  // ─── Save / Update ────────────────────────────────────────
  const handleSave = async (saveStatus: string) => {
    if (!title.trim()) {
      showToast("error", "Please enter an article title before saving.");
      return;
    }

    const setter = saveStatus === "published" ? setIsPublishing : setIsSaving;
    setter(true);

    try {
      const result = await updateArticleAction(articleId, {
        title: title.trim(),
        excerpt: excerpt.trim(),
        contentHtml: content,
        heroImage: heroImage ?? undefined,
        heroImageAlt: heroImageAlt.trim() || undefined,
        heroImageCaption: heroImageCaption.trim() || undefined,
        seoTitle: seoTitle.trim() || undefined,
        seoDescription: seoDescription.trim() || undefined,
        customSlug: customSlug.trim() || undefined,
        canonicalUrl: canonicalUrl.trim() || undefined,
        sources: sources.trim() || undefined,
        categorySlug: category,
        secondaryCategoryIds: selectedSubcategoryIds,
        status: saveStatus,
        authorId: selectedAuthorId,
        isFeatured,
        isEditorsPick,
        isLatest,
        isTrending,
        isBriefing,
        isGlobalBriefing,
        isBreaking,
        publishedAt: publishedAtStr ? new Date(publishedAtStr) : undefined,
      });

      if (result.success) {
        showToast(
          "success",
          saveStatus === "published"
            ? "Article published & updated!"
            : "Article updated successfully!"
        );
        setTimeout(() => router.push("/dashboard/articles"), 1200);
      } else {
        showToast("error", result.error ?? "Failed to update article.");
      }
    } catch {
      showToast("error", "An unexpected error occurred.");
    } finally {
      setter(false);
    }
  };

  const handleAiInsert = (text: string) => {
    setContent((prev) => prev + `\n\n<p>${text}</p>`);
    showToast("info", "AI content inserted into editor.");
  };

  const displayImage = heroPreview || heroImage;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--tc-blue)] mb-3" />
        <p className="text-sm text-muted-foreground">Loading article editor...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-editor px-2 sm:px-0 pb-20 sm:pb-0">
      {/* Toast */}
      {toast && (
        <div
          className={`dashboard-toast dashboard-toast--${toast.type}`}
          role="alert"
        >
          {toast.type === "success" ? (
            <CheckCircle className="w-4 h-4" />
          ) : toast.type === "error" ? (
            <AlertCircle className="w-4 h-4" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {toast.message}
        </div>
      )}

      {/* Top Action Bar */}
      <div className="dashboard-editor__topbar flex-wrap gap-3">
        <Link
          href="/dashboard/articles"
          className="btn btn-ghost dashboard-editor__back-btn"
        >
          <ArrowLeft className="w-4 h-4" /> <span className="hidden xs:inline">Back</span>
        </Link>

        <div className="dashboard-editor__actions flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-ghost dashboard-editor__action-btn text-xs sm:text-sm"
            onClick={() => handleSave(status)}
            disabled={isSaving || isPublishing}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSaving ? "Saving..." : "Save Changes"}
          </button>

          {canDirectPublish && status !== "published" && (
            <button
              type="button"
              className="btn btn-primary dashboard-editor__action-btn text-xs sm:text-sm"
              onClick={() => handleSave("published")}
              disabled={isSaving || isPublishing}
            >
              {isPublishing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {isPublishing ? "Publishing..." : "Publish Article"}
            </button>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="dashboard-editor__grid">
        {/* Left: Metadata + Editor */}
        <div className="dashboard-editor__main">
          {/* Unified Container Card for Article Title & Short Description */}
          <div className="card p-4 sm:p-6 border border-[var(--color-surface-border)] rounded-2xl bg-[var(--color-surface-1)] shadow-sm flex flex-col gap-4">
            {/* Article Title Field */}
            <div className="dashboard-editor__field">
              <label
                htmlFor="edit-article-title"
                className="dashboard-editor__label text-xs sm:text-sm font-bold block mb-1 text-[var(--color-text-primary)]"
              >
                Article Title <span className="text-red-500">*</span>
              </label>
              <textarea
                id="edit-article-title"
                rows={1}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onInput={(e) => {
                  const target = e.currentTarget;
                  target.style.height = "auto";
                  target.style.height = `${target.scrollHeight}px`;
                }}
                ref={(el) => {
                  if (el) {
                    el.style.height = "auto";
                    el.style.height = `${el.scrollHeight}px`;
                  }
                }}
                placeholder="Enter article title..."
                className="w-full p-3.5 text-lg sm:text-2xl font-extrabold rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-2)] text-[var(--color-text-primary)] focus:border-[#2D7FF9] focus:outline-none transition-all shadow-sm overflow-hidden resize-none leading-snug"
                style={{ fontFamily: "var(--font-outfit)", minHeight: "56px" }}
              />
            </div>

            {/* Short Description / Summary Excerpt Field */}
            <div className="dashboard-editor__field">
              <label
                htmlFor="edit-article-excerpt"
                className="dashboard-editor__label text-xs sm:text-sm font-bold block mb-1 text-[var(--color-text-primary)]"
              >
                Short Description / Summary Excerpt <span className="text-red-500">*</span>
              </label>
              <textarea
                id="edit-article-excerpt"
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                onInput={(e) => {
                  const target = e.currentTarget;
                  target.style.height = "auto";
                  target.style.height = `${target.scrollHeight}px`;
                }}
                ref={(el) => {
                  if (el) {
                    el.style.height = "auto";
                    el.style.height = `${el.scrollHeight}px`;
                  }
                }}
                placeholder="Write a clear, engaging short description or summary for social cards & search previews..."
                className="w-full p-3 text-sm sm:text-base rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-2)] text-[var(--color-text-primary)] focus:border-[#2D7FF9] focus:outline-none transition-all shadow-sm overflow-hidden resize-none leading-normal"
                style={{ minHeight: "72px" }}
              />
            </div>
          </div>

          {/* Content Editor (Before Cover Image) */}
          <div className="dashboard-editor__content-wrapper mt-2">
            <div className="dashboard-editor__toolbar flex-wrap">
              <span className="dashboard-editor__toolbar-title text-xs sm:text-sm font-bold">
                Rich Content Editor
              </span>
              <button
                className={`dashboard-editor__ai-btn text-xs ${aiOpen ? "dashboard-editor__ai-btn--active" : ""}`}
                onClick={() => setAiOpen((v) => !v)}
                type="button"
              >
                <Sparkles className="w-3 h-3" />
                {aiOpen ? "Close AI" : "AI Assistant"}
              </button>
            </div>
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="Start writing article content here..."
            />
          </div>

          {/* Enhanced Cover Image Options */}
          <div className="mt-4 pt-4 border-t border-[var(--color-surface-border)]">
            <label className="dashboard-editor__label text-xs sm:text-sm font-bold block mb-2 text-[var(--color-text-primary)]">
              Featured Cover Image &amp; Media
            </label>
            <EnhancedImageUploader
              value={heroImage}
              onChange={setHeroImage}
              altText={heroImageAlt}
              onAltTextChange={setHeroImageAlt}
              captionText={heroImageCaption}
              onCaptionTextChange={setHeroImageCaption}
            />
            {imageError && (
              <div className="flex items-center gap-2 text-red-400 text-xs sm:text-sm p-3 mt-2 rounded-lg bg-red-500/10 border border-red-500/20">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {imageError}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="dashboard-editor__sidebar">
          <AiAssistantPanel
            isOpen={aiOpen}
            onClose={() => setAiOpen(false)}
            context={{ title, excerpt, content }}
            onInsert={handleAiInsert}
          />

          <div className="card dashboard-editor__settings-panel p-4 sm:p-6">
            <h2 className="dashboard-editor__settings-title text-base sm:text-lg">
              Publishing Settings
            </h2>

            {/* Status */}
            <div className="dashboard-editor__field mt-3">
              <label htmlFor="edit-status-select" className="dashboard-editor__label text-xs sm:text-sm">
                Status
              </label>
              <select
                id="edit-status-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="input dashboard-editor__select text-xs sm:text-sm"
              >
                <option value="draft">Draft</option>
                <option value="pending_review">Pending Review</option>
                <option value="seo_review">SEO Review</option>
                <option value="scheduled">Scheduled</option>
                <option value="published">Published</option>
              </select>
            </div>

            {/* Category */}
            <div className="dashboard-editor__field mt-3">
              <label htmlFor="edit-category-select" className="dashboard-editor__label text-xs sm:text-sm">
                Primary Category
              </label>
              <select
                id="edit-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input dashboard-editor__select text-xs sm:text-sm"
              >
                {categoriesList.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Subcategory */}
            <div className="dashboard-editor__field mt-3">
              <label
                htmlFor="edit-subcategory-select"
                className="dashboard-editor__label text-xs sm:text-sm"
              >
                Subcategory
              </label>
              
              <select
                id="edit-subcategory-select"
                value=""
                onChange={(e) => {
                  if (e.target.value) {
                    const catId = Number(e.target.value);
                    if (!selectedSubcategoryIds.includes(catId)) {
                      setSelectedSubcategoryIds([...selectedSubcategoryIds, catId]);
                    }
                  }
                }}
                className="input dashboard-editor__select text-xs sm:text-sm w-full"
              >
                <option value="">Select subcategory...</option>
                {categoriesList
                  .filter((cat) => cat.slug !== category && !selectedSubcategoryIds.includes(cat.id))
                  .map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      + {cat.name}
                    </option>
                  ))}
              </select>

              {/* Ticker Pills for Quick Category Ticking */}
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {categoriesList
                  .filter((cat) => cat.slug !== category)
                  .map((cat) => {
                    const isSelected = selectedSubcategoryIds.includes(cat.id);
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setSelectedSubcategoryIds(selectedSubcategoryIds.filter((id) => id !== cat.id));
                          } else {
                            setSelectedSubcategoryIds([...selectedSubcategoryIds, cat.id]);
                          }
                        }}
                        className={`tc-subcategory-chip ${isSelected ? "tc-subcategory-chip--active" : ""}`}
                      >
                        {isSelected ? (
                          <Check className="w-3 h-3 stroke-[3]" />
                        ) : (
                          <span className="text-[11px] font-bold text-muted-foreground">+</span>
                        )}
                        {cat.name}
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* Author Name Selection Dropdown */}
            <div className="dashboard-editor__field mt-3">
              <label
                htmlFor="edit-author-select"
                className="dashboard-editor__label text-xs sm:text-sm font-semibold"
              >
                Author Name
              </label>
              <select
                id="edit-author-select"
                value={selectedAuthorId ?? ""}
                onChange={(e) => setSelectedAuthorId(e.target.value ? Number(e.target.value) : undefined)}
                className="input dashboard-editor__select text-xs sm:text-sm mt-1"
              >
                <option value="">Auto (Default Logged-in Author)</option>
                {authorsList.map((authObj) => (
                  <option key={authObj.id} value={authObj.id}>
                    {authObj.displayName}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-muted-foreground mt-1">
                Select an author profile created by Super Admin.
              </p>
            </div>

            {/* Extended Attributes Fields */}
            <div className="dashboard-editor__field mt-4 border-t border-[var(--color-surface-border)] pt-3">
              <label htmlFor="edit-image-alt" className="dashboard-editor__label text-xs sm:text-sm font-semibold">
                Image Alt Text
              </label>
              <input
                id="edit-image-alt"
                type="text"
                value={heroImageAlt}
                onChange={(e) => setHeroImageAlt(e.target.value)}
                placeholder="Accessible image description"
                className="input dashboard-editor__input text-xs mt-1 w-full"
              />
            </div>

            <div className="dashboard-editor__field mt-3">
              <label htmlFor="edit-image-caption" className="dashboard-editor__label text-xs sm:text-sm font-semibold">
                Image Credit &amp; Attribution
              </label>
              <input
                id="edit-image-caption"
                type="text"
                value={heroImageCaption}
                onChange={(e) => setHeroImageCaption(e.target.value)}
                placeholder="e.g. Photo by TechCrest / John Doe"
                className="input dashboard-editor__input text-xs mt-1 w-full"
              />
            </div>

            <div className="dashboard-editor__field mt-3">
              <label htmlFor="edit-seo-title" className="dashboard-editor__label text-xs sm:text-sm font-semibold">
                SEO Title Override
              </label>
              <input
                id="edit-seo-title"
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="Search engine meta title"
                className="input dashboard-editor__input text-xs mt-1 w-full"
              />
            </div>

            <div className="dashboard-editor__field mt-3">
              <label htmlFor="edit-meta-desc" className="dashboard-editor__label text-xs sm:text-sm font-semibold">
                Meta Description
              </label>
              <textarea
                id="edit-meta-desc"
                rows={2}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="Search engine meta snippet (150-160 chars)"
                className="input dashboard-editor__input text-xs mt-1 w-full p-2"
              />
            </div>

            <div className="dashboard-editor__field mt-3">
              <label htmlFor="edit-custom-slug" className="dashboard-editor__label text-xs sm:text-sm font-semibold">
                Custom URL Slug
              </label>
              <input
                id="edit-custom-slug"
                type="text"
                value={customSlug}
                onChange={(e) => setCustomSlug(e.target.value)}
                placeholder="e.g. apple-m4-ultra-launch"
                className="input dashboard-editor__input text-xs mt-1 w-full"
              />
            </div>

            {/* Publish Date & Time Field */}
            <div className="dashboard-editor__field mt-4 border-t border-[var(--color-surface-border)] pt-3">
              <label htmlFor="edit-published-at" className="dashboard-editor__label text-xs sm:text-sm font-semibold flex items-center gap-1.5 mb-1">
                <Calendar className="w-3.5 h-3.5 text-[#2D7FF9]" /> Publish Date &amp; Time
              </label>
              <input
                id="edit-published-at"
                type="datetime-local"
                value={publishedAtStr}
                onChange={(e) => setPublishedAtStr(e.target.value)}
                className="input dashboard-editor__input text-xs w-full p-2 bg-[var(--color-surface-2)] rounded-lg border border-[var(--color-surface-border)]"
              />
              <p className="text-[10px] text-muted-foreground mt-1">
                Editors can schedule or backdate publishing timestamp.
              </p>
            </div>

            {/* Homepage Section Placement Flags */}
            <div className="dashboard-editor__field mt-4 border-t border-[var(--color-surface-border)] pt-3">
              <p className="dashboard-editor__label mb-2 text-xs sm:text-sm font-bold text-[var(--color-text-primary)]">
                Homepage Section Placement
              </p>
              <div className="flex flex-col gap-2">
                {[
                  {
                    id: "edit-flag-featured",
                    label: "1. TECHCREST / FEATURED STORY",
                    sub: "Top 5 Hero Carousel on Homepage",
                    value: isFeatured,
                    setter: setIsFeatured,
                  },
                  {
                    id: "edit-flag-editors",
                    label: "2. Top Stories",
                    sub: "Primary Cover Story & Top Stories Grid",
                    value: isEditorsPick,
                    setter: setIsEditorsPick,
                  },
                  {
                    id: "edit-flag-latest",
                    label: "3. Latest Stories",
                    sub: "Standard Latest News feed flow",
                    value: isLatest,
                    setter: setIsLatest,
                  },
                  {
                    id: "edit-flag-trending",
                    label: "4. Trending Stories",
                    sub: "Most Read & Trending sidebar ranking",
                    value: isTrending,
                    setter: setIsTrending,
                  },
                  {
                    id: "edit-flag-briefing",
                    label: "5. TechCrest Briefing",
                    sub: "Daily briefing highlight list",
                    value: isBriefing,
                    setter: setIsBriefing,
                  },
                  {
                    id: "edit-flag-global-briefing",
                    label: "6. Global Briefing Section",
                    sub: "Global Briefing editorial feature section on Homepage",
                    value: isGlobalBriefing,
                    setter: setIsGlobalBriefing,
                  },
                  {
                    id: "edit-flag-breaking-ticker",
                    label: "7. LIVE NEWS Scroller / Breaking Ticker",
                    sub: "Top marquee LIVE NEWS ticker scroller bar across the site",
                    value: isBreaking,
                    setter: setIsBreaking,
                  },
                ].map((flag) => (
                  <label
                    key={flag.id}
                    htmlFor={flag.id}
                    className={`flex items-start gap-2.5 cursor-pointer text-xs sm:text-sm p-2.5 rounded-lg transition-colors border ${
                      flag.value
                        ? "border-[#2D7FF9] bg-[#2D7FF9]/10"
                        : "border-[var(--color-surface-border)] hover:bg-[var(--color-surface-2)]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      id={flag.id}
                      checked={flag.value}
                      onChange={(e) => flag.setter(e.target.checked)}
                      className="mt-0.5 rounded border-gray-300 text-[#2D7FF9] focus:ring-[#2D7FF9]"
                    />
                    <div>
                      <span className="font-bold text-[11px] sm:text-xs text-[var(--color-text-primary)] block">
                        {flag.label}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{flag.sub}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}