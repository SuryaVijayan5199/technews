import { ArticleCard } from "@/components/article/article-card";

const HERO_ARTICLE = {
  id: 1,
  title:
    "OpenAI's GPT-5 Changes Everything: A Deep Dive Into the Next Frontier of AI",
  slug: "openai-gpt5-deep-dive-next-frontier-ai",
  excerpt:
    "After months of anticipation, GPT-5 is finally here — and it's more powerful than anyone expected. We tested it for two weeks and the results are extraordinary.",
  heroImage:
    "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&h=675&fit=crop&q=80",
  heroImageAlt: "Abstract AI visualization with glowing neural network",
  publishedAt: new Date(Date.now() - 1000 * 60 * 45),
  readingTimeMinutes: 12,
  viewCount: 48291,
  commentCount: 342,
  categorySlug: "ai",
  categoryName: "AI",
  authorName: "Dr. Sarah Chen",
  authorAvatar:
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=40&h=40&fit=crop&q=80",
  authorSlug: "sarah-chen",
  isFeatured: true,
};

const SECONDARY_ARTICLES = [
  {
    id: 2,
    title: "Samsung Galaxy S26 Ultra: The Most Powerful Android Phone Ever Made",
    slug: "samsung-galaxy-s26-ultra-review",
    heroImage:
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&h=500&fit=crop&q=80",
    heroImageAlt: "Samsung Galaxy S26 Ultra",
    publishedAt: new Date(Date.now() - 1000 * 60 * 120),
    readingTimeMinutes: 8,
    commentCount: 89,
    categorySlug: "mobile",
    categoryName: "Mobile",
    authorName: "James Park",
  },
  {
    id: 3,
    title: "EU's Landmark AI Act: What It Means for Tech Companies and Consumers",
    slug: "eu-ai-act-tech-companies-consumers-guide",
    heroImage:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=500&fit=crop&q=80",
    heroImageAlt: "European parliament building",
    publishedAt: new Date(Date.now() - 1000 * 60 * 180),
    readingTimeMinutes: 6,
    commentCount: 156,
    categorySlug: "policy",
    categoryName: "Policy",
    authorName: "Maria Kowalski",
    isBreaking: true,
  },
];

export function HeroSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      <div className="lg:col-span-3">
        <ArticleCard article={HERO_ARTICLE} variant="featured" />
      </div>
      <div className="lg:col-span-2 flex flex-col gap-4">
        {SECONDARY_ARTICLES.map((article) => (
          <ArticleCard key={article.id} article={article} variant="featured" />
        ))}
      </div>
    </div>
  );
}
