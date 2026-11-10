import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { TechCrestHomepage } from "@/components/home/techcrest-homepage";

// Dynamic rendering: Eliminates all Vercel ISR writes ($0 cost, 0 writes).
// Fast in-memory RAM cache (LISTING_TTL_MS = 60s) protects Neon DB and responds in ~3ms.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
};

export default function HomePage() {
  return <TechCrestHomepage />;
}

