"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Menu, X, User } from "lucide-react";
import { mainNav } from "@/config/nav";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { TechCrestBrand } from "@/components/shared/techcrest-brand";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;
  const role = (session?.user as any)?.role ?? "subscriber";

  const STAFF_ROLES = ["super_admin", "publisher", "managing_editor", "editor", "author", "reviewer", "contributor"];
  const isStaff = STAFF_ROLES.includes(role);
  const isSuperAdmin = role === "super_admin";

  const userDestination = !isLoggedIn
    ? "/login"
    : isSuperAdmin
    ? "/dashboard"
    : isStaff
    ? "/dashboard/articles"
    : "/profile";

  const userLabel = !isLoggedIn
    ? "Sign In"
    : isSuperAdmin
    ? "Dashboard"
    : isStaff
    ? "Editor"
    : "Profile";

  return (
    <>
      {/* ── Main Header ── */}
      <header className={`tc-site-header${isScrolled ? " tc-site-header--scrolled" : ""}`}>
        <div className="tc-site-header__inner">

          {/* LEFT: Logo */}
          <TechCrestBrand variant="full" href="/" showTagline={true} className="tc-site-header__logo" />

          {/* CENTER: Desktop nav links — only visible lg+ */}
          <nav className="tc-site-header__nav" aria-label="Main navigation">
            {mainNav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="tc-site-header__nav-link"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* RIGHT: Actions */}
          <div className="tc-site-header__actions">
            {/* Theme toggle — always visible */}
            <ThemeToggle />

            {/* Sign In / Dashboard — hidden on very small screens, shown sm+ */}
            <Button asChild id="header-user-btn" className="tc-site-header__user-btn">
              <Link href={userDestination}>
                <User className="tc-site-header__user-icon" />
                <span className="tc-site-header__user-label">{userLabel}</span>
              </Link>
            </Button>

            {/* Mobile hamburger — only visible below lg */}
            <button
              id="mobile-menu-toggle"
              className="tc-site-header__hamburger"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer Overlay ── */}
      {mobileMenuOpen && (
        <div
          className="tc-mobile-overlay"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        >
          <div
            className="tc-mobile-panel"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {/* Panel Header */}
            <div className="tc-mobile-panel__top">
              <TechCrestBrand variant="compact" href="/" />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="tc-mobile-panel__close"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Topic Grid */}
            <div className="tc-mobile-panel__body">
              <p className="tc-mobile-panel__label">Explore Topics</p>
              <div className="tc-mobile-panel__grid">
                {mainNav.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="tc-mobile-panel__topic"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="tc-mobile-panel__dot" />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Panel Footer */}
            <div className="tc-mobile-panel__footer">
              <div className="tc-mobile-panel__theme-row">
                <span>Appearance</span>
                <ThemeToggle />
              </div>
              <Button asChild className="tc-mobile-panel__cta" size="lg">
                <Link href={userDestination} onClick={() => setMobileMenuOpen(false)}>
                  <User className="w-4 h-4 mr-2" />
                  {userLabel}
                </Link>
              </Button>
              {isLoggedIn && (
                <p className="tc-mobile-panel__email">
                  Signed in as <strong>{session?.user?.email}</strong>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
