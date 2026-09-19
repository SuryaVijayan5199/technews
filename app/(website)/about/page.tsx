import type { Metadata } from "next";
import Link from "next/link";
import {
  ChevronRight,
  Zap,
  ShieldCheck,
  Award,
  Users,
  Brain,
  Smartphone,
  Lock,
  Bitcoin,
  BookOpen,
  Mail,
  MessageSquare,
  Handshake,
  TrendingUp,
  Eye,
  Target,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About TechCrest News — Our Mission, Team & Editorial Standards",
  description:
    "Learn about TechCrest News — your trusted source for accurate, timely technology journalism. Discover our mission, editorial values, coverage areas, and the expert team behind our reporting.",
};

const STATS = [
  { value: "15M+", label: "Monthly Readers", icon: Eye },
  { value: "500+", label: "Products Tested Yearly", icon: Award },
  { value: "250K+", label: "Newsletter Subscribers", icon: Mail },
  { value: "100%", label: "Independent Editorial", icon: ShieldCheck },
];

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Editorial Independence",
    description:
      "Our reporting is never paid for or influenced by advertisers or manufacturers. What you read is what our editors genuinely believe.",
    color: "#10b981",
  },
  {
    icon: Award,
    title: "Accuracy Over Speed",
    description:
      "We prioritise verified facts and primary sources. We correct our work transparently when needed — no silent edits, no buried corrections.",
    color: "#2D7FF9",
  },
  {
    icon: Users,
    title: "Expert Journalism",
    description:
      "Our team of veteran journalists, analysts and engineers brings deep subject-matter expertise and a passion for clear, contextual storytelling.",
    color: "#a855f7",
  },
];

const COVERAGE = [
  {
    icon: Brain,
    title: "AI & Machine Learning",
    description:
      "Breakthroughs, tools, and debates defining the AI era — from foundation models to autonomous agents and real-world deployment.",
    color: "#a855f7",
    tag: "AI",
    href: "/ai",
  },
  {
    icon: Smartphone,
    title: "Gadgets & Product Reviews",
    description:
      "Hands-on, unbiased reviews of the latest smartphones, laptops, wearables and consumer tech backed by real-world testing.",
    color: "#0ea5e9",
    tag: "REVIEWS",
    href: "/phone",
  },
  {
    icon: TrendingUp,
    title: "Startups & Innovation",
    description:
      "Funding rounds, emerging companies, and the ideas disrupting established industries — from seed stage to IPO.",
    color: "#f59e0b",
    tag: "STARTUPS",
    href: "/ai",
  },
  {
    icon: Lock,
    title: "Cybersecurity & Privacy",
    description:
      "The threats, breaches, and best practices that keep you and your data safe in an increasingly connected world.",
    color: "#ef4444",
    tag: "SECURITY",
    href: "/security",
  },
  {
    icon: Bitcoin,
    title: "Fintech, Crypto & Blockchain",
    description:
      "Clear-eyed coverage of digital finance, tokenisation, zero-knowledge proofs, and the technologies reshaping money.",
    color: "#f97316",
    tag: "FINTECH",
    href: "/crypto",
  },
  {
    icon: BookOpen,
    title: "How-To Guides & Explainers",
    description:
      "Practical, jargon-free content that helps you get more from your devices, apps, and digital life — no PhD required.",
    color: "#14b8a6",
    tag: "GUIDES",
    href: "/ai",
  },
];

const CONTACT_OPTIONS = [
  {
    icon: MessageSquare,
    title: "Story Tips & Feedback",
    description: "Share tips, corrections, or thoughts on our coverage.",
    action: "Send a Message",
    href: "/contact",
    color: "#2D7FF9",
  },
  {
    icon: Handshake,
    title: "Partnerships & Advertising",
    description: "Explore editorial partnerships and sponsorship opportunities.",
    action: "Explore Opportunities",
    href: "/advertise",
    color: "#a855f7",
  },
  {
    icon: Users,
    title: "Join Our Team",
    description: "We're always looking for talented journalists and analysts.",
    action: "View Open Roles",
    href: "/careers",
    color: "#10b981",
  },
];

const PRINCIPLES = [
  { title: "NEWS", desc: "Fast, accurate coverage of important developments.", icon: Target },
  { title: "INSIGHTS", desc: "Context, analysis and meaningful interpretation.", icon: Brain },
  { title: "IMPACT", desc: "The real-world consequences behind technology.", icon: TrendingUp },
];

export default function AboutPage() {
  return (
    <div className="tc-about">
      {/* ── HERO ── */}
      <section className="tc-about__hero">
        <div className="tc-about__hero-bg" aria-hidden="true" />
        <div className="tc-about__wrap">
          <nav className="tc-about__breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <ChevronRight className="tc-about__breadcrumb-sep" />
            <span>About Us</span>
          </nav>

          <div className="tc-about__hero-badge">
            <Zap className="tc-about__hero-badge-icon" />
            <span>TechCrest News</span>
          </div>

          <h1 className="tc-about__hero-title">
            Technology Journalism You Can{" "}
            <span className="tc-about__accent">Trust</span>
          </h1>

          <p className="tc-about__hero-desc">
            Welcome to TechCrest News — your trusted source for the latest
            technology news, expert reviews, and sharp analysis of the trends
            shaping our digital world. In an industry that moves at breakneck
            speed, we cut through the noise to bring you accurate, timely, and
            genuinely useful reporting — whether you&apos;re a developer, a
            founder, an investor, or simply someone who loves staying ahead of
            the curve.
          </p>

          <div className="tc-about__hero-ctas">
            <Link href="/search" className="tc-about__cta-primary">
              Explore Our Coverage
            </Link>
            <Link href="/contact" className="tc-about__cta-secondary">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="tc-about__stats-band">
        <div className="tc-about__wrap">
          <div className="tc-about__stats-grid">
            {STATS.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="tc-about__stat">
                  <div className="tc-about__stat-icon">
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="tc-about__stat-value">{s.value}</p>
                  <p className="tc-about__stat-label">{s.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── MISSION ── */}
      <section className="tc-about__section">
        <div className="tc-about__wrap tc-about__mission-grid">
          <div className="tc-about__mission-left">
            <span className="tc-about__eyebrow">Our Mission</span>
            <h2 className="tc-about__section-title">
              Making technology{" "}
              <span className="tc-about__accent">understandable</span> for
              everyone
            </h2>
            <p className="tc-about__body-text">
              At TechCrest News, our mission is simple: to make technology
              understandable, accessible, and relevant to everyone. We believe
              great tech journalism does more than report what happened — it
              explains <em>why it matters</em>.
            </p>
            <p className="tc-about__body-text">
              From breaking headlines to deep-dive explainers, we&apos;re
              committed to helping our readers make smarter decisions in a
              fast-changing technological landscape.
            </p>
            <div className="tc-about__principles">
              {PRINCIPLES.map((p) => {
                const Icon = p.icon;
                return (
                  <div key={p.title} className="tc-about__principle">
                    <div className="tc-about__principle-icon">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <b className="tc-about__principle-title">{p.title}</b>
                      <span className="tc-about__principle-desc">{p.desc}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="tc-about__mission-right">
            <div className="tc-about__mission-card">
              <blockquote className="tc-about__quote">
                &ldquo;The strongest technology stories connect the product
                launch, the business model and the real-world human impact.&rdquo;
              </blockquote>
              <cite className="tc-about__quote-cite">
                — TechCrest Editorial Principle
              </cite>
              <div className="tc-about__mission-divider" />
              <p className="tc-about__mission-card-body">
                Every article published on TechCrest is crafted to inform
                rather than mislead. No clickbait, no hype — just journalism
                you can rely on.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── COVERAGE ── */}
      <section className="tc-about__section tc-about__section--alt">
        <div className="tc-about__wrap">
          <div className="tc-about__section-head tc-about__section-head--center">
            <span className="tc-about__eyebrow">What We Cover</span>
            <h2 className="tc-about__section-title">
              Technology touches every part of{" "}
              <span className="tc-about__accent">modern life</span>
            </h2>
            <p className="tc-about__section-sub">
              Our editorial team reports and analyses across the areas that
              matter most — from the cutting edge to the everyday.
            </p>
          </div>
          <div className="tc-about__coverage-grid">
            {COVERAGE.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="tc-about__coverage-card"
                  style={{ "--card-accent": item.color } as React.CSSProperties}
                >
                  <div className="tc-about__coverage-card-top">
                    <div
                      className="tc-about__coverage-icon"
                      style={{ background: `${item.color}18`, color: item.color }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="tc-about__coverage-tag">{item.tag}</span>
                  </div>
                  <h3 className="tc-about__coverage-title">{item.title}</h3>
                  <p className="tc-about__coverage-desc">{item.description}</p>
                  <span className="tc-about__coverage-link">
                    Explore coverage →
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TRUST / WHY READERS TRUST US ── */}
      <section className="tc-about__section">
        <div className="tc-about__wrap">
          <div className="tc-about__section-head">
            <span className="tc-about__eyebrow">Why Readers Trust Us</span>
            <h2 className="tc-about__section-title">
              Credibility is the{" "}
              <span className="tc-about__accent">foundation</span> of everything
              we publish
            </h2>
          </div>
          <div className="tc-about__values-grid">
            {VALUES.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="tc-about__value-card">
                  <div
                    className="tc-about__value-icon"
                    style={{ background: `${v.color}18`, color: v.color }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="tc-about__value-title">{v.title}</h3>
                  <p className="tc-about__value-desc">{v.description}</p>
                  <div
                    className="tc-about__value-bar"
                    style={{ background: v.color }}
                  />
                </div>
              );
            })}
          </div>
          <div className="tc-about__trust-detail">
            <p>
              Our reporting is grounded in verified facts, primary sources, and
              rigorous editorial standards. We clearly separate news from
              opinion, and correct our work transparently when needed.
            </p>
          </div>
        </div>
      </section>

      {/* ── OUR TEAM ── */}
      <section className="tc-about__section tc-about__section--alt">
        <div className="tc-about__wrap">
          <div className="tc-about__section-head tc-about__section-head--center">
            <span className="tc-about__eyebrow">Our Team</span>
            <h2 className="tc-about__section-title">
              Journalists who{" "}
              <span className="tc-about__accent">live and breathe</span>{" "}
              technology
            </h2>
            <p className="tc-about__section-sub">
              TechCrest News is powered by a team of experienced journalists,
              writers, and industry analysts. Our contributors combine deep
              subject-matter expertise with a passion for storytelling —
              ensuring complex topics are always explained with clarity and
              context.
            </p>
          </div>
          <div className="tc-about__team-highlights">
            <div className="tc-about__team-highlight">
              <div className="tc-about__team-num">12+</div>
              <div className="tc-about__team-num-label">Full-time journalists</div>
            </div>
            <div className="tc-about__team-highlight">
              <div className="tc-about__team-num">30+</div>
              <div className="tc-about__team-num-label">Contributing experts</div>
            </div>
            <div className="tc-about__team-highlight">
              <div className="tc-about__team-num">8</div>
              <div className="tc-about__team-num-label">Topic verticals</div>
            </div>
            <div className="tc-about__team-highlight">
              <div className="tc-about__team-num">6+</div>
              <div className="tc-about__team-num-label">Years of publishing</div>
            </div>
          </div>
          <div className="tc-about__team-cta-row">
            <Link href="/authors" className="tc-about__cta-outline">
              Meet Our Authors →
            </Link>
          </div>
        </div>
      </section>

      {/* ── GET IN TOUCH ── */}
      <section className="tc-about__section">
        <div className="tc-about__wrap">
          <div className="tc-about__section-head tc-about__section-head--center">
            <span className="tc-about__eyebrow">Get in Touch</span>
            <h2 className="tc-about__section-title">
              We&apos;d love to{" "}
              <span className="tc-about__accent">hear from you</span>
            </h2>
            <p className="tc-about__section-sub">
              We value our community of readers and welcome your feedback, story
              tips, and questions. Whether you&apos;d like to pitch a story,
              explore partnership opportunities, or simply share your thoughts —
              reach out.
            </p>
          </div>
          <div className="tc-about__contact-grid">
            {CONTACT_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              return (
                <Link
                  key={opt.title}
                  href={opt.href}
                  className="tc-about__contact-card"
                  style={{ "--card-accent": opt.color } as React.CSSProperties}
                >
                  <div
                    className="tc-about__contact-icon"
                    style={{ background: `${opt.color}18`, color: opt.color }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="tc-about__contact-title">{opt.title}</h3>
                  <p className="tc-about__contact-desc">{opt.description}</p>
                  <span
                    className="tc-about__contact-action"
                    style={{ color: opt.color }}
                  >
                    {opt.action} →
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
