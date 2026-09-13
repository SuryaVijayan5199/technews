"use client";

import { useState } from "react";
import { Sparkles, CheckCircle, ShieldCheck, Zap, ArrowRight } from "lucide-react";
import { TechCrestIcon } from "@/components/shared/techcrest-icon";
import { subscribeToNewsletterAction } from "@/lib/actions/newsletter.actions";

export function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      const result = await subscribeToNewsletterAction({ email });
      if (result?.error) {
        setErrorMsg(result.error);
        setStatus("error");
      } else {
        setStatus("success");
      }
    } catch {
      setErrorMsg("Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  return (
    <div className="premium-cta card">
      <div className="premium-cta__glow" aria-hidden="true" />
      
      <div className="premium-cta__inner">
        <div className="premium-cta__badge">
          <TechCrestIcon size={16} color="#2D7FF9" />
          <span>TECHCREST PREMIUM &amp; INSIDER BRIEFING</span>
        </div>

        <h2 className="premium-cta__title">
          Experience TechCrest Without Limits
        </h2>
        <p className="premium-cta__subtitle">
          Get exclusive daily executive briefings, 100% ad-free reading, deep-dive technical reports, and instant access to our private insider community.
        </p>

        {/* Benefits Grid */}
        <div className="premium-cta__benefits">
          <div className="premium-cta__benefit">
            <Zap className="premium-cta__benefit-icon" />
            <span>Daily Executive Briefing</span>
          </div>
          <div className="premium-cta__benefit">
            <ShieldCheck className="premium-cta__benefit-icon" />
            <span>100% Ad-Free Experience</span>
          </div>
          <div className="premium-cta__benefit">
            <Sparkles className="premium-cta__benefit-icon" />
            <span>Exclusive Deep-Dive Analysis</span>
          </div>
        </div>

        {status === "success" ? (
          <div className="premium-cta__success">
            <CheckCircle className="tc-cta-icon--success" />
            <span className="premium-cta__success-text">
              You&apos;re in! Check your inbox to confirm your subscription.
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="premium-cta__form">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your work email address"
              className="input premium-cta__input"
              required
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="btn premium-cta__btn"
            >
              {status === "loading" ? "Subscribing..." : <>Join Free <ArrowRight className="tc-btn-icon" /></>}
            </button>
            {status === "error" && errorMsg && (
              <p style={{ color: "hsl(var(--color-error, 0 84% 60%))", fontSize: "0.8rem", marginTop: "0.5rem" }}>
                {errorMsg}
              </p>
            )}
          </form>
        )}

        <p className="premium-cta__footer-note">
          Free newsletter. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}