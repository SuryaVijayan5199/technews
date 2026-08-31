"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle, Sparkles, Zap, ShieldCheck } from "lucide-react";
import { TechCrestIcon } from "./techcrest-icon";

export function NewsletterCta() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setTimeout(() => setStatus("success"), 800);
  };

  return (
    <section className="tc-cta-section">
      <div className="container">
        <div className="tc-cta-card">
          {/* Background gradient orb */}
          <div className="tc-cta-card__orb" aria-hidden="true" />

          <div className="tc-cta-card__inner">
            {/* Left: Copy */}
            <div className="tc-cta-card__copy">
              <div className="tc-cta-card__eyebrow">
                <TechCrestIcon size={14} color="#2D7FF9" />
                <span>TECHCREST DAILY NEWSLETTER</span>
              </div>

              <h2 className="tc-cta-card__headline">
                Stay Ahead of the<br />
                <span className="tc-cta-card__headline-blue">Tech Frontier</span>
              </h2>

              <p className="tc-cta-card__body">
                Join 250,000+ tech leaders receiving our daily tech intelligence, critical analysis, and breaking news delivered straight to your inbox.
              </p>

              <div className="tc-cta-card__features">
                <span className="tc-cta-card__feature">
                  <Zap className="tc-cta-card__feature-icon" />
                  Daily Briefing
                </span>
                <span className="tc-cta-card__feature">
                  <ShieldCheck className="tc-cta-card__feature-icon" />
                  Zero Spam
                </span>
                <span className="tc-cta-card__feature">
                  <Sparkles className="tc-cta-card__feature-icon" />
                  Free Subscription
                </span>
              </div>
            </div>

            {/* Right: Form */}
            <div className="tc-cta-card__form-wrap">
              {status === "success" ? (
                <div className="tc-cta-card__success">
                  <CheckCircle className="tc-cta-card__success-icon" />
                  <p className="tc-cta-card__success-title">You&apos;re Subscribed!</p>
                  <p className="tc-cta-card__success-body">
                    Thank you for subscribing to TechCrest Daily. Check your inbox for your first edition!
                  </p>
                </div>
              ) : (
                <>
                  <p className="tc-cta-card__form-label">Subscribe to TechCrest Daily</p>
                  <form className="tc-cta-card__form" onSubmit={handleSubmit}>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="tc-cta-card__input"
                      required
                    />
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="tc-cta-card__btn"
                    >
                      {status === "loading" ? (
                        "Subscribing…"
                      ) : (
                        <>Subscribe Free <ArrowRight className="tc-cta-card__btn-icon" /></>
                      )}
                    </button>
                  </form>
                  <p className="tc-cta-card__note">
                    No spam. Unsubscribe anytime. Read our{" "}
                    <Link href="/privacy" className="tc-cta-card__note-link">Privacy Policy</Link>.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}