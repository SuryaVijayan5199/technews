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
    <div className="container py-10">
      <div className="mb-10">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mb-4">
          <Link href="/" className="hover:text-[var(--color-text-secondary)]">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[var(--color-text-secondary)]">Deals</span>
        </nav>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-accent-orange)]/15 text-[var(--color-accent-orange)] text-xs font-bold uppercase tracking-wider mb-3">
          <Tag className="w-3.5 h-3.5" /> Hot Deals
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
          Today&apos;s Best Tech Deals
        </h1>
        <p className="text-[var(--color-text-secondary)] text-base sm:text-lg mt-2 max-w-3xl">
          Hand-verified price drops on top-rated tech products. Updated multiple times daily.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {DEALS.map((deal) => (
          <div key={deal.id} className="card overflow-hidden flex flex-col justify-between">
            <div>
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image src={deal.image} alt={deal.title} fill className="object-cover" />
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-red-600 text-white shadow-lg">
                    {deal.discount}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] mb-2">
                  <span>At {deal.retailer}</span>
                  <span className="flex items-center gap-1 text-[var(--color-accent-orange)] font-medium">
                    <Clock className="w-3 h-3" /> {deal.expiresIn}
                  </span>
                </div>
                <h2 className="font-bold text-[var(--color-text-primary)] text-lg line-clamp-2 mb-3" style={{ fontFamily: "var(--font-outfit)" }}>
                  {deal.title}
                </h2>
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-2xl font-extrabold text-[var(--color-brand-400)]">{deal.salePrice}</span>
                  <span className="text-sm text-[var(--color-text-muted)] line-through">{deal.originalPrice}</span>
                </div>
                <p className="text-xs font-semibold text-[var(--color-accent-green)]">{deal.savings}</p>
              </div>
            </div>
            <div className="p-5 pt-0">
              <a href={deal.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full justify-center text-sm py-2.5">
                <ShoppingCart className="w-4 h-4" /> Get Deal
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
