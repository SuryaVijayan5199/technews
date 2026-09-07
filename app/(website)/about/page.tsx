import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Zap, ShieldCheck, Award, Users, ChevronRight } from "lucide-react";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "About Us — TechCrest",
  description: "Learn about TechCrest's mission, editorial standards, and the expert team behind our independent tech journalism.",
};

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Editorial Independence",
    description: "Our reviews and editorial opinions are never paid for or influenced by advertisers or tech manufacturers.",
  },
  {
    icon: Award,
    title: "Rigorous Benchmarking",
    description: "We perform standardized hardware tests, battery drain stress tests, and real-world software evaluations.",
  },
  {
    icon: Users,
    title: "Expert Journalism",
    description: "Our team consists of veteran technology journalists, computer scientists, and hardware engineers.",
  },
];

export default function AboutPage() {
  return (
    <div className="py-10">
      <div className="container max-w-4xl space-y-12">
        {/* Header */}
        <div>
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mb-4">
            <Link href="/" className="hover:text-[var(--color-text-secondary)]">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[var(--color-text-secondary)]">About Us</span>
          </nav>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-brand-500)] text-white flex items-center justify-center">
              <Zap className="w-5 h-5" fill="white" />
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
              About TechCrest
            </h1>
          </div>
          <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed mt-4">
            TechCrest is a premier digital publication dedicated to providing clear, authoritative, and unbiased technology journalism. From AI breakthroughs to consumer hardware reviews, we help millions of readers make sense of the digital revolution.
          </p>
        </div>

        {/* Core Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {VALUES.map((val) => {
            const Icon = val.icon;
            return (
              <div key={val.title} className="card p-6 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-brand-500)]/15 border border-[var(--color-brand-500)]/30 text-[var(--color-brand-400)] flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
                  {val.title}
                </h2>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{val.description}</p>
              </div>
            );
          })}
        </div>

        {/* Global Impact Stats */}
        <div className="card p-8 bg-gradient-to-r from-[var(--color-brand-900)]/40 via-[var(--color-surface-2)] to-[var(--color-surface-1)]">
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6 text-center" style={{ fontFamily: "var(--font-outfit)" }}>
            TechCrest at a Glance
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-[var(--color-brand-400)]">15M+</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">Monthly Readers</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-[var(--color-brand-400)]">500+</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">Products Tested Yearly</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-[var(--color-brand-400)]">250K+</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">Newsletter Subscribers</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-[var(--color-brand-400)]">100%</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">Independent Testing</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
