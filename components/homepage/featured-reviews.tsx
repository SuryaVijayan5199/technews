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
          href={`/gaming/${review.slug}`}
          className="card block overflow-hidden"
        >
          <div className="relative">
            <Image
              src={review.image}
              alt={review.title}
              width={400}
              height={280}
              className="tc-review-card__img"
            />
            <div className="tc-review-card__badge-pos">
              <span className="badge badge-review">{review.badge}</span>
            </div>
          </div>
          <div className="p-5">
            <h3
              className="tc-review-card__title"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              {review.title}
            </h3>
            <p className="tc-review-card__excerpt">
              {review.subtitle}
            </p>

            <div className="flex items-center justify-between mb-4">
              <RatingStars rating={review.rating} size="md" />
              <span className="tc-review-card__score">
                {review.rating}
              </span>
            </div>

            <ul className="tc-review-card__pros">
              {review.pros.map((pro) => (
                <li
                  key={pro}
                  className="tc-review-card__pro-item"
                >
                  <CheckCircle2 className="tc-review-card__pro-icon" />
                  {pro}
                </li>
              ))}
            </ul>

            <div className="tc-review-card__footer">
              <span className="tc-review-card__price">
                {review.price}
              </span>
              <span className="tc-review-card__date">
                By {review.reviewedBy}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
