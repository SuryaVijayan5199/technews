"use client";

import { useState, useRef } from "react";
import {
  CreditCard,
  Download,
  Mail,
  Phone,
  Printer,
  X,
  Sparkles,
  Check,
  Building2,
  Share2,
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

export function AuthorPressCardModal({ author, onClose }: AuthorPressCardModalProps) {
  // Format role/designation
  const defaultRole =
    author.displayName.toLowerCase().includes("bibhu")
      ? "Managing Editor"
      : author.user?.role
      ? author.user.role
          .split("_")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ")
      : "Tech Journalist & Contributor";

  const [name, setName] = useState(author.displayName || "Editorial Contributor");
  const [role, setRole] = useState(defaultRole);
  const [email, setEmail] = useState(author.user?.email || "editor@techcrest.news");
  const [phone, setPhone] = useState("+91 987 1034 296");
  const [address, setAddress] = useState("8614 Compatible Way, Charlotte, North Carolina 28262");
  const [activeTab, setActiveTab] = useState<"both" | "front" | "back">("both");
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  // SVG T-logo as inline vector
  const logoSvg = (
    <svg viewBox="0 0 1024 1024" className="w-full h-full">
      <defs>
        <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00D2FF" />
          <stop offset="100%" stopColor="#2D7FF9" />
        </linearGradient>
      </defs>
      <g fill="url(#cardGrad)">
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
      const width = 1050; // 3.5 in * 300 dpi
      const height = 600; // 2 in * 300 dpi
      const scale = 2; // Extra super-sampling for crystal clear text

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const drawFront = (context: CanvasRenderingContext2D, offsetY = 0) => {
        // Background white
        context.fillStyle = "#FFFFFF";
        context.fillRect(0, offsetY, width, height);

        // Subtle outer card border
        context.strokeStyle = "#E2E8F0";
        context.lineWidth = 4;
        context.strokeRect(2, offsetY + 2, width - 4, height - 4);

        // Author Name
        context.fillStyle = "#0A192F";
        context.font = "bold 44px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        context.fillText(name, 60, offsetY + 95);

        // Role / Designation
        context.fillStyle = "#1E293B";
        context.font = "500 28px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        context.fillText(role, 60, offsetY + 142);

        // Accent blue line
        context.fillStyle = "#2D7FF9";
        context.beginPath();
        context.roundRect(60, offsetY + 165, 54, 5, 3);
        context.fill();

        // Top-Right Logo Box
        const boxX = width - 180;
        const boxY = offsetY + 45;
        const boxW = 120;
        const boxH = 120;
        context.fillStyle = "#071529";
        context.beginPath();
        context.roundRect(boxX, boxY, boxW, boxH, 16);
        context.fill();

        // Speedline T-logo inside emblem
        const grad = context.createLinearGradient(boxX + 25, boxY + 20, boxX + 95, boxY + 80);
        grad.addColorStop(0, "#00D2FF");
        grad.addColorStop(1, "#2D7FF9");
        context.fillStyle = grad;

        // Scaling speedlines into badge box
        const s = 0.115;
        const ox = boxX + 24;
        const oy = boxY + 16;
        context.fillRect(ox + 295 * s, oy + 306 * s, 120 * s, 36 * s);
        context.fillRect(ox + 450 * s, oy + 306 * s, 370 * s, 36 * s);
        context.fillRect(ox + 232 * s, oy + 382 * s, 100 * s, 36 * s);
        context.fillRect(ox + 368 * s, oy + 382 * s, 410 * s, 38 * s);
        context.fillRect(ox + 186 * s, oy + 458 * s, 96 * s, 36 * s);
        context.fillRect(ox + 310 * s, oy + 458 * s, 136 * s, 36 * s);

        context.beginPath();
        context.moveTo(ox + 520 * s, oy + 390 * s);
        context.lineTo(ox + 660 * s, oy + 390 * s);
        context.lineTo(ox + 535 * s, oy + 680 * s);
        context.lineTo(ox + 413 * s, oy + 698 * s);
        context.closePath();
        context.fill();

        // Word "TechCrest" under emblem
        context.fillStyle = "#FFFFFF";
        context.font = "bold 15px -apple-system, BlinkMacSystemFont, sans-serif";
        context.textAlign = "center";
        context.fillText("TechCrest", boxX + boxW / 2, boxY + boxH - 14);
        context.textAlign = "left"; // reset

        // Contact info icons & text
        context.fillStyle = "#2D7FF9";
        context.font = "bold 20px -apple-system, BlinkMacSystemFont, sans-serif";
        context.fillText("✉", 60, offsetY + 235);
        context.fillStyle = "#1E293B";
        context.font = "500 22px -apple-system, BlinkMacSystemFont, sans-serif";
        context.fillText(email, 95, offsetY + 235);

        context.fillStyle = "#2D7FF9";
        context.font = "bold 20px -apple-system, BlinkMacSystemFont, sans-serif";
        context.fillText("📞", 60, offsetY + 280);
        context.fillStyle = "#1E293B";
        context.font = "500 22px -apple-system, BlinkMacSystemFont, sans-serif";
        context.fillText(phone, 95, offsetY + 280);

        // Mission Statement
        context.font = "bold 20px -apple-system, BlinkMacSystemFont, sans-serif";
        context.fillStyle = "#2D7FF9";
        context.fillText("Our mission", 60, offsetY + 365);

        context.fillStyle = "#334155";
        context.font = "400 20px -apple-system, BlinkMacSystemFont, sans-serif";
        context.fillText(" is to make technology understandable,", 180, offsetY + 365);
        context.fillText(
          "accessible, and relevant to everyone through news, insights and impact.",
          60,
          offsetY + 400
        );

        // Thin divider
        context.strokeStyle = "#E2E8F0";
        context.lineWidth = 1.5;
        context.beginPath();
        context.moveTo(60, offsetY + 450);
        context.lineTo(width - 60, offsetY + 450);
        context.stroke();

        // Footer Brand & Address
        context.font = "bold 21px -apple-system, BlinkMacSystemFont, sans-serif";
        context.fillStyle = "#2D7FF9";
        context.fillText("TechCrest.News", 60, offsetY + 505);

        context.fillStyle = "#94A3B8";
        context.fillText("|", 230, offsetY + 505);

        context.font = "400 19px -apple-system, BlinkMacSystemFont, sans-serif";
        context.fillStyle = "#475569";
        context.fillText(address, 250, offsetY + 505);
      };

      const drawBack = (context: CanvasRenderingContext2D, offsetY = 0) => {
        // Deep executive navy background
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

        // Subtle geometric border
        context.strokeStyle = "rgba(45, 127, 249, 0.35)";
        context.lineWidth = 3;
        context.strokeRect(30, offsetY + 30, width - 60, height - 60);

        // Large Center Logo
        const cx = width / 2 - 240;
        const cy = offsetY + height / 2 - 100;
        const logoGrad = context.createLinearGradient(cx, cy, cx + 500, cy + 150);
        logoGrad.addColorStop(0, "#00D2FF");
        logoGrad.addColorStop(1, "#2D7FF9");
        context.fillStyle = logoGrad;

        // Speedlines scaled
        const s = 0.28;
        context.fillRect(cx + 295 * s, cy + 306 * s, 120 * s, 36 * s);
        context.fillRect(cx + 450 * s, cy + 306 * s, 370 * s, 36 * s);
        context.fillRect(cx + 232 * s, cy + 382 * s, 100 * s, 36 * s);
        context.fillRect(cx + 368 * s, cy + 382 * s, 410 * s, 38 * s);
        context.fillRect(cx + 186 * s, cy + 458 * s, 96 * s, 36 * s);
        context.fillRect(cx + 310 * s, cy + 458 * s, 136 * s, 36 * s);

        context.beginPath();
        context.moveTo(cx + 520 * s, cy + 390 * s);
        context.lineTo(cx + 660 * s, cy + 390 * s);
        context.lineTo(cx + 535 * s, cy + 680 * s);
        context.lineTo(cx + 413 * s, cy + 698 * s);
        context.closePath();
        context.fill();

        // TechCrest Text
        context.fillStyle = "#FFFFFF";
        context.font = "bold 78px -apple-system, BlinkMacSystemFont, sans-serif";
        context.fillText("TechCrest", cx + 180, cy + 120);

        // Tagline: NEWS • INSIGHTS • IMPACT
        context.fillStyle = "#00D2FF";
        context.font = "bold 20px -apple-system, BlinkMacSystemFont, sans-serif";
        context.textAlign = "center";
        context.letterSpacing = "6px";
        context.fillText("NEWS  •  INSIGHTS  •  IMPACT", width / 2, offsetY + height / 2 + 75);
        context.letterSpacing = "0px";

        // Official Press Credential Subtitle
        context.fillStyle = "rgba(255, 255, 255, 0.4)";
        context.font = "600 13px -apple-system, BlinkMacSystemFont, sans-serif";
        context.fillText("OFFICIAL EDITORIAL PRESS CREDENTIAL", width / 2, offsetY + height - 55);
        context.textAlign = "left"; // reset
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
        // Combined Stacked Print Ready
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
      link.download = `techcrest-card-${cleanSlug}-${side}.png`;
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[var(--color-surface-1)] border border-[var(--color-surface-border)] rounded-2xl shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[var(--color-surface-border)] bg-[var(--color-surface-2)]/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#2D7FF9]/10 text-[#2D7FF9] flex items-center justify-center border border-[#2D7FF9]/20">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                Official TechCrest Press Card
                <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-[#2D7FF9]/15 text-[#2D7FF9] border border-[#2D7FF9]/30">
                  Verified
                </span>
              </h2>
              <p className="text-xs text-muted-foreground">
                Downloadable high-resolution digital business card for editorial staff & contributors.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3 border-b border-[var(--color-surface-border)] bg-[var(--color-surface-1)]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("both")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "both"
                  ? "bg-[#2D7FF9] text-white shadow-sm"
                  : "bg-[var(--color-surface-2)] text-muted-foreground hover:text-[var(--color-text-primary)]"
              }`}
            >
              Side-by-Side View
            </button>
            <button
              onClick={() => setActiveTab("front")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "front"
                  ? "bg-[#2D7FF9] text-white shadow-sm"
                  : "bg-[var(--color-surface-2)] text-muted-foreground hover:text-[var(--color-text-primary)]"
              }`}
            >
              Front Side
            </button>
            <button
              onClick={() => setActiveTab("back")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "back"
                  ? "bg-[#2D7FF9] text-white shadow-sm"
                  : "bg-[var(--color-surface-2)] text-muted-foreground hover:text-[var(--color-text-primary)]"
              }`}
            >
              Back Side
            </button>
          </div>

          <div className="text-[11px] text-muted-foreground hidden sm:block">
            Print Ready (3.5&quot; × 2&quot; • 300 DPI)
          </div>
        </div>

        {/* Interactive Visual Card Stage */}
        <div className="p-4 sm:p-8 bg-neutral-950/40 flex flex-col items-center justify-center gap-6 overflow-x-auto">
          <div
            className={`flex flex-col ${
              activeTab === "both" ? "lg:flex-row" : "items-center"
            } justify-center gap-6 w-full max-w-4xl`}
          >
            {/* FRONT CARD */}
            {(activeTab === "both" || activeTab === "front") && (
              <div
                className="relative w-full max-w-[480px] aspect-[7/4] bg-white text-slate-900 rounded-xl p-5 sm:p-6 shadow-2xl border border-slate-200 flex flex-col justify-between overflow-hidden select-none transition-transform hover:scale-[1.01]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {/* Top Row: Name/Role on left, Emblem on right */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#0A192F] leading-tight">
                      {name}
                    </h3>
                    <p className="text-sm font-semibold text-slate-700 mt-0.5">
                      {role}
                    </p>
                    <div className="w-9 h-[3px] bg-[#2D7FF9] rounded-full mt-2" />
                  </div>

                  {/* Dark Emblem Badge */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[#071529] p-2 flex flex-col items-center justify-center shadow-md flex-shrink-0">
                    <div className="w-8 h-8 sm:w-9 sm:h-9">{logoSvg}</div>
                    <span className="text-[9px] font-bold text-white tracking-tight mt-0.5">
                      TechCrest
                    </span>
                  </div>
                </div>

                {/* Middle: Contact details */}
                <div className="space-y-1.5 my-1 text-xs sm:text-sm text-slate-800 font-medium">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#2D7FF9] flex-shrink-0" />
                    <span className="truncate">{email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#2D7FF9] flex-shrink-0" />
                    <span>{phone}</span>
                  </div>
                </div>

                {/* Mission statement */}
                <div className="text-[11px] sm:text-xs text-slate-600 leading-snug">
                  <span className="font-bold text-[#2D7FF9]">Our mission</span> is to make
                  technology understandable, accessible, and relevant to everyone through news,
                  insights and impact.
                </div>

                {/* Footer Brand & Address */}
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] sm:text-[11px]">
                  <div className="truncate">
                    <span className="font-bold text-[#2D7FF9]">TechCrest.News</span>
                    <span className="mx-1.5 text-slate-400">|</span>
                    <span className="text-slate-600">{address}</span>
                  </div>
                </div>
              </div>
            )}

            {/* BACK CARD */}
            {(activeTab === "both" || activeTab === "back") && (
              <div
                className="relative w-full max-w-[480px] aspect-[7/4] rounded-xl p-6 shadow-2xl flex flex-col items-center justify-center text-center overflow-hidden select-none border border-[#2D7FF9]/30 transition-transform hover:scale-[1.01]"
                style={{
                  background:
                    "radial-gradient(circle at center, #0F2D54 0%, #071529 100%)",
                }}
              >
                {/* Thin Inner Border */}
                <div className="absolute inset-3 rounded-lg border border-[#2D7FF9]/20 pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center">
                  {/* Full Lockup */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 sm:w-16 sm:h-16">{logoSvg}</div>
                    <span className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                      TechCrest
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-xs font-bold text-[#00D2FF] tracking-[0.3em] uppercase mt-2">
                    NEWS • INSIGHTS • IMPACT
                  </p>
                  <p className="text-[9px] uppercase tracking-wider text-white/40 mt-6 font-semibold">
                    Official Editorial Press Credential
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Card Information Customizer */}
        <div className="px-5 sm:px-6 py-4 border-t border-[var(--color-surface-border)] bg-[var(--color-surface-1)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                Author Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-8 px-2.5 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-surface-border)] text-xs text-[var(--color-text-primary)] outline-none focus:border-[#2D7FF9]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                Editorial Role
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full h-8 px-2.5 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-surface-border)] text-xs text-[var(--color-text-primary)] outline-none focus:border-[#2D7FF9]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                Direct Email
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-8 px-2.5 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-surface-border)] text-xs text-[var(--color-text-primary)] outline-none focus:border-[#2D7FF9]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-8 px-2.5 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-surface-border)] text-xs text-[var(--color-text-primary)] outline-none focus:border-[#2D7FF9]"
              />
            </div>
          </div>
        </div>

        {/* Action Controls Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 sm:px-6 py-4 border-t border-[var(--color-surface-border)] bg-[var(--color-surface-2)]/60">
          <button
            onClick={copyProfileLink}
            className="w-full sm:w-auto text-xs font-semibold text-muted-foreground hover:text-[var(--color-text-primary)] inline-flex items-center justify-center gap-1.5 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                Copied Public Portfolio Link!
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                Copy Author Profile Link
              </>
            )}
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => downloadCardAsImage("front")}
              disabled={isExporting}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-[var(--color-surface-1)] border border-[var(--color-surface-border)] hover:border-[#2D7FF9] text-[var(--color-text-primary)] transition-all shadow-xs"
              title="Download Front Side PNG (300 DPI)"
            >
              <Download className="w-3.5 h-3.5 text-[#2D7FF9]" />
              Front (PNG)
            </button>

            <button
              onClick={() => downloadCardAsImage("back")}
              disabled={isExporting}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-[var(--color-surface-1)] border border-[var(--color-surface-border)] hover:border-[#2D7FF9] text-[var(--color-text-primary)] transition-all shadow-xs"
              title="Download Back Side PNG (300 DPI)"
            >
              <Download className="w-3.5 h-3.5 text-[#2D7FF9]" />
              Back (PNG)
            </button>

            <button
              onClick={() => downloadCardAsImage("both")}
              disabled={isExporting}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-[#2D7FF9] hover:bg-[#1a6ee8] text-white shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
              title="Download Complete 2-Sided High-Resolution Press Card"
            >
              <Download className="w-3.5 h-3.5" />
              {isExporting ? "Generating..." : "Download Full Card"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
