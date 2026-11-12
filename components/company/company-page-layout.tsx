"use client";

import React from "react";
import Link from "next/link";
import {
  ChevronRight,
  Globe,
  Mail,
  Megaphone,
  ExternalLink,
  ShieldCheck,
  Building2,
  CheckCircle2,
} from "lucide-react";

export interface CompanyPageLayoutProps {
  title: string;
  badge: string;
  badgeIcon?: React.ReactNode;
  subtitle?: string;
  currentSlug: string;
  children: React.ReactNode;
}

const COMPANY_NAV = [
  { href: "/about", label: "About Us", icon: Globe },
  { href: "/contact", label: "Contact Desk", icon: Mail },
  { href: "/advertise", label: "Advertise & Media", icon: Megaphone },
  {
    href: "https://rawpitch.org/",
    label: "Raw Pitch",
    icon: ExternalLink,
    isExternal: true,
  },
];

export function CompanyPageLayout({
  title,
  badge,
  badgeIcon,
  subtitle,
  currentSlug,
  children,
}: CompanyPageLayoutProps) {
  return (
    <div className="tc-subpage-shell">
      <div className="tc-subpage-container">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="tc-subpage-breadcrumb">
          <Link href="/" className="tc-subpage-breadcrumb__link">
            Home
          </Link>
          <ChevronRight className="tc-subpage-breadcrumb__separator" />
          <span className="tc-subpage-breadcrumb__parent">Company</span>
          <ChevronRight className="tc-subpage-breadcrumb__separator" />
          <span className="tc-subpage-breadcrumb__current">{title}</span>
        </nav>

        {/* Masthead Header */}
        <header className="tc-subpage-header">
          <div className="tc-subpage-badge">
            {badgeIcon || <Globe className="tc-subpage-badge__icon" />}
            <span>{badge}</span>
          </div>
          <h1 className="tc-subpage-title">{title}</h1>
          {subtitle && <p className="tc-subpage-subtitle">{subtitle}</p>}

          <div className="tc-subpage-meta">
            <span className="tc-subpage-meta__item">
              <ShieldCheck className="tc-subpage-meta__icon" />
              <strong>Independent Technology Journalism</strong>
            </span>
            <span className="tc-subpage-meta__dot">&bull;</span>
            <span className="tc-subpage-meta__item">
              Bangalore &bull; Global Newsroom
            </span>
            <span className="tc-subpage-meta__dot">&bull;</span>
            <span className="tc-subpage-meta__item tc-subpage-meta__item--verified">
              <CheckCircle2 className="tc-subpage-meta__icon" />
              100% Fact-Checked
            </span>
          </div>

          {/* Mobile Horizontal Sub-Navigation */}
          <div className="tc-hub-mobile-nav">
            <div className="tc-hub-mobile-track">
              {COMPANY_NAV.map((item) => {
                const isActive = currentSlug === item.href;
                const Icon = item.icon;
                if (item.isExternal) {
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tc-hub-mobile-pill"
                    >
                      <Icon className="tc-hub-mobile-pill__icon" />
                      <span>{item.label}</span>
                    </a>
                  );
                }
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
          <main className="tc-subpage-main">{children}</main>

          {/* Desktop Sticky Sidebar */}
          <aside className="tc-hub-sidebar">
            <div className="tc-hub-sidebar__sticky">
              {/* Company Hub Navigation Card */}
              <div className="tc-hub-card">
                <h3 className="tc-hub-card__title">Company Hub</h3>
                <nav className="tc-hub-nav-list">
                  {COMPANY_NAV.map((item) => {
                    const isActive = currentSlug === item.href;
                    const Icon = item.icon;
                    if (item.isExternal) {
                      return (
                        <a
                          key={item.href}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="tc-hub-nav-link"
                        >
                          <Icon className="tc-hub-nav-link__icon" />
                          <span className="tc-hub-nav-link__label">
                            {item.label}
                          </span>
                          <ExternalLink className="tc-hub-nav-link__external" />
                        </a>
                      );
                    }
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

              {/* Newsroom Inquiries Card */}
              <div className="tc-hub-card tc-hub-card--accent">
                <div className="tc-hub-card__header-accent">
                  <Mail className="tc-hub-card__header-icon" />
                  <span>Central Newsdesk</span>
                </div>
                <p className="tc-hub-card__body-text">
                  Have breaking tips, confidential leaks, or press releases for
                  our global editorial team?
                </p>
                <a
                  href="mailto:editor@techcrest.news"
                  className="tc-hub-contact-btn"
                >
                  Email editor@techcrest.news
                </a>
              </div>

              {/* Sister Initiative Card */}
              <div className="tc-hub-card">
                <div className="tc-hub-card__header-subtle">
                  <Building2 className="tc-hub-card__header-subtle-icon" />
                  <span>Sister Initiative</span>
                </div>
                <p className="tc-hub-card__body-text">
                  <strong>Raw Pitch:</strong> An independent stage spotlighting
                  early-stage builders, deep-tech research, and founder stories.
                </p>
                <a
                  href="https://rawpitch.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tc-hub-card__link"
                >
                  Explore rawpitch.org
                  <ExternalLink className="tc-hub-card__link-icon" />
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
