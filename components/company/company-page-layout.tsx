"use client";

import React from "react";
import Link from "next/link";
import {
  Globe,
  Mail,
  Megaphone,
  ExternalLink,
  Building2,
} from "lucide-react";

export interface CompanyPageLayoutProps {
  title: string;
  subtitle?: string;
  currentSlug: string;
  children: React.ReactNode;
}

const COMPANY_NAV = [
  { href: "/about", label: "About", icon: Globe },
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
  subtitle,
  currentSlug,
  children,
}: CompanyPageLayoutProps) {
  return (
    <div className="tc-subpage-shell">
      <div className="tc-subpage-container">
        {/* Masthead Header */}
        <header className="tc-subpage-header">
          <h1 className="tc-subpage-title">{title}</h1>
          {subtitle && <p className="tc-subpage-subtitle">{subtitle}</p>}

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

              {/* Sister Initiative Card - Entire block links to rawpitch */}
              <a
                href="https://rawpitch.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="tc-hub-card block hover:border-[#2D7FF9]/40 transition-colors cursor-pointer group"
                style={{ textDecoration: "none" }}
              >
                <div className="tc-hub-card__header-subtle">
                  <Building2 className="tc-hub-card__header-subtle-icon text-[#2D7FF9]" />
                  <span className="font-bold text-[11px] uppercase tracking-wider text-[#2D7FF9]">Sister Initiative</span>
                </div>
                <p className="tc-hub-card__body-text text-xs leading-relaxed text-[var(--color-text-secondary)] mt-2 mb-3">
                  <strong>RawPitch</strong> is a global media and communications firm connecting ambitious businesses with influential journalists, editors, and publishers across the US, Europe, and Asia-Pacific. With expertise in consumer technology, fintech, and crypto, we offer media introductions, editorial services, executive profiling, content strategy, and digital media consultancy. Built on newsroom experience, industry knowledge, and trusted media relationships, RawPitch helps businesses tell their stories, strengthen their visibility, and build lasting credibility.
                </p>
                <span className="tc-hub-card__link inline-flex items-center gap-1.5 text-xs font-semibold text-[#2D7FF9] group-hover:underline">
                  Explore rawpitch.org
                  <ExternalLink className="tc-hub-card__link-icon w-3.5 h-3.5" />
                </span>
              </a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
