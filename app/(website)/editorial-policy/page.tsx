import type { Metadata } from "next";
import Link from "next/link";
import { Award } from "lucide-react";
import { LegalPageLayout, LegalTocItem } from "@/components/legal/legal-page-layout";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Editorial Policy — TechCrest",
  description: "Discover TechCrest's editorial standards on accuracy, sourcing, fact-checking, corrections and independence that guide every story we publish.",
};

const TOC: LegalTocItem[] = [
  { id: "independence", title: "Editorial Independence", num: 1 },
  { id: "accuracy", title: "Accuracy & Verification", num: 2 },
  { id: "sources", title: "Sources & Attribution", num: 3 },
  { id: "corrections", title: "Corrections Policy", num: 4 },
  { id: "opinion", title: "Opinion & Analysis", num: 5 },
  { id: "reviews", title: "Reviews & Product Coverage", num: 6 },
  { id: "commercial", title: "Sponsored & Commercial", num: 7 },
  { id: "affiliate", title: "Affiliate Relationships", num: 8 },
  { id: "conflicts", title: "Conflicts of Interest", num: 9 },
  { id: "ai-tech", title: "AI & Emerging Tech", num: 10 },
  { id: "headlines", title: "Headlines & Presentation", num: 11 },
  { id: "community", title: "User-Generated Content", num: 12 },
  { id: "newsroom-desk", title: "Corrections, Tips & Contact", num: 13 },
];

export default function EditorialPolicyPage() {
  return (
    <LegalPageLayout
      title="Editorial Policy"
      badge="Journalism Standards & Integrity"
      badgeIcon={<Award className="w-3.5 h-3.5" />}
      lastUpdated="October 2026"
      readingTime="6 min read"
      currentSlug="/editorial-policy"
      tableOfContents={TOC}
      introText="TechCrest is committed to independent, accurate and responsible technology journalism. Our goal is to help readers understand the products, companies, technologies and ideas shaping the future of everyday life."
      introNote="Our editorial standards apply across our news, features, reviews, analysis, opinion and other editorial content."
      contactEmail="editor@techcrest.news"
    >
      {/* Section 1 */}
      <section id="independence" className="tc-policy-page__section tc-policy-page__section--first">
        <h2 className="tc-policy-page__section-title">
          <span className="tc-policy-page__section-num">1</span>
          Editorial Independence
        </h2>
        <p>
          Editorial decisions are made independently of advertisers, sponsors, affiliate partners, technology companies and other commercial interests.
        </p>
        <p>
          We do not accept payment in exchange for favorable editorial coverage.
        </p>
        <p>
          Commercial relationships do not determine our news judgments, headlines, reviews, ratings or editorial recommendations.
        </p>
      </section>

      {/* Section 2 */}
      <section id="accuracy" className="tc-policy-page__section">
        <h2 className="tc-policy-page__section-title">
          <span className="tc-policy-page__section-num">2</span>
          Accuracy and Verification
        </h2>
        <p>
          We strive to publish information that is accurate, relevant and appropriately sourced.
        </p>
        <p>
          Our journalists and editors verify important claims using reliable sources, including company announcements, regulatory filings, official statements, research, expert commentary and other credible sources.
        </p>
        <p>
          When information cannot be independently verified, we aim to make that clear to readers.
        </p>
      </section>

      {/* Section 3 */}
      <section id="sources" className="tc-policy-page__section">
        <h2 className="tc-policy-page__section-title">
          <span className="tc-policy-page__section-num">3</span>
          Sources and Attribution
        </h2>
        <p>
          We give appropriate credit to original reporting, documents, research, data and other sources.
        </p>
        <p>
          When reporting on information originally published elsewhere, TechCrest aims to clearly attribute the information and add appropriate context rather than presenting third-party reporting as original reporting.
        </p>
        <p>
          We respect copyright and do not reproduce substantial portions of other publications without permission.
        </p>
      </section>

      {/* Section 4 */}
      <section id="corrections" className="tc-policy-page__section">
        <h2 className="tc-policy-page__section-title">
          <span className="tc-policy-page__section-num">4</span>
          Corrections
        </h2>
        <p>We take accuracy seriously.</p>
        <p>
          When we identify a factual error, we correct it promptly. Material corrections may be noted within the article when appropriate.
        </p>
        <p>
          We do not quietly alter significant factual errors in a way that could mislead readers.
        </p>
      </section>

      {/* Section 5 */}
      <section id="opinion" className="tc-policy-page__section">
        <h2 className="tc-policy-page__section-title">
          <span className="tc-policy-page__section-num">5</span>
          Opinion and Analysis
        </h2>
        <p>
          Opinion, commentary and analysis are distinct from straight news reporting.
        </p>
        <p>
          Such content will be identified appropriately, and viewpoints expressed in opinion pieces belong to the author rather than necessarily representing the views of TechCrest.
        </p>
      </section>

      {/* Section 6 */}
      <section id="reviews" className="tc-policy-page__section">
        <h2 className="tc-policy-page__section-title">
          <span className="tc-policy-page__section-num">6</span>
          Reviews and Product Coverage
        </h2>
        <p>
          Product reviews and evaluations are based on editorial judgment and relevant testing, research or publicly available information.
        </p>
        <p>
          Where products are provided by manufacturers or other companies for review, that relationship may be disclosed where relevant.
        </p>
        <p className="tc-text-brand font-semibold">
          Receiving a product does not guarantee favorable coverage.
        </p>
      </section>

      {/* Section 7 */}
      <section id="commercial" className="tc-policy-page__section">
        <h2 className="tc-policy-page__section-title">
          <span className="tc-policy-page__section-num">7</span>
          Sponsored and Commercial Content
        </h2>
        <p>
          Sponsored content, advertising and other paid commercial material will be identified appropriately.
        </p>
        <p>
          Advertisers and sponsors do not receive editorial control over independent news coverage. Commercial partnerships will not be used to disguise advertising as independent editorial content.
        </p>
      </section>

      {/* Section 8 */}
      <section id="affiliate" className="tc-policy-page__section">
        <h2 className="tc-policy-page__section-title">
          <span className="tc-policy-page__section-num">8</span>
          Affiliate Relationships
        </h2>
        <p>
          TechCrest may participate in affiliate programs and may earn commissions when readers purchase products or services through qualifying links.
        </p>
        <p>
          Affiliate relationships do not determine which products or services receive editorial attention or recommendations.
        </p>
        <p className="text-sm">
          Please see our <Link href="/affiliate-disclosure" className="tc-policy-page__contact-link">Affiliate Disclosure</Link> for additional information.
        </p>
      </section>

      {/* Section 9 */}
      <section id="conflicts" className="tc-policy-page__section">
        <h2 className="tc-policy-page__section-title">
          <span className="tc-policy-page__section-num">9</span>
          Conflicts of Interest
        </h2>
        <p>
          Our contributors and editors are expected to disclose relevant conflicts of interest.
        </p>
        <p>
          Where a potential conflict could materially affect the credibility or independence of coverage, TechCrest may modify the assignment, add disclosure or decline the coverage.
        </p>
      </section>

      {/* Section 10 */}
      <section id="ai-tech" className="tc-policy-page__section">
        <h2 className="tc-policy-page__section-title">
          <span className="tc-policy-page__section-num">10</span>
          AI and Emerging Technologies
        </h2>
        <p>
          TechCrest may use technology and artificial intelligence tools to support research, transcription, editing, data analysis, workflow management and other production processes.
        </p>
        <p className="font-semibold text-sm">
          Human editorial judgment remains responsible for published content. AI-generated information is not treated as authoritative without appropriate verification.
        </p>
      </section>

      {/* Section 11 */}
      <section id="headlines" className="tc-policy-page__section">
        <h2 className="tc-policy-page__section-title">
          <span className="tc-policy-page__section-num">11</span>
          Headlines and Presentation
        </h2>
        <p>
          TechCrest aims to write clear, informative and engaging headlines. Headlines should accurately reflect the underlying story and should not intentionally mislead readers.
        </p>
        <p>
          We may use curiosity-driven headlines where appropriate, but accuracy remains the priority.
        </p>
      </section>

      {/* Section 12 */}
      <section id="community" className="tc-policy-page__section">
        <h2 className="tc-policy-page__section-title">
          <span className="tc-policy-page__section-num">12</span>
          User-Generated Content
        </h2>
        <p>
          Comments and other community contributions represent the views of their authors and not necessarily those of TechCrest.
        </p>
        <p>
          We may moderate or remove content that violates our community standards or applicable law.
        </p>
      </section>

      {/* Section 13 */}
      <section id="newsroom-desk" className="tc-policy-page__section">
        <h2 className="tc-policy-page__section-title">
          <span className="tc-policy-page__section-num">13</span>
          Corrections, Tips & Newsroom Desk
        </h2>
        <p>
          To report a factual error, submit an official correction request, or send confidential news tips directly to the editors:
        </p>
        <div className="tc-policy-page__intro-card mt-3 text-sm space-y-1.5">
          <p><strong>Editorial Newsroom:</strong> TechCrest</p>
          <p><strong>Corrections & Tips:</strong> <a href="mailto:editor@techcrest.news" className="text-[#2D7FF9] underline">editor@techcrest.news</a></p>
        </div>
      </section>
    </LegalPageLayout>
  );
}
