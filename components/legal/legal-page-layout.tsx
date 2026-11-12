"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, FileText, Shield, Cookie, BookOpen, DollarSign, Mail, CheckCircle2 } from "lucide-react";

export interface LegalTocItem {
  id: string;
  title: string;
  num?: number;
}

interface LegalPageLayoutProps {
  title: string;
  badge: string;
  badgeIcon?: React.ReactNode;
  lastUpdated?: string;
  readingTime?: string;
  currentSlug: string;
  tableOfContents?: LegalTocItem[];
  introTitle?: string;
  introText?: string;
  introNote?: string;
  contactEmail?: string;
  children: React.ReactNode;
}

const LEGAL_NAV = [
  { href: "/privacy", label: "Privacy Policy", icon: Shield },
  { href: "/terms", label: "Terms of Service", icon: FileText },
  { href: "/cookies", label: "Cookie Policy", icon: Cookie },
  { href: "/editorial-policy", label: "Editorial Policy", icon: BookOpen },
  { href: "/affiliate-disclosure", label: "Affiliate Disclosure", icon: DollarSign },
];

export function LegalPageLayout({
  title,
  badge,
  badgeIcon,
  lastUpdated = "October 2026",
  readingTime = "6 min read",
  currentSlug,
  tableOfContents = [],
  introTitle,
  introText,
  introNote,
  contactEmail = "editor@techcrest.news",
  children,
}: LegalPageLayoutProps) {
  return (
    <div className="tc-legal-page">
      <div className="tc-legal-container">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="tc-legal-breadcrumb">
          <Link href="/" className="tc-legal-breadcrumb__link">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
          <span className="tc-legal-breadcrumb__parent">Legal & Trust</span>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
          <span className="tc-legal-breadcrumb__current">{title}</span>
        </nav>

        {/* Hero Header */}
        <header className="tc-legal-header">
          <div className="tc-legal-badge">
            {badgeIcon || <Shield className="w-3.5 h-3.5" />}
            <span>{badge}</span>
          </div>
          <h1 className="tc-legal-title">{title}</h1>
          <div className="tc-legal-meta">
            <span className="tc-legal-meta__item">
              <strong>Last Updated:</strong> {lastUpdated}
            </span>
            <span className="tc-legal-meta__dot">&bull;</span>
            <span className="tc-legal-meta__item">{readingTime}</span>
            <span className="tc-legal-meta__dot">&bull;</span>
            <span className="tc-legal-meta__item text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Official Standards
            </span>
          </div>
        </header>

        {/* 2-Column Split Layout */}
        <div className="tc-legal-grid">
          {/* Main Content Column */}
          <main className="tc-legal-main">
            {introText && (
              <div className="tc-legal-intro-card">
                {introTitle && <h2 className="tc-legal-intro-title">{introTitle}</h2>}
                <p className="tc-legal-intro-text">{introText}</p>
                {introNote && <p className="tc-legal-intro-note">{introNote}</p>}
              </div>
            )}

            <div className="tc-legal-sections">
              {children}
            </div>
          </main>

          {/* Sticky Sidebar */}
          <aside className="tc-legal-sidebar">
            <div className="tc-legal-sidebar__sticky">
              {/* Table of Contents */}
              {tableOfContents.length > 0 && (
                <div className="tc-legal-card mb-5">
                  <h3 className="tc-legal-card__title">On This Page</h3>
                  <nav className="tc-legal-toc">
                    {tableOfContents.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className="tc-legal-toc__link"
                      >
                        {item.num !== undefined && (
                          <span className="tc-legal-toc__num">{item.num}</span>
                        )}
                        <span>{item.title}</span>
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              {/* Legal Hub Navigation */}
              <div className="tc-legal-card mb-5">
                <h3 className="tc-legal-card__title">Legal & Trust Hub</h3>
                <nav className="tc-legal-nav-list">
                  {LEGAL_NAV.map((item) => {
                    const isActive = currentSlug === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`tc-legal-nav-link ${isActive ? "tc-legal-nav-link--active" : ""}`}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Contact / Help Card */}
              <div className="tc-legal-card tc-legal-card--accent">
                <div className="flex items-center gap-2 mb-2 text-[#2D7FF9] font-bold text-sm">
                  <Mail className="w-4 h-4" />
                  <span>Official Inquiries</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  Questions regarding our policies, privacy rights, or editorial standards?
                </p>
                <a
                  href={`mailto:${contactEmail}`}
                  className="tc-legal-contact-btn"
                >
                  Contact Desk
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
