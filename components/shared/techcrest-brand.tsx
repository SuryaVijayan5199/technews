import React from "react";
import Link from "next/link";
import { TechCrestIcon } from "./techcrest-icon";

export type TechCrestBrandVariant =
  | "full"
  | "full-light"
  | "full-dark"
  | "compact"
  | "mobile"
  | "icon-only";

interface TechCrestBrandProps {
  variant?: TechCrestBrandVariant;
  href?: string;
  className?: string;
  iconSize?: number;
  showTagline?: boolean;
}

export function TechCrestBrand({
  variant = "full",
  href = "/",
  className = "",
  iconSize,
  showTagline,
}: TechCrestBrandProps) {
  // Determine variant defaults
  const isMobile = variant === "mobile";
  const isCompact = variant === "compact";
  const isIconOnly = variant === "icon-only";

  // Show tagline for all brand variants unless icon-only
  const shouldShowTagline =
    showTagline !== undefined ? showTagline : !isIconOnly;

  // Sizing defaults
  const computedIconSize =
    iconSize ?? (isMobile ? 60 : isCompact ? 70 : 78);

  const content = (
    <div className={`tc-brand tc-brand--${variant} ${className}`}>
      {/* Icon */}
      <TechCrestIcon
        size={computedIconSize}
        color="#2D7FF9"
        className="tc-brand__icon"
      />

      {!isIconOnly && (
        <div className="tc-brand__text">
          {/* Wordmark */}
          <span className="tc-brand__wordmark">
            <span className="tc-brand__tech">Tech</span>
            <span className="tc-brand__crest">Crest</span>
          </span>

          {/* Tagline */}
          {shouldShowTagline && (
            <span className="tc-brand__tagline">
              NEWS &bull; INSIGHTS &bull; IMPACT
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} aria-label="TechCrest — News, Insights, Impact" className="tc-brand__link">
        {content}
      </Link>
    );
  }

  return content;
}