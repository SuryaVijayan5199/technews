import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Star, CheckCircle2, ChevronRight, Filter } from "lucide-react";
import { RatingStars } from "@/components/shared/rating-stars";

export const metadata: Metadata = {
  title: "Tech Reviews — Expert Product Testing & Ratings",
  description:
    "In-depth, un-biased technology reviews. We test the latest smartphones, laptops, GPUs, wearables, and audio gear.",
};

const ALL_REVIEWS = [
  {
    id: 1,
    slug: "apple-m4-macbook-pro-14-review",
    title: "Apple MacBook Pro 14 M4",
    subtitle: "The best laptop money can buy — period.",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=600&h=400&fit=crop&q=80",
    rating: 9.4,
    badge: "Editor's Choice",
    category: "Laptops",
    categorySlug: "laptops",
    pros: ["Exceptional battery life", "Best-in-class display", "Silent performance"],
    price: "$1,999",
    testedDate: "July 2026",
    reviewedBy: "Alex Thompson",
  },
  {
    id: 2,
    slug: "samsung-galaxy-s26-ultra-review",
    title: "Samsung Galaxy S26 Ultra",
    subtitle: "The most versatile Android phone ever made.",
    image:
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&h=400&fit=crop&q=80",
    rating: 9.1,
    badge: "Best Android Phone",
    category: "Mobile",
    categorySlug: "mobile",
    pros: ["Incredible S Pen experience", "200MP camera is stunning", "All-day battery"],
    price: "$1,299",
    testedDate: "July 2026",
    reviewedBy: "James Park",
  },
  {
    id: 3,
    slug: "nvidia-rtx-5090-review",
    title: "Nvidia GeForce RTX 5090",
    subtitle: "Absurd performance for those who demand the best.",
    image:
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&h=400&fit=crop&q=80",
    rating: 8.8,
    badge: "Most Powerful GPU",
    category: "Gaming",
    categorySlug: "gaming",
    pros: ["Unmatched 4K gaming performance", "DLSS 5 is magic", "Great thermals"],
    price: "$2,499",
    testedDate: "July 2026",
    reviewedBy: "Carlos Mendez",
  },
  {
    id: 4,
    slug: "apple-vision-pro-2-review",
    title: "Apple Vision Pro 2",
    subtitle: "The future of spatial computing gets lighter and smarter.",
    image:
      "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=600&h=400&fit=crop&q=80",
    rating: 8.7,
    badge: "Best VR/AR",
    category: "Wearables",
    categorySlug: "wearables",
    pros: ["Ultra-sharp micro-OLED", "Comfortable dual-loop band", "Gestures are magical"],
    price: "$2,999",
    testedDate: "June 2026",
    reviewedBy: "Emily Zhang",
  },
  {
    id: 5,
    slug: "sony-wh-1000xm6-review",
    title: "Sony WH-1000XM6 Wireless Headphones",
    subtitle: "Noise cancellation perfection refined.",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop&q=80",
    rating: 9.3,
    badge: "Best Noise Canceling",
    category: "Audio",
    categorySlug: "audio",
    pros: ["Unbeatable ANC", "Custom EQ tuning", "40-hour battery"],
    price: "$399",
    testedDate: "June 2026",
    reviewedBy: "Sophie Laurent",
  },
  {
    id: 6,
    slug: "steam-deck-2-review",
    title: "Valve Steam Deck 2 OLED",
    subtitle: "Handheld PC gaming perfected.",
    image:
      "https://images.unsplash.com/photo-1640955014216-75201056c829?w=600&h=400&fit=crop&q=80",
    rating: 9.2,
    badge: "Best Handheld",
    category: "Gaming",
    categorySlug: "gaming",
    pros: ["Gorgeous 90Hz OLED display", "Substantial battery boost", "Smooth SteamOS"],
    price: "$549",
    testedDate: "May 2026",
    reviewedBy: "Carlos Mendez",
  },
];

export default function ReviewsPage() {
  return (
    <div className="container py-10">
      {/* Header */}
      <div className="mb-10">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mb-4">
          <Link href="/" className="hover:text-[var(--color-text-secondary)]">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[var(--color-text-secondary)]">Reviews</span>
        </nav>
        <h1
          className="text-3xl sm:text-5xl font-bold text-[var(--color-text-primary)]"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          Product Reviews & Testing
        </h1>
        <p className="text-[var(--color-text-secondary)] text-base sm:text-lg mt-2 max-w-3xl">
          Independent, hands-on reviews by our team of hardware engineers and product experts. Every rating is earned.
        </p>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-[var(--color-surface-border)]">
        <div className="flex items-center gap-2 overflow-x-auto">
          {["All", "Mobile", "Laptops", "Gaming", "Audio", "Wearables"].map((cat, i) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                i === 0
                  ? "bg-[var(--color-brand-500)] text-white"
                  : "bg-[var(--color-surface-2)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
          <Filter className="w-4 h-4" />
          <span>Sort by Highest Rated</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ALL_REVIEWS.map((review) => (
          <Link
            key={review.id}
            href={`/reviews/${review.slug}`}
            className="group card block overflow-hidden"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={review.image}
                alt={review.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3">
                <span className="badge badge-review">{review.badge}</span>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-400)]">
                  {review.category}
                </span>
                <span className="text-xs text-[var(--color-text-muted)]">
                  Tested {review.testedDate}
                </span>
              </div>
              <h2
                className="font-bold text-[var(--color-text-primary)] text-xl mb-1 group-hover:text-[var(--color-brand-300)] transition-colors"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                {review.title}
              </h2>
              <p className="text-[var(--color-text-muted)] text-sm mb-4">
                {review.subtitle}
              </p>

              {/* Rating */}
              <div className="flex items-center justify-between mb-4 p-3 rounded-xl bg-[var(--color-surface-2)]">
                <RatingStars rating={review.rating} size="md" />
                <span className="text-2xl font-bold text-[var(--color-text-primary)]">
                  {review.rating}
                </span>
              </div>

              {/* Pros */}
              <ul className="space-y-1.5 mb-5">
                {review.pros.map((pro) => (
                  <li
                    key={pro}
                    className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-accent-green)] flex-shrink-0" />
                    {pro}
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between pt-3 border-t border-[var(--color-surface-border)]">
                <span className="text-[var(--color-brand-400)] font-bold text-base">
                  {review.price}
                </span>
                <span className="text-xs text-[var(--color-text-muted)]">
                  By {review.reviewedBy}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
