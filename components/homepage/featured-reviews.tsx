import Link from "next/link";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { RatingStars } from "@/components/shared/rating-stars";

const FEATURED_REVIEWS = [
  {
    id: 1,
    slug: "apple-m4-macbook-pro-14-review",
    title: "Apple MacBook Pro 14 M4",
    subtitle: "The best laptop money can buy — period.",
    image:
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&h=280&fit=crop&q=80",
    rating: 9.4,
    badge: "Editor's Choice",
    pros: [
      "Exceptional battery life",
      "Best-in-class display",
      "Silent performance",
    ],
    price: "$1,999",
    categorySlug: "laptops",
    reviewedBy: "Alex Thompson",
  },
  {
    id: 2,
    slug: "samsung-galaxy-s26-ultra-review",
    title: "Samsung Galaxy S26 Ultra",
    subtitle: "The most versatile Android phone ever made.",
    image:
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=280&fit=crop&q=80",
    rating: 9.1,
    badge: "Best Android Phone",
    pros: [
      "Incredible S Pen experience",
      "200MP camera is stunning",
      "All-day battery",
    ],
    price: "$1,299",
    categorySlug: "mobile",
    reviewedBy: "James Park",
  },
  {
    id: 3,
    slug: "nvidia-rtx-5090-review",
    title: "Nvidia GeForce RTX 5090",
    subtitle: "Absurd performance for those who demand the best.",
    image:
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=280&fit=crop&q=80",
    rating: 8.8,
    badge: "Most Powerful GPU",
    pros: [
      "Unmatched 4K gaming performance",
      "DLSS 5 is magic",
      "Great thermals",
    ],
    price: "$2,499",
    categorySlug: "gaming",
    reviewedBy: "Carlos Mendez",
  },
];

export function FeaturedReviews() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {FEATURED_REVIEWS.map((review) => (
        <Link
          key={review.id}
          href={`/reviews/${review.slug}`}
          className="group card block overflow-hidden"
        >
          <div className="relative">
            <Image
              src={review.image}
              alt={review.title}
              width={400}
              height={280}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-3 left-3">
              <span className="badge badge-review">{review.badge}</span>
            </div>
          </div>
          <div className="p-5">
            <h3
              className="font-bold text-[var(--color-text-primary)] text-lg mb-1 group-hover:text-[var(--color-brand-300)] transition-colors"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              {review.title}
            </h3>
            <p className="text-[var(--color-text-muted)] text-sm mb-4">
              {review.subtitle}
            </p>

            <div className="flex items-center justify-between mb-4">
              <RatingStars rating={review.rating} size="md" />
              <span className="text-2xl font-bold text-[var(--color-text-primary)]">
                {review.rating}
              </span>
            </div>

            <ul className="space-y-1.5 mb-4">
              {review.pros.map((pro) => (
                <li
                  key={pro}
                  className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-accent-green)] flex-shrink-0" />
                  {pro}
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between pt-3 border-t border-[var(--color-surface-border)]">
              <span className="text-[var(--color-brand-400)] font-bold">
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
  );
}
