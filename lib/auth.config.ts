/**
 * auth.config.ts — Edge-compatible auth configuration (NO database adapter).
 * Used by middleware/proxy which runs on the Edge runtime.
 * The full auth.ts (with DrizzleAdapter) is used everywhere else.
 */
import type { NextAuthConfig } from "next-auth";
import { canAccessRoute } from "@/lib/permissions";

import { isSuperAdminEmail } from "@/config/site";

const STAFF_ROLES = [
  "super_admin",
  "publisher",
  "managing_editor",
  "editor",
  "author",
  "reviewer",
  "contributor",
];

function getPostLoginDestination(role: string | undefined): string {
  if (!role) return "/profile";
  if (role === "super_admin") return "/dashboard";
  if (STAFF_ROLES.includes(role) && role !== "subscriber") return "/dashboard/articles";
  return "/profile";
}

export const authConfig: NextAuthConfig = {
  trustHost: true,
  secret: (process.env.AUTH_SECRET || "9f8a4b2c1d3e5f7a9b0c2d4e6f8a1b3c5d7e9f0a2b4c6d8e0f1a3b5c7d9e1f2a").trim(),
  pages: {
    signIn: "/login",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
  },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role ?? "subscriber";
      }
      // Super admin is always super_admin regardless of DB state read at edge
      if (isSuperAdminEmail(token.email)) {
        token.role = "super_admin";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) ?? "subscriber";
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = auth?.user?.role ?? "subscriber";
      const pathname = nextUrl.pathname;

      // ── Protect /profile — must be logged in
      if (pathname.startsWith("/profile")) {
        if (!isLoggedIn) {
          return Response.redirect(new URL(`/login?callbackUrl=/profile`, nextUrl));
        }
        return true;
      }

      // ── Protect /dashboard — must be logged in + have access
      if (pathname.startsWith("/dashboard")) {
        if (!isLoggedIn) {
          return Response.redirect(new URL(`/login?callbackUrl=${pathname}`, nextUrl));
        }
        const hasAccess = canAccessRoute(role, pathname);
        if (!hasAccess) {
          // Subscribers trying to access dashboard → send to their profile
          return Response.redirect(new URL("/profile", nextUrl));
        }
        return true;
      }

      return true;
    },
  },
};
