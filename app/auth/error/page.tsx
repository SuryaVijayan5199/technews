import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthErrorCard } from "./error-card";

export const metadata: Metadata = {
  title: "Authentication Error — TechCrest",
  description: "An error occurred during authentication. Please try again.",
};

export default function AuthErrorPage() {
  return (
    <div className="login-page-v2">
      <div className="login-page-v2__glow-1" />
      <div className="login-page-v2__glow-2" />

      <div className="login-card-v2" style={{ maxWidth: "480px" }}>
        <Suspense fallback={<div style={{ textAlign: "center", padding: "2rem" }}>Loading error details...</div>}>
          <AuthErrorCard />
        </Suspense>
      </div>
    </div>
  );
}
