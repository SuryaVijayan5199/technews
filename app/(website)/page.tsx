import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { TechCrestHomepage } from "@/components/home/techcrest-homepage";

// ISR: revalidate every 5 minutes (300 seconds) — drastically reduces Vercel CPU + Neon DB wakeups.
// Manual invalidation still works instantly via invalidateArticleCache → revalidatePath.
export const revalidate = 300;

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
};

export default function HomePage() {
  return <TechCrestHomepage />;
}

