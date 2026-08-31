"use client";

import { useState } from "react";
import {
  ImageIcon,
  Upload,
  Link as LinkIcon,
  X,
  Check,
  Loader2,
  AlertCircle,
  RefreshCw,
  Copy,
} from "lucide-react";

interface EnhancedImageUploaderProps {
  value?: string | null;
  onChange: (url: string) => void;
  altText?: string | null;
  onAltTextChange?: (alt: string) => void;
  captionText?: string | null;
  onCaptionTextChange?: (caption: string) => void;
}

export function EnhancedImageUploader({
  value,
  onChange,
  altText = "",
  onAltTextChange,
  captionText = "",
  onCaptionTextChange,
}: EnhancedImageUploaderProps) {
  const currentUrl = value || "";
  const currentAlt = altText || "";
  const currentCaption = captionText || "";

  const [activeTab, setActiveTab] = useState<"file" | "url">("file");
  const [urlInput, setUrlInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // File Upload Handler
  const handleFileUpload = async (file: File) => {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (JPG, PNG, WebP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image file size exceeds 5 MB limit.");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        onChange(data.url);
        if (onAltTextChange && !currentAlt) {
          onAltTextChange(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
        }
      } else {
        // Fallback FileReader
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            onChange(e.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.error("Image upload failed:", err);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onChange(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    setError(null);
    onChange(urlInput.trim());
    setUrlInput("");
  };

  const handleCopyUrl = () => {
    if (!currentUrl) return;
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="enhanced-uploader rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-800 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#2D7FF9]/15 flex items-center justify-center text-[#2D7FF9]">
            <ImageIcon className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 block leading-tight">
              Cover Image Options
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Select or upload article hero media
            </span>
          </div>
        </div>

        {currentUrl && (
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-800 flex items-center gap-1.5 shadow-sm">
            <Check className="w-3.5 h-3.5" /> Image Active
          </span>
        )}
      </div>

      {/* ACTIVE IMAGE PREVIEW CONTAINER */}
      {currentUrl ? (
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-xl border-2 border-[#2D7FF9] bg-slate-950 group shadow-md">
            <img
              src={currentUrl}
              alt={currentAlt || "Cover Image Preview"}
              className="w-full h-48 sm:h-64 object-cover"
            />
            {isUploading && (
              <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                <Loader2 className="w-7 h-7 animate-spin text-[#2D7FF9] mb-2" />
                <span className="text-xs font-semibold">Uploading new image...</span>
              </div>
            )}
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyUrl}
                className="p-2 rounded-full bg-slate-900/90 text-white hover:bg-black transition-all shadow-md text-xs flex items-center gap-1 border border-slate-700"
                title="Copy Image URL"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-all shadow-md text-xs flex items-center gap-1"
                title="Remove Image"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* URL & Replace Controls */}
          <div className="flex items-center justify-between gap-3 text-xs flex-wrap p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
            <div className="truncate text-slate-600 dark:text-slate-300 flex-1 font-mono text-[11px]">
              {currentUrl.length > 60 ? `${currentUrl.slice(0, 60)}...` : currentUrl}
            </div>
            <button
              type="button"
              onClick={() => onChange("")}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold hover:border-[#2D7FF9] hover:text-[#2D7FF9] transition-all shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#2D7FF9]" /> Replace Image
            </button>
          </div>

          {/* Alt & Caption Input Fields */}
          {(onAltTextChange || onCaptionTextChange) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              {onAltTextChange && (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Image Alt Text (SEO)
                  </label>
                  <input
                    type="text"
                    value={currentAlt}
                    onChange={(e) => onAltTextChange(e.target.value)}
                    placeholder="e.g. High-tech smart computing device"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 outline-none focus:border-[#2D7FF9] focus:ring-1 focus:ring-[#2D7FF9]"
                  />
                </div>
              )}
              {onCaptionTextChange && (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Image Credit / Caption
                  </label>
                  <input
                    type="text"
                    value={currentCaption}
                    onChange={(e) => onCaptionTextChange(e.target.value)}
                    placeholder="e.g. Photo by TechCrest Editorial"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 outline-none focus:border-[#2D7FF9] focus:ring-1 focus:ring-[#2D7FF9]"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* UPLOAD OPTIONS TABS (ONLY 2 TABS: UPLOAD FILE & IMAGE LINK) */
        <div className="space-y-4">
          {/* Segmented Control Buttons */}
          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setActiveTab("file")}
              className={`py-2.5 px-4 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                activeTab === "file"
                  ? "bg-[#2D7FF9] text-white shadow-md border border-[#2D7FF9]"
                  : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-[#2D7FF9]/10 hover:text-[#2D7FF9] border border-slate-200 dark:border-slate-800"
              }`}
            >
              <Upload className="w-4 h-4" /> Upload File
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("url")}
              className={`py-2.5 px-4 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                activeTab === "url"
                  ? "bg-[#2D7FF9] text-white shadow-md border border-[#2D7FF9]"
                  : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-[#2D7FF9]/10 hover:text-[#2D7FF9] border border-slate-200 dark:border-slate-800"
              }`}
            >
              <LinkIcon className="w-4 h-4" /> Image Link
            </button>
          </div>

          {/* TAB 1: Drag & Drop File Upload */}
          {activeTab === "file" && (
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                isDragOver
                  ? "border-[#2D7FF9] bg-[#2D7FF9]/10"
                  : "border-slate-300 dark:border-slate-700 hover:border-[#2D7FF9] bg-slate-50/50 dark:bg-slate-900/50"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={onDrop}
            >
              <input
                id="hero-file-upload-input"
                type="file"
                accept="image/*"
                onChange={onFileInputChange}
                className="hidden"
                disabled={isUploading}
              />
              <label htmlFor="hero-file-upload-input" className="cursor-pointer block">
                <div className="w-12 h-12 rounded-full bg-[#2D7FF9]/15 border border-[#2D7FF9]/30 flex items-center justify-center mx-auto mb-3 text-[#2D7FF9]">
                  {isUploading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <Upload className="w-6 h-6" />
                  )}
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {isUploading ? "Processing image upload..." : "Drag & drop cover image here, or click to browse"}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Supports High-Res JPG, PNG, WebP (Max file size 5 MB)
                </p>
              </label>
            </div>
          )}

          {/* TAB 2: Image Web Address (URL) Input */}
          {activeTab === "url" && (
            <div className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <label className="block text-xs font-bold text-slate-900 dark:text-slate-100">
                Paste Image Web Address (URL)
              </label>
              <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="flex-1 text-xs p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 outline-none focus:border-[#2D7FF9] focus:ring-1 focus:ring-[#2D7FF9] placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  disabled={!urlInput.trim()}
                  className="w-full sm:w-auto px-5 py-3 rounded-lg bg-[#2D7FF9] text-white text-xs font-extrabold hover:bg-[#1f6ee6] disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Apply Image
                </button>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Enter any public HTTP/HTTPS image URL from Cloudinary, Unsplash, or CDN hosting.
              </p>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-xs p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
