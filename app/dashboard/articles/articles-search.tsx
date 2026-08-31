"use client";

import { useTransition, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function ArticlesSearch({ initialSearch }: { initialSearch: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(initialSearch);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== initialSearch) {
        startTransition(() => {
          const params = new URLSearchParams(window.location.search);
          if (search) {
            params.set("search", search);
          } else {
            params.delete("search");
          }
          router.push(`/dashboard/articles?${params.toString()}`);
        });
      }
    }, 400); // 400ms debounce

    return () => clearTimeout(timer);
  }, [search, initialSearch, router]);

  return (
    <input
      id="article-search-input"
      type="text"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search title..."
      className="input dashboard-articles-search-input"
      style={{ opacity: isPending ? 0.7 : 1 }}
    />
  );
}
