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
      badgeIcon={<Briefcase className="w-3.5 h-3.5" />}
      subtitle="We are building the definitive independent technology newsroom for the next generation of engineers, builders, and inquisitive thinkers."
      currentSlug="/careers"
    >
      {/* Editorial Lead Manifesto */}
      <div className="tc-manifesto-card">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-2 font-display">
          Journalism Driven by Curiosity, Context & Craft
        </h2>
        <p className="tc-manifesto-text text-base">
          At TechCrest, we believe technology reporting shouldn&apos;t be a race
          to summarize press releases. We dig into the code, inspect the
          hardware architectures, examine the regulatory nuances, and explain
          what breakthroughs actually mean for people and industries.
        </p>
      </div>

      {/* Editorial Values */}
      <section className="tc-editorial-section">
        <div className="tc-editorial-section__header">
          <h2 className="tc-editorial-section__title">
            <Compass className="w-5 h-5 text-[#2D7FF9]" />
            Our Editorial Values
          </h2>
          <span className="tc-editorial-section__badge">Newsroom Standards</span>
        </div>

        <div className="tc-trust-grid">
          <div className="tc-trust-card">
            <div className="flex items-center gap-2 text-[#2D7FF9] font-bold text-xs uppercase tracking-wider">
              <Shield className="w-4 h-4" />
              <span>Independence</span>
            </div>
            <h3 className="tc-trust-card__title">Editorial Independence</h3>
            <p className="tc-trust-card__desc">
              We answer only to our readers. No advertiser or sponsor dictates
              what we cover, how we rate a product, or what headlines we write.
            </p>
          </div>

          <div className="tc-trust-card">
            <div className="flex items-center gap-2 text-[#10b981] font-bold text-xs uppercase tracking-wider">
              <Cpu className="w-4 h-4" />
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
            <div className="flex items-center gap-2 text-[#8b5cf6] font-bold text-xs uppercase tracking-wider">
              <Users className="w-4 h-4" />
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
      <section className="tc-editorial-section">
        <div className="tc-editorial-section__header">
          <h2 className="tc-editorial-section__title">
            <Sparkles className="w-5 h-5 text-[#10b981]" />
            Areas We Are Actively Scouting
          </h2>
          <span className="tc-editorial-section__badge">Open Inquiries</span>
        </div>
        <p className="tc-editorial-section__desc">
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
              Pitch this beat <ArrowRight className="w-3.5 h-3.5" />
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
              Pitch this beat <ArrowRight className="w-3.5 h-3.5" />
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
              Pitch this beat <ArrowRight className="w-3.5 h-3.5" />
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
              Pitch this beat <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* Freelance & Pitch Submissions */}
      <section className="tc-editorial-section">
        <div className="tc-editorial-section__header">
          <h2 className="tc-editorial-section__title">
            <HeartHandshake className="w-5 h-5 text-[#8b5cf6]" />
            Freelance Contributors & Op-Ed Pitches
          </h2>
          <span className="tc-editorial-section__badge">Competitive Rates</span>
        </div>
        <p className="tc-editorial-section__desc">
          Are you an engineer, researcher, founder, or investigative writer with
          a unique perspective or scoop? We pay competitive rates for original
          reporting, in-depth explainers, and well-argued opinion pieces.
        </p>

        <div className="p-5 rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-1)]">
          <div className="flex items-center gap-2 mb-3 text-sm font-bold text-[var(--color-text-primary)]">
            <FileText className="w-4 h-4 text-[#2D7FF9]" />
            <span>Submission Checklist for Freelancers</span>
          </div>
          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
            Send your pitch (2-3 paragraphs outlining the story, why it matters
            now, your primary sources, and links to your previous writing) to
            our editorial desk.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-[var(--color-surface-border)] text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>2-3 paragraph angle</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Primary sources identified</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
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
          <div className="mt-2.5 text-xs text-muted-foreground">
            <strong className="text-[var(--color-text-primary)]">
              Subject Line Format:
            </strong>{" "}
            &quot;Career / Pitch — [Your Name] — [Beat/Topic]&quot;
          </div>
        </div>
        <a
          href="mailto:editor@techcrest.news?subject=Career%20%2F%20Pitch%20%E2%80%94%20[Your%20Name]%20%E2%80%94%20[Beat%2FTopic]"
          className="tc-action-banner__btn"
        >
          <Mail className="w-4 h-4" /> Apply via editor@techcrest.news
        </a>
      </section>
    </CompanyPageLayout>
  );
}
