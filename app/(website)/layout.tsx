import { BreakingNewsBar } from "@/components/layout/breaking-news-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageTransition } from "@/components/providers/page-transition";



export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="tc-sticky-header-stack">
        <Header />
        <BreakingNewsBar />
      </div>
      <PageTransition>
        <main>{children}</main>
      </PageTransition>
      <Footer />
    </>
  );
}
