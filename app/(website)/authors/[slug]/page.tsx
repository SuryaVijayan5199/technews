import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle, Globe, ChevronRight } from "lucide-react";
import { ArticleCard } from "@/components/article/article-card";

const MOCK_AUTHOR = {
  name: "Dr. Sarah Chen",
  slug: "sarah-chen",
  role: "Senior AI Editor",
  avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&q=80",
  bio: "Dr. Sarah Chen is TechCrest's Senior AI Editor with a PhD in Computer Science from MIT. She covers artificial intelligence, neural networks, and computer vision.",
  isVerified: true,
  articleCount: 342,
  totalViews: "4.8M",
  twitter: "https://twitter.com/sarahchen_ai",
  linkedin: "https://linkedin.com/in/sarahchen-ai",
  website: "https://sarahchen.io",
  articles: [
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
    {
      id: 2,
      title: "Google DeepMind's Gemini Ultra 2 Beats Human Experts on Medical Diagnosis",
      slug: "google-deepmind-gemini-ultra-2-medical-diagnosis",
      excerpt: "DeepMind's newest flagship AI model sets a new state of the art.",
      heroImage: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=375&fit=crop&q=80",
      publishedAt: "2026-07-30T09:00:00Z",
      readingTimeMinutes: 7,
      categorySlug: "ai",
      categoryName: "AI",
      authorName: "Dr. Sarah Chen",
    },
  ],
};

interface AuthorPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `${MOCK_AUTHOR.name} — Author Profile | TechCrest`,
    description: MOCK_AUTHOR.bio,
  };
}

export default async function AuthorProfilePage({ params }: AuthorPageProps) {
  const { slug } = await params;

  return (
    <div className="py-10">
      <div className="container">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mb-6">
          <Link href="/" className="hover:text-[var(--color-text-secondary)]">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[var(--color-text-secondary)]">Authors</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[var(--color-text-secondary)]">{MOCK_AUTHOR.name}</span>
        </nav>

        {/* Author Bio Card */}
        <div className="card p-8 mb-10 bg-gradient-to-br from-[var(--color-surface-1)] via-[var(--color-surface-2)] to-[var(--color-surface-1)]">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <div className="relative w-28 h-28 flex-shrink-0">
              <Image src={MOCK_AUTHOR.avatar} alt={MOCK_AUTHOR.name} fill className="rounded-full object-cover ring-4 ring-[var(--color-surface-border)]" />
              {MOCK_AUTHOR.isVerified && (
                <CheckCircle className="absolute bottom-0 right-0 w-7 h-7 text-[var(--color-brand-400)] bg-[var(--color-surface-0)] rounded-full" />
              )}
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
                  {MOCK_AUTHOR.name}
                </h1>
                <p className="text-sm text-[var(--color-brand-400)] font-semibold mt-0.5">{MOCK_AUTHOR.role}</p>
              </div>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-2xl">{MOCK_AUTHOR.bio}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-[var(--color-text-muted)]">
                <span>{MOCK_AUTHOR.articleCount} Articles Published</span>
                <span>•</span>
                <span>{MOCK_AUTHOR.totalViews} Total Readers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Author's Articles Feed */}
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6" style={{ fontFamily: "var(--font-outfit)" }}>
            Articles by {MOCK_AUTHOR.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_AUTHOR.articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
