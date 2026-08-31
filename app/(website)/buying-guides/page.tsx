import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, ChevronRight, Award } from "lucide-react";

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
    <div className="container py-10">
      <div className="mb-10">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mb-4">
          <Link href="/" className="hover:text-[var(--color-text-secondary)]">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[var(--color-text-secondary)]">Buying Guides</span>
        </nav>
        <h1 className="text-3xl sm:text-5xl font-bold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
          Tech Buying Guides 2026
        </h1>
        <p className="text-[var(--color-text-secondary)] text-base sm:text-lg mt-2 max-w-3xl">
          Zero marketing hype. Rigorous testing. Transparent recommendations updated continuously as new devices release.
        </p>
      </div>

      <div className="space-y-6">
        {GUIDES.map((guide) => (
          <Link key={guide.id} href={`/buying-guides/${guide.slug}`} className="group card flex flex-col md:flex-row gap-6 p-6">
            <div className="relative w-full md:w-72 h-48 rounded-xl overflow-hidden flex-shrink-0">
              <Image src={guide.image} alt={guide.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="badge badge-news">{guide.category}</span>
                  <span className="text-xs text-[var(--color-text-muted)]">{guide.updatedDate}</span>
                </div>
                <h2 className="text-2xl font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-brand-300)] transition-colors mb-2" style={{ fontFamily: "var(--font-outfit)" }}>
                  {guide.title}
                </h2>
                <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed mb-4">{guide.excerpt}</p>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-[var(--color-surface-2)] text-xs text-[var(--color-text-secondary)]">
                <Award className="w-4 h-4 text-[var(--color-brand-400)] flex-shrink-0" />
                <span>Our Top Overall Pick: <strong className="text-[var(--color-text-primary)]">{guide.topPick}</strong></span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
