import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "About TechCrest News",
  description:
    "Learn about TechCrest, an independent tech news site offering fast, accurate coverage and expert analysis on AI, phones, EVs, crypto, gaming and more.",
};

export default function AboutPage() {
  return (
    <div className="tc-policy-page">
      <div className="tc-policy-page__container">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="tc-policy-page__breadcrumb">
          <Link href="/" className="tc-policy-page__breadcrumb-link">
            Home
          </Link>
          <ChevronRight className="tc-icon-xs" />
          <span className="tc-policy-page__breadcrumb-current">About Us</span>
        </nav>

        {/* Page Header */}
        <div className="tc-policy-page__header">
          <div className="tc-policy-page__badge">
            <Globe className="tc-icon-xs" />
            <span>Technology News. Smarter Insights. Real Impact</span>
          </div>
          <h1 className="tc-policy-page__title">About TechCrest News</h1>
        </div>

        {/* Content Body */}
        <div className="tc-policy-page__content">
          <div className="tc-policy-page__intro-card">
            <p className="tc-policy-page__intro-text">
              Welcome to TechCrest News, your trusted source for the latest
              technology news, expert reviews, and sharp analysis of the trends
              shaping our digital world. In an industry that moves at breakneck
              speed, we cut through the noise to bring you accurate, timely,
              and genuinely useful reporting, whether you&apos;re a developer,
              a founder, an investor, or simply someone who loves staying ahead
              of the curve.
            </p>
          </div>

          {/* Section 1 */}
          <section className="tc-policy-page__section tc-policy-page__section--first">
            <h2 className="tc-policy-page__section-title">
              <span className="tc-policy-page__section-num">1</span>
              Our Mission
            </h2>
            <p>
              At TechCrest News, our mission is simple: to make technology
              understandable, accessible, and relevant to everyone. We believe
              great tech journalism does more than report what happened, it
              explains why it matters. From breaking headlines to deep-dive
              explainers, we&apos;re committed to helping our readers make
              smarter decisions in a fast-changing technological landscape.
            </p>
          </section>

          {/* Section 2 */}
          <section className="tc-policy-page__section">
            <h2 className="tc-policy-page__section-title">
              <span className="tc-policy-page__section-num">2</span>
              What We Cover
            </h2>
            <p>
              Technology touches every part of modern life, and our coverage
              reflects that breadth. Our editorial team reports and analyzes
              across the areas that matter most:
            </p>
            <ul className="tc-policy-page__list">
              <li className="tc-policy-page__list-item">
                <strong>Artificial Intelligence & Machine Learning</strong> — the
                breakthroughs, tools, and debates defining the AI era
              </li>
              <li className="tc-policy-page__list-item">
                <strong>Gadgets & Product Reviews</strong> — hands-on, unbiased
                reviews of the latest smartphones, laptops, and consumer tech
              </li>
              <li className="tc-policy-page__list-item">
                <strong>Startups & Innovation</strong> — funding rounds,
                emerging companies, and the ideas disrupting established
                industries
              </li>
              <li className="tc-policy-page__list-item">
                <strong>Cybersecurity & Privacy</strong> — the threats,
                breaches, and best practices that keep you and your data safe
              </li>
              <li className="tc-policy-page__list-item">
                <strong>Fintech, Crypto & Blockchain</strong> — clear-eyed
                coverage of digital finance and the technologies behind it
              </li>
              <li className="tc-policy-page__list-item">
                <strong>How-To Guides & Explainers</strong> — practical,
                jargon-free content that helps you get more from your devices
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="tc-policy-page__section">
            <h2 className="tc-policy-page__section-title">
              <span className="tc-policy-page__section-num">3</span>
              Why Readers Trust TechCrest News
            </h2>
            <p>
              Credibility is the foundation of everything we publish. Our
              reporting is grounded in verified facts, primary sources, and
              rigorous editorial standards. We prioritize accuracy over
              speed-for-its-own-sake, clearly separate news from opinion, and
              correct our work transparently when needed. Every article is
              crafted to inform rather than mislead, no clickbait, no hype,
              just journalism you can rely on.
            </p>
          </section>

          {/* Section 4 */}
          <section className="tc-policy-page__section">
            <h2 className="tc-policy-page__section-title">
              <span className="tc-policy-page__section-num">4</span>
              Our Team
            </h2>
            <p>
              TechCrest News is powered by a team of experienced journalists,
              writers, and industry analysts who live and breathe technology.
              Our contributors combine deep subject-matter expertise with a
              passion for storytelling, ensuring that complex topics are always
              explained with clarity and context.
            </p>
          </section>

          {/* Section 5 */}
          <section className="tc-policy-page__section">
            <h2 className="tc-policy-page__section-title">
              <span className="tc-policy-page__section-num">5</span>
              Get in Touch
            </h2>
            <p>
              We value our community of readers and welcome your feedback,
              story tips, and questions. Whether you&apos;d like to pitch a
              story, explore partnership opportunities, or simply share your
              thoughts, we&apos;d love to hear from you.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
