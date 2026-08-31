import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

const TRENDING = [
  {
    id: 1,
    title: "OpenAI GPT-5 Release: Everything We Know",
    slug: "openai-gpt5-release-everything-we-know",
    categorySlug: "ai",
    viewCount: 89421,
    publishedAt: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: 2,
    title: "iPhone 17 Pro Leaked: Titanium Frame and 48MP Front Camera",
    slug: "iphone-17-pro-leaked-specs",
    categorySlug: "mobile",
    viewCount: 67834,
    publishedAt: new Date(Date.now() - 1000 * 60 * 90),
  },
  {
    id: 3,
    title: "Microsoft Copilot Gets Real-Time Web Browsing and Memory",
    slug: "microsoft-copilot-real-time-browsing-memory",
    categorySlug: "ai",
    viewCount: 54201,
    publishedAt: new Date(Date.now() - 1000 * 60 * 150),
  },
  {
    id: 4,
    title: "Nvidia GeForce RTX 5090 Benchmarks Are Absolutely Insane",
    slug: "nvidia-rtx-5090-benchmarks",
    categorySlug: "gaming",
    viewCount: 48902,
    publishedAt: new Date(Date.now() - 1000 * 60 * 200),
  },
  {
    id: 5,
    title: "The Best Budget Android Phones You Can Buy Right Now",
    slug: "best-budget-android-phones-2026",
    categorySlug: "mobile",
    viewCount: 42100,
    publishedAt: new Date(Date.now() - 1000 * 60 * 300),
  },
  {
    id: 6,
    title: "Google's New Pixel 10 Series: Tensor G5 and 7 Days Battery",
    slug: "google-pixel-10-tensor-g5-battery",
    categorySlug: "mobile",
    viewCount: 38540,
    publishedAt: new Date(Date.now() - 1000 * 60 * 400),
  },
];

export function TrendingSection() {
  return (
    <ol className="space-y-3" aria-label="Trending articles">
      {TRENDING.map((article, i) => (
        <li key={article.id} className="group">
          <Link
            href={`/${article.categorySlug}/${article.slug}`}
            className="flex items-start gap-3"
          >
            <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-surface-border)] flex items-center justify-center text-xs font-bold text-[var(--color-text-muted)] group-hover:bg-[var(--color-brand-500)] group-hover:text-white group-hover:border-transparent transition-all">
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] line-clamp-2 leading-snug transition-colors">
                {article.title}
              </p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1 flex items-center gap-2">
                <TrendingUp className="w-3 h-3" />
                {article.viewCount.toLocaleString()} views
                <span>·</span>
                {formatRelativeTime(article.publishedAt)}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ol>
  );
}
