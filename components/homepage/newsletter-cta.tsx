"use client";

import { useState } from "react";
import { Sparkles, CheckCircle, ShieldCheck, Zap, ArrowRight } from "lucide-react";
import { TechCrestIcon } from "@/components/shared/techcrest-icon";

export function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 800));
    setStatus("success");
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
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span className="premium-cta__success-text">
              Welcome to TechCrest Premium! Check your inbox to activate your 14-day pass.
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
              {status === "loading" ? "Subscribing..." : <>Join Free <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        )}

        <p className="premium-cta__footer-note">
          14-day free trial. Read our Privacy Policy.
        </p>
      </div>
    </div>
  );
}