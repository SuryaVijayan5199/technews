import type { Metadata } from "next";
import Link from "next/link";
import {
  Mail,
  Building2,
  Globe,
  Megaphone,
  ExternalLink,
} from "lucide-react";
import { TechCrestIcon } from "@/components/shared/techcrest-icon";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact Us — TechCrest Newsroom Desk",
  description:
    "Get in touch with the TechCrest team. Send news tips, press releases, feedback, corrections or partnership inquiries, and we'll get back to you.",
};

const COMPANY_NAV = [
  { href: "/about", label: "About", icon: Globe },
  { href: "/contact", label: "Contact Desk", icon: Mail },
  { href: "/advertise", label: "Advertise & Media", icon: Megaphone },
  {
    href: "https://rawpitch.org/",
    label: "Raw Pitch",
    icon: ExternalLink,
    isExternal: true,
  },
];

export default function ContactPage() {
  return (
    <div className="tc-contact-shell">
      <div className="tc-subpage-container">
        {/* Header Section */}
        <header className="tc-subpage-header">
          <div className="tc-subpage-badge">
            <TechCrestIcon size={16} color="#2D7FF9" />
            <span>TechCrest Editorial & Desk</span>
          </div>

          <h1 className="tc-subpage-title">Get in Touch</h1>
          <p className="tc-subpage-subtitle">
            Have a news tip, confidential leak, product review request, or
            partnership inquiry? We&apos;d love to hear from you.
          </p>

          {/* Mobile Horizontal Sub-Navigation */}
          <div className="tc-hub-mobile-nav">
            <div className="tc-hub-mobile-track">
              {COMPANY_NAV.map((item) => {
                const isActive = item.href === "/contact";
                const Icon = item.icon;
                if (item.isExternal) {
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tc-hub-mobile-pill"
                    >
                      <Icon className="tc-hub-mobile-pill__icon" />
                      <span>{item.label}</span>
                    </a>
                  );
                }
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`tc-hub-mobile-pill ${
                      isActive ? "tc-hub-mobile-pill--active" : ""
                    }`}
                  >
                    <Icon className="tc-hub-mobile-pill__icon" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </header>

        {/* Main Grid: Form + Contacts */}
        <div className="tc-contact-grid">
          {/* Interactive Form */}
          <div className="tc-contact-form-column">
            <ContactForm />
          </div>

          {/* Contact Information Sidebar */}
          <aside className="tc-contact-sidebar-column">
            <div className="tc-contact-sidebar-card">
              <div>
                <h2 className="tc-contact-desks-title">
                  Official Communication
                </h2>
                <p className="tc-contact-desks-desc">
                  Have a breaking tip, press release, editorial question, or
                  partnership inquiry? Reach out directly to our central
                  newsdesk and newsroom leadership.
                </p>
              </div>

              <div className="tc-contact-desk-list">
                {/* Desk 1: Editorial */}
                <div className="tc-contact-desk-item">
                  <div className="tc-contact-desk-icon tc-contact-desk-icon--blue">
                    <Mail className="tc-subpage-meta__icon" />
                  </div>
                  <div>
                    <p className="tc-contact-desk-label">Editorial & Newsdesk</p>
                    <a
                      href="mailto:editor@techcrest.news"
                      className="tc-contact-desk-link"
                    >
                      editor@techcrest.news
                    </a>
                  </div>
                </div>

                {/* Desk 2: USA Address */}
                <div className="tc-contact-desk-item">
                  <div className="tc-contact-desk-icon tc-contact-desk-icon--purple">
                    <Building2 className="tc-subpage-meta__icon" />
                  </div>
                  <div>
                    <p className="tc-contact-desk-label">
                      USA
                    </p>
                    <address className="tc-contact-address">
                      <strong>TechCrest</strong>
                      <br />
                      8614 Compatible Way
                      <br />
                      Charlotte
                      <br />
                      North Carolina
                      <br />
                      28262
                    </address>
                  </div>
                </div>

                {/* Desk 4: India Address */}
                <div className="tc-contact-desk-item">
                  <div className="tc-contact-desk-icon tc-contact-desk-icon--purple">
                    <Building2 className="tc-subpage-meta__icon" />
                  </div>
                  <div>
                    <p className="tc-contact-desk-label">
                      India
                    </p>
                    <address className="tc-contact-address">
                      <strong>TechCrest</strong>
                      <br />
                      4th Floor, VM Grandeur
                      <br />
                      Bangalore 560113
                      <br />
                      India
                    </address>
                  </div>
                </div>
              </div>

              <div className="tc-contact-disclaimer">
                All correspondence is reviewed directly by our editorial staff.
                For confidential tips or leaks, please mention &quot;Confidential
                Tip&quot; in the email subject line.
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
