import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, Phone, Send, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us — TechCrest",
  description: "Get in touch with the TechCrest editorial team, send press inquiries, or report news tips.",
};

export default function ContactPage() {
  return (
    <div className="py-10">
      <div className="container max-w-4xl space-y-10">
        <div>
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mb-4">
            <Link href="/" className="hover:text-[var(--color-text-secondary)]">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[var(--color-text-secondary)]">Contact</span>
          </nav>
          <h1 className="text-3xl sm:text-5xl font-bold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
            Get in Touch
          </h1>
          <p className="text-[var(--color-text-secondary)] text-base sm:text-lg mt-2">
            Have a news tip, product review request, or editorial inquiry? We&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Contact Form */}
          <div className="md:col-span-7 card p-6 space-y-4">
            <h2 className="text-lg font-bold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
              Send Us a Message
            </h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="contact-name" className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">Your Name</label>
                <input id="contact-name" type="text" placeholder="John Doe" className="input text-sm" required />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">Email Address</label>
                <input id="contact-email" type="email" placeholder="john@example.com" className="input text-sm" required />
              </div>
              <div>
                <label htmlFor="contact-subject" className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">Subject</label>
                <select id="contact-subject" className="input text-sm">
                  <option value="tip">News Tip / Leak</option>
                  <option value="review">Product Review Request</option>
                  <option value="press">Press & PR Inquiry</option>
                  <option value="advertising">Advertising & Sponsorship</option>
                  <option value="other">General Feedback</option>
                </select>
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">Message</label>
                <textarea id="contact-message" rows={4} placeholder="Type your message..." className="input text-sm resize-none" required />
              </div>
              <button type="submit" className="btn btn-primary w-full justify-center text-sm py-2.5">
                <Send className="w-4 h-4" /> Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-5 space-y-6">
            <div className="card p-6 space-y-4">
              <h2 className="text-lg font-bold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
                Direct Contacts
              </h2>
              <div className="space-y-3 text-sm text-[var(--color-text-secondary)]">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[var(--color-brand-400)] mt-0.5" />
                  <div>
                    <p className="font-semibold text-[var(--color-text-primary)] text-xs uppercase tracking-wider">News Desk</p>
                    <p className="text-xs text-[var(--color-text-muted)]">tips@techcrest.io</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[var(--color-brand-400)] mt-0.5" />
                  <div>
                    <p className="font-semibold text-[var(--color-text-primary)] text-xs uppercase tracking-wider">Press & PR</p>
                    <p className="text-xs text-[var(--color-text-muted)]">press@techcrest.io</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[var(--color-brand-400)] mt-0.5" />
                  <div>
                    <p className="font-semibold text-[var(--color-text-primary)] text-xs uppercase tracking-wider">Headquarters</p>
                    <p className="text-xs text-[var(--color-text-muted)]">500 Technology Square, Cambridge, MA 02139</p>
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
