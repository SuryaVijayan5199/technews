import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Google from "next-auth/providers/google";
import { db } from "@/lib/db";
import { authConfig } from "@/lib/auth.config";
import {
  users,
  accounts,
  sessions,
  verificationTokens,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { DefaultSession } from "next-auth";

import { isSuperAdminEmail } from "@/config/site";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }
  interface User {
    role?: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  trustHost: true,
  secret: (process.env.AUTH_SECRET || "").trim(),

  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  providers: [
    // ── Google OAuth (Primary Social Login for all roles) ──────
    Google({
      clientId: (process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID || "").trim(),
      clientSecret: (process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET || "").trim(),
      allowDangerousEmailAccountLinking: true,
    }),
  ],

  events: {
    // When a new user signs in via Google, assign super_admin role if matching owner email
    async createUser({ user }) {
      if (!user.id || !user.email) return;

      if (isSuperAdminEmail(user.email)) {
        try {
          await db
            .update(users)
            .set({ role: "super_admin" })
            .where(eq(users.id, user.id));
        } catch (err) {
          console.error("[createUser] Failed to set super_admin role:", err);
        }
      }
    },
  },

  callbacks: {
    ...authConfig.callbacks,

    // On every sign-in, ensure super_admin role is allocated if email matches
    async signIn({ user }) {
      if (isSuperAdminEmail(user?.email)) {
        try {
          const existing = await db.query.users.findFirst({
            where: eq(users.email, user.email!.toLowerCase()),
          });
          if (existing && existing.role !== "super_admin") {
            await db
              .update(users)
              .set({ role: "super_admin" })
              .where(eq(users.id, existing.id));
          }
        } catch (err) {
          console.error("[signIn] Super admin role check failed:", err);
        }
      }
      return true;
    },

    // Refresh role from DB on every JWT call so role changes take effect immediately
    async jwt({ token, user }) {
      // Attach user ID on first sign-in
      if (user?.id) {
        token.id = user.id;
      }

      // Super admin is always super_admin — no DB lookup needed
      if (isSuperAdminEmail(token.email)) {
        token.role = "super_admin";
        return token;
      }

      // Attach user role on sign-in or reuse existing token.role without querying DB on every session poll
      if (user) {
        token.role = (user as any).role ?? "subscriber";
      } else if (token.id && !token.role) {
        try {
          const dbUser = await db.query.users.findFirst({
            where: eq(users.id, token.id as string),
          });
          if (dbUser) {
            token.role = dbUser.role;
          }
        } catch {
          // Keep existing token.role if DB lookup fails
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) ?? "subscriber";
        // Hard-enforce super_admin on session level for owner email
        if (isSuperAdminEmail(session.user.email)) {
          session.user.role = "super_admin";
        }
      }
      return session;
    },
  },
});
