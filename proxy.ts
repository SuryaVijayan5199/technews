import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export async function proxy(req: any) {
  const host = req.headers.get("host") || "";
  
  // Automatically redirect any old temporary Vercel preview URLs to canonical production domain
  if (
    host.includes("surya-vijayans-projects.vercel.app") ||
    (host.startsWith("technews-") && !host.includes("technews-lyart"))
  ) {
    const targetUrl = new URL(
      req.nextUrl.pathname + req.nextUrl.search,
      "https://technews-lyart.vercel.app"
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
