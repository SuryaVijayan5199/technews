import type { Metadata } from "next";
import Link from "next/link";
import {
  Megaphone,
  Users,
  Target,
  Mail,
  CheckCircle2,
  FileSpreadsheet,
  Globe,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { CompanyPageLayout } from "@/components/company/company-page-layout";

export const metadata: Metadata = {
  title: "Advertise & Partner — TechCrest Media Solutions",
  description:
    "Partner with TechCrest to reach high-intent technology decision-makers, engineers, founders, and tech enthusiasts worldwide.",
};

export default function AdvertisePage() {
  return (
    <CompanyPageLayout
      title="Advertise with TechCrest"
      badge="Partnerships & Media Solutions"
      badgeIcon={<Megaphone className="w-3.5 h-3.5" />}
      subtitle="Reach high-intent engineers, startup founders, enterprise technology buyers, and enthusiastic consumers through premium storytelling and strategic placement."
      currentSlug="/advertise"
    >
      {/* Editorial Lead Manifesto */}
      <div className="tc-manifesto-card">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-2 font-display">
          Why Tech Leaders & Brands Partner with TechCrest
        </h2>
        <p className="tc-manifesto-text text-base">
          TechCrest cuts through PR buzzwords to explain technology with rigor
          and real-world clarity. Our audience values authentic, insight-driven
          journalism—making our platform the ideal venue to introduce
          transformative products, enterprise solutions, developer tools, and
          consumer innovations.
        </p>
      </div>

      {/* Audience & Readership Metrics */}
      <section className="tc-editorial-section">
        <div className="tc-editorial-section__header">
          <h2 className="tc-editorial-section__title">
            <Users className="w-5 h-5 text-[#2D7FF9]" />
            Our Audience & Readership
          </h2>
          <span className="tc-editorial-section__badge">Verified Reach</span>
        </div>

        <div className="tc-stat-grid">
          <div className="tc-stat-card">
            <p className="tc-stat-card__number text-[#2D7FF9]">250K+</p>
            <p className="tc-stat-card__label">Monthly Readers</p>
            <p className="tc-stat-card__desc">
              Active readers across AI, mobile, robotics, EVs, cybersecurity,
              and crypto.
            </p>
          </div>

          <div className="tc-stat-card">
            <p className="tc-stat-card__number text-[#10b981]">65%</p>
            <p className="tc-stat-card__label">Tech Decision Makers</p>
            <p className="tc-stat-card__desc">
              Founders, software architects, tech leads, engineering directors,
              and product heads.
            </p>
          </div>

          <div className="tc-stat-card">
            <p className="tc-stat-card__number text-[#8b5cf6]">Global</p>
            <p className="tc-stat-card__label">Reach & Distribution</p>
            <p className="tc-stat-card__desc">
              Core readership distributed across India, Southeast Asia, North
              America, and Europe.
            </p>
          </div>
        </div>
      </section>

      {/* Collaboration Opportunities */}
      <section className="tc-editorial-section">
        <div className="tc-editorial-section__header">
          <h2 className="tc-editorial-section__title">
            <Target className="w-5 h-5 text-[#6366f1]" />
            Collaboration Opportunities
          </h2>
          <span className="tc-editorial-section__badge">Bespoke Formats</span>
        </div>

        <div className="space-y-4">
          {/* Format 1 */}
          <div className="p-5 rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-1)] flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-[rgba(45,127,249,0.12)] text-[#2D7FF9] flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[var(--color-text-primary)]">
                Sponsored Deep-Dives & Case Studies
              </h3>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                Comprehensive, editorially verified technical breakdowns of
                your architectural breakthroughs, platforms, or product
                releases, labeled with complete transparency.
              </p>
            </div>
          </div>

          {/* Format 2 */}
          <div className="p-5 rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-1)] flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-[rgba(16,185,129,0.12)] text-[#10b981] flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[var(--color-text-primary)]">
                Newsletter Sponsorships & Executive Takeovers
              </h3>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                Direct placement in our curated morning briefings delivered
                straight to thousands of executives, developers, and early
                adopters.
              </p>
            </div>
          </div>

          {/* Format 3 */}
          <div className="p-5 rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-1)] flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-[rgba(245,158,11,0.12)] text-[#f59e0b] flex items-center justify-center shrink-0 mt-0.5">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[var(--color-text-primary)]">
                Category Sponsorships & Topic Ownership
              </h3>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                Exclusive branding across dedicated high-traffic verticals: AI,
                Phones, Audio, Robotics, EVs, Security, Gaming, or Crypto.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Start a Conversation Banner */}
      <section className="tc-action-banner">
        <div className="tc-action-banner__content">
          <h2 className="tc-action-banner__title">Start a Conversation</h2>
          <p className="tc-action-banner__desc">
            To request our full media kit, discuss custom campaigns, or schedule
            a strategy call with our commercial team:
          </p>
          <div className="mt-2.5 text-xs text-muted-foreground">
            <strong className="text-[var(--color-text-primary)]">
              Subject Suggestion:
            </strong>{" "}
            &quot;Partnership Inquiry — [Your Brand/Company]&quot;
          </div>
        </div>
        <a
          href="mailto:editor@techcrest.news?subject=Partnership%20Inquiry%20%E2%80%94%20[Your%20Brand%2FCompany]"
          className="tc-action-banner__btn"
        >
          <Mail className="w-4 h-4" /> Request Media Kit
        </a>
      </section>
    </CompanyPageLayout>
  );
}
