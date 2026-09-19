"use client";

import Link from "next/link";
import { Home } from "lucide-react";
import { usePathname } from "next/navigation";

export function FloatingHomeBtn() {
  const pathname = usePathname();

  // Hide on homepage since user is already on Home
  if (pathname === "/") return null;

  return (
    <Link
      href="/"
      className="tc-floating-home-btn"
      aria-label="Return to Homepage"
      title="Return to Home"
    >
      <Home className="w-4 h-4" />
    </Link>
  );
}
