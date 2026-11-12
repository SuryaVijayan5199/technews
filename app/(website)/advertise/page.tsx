import type { Metadata } from "next";
import Link from "next/link";
import {
  Megaphone,
  Users,
  Target,
  Mail,
  CheckCircle2,
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
      badgeIcon={<Megaphone className="tc-subpage-badge__icon" />}
      subtitle="Reach high-intent engineers, startup founders, enterprise technology buyers, and enthusiastic consumers through premium storytelling and strategic placement."
      currentSlug="/advertise"
    >
      {/* Editorial Lead Manifesto */}
      <div className="tc-manifesto-box">
        <h2 className="tc-manifesto-box__title">
          Why Tech Leaders & Brands Partner with TechCrest
        </h2>
        <p className="tc-manifesto-box__text">
          TechCrest cuts through PR buzzwords to explain technology with rigor
          and real-world clarity. Our audience values authentic, insight-driven
          journalism—making our platform the ideal venue to introduce
          transformative products, enterprise solutions, developer tools, and
          consumer innovations.
        </p>
      </div>

      {/* Audience & Readership Metrics */}
      <section className="tc-editorial-block">
        <div className="tc-editorial-block__header">
          <h2 className="tc-editorial-block__title">
            <Users className="tc-subpage-meta__icon" />
            Our Audience & Readership
          </h2>
          <span className="tc-editorial-block__badge">Verified Reach</span>
        </div>

        <div className="tc-stat-grid">
          <div className="tc-stat-card">
            <p className="tc-stat-card__num" style={{ color: "#2D7FF9" }}>
              250K+
            </p>
            <p className="tc-stat-card__label">Monthly Readers</p>
            <p className="tc-stat-card__desc">
              Active readers across AI, mobile, robotics, EVs, cybersecurity,
              and crypto.
            </p>
          </div>

          <div className="tc-stat-card">
            <p className="tc-stat-card__num" style={{ color: "#10b981" }}>
              65%
            </p>
            <p className="tc-stat-card__label">Tech Decision Makers</p>
            <p className="tc-stat-card__desc">
              Founders, software architects, tech leads, engineering directors,
              and product heads.
            </p>
          </div>

          <div className="tc-stat-card">
            <p className="tc-stat-card__num" style={{ color: "#8b5cf6" }}>
              Global
            </p>
            <p className="tc-stat-card__label">Reach & Distribution</p>
            <p className="tc-stat-card__desc">
              Core readership distributed across India, Southeast Asia, North
              America, and Europe.
            </p>
          </div>
        </div>
      </section>

      {/* Collaboration Opportunities */}
      <section className="tc-editorial-block">
        <div className="tc-editorial-block__header">
          <h2 className="tc-editorial-block__title">
            <Target className="tc-subpage-meta__icon" />
            Collaboration Opportunities
          </h2>
          <span className="tc-editorial-block__badge">Bespoke Formats</span>
        </div>

        <div className="tc-collab-list">
          {/* Format 1 */}
          <div className="tc-collab-card">
            <div
              className="tc-collab-card__icon-wrap"
              style={{
                backgroundColor: "rgba(45, 127, 249, 0.12)",
                color: "#2D7FF9",
              }}
            >
              <CheckCircle2 className="tc-subpage-meta__icon" />
            </div>
            <div>
              <h3 className="tc-collab-card__title">
                Sponsored Deep-Dives & Case Studies
              </h3>
              <p className="tc-collab-card__desc">
                Comprehensive, editorially verified technical breakdowns of
                your architectural breakthroughs, platforms, or product
                releases, labeled with complete transparency.
              </p>
            </div>
          </div>

          {/* Format 2 */}
          <div className="tc-collab-card">
            <div
              className="tc-collab-card__icon-wrap"
              style={{
                backgroundColor: "rgba(16, 185, 129, 0.12)",
                color: "#10b981",
              }}
            >
              <Sparkles className="tc-subpage-meta__icon" />
            </div>
            <div>
              <h3 className="tc-collab-card__title">
                Newsletter Sponsorships & Executive Takeovers
              </h3>
              <p className="tc-collab-card__desc">
                Direct placement in our curated morning briefings delivered
                straight to thousands of executives, developers, and early
                adopters.
              </p>
            </div>
          </div>

          {/* Format 3 */}
          <div className="tc-collab-card">
            <div
              className="tc-collab-card__icon-wrap"
              style={{
                backgroundColor: "rgba(245, 158, 11, 0.12)",
                color: "#f59e0b",
              }}
            >
              <Target className="tc-subpage-meta__icon" />
            </div>
            <div>
              <h3 className="tc-collab-card__title">
                Category Sponsorships & Topic Ownership
              </h3>
              <p className="tc-collab-card__desc">
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
          <div className="tc-action-banner__note">
            <strong>Subject Suggestion:</strong> &quot;Partnership Inquiry —
            [Your Brand/Company]&quot;
          </div>
        </div>
        <a
          href="mailto:editor@techcrest.news?subject=Partnership%20Inquiry%20%E2%80%94%20[Your%20Brand%2FCompany]"
          className="tc-action-banner__btn"
        >
          <Mail className="tc-subpage-meta__icon" /> Request Media Kit
        </a>
      </section>
    </CompanyPageLayout>
  );
}
