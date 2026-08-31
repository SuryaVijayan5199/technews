import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Play, Clock, Eye, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Tech Videos & Unboxings — TechCrest",
  description: "Watch in-depth hardware reviews, hands-on demos, and tech video essays from the TechCrest YouTube channel.",
};

const VIDEOS = [
  {
    id: 1,
    title: "GPT-5 vs Claude 4: We Tested Both for 100 Hours",
    duration: "18:42",
    views: "284K",
    publishedAt: "2 days ago",
    thumbnail: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&h=450&fit=crop&q=80",
    category: "AI",
    host: "Dr. Sarah Chen",
  },
  {
    id: 2,
    title: "MacBook Pro M4 Unboxing & Thermal Stress Test",
    duration: "14:15",
    views: "192K",
    publishedAt: "4 days ago",
    thumbnail: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=800&h=450&fit=crop&q=80",
    category: "Laptops",
    host: "Alex Thompson",
  },
  {
    id: 3,
    title: "Building the Ultimate RTX 5090 Liquid-Cooled Rig",
    duration: "24:10",
    views: "410K",
    publishedAt: "1 week ago",
    thumbnail: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&h=450&fit=crop&q=80",
    category: "Gaming",
    host: "Carlos Mendez",
  },
];

export default function VideosPage() {
  return (
    <div className="container py-10">
      <div className="mb-10">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mb-4">
          <Link href="/" className="hover:text-[var(--color-text-secondary)]">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[var(--color-text-secondary)]">Videos</span>
        </nav>
        <h1 className="text-3xl sm:text-5xl font-bold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
          TechCrest Video Channel
        </h1>
        <p className="text-[var(--color-text-secondary)] text-base sm:text-lg mt-2 max-w-3xl">
          High-production hardware unboxings, benchmark comparisons, and deep tech documentaries.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {VIDEOS.map((video) => (
          <div key={video.id} className="group card overflow-hidden cursor-pointer">
            <div className="relative aspect-[16/9] overflow-hidden">
              <Image src={video.thumbnail} alt={video.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-[var(--color-brand-500)] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 ml-1 fill-current" />
                </div>
              </div>
              <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/80 text-white text-xs font-mono">
                {video.duration}
              </span>
            </div>
            <div className="p-5">
              <span className="badge badge-news mb-2">{video.category}</span>
              <h2 className="font-bold text-[var(--color-text-primary)] text-lg group-hover:text-[var(--color-brand-300)] transition-colors line-clamp-2 mb-2" style={{ fontFamily: "var(--font-outfit)" }}>
                {video.title}
              </h2>
              <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] pt-3 border-t border-[var(--color-surface-border)]">
                <span>Hosted by {video.host}</span>
                <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{video.views}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
