"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, ArrowLeft, LogIn, RefreshCw, Zap } from "lucide-react";
import { signIn } from "next-auth/react";

const ERROR_MESSAGES: Record<string, { title: string; detail: string }> = {
  OAuthSignin: {
    title: "OAuth Sign-In Error",
    detail: "Could not construct an OAuth sign-in URL. Please check your connection or try signing in with credentials.",
  },
  OAuthCallbackError: {
    title: "Google Callback Error",
    detail: "An error occurred while completing authentication with Google. This often happens if the request timed out or host headers mismatch.",
  },
  OAuthCreateAccount: {
    title: "Account Creation Failed",
    detail: "Could not create user account from Google profile details. Please try direct email sign-in.",
  },
  EmailCreateAccount: {
    title: "Email Account Creation Failed",
    detail: "Could not create account with the provided email address.",
  },
  Callback: {
    title: "Authentication Callback Error",
    detail: "The authentication callback failed. Please check credentials and try again.",
  },
  OAuthAccountNotLinked: {
    title: "Account Already Exists",
    detail: "To confirm your identity, please sign in using the same method (Email/Password) you used originally.",
  },
  EmailSignin: {
    title: "Verification Email Failed",
    detail: "The sign-in link could not be sent. Please verify your email address.",
  },
  CredentialsSignin: {
    title: "Sign-In Failed",
    detail: "Check the details you provided and try again.",
  },
  SessionRequired: {
    title: "Authentication Required",
    detail: "Please sign in to access this page.",
  },
  Default: {
    title: "Authentication Error",
    detail: "An unexpected error occurred during sign-in. Please try again or use direct email sign-in.",
  },
};

export function AuthErrorCard() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("error") || "Default";
  const errorInfo = ERROR_MESSAGES[errorCode] || ERROR_MESSAGES.Default;

  return (
    <>
      <div className="login-card-v2__header">
        <Link href="/" className="login-card-v2__logo-link">
          <div className="login-card-v2__logo-icon" style={{ backgroundColor: "#ef4444" }}>
            <AlertTriangle className="tc-auth-error-icon" />
          </div>
          <span className="login-card-v2__logo-text">
            Tech<span style={{ color: "hsl(var(--color-brand-500))" }}>.io</span>
          </span>
        </Link>

        <h1 className="login-card-v2__title" style={{ color: "#ef4444", fontSize: "1.5rem" }}>
          {errorInfo.title}
        </h1>
        <p className="login-card-v2__subtitle" style={{ fontSize: "0.9375rem", lineHeight: 1.5 }}>
          {errorInfo.detail}
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1.5rem" }}>
        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="btn-primary-v2"
          style={{ width: "100%", justifyContent: "center" }}
        >
          <RefreshCw style={{ width: "18px", height: "18px" }} />
          Retry Google Sign In
        </button>

        <Link
          href="/login"
          className="oauth-btn-v2"
          style={{ width: "100%", justifyContent: "center", textDecoration: "none" }}
        >
          <LogIn style={{ width: "18px", height: "18px" }} />
          Sign in with Email / Password
        </Link>

        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            color: "hsl(var(--color-text-muted))",
            fontSize: "0.875rem",
            textDecoration: "none",
            marginTop: "0.75rem",
            padding: "0.5rem",
          }}
        >
          <ArrowLeft style={{ width: "16px", height: "16px" }} />
          Return to Homepage
        </Link>
      </div>
    </>
  );
}
