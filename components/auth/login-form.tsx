"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export function LoginForm() {
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(() => {
    if (!urlError) return null;
    if (urlError === "OAuthSignin") return "Google sign-in connection was interrupted. Please try again.";
    if (urlError === "OAuthCallbackError") return "Google Sign-In callback error. Please retry below.";
    if (urlError === "OAuthAccountNotLinked") return "This email is associated with another account format.";
    return "Authentication failed. Please try again.";
  });
  const [success, setSuccess] = useState<string | null>(null);

  // ── Single Social Sign-In via Google ──────────────────────────
  const handleGoogleSignIn = async () => {
    setError(null);
    setSuccess(null);
    setLoadingProvider("google");
    try {
      await signIn("google", { callbackUrl });
    } catch (err: any) {
      console.error("[GoogleSignIn] Error:", err);
      setError("Failed to connect to Google. Please check your connection and retry.");
      setLoadingProvider(null);
    }
  };

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Status Banners */}
      {error && (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "0.625rem",
            padding: "0.875rem 1rem",
            borderRadius: "12px",
            backgroundColor: "rgba(239, 68, 68, 0.08)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            color: "#ef4444",
            fontSize: "0.875rem",
            fontWeight: 500,
          }}
        >
          <AlertCircle style={{ width: 16, height: 16, flexShrink: 0, marginTop: 2 }} />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.625rem",
            padding: "0.875rem 1rem",
            borderRadius: "12px",
            backgroundColor: "rgba(16, 185, 129, 0.08)",
            border: "1px solid rgba(16, 185, 129, 0.2)",
            color: "#10b981",
            fontSize: "0.875rem",
            fontWeight: 500,
          }}
        >
          <CheckCircle2 style={{ width: 16, height: 16, flexShrink: 0 }} />
          <span>{success}</span>
        </div>
      )}

      {/* ── Primary Google OAuth Button ── */}
      <button
        type="button"
        id="google-signin-btn"
        onClick={handleGoogleSignIn}
        disabled={!!loadingProvider}
        className="oauth-btn-v2"
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.75rem",
          padding: "0.875rem 1.25rem",
          fontSize: "1rem",
          fontWeight: 600,
          cursor: loadingProvider ? "not-allowed" : "pointer",
        }}
      >
        {loadingProvider === "google" ? (
          <Loader2 style={{ width: 22, height: 22, animation: "spin 1s linear infinite" }} />
        ) : (
          <svg style={{ width: 22, height: 22, flexShrink: 0 }} viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        )}
        <span>Sign in with Google</span>
      </button>
    </div>
  );
}
