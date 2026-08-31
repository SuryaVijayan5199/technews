import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Tag } from "lucide-react";
import { ArticleCard } from "@/components/article/article-card";

interface TagPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tagName = slug.toUpperCase().replace(/-/g, " ");
  return {
    title: `${tagName} News & Stories — TechCrest`,
    description: `Browse all news, reviews, and analysis tagged with ${tagName} on TechCrest.`,
  };
}

const MOCK_TAG_ARTICLES = [
  {
    id: 1,
    title: "OpenAI's GPT-5 Changes Everything: A Deep Dive Into the Next Frontier of AI",
    slug: "openai-gpt5-deep-dive-next-frontier-ai",
    excerpt: "After months of anticipation, GPT-5 is finally here — and it's more powerful than anyone expected.",
    heroImage: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&h=375&fit=crop&q=80",
    publishedAt: "2026-07-30T10:00:00Z",
    readingTimeMinutes: 12,
    categorySlug: "ai",
    categoryName: "AI",
    authorName: "Dr. Sarah Chen",
  },
];

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params;
  const tagName = slug.replace(/-/g, " ").toUpperCase();

  return (
    <div className="container py-10">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mb-6">
        <Link href="/" className="hover:text-[var(--color-text-secondary)]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[var(--color-text-secondary)]">Tags</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[var(--color-text-secondary)]">#{slug}</span>
      </nav>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-[var(--color-brand-500)]/15 border border-[var(--color-brand-500)]/30 text-[var(--color-brand-400)] flex items-center justify-center">
          <Tag className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
            #{tagName}
          </h1>
          <p className="text-xs text-[var(--color-text-muted)]">Showing articles tagged with #{slug}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_TAG_ARTICLES.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
