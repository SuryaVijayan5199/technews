import type { Metadata } from "next";
import Link from "next/link";
import {
  Briefcase,
  Compass,
  Sparkles,
  HeartHandshake,
  Mail,
  Shield,
  Cpu,
  Users,
  CheckCircle2,
  ArrowRight,
  FileText,
} from "lucide-react";
import { CompanyPageLayout } from "@/components/company/company-page-layout";

export const metadata: Metadata = {
  title: "Careers & Freelance Pitches — TechCrest Newsroom",
  description:
    "Join the TechCrest newsroom. Explore career opportunities, staff writer roles, and freelance technical contributor guidelines.",
};

export default function CareersPage() {
  return (
    <CompanyPageLayout
      title="Careers at TechCrest"
      badge="Join Our Newsroom"
      badgeIcon={<Briefcase className="tc-subpage-badge__icon" />}
      subtitle="We are building the definitive independent technology newsroom for the next generation of engineers, builders, and inquisitive thinkers."
      currentSlug="/careers"
    >
      {/* Editorial Lead Manifesto */}
      <div className="tc-manifesto-box">
        <h2 className="tc-manifesto-box__title">
          Journalism Driven by Curiosity, Context & Craft
        </h2>
        <p className="tc-manifesto-box__text">
          At TechCrest, we believe technology reporting shouldn&apos;t be a race
          to summarize press releases. We dig into the code, inspect the
          hardware architectures, examine the regulatory nuances, and explain
          what breakthroughs actually mean for people and industries.
        </p>
      </div>

      {/* Editorial Values */}
      <section className="tc-editorial-block">
        <div className="tc-editorial-block__header">
          <h2 className="tc-editorial-block__title">
            <Compass className="tc-subpage-meta__icon" />
            Our Editorial Values
          </h2>
          <span className="tc-editorial-block__badge">Newsroom Standards</span>
        </div>

        <div className="tc-trust-grid">
          <div className="tc-trust-card">
            <div className="tc-trust-card__badge" style={{ color: "#2D7FF9" }}>
              <Shield className="tc-subpage-meta__icon" />
              <span>Independence</span>
            </div>
            <h3 className="tc-trust-card__title">Editorial Independence</h3>
            <p className="tc-trust-card__desc">
              We answer only to our readers. No advertiser or sponsor dictates
              what we cover, how we rate a product, or what headlines we write.
            </p>
          </div>

          <div className="tc-trust-card">
            <div className="tc-trust-card__badge" style={{ color: "#10b981" }}>
              <Cpu className="tc-subpage-meta__icon" />
              <span>Rigor</span>
            </div>
            <h3 className="tc-trust-card__title">Technical Depth</h3>
            <p className="tc-trust-card__desc">
              We respect our audience&apos;s intelligence. We explain complex
              semiconductors, neural network architectures, and cryptography
              with clear rigor.
            </p>
          </div>

          <div className="tc-trust-card">
            <div className="tc-trust-card__badge" style={{ color: "#8b5cf6" }}>
              <Users className="tc-subpage-meta__icon" />
              <span>Impact</span>
            </div>
            <h3 className="tc-trust-card__title">Human Perspective</h3>
            <p className="tc-trust-card__desc">
              Behind every algorithm, gadget, and launch are real human
              stories, ethical trade-offs, and economic impacts. We spotlight
              the people behind the code.
            </p>
          </div>
        </div>
      </section>

      {/* Open Roles & Beat Inquiries */}
      <section className="tc-editorial-block">
        <div className="tc-editorial-block__header">
          <h2 className="tc-editorial-block__title">
            <Sparkles className="tc-subpage-meta__icon" />
            Areas We Are Actively Scouting
          </h2>
          <span className="tc-editorial-block__badge">Open Inquiries</span>
        </div>
        <p className="tc-editorial-block__desc">
          While we may not always have a generic job opening posted, we are
          continuously looking for exceptional writers, beat journalists, and
          technical specialists across:
        </p>

        <div className="tc-role-grid">
          {/* Role 1 */}
          <div className="tc-role-card">
            <div className="tc-role-card__header">
              <h3 className="tc-role-card__title">
                AI & Machine Learning Beat Writer
              </h3>
              <span className="tc-role-card__tag">Remote / Global</span>
            </div>
            <p className="tc-role-card__desc">
              Covering frontier models, infrastructure, AI startups, open-source
              developments, and safety debates.
            </p>
            <a
              href="mailto:editor@techcrest.news?subject=Beat%20Inquiry%20%E2%80%94%20AI%20%26%20Machine%20Learning"
              className="tc-role-card__cta"
            >
              Pitch this beat <ArrowRight className="tc-hub-card__link-icon" />
            </a>
          </div>

          {/* Role 2 */}
          <div className="tc-role-card">
            <div className="tc-role-card__header">
              <h3 className="tc-role-card__title">
                Consumer Hardware Reviewer (Audio & Mobile)
              </h3>
              <span className="tc-role-card__tag">Hardware Lab</span>
            </div>
            <p className="tc-role-card__desc">
              Hands-on testing, comparative benchmarks, and unbiased
              audio/smartphone critiques.
            </p>
            <a
              href="mailto:editor@techcrest.news?subject=Beat%20Inquiry%20%E2%80%94%20Consumer%20Hardware%20Reviewer"
              className="tc-role-card__cta"
            >
              Pitch this beat <ArrowRight className="tc-hub-card__link-icon" />
            </a>
          </div>

          {/* Role 3 */}
          <div className="tc-role-card">
            <div className="tc-role-card__header">
              <h3 className="tc-role-card__title">
                Clean Energy & EV Mobility Analyst
              </h3>
              <span className="tc-role-card__tag">Mobility Beat</span>
            </div>
            <p className="tc-role-card__desc">
              Electric vehicle launches, battery chemistry, autonomous driving,
              and grid transitions.
            </p>
            <a
              href="mailto:editor@techcrest.news?subject=Beat%20Inquiry%20%E2%80%94%20Clean%20Energy%20%26%20EV%20Mobility"
              className="tc-role-card__cta"
            >
              Pitch this beat <ArrowRight className="tc-hub-card__link-icon" />
            </a>
          </div>

          {/* Role 4 */}
          <div className="tc-role-card">
            <div className="tc-role-card__header">
              <h3 className="tc-role-card__title">
                Cybersecurity & Privacy Reporter
              </h3>
              <span className="tc-role-card__tag">Investigative</span>
            </div>
            <p className="tc-role-card__desc">
              Zero-day exploits, state-sponsored cyber warfare, data regulations,
              and privacy-preserving tech.
            </p>
            <a
              href="mailto:editor@techcrest.news?subject=Beat%20Inquiry%20%E2%80%94%20Cybersecurity%20%26%20Privacy"
              className="tc-role-card__cta"
            >
              Pitch this beat <ArrowRight className="tc-hub-card__link-icon" />
            </a>
          </div>
        </div>
      </section>

      {/* Freelance & Pitch Submissions */}
      <section className="tc-editorial-block">
        <div className="tc-editorial-block__header">
          <h2 className="tc-editorial-block__title">
            <HeartHandshake className="tc-subpage-meta__icon" />
            Freelance Contributors & Op-Ed Pitches
          </h2>
          <span className="tc-editorial-block__badge">Competitive Rates</span>
        </div>
        <p className="tc-editorial-block__desc">
          Are you an engineer, researcher, founder, or investigative writer with
          a unique perspective or scoop? We pay competitive rates for original
          reporting, in-depth explainers, and well-argued opinion pieces.
        </p>

        <div className="tc-checklist-box">
          <div className="tc-checklist-box__header">
            <FileText className="tc-subpage-meta__icon" />
            <span>Submission Checklist for Freelancers</span>
          </div>
          <p className="tc-checklist-box__desc">
            Send your pitch (2-3 paragraphs outlining the story, why it matters
            now, your primary sources, and links to your previous writing) to
            our editorial desk.
          </p>
          <div className="tc-checklist-grid">
            <div className="tc-checklist-item">
              <CheckCircle2
                className="tc-subpage-meta__icon"
                style={{ color: "#10b981" }}
              />
              <span>2-3 paragraph angle</span>
            </div>
            <div className="tc-checklist-item">
              <CheckCircle2
                className="tc-subpage-meta__icon"
                style={{ color: "#10b981" }}
              />
              <span>Primary sources identified</span>
            </div>
            <div className="tc-checklist-item">
              <CheckCircle2
                className="tc-subpage-meta__icon"
                style={{ color: "#10b981" }}
              />
              <span>Published writing clips</span>
            </div>
          </div>
        </div>
      </section>

      {/* How to Apply */}
      <section className="tc-action-banner">
        <div className="tc-action-banner__content">
          <h2 className="tc-action-banner__title">How to Apply</h2>
          <p className="tc-action-banner__desc">
            Send your resume, links to 2–3 published writing samples or
            technical blog posts, and a brief note about what tech beat you are
            passionate about to:
          </p>
          <div className="tc-action-banner__note">
            <strong>Subject Line Format:</strong> &quot;Career / Pitch — [Your
            Name] — [Beat/Topic]&quot;
          </div>
        </div>
        <a
          href="mailto:editor@techcrest.news?subject=Career%20%2F%20Pitch%20%E2%80%94%20[Your%20Name]%20%E2%80%94%20[Beat%2FTopic]"
          className="tc-action-banner__btn"
        >
          <Mail className="tc-subpage-meta__icon" /> Apply via editor@techcrest.news
        </a>
      </section>
    </CompanyPageLayout>
  );
}
