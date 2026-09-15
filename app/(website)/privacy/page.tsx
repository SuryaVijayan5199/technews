import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy — TechCrest",
  description: "Learn how TechCrest collects, uses, and protects your personal information when using our website and services.",
};

export default function PrivacyPage() {
  return (
    <div className="tc-policy-page">
      <div className="tc-policy-page__container">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="tc-policy-page__breadcrumb">
          <Link href="/" className="tc-policy-page__breadcrumb-link">Home</Link>
          <ChevronRight className="tc-icon-xs" />
          <span className="tc-policy-page__breadcrumb-current">Privacy Policy</span>
        </nav>

        {/* Page Header */}
        <div className="tc-policy-page__header">
          <div className="tc-policy-page__badge">
            <ShieldCheck className="tc-icon-xs" />
            <span>DATA PRIVACY & PROTECTION</span>
          </div>
          <h1 className="tc-policy-page__title">
            Privacy Policy
          </h1>
          <p className="tc-policy-page__date">
            Last Updated: September 15, 2026
          </p>
        </div>

        {/* Policy Body */}
        <div className="tc-policy-page__content">
          <div className="tc-policy-page__intro-card">
            <p className="tc-policy-page__intro-text">
              At TechCrest, we respect your privacy and are committed to protecting the information you share with us. This Privacy Policy explains what information we may collect, how we use it, when we may share it, and the choices available to you when you use <span className="tc-text-brand">techcrest.news</span>, subscribe to our services, participate in our community, or otherwise interact with us.
            </p>
            <p className="tc-policy-page__intro-note">
              By using TechCrest, you acknowledge the practices described in this Privacy Policy.
            </p>
          </div>

          {/* Section 1 */}
          <section className="tc-policy-page__section tc-policy-page__section--first">
            <h2 className="tc-policy-page__section-title">
              <span className="tc-policy-page__section-num">1</span>
              Information We Collect
            </h2>
            <p>We may collect information in several ways.</p>
            
            <div>
              <h3 className="tc-policy-page__subheading">Information You Provide</h3>
              <p>You may voluntarily provide information when you:</p>
              <ul className="tc-policy-page__list">
                <li className="tc-policy-page__list-item">Subscribe to our newsletter;</li>
                <li className="tc-policy-page__list-item">Create or access an account;</li>
                <li className="tc-policy-page__list-item">Contact us;</li>
                <li className="tc-policy-page__list-item">Submit comments or other community contributions;</li>
                <li className="tc-policy-page__list-item">Participate in surveys, promotions or other interactive features; or</li>
                <li className="tc-policy-page__list-item">Communicate with TechCrest by email or through our website.</li>
              </ul>
              <p className="tc-text-muted text-sm">Depending on the interaction, this may include your name, email address and other information you choose to provide.</p>
            </div>

            <div className="mt-4">
              <h3 className="tc-policy-page__subheading">Information Collected Automatically</h3>
              <p>When you visit TechCrest, certain technical information may be collected automatically, including:</p>
              <ul className="tc-policy-page__list">
                <li className="tc-policy-page__list-item">IP address;</li>
                <li className="tc-policy-page__list-item">Browser and device type;</li>
                <li className="tc-policy-page__list-item">Operating system;</li>
                <li className="tc-policy-page__list-item">Pages viewed and links clicked;</li>
                <li className="tc-policy-page__list-item">Approximate location derived from technical information;</li>
                <li className="tc-policy-page__list-item">Referring website or source;</li>
                <li className="tc-policy-page__list-item">Date, time and duration of visits; and</li>
                <li className="tc-policy-page__list-item">Information about how you interact with our website.</li>
              </ul>
              <p className="tc-text-muted text-sm">This information helps us understand how our audience uses TechCrest, improve website performance and maintain security.</p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="tc-policy-page__section">
            <h2 className="tc-policy-page__section-title">
              <span className="tc-policy-page__section-num">2</span>
              How We Use Information
            </h2>
            <p>We may use information we collect to:</p>
            <ul className="tc-policy-page__list">
              <li className="tc-policy-page__list-item">Provide and operate TechCrest services;</li>
              <li className="tc-policy-page__list-item">Deliver newsletters and other requested communications;</li>
              <li className="tc-policy-page__list-item">Personalize content and recommendations;</li>
              <li className="tc-policy-page__list-item">Improve articles, products, features and user experience;</li>
              <li className="tc-policy-page__list-item">Understand readership and website performance;</li>
              <li className="tc-policy-page__list-item">Respond to inquiries and provide support;</li>
              <li className="tc-policy-page__list-item">Moderate comments and community discussions;</li>
              <li className="tc-policy-page__list-item">Detect, investigate and prevent fraud, abuse or security incidents;</li>
              <li className="tc-policy-page__list-item">Comply with applicable laws and legal obligations; and</li>
              <li className="tc-policy-page__list-item">Protect the rights, property and safety of TechCrest, our users and others.</li>
            </ul>
            <div className="tc-policy-page__highlight-box">
              We do not sell personal information to third parties for their own direct marketing purposes.
            </div>
          </section>

          {/* Section 3 */}
          <section className="tc-policy-page__section">
            <h2 className="tc-policy-page__section-title">
              <span className="tc-policy-page__section-num">3</span>
              Cookies and Similar Technologies
            </h2>
            <p>
              TechCrest uses cookies and similar technologies to operate the website, remember preferences, understand website usage and improve the user experience.
            </p>
            <p>
              Cookies may include essential cookies, analytics cookies and preference-related cookies. Some third-party services may also use cookies or similar technologies in connection with advertising, analytics, embedded content or other website functionality.
            </p>
            <p>
              You can manage or disable cookies through your browser settings. Certain features of the website may not function properly if essential cookies are disabled.
            </p>
            <p className="text-sm">
              For more information, please see our <Link href="/cookies" className="tc-policy-page__contact-link">Cookie Policy</Link>.
            </p>
          </section>

          {/* Section 4 */}
          <section className="tc-policy-page__section">
            <h2 className="tc-policy-page__section-title">
              <span className="tc-policy-page__section-num">4</span>
              Analytics
            </h2>
            <p>
              We may use privacy-conscious analytics tools to understand traffic, readership patterns and engagement with our content.
            </p>
            <p>
              Analytics information may be aggregated or otherwise processed in a manner designed to help us understand overall website performance rather than identify individual readers.
            </p>
          </section>

          {/* Section 5 */}
          <section className="tc-policy-page__section">
            <h2 className="tc-policy-page__section-title">
              <span className="tc-policy-page__section-num">5</span>
              Third-Party Services and Links
            </h2>
            <p>
              TechCrest may link to third-party websites, applications, products or services. We are not responsible for the privacy practices, security or content of third-party services.
            </p>
            <p>
              We encourage users to review the privacy policies of third-party websites before providing them with personal information.
            </p>
          </section>

          {/* Section 6 */}
          <section className="tc-policy-page__section">
            <h2 className="tc-policy-page__section-title">
              <span className="tc-policy-page__section-num">6</span>
              Newsletter Communications
            </h2>
            <p>
              If you subscribe to a TechCrest newsletter, we may use your email address to deliver the newsletter and related communications you have requested.
            </p>
            <p>
              You may unsubscribe at any time using the unsubscribe link included in our communications.
            </p>
          </section>

          {/* Section 7 */}
          <section className="tc-policy-page__section">
            <h2 className="tc-policy-page__section-title">
              <span className="tc-policy-page__section-num">7</span>
              Data Security
            </h2>
            <p>
              We take reasonable administrative, technical and organizational measures to protect personal information against unauthorized access, loss, misuse, alteration or disclosure.
            </p>
            <p>
              However, no method of transmission or electronic storage is completely secure, and we cannot guarantee absolute security.
            </p>
          </section>

          {/* Section 8 */}
          <section className="tc-policy-page__section">
            <h2 className="tc-policy-page__section-title">
              <span className="tc-policy-page__section-num">8</span>
              Data Retention
            </h2>
            <p>
              We retain personal information only for as long as reasonably necessary for the purposes described in this policy, including providing services, maintaining business records, resolving disputes, enforcing agreements and meeting legal obligations.
            </p>
            <p>
              Retention periods may vary depending on the nature of the information and the purpose for which it was collected.
            </p>
          </section>

          {/* Section 9 */}
          <section className="tc-policy-page__section">
            <h2 className="tc-policy-page__section-title">
              <span className="tc-policy-page__section-num">9</span>
              International Users
            </h2>
            <p>
              TechCrest may be accessed by readers around the world. Depending on where you live, your personal information may be processed or stored in countries other than your country of residence.
            </p>
            <p>
              Where required by applicable law, we will take appropriate measures when transferring personal information across borders.
            </p>
          </section>

          {/* Section 10 */}
          <section className="tc-policy-page__section">
            <h2 className="tc-policy-page__section-title">
              <span className="tc-policy-page__section-num">10</span>
              Your Privacy Rights
            </h2>
            <p>Depending on your jurisdiction, you may have rights relating to your personal information, including the right to:</p>
            <ul className="tc-policy-page__list">
              <li className="tc-policy-page__list-item">Request access to information we hold about you;</li>
              <li className="tc-policy-page__list-item">Request correction of inaccurate information;</li>
              <li className="tc-policy-page__list-item">Request deletion of certain information;</li>
              <li className="tc-policy-page__list-item">Object to or restrict certain processing;</li>
              <li className="tc-policy-page__list-item">Withdraw consent where processing is based on consent;</li>
              <li className="tc-policy-page__list-item">Request portability of certain information; and</li>
              <li className="tc-policy-page__list-item">Lodge a complaint with the relevant data protection authority.</li>
            </ul>
            <p className="tc-text-muted text-sm">Requests may be subject to applicable legal limitations and verification requirements.</p>
          </section>

          {/* Section 11 */}
          <section className="tc-policy-page__section">
            <h2 className="tc-policy-page__section-title">
              <span className="tc-policy-page__section-num">11</span>
              Children’s Privacy
            </h2>
            <p>
              TechCrest is intended for a general audience and is not directed toward children under the age required by applicable law to provide consent for online services.
            </p>
            <p>
              We do not knowingly collect personal information from children in violation of applicable law.
            </p>
          </section>

          {/* Section 12 */}
          <section className="tc-policy-page__section">
            <h2 className="tc-policy-page__section-title">
              <span className="tc-policy-page__section-num">12</span>
              Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our services, technology, legal requirements or business practices.
            </p>
            <p>
              When we make material changes, we will update the “Last Updated” date and, where appropriate, provide additional notice.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
