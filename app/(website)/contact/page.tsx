import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, Clock, ChevronRight, ShieldCheck, Newspaper, Award } from "lucide-react";
import { TechCrestIcon } from "@/components/shared/techcrest-icon";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact Us — TechCrest",
  description: "Get in touch with the TechCrest editorial team, send press releases, report news tips, or request advertising partnerships.",
};

export default function ContactPage() {
  return (
    <div className="tc-contact-page">
      <div className="tc-contact-container">
        {/* Header Section */}
        <div className="tc-contact-header">
          <nav aria-label="Breadcrumb" className="tc-contact-breadcrumb">
            <Link href="/" className="tc-contact-breadcrumb__link">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" style={{ color: "hsl(var(--color-text-muted))" }} />
            <span style={{ fontWeight: 600, color: "hsl(var(--color-text-primary))" }}>Contact</span>
          </nav>

          <div className="tc-contact-eyebrow">
            <TechCrestIcon size={26} color="#2D7FF9" />
            <span className="tc-contact-eyebrow__tag">
              TECHCREST EDITORIAL & DESK
            </span>
          </div>

          <h1 className="tc-contact-title">
            Get in Touch
          </h1>
          <p className="tc-contact-subtitle">
            Have a news tip, confidential leak, product review request, or partnership inquiry? We&apos;d love to hear from you.
          </p>
        </div>

        {/* Response Time SLA Features Bar */}
        <div className="tc-contact-features">
          <div className="tc-contact-feature-card">
            <div className="tc-contact-feature-icon tc-contact-feature-icon--blue">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="tc-contact-feature-label">Newsdesk Response</p>
              <p className="tc-contact-feature-value">Under 4 Hours</p>
            </div>
          </div>

          <div className="tc-contact-feature-card">
            <div className="tc-contact-feature-icon tc-contact-feature-icon--purple">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="tc-contact-feature-label">Anonymous Tips</p>
              <p className="tc-contact-feature-value">End-to-End Encrypted</p>
            </div>
          </div>

          <div className="tc-contact-feature-card">
            <div className="tc-contact-feature-icon tc-contact-feature-icon--emerald">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="tc-contact-feature-label">Editorial Ethics</p>
              <p className="tc-contact-feature-value">100% Independent</p>
            </div>
          </div>
        </div>

        {/* Main Grid: Form + Contacts */}
        <div className="tc-contact-grid">
          {/* Interactive Form */}
          <div>
            <ContactForm />
          </div>

          {/* Contact Information Sidebar */}
          <div>
            <div className="tc-contact-card">
              <h2 className="tc-contact-desks-title">
                Direct Contact Desks
              </h2>

              <div className="tc-contact-desks-list">
                <div className="tc-contact-desk-item">
                  <div className="tc-contact-desk-icon tc-contact-desk-icon--blue">
                    <Newspaper className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="tc-contact-desk-label">
                      Breaking News & Leaks
                    </p>
                    <a href="mailto:tips@techcrest.news" className="tc-contact-desk-link">
                      tips@techcrest.news
                    </a>
                  </div>
                </div>

                <div className="tc-contact-desk-item">
                  <div className="tc-contact-desk-icon tc-contact-desk-icon--purple">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="tc-contact-desk-label">
                      Press & PR Inquiries
                    </p>
                    <a href="mailto:press@techcrest.news" className="tc-contact-desk-link">
                      press@techcrest.news
                    </a>
                  </div>
                </div>

                <div className="tc-contact-desk-item">
                  <div className="tc-contact-desk-icon tc-contact-desk-icon--emerald">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="tc-contact-desk-label">
                      Advertising & Sponsorship
                    </p>
                    <a href="mailto:ads@techcrest.news" className="tc-contact-desk-link">
                      ads@techcrest.news
                    </a>
                  </div>
                </div>

                <div className="tc-contact-desk-item tc-contact-divider">
                  <div className="tc-contact-desk-icon tc-contact-desk-icon--orange">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="tc-contact-desk-label">
                      Editorial Headquarters
                    </p>
                    <p className="tc-contact-desk-text">
                      500 Technology Square, 4th Floor<br />
                      Cambridge, MA 02139, USA
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
