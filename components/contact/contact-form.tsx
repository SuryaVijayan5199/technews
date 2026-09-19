"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, ShieldCheck } from "lucide-react";

export function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "tip",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 800);
  };

  if (isSubmitted) {
    return (
      <div className="tc-contact-card tc-contact-success">
        <div className="tc-contact-success-icon">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="tc-contact-success-title">
          Message Sent Successfully!
        </h2>
        <p className="tc-contact-success-desc">
          Thank you for reaching out to TechCrest. Our editorial desk has received your note and will review it promptly.
        </p>
        <button
          type="button"
          onClick={() => {
            setIsSubmitted(false);
            setFormData({ name: "", email: "", subject: "tip", message: "" });
          }}
          className="btn btn-outline text-sm"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div className="tc-contact-card">
      <div className="tc-contact-form-header">
        <div>
          <h2 className="tc-contact-form-header__title">
            Send Us a Message
          </h2>
          <p className="tc-contact-form-header__sub">
            Fill out the form below to reach our newsroom or business team.
          </p>
        </div>
        <div className="tc-contact-badge-security">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Encrypted & Confidential</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="tc-contact-form">
        <div className="tc-contact-form-row">
          <div className="tc-contact-field-group">
            <label htmlFor="contact-name" className="tc-contact-field-label">
              Your Name *
            </label>
            <input
              id="contact-name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="tc-contact-field-input"
              required
            />
          </div>
          <div className="tc-contact-field-group">
            <label htmlFor="contact-email" className="tc-contact-field-label">
              Email Address *
            </label>
            <input
              id="contact-email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="tc-contact-field-input"
              required
            />
          </div>
        </div>

        <div className="tc-contact-field-group">
          <label htmlFor="contact-subject" className="tc-contact-field-label">
            Inquiry Type / Subject *
          </label>
          <select
            id="contact-subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="tc-contact-field-select"
          >
            <option value="tip">🚨 News Tip / Confidential Leak</option>
            <option value="review">📱 Product Review Request / Hardware Sample</option>
            <option value="press">📰 Press Release & Media Inquiry</option>
            <option value="advertising">💼 Advertising & Brand Partnerships</option>
            <option value="correction">✏️ Editorial Correction / Feedback</option>
            <option value="other">💬 General Inquiry</option>
          </select>
        </div>

        <div className="tc-contact-field-group">
          <label htmlFor="contact-message" className="tc-contact-field-label">
            Message *
          </label>
          <textarea
            id="contact-message"
            rows={5}
            placeholder="Type your message or news details here..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="tc-contact-field-textarea"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="tc-contact-submit-btn"
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Sending Message...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
