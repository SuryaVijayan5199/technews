"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Clock, User } from "lucide-react";
import { TechCrestIcon } from "@/components/shared/techcrest-icon";

export type HeroArticleItem = {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  heroImage?: string | null;
  readingTimeMinutes?: number | null;
  publishedAt?: Date | string | null;
  category?: { name: string; slug: string } | null;
  author?: { displayName: string } | null;
};

const DEFAULT_SLIDES: HeroArticleItem[] = [
  {
    id: 9001,
    title: "Best Smartwatches for Women: 5 Brands Combining Fitness, Health and Style",
    slug: "best-smartwatches-for-women",
    excerpt: "Smartwatches have moved beyond basic fitness tracking, with newer models bringing together health monitoring, workout features, smart notifications and stylish designs.",
    heroImage: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=1200&h=700&fit=crop&q=80",
    readingTimeMinutes: 5,
    publishedAt: new Date().toISOString(),
    category: { name: "FITNESS • FEATURED", slug: "fitness" },
    author: { displayName: "TechCrest Editorial" },
  },
  {
    id: 9002,
    title: "Volkswagen's New EV Prototype Pushes Efficiency to New Limits",
    slug: "volkswagen-new-ev-prototype",
    excerpt: "Volkswagen has unveiled its Mission Efficiency prototype, a near-production electric vehicle designed to demonstrate how far EV efficiency can be pushed through aerodynamics.",
    heroImage: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=1200&h=700&fit=crop&q=80",
    readingTimeMinutes: 4,
    publishedAt: new Date().toISOString(),
    category: { name: "EVS", slug: "evs" },
    author: { displayName: "TechCrest News" },
  },
  {
    id: 9003,
    title: "Bitget Reports 122% Reserve Ratio in 45th Consecutive Proof-of-Reserves Report",
    slug: "bitget-reports-122-percent-reserve-ratio",
    excerpt: "Bitget has released its 45th consecutive monthly Proof-of-Reserves (PoR) report, reporting a 122% reserve ratio across crypto assets held on platform.",
    heroImage: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=1200&h=700&fit=crop&q=80",
    readingTimeMinutes: 3,
    publishedAt: new Date().toISOString(),
    category: { name: "CRYPTO", slug: "crypto" },
    author: { displayName: "TechCrest News" },
  },
];

export function HeroSectionCarousel({ articles }: { articles: HeroArticleItem[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const displayArticles = (articles && articles.length > 0) ? articles : DEFAULT_SLIDES;
  const total = Math.min(5, displayArticles.length);
  const slides = displayArticles.slice(0, 5);

  const nextSlide = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Auto-play every 5.5 seconds unless paused
  useEffect(() => {
    if (isPaused || total <= 1) return;
    const interval = setInterval(nextSlide, 5500);
    return () => clearInterval(interval);
  }, [isPaused, total, nextSlide]);

  if (!slides || slides.length === 0) {
    return null;
  }

  const current = slides[currentIndex];
  const catName = current?.category?.name ?? "Technology";
  const catSlug = current?.category?.slug ?? "news";
  const articleUrl = `/${catSlug}/${current?.slug ?? ""}`;
  const authorName = current?.author?.displayName || "Surya Vijayan";

  return (
    <section
      className="tc-hero hero-section-carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="tc-wrap tc-hero__inner">
        {/* LEFT SIDE: Heading, Subheading, Author Name & Meta */}
        <div className="tc-hero__copy flex flex-col justify-between">
          <div>
            <div className="tc-eyebrow flex items-center gap-2 mb-3">
              <TechCrestIcon size={18} color="#2D7FF9" />
              <span>TECHCREST / FEATURED STORY {currentIndex + 1} OF {total}</span>
            </div>

            <h1 className="tc-hero__headline">
              <Link href={articleUrl} className="tc-hero__headline-link">
                {current?.title}
              </Link>
            </h1>

            <p className="tc-hero__lead mt-4">
              {current?.excerpt || "A clean, premium editorial experience designed around the stories that matter."}
            </p>
          </div>

          <div className="tc-hero__tags mt-6 flex flex-wrap items-center gap-3 pt-4">
            <span className="tc-tag">{catName}</span>
            <div className="tc-hero__meta">
              <User className="tc-hero__meta-icon" />
              <span>Author: <strong className="tc-hero__meta-value">{authorName}</strong></span>
              <span>&bull;</span>
              <Clock className="tc-hero__meta-icon" />
              <span>{current?.readingTimeMinutes ?? 5} min read</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Image + Controls Card */}
        <div className="tc-hero__card">
          <div className="hero-carousel-card">
            {/* Image */}
            <Link href={articleUrl} className="hero-carousel-card__art-link">
              <div className="hero-carousel-card__art">
                {current?.heroImage ? (
                  <Image
                    key={current.id}
                    src={current.heroImage}
                    alt={current.title ?? "Top Story"}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                    className="hero-carousel-card__art-img"
                    priority
                  />
                ) : (
                  <div className="hero-carousel-card__art-placeholder" />
                )}
                <div className="hero-carousel-card__top-badge">
                  <TechCrestIcon size={16} color="#2D7FF9" />
                  <span>STORY <strong>{currentIndex + 1} / {total}</strong></span>
                </div>
                <div className="hero-carousel-card__gradient-overlay" />
              </div>
            </Link>

            {/* Controls Bar */}
            <div className="hero-carousel-card__caption p-4">
              <div className="hero-carousel-card__footer hero-carousel-card__footer--no-border">
                {/* Dots */}
                <div className="hero-carousel-card__dots">
                  {slides.map((s, idx) => (
                    <button
                      key={s.id ?? idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`hero-carousel-card__dot ${
                        idx === currentIndex ? "hero-carousel-card__dot--active" : ""
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Arrows */}
                <div className="hero-carousel-card__arrows">
                  <button
                    onClick={prevSlide}
                    className="hero-carousel-card__arrow-btn"
                    aria-label="Previous story"
                  >
                    <ChevronLeft className="tc-carousel-arrow-icon" />
                  </button>
                  <span className="hero-carousel-card__counter">
                    {currentIndex + 1}/{total}
                  </span>
                  <button
                    onClick={nextSlide}
                    className="hero-carousel-card__arrow-btn"
                    aria-label="Next story"
                  >
                    <ChevronRight className="tc-carousel-arrow-icon" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Standalone HeroCard component for Dashboard preview
export function HeroCarousel({ articles }: { articles: HeroArticleItem[] }) {
  return <HeroSectionCarousel articles={articles} />;
}
