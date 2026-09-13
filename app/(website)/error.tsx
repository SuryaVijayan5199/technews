"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, ArrowLeft } from "lucide-react";
import { TechCrestIcon } from "@/components/shared/techcrest-icon";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Website page error:", error);
  }, [error]);

  return (
    <div className="tc-page min-h-[70vh] flex items-center justify-center py-16 px-4">
      <div className="tc-wrap max-w-xl text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 mb-6">
          <TechCrestIcon size={36} color="#F59E0B" />
        </div>

        <span className="tc-tag block w-max mx-auto mb-3 text-amber-400 border-amber-500/30">
          TEMPORARY SERVICE INTERRUPTED
        </span>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
          Unable to Load This Page
        </h1>

        <p className="text-muted-foreground text-sm sm:text-base mb-8 max-w-md mx-auto">
          We encountered a temporary issue while fetching story data. Please reload or return to the homepage.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="tc-read-btn text-sm px-5 py-2.5 rounded-xl bg-[var(--color-brand)] text-white hover:opacity-90 transition-opacity inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Reload Page
          </button>
          <Link
            href="/"
            className="tc-read-btn text-sm px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
