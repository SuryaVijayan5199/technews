import Link from "next/link";
import { Plus } from "lucide-react";
import { RoleGate } from "@/components/shared/role-gate";
import { getArticles } from "@/lib/actions/article.actions";
import { getCategories } from "@/lib/actions/dashboard.actions";
import { ArticlesClient } from "./articles-client";

export const metadata = {
  title: "Articles Directory | TechCrest Dashboard",
};

const PAGE_SIZE = 15;

export default async function EditorialArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    tab?: string;
    category?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const search = params?.search || "";
  const tab = params?.tab || "all";
  const categorySlug = params?.category || "";
  const page = Math.max(1, parseInt(params?.page || "1", 10));

  const [articles, categories] = await Promise.all([
    getArticles(search, tab),
    getCategories(),
  ]);

  return (
    <div className="dashboard-articles-layout">
      {/* Header Bar */}
      <header className="dashboard-articles-header">
        <div className="dashboard-articles-header__text">
          <h1 className="dashboard-articles-title">Articles Directory</h1>
          <p className="dashboard-articles-subtitle">
            Manage, edit, review, and publish all editorial content across TechCrest.
          </p>
        </div>
        <Link href="/dashboard/articles/new" className="btn btn-primary dashboard-articles-btn">
          <Plus className="w-4 h-4" /> New Article
        </Link>
      </header>

      {/* Full client-side filtering, pagination */}
      <ArticlesClient
        initialArticles={articles as any}
        categories={categories as any}
        initialTab={tab}
        initialSearch={search}
        initialCategory={categorySlug}
        initialPage={page}
        pageSize={PAGE_SIZE}
      />
    </div>
  );
}
