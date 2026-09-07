import React from "react";
import Link from "next/link";
import Image from "next/image";

export type TechCrestBrandSize = "sm" | "md" | "lg";
export type TechCrestBrandTheme = "auto" | "light" | "dark";

export interface TechCrestBrandProps {
  /** Standard size preset: sm (44px), md (68px - default prominent), lg (84px) */
  size?: TechCrestBrandSize;
  /** Theme override if needed */
  theme?: TechCrestBrandTheme;
  /** Link target URL. Set to empty string or null to render non-interactive container */
  href?: string | null;
  /** Custom additional CSS classes */
  className?: string;
  /** Explicit pixel height override */
  iconSize?: number;
  /** Legacy prop kept for compatibility */
  showTagline?: boolean;
}

const HEIGHT_MAP: Record<TechCrestBrandSize, number> = {
  sm: 52,
  md: 78,
  lg: 104,
};

export function TechCrestBrand({
  size = "md",
  theme = "auto",
  href = "/",
  className = "",
  iconSize,
}: TechCrestBrandProps) {
  const computedHeight = iconSize ?? HEIGHT_MAP[size] ?? 72;
  // Aspect ratio of the official TechCrest logo image lockup (width: 900, height: 260) => ratio ~3.46
  const computedWidth = Math.round(computedHeight * 3.46);

  const themeClass =
    theme === "light"
      ? "tc-brand--light"
      : theme === "dark"
      ? "tc-brand--dark"
      : "";

  const content = (
    <div
      className={`tc-brand tc-brand--image-lockup tc-brand--${size} ${themeClass} ${className}`.trim()}
      style={{
        display: "inline-flex",
        alignItems: "center",
        lineHeight: 1,
      }}
    >
      <Image
        src="/brand/techcrest-logo.png"
        alt="TechCrest — News • Insights • Impact"
        width={computedWidth}
        height={computedHeight}
        priority
        className="tc-brand__image-file"
        style={{
          height: `${computedHeight}px`,
          width: "auto",
          objectFit: "contain",
          display: "block",
        }}
      />
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        aria-label="TechCrest — News, Insights, Impact"
        className="tc-brand__link"
      >
        {content}
      </Link>
    );
  }

  return content;
}