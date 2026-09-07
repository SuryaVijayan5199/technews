import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy — TechCrest",
  description: "Learn how TechCrest collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="tc-page-section">
      <div className="container tc-page-content">
        <div>
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-4 tc-breadcrumb">
            <Link href="/" className="tc-breadcrumb__link">Home</Link>
            <ChevronRight className="tc-icon-xs" />
            <span className="tc-text-muted">Privacy Policy</span>
          </nav>
          <h1 className="tc-page-title" style={{ fontFamily: "var(--font-outfit)" }}>
            Privacy Policy
          </h1>
          <p className="tc-text-meta">Last Updated: July 30, 2026</p>
        </div>

        <div className="tc-prose">
          <p>At TechCrest, we prioritize the privacy and security of our readers. This Privacy Policy explains how we handle your personal data when you visit our website, subscribe to our newsletter, or participate in community discussions.</p>
          <h2 className="tc-prose__heading">1. Information We Collect</h2>
          <p>We collect information you provide directly to us, such as your email address when subscribing to our daily newsletter or creating an account via OAuth (Google/GitHub).</p>
          <h2 className="tc-prose__heading">2. How We Use Information</h2>
          <p>We use collected data to deliver requested newsletters, personalize content recommendations, moderate community comments, and improve site performance.</p>
          <h2 className="tc-prose__heading">3. Cookies & Tracking</h2>
          <p>We use standard session cookies to keep you signed in and aggregate privacy-preserving analytics to understand article reader engagement.</p>
        </div>
      </div>
    </div>
  );
}
