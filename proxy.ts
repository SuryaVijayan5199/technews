import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export const proxy = auth((req) => {
  const host = req.headers.get("host") || "";
  
  // Automatically redirect any old temporary Vercel preview URLs (e.g., technews-9j0fbu843...) to canonical production domain
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
});

export const middleware = proxy;

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
