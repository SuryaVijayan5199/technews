import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy — TechCrest",
  description: "Learn how TechCrest collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="py-10">
      <div className="container max-w-3xl space-y-8">
        <div>
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mb-4">
            <Link href="/" className="hover:text-[var(--color-text-secondary)]">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[var(--color-text-secondary)]">Privacy Policy</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] mb-2" style={{ fontFamily: "var(--font-outfit)" }}>
            Privacy Policy
          </h1>
          <p className="text-xs text-[var(--color-text-muted)]">Last Updated: July 30, 2026</p>
        </div>

        <div className="prose text-sm leading-relaxed space-y-6">
          <p>At TechCrest, we prioritize the privacy and security of our readers. This Privacy Policy explains how we handle your personal data when you visit our website, subscribe to our newsletter, or participate in community discussions.</p>
          <h2 className="text-lg font-bold text-[var(--color-text-primary)]">1. Information We Collect</h2>
          <p>We collect information you provide directly to us, such as your email address when subscribing to our daily newsletter or creating an account via OAuth (Google/GitHub).</p>
          <h2 className="text-lg font-bold text-[var(--color-text-primary)]">2. How We Use Information</h2>
          <p>We use collected data to deliver requested newsletters, personalize content recommendations, moderate community comments, and improve site performance.</p>
          <h2 className="text-lg font-bold text-[var(--color-text-primary)]">3. Cookies & Tracking</h2>
          <p>We use standard session cookies to keep you signed in and aggregate privacy-preserving analytics to understand article reader engagement.</p>
        </div>
      </div>
    </div>
  );
}
