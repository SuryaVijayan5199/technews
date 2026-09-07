import type { Metadata } from "next";
import Link from "next/link";
import { Zap } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";
import { TechCrestBrand } from "@/components/shared/techcrest-brand";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Sign In — TechCrest",
  description:
    "Sign in to your TechCrest account to bookmark articles, join the community discussion, and access the CMS dashboard.",
};

export default function LoginPage() {
  return (
    <div className="login-page-v2">
      {/* Glow Orbs */}
      <div className="login-page-v2__glow-1" />
      <div className="login-page-v2__glow-2" />

      <div className="login-card-v2">
        {/* Header & Logo */}
        <div className="login-card-v2__header">
          <div className="tc-login-logo-wrap">
            <TechCrestBrand size="md" href="/" />
          </div>

          <h1 className="login-card-v2__title">Welcome Back</h1>
          <p className="login-card-v2__subtitle">
            Sign in to access your TechCrest profile, CMS dashboard, and saved stories.
          </p>
        </div>

        {/* Dynamic Form */}
        <Suspense
          fallback={
            <div style={{ padding: "2rem 0", textAlign: "center", fontSize: "0.875rem", color: "hsl(var(--color-text-muted))" }}>
              Loading sign in options...
            </div>
          }
        >
          <LoginForm />
        </Suspense>

        {/* Footer */}
        <div className="login-card-v2__footer">
          By signing in, you agree to our{" "}
          <Link href="/terms">Terms of Service</Link> and{" "}
          <Link href="/privacy">Privacy Policy</Link>.
        </div>
      </div>
    </div>
  );
}
