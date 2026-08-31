"use client";

import { useState, useCallback, useEffect } from "react";
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
} from "lucide-react";
import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { AiAssistantPanel } from "@/components/editor/ai-assistant-panel";
import { EnhancedImageUploader } from "@/components/dashboard/enhanced-image-uploader";
import { createArticle } from "@/lib/actions/article.actions";
import { getCategories } from "@/lib/actions/dashboard.actions";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const MAX_SIZE = 2 * 1024 * 1024; // 2 MB

type ToastType = "success" | "error" | "info";

interface Toast {
  type: ToastType;
  message: string;
}

export default function NewArticleEditorPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role ?? "subscriber";
  const canDirectPublish = ["super_admin", "publisher", "managing_editor", "editor"].includes(userRole);

  // Form state
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("news");
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [status, setStatus] = useState("draft");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isEditorsPick, setIsEditorsPick] = useState(false);
  const [isLatest, setIsLatest] = useState(true);
  const [isTrending, setIsTrending] = useState(false);
  const [isBriefing, setIsBriefing] = useState(false);
  const [isBreaking, setIsBreaking] = useState(false);
  const [publishedAtStr, setPublishedAtStr] = useState<string>(
    new Date().toISOString().slice(0, 16)
  );

  // Extended Article Attributes
  const [heroImageAlt, setHeroImageAlt] = useState("");
  const [heroImageCaption, setHeroImageCaption] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [sources, setSources] = useState("");

  useEffect(() => {
    getCategories().then((data) => {
      if (data && data.length > 0) {
        setCategoriesList(data);
        setCategory(data[0].slug);
      }
    });
  }, []);

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

  // ─── Image Upload ───────────────────────────────────────────
  const handleHeroImageUpload = useCallback(
    async (file: File) => {
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
    },
    []
  );

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

  // ─── Save / Publish ────────────────────────────────────────
  const handleSave = async (saveStatus: string) => {
    if (!title.trim()) {
      showToast("error", "Please enter an article title before saving.");
      return;
    }

    const setter = saveStatus === "published" ? setIsPublishing : setIsSaving;
    setter(true);

    try {
      const result = await createArticle({
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
        status: saveStatus,
        isFeatured,
        isEditorsPick,
        isBreaking,
        isTrending,
        publishedAt: publishedAtStr ? new Date(publishedAtStr) : undefined,
      });

      if (result.success) {
        showToast(
          "success",
          saveStatus === "published"
            ? "Article published successfully!"
            : saveStatus === "pending_review"
            ? "Article submitted for review!"
            : "Draft saved successfully!"
        );
        setTimeout(() => router.push("/dashboard/articles"), 1200);
      } else {
        showToast("error", result.error ?? "Failed to save article.");
      }
    } catch {
      showToast("error", "An unexpected error occurred.");
    } finally {
      setter(false);
    }
  };

  // ─── AI Insert ─────────────────────────────────────────────
  const handleAiInsert = (text: string) => {
    setContent((prev) => prev + `\n\n<p>${text}</p>`);
    showToast("info", "AI content inserted into editor.");
  };

  const displayImage = heroPreview || heroImage;

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
            onClick={() => handleSave("draft")}
            disabled={isSaving || isPublishing}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSaving ? "Saving..." : "Save Draft"}
          </button>

          <button
            type="button"
            className="btn btn-secondary dashboard-editor__action-btn text-xs sm:text-sm"
            onClick={() => handleSave("pending_review")}
            disabled={isSaving || isPublishing}
          >
            {isPublishing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {isPublishing ? "Submitting..." : "Submit Review"}
          </button>

          {canDirectPublish && (
            <button
              type="button"
              className="btn btn-primary dashboard-editor__action-btn text-xs sm:text-sm"
              onClick={() => handleSave("published")}
              disabled={isSaving || isPublishing}
            >
              {isPublishing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              {isPublishing ? "Publishing..." : "Publish Now"}
            </button>
          )}
        </div>
      </div>

      <div className="dashboard-editor__layout">
        {/* Main Editor */}
        <div className="dashboard-editor__main">
          {/* Title */}
          <input
            id="editor-article-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Article Title..."
            className="dashboard-editor__title-input"
            style={{ fontFamily: "var(--font-outfit)" }}
          />

          {/* Excerpt */}
          <textarea
            id="editor-article-excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Write a short summary or excerpt for social previews..."
            rows={2}
            className="input dashboard-editor__excerpt-input text-sm sm:text-base"
          />

          {/* Enhanced Cover Image Options */}
          <EnhancedImageUploader
            value={heroImage}
            onChange={setHeroImage}
            altText={heroImageAlt}
            onAltTextChange={setHeroImageAlt}
            captionText={heroImageCaption}
            onCaptionTextChange={setHeroImageCaption}
          />

          {/* Image error */}
          {imageError && (
            <div className="flex items-center gap-2 text-red-400 text-xs sm:text-sm p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {imageError}
            </div>
          )}

          {/* Content Editor */}
          <div className="dashboard-editor__content-wrapper">
            <div className="dashboard-editor__toolbar flex-wrap">
              <span className="dashboard-editor__toolbar-title text-xs sm:text-sm">
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
        </div>

        {/* Right: Sidebar + AI Panel stacked */}
        <div className="dashboard-editor__sidebar">
          {/* AI Assistant Panel */}
          <AiAssistantPanel
            isOpen={aiOpen}
            onClose={() => setAiOpen(false)}
            context={{ title, excerpt, content }}
            onInsert={handleAiInsert}
          />

          {/* Publishing Settings */}
          <div className="card dashboard-editor__settings-panel p-4 sm:p-6">
            <h2 className="dashboard-editor__settings-title text-base sm:text-lg">
              Publishing Settings
            </h2>

            {/* Status */}
            <div className="dashboard-editor__field mt-3">
              <label
                htmlFor="editor-status-select"
                className="dashboard-editor__label text-xs sm:text-sm"
              >
                Status
              </label>
              <select
                id="editor-status-select"
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
              <label
                htmlFor="editor-category-select"
                className="dashboard-editor__label text-xs sm:text-sm"
              >
                Category
              </label>
              <select
                id="editor-category-select"
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

            {/* Extended Attributes Fields */}
            <div className="dashboard-editor__field mt-4 border-t border-[var(--color-surface-border)] pt-3">
              <label htmlFor="editor-image-alt" className="dashboard-editor__label text-xs sm:text-sm font-semibold">
                Image Alt Text
              </label>
              <input
                id="editor-image-alt"
                type="text"
                value={heroImageAlt}
                onChange={(e) => setHeroImageAlt(e.target.value)}
                placeholder="Accessible image description"
                className="input dashboard-editor__input text-xs mt-1 w-full"
              />
            </div>

            <div className="dashboard-editor__field mt-3">
              <label htmlFor="editor-image-caption" className="dashboard-editor__label text-xs sm:text-sm font-semibold">
                Image Credit &amp; Attribution
              </label>
              <input
                id="editor-image-caption"
                type="text"
                value={heroImageCaption}
                onChange={(e) => setHeroImageCaption(e.target.value)}
                placeholder="e.g. Photo by Reuters / John Doe"
                className="input dashboard-editor__input text-xs mt-1 w-full"
              />
            </div>

            <div className="dashboard-editor__field mt-3">
              <label htmlFor="editor-seo-title" className="dashboard-editor__label text-xs sm:text-sm font-semibold">
                SEO Title Override
              </label>
              <input
                id="editor-seo-title"
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="Search engine meta title"
                className="input dashboard-editor__input text-xs mt-1 w-full"
              />
            </div>

            <div className="dashboard-editor__field mt-3">
              <label htmlFor="editor-meta-desc" className="dashboard-editor__label text-xs sm:text-sm font-semibold">
                Meta Description
              </label>
              <textarea
                id="editor-meta-desc"
                rows={2}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="Search engine meta snippet (150-160 chars)"
                className="input dashboard-editor__input text-xs mt-1 w-full p-2"
              />
            </div>

            <div className="dashboard-editor__field mt-3">
              <label htmlFor="editor-custom-slug" className="dashboard-editor__label text-xs sm:text-sm font-semibold">
                Custom URL Slug
              </label>
              <input
                id="editor-custom-slug"
                type="text"
                value={customSlug}
                onChange={(e) => setCustomSlug(e.target.value)}
                placeholder="e.g. apple-m4-ultra-launch"
                className="input dashboard-editor__input text-xs mt-1 w-full"
              />
            </div>

            <div className="dashboard-editor__field mt-3">
              <label htmlFor="editor-canonical-url" className="dashboard-editor__label text-xs sm:text-sm font-semibold">
                Canonical URL
              </label>
              <input
                id="editor-canonical-url"
                type="text"
                value={canonicalUrl}
                onChange={(e) => setCanonicalUrl(e.target.value)}
                placeholder="https://technews-lyart.vercel.app/..."
                className="input dashboard-editor__input text-xs mt-1 w-full"
              />
            </div>

            <div className="dashboard-editor__field mt-3">
              <label htmlFor="editor-sources" className="dashboard-editor__label text-xs sm:text-sm font-semibold">
                Sources &amp; References
              </label>
              <textarea
                id="editor-sources"
                rows={2}
                value={sources}
                onChange={(e) => setSources(e.target.value)}
                placeholder="List citations, official press releases, benchmarks..."
                className="input dashboard-editor__input text-xs mt-1 w-full p-2"
              />
            </div>

            {/* Publish Date & Time Field */}
            <div className="dashboard-editor__field mt-4 border-t border-[var(--color-surface-border)] pt-3">
              <label htmlFor="editor-published-at" className="dashboard-editor__label text-xs sm:text-sm font-semibold flex items-center gap-1.5 mb-1">
                <Calendar className="w-3.5 h-3.5 text-[#2D7FF9]" /> Publish Date &amp; Time
              </label>
              <input
                id="editor-published-at"
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
                    id: "flag-featured",
                    label: "1. TECHCREST / FEATURED STORY",
                    sub: "Top 5 Hero Carousel on Homepage",
                    value: isFeatured,
                    setter: setIsFeatured,
                  },
                  {
                    id: "flag-editors-pick",
                    label: "2. Top Stories",
                    sub: "Primary Cover Story & Top Stories Grid",
                    value: isEditorsPick,
                    setter: setIsEditorsPick,
                  },
                  {
                    id: "flag-latest",
                    label: "3. Latest Stories",
                    sub: "Standard Latest News feed flow",
                    value: isLatest,
                    setter: setIsLatest,
                  },
                  {
                    id: "flag-trending",
                    label: "4. Trending Stories",
                    sub: "Most Read & Trending sidebar ranking",
                    value: isTrending,
                    setter: setIsTrending,
                  },
                  {
                    id: "flag-briefing",
                    label: "5. TechCrest Briefing",
                    sub: "Daily briefing highlight list",
                    value: isBriefing,
                    setter: setIsBriefing,
                  },
                  {
                    id: "flag-breaking",
                    label: "6. Global Briefing",
                    sub: "Global Briefing section & Breaking ticker",
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

            {/* Publish Action Button */}
            <button
              type="button"
              className="btn btn-primary w-full mt-5 py-3 text-sm font-semibold"
              onClick={() => handleSave(canDirectPublish ? "published" : "pending_review")}
              disabled={isSaving || isPublishing}
            >
              {isPublishing ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2 inline" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-2 inline" />
              )}
              {isPublishing
                ? "Publishing..."
                : canDirectPublish
                ? "Publish Now"
                : "Submit for Approval"}
            </button>
          </div>
        </div>
      </div>

      {/* Floating Sticky Mobile Bottom Action Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-[var(--color-surface-1)] border-t border-[var(--color-surface-border)] shadow-xl flex items-center justify-between gap-2 backdrop-blur-md">
        <button
          type="button"
          onClick={() => handleSave("draft")}
          disabled={isSaving || isPublishing}
          className="btn btn-ghost flex-1 text-xs py-2.5 px-2"
        >
          <Save className="w-3.5 h-3.5 mr-1 inline" /> Draft
        </button>
        <button
          type="button"
          onClick={() => handleSave(canDirectPublish ? "published" : "pending_review")}
          disabled={isSaving || isPublishing}
          className="btn btn-primary flex-1 text-xs py-2.5 px-2"
        >
          {isPublishing ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin mr-1 inline" />
          ) : (
            <CheckCircle className="w-3.5 h-3.5 mr-1 inline" />
          )}
          {canDirectPublish ? "Publish" : "Submit"}
        </button>
      </div>
    </div>
  );
}
