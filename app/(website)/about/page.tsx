import type { Metadata } from "next";
import {
  Brain,
  Smartphone,
  TrendingUp,
  ShieldCheck,
  Coins,
  BookOpen,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About TechCrest News",
  description:
    "Welcome to TechCrest News, your trusted source for the latest technology news, expert reviews, and sharp analysis of the trends shaping our digital world.",
};

const COVERAGE_ITEMS = [
  {
    icon: Brain,
    title: "Artificial Intelligence & Machine Learning",
    description: "the breakthroughs, tools, and debates defining the AI era",
    color: "#a855f7",
  },
  {
    icon: Smartphone,
    title: "Gadgets & Product Reviews",
    description:
      "hands-on, unbiased reviews of the latest smartphones, laptops, and consumer tech",
    color: "#0ea5e9",
  },
  {
    icon: TrendingUp,
    title: "Startups & Innovation",
    description:
      "funding rounds, emerging companies, and the ideas disrupting established industries",
    color: "#f59e0b",
  },
  {
    icon: ShieldCheck,
    title: "Cybersecurity & Privacy",
    description:
      "the threats, breaches, and best practices that keep you and your data safe",
    color: "#ef4444",
  },
  {
    icon: Coins,
    title: "Fintech, Crypto & Blockchain",
    description:
      "clear-eyed coverage of digital finance and the technologies behind it",
    color: "#f97316",
  },
  {
    icon: BookOpen,
    title: "How-To Guides & Explainers",
    description:
      "practical, jargon-free content that helps you get more from your devices",
    color: "#10b981",
  },
];

export default function AboutPage() {
  return (
    <div className="tc-about">
      {/* ── ABOUT TECHCREST NEWS (HERO) ── */}
      <section className="tc-about__hero">
        <div className="tc-about__hero-bg" aria-hidden="true" />
        <div className="tc-about__wrap">
          <div className="tc-about__hero-container">
            <h1 className="tc-about__hero-title">
              About <span className="tc-about__accent">TechCrest News</span>
            </h1>
            <p className="tc-about__hero-desc">
              Welcome to TechCrest News, your trusted source for the latest
              technology news, expert reviews, and sharp analysis of the trends
              shaping our digital world. In an industry that moves at breakneck
              speed, we cut through the noise to bring you accurate, timely,
              and genuinely useful reporting, whether you&apos;re a developer,
              a founder, an investor, or simply someone who loves staying ahead
              of the curve.
            </p>
          </div>
        </div>
      </section>

      {/* ── OUR MISSION ── */}
      <section className="tc-about__section tc-about__section--alt">
        <div className="tc-about__wrap">
          <div className="tc-about__card tc-about__card--feature tc-about__card--mission">
            <h2 className="tc-about__section-title">Our Mission</h2>
            <p className="tc-about__body-text">
              At TechCrest News, our mission is simple: to make technology
              understandable, accessible, and relevant to everyone. We believe
              great tech journalism does more than report what happened, it
              explains why it matters. From breaking headlines to deep-dive
              explainers, we&apos;re committed to helping our readers make
              smarter decisions in a fast-changing technological landscape.
            </p>
          </div>
        </div>
      </section>

      {/* ── WHAT WE COVER ── */}
      <section className="tc-about__section">
        <div className="tc-about__wrap">
          <div className="tc-about__section-head tc-about__section-head--center">
            <h2 className="tc-about__section-title">What We Cover</h2>
            <p className="tc-about__section-sub">
              Technology touches every part of modern life, and our coverage
              reflects that breadth. Our editorial team reports and analyzes
              across the areas that matter most:
            </p>
          </div>

          <div className="tc-about__coverage-grid">
            {COVERAGE_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="tc-about__coverage-card"
                  style={{ "--card-accent": item.color } as React.CSSProperties}
                >
                  <div className="tc-about__coverage-card-top">
                    <div
                      className="tc-about__coverage-icon"
                      style={{
                        background: `${item.color}18`,
                        color: item.color,
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="tc-about__coverage-title">{item.title}</h3>
                  <p className="tc-about__coverage-desc">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── WHY READERS TRUST US & OUR TEAM ── */}
      <section className="tc-about__section tc-about__section--alt">
        <div className="tc-about__wrap">
          <div className="tc-about__grid-2">
            <div className="tc-about__card">
              <h2 className="tc-about__section-title">
                Why Readers Trust TechCrest News
              </h2>
              <p className="tc-about__body-text">
                Credibility is the foundation of everything we publish. Our
                reporting is grounded in verified facts, primary sources, and
                rigorous editorial standards. We prioritize accuracy over
                speed-for-its-own-sake, clearly separate news from opinion, and
                correct our work transparently when needed. Every article is
                crafted to inform rather than mislead, no clickbait, no hype,
                just journalism you can rely on.
              </p>
            </div>

            <div className="tc-about__card">
              <h2 className="tc-about__section-title">Our Team</h2>
              <p className="tc-about__body-text">
                TechCrest News is powered by a team of experienced
                journalists, writers, and industry analysts who live and breathe
                technology. Our contributors combine deep subject-matter
                expertise with a passion for storytelling, ensuring that
                complex topics are always explained with clarity and context.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── GET IN TOUCH ── */}
      <section className="tc-about__section">
        <div className="tc-about__wrap">
          <div className="tc-about__card tc-about__card--feature tc-about__card--center">
            <h2 className="tc-about__section-title">Get in Touch</h2>
            <p className="tc-about__body-text">
              We value our community of readers and welcome your feedback,
              story tips, and questions. Whether you&apos;d like to pitch a
              story, explore partnership opportunities, or simply share your
              thoughts, we&apos;d love to hear from you.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
