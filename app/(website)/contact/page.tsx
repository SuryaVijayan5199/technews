import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, Phone, Send, ChevronRight } from "lucide-react";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Contact Us — TechCrest",
  description: "Get in touch with the TechCrest editorial team, send press inquiries, or report news tips.",
};

export default function ContactPage() {
  return (
    <div className="tc-page-section">
      <div className="container tc-contact-inner">
        <div>
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-4 tc-breadcrumb">
            <Link href="/" className="tc-breadcrumb__link">Home</Link>
            <ChevronRight className="tc-icon-xs" />
            <span className="tc-text-muted">Contact</span>
          </nav>
          <h1 className="tc-page-title" style={{ fontFamily: "var(--font-outfit)" }}>
            Get in Touch
          </h1>
          <p className="tc-page-subtitle">
            Have a news tip, product review request, or editorial inquiry? We&apos;d love to hear from you.
          </p>
        </div>

        <div className="tc-contact-grid">
          {/* Contact Form */}
          <div className="card p-6 tc-contact-form-col">
            <h2 className="tc-form-title" style={{ fontFamily: "var(--font-outfit)" }}>
              Send Us a Message
            </h2>
            <form className="tc-form-fields">
              <div>
                <label htmlFor="contact-name" className="tc-form-label">Your Name</label>
                <input id="contact-name" type="text" placeholder="John Doe" className="input text-sm" required />
              </div>
              <div>
                <label htmlFor="contact-email" className="tc-form-label">Email Address</label>
                <input id="contact-email" type="email" placeholder="john@example.com" className="input text-sm" required />
              </div>
              <div>
                <label htmlFor="contact-subject" className="tc-form-label">Subject</label>
                <select id="contact-subject" className="input text-sm">
                  <option value="tip">News Tip / Leak</option>
                  <option value="review">Product Review Request</option>
                  <option value="press">Press & PR Inquiry</option>
                  <option value="advertising">Advertising & Sponsorship</option>
                  <option value="other">General Feedback</option>
                </select>
              </div>
              <div>
                <label htmlFor="contact-message" className="tc-form-label">Message</label>
                <textarea id="contact-message" rows={4} placeholder="Type your message..." className="input text-sm resize-none" required />
              </div>
              <button type="submit" className="btn btn-primary w-full justify-center">
                <Send className="tc-btn-icon" /> Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="tc-contact-sidebar-col">
            <div className="card p-6">
              <h2 className="tc-form-title" style={{ fontFamily: "var(--font-outfit)" }}>
                Direct Contacts
              </h2>
              <div className="tc-contact-items">
                <div className="flex items-start gap-3">
                  <Mail className="tc-icon-brand" />
                  <div>
                    <p className="tc-contact-label">News Desk</p>
                    <p className="tc-text-meta">tips@techcrest.io</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="tc-icon-brand" />
                  <div>
                    <p className="tc-contact-label">Press & PR</p>
                    <p className="tc-text-meta">press@techcrest.io</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="tc-icon-brand" />
                  <div>
                    <p className="tc-contact-label">Headquarters</p>
                    <p className="tc-text-meta">500 Technology Square, Cambridge, MA 02139</p>
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
