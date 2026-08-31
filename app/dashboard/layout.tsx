"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  FileText,
  BarChart3,
  Users,
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
} from "lucide-react";
import { signOut } from "next-auth/react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { canAccessRoute } from "@/lib/permissions";
import { RoleGate } from "@/components/shared/role-gate";
import { TechCrestBrand } from "@/components/shared/techcrest-brand";

const sidebarNav = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Articles", href: "/dashboard/articles", icon: FileText },
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
            <TechCrestBrand variant="compact" href="/dashboard" />
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
          <RoleGate action="publish_article">
            <Link
              href="/dashboard/articles/new"
              className="btn btn-primary dashboard-sidebar__action-btn"
              onClick={() => setMobileOpen(false)}
            >
              <PlusCircle className="w-4 h-4" /> New Article
            </Link>
          </RoleGate>
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
            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors flex-shrink-0"
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

          <div className="dashboard-topbar__right">
            <ThemeToggle />

            <button className="dashboard-topbar__btn" aria-label="Notifications">
              <Bell className="w-4.5 h-4.5" />
            </button>

            <Link href="/" className="dashboard-topbar__site-link">
              <span>View Site</span> <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900/50 transition-colors"
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
