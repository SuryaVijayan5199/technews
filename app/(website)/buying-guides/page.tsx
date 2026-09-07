import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, ChevronRight, Award } from "lucide-react";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Tech Buying Guides 2026 — Expert Recommendations",
  description: "Curated tech buying guides to help you make informed decisions on laptops, smartphones, gaming PCs, headphones, and more.",
};

const GUIDES = [
  {
    id: 1,
    slug: "best-laptops-2026",
    title: "The Best Laptops of 2026",
    excerpt: "We tested 45 laptops across Apple, Dell, Lenovo, and Asus to find the absolute best options for work, gaming, and budget buyers.",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop&q=80",
    topPick: "Apple MacBook Pro 14 M4",
    updatedDate: "Updated July 2026",
    category: "Laptops",
  },
  {
    id: 2,
    slug: "best-phones-2026",
    title: "The Best Smartphones of 2026",
    excerpt: "From flagships like the Galaxy S26 Ultra to incredible budget options under $400, here are our top phone recommendations.",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop&q=80",
    topPick: "Samsung Galaxy S26 Ultra",
    updatedDate: "Updated July 2026",
    category: "Mobile",
  },
  {
    id: 3,
    slug: "best-gaming-pcs-2026",
    title: "The Best Gaming PCs of 2026",
    excerpt: "Pre-built desktop gaming PCs tested for high-framerate 4K performance, thermal efficiency, and upgradability.",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&h=400&fit=crop&q=80",
    topPick: "Alienware Aurora R17",
    updatedDate: "Updated June 2026",
    category: "Gaming",
  },
];

export default function BuyingGuidesPage() {
  return (
    <div className="container tc-page-section">
      <div className="mb-10">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-4 tc-breadcrumb">
          <Link href="/" className="tc-breadcrumb__link">Home</Link>
          <ChevronRight className="tc-icon-xs" />
          <span className="tc-text-muted">Buying Guides</span>
        </nav>
        <h1 className="tc-page-title" style={{ fontFamily: "var(--font-outfit)" }}>
          Tech Buying Guides 2026
        </h1>
        <p className="tc-page-subtitle">
          Zero marketing hype. Rigorous testing. Transparent recommendations updated continuously as new devices release.
        </p>
      </div>

      <div className="tc-list-spaced">
        {GUIDES.map((guide) => (
          <Link key={guide.id} href={`/buying-guides/${guide.slug}`} className="group card flex gap-6 p-6 tc-guide-card">
            <div className="tc-guide-card__img-wrap">
              <Image src={guide.image} alt={guide.title} fill className="tc-guide-card__img" />
            </div>
            <div className="tc-guide-card__body">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="badge badge-news">{guide.category}</span>
                  <span className="tc-text-meta">{guide.updatedDate}</span>
                </div>
                <h2 className="tc-guide-card__title" style={{ fontFamily: "var(--font-outfit)" }}>
                  {guide.title}
                </h2>
                <p className="tc-guide-card__excerpt">{guide.excerpt}</p>
              </div>
              <div className="flex items-center gap-2 p-3 tc-guide-card__info">
                <Award className="tc-icon-brand" />
                <span>Our Top Overall Pick: <strong className="text-[var(--color-text-primary)]">{guide.topPick}</strong></span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
