"use client";

import { useSession } from "next-auth/react";
import { canPerformAction, Role, RoleTiers } from "@/lib/permissions";
import { ReactNode } from "react";

interface RoleGateProps {
  children: ReactNode;
  allowedRoles?: Role[];
  action?: Parameters<typeof canPerformAction>[1];
  fallback?: ReactNode;
}

export function RoleGate({ children, allowedRoles, action, fallback = null }: RoleGateProps) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return null; // Or a skeleton if we want, but usually null is safer for gates
  }

  const userRole = session?.user?.role as Role | undefined;

  let hasAccess = false;

  if (action) {
    hasAccess = canPerformAction(userRole, action);
  } else if (allowedRoles) {
    hasAccess = !!userRole && allowedRoles.includes(userRole);
  }

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
