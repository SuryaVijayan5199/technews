"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import {
  Mail,
  Lock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showStaffLogin, setShowStaffLogin] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(() => {
    if (!urlError) return null;
    if (urlError === "OAuthSignin") return "Mobile browser redirect interrupted. You can retry Google Sign-In or continue below.";
    if (urlError === "OAuthCallbackError") return "Google Sign-In was interrupted. Please retry or continue as Reader.";
    if (urlError === "OAuthAccountNotLinked") return "This email is linked to another sign-in provider.";
    return "Authentication failed. Please try again.";
  });
  const [success, setSuccess] = useState<string | null>(null);

  // ── Google Sign In (primary path for all users) ──────────────
  const handleGoogleSignIn = async () => {
    setError(null);
    setSuccess(null);
    setLoadingProvider("google");
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch {
      setError("Failed to connect to Google. Please try again.");
      setLoadingProvider(null);
    }
  };

  // ── Quick Reader Guest Access (for mobile app fallback) ──────
  const handleGuestReaderAccess = () => {
    setSuccess("Access Granted! Welcome to TechCrest.");
    setTimeout(() => {
      router.push("/");
      router.refresh();
    }, 400);
  };

  // ── Staff Email/Password Login (secondary) ───────────────────
  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setError(null);
    setSuccess(null);
    setLoadingProvider("credentials");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid credentials or account not found. Staff accounts require assignment by Super Admin.");
      setLoadingProvider(null);
      return;
    }

    setSuccess("Authenticated! Redirecting...");

    // Fetch real role from DB via session
    const session = await getSession();
    const role = (session?.user as any)?.role ?? "subscriber";

    let destination = "/profile";
    if (role === "super_admin") destination = "/dashboard";
    else if (["editor", "author", "managing_editor", "publisher", "reviewer", "contributor"].includes(role))
      destination = "/dashboard/articles";

    setTimeout(() => {
      router.push(destination);
      router.refresh();
    }, 500);
  };

  return (
    <div style={{ width: "100%" }}>

      {/* Error / Success Banners */}
      {error && (
        <div style={{
          display: "flex", alignItems: "flex-start", gap: "0.625rem",
          padding: "0.875rem 1rem", borderRadius: "12px",
          backgroundColor: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
          color: "#ef4444", fontSize: "0.875rem", fontWeight: 500, marginBottom: "1.25rem",
        }}>
          <AlertCircle style={{ width: 16, height: 16, flexShrink: 0, marginTop: 2 }} />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div style={{
          display: "flex", alignItems: "center", gap: "0.625rem",
          padding: "0.875rem 1rem", borderRadius: "12px",
          backgroundColor: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)",
          color: "#10b981", fontSize: "0.875rem", fontWeight: 500, marginBottom: "1.25rem",
        }}>
          <CheckCircle2 style={{ width: 16, height: 16, flexShrink: 0 }} />
          <span>{success}</span>
        </div>
      )}

      {/* ── Google Sign In Button (Primary) ── */}
      <button
        type="button"
        id="google-signin-btn"
        onClick={handleGoogleSignIn}
        disabled={!!loadingProvider}
        className="oauth-btn-v2"
      >
        {loadingProvider === "google" ? (
          <Loader2 style={{ width: 20, height: 20, animation: "spin 1s linear infinite" }} />
        ) : (
          <svg style={{ width: 20, height: 20, flexShrink: 0 }} viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
        )}
        <span>Continue with Google</span>
      </button>

      {/* Role clarification note */}
      <p style={{
        textAlign: "center", fontSize: "0.8rem", color: "var(--color-text-muted)",
        marginTop: "0.875rem", lineHeight: 1.6,
      }}>
        Users sign in with Google · Editors &amp; Admins are assigned by the platform owner
      </p>

      {/* ── Staff Login Toggle ── */}
      {!showStaffLogin ? (
        <button
          type="button"
          onClick={() => setShowStaffLogin(true)}
          style={{
            display: "block", width: "100%", textAlign: "center",
            marginTop: "1.5rem", fontSize: "0.8125rem", color: "var(--color-text-muted)",
            background: "none", border: "none", cursor: "pointer",
            textDecoration: "underline", textUnderlineOffset: "3px",
          }}
        >
          Staff / Editor login
        </button>
      ) : (
        <>
          <div className="login-divider-v2" style={{ marginTop: "1.5rem" }}>
            <div className="login-divider-v2__line" />
            <span className="login-divider-v2__text">Staff login</span>
            <div className="login-divider-v2__line" />
          </div>

          <form onSubmit={handleStaffLogin} style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="input-group-v2">
              <label htmlFor="staff-email" className="input-label-v2">Work Email</label>
              <div className="input-field-wrap-v2">
                <Mail className="input-icon-v2" />
                <input
                  id="staff-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  required
                  className="input-field-v2"
                />
              </div>
            </div>

            <div className="input-group-v2">
              <label htmlFor="staff-password" className="input-label-v2">Password</label>
              <div className="input-field-wrap-v2">
                <Lock className="input-icon-v2" />
                <input
                  id="staff-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="input-field-v2"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!!loadingProvider}
              className="btn-primary-v2"
            >
              {loadingProvider === "credentials" ? (
                <><Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} /> Signing in...</>
              ) : (
                <>Sign In <ArrowRight style={{ width: 16, height: 16 }} /></>
              )}
            </button>

            <button
              type="button"
              onClick={() => { setShowStaffLogin(false); setError(null); }}
              style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", background: "none", border: "none", cursor: "pointer", textAlign: "center" }}
            >
              ← Back to Google sign in
            </button>
          </form>
        </>
      )}
    </div>
  );
}
