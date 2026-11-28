import type { Metadata } from "next";
import Link from "next/link";
import {
  Globe,
  Compass,
  Cpu,
  Smartphone,
  Rocket,
  ShieldCheck,
  Coins,
  BookOpen,
  Users,
  ArrowRight,
  UserCheck,
} from "lucide-react";
import { CompanyPageLayout } from "@/components/company/company-page-layout";

export const metadata: Metadata = {
  title: "About TechCrest News",
  description:
    "Learn about TechCrest, an independent tech news site offering fast, accurate coverage and expert analysis on AI, phones, EVs, crypto, gaming and more.",
};

export default function AboutPage() {
  return (
    <CompanyPageLayout
      title="About TechCrest News"
      subtitle="Accurate reporting, hands-on hardware critiques, and sharp technical analysis of the breakthroughs shaping our digital world."
      currentSlug="/about"
    >
      {/* Editorial Manifesto Lead */}
      <div className="tc-manifesto-box">
        <p className="tc-manifesto-box__text">
          Welcome to TechCrest News, your trusted source for the latest
          technology news, expert reviews, and sharp analysis of the trends
          shaping our digital world. In an industry that moves at breakneck
          speed, we cut through the noise to bring you accurate, timely, and
          genuinely useful reporting, whether you&apos;re a developer, a founder,
          an investor, or simply someone who loves staying ahead of the curve.
        </p>
      </div>

      {/* Section 1: Our Mission */}
      <section className="tc-editorial-block">
        <div className="tc-editorial-block__header">
          <h2 className="tc-editorial-block__title">
            <Compass className="tc-subpage-meta__icon" />
            Our Mission
          </h2>
        </div>
        <p className="tc-editorial-block__desc">
          At TechCrest News, our mission is simple: to make technology
          understandable, accessible, and relevant to everyone. We believe great
          tech journalism does more than report what happened, it explains why
          it matters. From breaking headlines to deep-dive explainers,
          we&apos;re committed to helping our readers make smarter decisions in
          a fast-changing technological landscape.
        </p>
      </section>

      {/* Section: Who is behind it */}
      <section className="tc-editorial-block">
        <div className="tc-editorial-block__header">
          <h2 className="tc-editorial-block__title">
            <UserCheck className="tc-subpage-meta__icon" />
            Who is behind it
          </h2>
        </div>
        <p className="tc-editorial-block__desc">
          <strong>TechCrest.news</strong> was founded by <strong>Bibhu Pattnaik</strong>, an experienced editorial leader and media strategist with over 25 years of experience covering technology, business, financial markets, and emerging industries. He also advises global research and consulting firms, including GLG and Coleman Research, bringing valuable industry perspectives and a deep understanding of evolving market dynamics. As Managing Editor, Bibhu leads TechCrest’s editorial vision and strategy, with a focus on AI, consumer technology, and digital innovation. Built on the belief that technology deserves informed, accessible, and meaningful coverage, TechCrest is committed to delivering credible reporting, sharp insights, real-world perspectives, and substance over hype.
        </p>
      </section>

      {/* Section 2: What We Cover */}
      <section className="tc-editorial-block">
        <div className="tc-editorial-block__header">
          <h2 className="tc-editorial-block__title">
            <Cpu className="tc-subpage-meta__icon" />
            What We Cover
          </h2>
        </div>
        <p className="tc-editorial-block__desc">
          We cover the technology shaping our world, from artificial intelligence and machine learning, gadgets and product reviews to startups, innovation, cybersecurity, privacy, fintech, crypto, and blockchain. Through news, analysis, hands-on reviews, practical how-to guides, and easy-to-understand explainers, we explore the latest breakthroughs, emerging trends, products, and ideas that impact businesses and everyday lives.
        </p>

        <div className="tc-beat-grid">
          {/* Beat 1 */}
          <div className="tc-beat-card tc-beat-card--ai">
            <div className="tc-beat-card__icon-wrap">
              <Cpu className="tc-subpage-meta__icon" />
            </div>
            <h3 className="tc-beat-card__title">
              Artificial Intelligence & Machine Learning
            </h3>
            <p className="tc-beat-card__desc">
              The breakthroughs, tools, and debates defining the AI era.
            </p>
          </div>

          {/* Beat 2 */}
          <div className="tc-beat-card tc-beat-card--reviews">
            <div className="tc-beat-card__icon-wrap">
              <Smartphone className="tc-subpage-meta__icon" />
            </div>
            <h3 className="tc-beat-card__title">Gadgets & Product Reviews</h3>
            <p className="tc-beat-card__desc">
              Hands-on, unbiased reviews of the latest smartphones, laptops, and
              consumer tech.
            </p>
          </div>

          {/* Beat 3 */}
          <div className="tc-beat-card tc-beat-card--startups">
            <div className="tc-beat-card__icon-wrap">
              <Rocket className="tc-subpage-meta__icon" />
            </div>
            <h3 className="tc-beat-card__title">Startups & Innovation</h3>
            <p className="tc-beat-card__desc">
              Funding rounds, emerging companies, and the ideas disrupting
              established industries.
            </p>
          </div>

          {/* Beat 4 */}
          <div className="tc-beat-card tc-beat-card--security">
            <div className="tc-beat-card__icon-wrap">
              <ShieldCheck className="tc-subpage-meta__icon" />
            </div>
            <h3 className="tc-beat-card__title">Cybersecurity & Privacy</h3>
            <p className="tc-beat-card__desc">
              The threats, breaches, and best practices that keep you and your
              data safe.
            </p>
          </div>

          {/* Beat 5 */}
          <div className="tc-beat-card tc-beat-card--crypto">
            <div className="tc-beat-card__icon-wrap">
              <Coins className="tc-subpage-meta__icon" />
            </div>
            <h3 className="tc-beat-card__title">Fintech, Crypto & Blockchain</h3>
            <p className="tc-beat-card__desc">
              Clear-eyed coverage of digital finance and the technologies behind
              it.
            </p>
          </div>

          {/* Beat 6 */}
          <div className="tc-beat-card tc-beat-card--guides">
            <div className="tc-beat-card__icon-wrap">
              <BookOpen className="tc-subpage-meta__icon" />
            </div>
            <h3 className="tc-beat-card__title">How-To Guides & Explainers</h3>
            <p className="tc-beat-card__desc">
              Practical, jargon-free content that helps you get more from your
              devices.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Our Team */}
      <section className="tc-editorial-block">
        <div className="tc-editorial-block__header">
          <h2 className="tc-editorial-block__title">
            <Users className="tc-subpage-meta__icon" />
            Our Team
          </h2>
        </div>
        <p className="tc-editorial-block__desc">
          TechCrest News is powered by a team of experienced journalists,
          writers, and industry analysts who live and breathe technology. Our
          contributors combine deep subject-matter expertise with a passion for
          storytelling, ensuring that complex topics are always explained with
          clarity and context.
        </p>
      </section>

      {/* Section: Get in Touch Banner */}
      <section className="tc-action-banner">
        <div className="tc-action-banner__content">
          <h2 className="tc-action-banner__title">Get in Touch</h2>
          <p className="tc-action-banner__desc">
            We value our community of readers and welcome your feedback, story
            tips, and questions. Whether you&apos;d like to pitch a story, explore
            partnership opportunities, or simply share your thoughts, reach out
            via our Contact Desk.
          </p>
        </div>
        <Link href="/contact" className="tc-action-banner__btn">
          Visit Contact Desk <ArrowRight className="tc-subpage-meta__icon" />
        </Link>
      </section>
    </CompanyPageLayout>
  );
}
