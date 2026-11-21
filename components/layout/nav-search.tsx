"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight } from "lucide-react";

export function NavSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Handle outside click & Escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    setIsOpen(false);
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const handleClearOrClose = () => {
    if (query) {
      setQuery("");
      inputRef.current?.focus();
    } else {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="tc-nav-search-wrapper">
      {/* Search trigger icon button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="tc-nav-search__trigger-btn"
          aria-label="Search articles"
          title="Search articles"
        >
          <Search className="tc-nav-search__trigger-icon" />
        </button>
      )}

      {/* Expanded Search Bar (CMS-style expandable pill) */}
      {isOpen && (
        <>
          {/* Desktop / Tablet Inline Expandable Search */}
          <form
            onSubmit={handleSubmit}
            className="tc-nav-search__expanded-desktop"
            role="search"
          >
            <Search className="tc-nav-search__input-icon" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles, topics…"
              className="tc-nav-search__input"
              autoComplete="off"
            />
            {query && (
              <button
                type="submit"
                className="tc-nav-search__submit-btn"
                aria-label="Submit search"
                title="Search"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={handleClearOrClose}
              className="tc-nav-search__close-btn"
              aria-label="Close search"
              title="Close search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Mobile Full-Width Overlay Search */}
          <div className="tc-nav-search__mobile-overlay">
            <form
              onSubmit={handleSubmit}
              className="tc-nav-search__mobile-form"
              role="search"
            >
              <Search className="tc-nav-search__mobile-icon" />
              <input
                ref={isOpen ? inputRef : undefined}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles, topics…"
                className="tc-nav-search__mobile-input"
                autoComplete="off"
              />
              {query && (
                <button
                  type="submit"
                  className="tc-nav-search__mobile-submit"
                  aria-label="Submit search"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="tc-nav-search__mobile-close"
                aria-label="Close search"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
