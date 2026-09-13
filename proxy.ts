import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export async function proxy(req: any) {
  const rawHost = req.headers.get("host") || "";
  // Normalize: strip port and lowercase to avoid false mismatch
  const host = rawHost.split(":")[0].toLowerCase();

  // Canonical production domain from env — works across any Vercel account/domain
  const canonicalUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const canonicalHost = canonicalUrl
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "")
    .split(":")[0]
    .toLowerCase();

  // Redirect Vercel preview/deploy URLs to canonical domain only when:
  // 1. canonicalHost is set
  // 2. Current host is a .vercel.app subdomain (preview URL)
  // 3. Canonical domain is NOT itself a .vercel.app domain (avoid self-redirect)
  // 4. Hosts actually differ
  if (
    !req.nextUrl.pathname.startsWith("/api") &&
    canonicalHost &&
    !canonicalHost.endsWith(".vercel.app") &&
    host !== canonicalHost &&
    host.endsWith(".vercel.app")
  ) {
    const targetUrl = new URL(
      req.nextUrl.pathname + req.nextUrl.search,
      canonicalUrl
    );
    // Use 308 (Permanent Redirect, method-preserving) instead of 301
    return NextResponse.redirect(targetUrl, 308);
  }

  const pathname = req.nextUrl.pathname;
  // Only invoke NextAuth session middleware on protected routes
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/profile")
  ) {
    return (auth as any)(req);
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
