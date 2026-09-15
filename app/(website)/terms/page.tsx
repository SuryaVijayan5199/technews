import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Scale } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service — TechCrest",
  description: "Terms and conditions governing access to and use of TechCrest digital publishing services.",
};

export default function TermsPage() {
  return (
    <div className="tc-policy-page">
      <div className="tc-policy-page__container">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="tc-policy-page__breadcrumb">
          <Link href="/" className="tc-policy-page__breadcrumb-link">Home</Link>
          <ChevronRight className="tc-icon-xs" />
          <span className="tc-policy-page__breadcrumb-current">Terms of Service</span>
        </nav>

        {/* Page Header */}
        <div className="tc-policy-page__header">
          <div className="tc-policy-page__badge">
            <Scale className="tc-icon-xs" />
            <span>LEGAL AGREEMENT</span>
          </div>
          <h1 className="tc-policy-page__title">
            Terms of Service
          </h1>
          <p className="tc-policy-page__date">
            Last Updated: September 15, 2026
          </p>
        </div>

        {/* Policy Body */}
        <div className="tc-policy-page__content">
          <div className="tc-policy-page__intro-card">
            <p className="tc-policy-page__intro-text">
              Welcome to TechCrest. These Terms of Service govern your access to and use of <span className="tc-text-brand">techcrest.news</span>, including our articles, newsletters, community features, multimedia content and other services.
            </p>
            <p className="tc-policy-page__intro-note">
              By accessing or using TechCrest, you agree to these Terms of Service. If you do not agree with these terms, please do not use the website.
            </p>
          </div>

          {/* Section 1 */}
          <section className="tc-policy-page__section tc-policy-page__section--first">
            <h2 className="tc-policy-page__section-title">
              <span className="tc-policy-page__section-num">1</span>
              About TechCrest
            </h2>
            <p>
              TechCrest is a consumer technology publication covering technology, products, companies, trends and ideas shaping everyday life.
            </p>
            <p>
              Our coverage may include smartphones, audio, robotics, artificial intelligence, fitness technology, cybersecurity, smart home products, electric vehicles, gaming, digital assets and other areas of technology.
            </p>
          </section>

          {/* Section 2 */}
          <section className="tc-policy-page__section">
            <h2 className="tc-policy-page__section-title">
              <span className="tc-policy-page__section-num">2</span>
              Use of the Website
            </h2>
            <p>You agree to use TechCrest only for lawful purposes and in accordance with these Terms.</p>
            <p className="font-semibold">You must not:</p>
            <ul className="tc-policy-page__list">
              <li className="tc-policy-page__list-item">Use the website for unlawful or fraudulent purposes;</li>
              <li className="tc-policy-page__list-item">Attempt to gain unauthorized access to our systems;</li>
              <li className="tc-policy-page__list-item">Interfere with the operation or security of the website;</li>
              <li className="tc-policy-page__list-item">Introduce malicious software or harmful code;</li>
              <li className="tc-policy-page__list-item">Scrape, reproduce or systematically collect content without permission;</li>
              <li className="tc-policy-page__list-item">Impersonate another person or organization; or</li>
              <li className="tc-policy-page__list-item">Use our services in a manner that violates applicable laws or the rights of others.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="tc-policy-page__section">
            <h2 className="tc-policy-page__section-title">
              <span className="tc-policy-page__section-num">3</span>
              Intellectual Property
            </h2>
            <p>
              Unless otherwise stated, TechCrest’s articles, original text, graphics, logos, photographs, videos, designs, software and other content are owned by or licensed to TechCrest and are protected by applicable intellectual property laws.
            </p>
            <p>
              You may access and share links to TechCrest content for personal, non-commercial purposes, provided that the content is not altered or presented in a misleading manner.
            </p>
            <p>
              Reproducing, republishing, distributing or commercially exploiting TechCrest content without prior written permission is prohibited.
            </p>
            <p className="tc-text-muted text-sm">
              Third-party trademarks, logos and product names remain the property of their respective owners.
            </p>
          </section>

          {/* Section 4 */}
          <section className="tc-policy-page__section">
            <h2 className="tc-policy-page__section-title">
              <span className="tc-policy-page__section-num">4</span>
              Editorial Content
            </h2>
            <p>
              TechCrest publishes news, analysis, reviews, features, opinion and other editorial content.
            </p>
            <p>
              Our editorial content is provided for general informational purposes and should not be considered professional financial, legal, medical, investment or other specialized advice.
            </p>
            <p>
              Product availability, specifications, pricing and other information may change without notice. Readers should independently verify important information before making purchasing, financial or other decisions.
            </p>
          </section>

          {/* Section 5 */}
          <section className="tc-policy-page__section">
            <h2 className="tc-policy-page__section-title">
              <span className="tc-policy-page__section-num">5</span>
              Community and User Content
            </h2>
            <p>
              Where community features are available, users are responsible for the content they submit.
            </p>
            <p>
              You must not post content that is unlawful, defamatory, threatening, abusive, hateful, fraudulent, misleading, invasive of another person’s privacy or otherwise inappropriate.
            </p>
            <p>
              Spam, harassment, unauthorized promotion and malicious activity may result in removal of content or suspension of access.
            </p>
            <p className="tc-text-muted text-sm">
              By submitting content to TechCrest, you grant TechCrest a non-exclusive, worldwide, royalty-free license to host, display, reproduce and distribute that content as necessary to operate and promote the relevant service, subject to applicable law.
            </p>
          </section>

          {/* Section 6 */}
          <section className="tc-policy-page__section">
            <h2 className="tc-policy-page__section-title">
              <span className="tc-policy-page__section-num">6</span>
              Third-Party Links
            </h2>
            <p>
              TechCrest may contain links to third-party websites and services. These links are provided for convenience and informational purposes. TechCrest does not control or guarantee the accuracy, availability, security or policies of third-party websites.
            </p>
            <p>
              Your use of third-party services is subject to their respective terms and policies.
            </p>
          </section>

          {/* Section 7 */}
          <section className="tc-policy-page__section">
            <h2 className="tc-policy-page__section-title">
              <span className="tc-policy-page__section-num">7</span>
              Advertising and Affiliate Content
            </h2>
            <p>
              TechCrest may display advertising, sponsored content or affiliate links. Sponsored or commercial content will be identified where appropriate. Affiliate relationships do not determine our editorial recommendations.
            </p>
            <p className="text-sm">
              For additional information, please see our <Link href="/affiliate-disclosure" className="tc-policy-page__contact-link">Affiliate Disclosure</Link> and <Link href="/editorial-policy" className="tc-policy-page__contact-link">Editorial Policy</Link>.
            </p>
          </section>

          {/* Section 8 */}
          <section className="tc-policy-page__section">
            <h2 className="tc-policy-page__section-title">
              <span className="tc-policy-page__section-num">8</span>
              Disclaimer of Warranties
            </h2>
            <p>
              TechCrest provides its website and content on an “as is” and “as available” basis to the extent permitted by applicable law.
            </p>
            <p>
              We do not guarantee that the website will always be available, uninterrupted, secure or error-free, or that all content will always be complete, current or accurate.
            </p>
          </section>

          {/* Section 9 */}
          <section className="tc-policy-page__section">
            <h2 className="tc-policy-page__section-title">
              <span className="tc-policy-page__section-num">9</span>
              Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by applicable law, TechCrest and its owners, employees, contributors and service providers will not be liable for indirect, incidental, consequential or special damages arising from your use of, or inability to use, the website or its content.
            </p>
            <p>
              Nothing in these Terms excludes or limits liability that cannot legally be excluded or limited.
            </p>
          </section>

          {/* Section 10 */}
          <section className="tc-policy-page__section">
            <h2 className="tc-policy-page__section-title">
              <span className="tc-policy-page__section-num">10</span>
              Changes to These Terms
            </h2>
            <p>
              We may update these Terms of Service from time to time. Updated terms will be posted on this page with a revised “Last Updated” date.
            </p>
            <p>
              Your continued use of TechCrest following an update constitutes acceptance of the revised terms to the extent permitted by law.
            </p>
          </section>

          {/* Section 11 */}
          <section className="tc-policy-page__section">
            <h2 className="tc-policy-page__section-title">
              <span className="tc-policy-page__section-num">11</span>
              Governing Law
            </h2>
            <p>
              These Terms will be governed by applicable law, subject to any mandatory consumer protection or other legal rights that apply to you based on your place of residence.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
