import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, XCircle, ShoppingCart, Award, ChevronRight, Share2 } from "lucide-react";
import { RatingStars, RatingBar } from "@/components/shared/rating-stars";
import { ShareButtons } from "@/components/article/share-buttons";

const REVIEW_DATA = {
  title: "Apple MacBook Pro 14 M4 Review",
  subtitle: "The best laptop money can buy — period.",
  overallRating: 9.4,
  badge: "Editor's Choice",
  price: "$1,999",
  testedDate: "July 2026",
  authorName: "Alex Thompson",
  authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&q=80",
  image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=1200&h=675&fit=crop&q=80",
  affiliateUrl: "https://apple.com",
  scores: [
    { label: "Performance", value: 9.8 },
    { label: "Display & Audio", value: 9.6 },
    { label: "Battery Life", value: 9.9 },
    { label: "Build & Design", value: 9.2 },
    { label: "Value for Money", value: 8.5 },
  ],
  pros: [
    "Unmatched single-core and multi-core CPU speeds",
    "Liquid Retina XDR screen with nano-texture option",
    "24-hour real-world battery life on a single charge",
    "Completely silent operation under standard workloads",
  ],
  cons: [
    "Base model comes with 16GB RAM (32GB recommended for pro video editing)",
    "Nano-texture glass upgrade adds $150 to base price",
  ],
  verdict:
    "The 14-inch MacBook Pro M4 is Apple's finest laptop to date. It delivers workstation-level performance inside a sleek, portable chassis with battery life that leaves every Windows competitor in the dust.",
  specs: {
    Processor: "Apple M4 (10-core CPU, 10-core GPU)",
    RAM: "16GB / 24GB / 32GB Unified Memory",
    Storage: "512GB to 2TB NVMe SSD",
    Display: '14.2-inch Liquid Retina XDR (3024 x 1964, 120Hz ProMotion)',
    Battery: "72.4-watt-hour lithium-polymer (up to 24 hrs)",
    Weight: "3.4 lbs (1.55 kg)",
    Ports: "3x Thunderbolt 4, HDMI, SDXC slot, MagSafe 3",
  },
};

interface ReviewPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ReviewPageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `${REVIEW_DATA.title} — TechCrest Review`,
    description: REVIEW_DATA.verdict,
  };
}

export default async function ProductReviewPage({ params }: ReviewPageProps) {
  const { slug } = await params;

  return (
    <div className="py-8">
      <div className="container">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mb-6">
          <Link href="/" className="hover:text-[var(--color-text-secondary)]">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/reviews" className="hover:text-[var(--color-text-secondary)]">Reviews</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[var(--color-text-secondary)] truncate max-w-xs">{REVIEW_DATA.title}</span>
        </nav>

        {/* Review Hero Score Box */}
        <div className="card p-6 md:p-8 mb-10 bg-gradient-to-br from-[var(--color-surface-1)] via-[var(--color-surface-2)] to-[var(--color-surface-1)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Info */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-3">
                <span className="badge badge-review">{REVIEW_DATA.badge}</span>
                <span className="text-xs text-[var(--color-text-muted)]">Tested {REVIEW_DATA.testedDate}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
                {REVIEW_DATA.title}
              </h1>
              <p className="text-lg text-[var(--color-text-secondary)]">{REVIEW_DATA.subtitle}</p>

              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <Image src={REVIEW_DATA.authorAvatar} alt={REVIEW_DATA.authorName} width={36} height={36} className="rounded-full" />
                  <span className="text-sm font-semibold text-[var(--color-text-primary)]">By {REVIEW_DATA.authorName}</span>
                </div>
                <ShareButtons title={REVIEW_DATA.title} />
              </div>
            </div>

            {/* Right Score & Buy Box */}
            <div className="lg:col-span-5 card p-6 text-center border-[var(--color-brand-500)]/30 bg-[var(--color-surface-0)]/60">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">TechCrest Score</span>
              <div className="my-3 flex items-center justify-center gap-3">
                <span className="text-5xl font-black text-[var(--color-text-primary)]">{REVIEW_DATA.overallRating}</span>
                <div className="text-left">
                  <RatingStars rating={REVIEW_DATA.overallRating} size="lg" showValue={false} />
                  <span className="text-xs font-bold text-[var(--color-brand-400)] uppercase tracking-wider">Superb</span>
                </div>
              </div>
              <p className="text-sm text-[var(--color-brand-400)] font-bold mb-4">Starting at {REVIEW_DATA.price}</p>
              <a href={REVIEW_DATA.affiliateUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full justify-center text-sm py-3">
                <ShoppingCart className="w-4 h-4" /> Check Price at Apple
              </a>
            </div>
          </div>
        </div>

        {/* Product Image */}
        <div className="relative aspect-[16/9] max-w-4xl mx-auto rounded-2xl overflow-hidden mb-12 border border-[var(--color-surface-border)]">
          <Image src={REVIEW_DATA.image} alt={REVIEW_DATA.title} fill className="object-cover" priority />
        </div>

        {/* Scores Breakdown & Pros/Cons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Rating Breakdown */}
          <div className="card p-6 space-y-4">
            <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-4">Category Ratings</h3>
            {REVIEW_DATA.scores.map((score) => (
              <RatingBar key={score.label} label={score.label} value={score.value} />
            ))}
          </div>

          {/* Pros & Cons */}
          <div className="card p-6 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-[var(--color-accent-green)] mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> Pros
              </h3>
              <ul className="space-y-2">
                {REVIEW_DATA.pros.map((pro) => (
                  <li key={pro} className="text-sm text-[var(--color-text-secondary)] flex items-start gap-2">
                    <span className="text-[var(--color-accent-green)]">•</span> {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-4 border-t border-[var(--color-surface-border)]">
              <h3 className="text-lg font-bold text-red-400 mb-3 flex items-center gap-2">
                <XCircle className="w-5 h-5" /> Cons
              </h3>
              <ul className="space-y-2">
                {REVIEW_DATA.cons.map((con) => (
                  <li key={con} className="text-sm text-[var(--color-text-secondary)] flex items-start gap-2">
                    <span className="text-red-400">•</span> {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Verdict & Specs Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6 border-l-4 border-l-[var(--color-brand-500)] bg-[var(--color-surface-1)]">
              <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2 flex items-center gap-2" style={{ fontFamily: "var(--font-outfit)" }}>
                <Award className="w-5 h-5 text-[var(--color-brand-400)]" /> The Verdict
              </h3>
              <p className="text-[var(--color-text-secondary)] text-base leading-relaxed">{REVIEW_DATA.verdict}</p>
            </div>
          </div>

          {/* Specs */}
          <div className="card p-6">
            <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-4">Tech Specs</h3>
            <dl className="space-y-3 text-sm">
              {Object.entries(REVIEW_DATA.specs).map(([key, val]) => (
                <div key={key} className="border-b border-[var(--color-surface-border)] pb-2">
                  <dt className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">{key}</dt>
                  <dd className="text-[var(--color-text-secondary)] mt-0.5">{val}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
