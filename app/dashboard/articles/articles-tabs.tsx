"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";

export function ArticlesTabs({ activeTab }: { activeTab: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleTabChange = (tab: string) => {
    startTransition(() => {
      const params = new URLSearchParams(window.location.search);
      if (tab === "all") {
        params.delete("tab");
      } else {
        params.set("tab", tab);
      }
      router.push(`/dashboard/articles?${params.toString()}`);
    });
  };

  const tabs = [
    { id: "all", label: "All" },
    { id: "published", label: "Published" },
    { id: "pending_review", label: "In Review" },
    { id: "seo_review", label: "SEO Audit" },
    { id: "draft", label: "Drafts" },
  ];

  return (
    <div className="dashboard-articles-filters" style={{ opacity: isPending ? 0.7 : 1 }}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabChange(tab.id)}
          className={`dashboard-articles-filter-btn ${
            activeTab === tab.id ? "dashboard-articles-filter-btn--active" : ""
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
