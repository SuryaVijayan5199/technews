"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  FileText,
  BarChart3,
  Users,
  UserCheck,
  Settings,
  PlusCircle,
  LayoutDashboard,
  Layers,
  MessageSquare,
  Menu,
  X,
  ExternalLink,
  Search,
  LogOut,
  User,
  Bell,
  Mail,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { canAccessRoute, isStaff } from "@/lib/permissions";
import { RoleGate } from "@/components/shared/role-gate";
import { TechCrestBrand } from "@/components/shared/techcrest-brand";

const sidebarNav = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Articles", href: "/dashboard/articles", icon: FileText },
  { label: "Authors", href: "/dashboard/authors", icon: UserCheck },
  { label: "Subscribers", href: "/dashboard/subscribers", icon: Mail },
  { label: "Categories", href: "/dashboard/categories", icon: Layers },
  { label: "Comments", href: "/dashboard/comments", icon: MessageSquare },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Team", href: "/dashboard/team", icon: Users },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session, status } = useSession();

  if (status === "unauthenticated") {
    // redirect is not available in client components
    // we rely on middleware, but add visual guard
    return null;
  }

  // Redirect handled by middleware, but provide client-side fallback
  const userRole = session?.user?.role ?? null;
  const userName = session?.user?.name ?? session?.user?.email ?? "Editorial Desk";
  const userInitial = userName.charAt(0).toUpperCase();

  // Filter navigation links based on RBAC permissions
  const visibleNav = sidebarNav.filter(item => canAccessRoute(userRole, item.href));

  return (
    <div className="dashboard-layout">
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="dashboard-mobile-backdrop"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${mobileOpen ? "dashboard-sidebar--open" : ""}`}>
        <div className="dashboard-sidebar__header flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TechCrestBrand size="sm" href="/dashboard" />
            <span className="dashboard-sidebar__badge">CMS</span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="dashboard-sidebar__close-btn lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="dashboard-sidebar__action">
          {isStaff(userRole) && (
            <Link
              href="/dashboard/articles/new"
              className="btn btn-primary dashboard-sidebar__action-btn"
              onClick={() => setMobileOpen(false)}
            >
              <PlusCircle className="w-4 h-4" /> New Article
            </Link>
          )}
        </div>

        <nav className="dashboard-nav">
          {visibleNav.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`dashboard-nav__link ${isActive ? "dashboard-nav__link--active" : ""}`}
                onClick={() => setMobileOpen(false)}
              >
                <Icon className="dashboard-nav__icon" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="dashboard-sidebar__footer flex items-center justify-between gap-2 p-3 border-t border-[var(--color-surface-border)]">
          <Link
            href="/profile"
            className="flex items-center gap-2.5 overflow-hidden flex-1 min-w-0 rounded-lg hover:bg-[var(--color-surface-2)] p-1 transition-colors"
            onClick={() => setMobileOpen(false)}
            title="Edit Profile"
          >
            <div className="dashboard-sidebar__avatar flex-shrink-0">{userInitial}</div>
            <div className="dashboard-sidebar__user overflow-hidden">
              <p className="dashboard-sidebar__user-name truncate text-xs font-semibold">{userName}</p>
              <p className="dashboard-sidebar__user-role text-[10px] text-muted-foreground capitalize">
                {userRole ? userRole.replace(/_/g, " ") : "Loading..."}
              </p>
            </div>
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="dashboard-sidebar-signout-btn"
            title="Sign Out / Logout"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="dashboard-wrapper">
        {/* Top Header Bar inside Dashboard */}
        <header className="dashboard-topbar">
          <div className="dashboard-topbar__left">
            <button
              onClick={() => setMobileOpen(true)}
              className="dashboard-topbar__toggle lg:hidden"
              aria-label="Open navigation sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="dashboard-topbar__search">
              <Search className="dashboard-topbar__search-icon" />
              <input
                type="text"
                placeholder="Search CMS, articles, tags…"
                className="input dashboard-topbar__search-input"
              />
            </div>
          </div>

          <div className="dashboard-topbar__right flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            <button
              className="relative flex items-center justify-center w-9 h-9 rounded-full bg-[var(--color-surface-2)] border border-[var(--color-surface-border)] hover:border-[#2D7FF9]/50 hover:text-[#2D7FF9] transition-all"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 text-[var(--color-text-secondary)]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#2D7FF9] animate-pulse" />
            </button>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#2D7FF9] bg-[#2D7FF9]/10 border border-[#2D7FF9]/30 hover:bg-[#2D7FF9] hover:text-white transition-all shadow-xs"
            >
              <span>View Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="dashboard-signout-btn"
              title="Sign Out / Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Inner Content Area */}
        <main className="dashboard-main">{children}</main>
      </div>
    </div>
  );
}
