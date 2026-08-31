import { type ClassValue, clsx } from "clsx";

/**
 * Merges CSS class names with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Format a date for display
 */
export function formatDate(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    ...options,
  }).format(new Date(date));
}

/**
 * Format a relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSecs < 60) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  return `${diffYears}y ago`;
}

/**
 * Calculate reading time from content string
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

/**
 * Format a number with commas (e.g., 1234567 -> "1,234,567")
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

/**
 * Abbreviate large numbers (e.g., 1234567 -> "1.2M")
 */
export function abbreviateNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return String(num);
}

/**
 * Truncate text to a given length
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trimEnd() + "…";
}

/**
 * Create a URL-friendly slug from a string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Parse a rating value to ensure it's within 0-10
 */
export function clampRating(rating: number): number {
  return Math.min(10, Math.max(0, rating));
}

/**
 * Convert a rating to 0-5 star scale
 */
export function ratingToStars(rating: number): number {
  return Math.round((clampRating(rating) / 10) * 5 * 2) / 2;
}

/**
 * Get article status badge color
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    draft: "text-zinc-400 bg-zinc-400/10",
    pending_review: "text-yellow-400 bg-yellow-400/10",
    seo_review: "text-blue-400 bg-blue-400/10",
    legal_review: "text-orange-400 bg-orange-400/10",
    scheduled: "text-purple-400 bg-purple-400/10",
    published: "text-green-400 bg-green-400/10",
    archived: "text-red-400 bg-red-400/10",
  };
  return colors[status] ?? "text-zinc-400 bg-zinc-400/10";
}

/**
 * Generate an Open Graph image URL for Cloudinary
 */
export function cloudinaryUrl(
  publicId: string,
  transforms?: string
): string {
  const base = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;
  if (transforms) return `${base}/${transforms}/${publicId}`;
  return `${base}/${publicId}`;
}

/**
 * Create an absolute URL from a path
 */
export function absoluteUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return `${base}${path}`;
}

/**
 * Strips out any role suffixes in parentheses such as "(Super Admin)", "(Admin)", "(Editor)"
 */
export function cleanAuthorName(name?: string | null): string {
  if (!name) return "Surya Vijayan";
  return (
    name
      .replace(/\s*\([^)]*admin[^)]*\)/gi, "")
      .replace(/\s*\([^)]*editor[^)]*\)/gi, "")
      .replace(/\s*\([^)]*author[^)]*\)/gi, "")
      .replace(/\s*\([^)]*role[^)]*\)/gi, "")
      .replace(/\s*\([^)]*super[^)]*\)/gi, "")
      .replace(/\s*\(super\s*admin\)/gi, "")
      .replace(/\s*\(admin\)/gi, "")
      .replace(/\s*\(editor\)/gi, "")
      .replace(/\s*\(author\)/gi, "")
      .trim() || "Surya Vijayan"
  );
}

/**
 * Extract 2-letter uppercase initials from an author name (e.g., "Surya Vijayan" -> "SV")
 */
export function getAuthorInitials(name?: string | null): string {
  const clean = cleanAuthorName(name);
  const parts = clean.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return clean.substring(0, 2).toUpperCase() || "SV";
}

