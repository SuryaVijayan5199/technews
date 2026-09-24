import type { Metadata } from "next";
import Link from "next/link";
import { Mail, ChevronRight } from "lucide-react";
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
                Official Communication
              </h2>
              <p className="text-sm text-muted-foreground mt-2 mb-6">
                Have a tip, press release, editorial question, or partnership inquiry? Reach out directly to our central newsdesk.
              </p>

              <div className="tc-contact-desks-list">
                <div className="tc-contact-desk-item">
                  <div className="tc-contact-desk-icon tc-contact-desk-icon--blue">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="tc-contact-desk-label">
                      Editorial & Newsdesk
                    </p>
                    <a href="mailto:editor@techcrest.news" className="tc-contact-desk-link text-base font-semibold">
                      editor@techcrest.news
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-[var(--color-surface-border)] text-xs text-muted-foreground leading-relaxed">
                <p className="m-0">
                  All correspondence is reviewed directly by our editorial staff. For confidential tips or leaks, please mention &quot;Confidential Tip&quot; in the email subject.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
