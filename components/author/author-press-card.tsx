"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  CreditCard,
  Download,
  Mail,
  Phone,
  X,
  Check,
  Share2,
  Sun,
  Moon,
  Globe,
  RotateCcw,
  Sparkles,
  Layers,
  Sliders,
} from "lucide-react";

export interface AuthorPressCardModalProps {
  author: {
    id?: number;
    displayName: string;
    slug?: string;
    bio?: string;
    avatar?: string;
    user?: {
      email?: string;
      role?: string;
    };
  };
  onClose: () => void;
}

const ROLE_PRESETS = [
  "Managing Editor",
  "Senior Tech Editor",
  "Tech Journalist",
  "Hardware & Gadget Reviewer",
  "AI Research Analyst",
  "Lead Technology Reporter",
];

const MISSION_PRESETS = [
  {
    label: "Official Mission",
    text: "Our mission is to make technology understandable, accessible, and relevant to everyone through news, insights and impact.",
  },
  {
    label: "No-Hype Creed",
    text: "Clear reporting, real numbers and zero hype. Deep investigative technology and financial media analysis.",
  },
  {
    label: "Hardware & AI",
    text: "Accurate reporting, hands-on hardware critiques, and sharp technical analysis of breakthroughs shaping our world.",
  },
];

export function AuthorPressCardModal({ author, onClose }: AuthorPressCardModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Format default role
  const defaultRole =
    author.displayName.toLowerCase().includes("bibhu")
      ? "Managing Editor"
      : author.user?.role
      ? author.user.role
          .split("_")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ")
      : "Tech Journalist & Contributor";

  const defaultMission =
    "Our mission is to make technology understandable, accessible, and relevant to everyone through news, insights and impact.";

  const [name, setName] = useState(author.displayName || "Editorial Contributor");
  const [role, setRole] = useState(defaultRole);
  const [email, setEmail] = useState(author.user?.email || "editor@techcrest.news");
  const [phone, setPhone] = useState("+91 987 1034 296");
  const [website, setWebsite] = useState("www.techcrest.news");
  const [address, setAddress] = useState("8614 Compatible Way, Charlotte, North Carolina 28262");
  const [mission, setMission] = useState(defaultMission);

  // Theme: "light" (default) or "dark"
  const [cardTheme, setCardTheme] = useState<"light" | "dark">("light");
  // Active Tab: "front" | "back" | "both" (default: "both" for studio side-by-side, responsive on mobile)
  const [activeTab, setActiveTab] = useState<"front" | "back" | "both">("both");
  // Preview Scale: "normal" | "compact" (compact helps laptop screens view everything comfortably)
  const [cardScale, setCardScale] = useState<"normal" | "compact">("normal");

  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  // Reset to author defaults
  const handleReset = () => {
    setName(author.displayName || "Editorial Contributor");
    setRole(defaultRole);
    setEmail(author.user?.email || "editor@techcrest.news");
    setPhone("+91 987 1034 296");
    setWebsite("www.techcrest.news");
    setAddress("8614 Compatible Way, Charlotte, North Carolina 28262");
    setMission(defaultMission);
  };

  // SVG T-logo as inline vector with explicit sizing safeguards
  const logoSvg = (
    <svg viewBox="0 0 1024 1024" style={{ width: "100%", height: "100%", display: "block" }}>
      <defs>
        <linearGradient id="tcCardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00D2FF" />
          <stop offset="100%" stopColor="#2D7FF9" />
        </linearGradient>
      </defs>
      <g fill="url(#tcCardGrad)">
        <rect x="295" y="306" width="120" height="36" rx="18" />
        <rect x="450" y="306" width="370" height="36" rx="18" />
        <rect x="232" y="382" width="100" height="36" rx="18" />
        <rect x="368" y="382" width="410" height="38" rx="18" />
        <rect x="186" y="458" width="96" height="36" rx="18" />
        <rect x="310" y="458" width="136" height="36" rx="18" />
        <path d="M 520 390 L 660 390 L 535 680 A 18 18 0 0 1 517 698 L 413 698 A 19 19 0 0 1 395 680 Z" />
      </g>
    </svg>
  );

  // High-Resolution 300 DPI Canvas Generation & Export
  const downloadCardAsImage = async (side: "front" | "back" | "both") => {
    setIsExporting(true);
    try {
      const width = 1050; // 3.5 in * 300 dpi standard business card
      const height = 600; // 2 in * 300 dpi standard business card
      const scale = 2; // 2x supersampling for ultra-crisp retina typography

      // Preload official logo image for high-res canvas rendering
      const logoImg = new Image();
      logoImg.crossOrigin = "anonymous";
      logoImg.src = "/brand/techcrest-card-logo.png";
      await new Promise<void>((resolve) => {
        if (logoImg.complete && logoImg.naturalWidth > 0) return resolve();
        logoImg.onload = () => resolve();
        logoImg.onerror = () => resolve();
      });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const drawFront = (context: CanvasRenderingContext2D, offsetY = 0) => {
        // Pure White Cardstock
        context.fillStyle = "#FFFFFF";
        context.fillRect(0, offsetY, width, height);

        // Subtle Outer Card Border
        context.strokeStyle = "#E2E8F0";
        context.lineWidth = 3;
        context.strokeRect(2, offsetY + 2, width - 4, height - 4);

        // Author Name
        context.fillStyle = "#0A192F";
        context.font = "bold 44px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        context.fillText(name, 60, offsetY + 95);

        // Role / Title
        context.fillStyle = "#2D7FF9";
        context.font = "bold 24px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        context.fillText(role.toUpperCase(), 60, offsetY + 138);

        // Accent Gradient Bar
        const lineGrad = context.createLinearGradient(60, offsetY + 155, 130, offsetY + 155);
        lineGrad.addColorStop(0, "#00D2FF");
        lineGrad.addColorStop(1, "#2D7FF9");
        context.fillStyle = lineGrad;
        context.beginPath();
        context.roundRect(60, offsetY + 155, 60, 5, 3);
        context.fill();

        // Top-Right Official Logo Image
        if (logoImg.naturalWidth > 0) {
          const lW = 270;
          const lH = (lW * logoImg.naturalHeight) / logoImg.naturalWidth;
          context.drawImage(logoImg, width - lW - 60, offsetY + 45, lW, lH);
        }

        // Contact Info Rows
        context.fillStyle = "#2D7FF9";
        context.font = "bold 20px -apple-system, BlinkMacSystemFont, sans-serif";
        context.fillText("✉", 60, offsetY + 225);
        context.fillStyle = "#1E293B";
        context.font = "500 22px -apple-system, BlinkMacSystemFont, sans-serif";
        context.fillText(email, 95, offsetY + 225);

        context.fillStyle = "#2D7FF9";
        context.fillText("📞", 60, offsetY + 268);
        context.fillStyle = "#1E293B";
        context.font = "500 22px -apple-system, BlinkMacSystemFont, sans-serif";
        context.fillText(phone, 95, offsetY + 268);

        context.fillStyle = "#2D7FF9";
        context.fillText("🌐", 60, offsetY + 310);
        context.fillStyle = "#1E293B";
        context.font = "500 22px -apple-system, BlinkMacSystemFont, sans-serif";
        context.fillText(website, 95, offsetY + 310);

        // Mission / Statement Dynamic Auto-wrap with dedicated spacing
        context.font = "400 18px -apple-system, BlinkMacSystemFont, sans-serif";
        const maxTextW = width - 140;
        const words = mission.split(" ");
        let l1 = "";
        let l2 = "";
        let isL1 = true;

        for (const w of words) {
          if (isL1) {
            if (context.measureText(l1 + w + " ").width < maxTextW) {
              l1 += w + " ";
            } else {
              isL1 = false;
              l2 += w + " ";
            }
          } else {
            if (context.measureText(l2 + w + " ").width < maxTextW) {
              l2 += w + " ";
            }
          }
        }

        // Draw Line 1 with optional "Our mission" highlight
        if (l1.startsWith("Our mission")) {
          context.font = "bold 18px -apple-system, BlinkMacSystemFont, sans-serif";
          context.fillStyle = "#2D7FF9";
          context.fillText("Our mission", 60, offsetY + 372);

          const preW = context.measureText("Our mission ").width;
          context.font = "400 18px -apple-system, BlinkMacSystemFont, sans-serif";
          context.fillStyle = "#475569";
          context.fillText(l1.replace("Our mission", "").trim(), 60 + preW, offsetY + 372);
        } else {
          context.font = "500 18px -apple-system, BlinkMacSystemFont, sans-serif";
          context.fillStyle = "#334155";
          context.fillText(l1.trim(), 60, offsetY + 372);
        }

        // Draw Line 2
        if (l2.trim()) {
          context.font = "400 18px -apple-system, BlinkMacSystemFont, sans-serif";
          context.fillStyle = "#475569";
          context.fillText(l2.trim(), 60, offsetY + 400);
        }

        // Divider
        context.strokeStyle = "#E2E8F0";
        context.lineWidth = 1.5;
        context.beginPath();
        context.moveTo(60, offsetY + 440);
        context.lineTo(width - 60, offsetY + 440);
        context.stroke();

        // Footer Brand & Address
        context.font = "bold 20px -apple-system, BlinkMacSystemFont, sans-serif";
        context.fillStyle = "#2D7FF9";
        context.fillText("TechCrest.News", 60, offsetY + 490);

        context.fillStyle = "#94A3B8";
        context.fillText("|", 230, offsetY + 490);

        context.font = "400 18px -apple-system, BlinkMacSystemFont, sans-serif";
        context.fillStyle = "#475569";
        context.fillText(address, 250, offsetY + 490);
      };

      const drawBack = (context: CanvasRenderingContext2D, offsetY = 0) => {
        if (cardTheme === "light") {
          // Light Executive Visiting Card Theme
          const bgGrad = context.createLinearGradient(0, offsetY, width, offsetY + height);
          bgGrad.addColorStop(0, "#FFFFFF");
          bgGrad.addColorStop(0.5, "#F8FAFC");
          bgGrad.addColorStop(1, "#EFF6FF");
          context.fillStyle = bgGrad;
          context.fillRect(0, offsetY, width, height);

          // Outer hairline
          context.strokeStyle = "rgba(45, 127, 249, 0.3)";
          context.lineWidth = 3;
          context.strokeRect(25, offsetY + 25, width - 50, height - 50);

          // Inner accent frame
          context.strokeStyle = "rgba(45, 127, 249, 0.12)";
          context.lineWidth = 1.5;
          context.strokeRect(38, offsetY + 38, width - 76, height - 76);

          // Center Official Logo Image
          if (logoImg.naturalWidth > 0) {
            const lW = 540;
            const lH = (lW * logoImg.naturalHeight) / logoImg.naturalWidth;
            const lX = (width - lW) / 2;
            const lY = offsetY + (height - lH) / 2 - 25;
            context.drawImage(logoImg, lX, lY, lW, lH);
          }

          // Web URL (Official Editorial Credential Removed as Requested)
          context.fillStyle = "#0A192F";
          context.font = "bold 22px -apple-system, BlinkMacSystemFont, sans-serif";
          context.textAlign = "center";
          context.fillText(website, width / 2, offsetY + height - 60);
          context.textAlign = "left";
        } else {
          // Executive Navy Dark Theme
          const bgGrad = context.createRadialGradient(
            width / 2,
            offsetY + height / 2,
            50,
            width / 2,
            offsetY + height / 2,
            width / 1.5
          );
          bgGrad.addColorStop(0, "#0C2346");
          bgGrad.addColorStop(1, "#071529");
          context.fillStyle = bgGrad;
          context.fillRect(0, offsetY, width, height);

          context.strokeStyle = "rgba(45, 127, 249, 0.35)";
          context.lineWidth = 3;
          context.strokeRect(30, offsetY + 30, width - 60, height - 60);

          // Center Logo
          if (logoImg.naturalWidth > 0) {
            const lW = 540;
            const lH = (lW * logoImg.naturalHeight) / logoImg.naturalWidth;
            const lX = (width - lW) / 2;
            const lY = offsetY + (height - lH) / 2 - 25;
            context.drawImage(logoImg, lX, lY, lW, lH);
          }

          // Web URL (Official Editorial Credential Removed as Requested)
          context.fillStyle = "#FFFFFF";
          context.font = "bold 22px -apple-system, BlinkMacSystemFont, sans-serif";
          context.textAlign = "center";
          context.fillText(website, width / 2, offsetY + height - 60);
          context.textAlign = "left";
        }
      };

      if (side === "front") {
        canvas.width = width * scale;
        canvas.height = height * scale;
        ctx.scale(scale, scale);
        drawFront(ctx, 0);
      } else if (side === "back") {
        canvas.width = width * scale;
        canvas.height = height * scale;
        ctx.scale(scale, scale);
        drawBack(ctx, 0);
      } else {
        const spacing = 40;
        canvas.width = width * scale;
        canvas.height = (height * 2 + spacing) * scale;
        ctx.scale(scale, scale);
        drawFront(ctx, 0);
        drawBack(ctx, height + spacing);
      }

      const cleanSlug = (author.slug || name.toLowerCase().replace(/\s+/g, "-"))
        .replace(/[^a-z0-9-]/g, "");
      const link = document.createElement("a");
      link.download = `techcrest-visiting-card-${cleanSlug}-${cardTheme}-${side}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Export error:", err);
      alert("Failed to export card image. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const copyProfileLink = () => {
    const url = `https://www.techcrest.news/authors/${author.slug || "author"}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!mounted) return null;

  return createPortal(
    <div
      className="tc-card-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="tc-card-modal-dialog">
        {/* Sticky Top Header */}
        <div className="tc-card-modal-header">
          <div className="tc-card-modal-header-left">
            <div className="tc-card-modal-header-icon">
              <CreditCard style={{ width: 20, height: 20 }} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <h2 className="tc-card-modal-title">Official Personal Visiting Card</h2>
                <span className="tc-card-modal-badge">300 DPI Print Ready</span>
              </div>
              <p className="tc-card-modal-subtitle">
                Verified digital press credential and executive visiting card for TechCrest editorial staff.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="tc-card-modal-close-btn"
            aria-label="Close modal"
          >
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {/* Sticky Subheader Controls */}
        <div className="tc-card-modal-controls">
          <div className="tc-card-tabs-row">
            <button
              type="button"
              onClick={() => setActiveTab("front")}
              className={`tc-card-tab-btn ${activeTab === "front" ? "tc-card-tab-btn--active" : ""}`}
            >
              Front Side
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("back")}
              className={`tc-card-tab-btn ${activeTab === "back" ? "tc-card-tab-btn--active" : ""}`}
            >
              Back Side
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("both")}
              className={`tc-card-tab-btn ${activeTab === "both" ? "tc-card-tab-btn--active" : ""}`}
            >
              Side-by-Side
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            {/* Scale toggle */}
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <button
                type="button"
                onClick={() => setCardScale(cardScale === "normal" ? "compact" : "normal")}
                className={`tc-card-preset-pill ${cardScale === "compact" ? "tc-card-preset-pill--active" : ""}`}
                title="Toggle Compact preview for smaller screens"
              >
                <Sliders style={{ width: 11, height: 11, display: "inline", marginRight: 3 }} />
                {cardScale === "compact" ? "Compact View (88%)" : "Full View (100%)"}
              </button>
            </div>

            {/* Theme Toggle */}
            <div className="tc-card-theme-group">
              <button
                type="button"
                onClick={() => setCardTheme("light")}
                className={`tc-card-theme-btn ${cardTheme === "light" ? "tc-card-theme-btn--active" : ""}`}
              >
                <Sun style={{ width: 13, height: 13 }} />
                <span>Light Card</span>
              </button>
              <button
                type="button"
                onClick={() => setCardTheme("dark")}
                className={`tc-card-theme-btn ${cardTheme === "dark" ? "tc-card-theme-btn--active" : ""}`}
              >
                <Moon style={{ width: 13, height: 13 }} />
                <span>Executive Navy</span>
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Modal Body: Contains the Card Stage AND the Customizer Form */}
        <div className="tc-card-modal-scroll-body">
          {/* Visual Card Stage */}
          <div className="tc-card-stage">
            <div
              className={`tc-card-stage-grid ${activeTab === "both" ? "tc-card-stage-grid--side-by-side" : ""}`}
              style={
                cardScale === "compact"
                  ? {
                      transform: "scale(0.88)",
                      transformOrigin: "center center",
                      transition: "transform 0.2s ease",
                      margin: "-16px 0",
                    }
                  : { transition: "transform 0.2s ease" }
              }
            >
              {/* FRONT CARD */}
              {(activeTab === "both" || activeTab === "front") && (
                <div className="tc-visiting-card tc-visiting-card--front">
                  {/* Top: Name, Role, Accent, Official Logo */}
                  <div className="tc-visiting-card__top">
                    <div className="tc-visiting-card__identity">
                      <h3 className="tc-visiting-card__name">{name}</h3>
                      <div className="tc-visiting-card__role">{role}</div>
                      <div className="tc-visiting-card__accent-bar" />
                    </div>
                    <div className="tc-visiting-card__logo-wrap">
                      <img
                        src="/brand/techcrest-card-logo.png"
                        alt="TechCrest"
                        className="tc-visiting-card__logo-img"
                      />
                    </div>
                  </div>

                  {/* Middle: Contact details */}
                  <div className="tc-visiting-card__contact">
                    <div className="tc-visiting-card__contact-row">
                      <Mail />
                      <span>{email}</span>
                    </div>
                    <div className="tc-visiting-card__contact-row">
                      <Phone />
                      <span>{phone}</span>
                    </div>
                    <div className="tc-visiting-card__contact-row">
                      <Globe />
                      <span>{website}</span>
                    </div>
                  </div>

                  {/* Mission Statement */}
                  <div className="tc-visiting-card__mission">
                    {mission.startsWith("Our mission") ? (
                      <>
                        <span className="tc-visiting-card__mission-highlight">Our mission</span>
                        {mission.replace("Our mission", "")}
                      </>
                    ) : (
                      mission
                    )}
                  </div>

                  {/* Footer address */}
                  <div className="tc-visiting-card__footer">
                    <span className="tc-visiting-card__footer-brand">TechCrest.News</span>
                    <span className="tc-visiting-card__footer-sep">|</span>
                    <span className="tc-visiting-card__footer-address">{address}</span>
                  </div>
                </div>
              )}

              {/* BACK CARD */}
              {(activeTab === "both" || activeTab === "back") && (
                <div
                  className={`tc-visiting-card ${
                    cardTheme === "light" ? "tc-visiting-card--back-light" : "tc-visiting-card--back-dark"
                  }`}
                >
                  <div className="tc-visiting-card__back-inner-frame" />
                  <div className="tc-visiting-card__back-center">
                    <img
                      src="/brand/techcrest-card-logo.png"
                      alt="TechCrest"
                      className="tc-visiting-card__back-logo-img"
                      style={cardTheme === "dark" ? { filter: "brightness(0) invert(1)" } : undefined}
                    />
                    <div
                      className="tc-visiting-card__back-url"
                      style={{ color: cardTheme === "light" ? "#0A192F" : "#ffffff" }}
                    >
                      {website}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* High-Efficiency Customizer Form */}
          <div className="tc-card-modal-form-wrap">
            <div className="tc-card-modal-form-header">
              <div className="tc-card-modal-form-title">
                Personalize Card Details & Editorial Credentials
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="tc-card-reset-btn"
                title="Reset all fields back to author profile defaults"
              >
                <RotateCcw style={{ width: 12, height: 12 }} />
                <span>Reset to Profile Defaults</span>
              </button>
            </div>

            <div className="tc-card-modal-form-grid">
              {/* Author Name */}
              <div className="tc-card-input-item">
                <label className="tc-card-input-label">Author Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Bibhu Pattnaik"
                  className="tc-card-input-field"
                />
              </div>

              {/* Editorial Role + Quick Presets */}
              <div className="tc-card-input-item">
                <label className="tc-card-input-label">Editorial Role / Title</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Managing Editor"
                  className="tc-card-input-field"
                />
                <div className="tc-card-role-presets">
                  {ROLE_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setRole(preset)}
                      className={`tc-card-preset-pill ${role === preset ? "tc-card-preset-pill--active" : ""}`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Direct Email */}
              <div className="tc-card-input-item">
                <label className="tc-card-input-label">Direct Editorial Email</label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. editor@techcrest.news"
                  className="tc-card-input-field"
                />
              </div>

              {/* Phone Number */}
              <div className="tc-card-input-item">
                <label className="tc-card-input-label">Press Phone / Contact</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 987 1034 296"
                  className="tc-card-input-field"
                />
              </div>

              {/* Website / Portfolio */}
              <div className="tc-card-input-item">
                <label className="tc-card-input-label">Website / Newsroom Domain</label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="e.g. www.techcrest.news"
                  className="tc-card-input-field"
                />
              </div>

              {/* Office Address */}
              <div className="tc-card-input-item">
                <label className="tc-card-input-label">Office Location</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 8614 Compatible Way, Charlotte, NC 28262"
                  className="tc-card-input-field"
                />
              </div>

              {/* Mission Statement / Personal Tagline (Full Width) */}
              <div className="tc-card-input-item tc-card-input-item--full">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
                  <label className="tc-card-input-label">Mission Statement / Editorial Creed</label>
                  <span style={{ fontSize: "0.65rem", color: "var(--color-text-muted)" }}>
                    Appears directly on the front visiting card
                  </span>
                </div>
                <textarea
                  value={mission}
                  onChange={(e) => setMission(e.target.value)}
                  rows={2}
                  className="tc-card-input-textarea"
                  placeholder="Enter your personal mission statement or editorial motto..."
                />
                <div className="tc-card-role-presets">
                  {MISSION_PRESETS.map((m) => (
                    <button
                      key={m.label}
                      type="button"
                      onClick={() => setMission(m.text)}
                      className={`tc-card-preset-pill ${mission === m.text ? "tc-card-preset-pill--active" : ""}`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Bottom Actions Footer: ALWAYS visible & accessible */}
        <div className="tc-card-modal-footer">
          <button type="button" onClick={copyProfileLink} className="tc-card-copy-btn">
            {copied ? (
              <>
                <Check style={{ width: 14, height: 14, color: "#10b981" }} />
                <span style={{ color: "#10b981" }}>Copied Public Portfolio Link!</span>
              </>
            ) : (
              <>
                <Share2 style={{ width: 14, height: 14 }} />
                <span>Copy Public Author Link</span>
              </>
            )}
          </button>

          <div className="tc-card-actions-group">
            <button
              type="button"
              onClick={() => downloadCardAsImage("front")}
              disabled={isExporting}
              className="tc-card-btn tc-card-btn--secondary"
              title="Download Front Side (300 DPI PNG)"
            >
              <Download style={{ width: 14, height: 14, color: "#2D7FF9" }} />
              <span>Front (PNG)</span>
            </button>
            <button
              type="button"
              onClick={() => downloadCardAsImage("back")}
              disabled={isExporting}
              className="tc-card-btn tc-card-btn--secondary"
              title="Download Back Side (300 DPI PNG)"
            >
              <Download style={{ width: 14, height: 14, color: "#2D7FF9" }} />
              <span>Back (PNG)</span>
            </button>
            <button
              type="button"
              onClick={() => downloadCardAsImage("both")}
              disabled={isExporting}
              className="tc-card-btn tc-card-btn--primary"
              title="Download Full 2-Sided Printable Card"
            >
              <Download style={{ width: 14, height: 14 }} />
              <span>{isExporting ? "Generating..." : "Download Full Card"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
