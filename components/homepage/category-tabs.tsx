"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Brain,
  Smartphone,
  Laptop,
  Gamepad2,
  Shield,
  Cloud,
} from "lucide-react";
import { ArticleCard, type ArticleCardData } from "@/components/article/article-card";

const ICONS: Record<string, React.ElementType> = {
  AI: Brain,
  Mobile: Smartphone,
  Laptops: Laptop,
  Gaming: Gamepad2,
  Security: Shield,
  Cloud: Cloud,
};

const CATEGORIES = [
  { id: "ai", label: "AI" },
  { id: "mobile", label: "Mobile" },
  { id: "laptops", label: "Laptops" },
  { id: "gaming", label: "Gaming" },
  { id: "security", label: "Security" },
  { id: "cloud", label: "Cloud" },
];

const CATEGORY_ARTICLES: Record<string, ArticleCardData[]> = {
  ai: [
    {
      id: 30,
      title: "Google DeepMind's Gemini Ultra 2 Beats Human Experts on Medical Diagnosis",
      slug: "google-deepmind-gemini-ultra-2-medical-diagnosis",
      heroImage: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=375&fit=crop&q=80",
      heroImageAlt: "Medical AI",
      publishedAt: new Date(Date.now() - 1000 * 60 * 60),
      readingTimeMinutes: 7,
      categorySlug: "ai",
      categoryName: "AI",
      authorName: "Dr. Sarah Chen",
    },
    {
      id: 31,
      title: "Anthropic Claude 4 Review: The Safest and Most Capable AI Assistant Yet",
      slug: "anthropic-claude-4-review",
      heroImage: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&h=375&fit=crop&q=80",
      heroImageAlt: "AI assistant",
      publishedAt: new Date(Date.now() - 1000 * 60 * 120),
      readingTimeMinutes: 9,
      categorySlug: "ai",
      categoryName: "AI",
      authorName: "James Park",
    },
    {
      id: 32,
      title: "Midjourney v7 Can Now Generate Photorealistic Videos",
      slug: "midjourney-v7-photorealistic-videos",
      heroImage: "https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=600&h=375&fit=crop&q=80",
      heroImageAlt: "AI art",
      publishedAt: new Date(Date.now() - 1000 * 60 * 180),
      readingTimeMinutes: 5,
      categorySlug: "ai",
      categoryName: "AI",
      authorName: "Emily Zhang",
    },
  ],
  mobile: [
    {
      id: 40,
      title: "OnePlus 14 Pro Review: An iPhone Killer That Almost Made It",
      slug: "oneplus-14-pro-review",
      heroImage: "https://images.unsplash.com/photo-1512941937938-a272e8e40e78?w=600&h=375&fit=crop&q=80",
      heroImageAlt: "OnePlus 14 Pro",
      publishedAt: new Date(Date.now() - 1000 * 60 * 90),
      readingTimeMinutes: 11,
      categorySlug: "mobile",
      categoryName: "Mobile",
      authorName: "Mike Rodriguez",
    },
    {
      id: 41,
      title: "The Best 5G Phones Under $400 in 2026",
      slug: "best-5g-phones-under-400-2026",
      heroImage: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&h=375&fit=crop&q=80",
      heroImageAlt: "Budget phones",
      publishedAt: new Date(Date.now() - 1000 * 60 * 200),
      readingTimeMinutes: 8,
      categorySlug: "mobile",
      categoryName: "Mobile",
      authorName: "Priya Sharma",
    },
    {
      id: 42,
      title: "Foldables Are Mainstream Now: The Best Folding Phones of 2026",
      slug: "best-folding-phones-2026",
      heroImage: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600&h=375&fit=crop&q=80",
      heroImageAlt: "Folding phone",
      publishedAt: new Date(Date.now() - 1000 * 60 * 300),
      readingTimeMinutes: 13,
      categorySlug: "mobile",
      categoryName: "Mobile",
      authorName: "Rachel Kim",
    },
  ],
  laptops: [
    {
      id: 50,
      title: "MacBook Pro M4 Max Review: The Pinnacle of Laptop Performance",
      slug: "macbook-pro-m4-max-review",
      heroImage: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&h=375&fit=crop&q=80",
      heroImageAlt: "MacBook Pro",
      publishedAt: new Date(Date.now() - 1000 * 60 * 60),
      readingTimeMinutes: 14,
      categorySlug: "laptops",
      categoryName: "Laptops",
      authorName: "Alex Thompson",
    },
    {
      id: 51,
      title: "Best Gaming Laptops 2026: From Budget to Beast Mode",
      slug: "best-gaming-laptops-2026",
      heroImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=375&fit=crop&q=80",
      heroImageAlt: "Gaming laptop",
      publishedAt: new Date(Date.now() - 1000 * 60 * 130),
      readingTimeMinutes: 17,
      categorySlug: "laptops",
      categoryName: "Laptops",
      authorName: "Carlos Mendez",
    },
    {
      id: 52,
      title: "Lenovo ThinkPad X1 Carbon Gen 14 Review: Business Perfection",
      slug: "lenovo-thinkpad-x1-carbon-gen-14-review",
      heroImage: "https://images.unsplash.com/photo-1587731556938-38755b4803a6?w=600&h=375&fit=crop&q=80",
      heroImageAlt: "ThinkPad laptop",
      publishedAt: new Date(Date.now() - 1000 * 60 * 240),
      readingTimeMinutes: 12,
      categorySlug: "laptops",
      categoryName: "Laptops",
      authorName: "David Osei",
    },
  ],
  gaming: [
    {
      id: 60,
      title: "GTA VII Gameplay Reveal: Everything We Saw in the 30-Minute Demo",
      slug: "gta-7-gameplay-reveal-everything-we-saw",
      heroImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=375&fit=crop&q=80",
      heroImageAlt: "Video game controller",
      publishedAt: new Date(Date.now() - 1000 * 60 * 50),
      readingTimeMinutes: 8,
      categorySlug: "gaming",
      categoryName: "Gaming",
      authorName: "Mike Rodriguez",
    },
    {
      id: 61,
      title: "Steam Deck 2 Review: Valve's Portable Masterpiece Gets Even Better",
      slug: "steam-deck-2-review",
      heroImage: "https://images.unsplash.com/photo-1640955014216-75201056c829?w=600&h=375&fit=crop&q=80",
      heroImageAlt: "Steam Deck",
      publishedAt: new Date(Date.now() - 1000 * 60 * 160),
      readingTimeMinutes: 10,
      categorySlug: "gaming",
      categoryName: "Gaming",
      authorName: "Carlos Mendez",
    },
    {
      id: 62,
      title: "Best 4K Gaming Monitors of 2026: Speed Meets Clarity",
      slug: "best-4k-gaming-monitors-2026",
      heroImage: "https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=600&h=375&fit=crop&q=80",
      heroImageAlt: "Gaming monitor",
      publishedAt: new Date(Date.now() - 1000 * 60 * 280),
      readingTimeMinutes: 15,
      categorySlug: "gaming",
      categoryName: "Gaming",
      authorName: "Sophie Laurent",
    },
  ],
  security: [
    {
      id: 70,
      title: "How Hackers Are Using AI to Launch Unprecedented Phishing Attacks",
      slug: "ai-phishing-attacks-2026-guide",
      heroImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=375&fit=crop&q=80",
      heroImageAlt: "Cybersecurity",
      publishedAt: new Date(Date.now() - 1000 * 60 * 70),
      readingTimeMinutes: 8,
      categorySlug: "cybersecurity",
      categoryName: "Security",
      authorName: "Priya Sharma",
    },
    {
      id: 71,
      title: "VPN vs Zero-Trust: Which Security Model Is Right for You in 2026?",
      slug: "vpn-vs-zero-trust-security-2026",
      heroImage: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=375&fit=crop&q=80",
      heroImageAlt: "Network security",
      publishedAt: new Date(Date.now() - 1000 * 60 * 180),
      readingTimeMinutes: 11,
      categorySlug: "cybersecurity",
      categoryName: "Security",
      authorName: "Aisha Patel",
    },
    {
      id: 72,
      title: "The 10 Best Password Managers of 2026, Tested and Ranked",
      slug: "best-password-managers-2026",
      heroImage: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=600&h=375&fit=crop&q=80",
      heroImageAlt: "Password security",
      publishedAt: new Date(Date.now() - 1000 * 60 * 300),
      readingTimeMinutes: 9,
      categorySlug: "cybersecurity",
      categoryName: "Security",
      authorName: "Maria Kowalski",
    },
  ],
  cloud: [
    {
      id: 80,
      title: "AWS vs Azure vs GCP in 2026: The Definitive Cloud Platform Comparison",
      slug: "aws-azure-gcp-comparison-2026",
      heroImage: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&h=375&fit=crop&q=80",
      heroImageAlt: "Cloud servers",
      publishedAt: new Date(Date.now() - 1000 * 60 * 90),
      readingTimeMinutes: 16,
      categorySlug: "cloud",
      categoryName: "Cloud",
      authorName: "Dr. Kenji Nakamura",
    },
    {
      id: 81,
      title: "Kubernetes 2.0 Is Here — What Changed and What It Means for DevOps",
      slug: "kubernetes-2-0-what-changed-devops",
      heroImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=375&fit=crop&q=80",
      heroImageAlt: "Server infrastructure",
      publishedAt: new Date(Date.now() - 1000 * 60 * 200),
      readingTimeMinutes: 12,
      categorySlug: "cloud",
      categoryName: "Cloud",
      authorName: "David Osei",
    },
    {
      id: 82,
      title: "Serverless in 2026: Has It Finally Lived Up to the Hype?",
      slug: "serverless-2026-has-it-lived-up-hype",
      heroImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=375&fit=crop&q=80",
      heroImageAlt: "Data center",
      publishedAt: new Date(Date.now() - 1000 * 60 * 320),
      readingTimeMinutes: 10,
      categorySlug: "cloud",
      categoryName: "Cloud",
      authorName: "Rachel Kim",
    },
  ],
};

export function CategoryTabs() {
  const [active, setActive] = useState(CATEGORIES[0].id);
  const articles = CATEGORY_ARTICLES[active] ?? [];

  return (
    <div className="category-tabs-section">
      {/* Tab Navigation */}
      <div
        className="category-tabs"
        role="tablist"
        aria-label="Category tabs"
      >
        {CATEGORIES.map((cat) => {
          const Icon = ICONS[cat.label];
          return (
            <button
              key={cat.id}
              role="tab"
              aria-selected={active === cat.id}
              id={`cat-tab-${cat.id}`}
              onClick={() => setActive(cat.id)}
              className={`category-tabs__button ${
                active === cat.id ? "category-tabs__button--active" : ""
              }`}
            >
              {Icon && <Icon className="category-tabs__icon" />}
              {cat.label}
            </button>
          );
        })}
      </div>
      {/* Articles Grid */}
      <div
        className="category-tabs__grid"
        role="tabpanel"
        aria-labelledby={`cat-tab-${active}`}
      >
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
      <div className="category-tabs__footer">
        <Link href={`/${active}`} className="btn btn-ghost">
          View all {CATEGORIES.find((c) => c.id === active)?.label} articles →
        </Link>
      </div>
    </div>
  );
}
