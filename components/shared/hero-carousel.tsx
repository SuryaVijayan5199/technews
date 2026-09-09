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

export function HeroSectionCarousel({ articles }: { articles: HeroArticleItem[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const total = Math.min(5, articles.length);
  const slides = articles.slice(0, 5);

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
