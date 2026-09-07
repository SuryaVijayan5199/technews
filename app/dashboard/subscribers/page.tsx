import { getNewsletterSubscribersAction } from "@/lib/actions/newsletter.actions";
import { SubscribersClient } from "./subscribers-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Newsletter Subscribers | TechCrest Dashboard",
};

export default async function SubscribersPage() {
  const subscribers = await getNewsletterSubscribersAction();

  return (
    <div className="dashboard-subscribers-layout">
      <header className="dashboard-articles-header mb-6">
        <div>
          <h1 className="dashboard-articles-title">Newsletter Subscribers</h1>
          <p className="dashboard-articles-subtitle">
            Manage, search, and export all email & Gmail subscribers for daily newsletter distributions.
          </p>
        </div>
      </header>

      <SubscribersClient initialSubscribers={subscribers as any} />
    </div>
  );
}
