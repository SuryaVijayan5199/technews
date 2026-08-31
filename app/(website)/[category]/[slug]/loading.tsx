export default function ArticlePageLoading() {
  return (
    <div className="article-page py-6 md:py-10 animate-pulse">
      <div className="container">
        {/* Breadcrumb Skeleton */}
        <div className="h-4 w-48 bg-slate-200 dark:bg-slate-800 rounded mb-6" />

        <div className="article-layout">
          <div className="article-layout__main">
            {/* Header Skeleton */}
            <div className="space-y-4 mb-6">
              <div className="h-9 sm:h-12 w-11/12 bg-slate-200 dark:bg-slate-800 rounded-lg" />
              <div className="h-9 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-lg" />

              <div className="flex items-center gap-3">
                <div className="h-6 w-24 bg-[#2D7FF9]/20 rounded-full" />
                <div className="h-5 w-28 bg-emerald-500/20 rounded-full" />
              </div>

              <div className="h-14 w-full bg-slate-100 dark:bg-slate-900 rounded-lg mt-4" />

              {/* Author & Meta Bar Skeleton */}
              <div className="flex items-center justify-between py-4 border-y border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-300 dark:bg-slate-700" />
                  <div className="space-y-1.5">
                    <div className="h-4 w-28 bg-slate-300 dark:bg-slate-700 rounded" />
                    <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
                  </div>
                </div>
                <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
              </div>
            </div>

            {/* Featured Hero Image Skeleton */}
            <div className="w-full h-64 sm:h-96 bg-slate-200 dark:bg-slate-800 rounded-xl mb-8" />

            {/* Prose Content Skeleton */}
            <div className="space-y-4">
              <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-4 w-4/5 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
