"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Home, Compass, Search, Bookmark, User } from "lucide-react";
import { Capacitor } from "@capacitor/core";
import { Haptics, ImpactStyle } from "@capacitor/haptics";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  // Don't render on CMS dashboard routes to give maximum space for editor tools
  if (pathname?.startsWith("/dashboard")) return null;

  const triggerHaptic = async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        await Haptics.impact({ style: ImpactStyle.Light });
      } catch {}
    }
  };

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Topics", href: "/news", icon: Compass },
    { label: "Search", href: "/search", icon: Search },
    { label: "Saved", href: isLoggedIn ? "/profile" : "/login", icon: Bookmark },
    { label: isLoggedIn ? "Profile" : "Sign In", href: isLoggedIn ? "/profile" : "/login", icon: User },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--color-surface-1)] border-t border-[var(--color-surface-border)] backdrop-blur-lg bg-opacity-95"
      style={{
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.35rem)",
        paddingTop: "0.4rem",
      }}
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around px-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname?.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={triggerHaptic}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? "text-[#2D7FF9] font-bold"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              <div
                className={`p-1 rounded-lg transition-all ${
                  isActive ? "bg-[#2D7FF9]/15 text-[#2D7FF9] scale-110" : ""
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span style={{ fontSize: "0.6875rem", letterSpacing: "-0.01em" }}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
