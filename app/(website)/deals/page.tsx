import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Tag, ShoppingCart, Clock, TrendingDown, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Tech Deals — Handpicked Daily Price Drops",
  description: "Save big on laptops, smartphones, TVs, audio gear, and gaming hardware. Daily price drops curated by TechCrest.",
};

const DEALS = [
  {
    id: 1,
    title: "Apple MacBook Air M3 (16GB RAM, 512GB SSD)",
    originalPrice: "$1,499",
    salePrice: "$1,199",
    discount: "20% OFF",
    savings: "Save $300",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=500&h=350&fit=crop&q=80",
    retailer: "Amazon / Apple",
    expiresIn: "14 hours left",
    url: "https://amazon.com",
  },
  {
    id: 2,
    title: "Samsung 65-inch S90D OLED 4K TV (2026 Model)",
    originalPrice: "$2,299",
    salePrice: "$1,599",
    discount: "30% OFF",
    savings: "Save $700",
    image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=500&h=350&fit=crop&q=80",
    retailer: "Best Buy",
    expiresIn: "Ends Tonight",
    url: "https://bestbuy.com",
  },
  {
    id: 3,
    title: "Sony WH-1000XM5 Wireless Noise-Canceling Headphones",
    originalPrice: "$399",
    salePrice: "$298",
    discount: "25% OFF",
    savings: "Save $101",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=350&fit=crop&q=80",
    retailer: "Amazon",
    expiresIn: "Limited Stock",
    url: "https://amazon.com",
  },
];

export default function DealsPage() {
  return (
    <div className="container tc-page-section">
      <div className="mb-10">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-4 tc-breadcrumb">
          <Link href="/" className="tc-breadcrumb__link">Home</Link>
          <ChevronRight className="tc-icon-xs" />
          <span className="tc-text-muted">Deals</span>
        </nav>
        <div className="tc-deals-badge">
          <Tag className="tc-icon-xs" /> Hot Deals
        </div>
        <h1 className="tc-page-title" style={{ fontFamily: "var(--font-outfit)" }}>
          Today&apos;s Best Tech Deals
        </h1>
        <p className="tc-page-subtitle">
          Hand-verified price drops on top-rated tech products. Updated multiple times daily.
        </p>
      </div>

      <div className="tc-deals-grid">
        {DEALS.map((deal) => (
          <div key={deal.id} className="card overflow-hidden flex flex-col tc-deal-card">
            <div>
              <div className="tc-deal-card__media">
                <Image src={deal.image} alt={deal.title} fill className="object-cover" />
                <div className="tc-deal-card__badge-pos">
                  <span className="tc-deal-card__discount">
                    {deal.discount}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2 tc-text-meta">
                  <span>At {deal.retailer}</span>
                  <span className="tc-deal-card__rating">
                    <Clock className="tc-icon-xs" /> {deal.expiresIn}
                  </span>
                </div>
                <h2 className="tc-deal-card__title" style={{ fontFamily: "var(--font-outfit)" }}>
                  {deal.title}
                </h2>
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="tc-deal-card__price">{deal.salePrice}</span>
                  <span className="tc-deal-card__old-price">{deal.originalPrice}</span>
                </div>
                <p className="tc-deal-card__saving">{deal.savings}</p>
              </div>
            </div>
            <div className="tc-deal-card__footer">
              <a href={deal.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full justify-center">
                <ShoppingCart className="tc-btn-icon" /> Get Deal
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
