import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Briefcase, Sparkles, Compass, HeartHandshake, Mail, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Careers & Freelance Pitches — TechCrest",
  description:
    "Join the TechCrest newsroom. Explore career opportunities, staff writer roles, and freelance technical contributor guidelines.",
};

export default function CareersPage() {
  return (
    <div className="tc-policy-page">
      <div className="tc-policy-page__container">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="tc-policy-page__breadcrumb">
          <Link href="/" className="tc-policy-page__breadcrumb-link">Home</Link>
          <ChevronRight className="tc-icon-xs" />
          <span className="tc-policy-page__breadcrumb-current">Careers</span>
        </nav>

        {/* Page Header */}
        <div className="tc-policy-page__header">
          <div className="tc-policy-page__badge">
            <Briefcase className="tc-icon-xs" />
            <span>JOIN OUR NEWSROOM</span>
          </div>
          <h1 className="tc-policy-page__title">
            Careers at TechCrest
          </h1>
          <p className="tc-policy-page__subtitle mt-2 text-base text-muted-foreground max-w-2xl">
            We are building the definitive independent technology newsroom for the next generation of engineers, builders, and inquisitive thinkers.
          </p>
        </div>

        {/* Content Body */}
        <div className="tc-policy-page__content">
          <div className="tc-policy-page__intro-card">
            <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">
              Journalism Driven by Curiosity, Context & Craft
            </h2>
            <p className="tc-policy-page__intro-text">
              At TechCrest, we believe technology reporting shouldn&apos;t be a race to summarize press releases. We dig into the code, inspect the hardware architectures, examine the regulatory nuances, and explain what breakthroughs actually mean for people and industries.
            </p>
          </div>

          {/* Newsroom Culture */}
          <section className="tc-policy-page__section tc-policy-page__section--first">
            <h2 className="tc-policy-page__section-title">
              <Compass className="tc-policy-page__section-icon text-[#2D7FF9]" />
              Our Editorial Values
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div className="p-4 rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-1)]">
                <h3 className="font-bold text-sm text-[var(--color-text-primary)]">Editorial Independence</h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  We answer only to our readers. No advertiser or sponsor dictates what we cover, how we rate a product, or what headlines we write.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-1)]">
                <h3 className="font-bold text-sm text-[var(--color-text-primary)]">Technical Depth</h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  We respect our audience&apos;s intelligence. We explain complex semiconductors, neural network architectures, and cryptography with clear rigor.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-1)]">
                <h3 className="font-bold text-sm text-[var(--color-text-primary)]">Human Perspective</h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Behind every algorithm, gadget, and launch are real human stories, ethical trade-offs, and economic impacts. We spotlight the people behind the code.
                </p>
              </div>
            </div>
          </section>

          {/* Open Roles & Beat Inquiries */}
          <section className="tc-policy-page__section">
            <h2 className="tc-policy-page__section-title">
              <Sparkles className="tc-policy-page__section-icon text-[#10b981]" />
              Areas We Are Actively Scouting
            </h2>
            <p>
              While we may not always have a generic job opening posted, we are continuously looking for exceptional writers, beat journalists, and technical specialists across:
            </p>
            <ul className="tc-policy-page__list mt-3">
              <li className="tc-policy-page__list-item">
                <strong>AI & Machine Learning Beat Writer:</strong> Covering frontier models, infrastructure, AI startups, open-source developments, and safety debates.
              </li>
              <li className="tc-policy-page__list-item">
                <strong>Consumer Hardware Reviewer (Audio & Mobile):</strong> Hands-on testing, comparative benchmarks, and unbiased audio/smartphone critiques.
              </li>
              <li className="tc-policy-page__list-item">
                <strong>Clean Energy & EV Mobility Analyst:</strong> Electric vehicle launches, battery chemistry, autonomous driving, and grid transitions.
              </li>
              <li className="tc-policy-page__list-item">
                <strong>Cybersecurity & Privacy Reporter:</strong> Zero-day exploits, state-sponsored cyber warfare, data regulations, and privacy-preserving tech.
              </li>
            </ul>
          </section>

          {/* Freelance & Pitch Submissions */}
          <section className="tc-policy-page__section">
            <h2 className="tc-policy-page__section-title">
              <HeartHandshake className="tc-policy-page__section-icon text-[#8b5cf6]" />
              Freelance Contributors & Op-Ed Pitches
            </h2>
            <p>
              Are you an engineer, researcher, founder, or investigative writer with a unique perspective or scoop? We pay competitive rates for original reporting, in-depth explainers, and well-argued opinion pieces.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Send your pitch (2-3 paragraphs outlining the story, why it matters now, your primary sources, and links to your previous writing) to our editorial desk.
            </p>
          </section>

          {/* How to Apply */}
          <section className="tc-policy-page__section">
            <h2 className="tc-policy-page__section-title">
              <Mail className="tc-policy-page__section-icon text-[#2D7FF9]" />
              How to Apply
            </h2>
            <p>
              Send your resume, links to 2–3 published writing samples or technical blog posts, and a brief note about what tech beat you are passionate about to:
            </p>
            <div className="tc-policy-page__intro-card mt-3 text-sm space-y-2">
              <p><strong>Newsroom Careers Email:</strong> <a href="mailto:editor@techcrest.news" className="text-[#2D7FF9] underline">editor@techcrest.news</a></p>
              <p><strong>Subject Line:</strong> &quot;Career / Pitch — [Your Name] — [Beat/Topic]&quot;</p>
              <p><strong>Headquarters:</strong> TechCrest, 4th Floor VM Grandeur, Bangalore 560113, India</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
