import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export async function proxy(req: any) {
  const host = req.headers.get("host") || "";

  // Canonical production domain from env — works across any Vercel account/domain
  const canonicalUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const canonicalHost = canonicalUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");

  // Redirect any temporary Vercel preview/deploy URLs to the canonical production domain.
  // Only fires if NEXT_PUBLIC_SITE_URL is set and the current host is a different Vercel subdomain.
  if (
    !req.nextUrl.pathname.startsWith("/api") &&
    canonicalHost &&
    host !== canonicalHost &&
    (host.endsWith(".vercel.app") || host.includes("vercel.app"))
  ) {
    const targetUrl = new URL(
      req.nextUrl.pathname + req.nextUrl.search,
      canonicalUrl
    );
    return NextResponse.redirect(targetUrl, 301);
  }

  const pathname = req.nextUrl.pathname;
  // Only invoke NextAuth session middleware on protected routes
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/saved")
  ) {
    return (auth as any)(req);
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
