import {
  pgTable,
  text,
  varchar,
  timestamp,
  boolean,
  integer,
  real,
  jsonb,
  pgEnum,
  serial,
  primaryKey,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─────────────────────────────────────────────
// ENUMS
// ─────────────────────────────────────────────
export const roleEnum = pgEnum("role", [
  "super_admin",
  "publisher",
  "managing_editor",
  "editor",
  "reviewer",
  "author",
  "contributor",
  "subscriber",
]);

export const articleStatusEnum = pgEnum("article_status", [
  "draft",
  "pending_review",
  "seo_review",
  "legal_review",
  "scheduled",
  "published",
  "archived",
]);

export const commentStatusEnum = pgEnum("comment_status", [
  "pending",
  "approved",
  "rejected",
  "spam",
]);

export const notificationTypeEnum = pgEnum("notification_type", [
  "article_approved",
  "article_rejected",
  "comment_reply",
  "article_published",
  "mention",
  "system",
]);

// ─────────────────────────────────────────────
// USERS & AUTH
// ─────────────────────────────────────────────
export const users = pgTable(
  "users",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    email: text("email").unique().notNull(),
    emailVerified: timestamp("email_verified", { mode: "date" }),
    image: text("image"),
    role: roleEnum("role").default("subscriber").notNull(),
    bio: text("bio"),
    website: text("website"),
    twitterHandle: varchar("twitter_handle", { length: 50 }),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("users_email_idx").on(t.email)]
);

export const accounts = pgTable(
  "accounts",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (t) => [primaryKey({ columns: [t.provider, t.providerAccountId] })]
);

export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.identifier, t.token] })]
);

// ─────────────────────────────────────────────
// AUTHORS (extended user profile for writers)
// ─────────────────────────────────────────────
export const authors = pgTable("authors", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  slug: varchar("slug", { length: 100 }).unique().notNull(),
  displayName: varchar("display_name", { length: 100 }).notNull(),
  bio: text("bio"),
  avatar: text("avatar"),
  coverImage: text("cover_image"),
  expertise: text("expertise").array(),
  twitterUrl: text("twitter_url"),
  linkedinUrl: text("linkedin_url"),
  githubUrl: text("github_url"),
  websiteUrl: text("website_url"),
  articleCount: integer("article_count").default(0).notNull(),
  totalViews: integer("total_views").default(0).notNull(),
  isVerified: boolean("is_verified").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─────────────────────────────────────────────
// CATEGORIES
// ─────────────────────────────────────────────
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).unique().notNull(),
  description: text("description"),
  icon: varchar("icon", { length: 50 }),
  color: varchar("color", { length: 20 }),
  image: text("image"),
  parentId: integer("parent_id").references((): any => categories.id),
  sortOrder: integer("sort_order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  articleCount: integer("article_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─────────────────────────────────────────────
// TAGS
// ─────────────────────────────────────────────
export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).unique().notNull(),
  description: text("description"),
  articleCount: integer("article_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─────────────────────────────────────────────
// BRANDS & PRODUCTS
// ─────────────────────────────────────────────
export const brands = pgTable("brands", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).unique().notNull(),
  logo: text("logo"),
  website: text("website"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).unique().notNull(),
  brandId: integer("brand_id").references(() => brands.id),
  categoryId: integer("category_id").references(() => categories.id),
  description: text("description"),
  specs: jsonb("specs").$type<Record<string, string>>(),
  images: text("images").array(),
  price: real("price"),
  currency: varchar("currency", { length: 3 }).default("USD"),
  availability: varchar("availability", { length: 50 }),
  affiliateUrl: text("affiliate_url"),
  launchDate: timestamp("launch_date"),
  averageRating: real("average_rating"),
  reviewCount: integer("review_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─────────────────────────────────────────────
// ARTICLES (Core content)
// ─────────────────────────────────────────────
export const articles = pgTable(
  "articles",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 300 }).notNull(),
    slug: varchar("slug", { length: 300 }).unique().notNull(),
    excerpt: text("excerpt"),
    content: jsonb("content"), // Lexical/ProseMirror JSON
    contentHtml: text("content_html"), // Rendered HTML for display
    heroImage: text("hero_image"),
    heroImageAlt: text("hero_image_alt"),
    heroImageCaption: text("hero_image_caption"),

    // Author & ownership
    authorId: integer("author_id").references(() => authors.id),
    coAuthorIds: integer("co_author_ids").array(),

    // Classification
    categoryId: integer("category_id").references(() => categories.id),
    secondaryCategoryIds: integer("secondary_category_ids").array(),

    // Status & workflow
    status: articleStatusEnum("status").default("draft").notNull(),
    isBreaking: boolean("is_breaking").default(false).notNull(),
    isFeatured: boolean("is_featured").default(false).notNull(),
    isEditorsPick: boolean("is_editors_pick").default(false).notNull(),
    isTrending: boolean("is_trending").default(false).notNull(),
    isLatest: boolean("is_latest").default(true).notNull(),
    isBriefing: boolean("is_briefing").default(false).notNull(),
    isGlobalBriefing: boolean("is_global_briefing").default(false).notNull(),

    // Timestamps
    publishedAt: timestamp("published_at"),
    scheduledAt: timestamp("scheduled_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),

    // SEO
    seoTitle: varchar("seo_title", { length: 200 }),
    seoDescription: text("seo_description"),
    canonicalUrl: text("canonical_url"),
    ogImage: text("og_image"),

    // Analytics
    viewCount: integer("view_count").default(0).notNull(),
    readingTimeMinutes: integer("reading_time_minutes"),
    commentCount: integer("comment_count").default(0).notNull(),
    bookmarkCount: integer("bookmark_count").default(0).notNull(),

    // Search vector
    searchVector: text("search_vector"),
  },
  (t) => [
    index("articles_status_idx").on(t.status),
    index("articles_published_at_idx").on(t.publishedAt),
    index("articles_author_idx").on(t.authorId),
    index("articles_category_idx").on(t.categoryId),
    uniqueIndex("articles_slug_idx").on(t.slug),
  ]
);

// ─────────────────────────────────────────────
// ARTICLE TAGS (many-to-many)
// ─────────────────────────────────────────────
export const articleTags = pgTable(
  "article_tags",
  {
    articleId: integer("article_id")
      .notNull()
      .references(() => articles.id, { onDelete: "cascade" }),
    tagId: integer("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.articleId, t.tagId] })]
);

// ─────────────────────────────────────────────
// REVIEWS
// ─────────────────────────────────────────────
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  articleId: integer("article_id")
    .unique()
    .references(() => articles.id, { onDelete: "cascade" }),
  productId: integer("product_id").references(() => products.id),
  overallRating: real("overall_rating").notNull(), // 0-10
  performanceRating: real("performance_rating"),
  displayRating: real("display_rating"),
  cameraRating: real("camera_rating"),
  batteryRating: real("battery_rating"),
  valueRating: real("value_rating"),
  designRating: real("design_rating"),
  pros: text("pros").array(),
  cons: text("cons").array(),
  verdict: text("verdict"),
  testDate: timestamp("test_date"),
  editorChoice: boolean("editor_choice").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─────────────────────────────────────────────
// BUYING GUIDES
// ─────────────────────────────────────────────
export const buyingGuides = pgTable("buying_guides", {
  id: serial("id").primaryKey(),
  articleId: integer("article_id")
    .unique()
    .references(() => articles.id, { onDelete: "cascade" }),
  topPicks: jsonb("top_picks").$type<
    Array<{ productId: number; reason: string; badge?: string }>
  >(),
  comparisonTable: jsonb("comparison_table"),
  faq: jsonb("faq").$type<Array<{ question: string; answer: string }>>(),
  buyingAdvice: text("buying_advice"),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─────────────────────────────────────────────
// MEDIA LIBRARY
// ─────────────────────────────────────────────
export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  filename: varchar("filename", { length: 255 }).notNull(),
  originalName: varchar("original_name", { length: 255 }),
  mimeType: varchar("mime_type", { length: 100 }),
  fileSize: integer("file_size"),
  url: text("url").notNull(),
  cloudinaryId: text("cloudinary_id"),
  width: integer("width"),
  height: integer("height"),
  alt: text("alt"),
  caption: text("caption"),
  uploadedBy: text("uploaded_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─────────────────────────────────────────────
// COMMENTS
// ─────────────────────────────────────────────
export const comments = pgTable(
  "comments",
  {
    id: serial("id").primaryKey(),
    articleId: integer("article_id")
      .notNull()
      .references(() => articles.id, { onDelete: "cascade" }),
    authorId: text("author_id").references(() => users.id),
    parentId: integer("parent_id").references((): any => comments.id),
    content: text("content").notNull(),
    status: commentStatusEnum("status").default("pending").notNull(),
    guestName: varchar("guest_name", { length: 100 }),
    guestEmail: varchar("guest_email", { length: 255 }),
    likes: integer("likes").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [index("comments_article_idx").on(t.articleId)]
);

// ─────────────────────────────────────────────
// USER INTERACTIONS
// ─────────────────────────────────────────────
export const bookmarks = pgTable(
  "bookmarks",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    articleId: integer("article_id")
      .notNull()
      .references(() => articles.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.articleId] })]
);

export const readingHistory = pgTable(
  "reading_history",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
    articleId: integer("article_id").references(() => articles.id, {
      onDelete: "cascade",
    }),
    sessionId: text("session_id"),
    readAt: timestamp("read_at").defaultNow().notNull(),
    readingProgress: integer("reading_progress").default(0), // 0-100%
    readingTimeSeconds: integer("reading_time_seconds").default(0),
  },
  (t) => [index("reading_history_user_idx").on(t.userId)]
);

// ─────────────────────────────────────────────
// NEWSLETTER
// ─────────────────────────────────────────────
export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  name: varchar("name", { length: 100 }),
  isConfirmed: boolean("is_confirmed").default(false).notNull(),
  confirmedAt: timestamp("confirmed_at"),
  preferences: jsonb("preferences").$type<{
    categories: string[];
    frequency: "daily" | "weekly" | "monthly";
  }>(),
  unsubscribedAt: timestamp("unsubscribed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─────────────────────────────────────────────
// NOTIFICATIONS
// ─────────────────────────────────────────────
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: notificationTypeEnum("type").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  message: text("message"),
  link: text("link"),
  isRead: boolean("is_read").default(false).notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─────────────────────────────────────────────
// ADVERTISEMENTS
// ─────────────────────────────────────────────
export const advertisements = pgTable("advertisements", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  placement: varchar("placement", { length: 100 }).notNull(), // e.g. "sidebar", "header", "article-mid"
  imageUrl: text("image_url"),
  targetUrl: text("target_url"),
  isActive: boolean("is_active").default(true).notNull(),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  impressions: integer("impressions").default(0).notNull(),
  clicks: integer("clicks").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─────────────────────────────────────────────
// AFFILIATE LINKS
// ─────────────────────────────────────────────
export const affiliateLinks = pgTable("affiliate_links", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id),
  articleId: integer("article_id").references(() => articles.id),
  url: text("url").notNull(),
  label: varchar("label", { length: 100 }),
  platform: varchar("platform", { length: 50 }), // Amazon, Best Buy, etc.
  clicks: integer("clicks").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─────────────────────────────────────────────
// TRENDING ARTICLES
// ─────────────────────────────────────────────
export const trendingArticles = pgTable("trending_articles", {
  id: serial("id").primaryKey(),
  articleId: integer("article_id")
    .notNull()
    .references(() => articles.id, { onDelete: "cascade" }),
  score: real("score").default(0).notNull(),
  period: varchar("period", { length: 20 }).notNull(), // "daily", "weekly", "monthly"
  rank: integer("rank").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─────────────────────────────────────────────
// ANALYTICS EVENTS
// ─────────────────────────────────────────────
export const analyticsEvents = pgTable(
  "analytics_events",
  {
    id: serial("id").primaryKey(),
    type: varchar("type", { length: 100 }).notNull(), // "page_view", "article_read", "cta_click"
    userId: text("user_id").references(() => users.id),
    sessionId: text("session_id"),
    articleId: integer("article_id").references(() => articles.id),
    metadata: jsonb("metadata"),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("analytics_type_idx").on(t.type),
    index("analytics_created_at_idx").on(t.createdAt),
  ]
);

// ─────────────────────────────────────────────
// VIDEOS & PODCASTS
// ─────────────────────────────────────────────
export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 300 }).notNull(),
  slug: varchar("slug", { length: 300 }).unique().notNull(),
  description: text("description"),
  thumbnail: text("thumbnail"),
  youtubeId: varchar("youtube_id", { length: 20 }),
  cloudinaryId: text("cloudinary_id"),
  duration: integer("duration"), // seconds
  articleId: integer("article_id").references(() => articles.id),
  authorId: integer("author_id").references(() => authors.id),
  viewCount: integer("view_count").default(0).notNull(),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const podcasts = pgTable("podcasts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 300 }).notNull(),
  slug: varchar("slug", { length: 300 }).unique().notNull(),
  description: text("description"),
  thumbnail: text("thumbnail"),
  audioUrl: text("audio_url"),
  episodeNumber: integer("episode_number"),
  seasonNumber: integer("season_number"),
  duration: integer("duration"), // seconds
  authorId: integer("author_id").references(() => authors.id),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─────────────────────────────────────────────
// RELATIONS
// ─────────────────────────────────────────────
export const usersRelations = relations(users, ({ one, many }) => ({
  author: one(authors, { fields: [users.id], references: [authors.userId] }),
  accounts: many(accounts),
  sessions: many(sessions),
  bookmarks: many(bookmarks),
  notifications: many(notifications),
}));

export const authorsRelations = relations(authors, ({ one, many }) => ({
  user: one(users, { fields: [authors.userId], references: [users.id] }),
  articles: many(articles),
}));

export const articlesRelations = relations(articles, ({ one, many }) => ({
  author: one(authors, {
    fields: [articles.authorId],
    references: [authors.id],
  }),
  category: one(categories, {
    fields: [articles.categoryId],
    references: [categories.id],
  }),
  tags: many(articleTags),
  comments: many(comments),
  review: one(reviews, {
    fields: [articles.id],
    references: [reviews.articleId],
  }),
  buyingGuide: one(buyingGuides, {
    fields: [articles.id],
    references: [buyingGuides.articleId],
  }),
  bookmarks: many(bookmarks),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: "category_parent_children",
  }),
  children: many(categories, {
    relationName: "category_parent_children",
  }),
  articles: many(articles),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  articles: many(articleTags),
}));

export const articleTagsRelations = relations(articleTags, ({ one }) => ({
  article: one(articles, {
    fields: [articleTags.articleId],
    references: [articles.id],
  }),
  tag: one(tags, { fields: [articleTags.tagId], references: [tags.id] }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  article: one(articles, {
    fields: [reviews.articleId],
    references: [articles.id],
  }),
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  article: one(articles, {
    fields: [comments.articleId],
    references: [articles.id],
  }),
  author: one(users, { fields: [comments.authorId], references: [users.id] }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
  }),
  replies: many(comments),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  brand: one(brands, { fields: [products.brandId], references: [brands.id] }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  reviews: many(reviews),
  affiliateLinks: many(affiliateLinks),
}));
