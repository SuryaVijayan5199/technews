import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Cookie, Shield, Eye, Settings } from "lucide-react";

export const metadata: Metadata = {
  title: "Cookie Policy — TechCrest",
  description: "Learn how TechCrest uses cookies and similar technologies to enhance your website experience.",
};

export default function CookiesPage() {
  return (
    <div className="tc-policy-page">
      <div className="tc-policy-page__container">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="tc-policy-page__breadcrumb">
          <Link href="/" className="tc-policy-page__breadcrumb-link">Home</Link>
          <ChevronRight className="tc-icon-xs" />
          <span className="tc-policy-page__breadcrumb-current">Cookie Policy</span>
        </nav>

        {/* Page Header */}
        <div className="tc-policy-page__header">
          <div className="tc-policy-page__badge">
            <Cookie className="tc-icon-xs" />
            <span>COOKIE TRANSPARENCY</span>
          </div>
          <h1 className="tc-policy-page__title">
            Cookie Policy
          </h1>
        </div>

        {/* Policy Body */}
        <div className="tc-policy-page__content">
          <div className="tc-policy-page__intro-card">
            <p className="tc-policy-page__intro-text">
              TechCrest uses cookies and similar technologies to provide a reliable website experience, remember user preferences, understand how visitors use our services and improve our content.
            </p>
            <p className="tc-policy-page__intro-note">
              This Cookie Policy explains what cookies are, how we use them and how you can manage them.
            </p>
          </div>

          {/* Section 1 */}
          <section className="tc-policy-page__section tc-policy-page__section--first">
            <h2 className="tc-policy-page__section-title">
              <span className="tc-policy-page__section-num">1</span>
              What Are Cookies?
            </h2>
            <p>
              Cookies are small text files placed on your device when you visit a website. They allow websites to recognize a device, remember preferences and perform certain functions.
            </p>
            <p>
              Similar technologies, including pixels, tags and local storage, may also be used for comparable purposes.
            </p>
          </section>

          {/* Section 2 */}
          <section className="tc-policy-page__section">
            <h2 className="tc-policy-page__section-title">
              <span className="tc-policy-page__section-num">2</span>
              Types of Cookies We Use
            </h2>
            
            <div className="tc-policy-page__grid">
              <div className="tc-policy-page__grid-card">
                <div className="tc-policy-page__grid-card-title">
                  <Shield className="tc-icon-xs" />
                  <span>Essential Cookies</span>
                </div>
                <p className="tc-policy-page__grid-card-text">
                  These cookies are necessary for the website to operate properly. They may support functions such as account authentication, security and basic website functionality.
                </p>
                <p className="tc-text-muted text-xs mt-2">
                  These cookies generally cannot be disabled through our website because certain features may not work without them.
                </p>
              </div>

              <div className="tc-policy-page__grid-card">
                <div className="tc-policy-page__grid-card-title">
                  <Eye className="tc-icon-xs" />
                  <span>Analytics Cookies</span>
                </div>
                <p className="tc-policy-page__grid-card-text">
                  Analytics technologies help us understand how visitors use TechCrest, including which pages are viewed, how users navigate the site and how content performs.
                </p>
                <p className="tc-text-muted text-xs mt-2">
                  This information helps us improve our website and editorial experience.
                </p>
              </div>

              <div className="tc-policy-page__grid-card">
                <div className="tc-policy-page__grid-card-title">
                  <Settings className="tc-icon-xs" />
                  <span>Preference Cookies</span>
                </div>
                <p className="tc-policy-page__grid-card-text">
                  These cookies remember choices such as language, display preferences or other settings so that you do not need to enter them repeatedly.
                </p>
              </div>

              <div className="tc-policy-page__grid-card">
                <div className="tc-policy-page__grid-card-title">
                  <Cookie className="tc-icon-xs" />
                  <span>Advertising & Affiliate Technologies</span>
                </div>
                <p className="tc-policy-page__grid-card-text">
                  Where applicable, TechCrest or our advertising and commercial partners may use cookies or similar technologies to measure advertising performance, deliver relevant advertising or track affiliate referrals.
                </p>
                <p className="tc-text-muted text-xs mt-2">
                  Such technologies are subject to the policies of the relevant third parties.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="tc-policy-page__section">
            <h2 className="tc-policy-page__section-title">
              <span className="tc-policy-page__section-num">3</span>
              Managing Cookies
            </h2>
            <p>
              You can control or delete cookies through your browser settings.
            </p>
            <p>
              You may also be able to control certain categories of cookies through consent or privacy-management tools provided on our website, where required by applicable law.
            </p>
            <p className="tc-text-muted text-sm font-medium">
              Disabling certain cookies may affect website functionality.
            </p>
          </section>

          {/* Section 4 */}
          <section className="tc-policy-page__section">
            <h2 className="tc-policy-page__section-title">
              <span className="tc-policy-page__section-num">4</span>
              Third-Party Cookies
            </h2>
            <p>
              Some cookies may be placed by third-party services used on TechCrest, including analytics, advertising, social media, embedded media or other technology providers.
            </p>
            <p>
              TechCrest does not control third-party cookies once they are placed by those providers. We encourage users to review the privacy and cookie policies of relevant third parties.
            </p>
          </section>

          {/* Section 5 */}
          <section className="tc-policy-page__section">
            <h2 className="tc-policy-page__section-title">
              <span className="tc-policy-page__section-num">5</span>
              Changes to This Policy
            </h2>
            <p>
              We may update this Cookie Policy when our technology, services or legal obligations change.
            </p>
            <p>
              Revised policies will be posted directly to this page.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
