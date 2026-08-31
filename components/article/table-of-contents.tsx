"use client";

import { useState, useEffect } from "react";
import { List } from "lucide-react";
import { cn } from "@/lib/utils";

interface Heading {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string>("");

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
      <div className="toc-card__header">
        <List className="toc-card__header-icon" />
        <h3 className="toc-card__title">
          Contents
        </h3>
      </div>
      <nav className="toc-card__nav">
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
                  <span className="toc-card__text">{h.text}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
