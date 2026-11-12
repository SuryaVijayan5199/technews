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
  CheckCircle2,
  Users,
  Building2,
  Mail,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { CompanyPageLayout } from "@/components/company/company-page-layout";

export const metadata: Metadata = {
  title: "About TechCrest News — Independent Technology Journalism",
  description:
    "Learn about TechCrest, an independent tech news site offering fast, accurate coverage and expert analysis on AI, phones, EVs, crypto, gaming and more.",
};

export default function AboutPage() {
  return (
    <CompanyPageLayout
      title="About TechCrest News"
      badge="Independent Technology Journalism"
      badgeIcon={<Globe className="w-3.5 h-3.5" />}
      subtitle="Accurate reporting, hands-on hardware critiques, and sharp technical analysis of the breakthroughs shaping our digital world."
      currentSlug="/about"
    >
      {/* Editorial Manifesto Lead */}
      <div className="tc-manifesto-card">
        <p className="tc-manifesto-text">
          Welcome to TechCrest News, your trusted source for the latest
          technology news, expert reviews, and sharp analysis of the trends
          shaping our digital world. In an industry that moves at breakneck
          speed, we cut through the noise to bring you accurate, timely, and
          genuinely useful reporting, whether you&apos;re a developer, a founder,
          an investor, or simply someone who loves staying ahead of the curve.
        </p>
      </div>

      {/* Section 1: Our Mission */}
      <section className="tc-editorial-section">
        <div className="tc-editorial-section__header">
          <h2 className="tc-editorial-section__title">
            <Compass className="w-5 h-5 text-[#2D7FF9]" />
            Our Mission
          </h2>
          <span className="tc-editorial-section__badge">Core Purpose</span>
        </div>
        <p className="tc-editorial-section__desc">
          At TechCrest News, our mission is simple: to make technology
          understandable, accessible, and relevant to everyone. We believe great
          tech journalism does more than report what happened, it explains why
          it matters. From breaking headlines to deep-dive explainers,
          we&apos;re committed to helping our readers make smarter decisions in
          a fast-changing technological landscape.
        </p>
      </section>

      {/* Section 2: What We Cover */}
      <section className="tc-editorial-section">
        <div className="tc-editorial-section__header">
          <h2 className="tc-editorial-section__title">
            <Cpu className="w-5 h-5 text-[#2D7FF9]" />
            What We Cover
          </h2>
          <span className="tc-editorial-section__badge">6 Editorial Beats</span>
        </div>
        <p className="tc-editorial-section__desc">
          Technology touches every part of modern life, and our coverage
          reflects that breadth. Our editorial team reports and analyzes across
          the areas that matter most:
        </p>

        <div className="tc-beat-grid">
          {/* Beat 1 */}
          <div className="tc-beat-card">
            <div
              className="tc-beat-card__icon-wrap"
              style={{
                backgroundColor: "rgba(45, 127, 249, 0.12)",
                color: "#2D7FF9",
              }}
            >
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="tc-beat-card__title">
              Artificial Intelligence & Machine Learning
            </h3>
            <p className="tc-beat-card__desc">
              The breakthroughs, tools, and debates defining the AI era.
            </p>
          </div>

          {/* Beat 2 */}
          <div className="tc-beat-card">
            <div
              className="tc-beat-card__icon-wrap"
              style={{
                backgroundColor: "rgba(16, 185, 129, 0.12)",
                color: "#10b981",
              }}
            >
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="tc-beat-card__title">Gadgets & Product Reviews</h3>
            <p className="tc-beat-card__desc">
              Hands-on, unbiased reviews of the latest smartphones, laptops, and
              consumer tech.
            </p>
          </div>

          {/* Beat 3 */}
          <div className="tc-beat-card">
            <div
              className="tc-beat-card__icon-wrap"
              style={{
                backgroundColor: "rgba(139, 92, 246, 0.12)",
                color: "#8b5cf6",
              }}
            >
              <Rocket className="w-5 h-5" />
            </div>
            <h3 className="tc-beat-card__title">Startups & Innovation</h3>
            <p className="tc-beat-card__desc">
              Funding rounds, emerging companies, and the ideas disrupting
              established industries.
            </p>
          </div>

          {/* Beat 4 */}
          <div className="tc-beat-card">
            <div
              className="tc-beat-card__icon-wrap"
              style={{
                backgroundColor: "rgba(245, 158, 11, 0.12)",
                color: "#f59e0b",
              }}
            >
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="tc-beat-card__title">Cybersecurity & Privacy</h3>
            <p className="tc-beat-card__desc">
              The threats, breaches, and best practices that keep you and your
              data safe.
            </p>
          </div>

          {/* Beat 5 */}
          <div className="tc-beat-card">
            <div
              className="tc-beat-card__icon-wrap"
              style={{
                backgroundColor: "rgba(6, 182, 212, 0.12)",
                color: "#06b6d4",
              }}
            >
              <Coins className="w-5 h-5" />
            </div>
            <h3 className="tc-beat-card__title">Fintech, Crypto & Blockchain</h3>
            <p className="tc-beat-card__desc">
              Clear-eyed coverage of digital finance and the technologies behind
              it.
            </p>
          </div>

          {/* Beat 6 */}
          <div className="tc-beat-card">
            <div
              className="tc-beat-card__icon-wrap"
              style={{
                backgroundColor: "rgba(236, 72, 153, 0.12)",
                color: "#ec4899",
              }}
            >
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="tc-beat-card__title">How-To Guides & Explainers</h3>
            <p className="tc-beat-card__desc">
              Practical, jargon-free content that helps you get more from your
              devices.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Why Readers Trust TechCrest News */}
      <section className="tc-editorial-section">
        <div className="tc-editorial-section__header">
          <h2 className="tc-editorial-section__title">
            <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
            Why Readers Trust TechCrest News
          </h2>
          <span className="tc-editorial-section__badge">Editorial Integrity</span>
        </div>
        <p className="tc-editorial-section__desc">
          Credibility is the foundation of everything we publish. Our reporting
          is grounded in verified facts, primary sources, and rigorous editorial
          standards. We prioritize accuracy over speed-for-its-own-sake, clearly
          separate news from opinion, and correct our work transparently when
          needed. Every article is crafted to inform rather than mislead, no
          clickbait, no hype, just journalism you can rely on.
        </p>

        <div className="tc-trust-grid mt-2">
          <div className="tc-trust-card">
            <div className="flex items-center gap-2 text-[#2D7FF9] font-bold text-xs uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>Verified Facts</span>
            </div>
            <h3 className="tc-trust-card__title">Accuracy Over Speed</h3>
            <p className="tc-trust-card__desc">
              Every scoop and benchmark is vetted against primary technical
              sources and peer documentation before publication.
            </p>
          </div>

          <div className="tc-trust-card">
            <div className="flex items-center gap-2 text-[#10b981] font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Editorial Firewall</span>
            </div>
            <h3 className="tc-trust-card__title">Zero Commercial Influence</h3>
            <p className="tc-trust-card__desc">
              Advertisers and partners never dictate editorial assignments, product ratings, or investigative findings.
            </p>
          </div>

          <div className="tc-trust-card">
            <div className="flex items-center gap-2 text-[#8b5cf6] font-bold text-xs uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              <span>Full Accountability</span>
            </div>
            <h3 className="tc-trust-card__title">Transparent Corrections</h3>
            <p className="tc-trust-card__desc">
              If an error occurs, we fix it promptly and append transparent correction notes at the top of the story.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Our Team */}
      <section className="tc-editorial-section">
        <div className="tc-editorial-section__header">
          <h2 className="tc-editorial-section__title">
            <Users className="w-5 h-5 text-[#8b5cf6]" />
            Our Team
          </h2>
          <span className="tc-editorial-section__badge">Global Newsroom</span>
        </div>
        <p className="tc-editorial-section__desc">
          TechCrest News is powered by a team of experienced journalists,
          writers, and industry analysts who live and breathe technology. Our
          contributors combine deep subject-matter expertise with a passion for
          storytelling, ensuring that complex topics are always explained with
          clarity and context.
        </p>
      </section>

      {/* Section 5: Newsroom Desk */}
      <section className="tc-editorial-section">
        <div className="tc-editorial-section__header">
          <h2 className="tc-editorial-section__title">
            <Building2 className="w-5 h-5 text-[#6366f1]" />
            Newsroom Desk
          </h2>
          <span className="tc-editorial-section__badge">Hub & Operations</span>
        </div>
        <p className="tc-editorial-section__desc">
          Operating from the heart of India&apos;s primary technology hub, our
          editorial desk coordinates reporting, investigative research, and
          hands-on hardware testing for a global audience.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1">
          <div className="p-4 rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-1)]">
            <div className="flex items-center gap-2 mb-2 text-[#2D7FF9] font-bold text-xs uppercase tracking-wider">
              <Mail className="w-4 h-4" />
              <span>Editorial Desk</span>
            </div>
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">
              Official Correspondence:
            </p>
            <a
              href="mailto:editor@techcrest.news"
              className="text-sm font-bold text-[#2D7FF9] hover:underline mt-1 inline-block"
            >
              editor@techcrest.news
            </a>
            <p className="text-xs text-muted-foreground mt-2">
              For tips, press releases, story pitches, and newsroom inquiries.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-1)]">
            <div className="flex items-center gap-2 mb-2 text-[#8b5cf6] font-bold text-xs uppercase tracking-wider">
              <ExternalLink className="w-4 h-4" />
              <span>Sister Initiative</span>
            </div>
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">
              Raw Pitch:
            </p>
            <a
              href="https://rawpitch.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-[#2D7FF9] hover:underline mt-1 inline-flex items-center gap-1"
            >
              rawpitch.org <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <p className="text-xs text-muted-foreground mt-2">
              Showcasing early-stage builders, deep-tech research, and founder stories.
            </p>
          </div>
        </div>
      </section>

      {/* Section 6: Get in Touch Banner */}
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
          Visit Contact Desk <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </CompanyPageLayout>
  );
}
