export default function ArticlePageLoading() {
  return (
    <div className="article-page tc-article-page-padding tc-skeleton-pulse">
      <div className="container">
        {/* Breadcrumb Skeleton */}
        <div className="tc-skel-line mb-6" style={{ width: "13rem" }} />

        <div className="article-layout">
          <div className="article-layout__main">
            {/* Header Skeleton */}
            <div className="space-y-4 mb-6">
              <div className="tc-skel-line" style={{ height: "2.75rem", width: "91.666667%" }} />
              <div className="tc-skel-line" style={{ height: "2.75rem", width: "75%" }} />

              <div className="flex items-center gap-3">
                <div className="tc-skel-badge--brand" />
                <div className="tc-skel-badge--green" />
              </div>

              <div className="tc-skel-audio" />

              {/* Author & Meta Bar Skeleton */}
              <div className="tc-skel-meta-row">
                <div className="flex items-center gap-3">
                  <div className="tc-skel-avatar" />
                  <div className="tc-skel-lines">
                    <div className="tc-skel-line" style={{ height: "1rem", width: "7rem" }} />
                    <div className="tc-skel-line" style={{ height: "0.75rem", width: "5rem" }} />
                  </div>
                </div>
                <div className="tc-skel-line" style={{ height: "1rem", width: "8rem" }} />
              </div>
            </div>

            {/* Featured Hero Image Skeleton */}
            <div className="tc-skel-hero-img" />

            {/* Prose Content Skeleton Paragraphs */}
            <div className="tc-skel-content">
              <div className="tc-skel-line" style={{ width: "100%" }} />
              <div className="tc-skel-line" style={{ width: "100%" }} />
              <div className="tc-skel-line" style={{ width: "80%" }} />
              <div className="tc-skel-line" style={{ width: "91.666667%" }} />
              <div className="tc-skel-line mt-4" style={{ width: "100%" }} />
              <div className="tc-skel-line" style={{ width: "75%" }} />
            </div>
          </div>

          {/* Table of Contents Sidebar Skeleton */}
          <aside className="article-layout__sidebar hidden lg:block">
            <div className="tc-skel-sidebar-card">
              <div className="tc-skel-line" style={{ width: "8rem" }} />
              <div className="tc-skel-line" style={{ height: "0.75rem", width: "10rem" }} />
              <div className="tc-skel-line" style={{ height: "0.75rem", width: "9rem" }} />
              <div className="tc-skel-line" style={{ height: "0.75rem", width: "11rem" }} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
