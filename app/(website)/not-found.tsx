import Link from "next/link";
import { ArrowLeft, Search, Smartphone, Brain, Shield, Zap } from "lucide-react";
import { TechCrestIcon } from "@/components/shared/techcrest-icon";

export default function NotFound() {
  return (
    <div className="tc-page min-h-[75vh] flex items-center justify-center py-16 px-4">
      <div className="tc-wrap max-w-2xl text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[hsl(var(--color-brand-500)/0.1)] text-[hsl(var(--color-brand-400))] mb-6">
          <TechCrestIcon size={36} color="#2D7FF9" />
        </div>

        <span className="tc-tag block w-max mx-auto mb-3">ERROR 404 &bull; PAGE NOT FOUND</span>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
          This Story Is Missing or Relocated
        </h1>

        <p className="text-muted-foreground text-base sm:text-lg mb-8 max-w-lg mx-auto">
          The article or page you are looking for may have been archived, renamed, or is currently in draft review.
        </p>

        {/* Search & Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <Link
            href="/"
            className="tc-read-btn text-base px-6 py-3 rounded-xl bg-[hsl(var(--color-brand-500))] text-white hover:opacity-90 transition-opacity inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to TechCrest Home
          </Link>
          <Link
            href="/search"
            className="tc-read-btn text-base px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors inline-flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Search Articles
          </Link>
        </div>

        {/* Popular Topic Quick Links */}
        <div className="border-t border-white/10 pt-8">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-4">
            Explore Popular Topics
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/phone" className="tc-tag hover:border-[hsl(var(--color-brand-500))] transition-colors inline-flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-sky-400" /> Phone
            </Link>
            <Link href="/ai" className="tc-tag hover:border-[hsl(var(--color-brand-500))] transition-colors inline-flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5 text-purple-400" /> AI
            </Link>
            <Link href="/security" className="tc-tag hover:border-[hsl(var(--color-brand-500))] transition-colors inline-flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-400" /> Security
            </Link>
            <Link href="/evs" className="tc-tag hover:border-[hsl(var(--color-brand-500))] transition-colors inline-flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-400" /> EVs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
