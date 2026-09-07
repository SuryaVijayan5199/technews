"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Home,
  Grid,
  Search,
  Bookmark,
  User,
  X,
  ChevronRight,
  Trash2,
  Newspaper,
  Smartphone,
  Headphones,
  Bot,
  Activity,
  Shield,
  Brain,
  Zap,
  Bitcoin,
  Gamepad2,
  Tag,
  Clock,
  Sparkles,
} from "lucide-react";
import { Capacitor } from "@capacitor/core";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { getSavedArticles, saveArticle, SavedArticleItem } from "@/components/shared/bookmark-button";

const ALL_TOPICS = [
  { label: "Phone", href: "/phone", icon: Smartphone, color: "#0ea5e9", description: "Smartphones, reviews, and mobile tech" },
  { label: "Audio", href: "/audio", icon: Headphones, color: "#8b5cf6", description: "Headphones, speakers, and Hi-Fi gear" },
  { label: "Robotic", href: "/robotics", icon: Bot, color: "#6366f1", description: "Humanoids, automation, and AI hardware" },
  { label: "Fitness", href: "/fitness", icon: Activity, color: "#10b981", description: "Wearables, health tech, and bio-trackers" },
  { label: "Security", href: "/security", icon: Shield, color: "#f59e0b", description: "Cybersecurity, privacy, and zero-trust" },
  { label: "AI", href: "/ai", icon: Brain, color: "#a855f7", description: "LLMs, autonomous agents, and AI tools" },
  { label: "Home", href: "/smart-home", icon: Home, color: "#14b8a6", description: "Smart home hubs, Matter, and lighting" },
  { label: "EVs", href: "/evs", icon: Zap, color: "#22c55e", description: "Electric vehicles, battery tech, and mobility" },
  { label: "Crypto", href: "/crypto", icon: Bitcoin, color: "#f97316", description: "Blockchain, Web3, and DeFi insights" },
  { label: "Gaming", href: "/gaming", icon: Gamepad2, color: "#ef4444", description: "Consoles, PC gaming, hardware, and esports" },
  { label: "Deals", href: "/deals", icon: Tag, color: "#ec4899", description: "Handpicked tech discounts and offers" },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  const [topicsSheetOpen, setTopicsSheetOpen] = useState(false);
  const [savedSheetOpen, setSavedSheetOpen] = useState(false);
  const [savedArticles, setSavedArticles] = useState<SavedArticleItem[]>([]);
  const [topicsList, setTopicsList] = useState<any[]>(ALL_TOPICS);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setTopicsList(data);
        }
      })
      .catch((err) => console.error("Error fetching categories for mobile nav:", err));
  }, []);

  useEffect(() => {
    setSavedArticles(getSavedArticles());
    const handleSync = () => {
      setSavedArticles(getSavedArticles());
    };
    window.addEventListener("techcrest_bookmark_change", handleSync);
    return () => window.removeEventListener("techcrest_bookmark_change", handleSync);
  }, []);

  // Hide on CMS dashboard routes
  if (pathname?.startsWith("/dashboard")) return null;

  const triggerHaptic = async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        await Haptics.impact({ style: ImpactStyle.Light });
      } catch {}
    }
  };

  const handleOpenTopics = (e: React.MouseEvent) => {
    e.preventDefault();
    triggerHaptic();
    setSavedSheetOpen(false);
    setTopicsSheetOpen((prev) => !prev);
  };

  const handleOpenSaved = (e: React.MouseEvent) => {
    e.preventDefault();
    triggerHaptic();
    setTopicsSheetOpen(false);
    setSavedArticles(getSavedArticles());
    setSavedSheetOpen((prev) => !prev);
  };

  const handleRemoveSaved = (slug: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    saveArticle({ slug, title: "", savedAt: 0 });
    setSavedArticles(getSavedArticles());
  };

  return (
    <>
      {/* ── TOPICS PICKER SHEET ── */}
      {topicsSheetOpen && (
        <div
          className="tc-mobile-sheet-overlay"
          onClick={() => setTopicsSheetOpen(false)}
          aria-hidden="true"
        >
          <div
            className="tc-mobile-sheet"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Select Topic"
          >
            {/* Sheet Handle & Header */}
            <div className="tc-mobile-sheet__header">
              <span className="tc-mobile-sheet__handle" />
              <div className="tc-mobile-sheet__title-row">
                <div className="flex items-center gap-2">
                  <Grid className="w-5 h-5 text-[#2D7FF9]" />
                  <h3 className="tc-mobile-sheet__title">Explore Topics</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setTopicsSheetOpen(false)}
                  className="tc-mobile-sheet__close"
                  aria-label="Close topics menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="tc-mobile-sheet__subtitle">
                Select a category to view the latest articles and breaking updates
              </p>
            </div>

            {/* Topics Grid */}
            <div className="tc-mobile-sheet__body">
              <Link
                href="/news"
                onClick={() => setTopicsSheetOpen(false)}
                className="tc-topic-item tc-topic-item--featured"
              >
                <div className="tc-topic-item__icon-box" style={{ backgroundColor: "#2D7FF9" }}>
                  <Newspaper className="w-5 h-5 text-white" />
                </div>
                <div className="tc-topic-item__info">
                  <span className="tc-topic-item__name">All News</span>
                  <span className="tc-topic-item__desc">Complete timeline of technology stories</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted" />
              </Link>

              <div className="tc-topics-list">
                {topicsList.map((topic) => {
                  const IconComponent = typeof topic.icon === "function" ? topic.icon : Newspaper;
                  const isCurrent = pathname === topic.href;

                  return (
                    <Link
                      key={topic.label}
                      href={topic.href}
                      onClick={() => setTopicsSheetOpen(false)}
                      className={`tc-topic-item${isCurrent ? " tc-topic-item--active" : ""}`}
                    >
                      <div
                        className="tc-topic-item__icon-box"
                        style={{ backgroundColor: `${topic.color}20`, color: topic.color }}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="tc-topic-item__info">
                        <span className="tc-topic-item__name">{topic.label}</span>
                        <span className="tc-topic-item__desc">{topic.description}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SAVED ARTICLES SHEET ── */}
      {savedSheetOpen && (
        <div
          className="tc-mobile-sheet-overlay"
          onClick={() => setSavedSheetOpen(false)}
          aria-hidden="true"
        >
          <div
            className="tc-mobile-sheet"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Saved Articles"
          >
            {/* Sheet Header */}
            <div className="tc-mobile-sheet__header">
              <span className="tc-mobile-sheet__handle" />
              <div className="tc-mobile-sheet__title-row">
                <div className="flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-[#2D7FF9] fill-[#2D7FF9]/20" />
                  <h3 className="tc-mobile-sheet__title">Saved Articles</h3>
                  <span className="tc-mobile-sheet__count-badge">
                    {savedArticles.length}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSavedSheetOpen(false)}
                  className="tc-mobile-sheet__close"
                  aria-label="Close saved articles menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Saved Articles List */}
            <div className="tc-mobile-sheet__body">
              {savedArticles.length === 0 ? (
                <div className="tc-saved-empty">
                  <div className="tc-saved-empty__icon-wrap">
                    <Bookmark className="w-8 h-8 text-[#2D7FF9]" />
                  </div>
                  <h4 className="tc-saved-empty__title">No Saved Articles Yet</h4>
                  <p className="tc-saved-empty__desc">
                    Tap the bookmark icon on any story while browsing to save it here for quick offline reading.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSavedSheetOpen(false);
                      setTopicsSheetOpen(true);
                    }}
                    className="tc-saved-empty__btn"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Explore Stories</span>
                  </button>
                </div>
              ) : (
                <div className="tc-saved-list">
                  {savedArticles.map((art) => (
                    <Link
                      key={art.slug}
                      href={`/${art.categorySlug || "news"}/${art.slug}`}
                      onClick={() => setSavedSheetOpen(false)}
                      className="tc-saved-card"
                    >
                      {art.heroImage ? (
                        <div className="tc-saved-card__thumb">
                          <Image
                            src={art.heroImage}
                            alt={art.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="tc-saved-card__thumb tc-saved-card__thumb--placeholder">
                          <Newspaper className="w-6 h-6 text-muted" />
                        </div>
                      )}
                      <div className="tc-saved-card__body">
                        <h4 className="tc-saved-card__title">{art.title}</h4>
                        <div className="tc-saved-card__meta">
                          {art.readingTimeMinutes && (
                            <span>{art.readingTimeMinutes} min read</span>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleRemoveSaved(art.slug, e)}
                        className="tc-saved-card__remove"
                        title="Remove bookmark"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── ATTACHED BOTTOM NAVBAR (Fixed flush to bottom edge) ── */}
      <div className="tc-bottom-nav-wrapper">
        <nav className="tc-bottom-nav" aria-label="Mobile navigation">
          {/* HOME TAB */}
          <Link
            href="/"
            onClick={triggerHaptic}
            className={`tc-bottom-nav__item${pathname === "/" ? " tc-bottom-nav__item--active" : ""}`}
          >
            <span className={`tc-bottom-nav__bubble${pathname === "/" ? " tc-bottom-nav__bubble--visible" : ""}`} />
            <span className="tc-bottom-nav__icon-wrap">
              <Home strokeWidth={pathname === "/" ? 2.5 : 2} className="tc-bottom-nav__icon" />
            </span>
            <span className="tc-bottom-nav__label">
              Home
            </span>
          </Link>

          {/* TOPICS TAB (Opens Topics Sheet) */}
          <button
            type="button"
            onClick={handleOpenTopics}
            className={`tc-bottom-nav__item${topicsSheetOpen || pathname?.startsWith("/phone") || pathname?.startsWith("/ai") || pathname?.startsWith("/gaming") ? " tc-bottom-nav__item--active" : ""}`}
          >
            <span className={`tc-bottom-nav__bubble${topicsSheetOpen ? " tc-bottom-nav__bubble--visible" : ""}`} />
            <span className="tc-bottom-nav__icon-wrap">
              <Grid strokeWidth={topicsSheetOpen ? 2.5 : 2} className="tc-bottom-nav__icon" />
            </span>
            <span className="tc-bottom-nav__label">
              Topics
            </span>
          </button>

          {/* SEARCH TAB */}
          <Link
            href="/search"
            onClick={triggerHaptic}
            className={`tc-bottom-nav__item${pathname === "/search" ? " tc-bottom-nav__item--active" : ""}`}
          >
            <span className={`tc-bottom-nav__bubble${pathname === "/search" ? " tc-bottom-nav__bubble--visible" : ""}`} />
            <span className="tc-bottom-nav__icon-wrap">
              <Search strokeWidth={pathname === "/search" ? 2.5 : 2} className="tc-bottom-nav__icon" />
            </span>
            <span className="tc-bottom-nav__label">
              Search
            </span>
          </Link>

          {/* SAVED TAB (Opens Saved Sheet) */}
          <button
            type="button"
            onClick={handleOpenSaved}
            className={`tc-bottom-nav__item${savedSheetOpen ? " tc-bottom-nav__item--active" : ""}`}
          >
            <span className={`tc-bottom-nav__bubble${savedSheetOpen ? " tc-bottom-nav__bubble--visible" : ""}`} />
            <span className="tc-bottom-nav__icon-wrap">
              <Bookmark strokeWidth={savedSheetOpen ? 2.5 : 2} className="tc-bottom-nav__icon" />
              {savedArticles.length > 0 && (
                <span className="tc-bottom-nav__badge">{savedArticles.length}</span>
              )}
            </span>
            <span className="tc-bottom-nav__label">
              Saved
            </span>
          </button>

          {/* PROFILE / SIGN IN TAB */}
          <Link
            href={isLoggedIn ? "/profile" : "/login"}
            onClick={triggerHaptic}
            className={`tc-bottom-nav__item${pathname === "/profile" || pathname === "/login" ? " tc-bottom-nav__item--active" : ""}`}
          >
            <span className={`tc-bottom-nav__bubble${pathname === "/profile" || pathname === "/login" ? " tc-bottom-nav__bubble--visible" : ""}`} />
            <span className="tc-bottom-nav__icon-wrap">
              <User strokeWidth={pathname === "/profile" || pathname === "/login" ? 2.5 : 2} className="tc-bottom-nav__icon" />
            </span>
            <span className="tc-bottom-nav__label">
              {isLoggedIn ? "Profile" : "Sign In"}
            </span>
          </Link>
        </nav>
      </div>
    </>
  );
}
