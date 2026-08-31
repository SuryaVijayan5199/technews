"use client";

import Link from "next/link";
import { Rss } from "lucide-react";
import { mainNav, footerNav } from "@/config/nav";
import { TechCrestBrand } from "@/components/shared/techcrest-brand";

const SocialIcon = ({ label }: { label: string }) => {
  if (label.includes("Twitter"))
    return <svg className="footer-social-icon" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>;
  if (label.includes("YouTube"))
    return <svg className="footer-social-icon" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>;
  if (label.includes("LinkedIn"))
    return <svg className="footer-social-icon" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.6a1.4 1.4 0 1 0 1.4 1.4 1.4 1.4 0 0 0-1.4-1.4z" /></svg>;
  return <Rss className="footer-social-icon" />;
};

export function Footer() {
  return (
    <footer className="tc-footer">
      {/* ── Main Content ── */}
      <div className="tc-footer__main">
        <div className="container tc-footer__grid">

          {/* Brand */}
          <div className="tc-footer__brand">
            <TechCrestBrand variant="full" href="/" showTagline={true} />
            <p className="tc-footer__desc">
              Independent technology journalism. Critical insights on devices, software, and ideas shaping our future.
            </p>
            <div className="tc-footer__socials">
              {footerNav.social.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="tc-footer__social-btn"
                  aria-label={link.label}
                >
                  <SocialIcon label={link.label} />
                </a>
              ))}
            </div>
          </div>

          {/* Topics (from mainNav — same as navbar) */}
          <div className="tc-footer__col">
            <h4 className="tc-footer__col-title">Topics</h4>
            <ul className="tc-footer__list">
              {mainNav.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="tc-footer__link">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="tc-footer__col">
            <h4 className="tc-footer__col-title">Company</h4>
            <ul className="tc-footer__list">
              {footerNav.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="tc-footer__link">{link.label}</Link>
                </li>
              ))}
            </ul>
            <h4 className="tc-footer__col-title" style={{ marginTop: "1.25rem" }}>Subscribe</h4>
            <ul className="tc-footer__list">
              <li><Link href="/feed.xml" className="tc-footer__link">RSS Feed</Link></li>
              <li><Link href="/podcasts" className="tc-footer__link">Podcasts</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="tc-footer__col">
            <h4 className="tc-footer__col-title">Legal</h4>
            <ul className="tc-footer__list">
              {footerNav.legal.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="tc-footer__link">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="tc-footer__bottom">
        <div className="container tc-footer__bottom-inner">
          <p className="tc-footer__copy">
            © {new Date().getFullYear()} TechCrest. All rights reserved.
          </p>
          <div className="tc-footer__bottom-links">
            <Link href="/privacy" className="tc-footer__bottom-link">Privacy</Link>
            <Link href="/terms" className="tc-footer__bottom-link">Terms</Link>
            <Link href="/contact" className="tc-footer__bottom-link">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
