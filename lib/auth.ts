import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
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

const SUPER_ADMIN_EMAIL = "suryashc5199@gmail.com";

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
  secret:
    process.env.AUTH_SECRET ||
    "9f8a4b2c1d3e5f7a9b0c2d4e6f8a1b3c5d7e9f0a2b4c6d8e0f1a3b5c7d9e1f2a",

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
    // ── Google OAuth (primary for all 3 roles) ─────────────────
    Google({
      clientId: (
        process.env.AUTH_GOOGLE_ID ||
        process.env.GOOGLE_CLIENT_ID ||
        "330344440313-pdscq9g5fv7vdss0ac264gmo2un1fdmj.apps.googleusercontent.com"
      ).trim(),
      clientSecret: (
        process.env.AUTH_GOOGLE_SECRET ||
        process.env.GOOGLE_CLIENT_SECRET ||
        "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"
      ).trim(),
      allowDangerousEmailAccountLinking: true,
    }),

    // ── Credentials (fallback for staff who prefer email login) ─
    Credentials({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        const email = (credentials.email as string).toLowerCase().trim();

        // Only look up existing DB users — no auto-creation
        const dbUser = await db.query.users.findFirst({
          where: eq(users.email, email),
        });

        if (!dbUser) return null;

        // Super admin can always sign in; other staff (editors etc.) can too
        // Regular subscribers (role = "subscriber") cannot use credentials login
        const staffRoles = ["super_admin", "publisher", "managing_editor", "editor", "author", "reviewer", "contributor"];
        if (!staffRoles.includes(dbUser.role)) {
          return null; // Subscribers must use Google
        }

        return {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name,
          image: dbUser.image,
          role: dbUser.role,
        };
      },
    }),
  ],

  events: {
    // When a new Google user is created, ensure super_admin email gets the right role
    async createUser({ user }) {
      if (!user.id || !user.email) return;
      const email = user.email.toLowerCase();

      if (email === SUPER_ADMIN_EMAIL.toLowerCase()) {
        try {
          await db
            .update(users)
            .set({ role: "super_admin" })
            .where(eq(users.id, user.id));
        } catch (err) {
          console.error("[createUser] Failed to set super_admin role:", err);
        }
      }
      // All other new Google users are created as "subscriber" (DB default)
    },
  },

  callbacks: {
    ...authConfig.callbacks,

    // On every sign-in, ensure super_admin role is correctly set if it drifted
    async signIn({ user }) {
      if (user?.email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
        try {
          const existing = await db.query.users.findFirst({
            where: eq(users.email, user.email.toLowerCase()),
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
      if (token.email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
        token.role = "super_admin";
        return token;
      }

      // For all others, fetch latest role from DB
      if (token.id) {
        try {
          const dbUser = await db.query.users.findFirst({
            where: eq(users.id, token.id as string),
          });
          if (dbUser) {
            token.role = dbUser.role;
          }
        } catch {
          // Keep existing token.role if DB lookup fails (network issue etc.)
        }
      } else if (user) {
        token.role = (user as any).role ?? "subscriber";
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) ?? "subscriber";
        // Hard-enforce super_admin on session level
        if (session.user.email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
          session.user.role = "super_admin";
        }
      }
      return session;
    },
  },
});
