import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service — TechCrest",
  description: "Terms and conditions governing the use of the TechCrest digital publishing platform.",
};

export default function TermsPage() {
  return (
    <div className="py-10">
      <div className="container max-w-3xl space-y-8">
        <div>
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mb-4">
            <Link href="/" className="hover:text-[var(--color-text-secondary)]">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[var(--color-text-secondary)]">Terms of Service</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] mb-2" style={{ fontFamily: "var(--font-outfit)" }}>
            Terms of Service
          </h1>
          <p className="text-xs text-[var(--color-text-muted)]">Last Updated: July 30, 2026</p>
        </div>

        <div className="prose text-sm leading-relaxed space-y-6">
          <p>By accessing or using TechCrest, you agree to be bound by these Terms of Service. Please read them carefully.</p>
          <h2 className="text-lg font-bold text-[var(--color-text-primary)]">1. Intellectual Property</h2>
          <p>All articles, graphics, logos, video content, and code on TechCrest are protected by international copyright laws. Reproduction without written consent is strictly prohibited.</p>
          <h2 className="text-lg font-bold text-[var(--color-text-primary)]">2. Community Guidelines</h2>
          <p>We welcome constructive dialogue in our comment sections. Harassment, spam, self-promotion, or hate speech will result in immediate suspension.</p>
        </div>
      </div>
    </div>
  );
}
