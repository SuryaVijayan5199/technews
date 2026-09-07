"use client";

import { useState, useEffect } from "react";
import { List, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Heading {
  id: string;
  text: string;
  level: number;
}

function decodeHtmlEntities(str: string): string {
  if (!str) return "";
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-80px 0% -70% 0%" }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <div className="toc-card card" aria-label="Table of contents">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="toc-card__header w-full text-left flex items-center justify-between cursor-pointer border-none bg-transparent p-0"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <List className="toc-card__header-icon" />
          <h3 className="toc-card__title">
            Article Contents ({headings.length})
          </h3>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-[var(--color-text-muted)]" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)]" />
        )}
      </button>

      {isOpen && (
        <nav className="toc-card__nav mt-3">
          <ul className="toc-card__list">
            {headings.map((h, idx) => {
              const isActive = activeId === h.id;
              return (
                <li key={h.id} className="toc-card__item">
                  <a
                    href={`#${h.id}`}
                    className={cn(
                      "toc-card__link",
                      h.level === 3 && "toc-card__link--sub",
                      isActive && "toc-card__link--active"
                    )}
                    onClick={(e) => {
                      e.preventDefault();
                      document
                        .getElementById(h.id)
                        ?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                  >
                    <span className="toc-card__num">{idx + 1}.</span>
                    <span className="toc-card__text">{decodeHtmlEntities(h.text)}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </div>
  );
}
