export default function ArticlePageLoading() {
  return (
    <div className="article-page py-6 md:py-10 animate-pulse">
      <div className="container">
        {/* Breadcrumb Skeleton */}
        <div className="h-4 w-52 bg-[var(--color-surface-2)] border border-[var(--color-surface-border)] rounded-md mb-6" />

        <div className="article-layout">
          <div className="article-layout__main">
            {/* Header Skeleton */}
            <div className="space-y-4 mb-6">
              <div className="h-8 sm:h-11 w-11/12 bg-[var(--color-surface-2)] border border-[var(--color-surface-border)] rounded-lg" />
              <div className="h-8 sm:h-11 w-3/4 bg-[var(--color-surface-2)] border border-[var(--color-surface-border)] rounded-lg" />

              <div className="flex items-center gap-3">
                <div className="h-6 w-24 bg-[#2D7FF9]/20 rounded-full" />
                <div className="h-5 w-28 bg-emerald-500/20 rounded-full" />
              </div>

              <div className="h-12 w-full bg-[var(--color-surface-1)] border border-[var(--color-surface-border)] rounded-lg mt-4" />

              {/* Author & Meta Bar Skeleton */}
              <div className="flex items-center justify-between py-4 border-y border-[var(--color-surface-border)]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-surface-2)] border border-[var(--color-surface-border)]" />
                  <div className="space-y-1.5">
                    <div className="h-4 w-28 bg-[var(--color-surface-2)] rounded" />
                    <div className="h-3 w-20 bg-[var(--color-surface-2)] rounded" />
                  </div>
                </div>
                <div className="h-4 w-32 bg-[var(--color-surface-2)] rounded" />
              </div>
            </div>

            {/* Featured Hero Image Skeleton */}
            <div className="w-full h-64 sm:h-96 bg-[var(--color-surface-2)] border border-[var(--color-surface-border)] rounded-xl mb-8" />

            {/* Prose Content Skeleton Paragraphs */}
            <div className="space-y-3.5 mb-8">
              <div className="h-4 w-full bg-[var(--color-surface-2)] rounded" />
              <div className="h-4 w-full bg-[var(--color-surface-2)] rounded" />
              <div className="h-4 w-4/5 bg-[var(--color-surface-2)] rounded" />
              <div className="h-4 w-11/12 bg-[var(--color-surface-2)] rounded" />
              <div className="h-4 w-full bg-[var(--color-surface-2)] rounded mt-4" />
              <div className="h-4 w-3/4 bg-[var(--color-surface-2)] rounded" />
            </div>
          </div>

          {/* Table of Contents Sidebar Skeleton */}
          <aside className="article-layout__sidebar hidden lg:block">
            <div className="p-4 rounded-xl bg-[var(--color-surface-1)] border border-[var(--color-surface-border)] space-y-3">
              <div className="h-4 w-32 bg-[var(--color-surface-2)] rounded" />
              <div className="h-3 w-40 bg-[var(--color-surface-2)] rounded" />
              <div className="h-3 w-36 bg-[var(--color-surface-2)] rounded" />
              <div className="h-3 w-44 bg-[var(--color-surface-2)] rounded" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
