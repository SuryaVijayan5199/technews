/**
 * TechCrest Centralized Cache Tag Definitions
 * 
 * Provides consistent tag generators and string constants for cache boundaries.
 */

export const TAGS = {
  // Global & Page Tags
  homepage: "homepage",
  featured: "featured",
  latestNews: "latest-news",
  trending: "trending",
  editorsPicks: "editors-picks",
  briefing: "briefing",
  globalBriefing: "global-briefing",
  breakingNews: "breaking-news",
  buyingGuides: "buying-guides",
  categoriesList: "categories-list",

  // Entity Specific Tag Generators
  article: (id: number | string) => `article:${id}`,
  articleSlug: (slug: string) => `article-slug:${slug}`,
  category: (slug: string) => `category:${slug}`,
  author: (id: number | string) => `author:${id}`,
  authorSlug: (slug: string) => `author-slug:${slug}`,
  tag: (slug: string) => `tag:${slug}`,
  comments: (articleId: number | string) => `comments:${articleId}`,
} as const;
