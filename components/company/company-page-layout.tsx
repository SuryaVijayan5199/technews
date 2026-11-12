"use client";

import React from "react";
import Link from "next/link";
import {
  ChevronRight,
  Globe,
  Mail,
  Briefcase,
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
  { href: "/careers", label: "Careers & Pitches", icon: Briefcase },
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
    <div className="tc-company-page">
      <div className="tc-company-container">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="tc-company-breadcrumb">
          <Link href="/" className="tc-company-breadcrumb__link">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
          <span className="tc-company-breadcrumb__parent">Company</span>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
          <span className="tc-company-breadcrumb__current">{title}</span>
        </nav>

        {/* Hero Header */}
        <header className="tc-company-header">
          <div className="tc-company-badge">
            {badgeIcon || <Globe className="w-3.5 h-3.5" />}
            <span>{badge}</span>
          </div>
          <h1 className="tc-company-title">{title}</h1>
          {subtitle && <p className="tc-company-subtitle">{subtitle}</p>}

          <div className="tc-company-meta">
            <span className="tc-company-meta__item">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2D7FF9]" />
              <strong>Independent Technology Journalism</strong>
            </span>
            <span className="tc-company-meta__dot">&bull;</span>
            <span className="tc-company-meta__item">
              Bangalore &bull; Global Newsroom
            </span>
            <span className="tc-company-meta__dot">&bull;</span>
            <span className="tc-company-meta__item text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Fact-Checked
            </span>
          </div>

          {/* Mobile Horizontal Sub-Navigation */}
          <div className="tc-company-mobile-nav">
            <div className="tc-company-mobile-nav__track">
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
                      className="tc-company-mobile-nav__pill"
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </a>
                  );
                }
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`tc-company-mobile-nav__pill ${
                      isActive ? "tc-company-mobile-nav__pill--active" : ""
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </header>

        {/* 2-Column Split Layout */}
        <div className="tc-company-grid">
          {/* Main Content Column */}
          <main className="tc-company-main">{children}</main>

          {/* Sticky Sidebar */}
          <aside className="tc-company-sidebar">
            <div className="tc-company-sidebar__sticky">
              {/* Company Hub Navigation */}
              <div className="tc-company-card mb-5">
                <h3 className="tc-company-card__title">Company Hub</h3>
                <nav className="tc-company-nav-list">
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
                          className="tc-company-nav-link"
                        >
                          <Icon className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
                          <span className="flex-1">{item.label}</span>
                          <ExternalLink className="w-3 h-3 opacity-60" />
                        </a>
                      );
                    }
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`tc-company-nav-link ${
                          isActive ? "tc-company-nav-link--active" : ""
                        }`}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Newsroom Inquiries Card */}
              <div className="tc-company-card tc-company-card--accent mb-5">
                <div className="flex items-center gap-2 mb-2 text-[#2D7FF9] font-bold text-sm">
                  <Mail className="w-4 h-4" />
                  <span>Central Newsdesk</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  Have breaking tips, confidential leaks, or press releases for
                  our global editorial team?
                </p>
                <a
                  href="mailto:editor@techcrest.news"
                  className="tc-company-contact-btn"
                >
                  Email editor@techcrest.news
                </a>
              </div>

              {/* Sister Initiative Card */}
              <div className="tc-company-card">
                <div className="flex items-center gap-2 mb-1.5 text-[var(--color-text-primary)] font-bold text-xs uppercase tracking-wider">
                  <Building2 className="w-3.5 h-3.5 text-[#8b5cf6]" />
                  <span>Sister Initiative</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-2.5">
                  <strong>Raw Pitch:</strong> An independent stage spotlighting
                  early-stage builders, deep-tech research, and founder stories.
                </p>
                <a
                  href="https://rawpitch.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-[#2D7FF9] hover:underline inline-flex items-center gap-1"
                >
                  Explore rawpitch.org <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
