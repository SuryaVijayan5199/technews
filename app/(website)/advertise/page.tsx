import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Megaphone, TrendingUp, Users, Target, Mail, Building2, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Advertise & Partner — TechCrest",
  description:
    "Partner with TechCrest to reach high-intent technology decision-makers, engineers, founders, and tech enthusiasts worldwide.",
};

export default function AdvertisePage() {
  return (
    <div className="tc-policy-page">
      <div className="tc-policy-page__container">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="tc-policy-page__breadcrumb">
          <Link href="/" className="tc-policy-page__breadcrumb-link">Home</Link>
          <ChevronRight className="tc-icon-xs" />
          <span className="tc-policy-page__breadcrumb-current">Advertise</span>
        </nav>

        {/* Page Header */}
        <div className="tc-policy-page__header">
          <div className="tc-policy-page__badge">
            <Megaphone className="tc-icon-xs" />
            <span>PARTNERSHIPS & MEDIA SOLUTIONS</span>
          </div>
          <h1 className="tc-policy-page__title">
            Advertise with TechCrest
          </h1>
          <p className="tc-policy-page__subtitle mt-2 text-base text-muted-foreground max-w-2xl">
            Reach high-intent engineers, startup founders, enterprise technology buyers, and enthusiastic consumers through premium storytelling and strategic placement.
          </p>
        </div>

        {/* Content Body */}
        <div className="tc-policy-page__content">
          <div className="tc-policy-page__intro-card">
            <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">
              Why Tech Leaders & Brands Partner with TechCrest
            </h2>
            <p className="tc-policy-page__intro-text">
              TechCrest cuts through PR buzzwords to explain technology with rigor and real-world clarity. Our audience values authentic, insight-driven journalism—making our platform the ideal venue to introduce transformative products, enterprise solutions, developer tools, and consumer innovations.
            </p>
          </div>

          {/* Audience Metrics Grid */}
          <section className="tc-policy-page__section tc-policy-page__section--first">
            <h2 className="tc-policy-page__section-title">
              <Users className="tc-policy-page__section-icon text-[#2D7FF9]" />
              Our Audience & Readership
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div className="p-4 rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-1)]">
                <p className="text-2xl font-extrabold text-[#2D7FF9]">250K+</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-1">Monthly Readers</p>
                <p className="text-xs text-muted-foreground mt-2">Active readers across AI, mobile, robotics, EVs, cybersecurity, and crypto.</p>
              </div>
              <div className="p-4 rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-1)]">
                <p className="text-2xl font-extrabold text-[#10b981]">65%</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-1">Tech Decision Makers</p>
                <p className="text-xs text-muted-foreground mt-2">Founders, software architects, tech leads, engineering directors, and product heads.</p>
              </div>
              <div className="p-4 rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-1)]">
                <p className="text-2xl font-extrabold text-[#8b5cf6]">Global</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-1">Reach & Distribution</p>
                <p className="text-xs text-muted-foreground mt-2">Core readership distributed across India, Southeast Asia, North America, and Europe.</p>
              </div>
            </div>
          </section>

          {/* Partnership Opportunities */}
          <section className="tc-policy-page__section">
            <h2 className="tc-policy-page__section-title">
              <Target className="tc-policy-page__section-icon text-[#6366f1]" />
              Collaboration Opportunities
            </h2>
            <div className="space-y-4 mt-3">
              <div className="flex gap-3 items-start p-4 rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-card)]">
                <CheckCircle2 className="w-5 h-5 text-[#2D7FF9] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-sm text-[var(--color-text-primary)]">Sponsored Deep-Dives & Case Studies</h3>
                  <p className="text-xs text-muted-foreground mt-1">Comprehensive, editorially verified technical breakdowns of your architectural breakthroughs, platforms, or product releases, labeled with complete transparency.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start p-4 rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-card)]">
                <CheckCircle2 className="w-5 h-5 text-[#10b981] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-sm text-[var(--color-text-primary)]">Newsletter Sponsorships & Executive Takeovers</h3>
                  <p className="text-xs text-muted-foreground mt-1">Direct placement in our curated morning briefings delivered straight to thousands of executives, developers, and early adopters.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start p-4 rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-card)]">
                <CheckCircle2 className="w-5 h-5 text-[#f59e0b] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-sm text-[var(--color-text-primary)]">Category Sponsorships & Topic Ownership</h3>
                  <p className="text-xs text-muted-foreground mt-1">Exclusive branding across dedicated high-traffic verticals: AI, Phones, Audio, Robotics, EVs, Security, Gaming, or Crypto.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Box */}
          <section className="tc-policy-page__section">
            <h2 className="tc-policy-page__section-title">
              <Mail className="tc-policy-page__section-icon text-[#2D7FF9]" />
              Start a Conversation
            </h2>
            <p>
              To request our full media kit, discuss custom campaigns, or schedule a strategy call with our commercial team:
            </p>
            <div className="tc-policy-page__intro-card mt-3 text-sm space-y-2">
              <p><strong>Partnerships Desk:</strong> <a href="mailto:editor@techcrest.news" className="text-[#2D7FF9] underline">editor@techcrest.news</a></p>
              <p><strong>Subject Suggestion:</strong> &quot;Partnership Inquiry — [Your Brand/Company]&quot;</p>
              <p><strong>Headquarters:</strong> TechCrest, 4th Floor VM Grandeur, Bangalore 560113, India</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
