"use client";

import { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";

export interface SavedArticleItem {
  id?: string | number;
  title: string;
  slug: string;
  categorySlug?: string;
  categoryName?: string;
  heroImage?: string;
  readingTimeMinutes?: number;
  savedAt: number;
}

const STORAGE_KEY = "techcrest_saved_articles";

export function getSavedArticles(): SavedArticleItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveArticle(article: SavedArticleItem) {
  if (typeof window === "undefined") return;
  const list = getSavedArticles();
  const exists = list.some((item) => item.slug === article.slug);
  let updated: SavedArticleItem[];
  if (exists) {
    updated = list.filter((item) => item.slug !== article.slug);
  } else {
    updated = [article, ...list];
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event("techcrest_bookmark_change"));
  return !exists;
}

export function isArticleSaved(slug: string): boolean {
  if (typeof window === "undefined") return false;
  const list = getSavedArticles();
  return list.some((item) => item.slug === slug);
}

interface BookmarkButtonProps {
  article: {
    id?: string | number;
    title: string;
    slug: string;
    categorySlug?: string;
    categoryName?: string;
    heroImage?: string;
    readingTimeMinutes?: number;
  };
  variant?: "icon" | "button" | "pill";
  className?: string;
}

export function BookmarkButton({
  article,
  variant = "icon",
  className = "",
}: BookmarkButtonProps) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isArticleSaved(article.slug));
    const handleSync = () => {
      setSaved(isArticleSaved(article.slug));
    };
    window.addEventListener("techcrest_bookmark_change", handleSync);
    return () => window.removeEventListener("techcrest_bookmark_change", handleSync);
  }, [article.slug]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nowSaved = saveArticle({
      ...article,
      savedAt: Date.now(),
    });
    setSaved(!!nowSaved);
  };

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={handleToggle}
        className={`tc-bookmark-btn tc-bookmark-btn--full ${saved ? "tc-bookmark-btn--active" : ""} ${className}`}
        aria-label={saved ? "Remove bookmark" : "Save article"}
      >
        <Bookmark className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
        <span>{saved ? "Saved" : "Save Story"}</span>
      </button>
    );
  }

  if (variant === "pill") {
    return (
      <button
        type="button"
        onClick={handleToggle}
        className={`tc-bookmark-btn tc-bookmark-btn--pill ${saved ? "tc-bookmark-btn--active" : ""} ${className}`}
        aria-label={saved ? "Remove bookmark" : "Save article"}
      >
        <Bookmark className={`w-3.5 h-3.5 ${saved ? "fill-current" : ""}`} />
        <span>{saved ? "Saved" : "Save"}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`tc-bookmark-btn tc-bookmark-btn--icon ${saved ? "tc-bookmark-btn--active" : ""} ${className}`}
      title={saved ? "Remove bookmark" : "Bookmark article"}
      aria-label={saved ? "Remove bookmark" : "Bookmark article"}
    >
      <Bookmark className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
    </button>
  );
}
