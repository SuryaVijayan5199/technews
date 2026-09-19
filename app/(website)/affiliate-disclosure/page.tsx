import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, DollarSign, Award, ShoppingBag, Info, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Affiliate Disclosure — TechCrest",
  description: "Learn about TechCrest's affiliate relationships, commerce disclosures, and strict editorial independence.",
};

export default function AffiliateDisclosurePage() {
  return (
    <div className="tc-policy-page">
      <div className="tc-policy-page__container">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="tc-policy-page__breadcrumb">
          <Link href="/" className="tc-policy-page__breadcrumb-link">Home</Link>
          <ChevronRight className="tc-icon-xs" />
          <span className="tc-policy-page__breadcrumb-current">Affiliate Disclosure</span>
        </nav>

        {/* Page Header */}
        <div className="tc-policy-page__header">
          <div className="tc-policy-page__badge">
            <DollarSign className="tc-icon-xs" />
            <span>COMMERCE & TRANSPARENCY DISCLOSURE</span>
          </div>
          <h1 className="tc-policy-page__title">
            Affiliate Disclosure
          </h1>
        </div>

        {/* Policy Body */}
        <div className="tc-policy-page__content">
          <div className="tc-policy-page__intro-card">
            <p className="font-semibold text-[var(--color-text-primary)] mb-2">
              TechCrest believes in transparency with its readers.
            </p>
            <p className="tc-policy-page__intro-text">
              Some links published on TechCrest may be affiliate links. This means TechCrest may receive a commission if you click an affiliate link and subsequently purchase a product or service through the participating retailer or provider.
            </p>
            <div className="tc-policy-page__highlight-box">
              The price you pay is generally not increased because of an affiliate relationship.
            </div>
          </div>

          {/* Editorial Independence */}
          <section className="tc-policy-page__section tc-policy-page__section--first">
            <h2 className="tc-policy-page__section-title">
              <Award className="tc-policy-page__section-icon" />
              Editorial Independence
            </h2>
            <p>
              Affiliate relationships do not determine our editorial coverage.
            </p>
            <p>
              We do not accept payment from companies in exchange for favorable reviews, rankings or news coverage. Our editorial recommendations are based on our assessment of a product, service or technology and its potential value to our readers.
            </p>
            <p className="tc-text-muted text-sm">
              Where appropriate, affiliate relationships may be disclosed within individual articles or near relevant links.
            </p>
          </section>

          {/* Product Recommendations */}
          <section className="tc-policy-page__section">
            <h2 className="tc-policy-page__section-title">
              <ShoppingBag className="tc-policy-page__section-icon" />
              Product Recommendations
            </h2>
            <p>
              Technology products featured on TechCrest may be selected based on factors such as functionality, performance, innovation, value, availability, user experience and relevance to our audience.
            </p>
            <p className="font-semibold text-sm">
              An affiliate relationship does not guarantee that a product will be recommended.
            </p>
          </section>

          {/* Advertising and Sponsored Content */}
          <section className="tc-policy-page__section">
            <h2 className="tc-policy-page__section-title">
              <Info className="tc-policy-page__section-icon" />
              Advertising and Sponsored Content
            </h2>
            <p>
              Affiliate marketing is separate from advertising and sponsored editorial content.
            </p>
            <p>
              Paid partnerships and sponsored material will be identified appropriately and will remain separate from independent editorial decisions.
            </p>
          </section>

          {/* Third-Party Programs */}
          <section className="tc-policy-page__section">
            <h2 className="tc-policy-page__section-title">
              <ShieldCheck className="tc-policy-page__section-icon" />
              Third-Party Programs
            </h2>
            <p>
              TechCrest may participate in affiliate programs operated by retailers, technology companies, commerce platforms and other third-party providers.
            </p>
            <p className="tc-text-muted text-sm">
              The terms, commission structures and participating partners may change over time.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
