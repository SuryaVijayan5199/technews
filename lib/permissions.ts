export type Role =
  | "super_admin"
  | "publisher"
  | "managing_editor"
  | "editor"
  | "reviewer"
  | "author"
  | "contributor"
  | "subscriber";

export const RoleTiers: Record<string, Role[]> = {
  ADMIN: ["super_admin", "publisher", "managing_editor"],
  EDITORIAL: ["editor", "reviewer", "author", "contributor"],
  MEMBERSHIP: ["subscriber"],
};

export const STAFF_ROLES: Role[] = [
  ...RoleTiers.ADMIN,
  ...RoleTiers.EDITORIAL,
];

// Helper to check if a user is staff (can access CMS dashboard features)
export function isStaff(role?: string | null): boolean {
  if (!role) return false;
  return STAFF_ROLES.includes(role as Role) || role === "super_admin";
}

// Define what each role can access on the Dashboard
const RoutePermissions: Record<string, Role[]> = {
  "/dashboard/settings": RoleTiers.ADMIN,
  "/dashboard/team": RoleTiers.ADMIN,
  "/dashboard/categories": [...RoleTiers.ADMIN, "editor"],
  "/dashboard/analytics": [...RoleTiers.ADMIN, "editor"],
  "/dashboard/comments": [...RoleTiers.ADMIN, "editor", "reviewer"],
  "/dashboard/articles": STAFF_ROLES,
  "/dashboard": STAFF_ROLES,
};

export function canAccessRoute(role: string | null | undefined, pathname: string): boolean {
  if (!role) return false;
  if (role === "super_admin") return true;

  // Non-staff subscribers cannot access dashboard
  if (!isStaff(role)) return false;

  const matchingRoutes = Object.keys(RoutePermissions).filter(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (matchingRoutes.length === 0) {
    return isStaff(role);
  }

  const bestMatch = matchingRoutes.sort((a, b) => b.length - a.length)[0];
  const allowedRoles = RoutePermissions[bestMatch];
  
  if (!allowedRoles) return isStaff(role);
  return allowedRoles.includes(role as Role);
}

// Fine-grained action permissions (for UI rendering/hiding buttons)
type Action =
  | "publish_article"
  | "delete_article"
  | "manage_users"
  | "moderate_comments"
  | "view_global_analytics";

export function canPerformAction(role: string | null | undefined, action: Action): boolean {
  if (!role) return false;

  const r = role as Role;
  switch (action) {
    case "publish_article":
      // ONLY Super Admin can directly approve & publish articles
      return r === "super_admin" || r === "publisher";
    case "delete_article":
      return r === "super_admin";
    case "manage_users":
      return r === "super_admin";
    case "moderate_comments":
      return r === "super_admin" || r === "editor" || r === "reviewer";
    case "view_global_analytics":
      return r === "super_admin" || r === "editor";
    default:
      return false;
  }
}
