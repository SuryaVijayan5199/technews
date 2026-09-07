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
    <div className="container tc-page-section">
      <div className="mb-10">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-4 tc-breadcrumb">
          <Link href="/" className="tc-breadcrumb__link">Home</Link>
          <ChevronRight className="tc-icon-xs" />
          <span className="tc-text-muted">Videos</span>
        </nav>
        <h1 className="tc-page-title" style={{ fontFamily: "var(--font-outfit)" }}>
          TechCrest Video Channel
        </h1>
        <p className="tc-page-subtitle">
          High-production hardware unboxings, benchmark comparisons, and deep tech documentaries.
        </p>
      </div>

      <div className="tc-video-grid">
        {VIDEOS.map((video) => (
          <div key={video.id} className="group card overflow-hidden tc-video-card">
            <div className="tc-video-card__media">
              <Image src={video.thumbnail} alt={video.title} fill className="tc-video-card__img" />
              <div className="tc-video-card__overlay">
                <div className="tc-video-card__play">
                  <Play className="tc-icon-play" />
                </div>
              </div>
              <span className="tc-video-card__duration">
                {video.duration}
              </span>
            </div>
            <div className="p-5">
              <span className="badge badge-news mb-2">{video.category}</span>
              <h2 className="tc-video-card__title" style={{ fontFamily: "var(--font-outfit)" }}>
                {video.title}
              </h2>
              <div className="tc-video-card__footer">
                <span>Hosted by {video.host}</span>
                <span className="flex items-center gap-1"><Eye className="tc-icon-xs" />{video.views}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
