import type { Metadata } from "next";
import { DollarSign, Award, ShoppingBag, Info, ShieldCheck } from "lucide-react";
import { LegalPageLayout, LegalTocItem } from "@/components/legal/legal-page-layout";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Affiliate Disclosure — TechCrest",
  description: "Read TechCrest's affiliate disclosure to understand how we may earn commissions from product links and how we keep our coverage independent.",
};

const TOC: LegalTocItem[] = [
  { id: "independence", title: "Editorial Independence", num: 1 },
  { id: "recommendations", title: "Product Recommendations", num: 2 },
  { id: "advertising", title: "Advertising & Sponsored Content", num: 3 },
  { id: "third-party", title: "Third-Party Programs", num: 4 },
  { id: "transparency", title: "Commerce Questions & Contact", num: 5 },
];

export default function AffiliateDisclosurePage() {
  return (
    <LegalPageLayout
      title="Affiliate Disclosure"
      badge="Commerce & Transparency Disclosure"
      badgeIcon={<DollarSign className="w-3.5 h-3.5" />}
      currentSlug="/affiliate-disclosure"
      tableOfContents={TOC}
      introTitle="Transparency First"
      introText="TechCrest believes in complete transparency with our readers. Some links published on TechCrest may be affiliate links, meaning we may receive a commission if you click an affiliate link and subsequently purchase a product or service through a participating retailer or provider."
      introNote="The price you pay is never increased because of an affiliate relationship."
      contactEmail="editor@techcrest.news"
    >
      {/* Editorial Independence */}
      <section id="independence" className="tc-policy-page__section tc-policy-page__section--first">
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
      <section id="recommendations" className="tc-policy-page__section">
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
      <section id="advertising" className="tc-policy-page__section">
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
      <section id="third-party" className="tc-policy-page__section">
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

      {/* Contact & Transparency */}
      <section id="transparency" className="tc-policy-page__section">
        <h2 className="tc-policy-page__section-title">
          <Info className="tc-policy-page__section-icon" />
          Commerce Questions & Transparency
        </h2>
        <p>
          If you have any questions about an affiliate link, product feature, or commerce partnership, please reach our editorial commerce desk:
        </p>
        <div className="tc-policy-page__intro-card mt-3 text-sm space-y-1.5">
          <p><strong>Entity:</strong> TechCrest</p>
          <p><strong>Inquiries:</strong> <a href="mailto:editor@techcrest.news" className="text-[#2D7FF9] underline">editor@techcrest.news</a></p>
        </div>
      </section>
    </LegalPageLayout>
  );
}
