"use client";

import React from "react";
import Link from "next/link";
import {
  ChevronRight,
  FileText,
  Shield,
  Cookie,
  BookOpen,
  DollarSign,
  Mail,
  CheckCircle2,
} from "lucide-react";

export interface LegalTocItem {
  id: string;
  title: string;
  num?: number;
}

interface LegalPageLayoutProps {
  title: string;
  badge: string;
  badgeIcon?: React.ReactNode;
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
  {
    href: "/affiliate-disclosure",
    label: "Affiliate Disclosure",
    icon: DollarSign,
  },
];

export function LegalPageLayout({
  title,
  badge,
  badgeIcon,
  currentSlug,
  tableOfContents = [],
  introTitle,
  introText,
  introNote,
  contactEmail = "editor@techcrest.news",
  children,
}: LegalPageLayoutProps) {
  return (
    <div className="tc-subpage-shell">
      <div className="tc-subpage-container">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="tc-subpage-breadcrumb">
          <Link href="/" className="tc-subpage-breadcrumb__link">
            Home
          </Link>
          <ChevronRight className="tc-subpage-breadcrumb__separator" />
          <span className="tc-subpage-breadcrumb__parent">Legal & Trust</span>
          <ChevronRight className="tc-subpage-breadcrumb__separator" />
          <span className="tc-subpage-breadcrumb__current">{title}</span>
        </nav>

        {/* Masthead Header */}
        <header className="tc-subpage-header">
          <div className="tc-subpage-badge">
            {badgeIcon || <Shield className="tc-subpage-badge__icon" />}
            <span>{badge}</span>
          </div>
          <h1 className="tc-subpage-title">{title}</h1>

          {/* Mobile Horizontal Sub-Navigation */}
          <div className="tc-hub-mobile-nav">
            <div className="tc-hub-mobile-track">
              {LEGAL_NAV.map((item) => {
                const isActive = currentSlug === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`tc-hub-mobile-pill ${
                      isActive ? "tc-hub-mobile-pill--active" : ""
                    }`}
                  >
                    <Icon className="tc-hub-mobile-pill__icon" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </header>

        {/* 2-Column Split Layout */}
        <div className="tc-subpage-grid">
          {/* Main Content Column */}
          <main className="tc-subpage-main">
            {introText && (
              <div className="tc-legal-intro-card">
                {introTitle && (
                  <h2 className="tc-legal-intro-title">{introTitle}</h2>
                )}
                <p className="tc-legal-intro-text">{introText}</p>
                {introNote && (
                  <p className="tc-legal-intro-note">{introNote}</p>
                )}
              </div>
            )}

            <div className="tc-editorial-block">{children}</div>
          </main>

          {/* Desktop Sticky Sidebar */}
          <aside className="tc-hub-sidebar">
            <div className="tc-hub-sidebar__sticky">
              {/* Table of Contents */}
              {tableOfContents.length > 0 && (
                <div className="tc-hub-card">
                  <h3 className="tc-hub-card__title">On This Page</h3>
                  <nav className="tc-legal-toc">
                    {tableOfContents.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className="tc-legal-toc__link"
                      >
                        {item.num !== undefined && (
                          <span className="tc-legal-toc__num">
                            {item.num < 10 ? `0${item.num}` : item.num}
                          </span>
                        )}
                        <span>{item.title}</span>
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              {/* Legal Hub Navigation */}
              <div className="tc-hub-card">
                <h3 className="tc-hub-card__title">Legal & Trust Hub</h3>
                <nav className="tc-hub-nav-list">
                  {LEGAL_NAV.map((item) => {
                    const isActive = currentSlug === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`tc-hub-nav-link ${
                          isActive ? "tc-hub-nav-link--active" : ""
                        }`}
                      >
                        <Icon className="tc-hub-nav-link__icon" />
                        <span className="tc-hub-nav-link__label">
                          {item.label}
                        </span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Official Inquiries Card */}
              <div className="tc-hub-card tc-hub-card--accent">
                <div className="tc-hub-card__header-accent">
                  <Mail className="tc-hub-card__header-icon" />
                  <span>Official Inquiries</span>
                </div>
                <p className="tc-hub-card__body-text">
                  Questions regarding our policies, privacy rights, or editorial
                  standards?
                </p>
                <a
                  href={`mailto:${contactEmail}`}
                  className="tc-hub-contact-btn"
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
