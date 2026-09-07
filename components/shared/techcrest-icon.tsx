import React from "react";

interface TechCrestIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}

export function TechCrestIcon({
  size = 34,
  color = "#0066FF",
  className = "",
  style,
  ...props
}: TechCrestIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1024 1024"
      width={size}
      height={size}
      className={className}
      style={{ color, flexShrink: 0, ...style }}
      aria-label="TechCrest Icon"
      role="img"
      {...props}
    >
      <g fill="currentColor">
        {/* Row 1: Top speedlines */}
        <rect x="295" y="306" width="120" height="36" rx="19" />
        <rect x="450" y="306" width="370" height="36" rx="19" />

        {/* Row 2: Second speedline and the main T-bar */}
        <rect x="232" y="382" width="100" height="36" rx="19" />
        <rect x="368" y="382" width="410" height="38" rx="19" />

        {/* Row 3: Third speedline row */}
        <rect x="186" y="458" width="96" height="36" rx="19" />
        <rect x="310" y="458" width="136" height="36" rx="19" />

        {/* T-Stem */}
        <path
          d="
          M 520 390 
          L 660 390 
          L 535 680 
          A 18 18 0 0 1 517 698 
          L 413 698 
          A 19 19 0 0 1 395 680 
          Z"
        />
      </g>
    </svg>
  );
}