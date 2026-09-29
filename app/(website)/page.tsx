import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { TechCrestHomepage } from "@/components/home/techcrest-homepage";

// ISR: revalidate every 60 seconds — reduces Vercel CPU + Neon DB wakeups.
// Manual invalidation still works instantly via invalidateArticleCache → revalidatePath.
export const revalidate = 60;

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
};

export default function HomePage() {
  return <TechCrestHomepage />;
}

