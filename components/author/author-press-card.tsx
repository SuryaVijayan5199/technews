"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  CreditCard,
  Download,
  Mail,
  Phone,
  Printer,
  X,
  Check,
  Building2,
  Share2,
  Sun,
  Moon,
  Globe,
  MapPin,
  ExternalLink,
  Sparkles,
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Handle Escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

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
  const [website, setWebsite] = useState("www.techcrest.news");
  const [address, setAddress] = useState("8614 Compatible Way, Charlotte, North Carolina 28262");
  
  // Theme: "light" (default) or "dark"
  const [cardTheme, setCardTheme] = useState<"light" | "dark">("light");
  // Active Tab: "front" (default for personal visiting card), "back", or "both"
  const [activeTab, setActiveTab] = useState<"front" | "back" | "both">("front");
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
      const width = 1050; // 3.5 in * 300 dpi standard business card
      const height = 600; // 2 in * 300 dpi standard business card
      const scale = 2; // 2x supersampling for ultra-crisp retina typography

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const drawFront = (context: CanvasRenderingContext2D, offsetY = 0) => {
        // Pure White Cardstock
        context.fillStyle = "#FFFFFF";
        context.fillRect(0, offsetY, width, height);

        // Elegant Hairline Border
        context.strokeStyle = "#E2E8F0";
        context.lineWidth = 3;
        context.strokeRect(2, offsetY + 2, width - 4, height - 4);

        // Author Name
        context.fillStyle = "#0A192F";
        context.font = "bold 44px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        context.fillText(name, 60, offsetY + 95);

        // Role / Designation
        context.fillStyle = "#2D7FF9";
        context.font = "bold 24px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        context.fillText(role.toUpperCase(), 60, offsetY + 138);

        // Accent blue line
        const lineGrad = context.createLinearGradient(60, offsetY + 155, 130, offsetY + 155);
        lineGrad.addColorStop(0, "#00D2FF");
        lineGrad.addColorStop(1, "#2D7FF9");
        context.fillStyle = lineGrad;
        context.beginPath();
        context.roundRect(60, offsetY + 155, 60, 5, 3);
        context.fill();

        // Top-Right TechCrest Emblem Badge
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
        context.textAlign = "left";

        // Contact info
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

        // Mission statement
        context.font = "bold 19px -apple-system, BlinkMacSystemFont, sans-serif";
        context.fillStyle = "#2D7FF9";
        context.fillText("Our mission", 60, offsetY + 382);

        context.fillStyle = "#475569";
        context.font = "400 19px -apple-system, BlinkMacSystemFont, sans-serif";
        context.fillText(" is to make technology understandable,", 175, offsetY + 382);
        context.fillText(
          "accessible, and relevant to everyone through news, insights and impact.",
          60,
          offsetY + 412
        );

        // Hairline divider
        context.strokeStyle = "#E2E8F0";
        context.lineWidth = 1.5;
        context.beginPath();
        context.moveTo(60, offsetY + 455);
        context.lineTo(width - 60, offsetY + 455);
        context.stroke();

        // Footer Brand & Address
        context.font = "bold 20px -apple-system, BlinkMacSystemFont, sans-serif";
        context.fillStyle = "#2D7FF9";
        context.fillText("TechCrest.News", 60, offsetY + 505);

        context.fillStyle = "#94A3B8";
        context.fillText("|", 230, offsetY + 505);

        context.font = "400 18px -apple-system, BlinkMacSystemFont, sans-serif";
        context.fillStyle = "#475569";
        context.fillText(address, 250, offsetY + 505);
      };

      const drawBack = (context: CanvasRenderingContext2D, offsetY = 0) => {
        if (cardTheme === "light") {
          // Light Executive visiting card theme
          const bgGrad = context.createLinearGradient(0, offsetY, width, offsetY + height);
          bgGrad.addColorStop(0, "#FFFFFF");
          bgGrad.addColorStop(0.5, "#F8FAFC");
          bgGrad.addColorStop(1, "#EFF6FF");
          context.fillStyle = bgGrad;
          context.fillRect(0, offsetY, width, height);

          // Subtle hairline border
          context.strokeStyle = "rgba(45, 127, 249, 0.3)";
          context.lineWidth = 3;
          context.strokeRect(25, offsetY + 25, width - 50, height - 50);

          // Inner accent frame
          context.strokeStyle = "rgba(45, 127, 249, 0.12)";
          context.lineWidth = 1.5;
          context.strokeRect(38, offsetY + 38, width - 76, height - 76);

          // Center Logo
          const cx = width / 2 - 240;
          const cy = offsetY + height / 2 - 110;
          const logoGrad = context.createLinearGradient(cx, cy, cx + 500, cy + 150);
          logoGrad.addColorStop(0, "#00D2FF");
          logoGrad.addColorStop(1, "#2D7FF9");
          context.fillStyle = logoGrad;

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

          // Brand Word "TechCrest" in Deep Navy
          context.fillStyle = "#0A192F";
          context.font = "bold 78px -apple-system, BlinkMacSystemFont, sans-serif";
          context.fillText("TechCrest", cx + 180, cy + 120);

          // Tagline: NEWS • INSIGHTS • IMPACT in Blue
          context.fillStyle = "#2D7FF9";
          context.font = "bold 20px -apple-system, BlinkMacSystemFont, sans-serif";
          context.textAlign = "center";
          context.fillText("NEWS  •  INSIGHTS  •  IMPACT", width / 2, offsetY + height / 2 + 75);

          // Subtitle
          context.fillStyle = "#64748B";
          context.font = "600 13px -apple-system, BlinkMacSystemFont, sans-serif";
          context.fillText("OFFICIAL EDITORIAL PRESS CREDENTIAL", width / 2, offsetY + height - 70);

          // Website
          context.fillStyle = "#0A192F";
          context.font = "bold 15px -apple-system, BlinkMacSystemFont, sans-serif";
          context.fillText("www.techcrest.news", width / 2, offsetY + height - 44);
          context.textAlign = "left";
        } else {
          // Executive Navy theme
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

          const cx = width / 2 - 240;
          const cy = offsetY + height / 2 - 100;
          const logoGrad = context.createLinearGradient(cx, cy, cx + 500, cy + 150);
          logoGrad.addColorStop(0, "#00D2FF");
          logoGrad.addColorStop(1, "#2D7FF9");
          context.fillStyle = logoGrad;

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

          context.fillStyle = "#FFFFFF";
          context.font = "bold 78px -apple-system, BlinkMacSystemFont, sans-serif";
          context.fillText("TechCrest", cx + 180, cy + 120);

          context.fillStyle = "#00D2FF";
          context.font = "bold 20px -apple-system, BlinkMacSystemFont, sans-serif";
          context.textAlign = "center";
          context.fillText("NEWS  •  INSIGHTS  •  IMPACT", width / 2, offsetY + height / 2 + 75);

          context.fillStyle = "rgba(255, 255, 255, 0.45)";
          context.font = "600 13px -apple-system, BlinkMacSystemFont, sans-serif";
          context.fillText("OFFICIAL EDITORIAL PRESS CREDENTIAL", width / 2, offsetY + height - 55);
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

  const handlePrint = () => {
    window.print();
  };

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[999999] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/70 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#2D7FF9]/10 text-[#2D7FF9] flex items-center justify-center border border-[#2D7FF9]/20 flex-shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  TechCrest Personal Visiting Card
                </h2>
                <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-[#2D7FF9]/15 text-[#2D7FF9] border border-[#2D7FF9]/30">
                  300 DPI Print Ready
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Customizable digital visiting card and verified editorial credential for press events.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Controls & Theme Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-6 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setActiveTab("front")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "front"
                  ? "bg-[#2D7FF9] text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              Front Side
            </button>
            <button
              onClick={() => setActiveTab("back")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "back"
                  ? "bg-[#2D7FF9] text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              Back Side
            </button>
            <button
              onClick={() => setActiveTab("both")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "both"
                  ? "bg-[#2D7FF9] text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              Side-by-Side
            </button>
          </div>

          {/* Theme Selector: Light (Default) vs Dark */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setCardTheme("light")}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                cardTheme === "light"
                  ? "bg-white text-[#2D7FF9] shadow-xs"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Light Theme</span>
            </button>
            <button
              onClick={() => setCardTheme("dark")}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                cardTheme === "dark"
                  ? "bg-slate-900 text-[#00D2FF] shadow-xs"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Executive Dark</span>
            </button>
          </div>
        </div>

        {/* Scrollable Body Container */}
        <div className="overflow-y-auto flex-1">
          {/* Card Presentation Stage */}
          <div className="p-4 sm:p-8 bg-slate-100/90 dark:bg-slate-950/70 flex flex-col items-center justify-center gap-6">
            <div
              className={`flex flex-col ${
                activeTab === "both" ? "lg:flex-row" : "items-center"
              } justify-center gap-6 w-full max-w-4xl`}
            >
              {/* FRONT OF VISITING CARD */}
              {(activeTab === "both" || activeTab === "front") && (
                <div
                  className="relative w-full max-w-[460px] aspect-[7/4] bg-white text-slate-900 rounded-xl p-4 sm:p-5 md:p-6 shadow-xl border border-slate-200 flex flex-col justify-between overflow-hidden select-none transition-transform hover:scale-[1.01]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {/* Top Row: Name/Role on left, Emblem on right */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 pr-2">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight text-[#0A192F] leading-tight truncate">
                        {name}
                      </h3>
                      <p className="text-xs sm:text-sm font-bold text-[#2D7FF9] uppercase tracking-wider mt-0.5 truncate">
                        {role}
                      </p>
                      <div className="w-10 sm:w-12 h-1 bg-gradient-to-r from-[#00D2FF] to-[#2D7FF9] rounded-full mt-1.5" />
                    </div>

                    {/* Dark Emblem Badge */}
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl bg-[#071529] p-1.5 sm:p-2 flex flex-col items-center justify-center shadow-md flex-shrink-0">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9">{logoSvg}</div>
                      <span className="text-[8px] sm:text-[9px] font-bold text-white tracking-tight mt-0.5">
                        TechCrest
                      </span>
                    </div>
                  </div>

                  {/* Middle: Contact details */}
                  <div className="space-y-1 sm:space-y-1.5 my-auto text-[11px] sm:text-xs md:text-sm text-slate-800 font-medium">
                    <div className="flex items-center gap-2 truncate">
                      <Mail className="w-3.5 h-3.5 text-[#2D7FF9] flex-shrink-0" />
                      <span className="truncate">{email}</span>
                    </div>
                    <div className="flex items-center gap-2 truncate">
                      <Phone className="w-3.5 h-3.5 text-[#2D7FF9] flex-shrink-0" />
                      <span>{phone}</span>
                    </div>
                    <div className="flex items-center gap-2 truncate">
                      <Globe className="w-3.5 h-3.5 text-[#2D7FF9] flex-shrink-0" />
                      <span className="truncate">{website}</span>
                    </div>
                  </div>

                  {/* Mission statement */}
                  <div className="text-[10px] sm:text-[11px] md:text-xs text-slate-600 leading-snug line-clamp-2">
                    <span className="font-bold text-[#2D7FF9]">Our mission</span> is to make
                    technology understandable, accessible, and relevant to everyone through news,
                    insights and impact.
                  </div>

                  {/* Footer Brand & Address */}
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[9px] sm:text-[10px] md:text-[11px]">
                    <div className="truncate">
                      <span className="font-bold text-[#2D7FF9]">TechCrest.News</span>
                      <span className="mx-1 text-slate-300">|</span>
                      <span className="text-slate-600">{address}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* BACK OF VISITING CARD */}
              {(activeTab === "both" || activeTab === "back") && (
                <div
                  className={`relative w-full max-w-[460px] aspect-[7/4] rounded-xl p-4 sm:p-6 shadow-xl flex flex-col items-center justify-center text-center overflow-hidden select-none transition-transform hover:scale-[1.01] ${
                    cardTheme === "light"
                      ? "bg-gradient-to-br from-white via-slate-50 to-blue-50 text-slate-900 border border-[#2D7FF9]/25"
                      : "text-white border border-[#2D7FF9]/30"
                  }`}
                  style={
                    cardTheme === "dark"
                      ? {
                          background:
                            "radial-gradient(circle at center, #0F2D54 0%, #071529 100%)",
                        }
                      : undefined
                  }
                >
                  {/* Subtle Inner Accent Border */}
                  <div
                    className={`absolute inset-2.5 sm:inset-3 rounded-lg pointer-events-none ${
                      cardTheme === "light"
                        ? "border border-[#2D7FF9]/15"
                        : "border border-[#2D7FF9]/20"
                    }`}
                  />

                  <div className="relative z-10 flex flex-col items-center">
                    {/* Full Brand Lockup */}
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <div className="w-10 h-10 sm:w-14 sm:h-14">{logoSvg}</div>
                      <span
                        className={`text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight ${
                          cardTheme === "light" ? "text-[#0A192F]" : "text-white"
                        }`}
                      >
                        TechCrest
                      </span>
                    </div>
                    <p
                      className={`text-[9px] sm:text-xs font-bold tracking-[0.25em] uppercase mt-2 ${
                        cardTheme === "light" ? "text-[#2D7FF9]" : "text-[#00D2FF]"
                      }`}
                    >
                      NEWS • INSIGHTS • IMPACT
                    </p>
                    <p
                      className={`text-[8px] sm:text-[9px] uppercase tracking-wider mt-4 sm:mt-5 font-semibold ${
                        cardTheme === "light" ? "text-slate-500" : "text-white/45"
                      }`}
                    >
                      Official Editorial Press Credential
                    </p>
                    <p
                      className={`text-[10px] sm:text-[11px] font-bold mt-1.5 ${
                        cardTheme === "light" ? "text-[#0A192F]" : "text-slate-300"
                      }`}
                    >
                      {website}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Live Customizer Input Fields */}
          <div className="px-4 sm:px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Personalize Visiting Card Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Author Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2D7FF9]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Editorial Title / Role
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2D7FF9]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Direct Email
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2D7FF9]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2D7FF9]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Website / Profile
                </label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2D7FF9]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Office Location
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2D7FF9]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex-shrink-0">
          <button
            onClick={copyProfileLink}
            className="w-full sm:w-auto text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white inline-flex items-center justify-center gap-1.5 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>Copied Public Portfolio Link!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Copy Public Author Link</span>
              </>
            )}
          </button>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => downloadCardAsImage("front")}
              disabled={isExporting}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#2D7FF9] text-slate-700 dark:text-slate-200 transition-all shadow-xs"
              title="Download Front Side PNG (300 DPI)"
            >
              <Download className="w-3.5 h-3.5 text-[#2D7FF9]" />
              <span>Front (PNG)</span>
            </button>

            <button
              onClick={() => downloadCardAsImage("back")}
              disabled={isExporting}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#2D7FF9] text-slate-700 dark:text-slate-200 transition-all shadow-xs"
              title="Download Back Side PNG (300 DPI)"
            >
              <Download className="w-3.5 h-3.5 text-[#2D7FF9]" />
              <span>Back (PNG)</span>
            </button>

            <button
              onClick={() => downloadCardAsImage("both")}
              disabled={isExporting}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-[#2D7FF9] hover:bg-[#1a6ee8] text-white shadow-md transition-all active:scale-[0.98]"
              title="Download Complete 2-Sided High-Resolution Press Card"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? "Generating..." : "Download Full Card"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
