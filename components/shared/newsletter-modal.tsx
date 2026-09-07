"use client";

import { useState, useEffect } from "react";
import { X, Mail, CheckCircle, ArrowRight } from "lucide-react";
import { subscribeToNewsletterAction } from "@/lib/actions/newsletter.actions";

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewsletterModal({ isOpen, onClose }: NewsletterModalProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const result = await subscribeToNewsletterAction(email);
      setLoading(false);
      if (result.success) {
        setSubmitted(true);
        setMessage(result.message || "Thank you for subscribing to TechCrest Daily!");
        setTimeout(() => {
          onClose();
          setSubmitted(false);
          setEmail("");
        }, 2500);
      } else {
        alert(result.error || "Failed to subscribe. Please try again.");
      }
    } catch (err: any) {
      setLoading(false);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="tc-newsletter-modal-overlay" onClick={onClose}>
      <div
        className="tc-newsletter-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="tc-newsletter-modal-close"
          aria-label="Close modal"
          type="button"
        >
          <X size={20} />
        </button>

        <div className="tc-newsletter-modal-header">
          <Mail size={16} />
          <span>TechCrest Daily Intelligence</span>
        </div>

        <h3 className="tc-newsletter-modal-title">
          Subscribe to TechCrest
        </h3>
        <p className="tc-newsletter-modal-desc">
          Receive daily tech intelligence, executive analysis, and breaking market signals delivered directly to your inbox.
        </p>

        {submitted ? (
          <div className="tc-newsletter-modal-success">
            <CheckCircle size={32} className="tc-newsletter-modal-success-icon" />
            <p className="tc-newsletter-modal-success-title">You&apos;re Subscribed!</p>
            <p className="tc-newsletter-modal-success-desc">{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ margin: 0 }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email or gmail..."
              className="tc-newsletter-modal-input"
              required
              autoFocus
            />
            <button
              type="submit"
              disabled={loading}
              className="tc-newsletter-modal-btn"
            >
              {loading ? (
                "Subscribing..."
              ) : (
                <>
                  <span>Subscribe Now</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
